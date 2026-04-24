import React from 'react';

const AuthTabs = ({ activeTab, onTabChange, language }) => {
  const tabs = [
    {
      id: 'login',
      label: language === 'en' ? 'Sign In' : 'સાઇન ઇન',
      icon: 'LogIn'
    },
    {
      id: 'register',
      label: language === 'en' ? 'Register' : 'નોંધણી',
      icon: 'UserPlus'
    }
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-micro ${
            activeTab === tab.id
              ? 'bg-card text-foreground shadow-elevation-1'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;