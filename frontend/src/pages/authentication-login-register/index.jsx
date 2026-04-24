import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialAuth from './components/SocialAuth';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPasswordForm from './components/ResetPasswordForm';
import VerifySignupModal from './components/VerifySignupModal';
import Image from '../../components/AppImage';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import { useLanguage } from '../../contexts/LanguageContext';

const AuthenticationPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showVerifySignup, setShowVerifySignup] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const navigate = useNavigate();

  const { signIn, signInWithGoogle, signInWithOAuth, signUp, resetPassword, user, isPasswordRecovery } = useAuth(); // Get auth functions from useAuth

  // Initial load effect - only runs once to set tab from URL
  useEffect(() => {
    // Check URL parameters for mode (login/register)
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    if (mode === 'login' || mode === 'register' || mode === 'reset') {
      setActiveTab(mode);
    }
  }, []);

  // Auth state effect - runs when dependencies change
  useEffect(() => {
    // If we detect password recovery event, force reset tab
    if (isPasswordRecovery) {
      setActiveTab('reset');
    }

    // If user is authenticated, redirect based on their role
    // BUT only if we are NOT in password reset mode
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    // We check both the URL mode and our internal recovery state event
    if (user && activeTab !== 'reset' && mode !== 'reset' && !isPasswordRecovery) {
      // Get user profile and redirect based on role
      if (user.user_metadata?.role || user.app_metadata?.role) {
        const userRole = user.user_metadata?.role || user.app_metadata?.role;
        if (userRole === 'buyer') {
          navigate('/buyer-dashboard');
        } else if (userRole === 'seller') {
          navigate('/seller-dashboard');
        } else {
          navigate('/home-landing-page');
        }
      }
    }
  }, [navigate, user, activeTab, isPasswordRecovery]);

  const handleLogin = async (formData) => {
    setLoading(true);
    setError('');

    try {
      // Check if this is a problematic email from user's report
      if (formData.email.toLowerCase() === 'gapp3055@gmail.com') {
        console.log('Special case login detected for:', formData.email);
      }

      const result = await signIn(formData.email, formData.password);

      if (result.success) {
        console.log('Login successful for:', formData.email);
        // Check if we have user data
        if (result.data?.user) {
          // Get user role from metadata
          const userRole = result.data.user.user_metadata?.role || result.data.user.app_metadata?.role;

          // Redirect based on role
          if (userRole === 'buyer') {
            navigate('/buyer-dashboard');
          } else if (userRole === 'seller') {
            navigate('/seller-dashboard');
          } else if (userRole === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/home-landing-page');
          }
        } else {
          // The useEffect will handle navigation if user is set
        }
      } else {
        if (result.requiresVerification) {
          setVerifyEmail(result.email || formData.email);
          setShowVerifySignup(true);
          toast.success(result.error || 'Please verify your email to login. A new OTP has been sent.');
        } else {
          console.error('Login failed for:', formData.email, 'Error:', result.error);
          setError(result.error || (language === 'en' ? 'Login failed. Please try again.' : 'લોગિન નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.'));
        }
      }
    } catch (err) {
      console.error('Login exception:', err);
      setError(language === 'en' ? 'Login failed. Please try again.' : 'લોગિન નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const { name, email, mobile, password, role } = formData;

      // Prevent admin registration through the UI
      if (role === 'admin') {
        setError(language === 'en'
          ? 'Admin registration is not allowed. Please contact system administrator.'
          : 'એડમિન નોંધણીની મંજૂરી નથી. કૃપા કરીને સિસ્ટમ એડમિનિસ્ટ્રેટરનો સંપર્ક કરો.');
        setLoading(false);
        return;
      }

      // Log registration attempt for debugging
      console.log('Registration attempt for:', email);

      const result = await signUp(email, password, { full_name: name, role: role, phone: mobile });

      if (result.success) {
        console.log('Registration successful for:', email);
        if (result.requiresVerification) {
          setVerifyEmail(result.email || email);
          setShowVerifySignup(true);
          toast.success(result.message || 'OTP sent to your email.');
        } else if (result.message) {
          // Show success message for email confirmation
          setActiveTab('login');
          setError(null);
          // Use a success message instead of an error
          toast.success(result.message || (language === 'en' ? 'Registration successful! Please check your email to confirm your account.' : 'નોંધણી સફળ! કૃપા કરીને તમારા ખાતાની પુષ્ટિ કરવા માટે તમારા ઇમેઇલ તપાસો.'));
        }
        // If auto-confirmed, the useEffect will handle navigation after user is set
      } else {
        console.error('Registration failed for:', email, 'Error:', result.error);
        // Check if the error is due to existing email
        const errorMessage = typeof result.error === 'string' ? result.error : (result.error?.message || '');
        if (errorMessage.toLowerCase().includes('email already exists')) {
          setError(language === 'en' ? 'An account with this email already exists. Please log in instead.' : 'આ ઇમેઇલ સાથે એક ખાતું પહેલેથી અસ્તિત્વમાં છે. કૃપા કરીને લૉગિન કરો.');
        } else {
          setError(errorMessage || (language === 'en' ? 'Registration failed. Please try again.' : 'નોંધણી નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.'));
        }
      }
    } catch (err) {
      console.error('Registration exception:', err);
      // Check if the error is due to existing email
      const errorMsg = typeof err.message === 'string' ? err.message : (err.error?.message || '');
      if (errorMsg.toLowerCase().includes('email already exists')) {
        setError(language === 'en' ? 'An account with this email already exists. Please log in instead.' : 'આ ઇમેઇલ સાથે એક ખાતું પહેલેથી અસ્તિત્વમાં છે. કૃપા કરીને લૉગિન કરો.');
      } else {
        setError(language === 'en' ? 'Registration failed. Please try again.' : 'નોંધણી નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
      }
    } finally {
      setLoading(false);
    }
  };

  // State for missing role/phone modal
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [pendingGoogleToken, setPendingGoogleToken] = useState(null);
  const [pendingRole, setPendingRole] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');

  const handleSocialLogin = async (provider, token) => {
    setLoading(true);
    setError('');

    try {
      // If provider is 'google' and we have a token from useGoogleLogin
      if (provider === 'google' && token) {
        const result = await signInWithGoogle(token); // Initial call without role

        if (result.success) {
          // Check if phone number is missing
          if (result.phone_missing) {
            setPendingGoogleToken(token);
            setShowPhoneModal(true);
            return;
          }

          // Login success
          if (result.data?.user) {
            const userRole = result.data.user.role;
            if (userRole === 'buyer') navigate('/buyer-dashboard');
            else if (userRole === 'seller') navigate('/seller-dashboard');
            else navigate('/home-landing-page');
          }
        } else if (result.requiresRole) {
          // User needs to select a role
          setPendingGoogleToken(token);
          setShowRoleModal(true);
        } else {
          setError(result.error || (language === 'en' ? 'Social login failed.' : 'સોશિયલ લોગિન નિષ્ફળ.'));
        }
      } else {
        // Fallback for others or if token missing
        const result = await signInWithOAuth(provider);
        if (!result.success) {
          setError(result.error);
        }
      }

    } catch (err) {
      console.error('Social login exception:', err);
      setError(language === 'en' ? 'Social login failed. Please try again.' : 'સોશિયલ લોગિન નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = async (role) => {
    if (!pendingGoogleToken) return;

    setLoading(true);
    setShowRoleModal(false);
    setPendingRole(role);
    setShowPhoneModal(true); // Always ask for phone during social register
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!pendingGoogleToken) return;
    if (!phoneInput || !/^\d{10}$/.test(phoneInput)) {
      toast.error(language === 'en' ? 'Please enter a valid 10-digit phone number' : 'કૃપા કરીને માન્ય 10-અંકનો ફોન નંબર દાખલ કરો');
      return;
    }

    setLoading(true);
    setShowPhoneModal(false);

    try {
      // Pass both role and phone to login
      const result = await signInWithGoogle(pendingGoogleToken, pendingRole, phoneInput);
      if (result.success) {
        const userRole = result.data.user.role;
        if (userRole === 'buyer') navigate('/buyer-dashboard');
        else if (userRole === 'seller') navigate('/seller-dashboard');
        else navigate('/home-landing-page');
      } else {
        setError(result.error || 'Failed to complete registration');
      }
    } catch (err) {
      setError('Failed to complete registration');
    } finally {
      setLoading(false);
      setPendingGoogleToken(null);
      setPendingRole(null);
      setPhoneInput('');
    }
  };



  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80"
            alt="Agricultural landscape background"
            className="w-full h-full object-cover"
            fetchpriority="high"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md">
              {/* Auth Card */}
              <div className="bg-card rounded-lg shadow-elevation-3 p-6 lg:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                    {language === 'en' ? 'Welcome to AgroLand' : 'AgroLand માં આપનું સ્વાગત છે'}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {activeTab === 'login'
                      ? (language === 'en' ? 'Sign in to your account' : 'તમારા ખાતામાં સાઇન ઇન કરો')
                      : (language === 'en' ? 'Create your new account' : 'તમારું નવું ખાતું બનાવો')
                    }
                  </p>
                </div>

                {/* Auth Tabs - Only show for login/register */}
                {activeTab !== 'reset' && (
                  <AuthTabs
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    language={language}
                  />
                )}

                {/* Auth Forms */}
                {activeTab === 'login' ? (
                  <LoginForm
                    language={language}
                    onSubmit={handleLogin}
                    loading={loading}
                    error={error}
                    onForgotPassword={() => setShowForgotPassword(true)}
                  />
                ) : activeTab === 'register' ? (
                  <RegisterForm
                    language={language}
                    onSubmit={handleRegister}
                    loading={loading}
                    error={error}
                  />
                ) : activeTab === 'reset' ? (
                  <ResetPasswordForm
                    language={language}
                    onCancel={() => setActiveTab('login')}
                  />
                ) : null}

                {/* Social Authentication */}
                <SocialAuth
                  language={language}
                  onSocialLogin={handleSocialLogin}
                  loading={loading}
                  activeTab={activeTab}
                />

                {/* Footer Links */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'login'
                      ? (language === 'en' ? "Don't have an account? " : "ખાતું નથી? ")
                      : (language === 'en' ? "Already have an account? " : "પહેલેથી ખાતું છે? ")
                    }
                    <button
                      onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
                      className="text-primary hover:text-primary/80 transition-micro font-medium"
                    >
                      {activeTab === 'login'
                        ? (language === 'en' ? 'Sign up' : 'સાઇન અપ')
                        : (language === 'en' ? 'Sign in' : 'સાઇન ઇન')
                      }
                    </button>
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <p className="text-xs text-white/80">
                  {language === 'en' ? 'By continuing, you agree to our Terms of Service and Privacy Policy' : 'ચાલુ રાખીને, તમે અમારી સેવાની શરતો અને ગોપનીયતા નીતિ સાથે સંમત થાઓ છો'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        language={language}
      />

      {/* Verify Signup Modal */}
      <VerifySignupModal
        isOpen={showVerifySignup}
        onClose={() => setShowVerifySignup(false)}
        email={verifyEmail}
        language={language}
      />

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">{language === 'en' ? 'Select Account Type' : 'ખાતાનો પ્રકાર પસંદ કરો'}</h2>
            <p className="text-gray-600 mb-6">{language === 'en' ? 'Are you looking to buy or sell land?' : 'શું તમે જમીન ખરીદવા કે વેચવા માંગો છો?'}</p>
            <div className="space-y-3">
              <button onClick={() => handleRoleSelection('buyer')} className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90">
                {language === 'en' ? 'I want to Buy (Buyer)' : 'હું ખરીદવા માંગુ છું (ખરીદનાર)'}
              </button>
              <button onClick={() => handleRoleSelection('seller')} className="w-full py-3 bg-white border-2 border-primary text-primary rounded-md font-medium hover:bg-gray-50">
                {language === 'en' ? 'I want to Sell (Seller)' : 'હું વેચવા માંગુ છું (વેચનાર)'}
              </button>
            </div>
            <button onClick={() => setShowRoleModal(false)} className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full text-center">
              {language === 'en' ? 'Cancel' : 'રદ કરો'}
            </button>
          </div>
        </div>
      )}
      {/* Phone Selection Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">{language === 'en' ? 'One Last Step' : 'છેલ્લું પગલું'}</h2>
            <p className="text-gray-600 mb-6">{language === 'en' ? 'Please provide your phone number for property inquiries.' : 'કૃપા કરીને પ્રોપર્ટી પૂછપરછ માટે તમારો ફોન નંબર આપો.'}</p>
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'en' ? 'Phone Number' : 'ફોન નંબર'}
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="76xxxxxx56"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <button type="submit" className="w-full py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90">
                {language === 'en' ? 'Complete Profile' : 'પ્રોફાઇલ પૂર્ણ કરો'}
              </button>
            </form>
            {/* <button onClick={() => setShowPhoneModal(false)} className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full text-center">
              {language === 'en' ? 'Skip for now' : 'અત્યારે રહેવા દો'}
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthenticationPage;
