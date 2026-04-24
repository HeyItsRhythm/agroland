import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Icon from '../AppIcon';
import Button from './Button';
import NotificationCenter from '../NotificationCenter';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userProfile, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        navigate('/home-landing-page');
      }
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const handleProfileClick = () => {
    if (!user) return;
    const role = userProfile?.role || user.user_metadata?.role || localStorage.getItem('userRole');

    if (role === 'seller') {
      navigate('/seller-dashboard/profile');
    } else if (role === 'buyer') {
      navigate('/buyer-dashboard', { state: { section: 'profile' } });
    } else if (role === 'admin') {
      navigate('/admin-dashboard/settings');
    } else {
      navigate('/home-landing-page');
    }
  };

  const navigationItems = [
    {
      label: language === 'en' ? 'Home' : 'હોમ',
      path: '/home-landing-page',
      icon: 'Home',
      requiresAuth: false
    },
    {
      label: language === 'en' ? 'Properties' : 'પ્રોપર્ટીઝ',
      path: '/property-listings-search',
      icon: 'Building2',
      requiresAuth: false
    },
    {
      label: language === 'en' ? 'About Us' : 'અમારા વિશે',
      path: '/about-us',
      icon: 'Users',
      requiresAuth: false
    },
    {
      label: language === 'en' ? 'Contact' : 'સંપર્ક',
      path: '/contact-us',
      icon: 'Phone',
      requiresAuth: false
    }
  ];

  const dashboardItems = [
    {
      label: language === 'en' ? 'Buyer Dashboard' : 'ખરીદદાર ડેશબોર્ડ',
      path: '/buyer-dashboard',
      icon: 'ShoppingCart',
      requiresAuth: true,
      allowedRoles: ['buyer']
    },
    {
      label: language === 'en' ? 'Seller Dashboard' : 'વેચનાર ડેશબોર્ડ',
      path: '/seller-dashboard',
      icon: 'Store',
      requiresAuth: true,
      allowedRoles: ['seller']
    },
    {
      label: language === 'en' ? 'Admin Dashboard' : 'એડમિન ડેશબોર્ડ',
      path: '/admin-dashboard',
      icon: 'Shield',
      requiresAuth: true,
      allowedRoles: ['admin']
    }
  ];

  const getVisibleItems = () => {
    if (user && userProfile?.role) {
      const dashboardItem = dashboardItems.find(item =>
        item.allowedRoles.includes(userProfile.role)
      );
      return [...navigationItems.slice(0, 2), dashboardItem, ...navigationItems.slice(2)].filter(Boolean);
    }
    return navigationItems;
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-[1000] w-full bg-card border-b border-border shadow-elevation-1">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link to="/home-landing-page" className="flex items-center">
            <img
              src="/assets/images/logo.jpg"
              alt="AgroLand Portal"
              className="h-14 w-14 object-cover rounded-full hover:opacity-90 transition-opacity"
              fetchpriority="high"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {getVisibleItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro hover:bg-accent hover:text-accent-foreground ${isActivePath(item.path)
                  ? 'text-primary bg-accent' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Authentication */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="font-caption"
            >
              {language === 'en' ? 'ગુ' : 'EN'}
            </Button>

            {/* Notifications */}
            {user && <NotificationCenter />}

            {/* Authentication */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div
                  className="flex items-center space-x-3 text-sm font-medium text-foreground cursor-pointer hover:opacity-80 cursor-pointer transition-opacity"
                  onClick={handleProfileClick}
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border bg-muted flex-shrink-0">
                    {userProfile?.avatar_url && (
                      <img
                        src={userProfile.avatar_url}
                        alt={userProfile.full_name || 'User'}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentNode.querySelector('.fallback-icon');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          e.target.style.opacity = '1';
                          const fallback = e.target.parentNode.querySelector('.fallback-icon');
                          if (fallback) fallback.style.opacity = '0';
                        }}
                        style={{ opacity: 0 }}
                      />
                    )}
                    <div
                      className="fallback-icon absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted transition-opacity duration-300"
                    >
                      <Icon name="User" size={16} />
                    </div>
                  </div>
                  <span className="hidden sm:inline-block truncate max-w-[120px]">
                    {userProfile?.full_name || user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  iconName="LogOut"
                  iconPosition="left"
                >
                  {language === 'en' ? 'Logout' : 'લોગઆઉટ'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/authentication-login-register?mode=login">
                  <Button variant="ghost" size="sm">
                    {language === 'en' ? 'Login' : 'લોગિન'}
                  </Button>
                </Link>
                <Link to="/authentication-login-register?mode=register">
                  <Button variant="default" size="sm">
                    {language === 'en' ? 'Sign Up' : 'સાઇન અપ'}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="font-caption"
            >
              {language === 'en' ? 'ગુ' : 'EN'}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? (language === 'en' ? 'Close Menu' : 'મેનૂ બંધ કરો') : (language === 'en' ? 'Open Menu' : 'મેનૂ ખોલો')}
            >
              <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-[2000] bg-card border-t border-border animate-slide-down overflow-y-auto pb-20 shadow-2xl">
            <nav className="p-4 space-y-2">
              {getVisibleItems().map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${isActivePath(item.path)
                    ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                >
                  <div className={`p-2 rounded-lg ${isActivePath(item.path) ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Icon name={item.icon} size={20} />
                  </div>
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Mobile Authentication */}
              <div className="pt-6 border-t border-border mt-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 px-4 py-4 bg-muted/40 rounded-2xl">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 bg-muted flex-shrink-0 relative">
                        {userProfile?.avatar_url && (
                          <img
                            src={userProfile.avatar_url}
                            alt={userProfile.full_name || 'User'}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                            onLoad={(e) => {
                              e.target.style.opacity = '1';
                              const fallback = e.target.parentNode.querySelector('.fallback-icon');
                              if (fallback) fallback.style.opacity = '0';
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentNode.querySelector('.fallback-icon');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                            style={{ opacity: 0 }}
                          />
                        )}
                        <div
                          className="fallback-icon absolute inset-0 flex items-center justify-center text-muted-foreground transition-opacity duration-300"
                        >
                          <Icon name="User" size={24} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-foreground truncate">
                          {userProfile?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-muted-foreground truncate font-medium">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      iconName="LogOut"
                      iconPosition="left"
                      className="w-full justify-start py-6 text-destructive hover:bg-destructive/5 rounded-xl font-bold"
                    >
                      {language === 'en' ? 'Logout' : 'લોગઆઉટ'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 px-2">
                    <Link to="/authentication-login-register?mode=login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start h-12 font-bold rounded-xl">
                        {language === 'en' ? 'Login' : 'લોગિન'}
                      </Button>
                    </Link>
                    <Link to="/authentication-login-register?mode=register" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="default" className="w-full h-12 font-bold shadow-lg shadow-primary/20 rounded-xl">
                        {language === 'en' ? 'Sign Up' : 'સાઇન અપ'}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;