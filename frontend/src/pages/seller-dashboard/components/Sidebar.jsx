import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

import { useLanguage } from '../../../contexts/LanguageContext';

const Sidebar = ({ isOpen, onClose, stats = {} }) => {
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      if (onClose) onClose(); // Close sidebar immediately on mobile
      const result = await signOut();
      if (result.success) {
        // Force a page refresh and redirect to home as requested by user
        window.location.href = '/home-landing-page';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      id: 'overview',
      label: language === 'en' ? 'Overview' : 'ઓવરવ્યૂ',
      icon: 'LayoutDashboard',
      path: '/seller-dashboard'
    },
    {
      id: 'properties',
      label: language === 'en' ? 'My Properties' : 'મારી પ્રોપર્ટીઝ',
      icon: 'Building2',
      path: '/seller-dashboard/properties',
      count: stats.propertiesCount || 0
    },
    {
      id: 'add-property',
      label: language === 'en' ? 'Add Property' : 'પ્રોપર્ટી ઉમેરો',
      icon: 'Plus',
      path: '/seller-dashboard/add-property'
    },
    {
      id: 'analytics',
      label: language === 'en' ? 'Analytics' : 'એનાલિટિક્સ',
      icon: 'BarChart3',
      path: '/seller-dashboard/analytics'
    },
    {
      id: 'inquiries',
      label: language === 'en' ? 'Inquiries' : 'પૂછપરછ',
      icon: 'MessageSquare',
      path: '/seller-dashboard/inquiries',
      count: stats.inquiriesCount || 0,
      hasNew: stats.newInquiriesCount > 0
    },
    {
      id: 'profile',
      label: language === 'en' ? 'Profile' : 'પ્રોફાઇલ',
      icon: 'User',
      path: '/seller-dashboard/profile'
    },
    {
      id: 'settings',
      label: language === 'en' ? 'Settings' : 'સેટિંગ્સ',
      icon: 'Settings',
      path: '/seller-dashboard/settings'
    }
  ];

  const handleMenuClick = (item) => {
    navigate(item.path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <img 
                src="/assets/images/logo.jpg" 
                alt="AgroLand Portal" 
                className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-full border-2 border-primary/20" 
              />
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-foreground text-sm lg:text-base truncate">
                  {language === 'en' ? 'Seller Panel' : 'વેચનાર પેનલ'}
                </h2>
                <p className="text-xs text-muted-foreground truncate">
                  {language === 'en' ? 'Manage Properties' : 'પ્રોપર્ટીઝ મેનેજ કરો'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 lg:p-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Icon name={item.icon} size={18} />
                <span className="flex-1 text-left">{item.label}</span>

                {/* Count Badge */}
                {item.count && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${location.pathname === item.path
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                    }`}>
                    {item.count}
                  </span>
                )}

                {/* New Indicator */}
                {item.hasNew && (
                  <div className="w-2 h-2 bg-destructive rounded-full" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="p-4 lg:p-6 border-t border-border mt-auto">
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              {language === 'en' ? 'Quick Stats' : 'ઝડપી આંકડા'}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'en' ? 'Active Listings' : 'સક્રિય લિસ્ટિંગ્સ'}
                </span>
                <span className="font-medium text-foreground">{stats.activeListings || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'en' ? 'Total Views' : 'કુલ વ્યૂઝ'}
                </span>
                <span className="font-medium text-foreground">{stats.totalViews || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {language === 'en' ? 'This Month' : 'આ મહિને'}
                </span>
                <span className={`font-medium ${stats.monthChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {stats.monthChange > 0 ? '+' : ''}{stats.monthChange || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Logout */}
        <div className="p-4 lg:p-6 border-t border-border space-y-2">
          <Button variant="outline" className="w-full">
            <Icon name="HelpCircle" size={16} className="mr-2" />
            {language === 'en' ? 'Get Help' : 'મદદ મેળવો'}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <Icon name="LogOut" size={16} className="mr-2" />
            {language === 'en' ? 'Logout' : 'લોગઆઉટ'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;