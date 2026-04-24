import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import propertyService from '../../utils/propertyService';
import notificationService from '../../utils/notificationService';
import NotificationCenter from '../../components/NotificationCenter';

// Import all dashboard components
import DashboardSidebar from './components/DashboardSidebar';
import MetricsCard from './components/MetricsCard';
import SearchPanel from './components/SearchPanel';
import PropertyCard from './components/PropertyCard';
import SavedPropertiesSection from './components/SavedPropertiesSection';
import ViewedPropertiesSection from './components/ViewedPropertiesSection';
import InquiriesSection from './components/InquiriesSection';
import ProfileSection from './components/ProfileSection';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import AnalyticsWidget from './components/AnalyticsWidget';

const BuyerDashboard = () => {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [recentProperties, setRecentProperties] = useState([]);
  const [analytics, setAnalytics] = useState({
    savedProperties: 0,
    activeInquiries: 0,
    propertiesViewed: 0,
    savedSearches: 0,
    priceDistribution: [],
    trends: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
      // Clean up state to prevent re-triggering on unrelated renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setAnalyticsLoading(true);

      // Run queries in parallel
      const [recentRes, analyticsRes] = await Promise.all([
        propertyService.getProperties({
          sort_by: 'created_at',
          sort_order: 'desc',
          limit: 4
        }),
        propertyService.getBuyerAnalytics(user.id)
      ]);

      if (recentRes.success) {
        setRecentProperties(recentRes.data || []);
      }

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleSaveProperty = async (propertyId) => {
    if (!user?.id) return;
    try {
      const result = await propertyService.saveProperty(user.id, propertyId);
      if (result.success) {
        setRecentProperties(prev =>
          prev.map(p => p.id === propertyId ? { ...p, saved: true } : p)
        );
        // Refresh analytics to update count
        const analyticsRes = await propertyService.getBuyerAnalytics(user.id);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    if (!user?.id) return;
    try {
      const result = await propertyService.removeSavedProperty(user.id, propertyId);
      if (result.success) {
        setRecentProperties(prev =>
          prev.map(p => p.id === propertyId ? { ...p, saved: false } : p)
        );
        // Refresh analytics to update count
        const analyticsRes = await propertyService.getBuyerAnalytics(user.id);
        if (analyticsRes.success) setAnalytics(analyticsRes.data);
      }
    } catch (error) {
      console.error('Error removing property:', error);
    }
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'search':
        return <SearchPanel />;
      case 'saved':
        return <SavedPropertiesSection language={language} />;
      case 'viewed':
        return <ViewedPropertiesSection language={language} />;
      case 'inquiries':
        return <InquiriesSection language={language} />;
      case 'profile':
        return <ProfileSection language={language} />;
      default:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <MetricsCard
                title={language === 'en' ? 'Saved Properties' : 'સાચવેલી પ્રોપર્ટીઝ'}
                value={analytics.savedProperties.toString()}
                icon="Heart"
                trend="up"
                trendValue="+3"
                color="destructive"
              />
              <MetricsCard
                title={language === 'en' ? 'Active Inquiries' : 'સક્રિય પૂછપરછ'}
                value={analytics.activeInquiries.toString()}
                icon="MessageSquare"
                trend="up"
                trendValue="+2"
                color="success"
              />
              <MetricsCard
                title={language === 'en' ? 'Properties Viewed' : 'જોયેલી પ્રોપર્ટીઝ'}
                value={analytics.propertiesViewed.toString()}
                icon="Eye"
                trend="up"
                trendValue="+12"
                color="primary"
              />
              <MetricsCard
                title={language === 'en' ? 'Saved Searches' : 'સાચવેલી શોધ'}
                value={analytics.savedSearches.toString()}
                icon="Search"
                trend="neutral"
                trendValue="0"
                color="warning"
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Recent Properties */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                <div className="bg-card border border-border rounded-xl p-5 lg:p-6 shadow-elevation-1">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-heading font-bold text-foreground">
                        {language === 'en' ? 'Recently Added Properties' : 'તાજેતરમાં ઉમેરાયેલ પ્રોપર્ટીઝ'}
                      </h3>
                      <p className="text-sm text-muted-foreground">New listings matching your preferences</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/property-listings-search')}>
                      {language === 'en' ? 'View All' : 'બધું જુઓ'}
                    </Button>
                  </div>

                  {recentProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {recentProperties.slice(0, 4).map((property) => (
                        <PropertyCard
                          key={property.id}
                          property={property}
                          onSave={handleSaveProperty}
                          onRemove={handleRemoveProperty}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center border-2 border-dashed border-border rounded-lg">
                      <Icon name="Building2" size={40} className="mx-auto text-muted-foreground mb-3 opacity-20" />
                      <p className="text-muted-foreground">No recent properties found</p>
                      <Button variant="link" size="sm" onClick={() => navigate('/property-listings-search')} className="mt-2">
                        Start searching
                      </Button>
                    </div>
                  )}
                </div>

                {/* Analytics Widget */}
                <AnalyticsWidget data={analytics} loading={analyticsLoading} />
              </div>

              {/* Right Column - Activity & Quick Actions */}
              <div className="space-y-6 lg:space-y-8">
                <QuickActions setActiveSection={setActiveSection} />
                <ActivityFeed />
              </div>
            </div>
          </div>
        );
    }
  };

  // Show loading spinner while authentication is in progress
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated or not a buyer
  if (!user || (userProfile && userProfile.role !== 'buyer')) {
    navigate('/authentication-login-register');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)] relative">
        {/* Sidebar */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 bg-muted/5">
          {/* Mobile Header Toolbar */}
          <div className="lg:hidden sticky top-[64px] z-30 bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            >
              <Icon name="Menu" size={24} />
            </button>
            <span className="font-heading font-black text-lg tracking-tight text-foreground uppercase">
              {activeSection}
            </span>
            <NotificationCenter />
          </div>

          {/* Desktop Breadcrumb & Title */}
          <div className="hidden lg:block sticky top-[64px] z-30 bg-card/80 backdrop-blur-md border-b border-border px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div>
                <nav className="flex mb-2" aria-label="Breadcrumb">
                  <ol className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                    <li>Dashboard</li>
                    <Icon name="ChevronRight" size={8} />
                    <li className="text-primary">{activeSection}</li>
                  </ol>
                </nav>
                <h1 className="text-2xl font-heading font-black text-foreground tracking-tight">
                  {language === 'en' ? 'Welcome Back,' : 'સ્વાગત છે,'} {userProfile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded-xl px-6 h-10 font-bold shadow-lg shadow-primary/25"
                  onClick={() => navigate('/property-listings-search')}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  {language === 'en' ? 'New Search' : 'નવી શોધ'}
                </Button>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6 lg:p-10 max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;