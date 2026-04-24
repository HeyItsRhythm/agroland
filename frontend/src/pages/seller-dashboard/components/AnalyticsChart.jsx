import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import inquiryService from '../../../utils/inquiryService';

const AnalyticsChart = ({ language }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('views');
  const [loading, setLoading] = useState(true);
  const [viewsData, setViewsData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadAnalyticsData();
    }
  }, [user?.id, language]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // Fetch properties and inquiries
      const [propsResult, inquiriesResult] = await Promise.all([
        propertyService.getPropertiesBySeller(user.id),
        inquiryService.getInquiriesForSeller(user.id)
      ]);

      const properties = propsResult.success ? propsResult.data : [];
      const inquiries = inquiriesResult.success ? inquiriesResult.data : [];

      // Process Monthly Data (Last 6 months)
      const months = [];
      const today = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
          date: d,
          name: d.toLocaleString(language === 'en' ? 'en-US' : 'gu-IN', { month: 'short' }),
          views: 0,
          inquiries: 0,
          revenue: 0,
          commission: 0
        });
      }

      // Aggregate Views and Inquiries
      properties.forEach(prop => {
        // Distribute views somewhat randomly across months for demo info IF no detailed view tracking exists
        // Since we only have total views, we'll simulate a curve or just put it in current month? 
        // ideally we need specific view audit logs. For now, we will assume properties created in a month get views in that month.
        const createdDate = new Date(prop.created_at);
        const monthIndex = months.findIndex(m =>
          m.date.getMonth() === createdDate.getMonth() &&
          m.date.getFullYear() === createdDate.getFullYear()
        );

        if (monthIndex >= 0) {
          months[monthIndex].views += (prop.views_count || 0);
          // Calculate potential revenue (5% of price)
          if (prop.status === 'sold' || prop.status === 'active') { // Just estimating potential
            const price = parseFloat(prop.price) || 0;
            months[monthIndex].revenue += price;
            months[monthIndex].commission += (price * 0.05); // 5% commission
          }
        }
      });

      inquiries.forEach(inq => {
        const createdDate = new Date(inq.created_at);
        const monthIndex = months.findIndex(m =>
          m.date.getMonth() === createdDate.getMonth() &&
          m.date.getFullYear() === createdDate.getFullYear()
        );
        if (monthIndex >= 0) {
          months[monthIndex].inquiries += 1;
        }
      });

      setViewsData(months);
      setRevenueData(months);

      // Process Property Types
      const typeCounts = properties.reduce((acc, prop) => {
        const type = prop.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      const totalProps = properties.length || 1;
      const typeChartData = Object.keys(typeCounts).map((type, index) => {
        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#EC4899'];
        return {
          name: type,
          value: Math.round((typeCounts[type] / totalProps) * 100),
          color: colors[index % colors.length]
        };
      });

      if (typeChartData.length === 0) {
        typeChartData.push({ name: 'No Data', value: 100, color: '#e5e7eb' });
      }

      setPropertyTypeData(typeChartData);

    } catch (error) {
      console.error('Error processing analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Generate CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    if (activeTab === 'views') {
      csvContent += "Month,Views,Inquiries\n";
      viewsData.forEach(row => {
        csvContent += `${row.name},${row.views},${row.inquiries}\n`;
      });
    } else if (activeTab === 'revenue') {
      csvContent += "Month,Revenue,Commission\n";
      revenueData.forEach(row => {
        csvContent += `${row.name},${row.revenue},${row.commission}\n`;
      });
    } else {
      csvContent += "Property Type,Percentage\n";
      propertyTypeData.forEach(row => {
        csvContent += `${row.name},${row.value}%\n`;
      });
    }

    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    {
      id: 'views',
      label: language === 'en' ? 'Views & Inquiries' : 'વ્યૂઝ અને પૂછપરછ',
      icon: 'TrendingUp'
    },
    {
      id: 'revenue',
      label: language === 'en' ? 'Revenue' : 'આવક',
      icon: 'IndianRupee'
    },
    {
      id: 'properties',
      label: language === 'en' ? 'Property Types' : 'પ્રોપર્ટી પ્રકાર',
      icon: 'PieChart'
    }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevation-2">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {
                activeTab === 'revenue'
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString('en-IN')
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {language === 'en' ? 'Analytics Overview' : 'એનાલિટિક્સ ઓવરવ્યૂ'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' ? 'Track your property performance' : 'તમારી પ્રોપર્ટીની કામગીરી ટ્રેક કરો'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Icon name="Download" size={16} className="mr-2" />
              {language === 'en' ? 'Export' : 'એક્સપોર્ટ'}
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              <Icon name={tab.icon} size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-4 lg:p-6">
        {activeTab === 'views' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  name={language === 'en' ? 'Views' : 'વ્યૂઝ'}
                />
                <Line
                  type="monotone"
                  dataKey="inquiries"
                  stroke="var(--color-secondary)"
                  strokeWidth={2}
                  name={language === 'en' ? 'Inquiries' : 'પૂછપરછ'}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-primary)"
                  name={language === 'en' ? 'Revenue' : 'આવક'}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="commission"
                  fill="var(--color-secondary)"
                  name={language === 'en' ? 'Commission' : 'કમિશન'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, language === 'en' ? 'Percentage' : 'ટકાવારી']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {propertyTypeData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-foreground">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;