import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const AnalyticsWidget = ({ data, loading }) => {
  const [language, setLanguage] = useState('en');
  const [activeChart, setActiveChart] = useState('search');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 shadow-elevation-1 min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="Loader2" size={40} className="animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium italic">Crunching your property data...</p>
        </div>
      </div>
    );
  }

  // Use trends from data or fallback to defaults
  const searchPatternsData = data?.trends?.length > 0 ? data.trends : [
    { month: 'Jan', searches: 4 },
    { month: 'Feb', searches: 7 },
    { month: 'Mar', searches: 5 },
    { month: 'Apr', searches: 12 },
    { month: 'May', searches: 15 },
    { month: 'Jun', searches: 18 }
  ];

  // Map price distribution from backend
  const colors = ['#2563EB', '#059669', '#F59E0B', '#DC2626'];
  const priceRangeData = data?.priceDistribution?.length > 0
    ? data.priceDistribution.map((db, i) => ({
      range: db._id,
      count: db.count,
      color: colors[i % colors.length]
    }))
    : [
      { range: '₹10L-25L', count: 12, color: colors[0] },
      { range: '₹25L-50L', count: 8, color: colors[1] }
    ];

  const marketTrendsData = data?.marketTrends?.length > 0 ? data.marketTrends : [
    { month: 'Jan', avgPrice: 2500000 },
    { month: 'Feb', avgPrice: 2650000 },
    { month: 'Mar', avgPrice: 2580000 },
    { month: 'Apr', avgPrice: 2720000 },
    { month: 'May', avgPrice: 2800000 },
    { month: 'Jun', avgPrice: 2750000 }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(price);
  };

  const chartTabs = [
    { id: 'search', label: language === 'en' ? 'Search Trends' : 'શોધ ટ્રેન્ડ', icon: 'TrendingUp' },
    { id: 'price', label: language === 'en' ? 'Price Spread' : 'કિંમત ફેલાવો', icon: 'PieChart' },
    { id: 'market', label: language === 'en' ? 'Market Value' : 'બજાર મૂલ્ય', icon: 'LayoutDashboard' }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'search':
        return (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={searchPatternsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="searches" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'price':
        return (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={priceRangeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="count">
                {priceRangeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'market':
        return (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={marketTrendsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={formatPrice} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
              <Line type="monotone" dataKey="avgPrice" stroke="#2563EB" strokeWidth={4} dot={{ r: 6, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      default: return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 shadow-elevation-1 overflow-hidden transition-all hover:shadow-elevation-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-heading font-black text-foreground tracking-tight">
            {language === 'en' ? 'Growth Insights' : 'વૃદ્ધિ આંતરદૃષ્ટિ'}
          </h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1 opacity-70">Data driven analysis</p>
        </div>
        <div className="flex items-center bg-muted/30 p-1 rounded-xl border border-border/50">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeChart === tab.id ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon name={tab.icon} size={14} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[240px]">
        {renderChart()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-border/50">
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[2px] text-muted-foreground mb-4">Market Stats</h4>
          <div className="grid grid-cols-2 gap-4">
            {priceRangeData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold text-foreground/80">{item.range}</span>
                <span className="text-xs font-medium text-muted-foreground">({item.count})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <Icon name="Zap" size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-primary">Smart Tip</span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            {language === 'en' ? (
              data?.latestSearch ? (
                <>
                  "Your search for <span className="font-bold text-primary">{data.latestSearch.filters.property_type || 'Properties'}</span> in <span className="font-bold text-primary">{data.latestSearch.filters.location_district || 'Gujarat'}</span> matches {data.weeklyMatches || 0} new listings this week."
                </>
              ) : (
                "Save your first search to receive personalized smart tips and market matching alerts!"
              )
            ) : (
              data?.latestSearch ? (
                <>
                  "તમારી <span className="font-bold text-primary">{data.latestSearch.filters.location_district || 'ગુજરાત'}</span> માં <span className="font-bold text-primary">{data.latestSearch.filters.property_type || 'પ્રોપર્ટીઝ'}</span> ની શોધ આ અઠવાડિયે {data.weeklyMatches || 0} નવી લિસ્ટિંગ સાથે મેળ ખાતી છે."
                </>
              ) : (
                "વ્યક્તિગત સ્માર્ટ ટિપ્સ અને માર્કેટ એલર્ટ્સ મેળવવા માટે તમારી પ્રથમ શોધ સાચવો!"
              )
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsWidget;