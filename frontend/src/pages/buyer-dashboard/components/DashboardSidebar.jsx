import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

import { useLanguage } from '../../../contexts/LanguageContext';

const DashboardSidebar = ({ isOpen, onToggle, activeSection, setActiveSection }) => {
  const { language } = useLanguage();
  const { signOut } = useAuth();

  const sidebarItems = [
    { id: 'overview', label: language === 'en' ? 'Overview' : 'ઝાંખી', icon: 'LayoutDashboard' },
    { id: 'saved', label: language === 'en' ? 'Wishlist' : 'વિશલિસ્ટ', icon: 'Heart' },
    { id: 'viewed', label: language === 'en' ? 'History' : 'ઇતિહાસ', icon: 'Clock' },
    { id: 'inquiries', label: language === 'en' ? 'Inquiries' : 'પૂછપરછ', icon: 'MessageSquare' },
    { id: 'profile', label: language === 'en' ? 'Settings' : 'સેટિંગ્સ', icon: 'UserCircle' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={onToggle}
        />
      )}

      {/* Sidebar - Fixed on mobile, sticky on desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-card border-r border-border shadow-2xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:shadow-none lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header (Mobile Only) */}
          <div className="flex lg:hidden items-center justify-between p-6 bg-muted/20 border-b border-border">
            <span className="font-heading font-black text-xl tracking-tight text-primary">AgroLand</span>
            <button onClick={onToggle} className="p-2 hover:bg-muted rounded-full transition-colors">
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto custom-scrollbar py-8 px-4 space-y-2">
            <div className="px-4 mt-4 mb-4">
              <span className="text-sm font-black uppercase tracking-[2.6px] text-muted-foreground/90">Main Menu</span>
            </div>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold
                  transition-all duration-300 group relative overflow-hidden
                  ${activeSection === item.id
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1'
                  }
                `}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`transition-transform duration-300 ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <span className="relative z-10">{item.label}</span>
                {activeSection === item.id && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                )}
              </button>
            ))}
          </div>

          {/* User Section / Logout */}
          <div className="p-6 border-t border-border bg-muted/10">
            <button
              onClick={async () => {
                const result = await signOut();
                if (result.success) window.location.href = '/home-landing-page';
              }}
              className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-sm font-bold text-destructive hover:bg-destructive/10 transition-all duration-300 group"
            >
              <div className="p-2 bg-destructive/10 rounded-lg group-hover:bg-destructive group-hover:text-white transition-colors">
                <Icon name="LogOut" size={18} />
              </div>
              <span>{language === 'en' ? 'Sign Out' : 'સાઇન આઉટ'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;