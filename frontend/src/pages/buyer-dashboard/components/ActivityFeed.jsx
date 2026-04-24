import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import propertyViewService from '../../../utils/propertyViewService';
import inquiryService from '../../../utils/inquiryService';

const ActivityFeed = () => {
  const [language, setLanguage] = useState('en');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    if (user?.id) {
      fetchActivities();
    }
  }, [user]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const [viewedRes, inquiriesRes] = await Promise.all([
        propertyViewService.getViewedProperties(user.id),
        inquiryService.getInquiriesBySender(user.id)
      ]);

      let mergedActivities = [];

      // Add viewed properties to activities
      if (viewedRes.success && viewedRes.data) {
        viewedRes.data.slice(0, 3).forEach(item => {
          if (item.property) {
            mergedActivities.push({
              id: `view-${item.id}`,
              type: 'property_viewed',
              title: item.property.title,
              description: 'You viewed this property',
              image: item.property.images?.[0] || 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg',
              timestamp: new Date(item.viewed_at),
              icon: 'Eye',
              color: 'text-blue-500',
              raw_date: item.viewed_at
            });
          }
        });
      }

      // Add inquiries to activities
      if (inquiriesRes.success && inquiriesRes.data) {
        inquiriesRes.data.slice(0, 3).forEach(item => {
          mergedActivities.push({
            id: `inq-${item._id}`,
            type: item.status === 'responded' ? 'inquiry_response' : 'new_listing', // Using status to distinguish
            title: item.property_id?.title || 'Property Inquiry',
            description: item.status === 'responded' ? 'Seller responded to your inquiry' : 'You sent an inquiry',
            image: item.property_id?.images?.[0] || 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
            timestamp: new Date(item.created_at),
            icon: item.status === 'responded' ? 'MessageCircle' : 'Send',
            color: item.status === 'responded' ? 'text-green-500' : 'text-primary',
            raw_date: item.created_at
          });
        });
      }

      // Sort by date descending
      mergedActivities.sort((a, b) => new Date(b.raw_date) - new Date(a.raw_date));

      setActivities(mergedActivities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + (language === 'en' ? " years ago" : " વર્ષ પહેલા");
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + (language === 'en' ? " months ago" : " મહિના પહેલા");
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + (language === 'en' ? " days ago" : " દિવસો પહેલા");
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + (language === 'en' ? " hours ago" : " કલાક પહેલા");
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + (language === 'en' ? " minutes ago" : " મિનિટ પહેલા");
    return Math.floor(seconds) + (language === 'en' ? " seconds ago" : " સેકન્ડ પહેલા");
  };

  const getActivityText = (activity) => {
    switch (activity.type) {
      case 'property_viewed':
        return language === 'en' ? 'You viewed this property' : 'તમે આ પ્રોપર્ટી જોઈ';
      case 'inquiry_response':
        return language === 'en' ? 'Seller responded to your inquiry' : 'વેચનારે તમારી પૂછપરછનો જવાબ આપ્યો';
      case 'property_saved':
        return language === 'en' ? 'You saved this property' : 'તમે આ પ્રોપર્ટી સાચવી';
      default:
        return activity.description;
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
        <h3 className="text-lg font-heading font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-elevation-1 overflow-hidden transition-all hover:shadow-elevation-2">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-heading font-black text-foreground tracking-tight">
            {language === 'en' ? 'Activity Feed' : 'પ્રવૃત્તિ ફીડ'}
          </h3>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mt-1 opacity-70">Real-time updates</p>
        </div>
        <button className="p-2 hover:bg-muted rounded-full text-primary transition-colors">
          <Icon name="RefreshCw" size={16} onClick={fetchActivities} />
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" size={32} className="text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground font-medium">
            {language === 'en' ? 'No recent activity yet' : 'હજુ સુધી કોઈ તાજેતરની પ્રવૃત્તિ નથી'}
          </p>
          <button className="text-sm text-primary font-bold mt-2 hover:underline">Start browsing</button>
        </div>
      ) : (
        <div className="space-y-2 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/50 before:z-0">
          {activities.map((activity) => (
            <div key={activity.id} className="group flex items-start space-x-4 p-4 rounded-2xl hover:bg-muted/50 transition-all duration-300 relative z-10 cursor-pointer">
              {/* Icon Container */}
              <div className={`p-2.5 rounded-xl bg-card border border-border shadow-sm group-hover:scale-110 transition-transform ${activity.color}`}>
                <Icon name={activity.icon} size={18} />
              </div>

              {/* Content Container */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-medium">
                      {getActivityText(activity)}
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-border">
                    <Image
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Icon name="Clock" size={12} className="text-muted-foreground/40" />
                  <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/60">
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;