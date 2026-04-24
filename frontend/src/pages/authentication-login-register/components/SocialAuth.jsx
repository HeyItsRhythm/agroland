import React from 'react';
import Button from '../../../components/ui/Button';
import { useGoogleLogin } from '@react-oauth/google';

const SocialAuth = ({ language, onSocialLogin, loading, activeTab }) => {

  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      // tokenResponse contains access_token
      onSocialLogin('google', tokenResponse.access_token);
    },
    onError: () => {
      console.error('Google Login Failed');
    }
  });

  return (
    <div className="mt-6">
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 bg-card text-muted-foreground font-medium">
            {language === 'en' ? 'Or continue with' : 'અથવા આની સાથે ચાલુ રાખો'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={() => login()}
          disabled={loading}
          fullWidth
          className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 transition-micro shadow-sm flex items-center justify-center gap-3 py-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              style={{ color: '#4285F4' }}
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              style={{ color: '#34A853' }}
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              style={{ color: '#FBBC05' }}
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              style={{ color: '#EA4335' }}
            />
          </svg>
          <span className="font-semibold">
            {activeTab === 'register'
              ? (language === 'en' ? 'Sign up with Google' : 'Google સાથે સાઇન અપ કરો')
              : (language === 'en' ? 'Sign in with Google' : 'Google સાથે સાઇન ઇન કરો')
            }
          </span>
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth;
