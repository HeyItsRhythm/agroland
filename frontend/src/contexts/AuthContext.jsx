import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../utils/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check for active session immediately
    const initSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await authService.getSession();

        if (sessionError) {
          console.error("Session check error:", sessionError);
          // If session check fails completely, just stop loading.
        }

        if (isMounted && session?.user) {
          console.log("Restoring session:", session.user.email);
          setUser(session.user);

          // Restore profile if available locally first
          const storedProfile = localStorage.getItem('userProfile');
          if (storedProfile) {
            try {
              setUserProfile(JSON.parse(storedProfile));
            } catch (e) { }
          }

          // Fetch fresh profile
          try {
            const result = await authService.getUserProfile(session.user.id);
            if (isMounted && result.success) {
              setUserProfile(result.data);
              localStorage.setItem('userProfile', JSON.stringify(result.data));
              if (result.data?.role) {
                localStorage.setItem('userRole', result.data.role);
              }
            } else {
              // If fetching profile fails but user is logged in, this is a dangerous state.
              // It might be because the database is migrated/empty but the auth session persists in browser.
              console.warn("Failed to fetch user profile for active session:", result?.error);
              if (result?.error?.includes("Cannot connect to database") || result?.error?.includes("Failed to fetch")) {
                // Critical DB error, maybe force logout to unblock UI if it depends on profile
                console.log("Critical DB error during profile fetch. Clearing potentially stale session to unblock UI.");
                await authService.signOut();
                setUser(null);
                setUserProfile(null);
                localStorage.removeItem('userProfile');
                localStorage.removeItem('userRole');
              }
            }
          } catch (profileErr) {
            console.error("Exception fetching profile:", profileErr);
          }
        }
      } catch (err) {
        console.error("Session init error:", err);
      } finally {
        // Ensure loading is set to false even if onAuthStateChange doesn't fire immediately
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    // Use onAuthStateChange to handle updates
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      console.log(`Auth event: ${event}`, session?.user?.email);

      if (!isMounted) return;

      if (event === 'INITIAL_SESSION') {
        // Handled by initSession primarily, but good fallback
      }

      // Handle Session Updates
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      }

      if (session?.user) {
        setUser(session.user);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
          // We might re-fetch profile here just to be sure
          if (!userProfile) { // optimizing to avoid double fetch if initSession did it
            const storedProfile = localStorage.getItem('userProfile');
            if (storedProfile) {
              try { setUserProfile(JSON.parse(storedProfile)); } catch (e) { }
            }
            const profileResult = await authService.getUserProfile(session.user.id);
            if (profileResult?.success && isMounted) {
              setUserProfile(profileResult.data);
              localStorage.setItem('userProfile', JSON.stringify(profileResult.data));
              if (profileResult.data?.role) localStorage.setItem('userRole', profileResult.data.role);
            }
          }
        }
      } else {
        // No session
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserProfile(null);
          localStorage.removeItem('userProfile');
          localStorage.removeItem('userRole');
        }
        if (!session) {
          setUser(null);
        }
      }

      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      const result = await authService.signIn(email, password);

      if (!result?.success) {
        setAuthError(result?.error || "Login failed");
        return {
          success: false,
          error: result?.error,
          requiresVerification: result?.requiresVerification,
          email: result?.email
        };
      }

      // Set user from the result
      if (result.data?.user) {
        setUser(result.data.user);

        // Fetch user profile
        const profileResult = await authService.getUserProfile(result.data.user.id);
        if (profileResult?.success) {
          setUserProfile(profileResult.data);
        }
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during login. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign in error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Sign in with Google function
  const signInWithGoogle = async (token, role = null, phone = null) => {
    try {
      setAuthError(null);
      const result = await authService.signInWithGoogle(token, role, phone);

      if (!result?.success) {
        if (result?.requiresRole) {
          return result; // Pass through to show role modal
        }
        setAuthError(result?.error || "Google login failed");
        return { success: false, error: result?.error };
      }

      // Set user from the result
      if (result.data?.user) {
        // Map user data to handle field consistency (id vs _id)
        const userData = {
          ...result.data.user,
          id: result.data.user.id || result.data.user._id
        };
        setUser(userData);
        setUserProfile(userData);
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during Google login. Please try again.";
      setAuthError(errorMsg);
      console.log("Google sign in error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Sign in with OAuth function

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setAuthError(null);
      const result = await authService.signUp(email, password, userData);

      if (!result?.success) {
        setAuthError(result?.error || "Signup failed");
        return {
          success: false,
          error: result?.error,
          requiresVerification: result?.requiresVerification,
          email: result?.email
        };
      }

      if (result.requiresVerification) {
        return {
          success: true,
          requiresVerification: true,
          message: "Registration successful! Please verify your email with the OTP sent.",
          email: result.email
        };
      }

      // Check if email confirmation is required
      if (result.data?.user && !result.data?.session) {
        return {
          success: true,
          data: result.data,
          message: "Registration successful! Please check your email to confirm your account."
        };
      }

      // If auto-confirmed, set the user
      if (result.data?.user) {
        setUser(result.data.user);

        // Fetch or create user profile
        const profileResult = await authService.getUserProfile(result.data.user.id);
        if (profileResult?.success) {
          setUserProfile(profileResult.data);
        }
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during signup. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign up error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setAuthError(null);
      const result = await authService.signOut();

      if (!result?.success) {
        setAuthError(result?.error || "Logout failed");
        return { success: false, error: result?.error };
      }

      // Clear local state immediately for better UI response
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('userProfile');
      localStorage.removeItem('userRole');
      localStorage.removeItem('auth_token');

      return { success: true };
    } catch (error) {
      const errorMsg = "Something went wrong during logout. Please try again.";
      setAuthError(errorMsg);
      console.log("Sign out error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setAuthError(null);

      if (!user?.id) {
        const errorMsg = "User not authenticated";
        setAuthError(errorMsg);
        return { success: false, error: errorMsg };
      }

      const result = await authService.updateUserProfile(user.id, updates);

      if (!result?.success) {
        setAuthError(result?.error || "Profile update failed");
        return { success: false, error: result?.error };
      }

      setUserProfile(result.data);
      localStorage.setItem('userProfile', JSON.stringify(result.data));
      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg =
        "Something went wrong updating profile. Please try again.";
      setAuthError(errorMsg);
      console.log("Update profile error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Verify signup OTP
  const verifySignup = async (email, otp) => {
    try {
      setAuthError(null);
      const result = await authService.verifySignup(email, otp);

      if (!result?.success) {
        setAuthError(result?.error || "Verification failed");
        return { success: false, error: result?.error };
      }

      // If successful, set user and profile
      if (result.data?.user) {
        setUser(result.data.user);
        const profileResult = await authService.getUserProfile(result.data.user.id);
        if (profileResult?.success) {
          setUserProfile(profileResult.data);
        }
      }

      return { success: true, data: result.data };
    } catch (error) {
      const errorMsg = "Something went wrong during verification. Please try again.";
      setAuthError(errorMsg);
      console.log("Verify signup error:", error);
      return { success: false, error: errorMsg };
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      setAuthError(null);
      const result = await authService.forgotPassword(email);
      return result;
    } catch (error) {
      const errorMsg = "Something went wrong sending reset OTP. Please try again.";
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Verify OTP function
  const verifyOTP = async (email, otp) => {
    try {
      setAuthError(null);
      const result = await authService.verifyOTP(email, otp);
      return result;
    } catch (error) {
      const errorMsg = "Invalid or expired OTP. Please try again.";
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Reset password function
  const resetPassword = async (email, otp, newPassword) => {
    try {
      setAuthError(null);
      const result = await authService.resetPassword(email, otp, newPassword);
      return result;
    } catch (error) {
      const errorMsg = "Something went wrong resetting password. Please try again.";
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };


  const value = {
    user,
    userProfile,
    loading,
    authError,
    signIn,
    signInWithGoogle,
    signInWithOAuth: async (provider) => {
      // Fallback for providers other than Google if needed
      return { success: false, error: "Only Google login is supported currently." };
    },
    signUp,
    signOut,
    updateProfile,
    verifySignup,
    forgotPassword,
    verifyOTP,
    resetPassword,

    updatePassword: async (newPassword) => {
      console.log("AuthContext: Calling updatePassword");
      try {
        const result = await authService.updatePassword(newPassword);
        console.log("AuthContext: updatePassword completed", result);
        return result;
      } catch (error) {
        console.error("AuthContext: updatePassword failed", error);
        return { success: false, error: error.message || "Password update failed" };
      }
    },
    isPasswordRecovery,
    clearError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;