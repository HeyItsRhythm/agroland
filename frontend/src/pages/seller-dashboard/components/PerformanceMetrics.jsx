import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import inquiryService from '../../../utils/inquiryService';
import propertyViewService from '../../../utils/propertyViewService';

const PerformanceMetrics = ({ language }) => {
  const { user } = useAuth();
  const [topPerformingProperties, setTopPerformingProperties] = useState([]);
  const [engagementMetrics, setEngagementMetrics] = useState([
    {
      id: 1,
      label: language === 'en' ? 'Average Views per Property' : 'પ્રોપર્ટી દીઠ સરેરાશ વ્યૂઝ',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'Eye'
    },
    {
      id: 2,
      label: language === 'en' ? 'Inquiry Conversion Rate' : 'પૂછપરછ કન્વર્ઝન રેટ',
      value: '0%',
      change: '0%',
      changeType: 'neutral',
      icon: 'Target'
    },
    {
      id: 3,
      label: language === 'en' ? 'Response Time' : 'રિસ્પોન્સ ટાઇમ',
      value: '0h',
      change: '0h',
      changeType: 'neutral',
      icon: 'Clock'
    },
    {
      id: 4,
      label: language === 'en' ? 'Profile Views' : 'પ્રોફાઇલ વ્યૂઝ',
      value: '0',
      change: '0%',
      changeType: 'neutral',
      icon: 'User'
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPerformanceData();
    }
  }, [user, language]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      
      // Get all properties by seller
      const propertiesResult = await propertyService.getPropertiesBySeller(user.id);
      
      if (propertiesResult.success) {
        const properties = propertiesResult.data || [];
        
        // Calculate total views and sort properties by views
        let totalViews = 0;
        let propertiesWithViews = properties.map(property => {
          const views = property.views_count || 0;
          totalViews += views;
          return { ...property, views };
        });
        
        // Sort by views (descending)
        propertiesWithViews.sort((a, b) => b.views - a.views);
        
        // Get inquiries for all properties
        const inquiriesResult = await inquiryService.getInquiriesForSeller(user.id);
        const inquiries = inquiriesResult.success ? inquiriesResult.data || [] : [];
        
        // Map inquiries to properties
        const propertyInquiryCounts = {};
        inquiries.forEach(inquiry => {
          const propertyId = inquiry.property?.id;
          if (propertyId) {
            propertyInquiryCounts[propertyId] = (propertyInquiryCounts[propertyId] || 0) + 1;
          }
        });
        
        // Add inquiry counts to properties
        propertiesWithViews = propertiesWithViews.map(property => {
          const inquiries = propertyInquiryCounts[property.id] || 0;
          return { ...property, inquiries };
        });
        
        // Take top 3 performing properties
        const topProperties = propertiesWithViews.slice(0, 3).map((property, index) => {
          // Calculate growth percentages (simulated for now)
          const viewsGrowth = `+${Math.floor(Math.random() * 20)}%`;
          const inquiriesGrowth = `+${Math.floor(Math.random() * 15)}%`;
          
          return {
            id: property.id,
            title: language === 'en' ? property.title : property.title_gu || property.title,
            location: language === 'en' 
              ? `${property.location_village || ''}, ${property.location_district || 'Gujarat'}` 
              : `${property.location_village_gu || property.location_village || ''}, ${property.location_district_gu || property.location_district || 'ગુજરાત'}`,
            image: property.images && property.images.length > 0 ? property.images[0] : 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=400',
            views: property.views || 0,
            inquiries: property.inquiries || 0,
            viewsGrowth,
            inquiriesGrowth,
            price: `₹${(property.price || 0).toLocaleString('en-IN')}`,
            area: `${property.area || 0} ${property.area_unit || 'Acres'}`
          };
        });
        
        setTopPerformingProperties(topProperties);
        
        // Calculate engagement metrics
        const avgViewsPerProperty = properties.length > 0 ? Math.round(totalViews / properties.length) : 0;
        const inquiryConversionRate = totalViews > 0 ? ((inquiries.length / totalViews) * 100).toFixed(1) : 0;
        
        // Calculate average response time (simulated for now)
        const respondedInquiries = inquiries.filter(i => i.status === 'responded');
        const avgResponseTime = respondedInquiries.length > 0 ? 2.3 : 0; // Simulated value
        
        // Update engagement metrics
        setEngagementMetrics([
          {
            id: 1,
            label: language === 'en' ? 'Average Views per Property' : 'પ્રોપર્ટી દીઠ સરેરાશ વ્યૂઝ',
            value: avgViewsPerProperty.toString(),
            change: '+12%', // Simulated growth
            changeType: 'positive',
            icon: 'Eye'
          },
          {
            id: 2,
            label: language === 'en' ? 'Inquiry Conversion Rate' : 'પૂછપરછ કન્વર્ઝન રેટ',
            value: `${inquiryConversionRate}%`,
            change: '+2.1%', // Simulated growth
            changeType: 'positive',
            icon: 'Target'
          },
          {
            id: 3,
            label: language === 'en' ? 'Response Time' : 'રિસ્પોન્સ ટાઇમ',
            value: `${avgResponseTime.toFixed(1)}h`,
            change: '-0.5h', // Simulated improvement
            changeType: 'positive',
            icon: 'Clock'
          },
          {
            id: 4,
            label: language === 'en' ? 'Profile Views' : 'પ્રોફાઇલ વ્યૂઝ',
            value: (totalViews * 2).toString(), // Simulated profile views
            change: '+24%', // Simulated growth
            changeType: 'positive',
            icon: 'User'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading performance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Performing Properties */}
      <div className="bg-card rounded-lg border border-border shadow-elevation-1">
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'en' ? 'Top Performing Properties' : 'ટોપ પરફોર્મિંગ પ્રોપર્ટીઝ'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'en' ? 'Properties with highest engagement' : 'સૌથી વધુ એન્ગેજમેન્ટ વાળી પ્રોપર્ટીઝ'}
              </p>
            </div>
            <Icon name="Award" size={20} className="text-warning" />
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Icon name="Loader2" size={24} className="animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                {language === 'en' ? 'Loading properties...' : 'પ્રોપર્ટીઝ લોડ થઈ રહી છે...'}
              </span>
            </div>
          ) : topPerformingProperties.length === 0 ? (
            <div className="text-center p-8">
              <Icon name="FileQuestion" size={40} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === 'en' ? 'No properties found. Add properties to see performance metrics.' : 'કોઈ પ્રોપર્ટીઝ મળી નથી. પરફોર્મન્સ મેટ્રિક્સ જોવા માટે પ્રોપર્ટીઝ ઉમેરો.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topPerformingProperties.map((property, index) => (
                <div key={property.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Property Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{property.title}</h4>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-semibold text-foreground">{property.price}</span>
                      <span className="text-sm text-muted-foreground">{property.area}</span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Icon name="Eye" size={14} />
                        <span>{property.views}</span>
                      </div>
                      <span className="text-xs text-success">{property.viewsGrowth}</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <Icon name="MessageSquare" size={14} />
                        <span>{property.inquiries}</span>
                      </div>
                      <span className="text-xs text-success">{property.inquiriesGrowth}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-card rounded-lg border border-border shadow-elevation-1">
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'en' ? 'Engagement Metrics' : 'એન્ગેજમેન્ટ મેટ્રિક્સ'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'en' ? 'Track your overall performance' : 'તમારી એકંદર કામગીરી ટ્રેક કરો'}
              </p>
            </div>
            <Icon name="BarChart3" size={20} className="text-primary" />
          </div>
        </div>

        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Icon name="Loader2" size={24} className="animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                {language === 'en' ? 'Loading metrics...' : 'મેટ્રિક્સ લોડ થઈ રહી છે...'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {engagementMetrics.map((metric) => (
                <div key={metric.id} className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <Icon name={metric.icon} size={20} className="text-primary" />
                    <span className={`text-sm font-medium ${
                      metric.changeType === 'positive' ? 'text-success' : 'text-destructive'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;