import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import DashboardStats from './components/DashboardStats';
import PropertyTable from './components/PropertyTable';
import AnalyticsChart from './components/AnalyticsChart';
import Sidebar from './components/Sidebar';
import NotificationCenter from '../../components/NotificationCenter';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import propertyService from '../../utils/propertyService';
import inquiryService from '../../utils/inquiryService';

const SellerDashboard = () => {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardStats, setDashboardStats] = useState({
    propertiesCount: 0,
    inquiriesCount: 0,
    newInquiriesCount: 0,
    activeListings: 0,
    totalViews: 0,
    monthChange: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    // Initialize defaults
    let properties = [];
    let inquiries = [];

    // Fetch Properties
    try {
      const propsResult = await propertyService.getPropertiesBySeller(user.id);
      if (propsResult.success) {
        properties = propsResult.data || [];
      } else {
        console.warn("Failed to load seller properties:", propsResult.error);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    }

    // Fetch Inquiries (Fail safely)
    try {
      const inquiriesResult = await inquiryService.getInquiriesForSeller(user.id);
      if (inquiriesResult.success) {
        inquiries = inquiriesResult.data || [];
      } else {
        // Log but don't crash - likely schema/RLS issue or no inquiries yet
        console.warn("Failed to load seller inquiries (non-fatal):", inquiriesResult.error);
      }
    } catch (err) {
      console.warn("Error fetching inquiries:", err);
    }

    // Calculate Stats
    const activeProps = properties.filter(p => p.status === 'active' || p.status === 'Active');
    const newInquiries = inquiries.filter(i => i.status === 'new');
    const totalViews = properties.reduce((sum, p) => sum + (p.views_count || 0), 0);

    // Month Change Calculation
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthViews = properties.reduce((sum, p) => {
      return (new Date(p.created_at) >= startOfMonth) ? sum + (p.views_count || 0) : sum;
    }, 0); // Simplified view calculation based on property creation date as view logs don't exist

    // Better Approximation: Recent properties (this month vs last month count)
    const thisMonthProps = properties.filter(p => new Date(p.created_at) >= startOfMonth).length;
    const lastMonthProps = properties.filter(p => {
      const d = new Date(p.created_at);
      return d >= startOfLastMonth && d <= endOfLastMonth;
    }).length;

    const monthChange = lastMonthProps > 0
      ? Math.round(((thisMonthProps - lastMonthProps) / lastMonthProps) * 100)
      : (thisMonthProps > 0 ? 100 : 0);


    setDashboardStats({
      propertiesCount: properties.length,
      inquiriesCount: inquiries.length,
      newInquiriesCount: newInquiries.length,
      activeListings: activeProps.length,
      totalViews: totalViews,
      monthChange: monthChange
    });

    // Synthesize Recent Activity
    let activities = [];

    // Add recent inquiries
    inquiries.slice(0, 3).forEach(inq => {
      activities.push({
        id: `inq-${inq.id}`,
        type: 'inquiry',
        message: language === 'en'
          ? `New inquiry for "${inq.property?.title || 'Property'}"`
          : `"${inq.property?.title || 'પ્રોપર્ટી'}" માટે નવી પૂછપરછ`,
        time: new Date(inq.created_at),
        icon: 'MessageSquare',
        color: 'text-blue-500'
      });
    });

    // Add recent property updates
    properties.slice(0, 3).forEach(prop => {
      if (prop.status === 'active') {
        activities.push({
          id: `prop-${prop.id}`,
          type: 'approval',
          message: language === 'en'
            ? `Property "${prop.title}" is now active`
            : `પ્રોપર્ટી "${prop.title}" હવે સક્રિય છે`,
          time: new Date(prop.created_at), // Using created_at as proxy for approval time
          icon: 'CheckCircle',
          color: 'text-emerald-500'
        });
      }
    });

    // Sort by time descending and take top 5
    activities.sort((a, b) => b.time - a.time);
    setRecentActivity(activities.slice(0, 5));
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "just now";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'gu-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (language === 'en') {
      if (hour < 12) return 'Good Morning';
      if (hour < 17) return 'Good Afternoon';
      return 'Good Evening';
    } else {
      if (hour < 12) return 'સુપ્રભાત';
      if (hour < 17) return 'શુભ બપોર';
      return 'શુભ સાંજ';
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

  // Redirect if not authenticated or not a seller
  const storedRole = localStorage.getItem('userRole');
  const userRole = storedRole || userProfile?.role || user?.user_metadata?.role || user?.app_metadata?.role;

  if (!user) {
    navigate('/authentication-login-register');
    return null;
  }

  if (userRole && userRole !== 'seller') {
    if (userRole === 'admin') navigate('/admin-dashboard');
    else if (userRole === 'buyer') navigate('/buyer-dashboard');
    else navigate('/home-landing-page');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Seller Dashboard - AgroLand Portal' : 'વેચનાર ડેશબોર્ડ - એગ્રોલેન્ડ પોર્ટલ'}
        </title>
        <meta
          name="description"
          content={language === 'en' ? 'Manage your agricultural property listings, track performance, and analyze market engagement on AgroLand Portal' : 'એગ્રોલેન્ડ પોર્ટલ પર તમારી કૃષિ પ્રોપર્ટી લિસ્ટિંગ્સ મેનેજ કરો, પરફોર્મન્સ ટ્રેક કરો અને માર્કેટ એન્ગેજમેન્ટનું વિશ્લેષણ કરો'}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            language={language}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            stats={dashboardStats}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-0">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-16 z-30 bg-card border-b border-border p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Icon name="Menu" size={20} />
                </Button>
                <h1 className="text-lg font-semibold text-foreground">
                  {language === 'en' ? 'Dashboard' : 'ડેશબોર્ડ'}
                </h1>
                <NotificationCenter />
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
              {/* Check if we're on the main dashboard or a sub-page */}
              {location.pathname === '/seller-dashboard' ? (
                // Main Dashboard Overview
                <>
                  {/* Welcome Section */}
                  <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-lg p-6 lg:p-8 border border-border">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                          {getGreeting()}, {userProfile?.full_name ? (language === 'en' ? userProfile.full_name.split(' ')[0] + '!' : userProfile.full_name.split(' ')[0] + '!') : (language === 'en' ? 'Seller!' : 'વેચનાર!')}
                        </h1>
                        <p className="text-muted-foreground mb-1">
                          {formatDate(currentTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'en' ? 'Welcome back to your seller dashboard. Here\'s what\'s happening with your properties today.' : 'તમારા વેચનાર ડેશબોર્ડમાં પાછા આપનું સ્વાગત છે. આજે તમારી પ્રોપર્ટીઝ સાથે શું થઈ રહ્યું છે તે અહીં છે.'}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {formatTime(currentTime)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language === 'en' ? 'Current Time' : 'વર્તમાન સમય'}
                          </div>
                        </div>
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                          <Icon name="User" size={32} className="text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Stats */}
                  <DashboardStats language={language} />

                  {/* Main Dashboard Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Properties & Analytics */}
                    <div className="xl:col-span-2 space-y-6 lg:space-y-8">
                      <PropertyTable language={language} user={user} />
                      <AnalyticsChart language={language} />
                    </div>

                    {/* Right Column - Inquiries & Actions */}
                    {/* <div className="space-y-6 lg:space-y-8">
                      <RecentInquiries language={language} />
                      <QuickActions language={language} />
                    </div> */}
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-card rounded-lg border border-border shadow-elevation-1">
                    <div className="p-4 lg:p-6 border-b border-border">
                      <h3 className="text-lg font-semibold text-foreground">
                        {language === 'en' ? 'Recent Activity' : 'તાજેતરની પ્રવૃત્તિ'}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'en' ? 'Latest updates and notifications' : 'નવીનતમ અપડેટ્સ અને નોટિફિકેશન્સ'}
                      </p>
                    </div>
                    <div className="p-4 lg:p-6">
                      <div className="space-y-4">
                        {recentActivity.length > 0 ? (
                          recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                              <div className={`${activity.color} mt-1`}>
                                <Icon name={activity.icon} size={16} />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-foreground">{activity.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(activity.time)}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-muted-foreground text-sm">
                            {language === 'en' ? 'No recent activity found' : 'કોઈ તાજેતરની પ્રવૃત્તિ મળી નથી'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // Child Routes Content
                <Outlet />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;