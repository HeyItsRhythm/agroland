import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AddPropertyModal from './AddPropertyModal';

const QuickActions = ({ language }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [loading, setLoading] = useState(null);

  const quickActions = [
    {
      id: 1,
      title: language === 'en' ? 'Add New Property' : 'નવી પ્રોપર્ટી ઉમેરો',
      description: language === 'en' ? 'List a new property for sale' : 'વેચાણ માટે નવી પ્રોપર્ટી લિસ્ટ કરો',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      action: 'add-property'
    },
    {
      id: 2,
      title: language === 'en' ? 'View All Properties' : 'બધી પ્રોપર્ટીઝ જુઓ',
      description: language === 'en' ? 'Manage your property listings' : 'તમારી પ્રોપર્ટી લિસ્ટિંગ્સ મેનેજ કરો',
      icon: 'Building2',
      color: 'bg-secondary text-secondary-foreground',
      action: 'view-properties'
    },
    {
      id: 3,
      title: language === 'en' ? 'Market Analysis' : 'માર્કેટ એનાલિસિસ',
      description: language === 'en' ? 'View market trends and pricing' : 'માર્કેટ ટ્રેન્ડ્સ અને કિંમતો જુઓ',
      icon: 'TrendingUp',
      color: 'bg-warning text-warning-foreground',
      action: 'market-analysis'
    },
    {
      id: 4,
      title: language === 'en' ? 'Inquiries' : 'પૂછપરછ',
      description: language === 'en' ? 'View and respond to buyer inquiries' : 'ખરીદદારની પૂછપરછ જુઓ અને જવાબ આપો',
      icon: 'MessageSquare',
      color: 'bg-success text-success-foreground',
      action: 'inquiries'
    },
    {
      id: 5,
      title: language === 'en' ? 'Performance Report' : 'પરફોર્મન્સ રિપોર્ટ',
      description: language === 'en' ? 'Download detailed performance reports' : 'વિગતવાર પરફોર્મન્સ રિપોર્ટ્સ ડાઉનલોડ કરો',
      icon: 'FileText',
      color: 'bg-indigo-500 text-white',
      action: 'generate-report'
    },
    {
      id: 6,
      title: language === 'en' ? 'Account Settings' : 'એકાઉન્ટ સેટિંગ્સ',
      description: language === 'en' ? 'Manage account and preferences' : 'એકાઉન્ટ અને પસંદગીઓ મેનેજ કરો',
      icon: 'Settings',
      color: 'bg-gray-500 text-white',
      action: 'settings'
    }
  ];

  const handleAction = async (action) => {
    if (loading) return;

    switch (action) {
      case 'add-property':
        setShowAddPropertyModal(true);
        break;
        
      case 'view-properties': setLoading('view-properties');
        // Navigate to properties management or show properties list
        navigate('/property-listings-search');
        setLoading(null);
        break;
        
      case 'market-analysis': setLoading('market-analysis');
        // Navigate to market analysis page or show market data modal
        console.log('Market analysis functionality - coming soon');
        setTimeout(() => setLoading(null), 1000);
        break;
        
      case 'inquiries': setLoading('inquiries');
        // Show inquiries or navigate to inquiries section
        console.log('Inquiries functionality - implemented in dashboard');
        setTimeout(() => setLoading(null), 1000);
        break;
        
      case 'generate-report': setLoading('generate-report');
        await generatePerformanceReport();
        setLoading(null);
        break;
        
      case 'settings': setLoading('settings');
        // Navigate to settings or show settings modal
        console.log('Settings functionality - coming soon');
        setTimeout(() => setLoading(null), 1000);
        break;
        
      default:
        console.log('Unknown action:', action);
    }
  };

  const generatePerformanceReport = async () => {
    try {
      if (!user?.id) {
        toast.error(language === 'en' ? 'Please log in to generate report' : 'રિપોર્ટ જનરેટ કરવા માટે લોગિન કરો');
        return;
      }

      // Get seller properties data
      const propertiesResult = await propertyService.getPropertiesBySeller(user.id);
      
      if (propertiesResult.success) {
        const properties = propertiesResult.data;
        
        // Create report data
        const reportData = {
          totalProperties: properties.length,
          activeProperties: properties.filter(p => p.status === 'active').length,
          soldProperties: properties.filter(p => p.status === 'sold').length,
          totalViews: properties.reduce((sum, p) => sum + (p.views_count || 0), 0),
          averagePrice: properties.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / properties.length || 0,
          propertyTypes: properties.reduce((acc, p) => {
            acc[p.property_type] = (acc[p.property_type] || 0) + 1;
            return acc;
          }, {}),
          generatedAt: new Date().toLocaleString()
        };

        // Create and download CSV report
        const csvContent = generateCSVReport(reportData, properties, language);
        downloadReport(csvContent, `property-report-${Date.now()}.csv`);
        
      } else {
        toast.error(language === 'en' ? 'Failed to generate report' : 'રિપોર્ટ જનરેટ કરવામાં નિષ્ફળ');
      }
    } catch (error) {
      console.log('Error generating report:', error);
      toast.error(language === 'en' ? 'Error generating report' : 'રિપોર્ટ જનરેટ કરવામાં ભૂલ');
    }
  };

  const generateCSVReport = (reportData, properties, language) => {
    const headers = language === 'en' 
      ? ['Property Title', 'Type', 'Price', 'Area', 'Location', 'Status', 'Views', 'Created Date']
      : ['પ્રોપર્ટી શીર્ષક', 'પ્રકાર', 'કિંમત', 'વિસ્તાર', 'સ્થળ', 'સ્થિતિ', 'જોવાયેલા', 'બનાવેલી તારીખ'];

    const rows = properties.map(property => [
      property.title,
      property.property_type,
      property.price,
      property.area,
      `${property.location_village}, ${property.location_taluka}, ${property.location_district}`,
      property.status,
      property.views_count || 0,
      new Date(property.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const downloadReport = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePropertyAdded = (newProperty) => {
    console.log('New property added:', newProperty);
    
    // Show success message
    const successMessage = language === 'en' 
      ? 'Property added successfully' 
      : 'પ્રોપર્ટી સફળતાપૂર્વક ઉમેરવામાં આવી';
    toast.success(successMessage);
    
    // Refresh the page to show the new property
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border shadow-elevation-1">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'en' ? 'Quick Actions' : 'ઝડપી ક્રિયાઓ'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'en' ? 'Frequently used actions and shortcuts' : 'વારંવાર ઉપયોગમાં લેવાતી ક્રિયાઓ અને શોર્ટકટ્સ'}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Icon name="MoreHorizontal" size={16} />
            </Button>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleAction(action.action)}
                className={`group relative bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border ${
                  loading === action.action ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`${action.color} rounded-lg p-2 group-hover:scale-110 transition-transform`}>
                    {loading === action.action ? (
                      <Icon name="Loader2" size={20} className="animate-spin" />
                    ) : (
                      <Icon name={action.icon} size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                </div>
                
                {/* Hover Arrow */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 lg:p-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {language === 'en' ? 'Need help?' : 'મદદ જોઈએ છે?'}
            </div>
            <Button variant="outline" size="sm">
              <Icon name="HelpCircle" size={16} className="mr-2" />
              {language === 'en' ? 'Support' : 'સપોર્ટ'}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      <AddPropertyModal 
        isOpen={showAddPropertyModal}
        onClose={() => setShowAddPropertyModal(false)}
        onSuccess={handlePropertyAdded}
        language={language}
      />
    </>
  );
};

export default QuickActions;