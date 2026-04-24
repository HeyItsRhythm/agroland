import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';

const SellerSettings = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      newInquiries: true,
      propertyViews: false,
      marketUpdates: true
    },
    privacy: {
      profileVisibility: 'public',
      contactInfo: 'buyers',
      propertyDetails: 'public'
    },
    preferences: {
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR'
    }
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleNotificationChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handlePrivacyChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    try {
      // Save to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));

      // Show success message
      setMessage({
        type: 'success',
        text: language === 'en' ? 'Settings saved successfully!' : 'સેટિંગ્સ સફળતાપૂર્વક સાચવી!'
      });

      // Auto-hide message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: language === 'en' ? 'Failed to save settings' : 'સેટિંગ્સ સાચવવામાં નિષ્ફળ'
      });
    }
  };

  // Account Actions State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ new: '', confirm: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user, userProfile, updatePassword, signOut } = useAuth(); // Destructure needed auth functions

  // Handlers
  const handleExportData = () => {
    try {
      import('jspdf').then(({ jsPDF }) => {
        const doc = new jsPDF();

        // Add Title
        doc.setFontSize(20);
        doc.setTextColor(40, 167, 69); // Green color
        doc.text('AgroLand User Profile', 105, 20, null, null, 'center');

        // Add User Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        let yPos = 40;
        const lineHeight = 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Personal Information', 20, yPos);
        yPos += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${userProfile?.full_name || '-'}`, 20, yPos);
        yPos += lineHeight;
        doc.text(`Email: ${user?.email || '-'}`, 20, yPos);
        yPos += lineHeight;
        doc.text(`Phone: ${userProfile?.phone || '-'}`, 20, yPos);
        yPos += lineHeight;
        doc.text(`Role: ${userProfile?.role || '-'}`, 20, yPos);
        yPos += lineHeight;
        doc.text(`Joined: ${new Date(user?.created_at).toLocaleDateString()}`, 20, yPos);

        yPos += 10;

        // Settings Summary
        doc.setFont('helvetica', 'bold');
        doc.text('Account Settings', 20, yPos);
        yPos += lineHeight;

        doc.setFont('helvetica', 'normal');
        doc.text(`Language: ${settings.preferences.language === 'en' ? 'English' : 'Gujarati'}`, 20, yPos);
        yPos += lineHeight;
        doc.text(`Currency: ${settings.preferences.currency}`, 20, yPos);
        yPos += lineHeight;
        doc.text(`Profile Visibility: ${settings.privacy.profileVisibility}`, 20, yPos);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 280);

        doc.save(`agroland_profile_${user?.id?.substring(0, 8)}.pdf`);

        setMessage({ type: 'success', text: language === 'en' ? 'Data exported as PDF successfully!' : 'પીડીએફ તરીકે ડેટા સફળતાપૂર્વક એક્સપોર્ટ થયો!' });
      }).catch(err => {
        console.error('PDF Library Error:', err);
        setMessage({ type: 'error', text: language === 'en' ? 'Failed to load PDF generator' : 'પીડીએફ જનરેટર લોડ કરવામાં નિષ્ફળ' });
      });
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: language === 'en' ? 'Failed to export data' : 'ડેટા એક્સપોર્ટ કરવામાં નિષ્ફળ' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    console.log("Handle Password Change Initiated");

    if (passwordForm.new !== passwordForm.confirm) {
      toast.error(language === 'en' ? 'Passwords do not match' : 'પાસવર્ડ્સ મેળ ખાતા નથી');
      return;
    }

    if (passwordForm.new.length < 6) {
      toast.error(language === 'en' ? 'Password must be at least 6 characters' : 'પાસવર્ડ ઓછામાં ઓછા 6 અક્ષરોનો હોવો જોઈએ');
      return;
    }

    try {
      setActionLoading(true);
      setMessage({ type: '', text: '' });

      console.log("Calling updatePassword...");

      // Create a timeout promise to prevent hanging indefinitely
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), 15000)
      );

      // Race the update against the timeout
      const result = await Promise.race([
        updatePassword(passwordForm.new),
        timeoutPromise
      ]);

      console.log("Update Password Result:", result);

      if (result && result.success) {
        // Success case
        const successMsg = language === 'en' ? 'Password updated successfully' : 'પાસવર્ડ સફળતાપૂર્વક અપડેટ થયો';
        toast.success(successMsg);
        setMessage({ type: 'success', text: successMsg });
        setShowPasswordModal(false);
        setPasswordForm({ new: '', confirm: '' });
      } else {
        // Failure case from API
        const errorMsg = result?.error || (language === 'en' ? 'Failed to update password' : 'પાસવર્ડ અપડેટ કરવામાં નિષ્ફળ');
        console.error("Password update error:", errorMsg);
        toast.error(errorMsg);
        setMessage({ type: 'error', text: errorMsg });
      }
    } catch (error) {
      // Exception/Timeout case
      console.error("Handle Password Change Exception:", error);
      const unexpectedMsg = language === 'en' ? 'An unexpected error occurred. Please try again.' : 'એક અણધારી ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.';
      toast.error(unexpectedMsg);
      setMessage({ type: 'error', text: unexpectedMsg });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setActionLoading(true);

      // Note: This logic assumes we will add `import authService` at the top.
      const result = await import('../../../utils/authService').then(m => m.default.deleteUser(user.id));

      if (result.success) {
        await signOut();
        window.location.href = '/home-landing-page';
      } else {
        setMessage({ type: 'error', text: result.error || (language === 'en' ? 'Failed to delete account' : 'એકાઉન્ટ કાઢી નાખવામાં નિષ્ફળ') });
        setShowDeleteModal(false);
      }
    } catch (error) {
      setMessage({ type: 'error', text: language === 'en' ? 'An unexpected error occurred' : 'એક અણધારી ભૂલ આવી' });
      setShowDeleteModal(false);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Settings - Seller Dashboard' : 'સેટિંગ્સ - વેચનાર ડેશબોર્ડ'}
        </title>
      </Helmet>

      <div className="max-w-4xl mx-auto pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {language === 'en' ? 'Settings' : 'સેટિંગ્સ'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Manage your account preferences and notification settings' : 'તમારી એકાઉન્ટ પસંદગીઓ અને નોટિફિકેશન સેટિંગ્સ મેનેજ કરો'}
          </p>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
            <Icon name={message.type === 'success' ? 'CheckCircle' : 'AlertCircle'} size={20} className="mr-2" />
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              <Icon name="Bell" size={20} className="inline mr-2" />
              {language === 'en' ? 'Notification Settings' : 'નોટિફિકેશન સેટિંગ્સ'}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  {language === 'en' ? 'Notification Channels' : 'નોટિફિકેશન ચેનલ્સ'}
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', label: language === 'en' ? 'Email Notifications' : 'ઇમેઇલ નોટિફિકેશન્સ' },
                    { key: 'sms', label: language === 'en' ? 'SMS Notifications' : 'SMS નોટિફિકેશન્સ' },
                    { key: 'push', label: language === 'en' ? 'Push Notifications' : 'પુશ નોટિફિકેશન્સ' }
                  ].map((channel) => (
                    <label key={channel.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications[channel.key]}
                        onChange={(e) => handleNotificationChange(channel.key, e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{channel.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">
                  {language === 'en' ? 'Notification Types' : 'નોટિફિકેશન પ્રકારો'}
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'newInquiries', label: language === 'en' ? 'New Property Inquiries' : 'નવી પ્રોપર્ટી પૂછપરછ' },
                    { key: 'propertyViews', label: language === 'en' ? 'Property View Updates' : 'પ્રોપર્ટી વ્યૂ અપડેટ્સ' },
                    { key: 'marketUpdates', label: language === 'en' ? 'Market Updates & Trends' : 'માર્કેટ અપડેટ્સ અને વલણો' }
                  ].map((type) => (
                    <label key={type.key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.notifications[type.key]}
                        onChange={(e) => handleNotificationChange(type.key, e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm text-foreground">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              <Icon name="Settings" size={20} className="inline mr-2" />
              {language === 'en' ? 'Preferences' : 'પસંદગીઓ'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Language' : 'ભાષા'}
                </label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="en">English</option>
                  <option value="gu">ગુજરાતી</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Currency' : 'ચલણ'}
                </label>
                <select
                  value={settings.preferences.currency}
                  onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              <Icon name="AlertTriangle" size={20} className="inline mr-2" />
              {language === 'en' ? 'Account Actions' : 'એકાઉન્ટ ક્રિયાઓ'}
            </h2>

            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Icon name="Download" size={16} className="mr-2" />
                {language === 'en' ? 'Export Data' : 'ડેટા એક્સપોર્ટ કરો'}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowPasswordModal(true)}
              >
                <Icon name="Key" size={16} className="mr-2" />
                {language === 'en' ? 'Change Password' : 'પાસવર્ડ બદલો'}
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteModal(true)}
              >
                <Icon name="Trash2" size={16} className="mr-2" />
                {language === 'en' ? 'Delete Account' : 'એકાઉન્ટ કાઢી નાખો'}
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSaveSettings}>
              <Icon name="Save" size={20} className="mr-2" />
              {language === 'en' ? 'Save Settings' : 'સેટિંગ્સ સેવ કરો'}
            </Button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-lg shadow-lg border border-border p-6">
            <h2 className="text-xl font-bold mb-4">
              {language === 'en' ? 'Change Password' : 'પાસવર્ડ બદલો'}
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'en' ? 'New Password' : 'નવો પાસવર્ડ'}
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === 'en' ? 'Confirm Password' : 'પાસવર્ડ પુષ્ટિ કરો'}
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setShowPasswordModal(false)}>
                  {language === 'en' ? 'Cancel' : 'રદ કરો'}
                </Button>
                <Button type="submit" disabled={actionLoading}>
                  {actionLoading ? '...' : (language === 'en' ? 'Update' : 'અપડેટ')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card w-full max-w-md rounded-lg shadow-lg border border-border p-6">
            <div className="flex items-center text-destructive mb-4">
              <Icon name="AlertTriangle" size={24} className="mr-2" />
              <h2 className="text-xl font-bold">
                {language === 'en' ? 'Delete Account' : 'એકાઉન્ટ કાઢી નાખો'}
              </h2>
            </div>

            <p className="mb-6 text-muted-foreground">
              {language === 'en'
                ? 'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.'
                : 'શું તમે ખરેખર તમારું એકાઉન્ટ કાઢી નાખવા માંગો છો? આ ક્રિયા ફરીથી કરી શકાતી નથી અને તમારો બધો ડેટા કાયમ માટે ગુમ થઈ જશે.'}
            </p>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                {language === 'en' ? 'Cancel' : 'રદ કરો'}
              </Button>
              <Button
                variant="default"
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleDeleteAccount}
                disabled={actionLoading}
              >
                {actionLoading ? '...' : (language === 'en' ? 'Delete Permanently' : 'કાયમી રીતે કાઢી નાખો')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerSettings;