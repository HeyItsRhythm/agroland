import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import fileService from '../../../utils/fileService';

const SellerProfile = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user, userProfile, updateProfile } = useAuth();

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    experience: '',
    specialization: '',
    bio: '',
    avatar: '/assets/images/no_image.png'
  });

  useEffect(() => {
    // Load user profile data when available
    if (userProfile) {
      setProfile({
        fullName: userProfile.full_name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        address: userProfile.location || '',
        company: userProfile.company || '',
        experience: userProfile.experience || '',
        specialization: userProfile.specialization || '',
        bio: userProfile.bio || '',
        avatar: userProfile.avatar_url || '/assets/images/no_image.png'
      });
    }
  }, [userProfile]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage(language === 'en' ? 'Image size must be less than 2MB' : 'છબી નું કદ 2MB કરતા ઓછું હોવું જોઈએ');
      e.target.value = ''; // Reset input so user can try again
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Upload the avatar image
      const uploadResult = await fileService.uploadFile(file, 'avatars');

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Failed to upload avatar');
      }

      // Update profile with new avatar URL
      const profileData = {
        avatar_url: uploadResult.url,
        updated_at: new Date().toISOString()
      };

      // Call the updateProfile function from AuthContext
      const result = await updateProfile(profileData);

      if (result.success) {
        setProfile(prev => ({
          ...prev,
          avatar: uploadResult.url
        }));
        setSuccessMessage(language === 'en' ? 'Profile photo updated successfully!' : 'પ્રોફાઇલ ફોટો સફળતાપૂર્વક અપડેટ થયો!');
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Avatar update error:', error);
      // Show the actual error message if it's a system error (like missing buckets)
      setErrorMessage(error.message || (language === 'en' ? 'Failed to update profile photo. Please try again.' : 'પ્રોફાઇલ ફોટો અપડેટ કરવામાં નિષ્ફળ. કૃપા કરીને ફરીથી પ્રયાસ કરો.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Profile update started');
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Step 1: Connectivity Check / Minimal Update
      // We try to update just one field that definitely exists
      console.log('Attempting minimal update check...');
      const checkData = { updated_at: new Date().toISOString() };
      const checkResult = await updateProfile(checkData);

      if (!checkResult.success) {
        console.error('Minimal update failed:', checkResult.error);
        if (checkResult.error?.includes('timed out')) {
          throw new Error('Database connection timed out. Please check your internet connection.');
        }
        throw new Error(checkResult.error || 'Basic profile update failed');
      }
      console.log('Minimal update check passed');

      // Step 2: Full Update
      // Prepare profile data for full update
      const profileData = {
        full_name: profile.fullName,
        phone: profile.phone,
        location: profile.address,
        company: profile.company,
        experience: profile.experience,
        specialization: profile.specialization,
        bio: profile.bio,
        updated_at: new Date().toISOString()
      };

      console.log('Sending full profile data:', profileData);

      // Call the updateProfile function from AuthContext
      const result = await updateProfile(profileData);
      console.log('Update profile result:', result);

      if (result.success) {
        setSuccessMessage(language === 'en' ? 'Profile updated successfully!' : 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થયું!');
      } else {
        throw new Error(result.error || 'Update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);

      // Specific error handling
      const errorMsg = error.message || '';

      if (errorMsg.includes('timed out') || errorMsg.includes('taking too long')) {
        setErrorMessage(language === 'en'
          ? 'Network timeout. The server is not responding. Please check your internet connection.'
          : 'નેટવર્ક સમયસમાપ્તિ. સર્વર જવાબ આપતું નથી.');
      } else {
        setErrorMessage(language === 'en' ? `Failed to update profile: ${errorMsg}` : 'પ્રોફાઇલ અપડેટ કરવામાં નિષ્ફળ.');
      }
    } finally {
      console.log('Profile update finished, stopping loading');
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Profile - Seller Dashboard' : 'પ્રોફાઇલ - વેચનાર ડેશબોર્ડ'}
        </title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {language === 'en' ? 'Profile Settings' : 'પ્રોફાઇલ સેટિંગ્સ'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Manage your profile information and preferences' : 'તમારી પ્રોફાઇલ માહિતી અને પસંદગીઓ મેનેજ કરો'}
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={20} />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2 text-destructive">
              <Icon name="AlertCircle" size={20} />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {language === 'en' ? 'Profile Picture' : 'પ્રોફાઇલ છબી'}
            </h2>

            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => document.getElementById('avatar-upload').click()}
                  disabled={loading}
                >
                  <Icon name="Upload" size={16} className="mr-2" />
                  {language === 'en' ? 'Change Photo' : 'છબી બદલો'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === 'en' ? 'JPG, PNG or GIF. Max size 2MB.' : 'JPG, PNG અથવા GIF. મહત્તમ કદ 2MB.'}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {language === 'en' ? 'Personal Information' : 'વ્યક્તિગત માહિતી'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Full Name' : 'પૂરું નામ'}
                </label>
                <Input
                  name="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder={language === 'en' ? 'Enter your full name' : 'તમારું પૂરું નામ દાખલ કરો'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Email' : 'ઈમેલ'}
                </label>
                <Input
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'en' ? 'Email cannot be changed' : 'ઈમેલ બદલી શકાતી નથી'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Phone Number' : 'ફોન નંબર'}
                </label>
                <Input
                  name="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={language === 'en' ? 'Enter phone number' : 'ફોન નંબર દાખલ કરો'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Company/Organization' : 'કંપની/સંસ્થા'}
                </label>
                <Input
                  name="company"
                  value={profile.company}
                  onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                  placeholder={language === 'en' ? 'Enter company name' : 'કંપનીનું નામ દાખલ કરો'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Address' : 'સરનામું'}
                </label>
                <Input
                  name="address"
                  value={profile.address}
                  onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  placeholder={language === 'en' ? 'Enter your address' : 'તમારું સરનામું દાખલ કરો'}
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {language === 'en' ? 'Professional Information' : 'વ્યાવસાયિક માહિતી'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Years of Experience' : 'અનુભવના વર્ષો'}
                </label>
                <Input
                  name="experience"
                  value={profile.experience}
                  onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder={language === 'en' ? 'e.g., 5 years' : 'દા.ત., 5 વર્ષ'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Specialization' : 'વિશેષતા'}
                </label>
                <Input
                  name="specialization"
                  value={profile.specialization}
                  onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                  placeholder={language === 'en' ? 'e.g., Agricultural Land, Commercial' : 'દા.ત., કૃષિ જમીન, વ્યાપારી'}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Bio' : 'બાયો'}
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                  placeholder={language === 'en' ? 'Tell us about yourself and your expertise...' : 'આપણને તમારા વિશે અને તમારી નિષ્ણાતતા વિશે જણાવો...'}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              {language === 'en' ? 'Cancel' : 'રદ કરો'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Saving...' : 'સેવ કરી રહ્યા છીએ...'}</span>
                </div>
              ) : (
                language === 'en' ? 'Save Changes' : 'ફેરફારો સેવ કરો'
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SellerProfile;