import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import inquiryService from '../../../utils/inquiryService';
import notificationService from '../../../utils/notificationService';
import propertyViewService from '../../../utils/propertyViewService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';

const GoogleMapsLogo = "/assets/images/google-maps-logo.png";

const PropertyCard = ({ property, onSave, onRemove, className = "" }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(property.saved || false);
  
  useEffect(() => {
    // Update saved status when property prop changes
    setIsSaved(property.saved || false);
    
    // Check if this property is saved by the current user
    const checkIfSaved = async () => {
      if (user?.id && property?.id) {
        try {
          const savedProperties = await propertyService.getSavedProperties(user.id);
          // propertyService.getSavedProperties returns the array directly
          if (Array.isArray(savedProperties)) {
            const isPropertySaved = savedProperties.some(item => 
              (item.property_id === property.id) || 
              (item.property && (item.property._id === property.id || item.property.id === property.id))
            );
            setIsSaved(isPropertySaved);
          }
        } catch (error) {
          console.error('Error checking if property is saved:', error);
        }
      }
    };
    
    if (!property.saved) {
      checkIfSaved();
    }
  }, [property, user]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Please log in to save properties');
      return;
    }

    try {
      setLoading(true);
      
      if (isSaved) {
        console.log('Removing property from saved:', property.id);
        const result = await propertyService.removeSavedProperty(user.id, property.id);
        if (result.success) {
          console.log('Successfully removed property from saved');
          setIsSaved(false);
          onRemove?.(property.id);
        } else {
          console.error('Failed to remove property:', result.error);
          toast.error(result.error || 'Failed to remove property');
        }
      } else {
        console.log('Saving property:', property.id);
        const result = await propertyService.saveProperty(user.id, property.id);
        if (result.success) {
          console.log('Successfully saved property:', result.data);
          setIsSaved(true);
          onSave?.(property.id);
        } else {
          console.error('Failed to save property:', result.error);
          toast.error(result.error || 'Failed to save property');
        }
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async () => {
    if (!user?.id) {
      toast.error('Please log in to send inquiries');
      return;
    }

    if (!inquiryMessage.trim()) {
      toast.error('Please enter your inquiry message');
      return;
    }

    try {
      setInquiryLoading(true);
      
      const inquiryData = {
        property_id: property.id || property._id,
        sender_id: user.id,
        seller_id: property.seller_id,
        message: inquiryMessage.trim()
      };

      const result = await inquiryService.createInquiry(inquiryData);
      
      if (result.success) {
        setShowInquiryForm(false);
        setInquiryMessage('');
        toast.success('Inquiry sent successfully! The seller will respond soon.');
      } else {
        toast.error(result.error || 'Failed to send inquiry');
      }
    } catch (error) {
      toast.error('Something went wrong sending inquiry');
    } finally {
      setInquiryLoading(false);
    }
  };

  const handleViewProperty = async () => {
    // Track property view using propertyViewService
    await propertyViewService.trackPropertyView(user?.id, property.id);
    
    // Navigate to property detail page
    navigate(`/property-detail-view?id=${property.id}`);
  };

  return (
    <>
      <div className={`bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
        {/* Property Image */}
        <div className="aspect-video bg-muted relative">
          {property.images?.length > 0 ? (
            <img 
              src={property.images[0]} 
              alt={property.title}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.src = '/assets/images/no_image.png';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="Building2" size={32} className="text-muted-foreground" />
            </div>
          )}
          
          {/* Save Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={loading}
            className={`absolute top-2 right-2 bg-white/90 hover:bg-white ${
              isSaved ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'
            }`}
          >
            {loading ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Heart" size={16} fill={isSaved ? "currentColor" : "none"} />
            )}
          </Button>

          {/* Property Type Badge */}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded capitalize">
              {property.property_type}
            </span>
          </div>

          {/* Views Count */}
          {property.views_count > 0 && (
            <div className="absolute bottom-2 left-2">
              <div className="bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                <Icon name="Eye" size={12} />
                {property.views_count}
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="p-4">
          <h4 className="font-medium text-foreground mb-2 line-clamp-2">
            {property.title}
          </h4>
          
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Icon name="MapPin" size={14} className="mr-1 flex-shrink-0" />
            <span className="truncate">
              {property.location_village}, {property.location_district}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {formatPrice(property.price)}
              </div>
              <div className="text-sm text-muted-foreground">
                {property.area} {(() => {
                  const unitMapping = {
                    'vigha': language === 'en' ? 'Vigha' : 'વીઘા',
                    'acres': language === 'en' ? 'Acre' : 'એકર',
                    'acre': language === 'en' ? 'Acre' : 'એકર',
                    'guntha': language === 'en' ? 'Guntha' : 'ગુંઠા',
                    'sqft': language === 'en' ? 'Sq Ft' : 'ચોરસ ફૂટ',
                    'square feet': language === 'en' ? 'Sq Ft' : 'ચોરસ ફૂટ',
                    'sqyard': language === 'en' ? 'Sq Yard' : 'વાર',
                    'hectares': language === 'en' ? 'Hectare' : 'હેક્ટર',
                    'hectare': language === 'en' ? 'Hectare' : 'હેક્ટર'
                  };
                  return unitMapping[property.area_unit?.toLowerCase()] || property.area_unit || (language === 'en' ? 'Sq Ft' : 'ચોરસ ફૂટ');
                })()}
              </div>
            </div>
            
            {/* Property Status */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              property.status === 'active' ? 'bg-green-50 text-green-700' :
              property.status === 'sold' ? 'bg-blue-50 text-blue-700' :
              property.status === 'pending'? 'bg-yellow-50 text-yellow-700' : 'bg-gray-50 text-gray-700'
            }`}>
              {property.status}
            </span>
          </div>

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 3).map((amenity, index) => (
                  <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    {amenity}
                  </span>
                ))}
                {property.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewProperty}
              className="flex-1"
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowInquiryForm(true)}
              className="flex-1"
              disabled={property.status !== 'active'}
            >
              Inquire
            </Button>
            {property.map_url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(property.map_url, '_blank')}
                className="px-3"
                title={language === 'en' ? 'View on Map' : 'નકશા પર જુઓ'}
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <img 
                    src={GoogleMapsLogo}
                    alt="Map" 
                    className="w-full h-full object-contain relative z-10"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Icon name="Map" size={14} className="absolute inset-0 m-auto text-slate-400 opacity-50" />
                </div>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Handle share
                const shareData = {
                  title: property.title,
                  text: `Check out this property: ${property.title}`,
                  url: `${window.location.origin}/property-detail-view?id=${property.id}`
                };

                try {
                  if (navigator.share) {
                    navigator.share(shareData);
                  } else {
                    // Fallback to clipboard
                    navigator.clipboard.writeText(shareData.url);
                    toast.success('Property link copied to clipboard!');
                  }
                } catch (error) {
                  console.error('Error sharing:', error);
                }
              }}
              className="px-3"
            >
              <Icon name="Share2" size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Send Inquiry
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowInquiryForm(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-1">
                  {property.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {property.location_village}, {property.location_district}
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Your Message
                </label>
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="I'm interested in this property. Can you provide more details?"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowInquiryForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleInquiry}
                  disabled={inquiryLoading || !inquiryMessage.trim()}
                  className="flex-1"
                >
                  {inquiryLoading ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    'Send Inquiry'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;