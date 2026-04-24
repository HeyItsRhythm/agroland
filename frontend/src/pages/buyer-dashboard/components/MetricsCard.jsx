import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const colorClasses = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
    destructive: 'bg-destructive text-destructive-foreground'
  };

  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-state">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-heading font-bold text-foreground">
            {value}
          </p>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 mt-2 text-sm ${trendColors[trend]}`}>
              <Icon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14} 
              />
              <span>{trendValue}</span>
              <span className="text-muted-foreground">
                {language === 'en' ? 'vs last month' : 'છેલ્લા મહિને'}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.primary}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;