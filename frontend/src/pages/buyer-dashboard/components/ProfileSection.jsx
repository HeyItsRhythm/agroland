import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import fileService from '../../../utils/fileService';
import { cn } from '../../../utils/cn';

const ProfileSection = ({ language = 'en' }) => {
  const { user, userProfile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    bio: '',
    avatar_url: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (userProfile) {
      // Parse location field if it exists
      let address = '';
      let city = '';
      let state = '';

      // Try to parse location as JSON if it exists
      // Handle location which could be a string or an object
      if (userProfile.location) {
        if (typeof userProfile.location === 'object') {
          address = userProfile.location.address || '';
          city = userProfile.location.city || '';
          state = userProfile.location.state || '';
        } else {
          try {
            const locationData = JSON.parse(userProfile.location);
            address = locationData.address || '';
            city = locationData.city || '';
            state = locationData.state || '';
          } catch (e) {
            address = userProfile.location || '';
          }
        }
      }

      // Log the profile data for debugging
      console.log('User profile data:', userProfile);

      setFormData({
        full_name: userProfile.full_name || '',
        email: user?.email || '',
        phone: userProfile.mobile || userProfile.phone || '',
        address: address,
        city: city,
        state: state,
        bio: userProfile.bio || '',
        avatar_url: userProfile.avatar_url || ''
      });
    }
  }, [userProfile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) {
      errors.full_name = language === 'en' ? 'Full name is required' : 'પૂરું નામ જરૂરી છે';
    } else if (formData.full_name.trim().length < 3) {
      errors.full_name = language === 'en' ? 'Full name must be at least 3 characters' : 'પૂરું નામ ઓછામાં ઓછું 3 અક્ષરનું હોવું જોઈએ';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      errors.phone = language === 'en' ? 'Phone number must be 10 digits' : 'ફોન નંબર 10 અંકનો હોવો જોઈએ';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError(language === 'en' ? 'Image size must be less than 2MB' : 'છબી નું કદ 2MB કરતા ઓછું હોવું જોઈએ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadResult = await fileService.uploadFile(file, 'avatars');
      if (uploadResult.success) {
        setFormData(prev => ({ ...prev, avatar_url: uploadResult.url }));
        // Also update immediately if preferred, or wait for form submit
        // Let's just update the local state and user will save with the rest
      } else {
        setError(uploadResult.error || 'Failed to upload photo');
      }
    } catch (err) {
      setError('Error uploading photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare the profile data for update - match exactly with User.js schema
      const profileData = {
        full_name: formData.full_name,
        phone: formData.phone,
        avatar_url: formData.avatar_url,
        location: JSON.stringify({
          address: formData.address || '',
          city: formData.city || '',
          state: formData.state || ''
        }),
        bio: formData.bio,
        updated_at: new Date().toISOString()
      };

      console.log('Updating profile with data:', profileData);
      const result = await updateProfile(profileData);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update exception:', err);
      setError('Something went wrong updating your profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          {language === 'en' ? 'Profile Settings' : 'પ્રોફાઇલ સેટિંગ્સ'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'en' ? 'Manage your personal information' : 'તમારી વ્યક્તિગત માહિતી મેનેજ કરો'}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-success/10 border border-success/20 text-success px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} />
              {language === 'en' ? 'Profile updated successfully!' : 'પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ!'}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-border/50">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-card shadow-xl transition-transform group-hover:scale-[1.02] bg-muted flex items-center justify-center relative">
                {formData.avatar_url && (
                  <Image
                    src={formData.avatar_url}
                    alt="Profile"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: 0 }}
                    onLoad={(e) => {
                      e.target.style.opacity = '1';
                      const fallback = e.target.parentNode.querySelector('.fallback-icon');
                      if (fallback) fallback.style.opacity = '0';
                    }}
                  />
                )}
                <div
                  className="fallback-icon absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted transition-opacity duration-300"
                >
                  <Icon name="User" size={48} />
                </div>
                {loading && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10">
                    <Icon name="Loader2" size={24} className="animate-spin text-primary" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute -bottom-2 -right-2 p-2 bg-primary text-white rounded-xl shadow-lg cursor-pointer hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
              >
                <Icon name="Camera" size={18} />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={loading}
                />
              </label>
            </div>

            <div className="text-center md:text-left space-y-1">
              <h4 className="text-lg font-bold text-foreground">
                {language === 'en' ? 'Profile Photo' : 'પ્રોફાઇલ ફોટો'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Upload a professional photo' : 'પ્રોફેશનલ ફોટો અપલોડ કરો'}
              </p>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold">
                {language === 'en' ? 'JPG, PNG • MAX 2MB' : 'JPG, PNG • મહત્તમ 2MB'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Full Name */}
            <Input
              label={language === 'en' ? 'Full Name' : 'પૂરું નામ'}
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              error={formErrors.full_name}
              placeholder={language === 'en' ? 'Enter your full name' : 'તમારું પૂરું નામ દાખલ કરો'}
              required
              iconName="User"
            />

            {/* Email */}
            <Input
              label={language === 'en' ? 'Email' : 'ઇમેઇલ'}
              name="email"
              value={formData.email}
              disabled
              description={language === 'en' ? 'Email cannot be changed' : 'ઇમેઇલ બદલી શકાતો નથી'}
              iconName="Mail"
            />

            {/* Phone */}
            <Input
              label={language === 'en' ? 'Phone' : 'ફોન'}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={formErrors.phone}
              placeholder={language === 'en' ? 'Enter phone number' : 'ફોન નંબર દાખલ કરો'}
              iconName="Phone"
              type="tel"
            />

            {/* Address */}
            <Input
              label={language === 'en' ? 'Address' : 'સરનામું'}
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Enter your address' : 'તમારું સરનામું દાખલ કરો'}
              iconName="MapPin"
            />

            {/* City */}
            <Input
              label={language === 'en' ? 'City' : 'શહેર'}
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder={language === 'en' ? 'City' : 'શહેર'}
              iconName="Building"
            />

            {/* State */}
            <Input
              label={language === 'en' ? 'State' : 'રાજ્ય'}
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder={language === 'en' ? 'State' : 'રાજ્ય'}
              iconName="Map"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2 pb-4">
            <label htmlFor="bio" className="text-sm font-bold text-foreground block">
              {language === 'en' ? 'Bio' : 'બાયો'}
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className={cn(
                "w-full px-4 py-3 border border-border rounded-xl bg-card text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none",
                formErrors.bio && "border-destructive focus:ring-destructive"
              )}
              placeholder={language === 'en' ? 'Tell us something about yourself...' : 'તમારા વિશે કંઈક જણાવો...'}
            ></textarea>
            {formErrors.bio && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                {formErrors.bio}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  {language === 'en' ? 'Saving...' : 'સેવ કરી રહ્યું છે...'}
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  {language === 'en' ? 'Save Changes' : 'ફેરફારો સાચવો'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSection;