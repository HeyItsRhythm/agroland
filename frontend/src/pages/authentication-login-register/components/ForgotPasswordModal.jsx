import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const ForgotPasswordModal = ({ isOpen, onClose, language }) => {
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState('email'); // 'email', 'otp', 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setError(language === 'en' 
        ? 'Please enter a valid email address' 
        : 'કૃપા કરી માન્ય ઇમેઇલ સરનામું દાખલ કરો');
      setIsLoading(false);
      return;
    }

    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setStep('otp');
      } else {
        setError(result.error || (language === 'en' 
          ? 'Failed to send OTP. Please try again.' 
          : 'OTP મોકલવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.'));
      }
    } catch (err) {
      setError(language === 'en' ? 'Server error. Please try again.' : 'સર્વર ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (otp.length !== 6) {
      setError(language === 'en' ? 'Please enter a valid 6-digit OTP' : 'કૃપા કરીને માન્ય 6-અંકનો OTP દાખલ કરો');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError(language === 'en' ? 'Password must be at least 6 characters' : 'પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(language === 'en' ? 'Passwords do not match' : 'પાસવર્ડ્સ મેચ થતા નથી');
      setIsLoading(false);
      return;
    }

    try {
      const result = await resetPassword(email, otp, newPassword);
      if (result.success) {
        setStep('success');
      } else {
        setError(result.error || (language === 'en' ? 'Failed to reset password' : 'પાસવર્ડ રીસેટ કરવામાં નિષ્ફળ'));
      }
    } catch (err) {
      setError(language === 'en' ? 'Server error. Please try again.' : 'સર્વર ભૂલ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setStep('email');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-heading font-semibold">
            {language === 'en' ? 'Reset Password' : 'પાસવર્ડ રીસેટ કરો'}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={24} className="text-success" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {language === 'en' ? 'Success!' : 'સફળ!'}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {language === 'en' 
                  ? 'Your password has been reset successfully. You can now log in with your new password.' 
                  : 'તમારો પાસવર્ડ સફળતાપૂર્વક રીસેટ કરવામાં આવ્યો છે. હવે તમે તમારા નવા પાસવર્ડ સાથે લોગ ઇન કરી શકો છો.'}
              </p>
              <Button onClick={handleClose} variant="default" fullWidth>
                {language === 'en' ? 'Go to Login' : 'લોગિન પર જાઓ'}
              </Button>
            </div>
          ) : step === 'email' ? (
            <form onSubmit={handleSendOTP}>
              <p className="text-muted-foreground text-sm mb-4">
                {language === 'en' 
                  ? 'Enter your email address and we\'ll send you an OTP to reset your password.' 
                  : 'તમારું ઇમેઇલ સરનામું દાખલ કરો અને અમે તમને તમારો પાસવર્ડ રીસેટ કરવા માટે એક OTP મોકલીશું.'}
              </p>

              <Input
                label={language === 'en' ? 'Email Address' : 'ઇમેઇલ સરનામું'}
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder={language === 'en' ? 'Enter your email' : 'તમારું ઇમેઇલ દાખલ કરો'}
                error={error}
                required
              />

              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  fullWidth
                >
                  {language === 'en' ? 'Cancel' : 'રદ કરો'}
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  loading={isLoading}
                  fullWidth
                >
                  {language === 'en' ? 'Send OTP' : 'OTP મોકલો'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <p className="text-muted-foreground text-sm mb-4">
                {language === 'en' 
                  ? `OTP sent to ${email}. Please enter it below along with your new password.` 
                  : `OTP ${email} પર મોકલવામાં આવ્યો છે. કૃપા કરીને તમારા નવા પાસવર્ડ સાથે નીચે તેને દાખલ કરો.`}
              </p>

              <div className="space-y-4">
                <Input
                  label={language === 'en' ? 'Enter OTP' : 'OTP દાખલ કરો'}
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                />

                <Input
                  label={language === 'en' ? 'New Password' : 'નવો પાસવર્ડ'}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <Input
                  label={language === 'en' ? 'Confirm Password' : 'પાસવર્ડની પુષ્ટિ કરો'}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  error={error}
                  required
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('email')}
                  fullWidth
                >
                  {language === 'en' ? 'Back' : 'પાછા'}
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  loading={isLoading}
                  fullWidth
                >
                  {language === 'en' ? 'Reset Password' : 'પાસવર્ડ રીસેટ કરો'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;