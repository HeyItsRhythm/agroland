import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import propertyService from '../../../utils/propertyService';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SellerAnalytics = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    views: 0,
    inquiries: 0,
    properties: 0,
    active: 0
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewsChartData, setViewsChartData] = useState([]);
  const [inquiriesChartData, setInquiriesChartData] = useState([]);

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics();
    }
  }, [user?.id]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch aggregated analytics
      const analyticsResult = await propertyService.getSellerAnalytics(user.id);

      if (analyticsResult.success) {
        setStats({
          views: analyticsResult.data.totalViews,
          inquiries: analyticsResult.data.totalInquiries,
          properties: analyticsResult.data.totalProperties,
          active: analyticsResult.data.activeProperties
        });
      }

      // Fetch properties for the table
      const propertiesResult = await propertyService.getPropertiesBySeller(user.id);
      if (propertiesResult.success) {
        const propertiesData = propertiesResult.data || [];
        setProperties(propertiesData);

        // Process data for charts
        // Views Chart Data - Bar chart showing views per property
        const viewsData = propertiesData
          .slice(0, 5) // Top 5 properties
          .map(prop => ({
            name: prop.title?.substring(0, 20) + '...' || 'Property',
            views: prop.views_count || 0
          }));
        setViewsChartData(viewsData);

        // Inquiries Chart Data - Pie chart (mock data for now, can be enhanced)
        const totalInquiries = propertiesData.reduce((sum, prop) => sum + (prop.inquiries_count || 0), 0);
        const inquiriesData = propertiesData
          .filter(prop => (prop.inquiries_count || 0) > 0)
          .slice(0, 5)
          .map(prop => ({
            name: prop.title?.substring(0, 15) + '...' || 'Property',
            value: prop.inquiries_count || 0
          }));

        // If no inquiries, show placeholder data
        if (inquiriesData.length === 0) {
          setInquiriesChartData([{ name: 'No Data', value: 1 }]);
        } else {
          setInquiriesChartData(inquiriesData);
        }
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Analytics - Seller Dashboard' : 'એનાલિટિક્સ - વેચનાર ડેશબોર્ડ'}
        </title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {language === 'en' ? 'Analytics Dashboard' : 'એનાલિટિક્સ ડેશબોર્ડ'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'en' ? 'Track your property performance and market insights' : 'તમારી પ્રોપર્ટીની પરફોર્મન્સ અને માર્કેટની સમજ ટ્રેક કરો'}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: language === 'en' ? 'Total Views' : 'કુલ વ્યૂઝ',
              value: stats.views,
              icon: 'Eye',
              color: 'text-blue-500'
            },
            {
              title: language === 'en' ? 'Inquiries' : 'પૂછપરછ',
              value: stats.inquiries,
              icon: 'MessageSquare',
              color: 'text-green-500'
            },
            {
              title: language === 'en' ? 'Total Properties' : 'કુલ પ્રોપર્ટીઝ',
              value: stats.properties,
              icon: 'Building',
              color: 'text-purple-500'
            },
            {
              title: language === 'en' ? 'Active Listings' : 'સક્રિય લિસ્ટિંગ્સ',
              value: stats.active,
              icon: 'CheckCircle',
              color: 'text-orange-500'
            }
          ].map((metric, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center`}>
                  <Icon name={metric.icon} size={24} className={metric.color} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {loading ? '-' : metric.value}
              </h3>
              <p className="text-sm text-muted-foreground">
                {metric.title}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Views Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {language === 'en' ? 'Property Views Trend' : 'પ્રોપર્ટી વ્યૂઝ ટ્રેન્ડ'}
            </h3>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : viewsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="views"
                      fill="#2563EB"
                      name={language === 'en' ? 'Views' : 'વ્યૂઝ'}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="BarChart3" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'en' ? 'No views data available' : 'કોઈ વ્યૂઝ ડેટા ઉપલબ્ધ નથી'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Inquiries Chart */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {language === 'en' ? 'Inquiries by Property' : 'પ્રોપર્ટી દ્વારા પૂછપરછ'}
            </h3>
            <div className="h-64">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : inquiriesChartData.length > 0 && inquiriesChartData[0].name !== 'No Data' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={inquiriesChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {inquiriesChartData.map((entry, index) => {
                        const colors = ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#8B5CF6'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="PieChart" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === 'en' ? 'No inquiries data available' : 'કોઈ પૂછપરછ ડેટા ઉપલબ્ધ નથી'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Table */}
        <div className="bg-card border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">
              {language === 'en' ? 'Property Performance' : 'પ્રોપર્ટી પરફોર્મન્સ'}
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      {language === 'en' ? 'Property' : 'પ્રોપર્ટી'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      {language === 'en' ? 'Views' : 'વ્યૂઝ'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      {language === 'en' ? 'Inquiries' : 'પૂછપરછ'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-foreground">
                      {language === 'en' ? 'Status' : 'સ્થિતિ'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted-foreground">
                        {language === 'en' ? 'Loading data...' : 'ડેટા લોડ કરી રહ્યું છે...'}
                      </td>
                    </tr>
                  ) : properties.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted-foreground">
                        {language === 'en' ? 'No properties found' : 'કોઈ પ્રોપર્ટી મળી નથી'}
                      </td>
                    </tr>
                  ) : (
                    properties.map((property, index) => (
                      <tr key={property.id || index} className="border-b border-border">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-foreground">{property.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {property.location_village}, {property.location_district}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground">{property.views_count || 0}</td>
                        <td className="py-3 px-4 text-foreground">-</td> {/* Inquiries count needs join, defaulting to - for now */}
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${property.status === 'active'
                            ? 'bg-success/20 text-success'
                            : 'bg-warning/20 text-warning'
                            }`}>
                            {property.status === 'active'
                              ? (language === 'en' ? 'Active' : 'સક્રિય')
                              : (language === 'en' ? 'Pending' : 'પેન્ડિંગ')
                            }
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerAnalytics; 