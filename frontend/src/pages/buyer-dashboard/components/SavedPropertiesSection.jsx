import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import notificationService from '../../../utils/notificationService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PropertyCard from './PropertyCard';

const SavedPropertiesSection = ({ language = 'en' }) => {
  const { user } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedProperties = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const result = await propertyService.getSavedProperties(user.id);
      if (result) {
        setSavedProperties(result);
      }
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      setError('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedProperties();
  }, [user?.id]);

  const handleRemoveProperty = async (propertyId) => {
    try {
      const result = await propertyService.removeSavedProperty(user.id, propertyId);
      if (result.success) {
        setSavedProperties(prev => prev.filter(p => p.property?._id !== propertyId && p.property?.id !== propertyId));
      }
    } catch (err) {
      console.error('Error removing property:', err);
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
            {language === 'en' ? 'Your Saved Collections' : 'તમારું સાચવેલું સંગ્રહ'}
          </h2>
          <p className="text-muted-foreground">Properties you've shortlisted for later consideration</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSavedProperties} iconName="RefreshCw">
          {language === 'en' ? 'Refresh' : 'રીફ્રેશ'}
        </Button>
      </div>

      {savedProperties.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-2xl py-20 text-center">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Heart" size={40} className="text-muted-foreground/30" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            {language === 'en' ? 'No saved properties yet' : 'હજુ સુધી કોઈ પ્રોપર્ટી સાચવેલ નથી'}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Explore our vast listings and heart the ones that catch your eye to see them here later.
          </p>
          <Button onClick={() => window.location.href = '/property-listings-search'} size="lg">
            Start Exploring
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedProperties.map((item) => {
            const property = item.property;
            if (!property) return null;
            return (
              <div key={item.id} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={property.images?.[0] || 'https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg'}
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />

                  <button
                    onClick={() => handleRemoveProperty(property.id)}
                    className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-white transition-all shadow-lg"
                  >
                    <Icon name="Heart" size={18} fill="currentColor" />
                  </button>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded">
                        {property.property_type}
                      </span>
                    </div>
                    <h4 className="text-white font-bold truncate text-lg">
                      {property.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icon name="MapPin" size={14} className="mr-2 text-primary" />
                    {property.location_village}, {property.location_district}
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Asking Price</p>
                      <p className="text-xl font-bold text-foreground">{formatPrice(property.price)}</p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.location.href = `/property-detail-view?id=${property.id}`}
                      className="rounded-lg px-5 shadow-inner"
                    >
                      {language === 'en' ? 'View Details' : 'વિગત જુઓ'}
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

export default SavedPropertiesSection;