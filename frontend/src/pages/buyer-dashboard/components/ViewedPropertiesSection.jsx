import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import propertyViewService from '../../../utils/propertyViewService';
import notificationService from '../../../utils/notificationService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PropertyCard from './PropertyCard';

const ViewedPropertiesSection = ({ language = 'en' }) => {
  const { user } = useAuth();
  const [viewedProperties, setViewedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchViewedProperties = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const result = await propertyViewService.getViewedProperties(user.id);
      if (result.success) {
        setViewedProperties(result.data);
      }
    } catch (error) {
      console.error('Error fetching viewed properties:', error);
      setError('Failed to load viewed properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewedProperties();
  }, [user?.id]);

  const handleSaveProperty = async (propertyId) => {
    try {
      const result = await propertyService.saveProperty(user.id, propertyId);
      if (result.success) {
        setViewedProperties(prev =>
          prev.map(p => {
            if (p.property?._id === propertyId || p.property?.id === propertyId) {
              return { ...p, property: { ...p.property, saved: true } };
            }
            return p;
          })
        );
      }
    } catch (err) {
      console.error('Error saving property:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {language === 'en' ? 'Browsing History' : 'બ્રાઉઝિંગ ઇતિહાસ'}
          </h2>
          <p className="text-muted-foreground">Catch up on properties you've recently explored</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchViewedProperties} iconName="RefreshCw">
          {language === 'en' ? 'Refresh' : 'રીફ્રેશ'}
        </Button>
      </div>

      {viewedProperties.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-2xl py-20 text-center">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Eye" size={40} className="text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {language === 'en' ? 'History is empty' : 'ઇતિહાસ ખાલી છે'}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Your recently viewed properties will appear here so you can easily find them again.
          </p>
          <Button onClick={() => window.location.href = '/property-listings-search'} size="lg">
            Start Browsing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewedProperties.map((item) => {
            const property = item.property;
            if (!property) return null;
            return (
              <div key={item.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={property.images?.[0] || 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg'}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-bold uppercase rounded flex items-center gap-1 shadow-sm">
                      <Icon name="Clock" size={10} />
                      {new Date(item.viewed_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSaveProperty(property.id)}
                    className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all shadow-lg ${property.saved ? 'bg-primary text-primary-foreground' : 'bg-white/90 text-muted-foreground hover:text-red-500'
                      }`}
                  >
                    <Icon name="Heart" size={18} fill={property.saved ? "currentColor" : "none"} />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                      {property.title}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Icon name="MapPin" size={12} className="mr-1" />
                      {property.location_village}, {property.location_district}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <p className="text-xl font-bold text-foreground">{formatPrice(property.price)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.location.href = `/property-detail-view?id=${property.id}`}
                      className="text-primary hover:bg-primary/10"
                    >
                      {language === 'en' ? 'Revisit' : 'ફરી જુઓ'}
                      <Icon name="ChevronRight" size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewedPropertiesSection;