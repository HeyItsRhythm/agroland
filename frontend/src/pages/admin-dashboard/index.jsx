import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const { language } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, userProfile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect if not admin
    if (!loading && user) {
      const userRole = userProfile?.role || user.user_metadata?.role;
      if (userRole !== 'admin') {
        navigate('/home-landing-page');
      }
    }
  }, [navigate, user, userProfile, loading]);

  const navigationItems = [
    {
      name: 'properties',
      label: language === 'en' ? 'Properties' : 'પ્રોપર્ટીઝ',
      icon: 'Building2',
      path: '/admin-dashboard/properties'
    },
    {
      name: 'users',
      label: language === 'en' ? 'Users' : 'વપરાશકર્તાઓ',
      icon: 'Users',
      path: '/admin-dashboard/users'
    },
    {
      name: 'messages',
      label: language === 'en' ? 'Messages' : 'સંદેશાઓ',
      icon: 'MessageSquare',
      path: '/admin-dashboard/messages'
    },
    {
      name: 'approvals',
      label: language === 'en' ? 'Approvals' : 'મંજૂરીઓ',
      icon: 'CheckSquare',
      path: '/admin-dashboard/approvals'
    },
    {
      name: 'analytics',
      label: language === 'en' ? 'Analytics' : 'એનાલિટિક્સ',
      icon: 'BarChart2',
      path: '/admin-dashboard/analytics'
    },
    {
      name: 'press-releases',
      label: language === 'en' ? 'Press Releases' : 'પ્રેસ રિલીઝ',
      icon: 'FileText',
      path: '/admin-dashboard/press-releases'
    },
    {
      name: 'careers',
      label: language === 'en' ? 'Careers' : 'કારકિર્દી',
      icon: 'Briefcase',
      path: '/admin-dashboard/careers'
    },
    {
      name: 'settings',
      label: language === 'en' ? 'Settings' : 'સેટિંગ્સ',
      icon: 'Settings',
      path: '/admin-dashboard/settings'
    }
  ];

  const isActive = (path) => {
    if (path === '/admin-dashboard' && location.pathname === '/admin-dashboard') {
      return true;
    }
    return location.pathname.includes(path);
  };

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        // Force a page refresh and redirect as requested
        window.location.href = '/home-landing-page';
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-card border-r border-border shrink-0`}>
        <div className="p-4 border-b border-border h-16 flex items-center justify-center">
          <h2 className="text-xl font-bold text-foreground truncate">
            {language === 'en' ? 'Admin Dashboard' : 'એડમિન ડેશબોર્ડ'}
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start ${isActive(item.path) ? 'bg-primary text-primary-foreground shadow-md' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon name={item.icon} className="mr-3" size={18} />
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => navigate('/home-landing-page')}
            >
              <Icon name="Home" className="mr-3" size={18} />
              {language === 'en' ? 'Go to Home' : 'હોમ પર જાઓ'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 mt-1"
              onClick={handleLogout}
            >
              <Icon name="LogOut" className="mr-3" size={18} />
              {language === 'en' ? 'Logout' : 'લોગઆઉટ'}
            </Button>
          </div>
        </nav>
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Icon name="User" size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{userProfile?.full_name || user?.email}</p>
              <p className="text-xs text-muted-foreground">{language === 'en' ? 'Administrator' : 'એડમિનિસ્ટ્રેટર'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Mobile sidebar content */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-border h-16 flex justify-between items-center bg-card sticky top-0">
          <h2 className="text-xl font-bold text-foreground">
            {language === 'en' ? 'Admin Panel' : 'એડમિન પેનલ'}
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="rounded-full">
            <Icon name="X" size={20} />
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              variant={isActive(item.path) ? 'default' : 'ghost'}
              className={`w-full justify-start h-12 ${isActive(item.path) ? 'bg-primary text-primary-foreground' : ''}`}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <Icon name={item.icon} className="mr-3" size={18} />
              {item.label}
            </Button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start h-12"
              onClick={() => {
                navigate('/home-landing-page');
                setSidebarOpen(false);
              }}
            >
              <Icon name="Home" className="mr-3" size={18} />
              {language === 'en' ? 'Go to Home' : 'હોમ પર જાઓ'}
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-destructive mt-1"
              onClick={() => {
                handleLogout();
                setSidebarOpen(false);
              }}
            >
              <Icon name="LogOut" className="mr-3" size={18} />
              {language === 'en' ? 'Logout' : 'લોગઆઉટ'}
            </Button>
          </div>
        </nav>
        <div className="p-6 border-t border-border bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
              <Icon name="User" size={24} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground truncate text-lg">{userProfile?.full_name?.split(' ')[0] || 'Admin'}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">{language === 'en' ? 'Admin Role' : 'એડમિન રોલ'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Universal Header (Mobile & Desktop) */}
        <header className="h-16 shrink-0 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Icon name="Menu" size={22} />
            </Button>
            <h1 className="text-lg md:text-xl font-bold text-foreground truncate max-w-[200px] md:max-w-none">
              {navigationItems.find(item => isActive(item.path))?.label || (language === 'en' ? 'Admin Dashboard' : 'એડમિન ડેશબોર્ડ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home-landing-page')}
              className="hidden sm:flex"
              title={language === 'en' ? 'Home' : 'હોમ'}
            >
              <Icon name="Home" size={18} />
            </Button>
            
            <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>
            
            <div className="flex items-center gap-2 md:gap-3 bg-muted/30 hover:bg-muted/50 transition-colors p-1 pr-3 rounded-full cursor-pointer lg:pr-4" onClick={() => navigate('/admin-dashboard/settings')}>
               <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
                <Icon name="User" size={18} />
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold leading-none mb-0.5">{userProfile?.full_name?.split(' ')[0] || 'Admin'}</p>
                <p className="text-[10px] text-muted-foreground leading-none">{language === 'en' ? 'Online' : 'ઓનલાઇન'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;