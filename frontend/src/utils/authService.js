import api from './api';
// import { supabase } from './supabase'; // REMOVED


class AuthService {
  // Default admin credentials
  defaultAdminEmail = 'agrolandadmin7777@gmail.com';
  defaultAdminPassword = 'Admin@7777';

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const response = await api.post('/auth/signin', { email, password });

      // Store token on success
      if (response.success && response.data?.session?.access_token) {
        localStorage.setItem('auth_token', response.data.session.access_token);
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'Login failed',
        requiresVerification: error.data?.requiresVerification,
        email: error.data?.email
      };
    }
  }

  // Sign in with OAuth (Google, etc.) - REPLACED with custom backend call
  async signInWithGoogle(token, role = null, phone = null) {
    try {
      const response = await api.post('/auth/google', { token, role, phone });

      if (response.success && response.data?.session?.access_token) {
        localStorage.setItem('auth_token', response.data.session.access_token);
      }

      return response;
    } catch (error) {
      console.error("Google Auth API Error:", error);
      return { success: false, error: 'Google Login Failed' };
    }
  }

  // Deprecated Supabase OAuth
  async signInWithOAuth(provider) {
    // Not used for Google anymore
    return { success: false, error: 'Use signInWithGoogle instead' };
  }

  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const payload = {
        email,
        password,
        ...userData
      };

      const response = await api.post('/auth/signup', payload);

      if (response.success && response.data?.session?.access_token) {
        localStorage.setItem('auth_token', response.data.session.access_token);
      }

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'Signup failed',
        requiresVerification: error.data?.requiresVerification,
        email: error.data?.email
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userRole');
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign out' };
    }
  }

  // Get current session
  async getSession() {
    // Mock session from local token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Decode token to get user ID if possible, or just return success
      // Ideally verify token with backend
      // returning a mocked structure to keep AuthContext happy
      return {
        success: true,
        data: { session: { access_token: token, user: { email: 'user@example.com' } } } // User details should be fetched via getProfile
      };
    }
    return { success: false, data: { session: null } };
  }

  // Get user profile
  async getUserProfile(userId) {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    try {
      // Fetch from Mongo API
      const response = await api.get(`/users/${userId}`);

      // If profile not found, we might want to create one from Auth metadata if possible? 
      // But usually fetch returns 404 which throws error in axios interceptor?
      // Our api interceptor rejects promise on error.

      return response; // { success: true, data: user }
    } catch (error) {
      // If 404 (Not Found), try to create one if we have the current session?
      // This logic was in the old service. Can we replicate it?
      if (error.status === 404) {
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser?.user && authUser.user.id === userId) {
          // Auto-create profile in Mongo
          const profileData = {
            id: authUser.user.id,
            email: authUser.user.email,
            full_name: authUser.user.user_metadata?.full_name || authUser.user.email?.split('@')[0] || 'User',
            role: authUser.user.user_metadata?.role || 'buyer',
            phone: authUser.user.user_metadata?.mobile || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          try {
            const createResponse = await api.post('/users', profileData);
            return createResponse;
          } catch (e) {
            return { success: false, error: 'Failed to auto-create profile' };
          }
        }
      }

      console.error('Error fetching user profile:', error);
      return { success: false, error: 'Failed to load user profile' };
    }
  }

  // Get current session
  async getSession() {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return { data: { session: null }, error: null };

      // Try to get current user info to verify token
      const response = await api.get('/auth/me').catch(() => null);

      if (response && response.success) {
        return { data: { session: { user: response.data, access_token: token } }, error: null };
      }

      // If /auth/me fails (invalid token), clear it
      // localStorage.removeItem('auth_token'); // maybe too aggressive here?
      return { data: { session: null }, error: null };
    } catch (error) {
      return { data: { session: null }, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userRole');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      // Use the correct API endpoint
      const response = await api.put(`/users/${userId}`, updates);
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  }

  // Create user profile (admin)
  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  // Delete user profile (admin)
  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      return { success: false, error: 'Failed to delete user' };
    }
  }

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      return { success: false, error: 'Failed to load users' };
    }
  }

  // Update user role (admin only)
  async updateUserRole(userId, newRole) {
    try {
      const response = await api.put(`/users/${userId}`, { role: newRole });
      return response;
    } catch (error) {
      console.error('Error updating role:', error);
      return { success: false, error: 'Failed to update user role' };
    }
  }

  // Verify Signup OTP
  async verifySignup(email, otp) {
    try {
      const response = await api.post('/auth/verify-signup', { email, otp });
      if (response.success && response.data?.session?.access_token) {
        localStorage.setItem('auth_token', response.data.session.access_token);
      }
      return response;
    } catch (error) {
      console.error('Verify Signup error:', error);
      return { success: false, error: error.message || 'Verification failed' };
    }
  }

  // Reset password - Step 1: Send OTP
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  }

  // Verify OTP - Step 2
  async verifyOTP(email, otp) {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response;
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message || 'Invalid or expired OTP' };
    }
  }

  // Reset password - Step 3: Change password
  async resetPassword(email, otp, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { email, otp, newPassword });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  }

  // Update password (for logged in users - placeholder for now to match interface)
  async updatePassword(newPassword) {
    console.warn("Update password for logged in users not implemented in backend yet");
    return { success: false, error: "Feature not available yet" };
  }

  // Listen to auth state changes (Mock)
  onAuthStateChange(callback) {
    // Since we use localStorage, we can emit an 'INITIAL_SESSION' event immediately if token exists
    const token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('userProfile');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Simulate initial session found event
        setTimeout(() => {
          callback('INITIAL_SESSION', { user, access_token: token });
        }, 0);
      } catch (e) { }
    }

    // Return a dummy subscription
    return { data: { subscription: { unsubscribe: () => { } } } };
  }
}

export default new AuthService();
