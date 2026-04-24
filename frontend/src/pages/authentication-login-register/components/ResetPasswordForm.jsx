import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const ResetPasswordForm = ({ language, onCancel }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updatePassword, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError(language === 'en'
                ? 'Password must be at least 6 characters long'
                : 'પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ');
            return;
        }

        if (password !== confirmPassword) {
            setError(language === 'en'
                ? 'Passwords do not match'
                : 'પાસવર્ડ્સ મેળ ખાતા નથી');
            return;
        }

        try {
            setLoading(true);
            const result = await updatePassword(password);

            if (result.success) {
                setSuccess(true);
                // Automatically sign out after success so they can log in with new password
                // Or keep them logged in. Usually better to let them log in fresh or just continue.
                // Supabase session is active. Let's redirect to home or dashboard after a delay.
                setTimeout(async () => {
                    // For security/clean state, let's sign them out and ask to login
                    await signOut();
                    navigate('/authentication-login-register?mode=login');
                }, 3000);
            } else {
                setError(result.error || (language === 'en'
                    ? 'Failed to update password. Please try again.'
                    : 'પાસવર્ડ અપડેટ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.'));
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError(language === 'en'
                ? 'An error occurred. Please try again.'
                : 'એક ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Check" size={24} className="text-success" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                    {language === 'en' ? 'Password Reset Successful' : 'પાસવર્ડ સફળતાપૂર્વક રીસેટ થયો'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                    {language === 'en'
                        ? 'Your password has been updated. You will be redirected to login shortly.'
                        : 'તમારો પાસવર્ડ અપડેટ કરવામાં આવ્યો છે. તમને ટૂંક સમયમાં લોગિન પર રીડાયરેક્ટ કરવામાં આવશે.'}
                </p>
                <Button onClick={() => navigate('/authentication-login-register?mode=login')} variant="default" fullWidth>
                    {language === 'en' ? 'Go to Login' : 'લોગિન પર જાઓ'}
                </Button>
            </div>
        );
    }

    return (
        <div className="py-4">
            <h2 className="text-xl font-bold text-center mb-6">
                {language === 'en' ? 'Set New Password' : 'નવો પાસવર્ડ સેટ કરો'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label={language === 'en' ? 'New Password' : 'નવો પાસવર્ડ'}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'en' ? 'Enter new password' : 'નવો પાસવર્ડ દાખલ કરો'}
                    required
                />

                <Input
                    label={language === 'en' ? 'Confirm Password' : 'પાસવર્ડની પુષ્ટિ કરો'}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={language === 'en' ? 'Confirm new password' : 'નવા પાસવર્ડની પુષ્ટિ કરો'}
                    error={error}
                    required
                />

                <div className="pt-2">
                    <Button
                        type="submit"
                        variant="default"
                        loading={loading}
                        fullWidth
                    >
                        {language === 'en' ? 'Update Password' : 'પાસવર્ડ અપડેટ કરો'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
