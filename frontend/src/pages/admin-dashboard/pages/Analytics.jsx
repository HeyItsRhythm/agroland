import React, { useState, useEffect } from 'react';
import propertyService from '../../../utils/propertyService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AdminAnalytics = () => {
  const [language, setLanguage] = useState('en');
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    pendingApproval: 0,
    soldProperties: 0,
    pendingProperties: 0,
    expiredProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    propertiesByType: {},
    propertiesByDistrict: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Load analytics data
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // This would need to be implemented in propertyService
      const result = await propertyService.getPropertyAnalytics();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
          <Icon name={icon} size={20} className="text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'en' ? 'Analytics Dashboard' : 'એનાલિટિક્સ ડેશબોર્ડ'}
        </h1>
        <Button onClick={loadAnalytics}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          {language === 'en' ? 'Refresh Data' : 'ડેટા રિફ્રેશ કરો'}
        </Button>
      </div>

      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-destructive">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadAnalytics}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            {language === 'en' ? 'Try Again' : 'ફરી પ્રયાસ કરો'}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Property Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            <StatCard 
              title={language === 'en' ? 'Total' : 'કુલ'} 
              value={stats.totalProperties} 
              icon="Building2" 
              color="bg-blue-600" 
            />
            <StatCard 
              title={language === 'en' ? 'Active' : 'સક્રિય'} 
              value={stats.activeProperties} 
              icon="CheckCircle" 
              color="bg-green-600" 
            />
            <StatCard 
              title={language === 'en' ? 'Approval' : 'મંજૂરી'} 
              value={stats.pendingApproval} 
              icon="Clock" 
              color="bg-purple-600" 
            />
            <StatCard 
              title={language === 'en' ? 'Sold' : 'વેચાયેલ'} 
              value={stats.soldProperties} 
              icon="BadgeCheck" 
              color="bg-blue-600" 
            />
            <StatCard 
              title={language === 'en' ? 'Pending' : 'બાકી'} 
              value={stats.pendingProperties} 
              icon="Clock" 
              color="bg-yellow-600" 
            />
            <StatCard 
              title={language === 'en' ? 'Expired' : 'સમાપ્ત'} 
              value={stats.expiredProperties} 
              icon="XCircle" 
              color="bg-red-600" 
            />
            <StatCard 
              title={language === 'en' ? 'Views' : 'વ્યૂઝ'} 
              value={stats.totalViews} 
              icon="Eye" 
              color="bg-indigo-600" 
            />
            <StatCard 
              title={language === 'en' ? 'Inquiries' : 'પૂછપરછ'} 
              value={stats.totalInquiries} 
              icon="MessageSquare" 
              color="bg-pink-600" 
            />
          </div>

          {/* Properties by Type */}
          <div className="border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-card p-6">
              <h2 className="text-xl font-semibold mb-6">
                {language === 'en' ? 'Properties by Type' : 'પ્રકાર અનુસાર પ્રોપર્ટીઝ'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.propertiesByType || {}).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Icon name="Home" size={18} className="text-blue-600" />
                      </div>
                      <span className="capitalize font-medium">{type}</span>
                    </div>
                    <span className="font-bold text-lg">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Properties by District */}
          <div className="border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-card p-6">
              <h2 className="text-xl font-semibold mb-6">
                {language === 'en' ? 'Properties by District' : 'જિલ્લા અનુસાર પ્રોપર્ટીઝ'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.propertiesByDistrict || {}).map(([district, count]) => (
                  <div key={district} className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-xl">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Icon name="MapPin" size={18} className="text-green-600" />
                      </div>
                      <span className="font-medium">{district}</span>
                    </div>
                    <span className="font-bold text-lg">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;