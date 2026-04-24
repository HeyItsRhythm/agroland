import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ language = 'en', setActiveSection }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const actions = [
    {
      id: 'search',
      title: language === 'en' ? 'Property Search' : 'પ્રોપર્ટી શોધ',
      icon: 'Search',
      color: 'bg-primary/10 text-primary',
      desc: 'Market exploration'
    },
    {
      id: 'saved',
      title: language === 'en' ? 'Saved Collections' : 'સાચવેલું સંગ્રહ',
      icon: 'Heart',
      color: 'bg-destructive/10 text-destructive',
      desc: 'Your favorites'
    },
    {
      id: 'inquiries',
      title: language === 'en' ? 'My Inquiries' : 'મારી પૂછપરછ',
      icon: 'MessageSquare',
      color: 'bg-success/10 text-success',
      desc: 'Active deals'
    },
    {
      id: 'profile',
      title: language === 'en' ? 'Account Profile' : 'પ્રોફાઇલ',
      icon: 'User',
      color: 'bg-indigo-500/10 text-indigo-600',
      desc: 'Settings'
    }
  ];

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-elevation-1">
      <div className="p-5 border-b border-border bg-muted/20">
        <h3 className="font-heading font-bold text-foreground">
          {language === 'en' ? 'Quick Actions' : 'ઝડપી ક્રિયાઓ'}
        </h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => {
              if (action.id === 'search') {
                window.location.href = '/property-listings-search';
              } else {
                setActiveSection(action.id);
              }
            }}
            className="group flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 hover:bg-muted transition-all duration-300 border border-transparent hover:border-border text-center"
          >
            <div className={`p-3 rounded-full ${action.color} mb-3 group-hover:scale-110 transition-transform`}>
              <Icon name={action.icon} size={20} />
            </div>
            <span className="text-sm font-bold text-foreground block">{action.title}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{action.desc}</span>
          </button>
        ))}
      </div>
      <div className="px-5 py-4 bg-muted/10 border-t border-border">
        <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => navigate('/feedback')}>
          <Icon name="HelpCircle" size={14} className="mr-2" />
          {language === 'en' ? 'Contact Support' : 'સપોર્ટનો સંપર્ક કરો'}
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;