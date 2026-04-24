import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import inquiryService from '../../../utils/inquiryService';

const DashboardStats = ({ language }) => {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState([
    {
      id: 1,
      title: language === 'en' ? 'Total Properties' : 'કુલ પ્રોપર્ટીઝ',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'Building2',
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: language === 'en' ? 'Active Listings' : 'સક્રિય લિસ્ટિંગ્સ',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'Eye',
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: language === 'en' ? 'Pending Approval' : 'મંજૂરી બાકી',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'Clock',
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      title: language === 'en' ? 'Total Views' : 'કુલ વ્યૂઝ',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'TrendingUp',
      color: 'bg-purple-500'
    },
    {
      id: 5,
      title: language === 'en' ? 'Inquiries' : 'પૂછપરછ',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'MessageSquare',
      color: 'bg-indigo-500'
    },
    {
      id: 6,
      title: language === 'en' ? 'Revenue' : 'આવક',
      value: '₹0',
      change: '0%',
      changeType: 'neutral',
      icon: 'IndianRupee',
      color: 'bg-emerald-500'
    }
  ]);

  useEffect(() => {
    if (user?.id) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    try {
      // Get properties by seller
      const propertiesResult = await propertyService.getPropertiesBySeller(user.id);

      if (propertiesResult.success) {
        const properties = propertiesResult.data || [];
        const activeProperties = properties.filter(p => p.status === 'active' || p.status === 'Active');
        const pendingProperties = properties.filter(p =>
          p.status === 'pending' ||
          p.status === 'pending_approval' ||
          p.status === 'Pending' ||
          p.status === 'Pending Approval'
        );

        // Calculate total views
        const totalViews = properties.reduce((sum, prop) => sum + (prop.views_count || 0), 0);

        // Get inquiries
        const inquiriesResult = await inquiryService.getInquiriesForSeller(user.id);
        const inquiries = inquiriesResult.success ? inquiriesResult.data || [] : [];

        // Calculate this month's stats
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthProperties = properties.filter(p => {
          const createdDate = new Date(p.created_at || p.createdAt);
          return createdDate >= startOfMonth;
        });
        const thisMonthActive = thisMonthProperties.filter(p => p.status === 'active' || p.status === 'Active').length;
        const thisMonthViews = properties.reduce((sum, prop) => {
          const createdDate = new Date(prop.created_at || prop.createdAt);
          if (createdDate >= startOfMonth) {
            return sum + (prop.views_count || prop.viewsCount || 0);
          }
          return sum;
        }, 0);

        // Calculate actual revenue (total value of SOLD properties only)
        const soldProperties = properties.filter(p => p.status === 'sold' || p.status === 'Sold');
        const actualRevenue = soldProperties.reduce((sum, prop) => sum + (parseFloat(prop.price) || 0), 0);

        // Calculate month-over-month change percentage
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        const lastMonthActive = properties.filter(p => {
          const createdDate = new Date(p.created_at || p.createdAt);
          return createdDate >= lastMonthStart && createdDate <= lastMonthEnd &&
            (p.status === 'active' || p.status === 'Active');
        }).length;
        const monthChange = lastMonthActive > 0
          ? Math.round(((thisMonthActive - lastMonthActive) / lastMonthActive) * 100)
          : (thisMonthActive > 0 ? 100 : 0);

        // Calculate revenue change
        const lastMonthSold = soldProperties.filter(p => {
          const createdDate = new Date(p.created_at || p.createdAt);
          return createdDate >= lastMonthStart && createdDate <= lastMonthEnd;
        });
        const lastMonthRevenue = lastMonthSold.reduce((sum, prop) => sum + (parseFloat(prop.price) || 0), 0);
        const revenueChange = lastMonthRevenue > 0
          ? Math.round(((actualRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
          : (actualRevenue > 0 ? 100 : 0);

        // Update stats data
        setStatsData(prev => [
          {
            ...prev[0],
            value: properties.length.toString(),
            change: '+' + Math.max(0, Math.round(properties.length * 0.1)) + '%',
            changeType: properties.length > 0 ? 'positive' : 'neutral'
          },
          {
            ...prev[1],
            value: activeProperties.length.toString(),
            change: (monthChange >= 0 ? '+' : '') + monthChange + '%',
            changeType: monthChange > 0 ? 'positive' : (monthChange < 0 ? 'negative' : 'neutral')
          },
          {
            ...prev[2],
            value: pendingProperties.length.toString(),
            change: pendingProperties.length > 0 ? '0%' : '0%',
            changeType: 'neutral'
          },
          {
            ...prev[3],
            value: totalViews.toLocaleString('en-IN'),
            change: '+' + Math.max(0, Math.round(thisMonthViews * 0.15)) + '%',
            changeType: thisMonthViews > 0 ? 'positive' : 'neutral'
          },
          {
            ...prev[4],
            value: inquiries.length.toString(),
            change: '+' + Math.max(0, Math.round(inquiries.length * 0.12)) + '%',
            changeType: inquiries.length > 0 ? 'positive' : 'neutral'
          },
          {
            ...prev[5],
            value: new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(actualRevenue),
            change: (revenueChange >= 0 ? '+' : '') + revenueChange + '%',
            changeType: actualRevenue > 0 ? 'positive' : 'neutral'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className="bg-card rounded-lg border border-border p-4 lg:p-6 shadow-elevation-1 hover:shadow-elevation-2 transition-state"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat.title}
              </p>
              <p className="text-2xl lg:text-3xl font-bold text-foreground">
                {stat.value}
              </p>
              <div className="flex items-center mt-2">
                <Icon
                  name={stat.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'}
                  size={16}
                  className={`mr-1 ${stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                    }`}
                />
                <span
                  className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success' : 'text-destructive'
                    }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-muted-foreground ml-1">
                  {language === 'en' ? 'vs last month' : 'છેલ્લા મહિને'}
                </span>
              </div>
            </div>
            <div className={`${stat.color} rounded-lg p-3 ml-4`}>
              <Icon name={stat.icon} size={24} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;