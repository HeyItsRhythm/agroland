import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const VerifySignupModal = ({ isOpen, onClose, email, language }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { verifySignup } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!otp || otp.length !== 6) {
            setError(language === 'en' ? 'Please enter a valid 6-digit OTP' : 'કૃપા કરીને માન્ય 6-અંકનો OTP દાખલ કરો');
            return;
        }

        setLoading(true);
        try {
            const result = await verifySignup(email, otp);
            if (result.success) {
                toast.success(language === 'en' ? 'Email verified successfully!' : 'ઇમેઇલ સફળતાપૂર્વક ચકાસવામાં આવ્યો!');
                onClose();

                // Redirect based on role
                if (result.data?.user) {
                    const userRole = result.data.user.role;
                    if (userRole === 'buyer') {
                        navigate('/buyer-dashboard');
                    } else if (userRole === 'seller') {
                        navigate('/seller-dashboard');
                    } else if (userRole === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/home-landing-page');
                    }
                }
            } else {
                setError(result.error || (language === 'en' ? 'Invalid or expired OTP' : 'અમાન્ય અથવા સમયસીમા સમાપ્ત થયેલ OTP'));
            }
        } catch (err) {
            setError(language === 'en' ? 'Verification failed' : 'ચકાસણી નિષ્ફળ થઈ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4">{language === 'en' ? 'Verify Your Email' : 'તમારું ઇમેઇલ ચકાસો'}</h2>
                <p className="text-gray-600 mb-6">{language === 'en' ? `An OTP has been sent to ${email}. Please enter it below to verify your account.` : `એક OTP ${email} પર મોકલવામાં આવ્યો છે. કૃપા કરીને તમારું ખાતું ચકાસવા માટે તેને નીચે દાખલ કરો.`}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {language === 'en' ? 'Enter 6-digit OTP' : '6-અંકનો OTP દાખલ કરો'}
                        </label>
                        <Input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            placeholder="123456"
                            required
                        />
                    </div>

                    <Button type="submit" variant="default" loading={loading} fullWidth>
                        {language === 'en' ? 'Verify Account' : 'ખાતું ચકાસો'}
                    </Button>
                </form>

                <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full text-center">
                    {language === 'en' ? 'Cancel' : 'રદ કરો'}
                </button>
            </div>
        </div>
    );
};

export default VerifySignupModal;
