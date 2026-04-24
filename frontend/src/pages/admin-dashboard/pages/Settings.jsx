import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import settingsService from '../../../utils/settingsService';

const AdminSettings = () => {
  const [language, setLanguage] = useState('en');
  const [settings, setSettings] = useState({
    approvalRequired: true,
    autoExpireDays: 90,
    maxImagesPerProperty: 10,
    allowedPropertyTypes: ['agricultural', 'residential', 'commercial', 'industrial'],
    featuredPropertiesLimit: 5,
    notifyAdminOnNewProperty: true,
    notifySellerOnApproval: true,
    maintenanceMode: false
  });
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    // Language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Ensure system_settings table exists before loading settings
    ensureSettingsTable();
  }, []);
  
  const ensureSettingsTable = async () => {
    try {
      // First ensure the table exists
      const { success, error } = await settingsService.ensureSystemSettingsTable();
      
      if (!success && error) {
        setError(language === 'en' ? `Failed to create settings table: ${error}` : `સેટિંગ્સ ટેબલ બનાવવામાં નિષ્ફળ: ${error}`);
      }
      
      // Then load settings
      loadSettings();
    } catch (err) {
      console.error('Error ensuring settings table:', err);
      setError(language === 'en' ? 'Failed to create settings table' : 'સેટિંગ્સ ટેબલ બનાવવામાં નિષ્ફળ');
      // Still try to load settings with fallback
      loadSettings();
    }
  };
  
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { success, data, error } = await settingsService.getSystemSettings();
      
      if (success && data) {
        setSettings(data);
      } else if (error) {
        // If the error is about the table not existing, use default settings
        if (error.includes('relation "public.system_settings" does not exist')) {
          setSettings(settingsService.getDefaultSettings());
          setError(language === 'en' ? 'Using default settings. The system_settings table needs to be created.' : 'ડિફૉલ્ટ સેટિંગ્સનો ઉપયોગ કરી રહ્યા છીએ. system_settings ટેબલ બનાવવાની જરૂર છે.');
        } else {
          setError(language === 'en' ? `Failed to load settings: ${error}` : `સેટિંગ્સ લોડ કરવામાં નિષ્ફળ: ${error}`);
        }
      }
    } catch (err) {
      console.error('Error loading settings:', err);
      setError(language === 'en' ? 'Failed to load settings' : 'સેટિંગ્સ લોડ કરવામાં નિષ્ફળ');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage('');
      
      const { success, error } = await settingsService.updateSystemSettings(settings);
      
      if (success) {
        // Show success message
        setSuccessMessage(language === 'en' ? 'Settings saved successfully' : 'સેટિંગ્સ સફળતાપૂર્વક સાચવવામાં આવી');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else if (error) {
        setError(language === 'en' ? `Failed to save settings: ${error}` : `સેટિંગ્સ સાચવવામાં નિષ્ફળ: ${error}`);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(language === 'en' ? 'Failed to save settings' : 'સેટિંગ્સ સાચવવામાં નિષ્ફળ');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleNumberChange = (key, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setSettings(prev => ({
        ...prev,
        [key]: numValue
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'en' ? 'Admin Settings' : 'એડમિન સેટિંગ્સ'}
        </h1>
        <Button onClick={handleSaveSettings} disabled={saveLoading}>
          {saveLoading ? (
            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
          ) : (
            <Icon name="Save" size={16} className="mr-2" />
          )}
          {language === 'en' ? 'Save Settings' : 'સેટિંગ્સ સાચવો'}
        </Button>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-4 mb-4 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      ) : successMessage ? (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-md">
          {successMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar for Settings Categories - Visible on desktop */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Settings categories</h2>
              <nav className="space-y-1">
                 <a href="#property" className="flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl font-bold transition-all">
                    <Icon name="Building2" size={18} />
                    {language === 'en' ? 'Property Rules' : 'પ્રોપર્ટી નિયમો'}
                 </a>
                 <a href="#notifications" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 rounded-xl font-bold transition-all">
                    <Icon name="Bell" size={18} />
                    {language === 'en' ? 'Notifications' : 'નોટિફિકેશન'}
                 </a>
                 <a href="#system" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted/50 rounded-xl font-bold transition-all">
                    <Icon name="Settings" size={18} />
                    {language === 'en' ? 'System Status' : 'સિસ્ટમ સ્થિતિ'}
                 </a>
              </nav>
              
              <div className="mt-8 pt-8 border-t border-border">
                 <div className="bg-muted/30 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <Icon name="ShieldCheck" size={16} />
                       </div>
                       <span className="text-xs font-black uppercase tracking-wider">Security</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                       Only administrators can modify these system-wide configurations. All changes are logged.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property Settings Card */}
          <div id="property" className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                     <Icon name="Building2" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">
                    {language === 'en' ? 'Property Configuration' : 'પ્રોપર્ટી ગોઠવણી'}
                  </h2>
               </div>
            </div>
            
            <div className="p-6 space-y-1">
              {/* Approval Required */}
              <div className="flex items-center justify-between py-5 group">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {language === 'en' ? 'Moderation Queue' : 'મોડરેશન કતાર'}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'en' 
                      ? 'New listings must be verified by admin staff before they become public' 
                      : 'જાહેરમાં મૂકતા પહેલા નવી લિસ્ટિંગ્સ એડમિન દ્વારા ચકાસાયેલી હોવી જોઈએ'}
                  </p>
                </div>
                <Toggle 
                  checked={settings.approvalRequired} 
                  onChange={() => handleToggleSetting('approvalRequired')} 
                />
              </div>
              
              <div className="h-px bg-border/50 mx-2"></div>
              
              {/* Auto Expire Days */}
              <div className="flex items-center justify-between py-5">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-foreground mb-1">
                    {language === 'en' ? 'Visibility Duration' : 'દૃશ્યતા અવધિ'}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'en' 
                      ? 'How many days a property stays active before moving to archived' 
                      : 'પ્રોપર્ટી સંગ્રહિતતામાં જતા પહેલા કેટલા દિવસ સક્રિય રહે છે'}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-xl border border-border">
                  <input
                    type="number"
                    className="w-14 bg-transparent border-none text-center font-black focus:ring-0 text-primary"
                    value={settings.autoExpireDays}
                    onChange={(e) => handleNumberChange('autoExpireDays', e.target.value)}
                    min="1"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest pr-2 text-muted-foreground">Days</span>
                </div>
              </div>

               <div className="h-px bg-border/50 mx-2"></div>

              {/* Max Images */}
              <div className="flex items-center justify-between py-5">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-foreground mb-1">
                    {language === 'en' ? 'Media Constraints' : 'મીડિયા મર્યાદા'}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'en' 
                      ? 'Maximum number of high-resolution photos allowed per property' 
                      : 'પ્રોપર્ટી દીઠ મંજૂર ઉચ્ચ-રિઝોલ્યુશન ફોટાઓની મહત્તમ સંખ્યા'}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-xl border border-border">
                   <Icon name="Image" size={14} className="ml-2 text-muted-foreground" />
                  <input
                    type="number"
                    className="w-12 bg-transparent border-none text-center font-black focus:ring-0 text-primary"
                    value={settings.maxImagesPerProperty}
                    onChange={(e) => handleNumberChange('maxImagesPerProperty', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Card */}
          <div id="notifications" className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
             <div className="p-6 border-b border-border bg-muted/20">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                     <Icon name="Bell" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">
                    {language === 'en' ? 'Global Notifications' : 'વૈશ્વિક સૂચનાઓ'}
                  </h2>
               </div>
            </div>
            
            <div className="p-6 space-y-1">
              <div className="flex items-center justify-between py-5">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-foreground mb-1">
                    {language === 'en' ? 'Admin Alerts' : 'એડમિન ચેતવણીઓ'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Get notified immediately for new submissions' : 'નવા સબમિશન માટે તરત જ સૂચિત થાઓ'}
                  </p>
                </div>
                <Toggle 
                  checked={settings.notifyAdminOnNewProperty} 
                  onChange={() => handleToggleSetting('notifyAdminOnNewProperty')} 
                />
              </div>
              
              <div className="h-px bg-border/50 mx-2"></div>
              
              <div className="flex items-center justify-between py-5">
                <div className="max-w-[70%]">
                  <h3 className="font-bold text-foreground mb-1">
                    {language === 'en' ? 'User Feedback' : 'વપરાશકર્તા પ્રતિસાદ'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {language === 'en' ? 'Auto-notify sellers about their approval status' : 'વેચનારાઓને તેમની મંજૂરીની સ્થિતિ વિશે આપોઆપ સૂચિત કરો'}
                  </p>
                </div>
                <Toggle 
                  checked={settings.notifySellerOnApproval} 
                  onChange={() => handleToggleSetting('notifySellerOnApproval')} 
                />
              </div>
            </div>
          </div>

          {/* System Status Card */}
          <div id="system" className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden ring-1 ring-red-500/10">
             <div className="p-6 border-b border-border bg-red-50/30">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                     <Icon name="Zap" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-red-900">
                    {language === 'en' ? 'System Controls' : 'સિસ્ટમ નિયંત્રણો'}
                  </h2>
               </div>
            </div>
            
            <div className="p-6">
              <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="font-black text-red-900 mb-2 uppercase tracking-tight">
                    {language === 'en' ? 'Maintenance Lockdown' : 'મેઇન્ટેનન્સ લોકડાઉન'}
                  </h3>
                  <p className="text-xs text-red-800 leading-relaxed font-medium">
                    {language === 'en' 
                      ? 'When active, the portal is restricted only to technical staff. Public users see a maintenance screen.' 
                      : 'જ્યારે સક્રિય હોય, ત્યારે પોર્ટલ ફક્ત તકનીકી સ્ટાફ માટે મર્યાદિત છે.'}
                  </p>
                </div>
                <Toggle 
                   checked={settings.maintenanceMode} 
                   onChange={() => handleToggleSetting('maintenanceMode')}
                   variant="danger"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable custom Premium Toggle component
const Toggle = ({ checked, onChange, variant = 'primary' }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked 
        ? (variant === 'danger' ? 'bg-red-600' : 'bg-primary') 
        : 'bg-muted border-border'
    }`}
    style={{ width: '52px' }}
  >
    <span
      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-xl ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`}
    />
  </button>
);

export default AdminSettings;