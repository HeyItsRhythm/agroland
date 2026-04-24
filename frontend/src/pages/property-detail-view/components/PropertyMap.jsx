import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PropertyMap = ({ property }) => {
  const [language, setLanguage] = useState('en');
  const [mapView, setMapView] = useState('satellite');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const mapUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}&z=16&output=embed`;

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-elevation-2">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            {language === 'en' ? 'Property Location' : 'પ્રોપર્ટીનું સ્થાન'}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={mapView === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('satellite')}
            >
              {language === 'en' ? 'Satellite' : 'સેટેલાઇટ'}
            </Button>
            <Button
              variant={mapView === 'roadmap' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('roadmap')}
            >
              {language === 'en' ? 'Map' : 'નકશો'}
            </Button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div className="aspect-video bg-muted">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={`${property.title} Location`}
            referrerPolicy="no-referrer-when-downgrade"
            src={`${mapUrl}&t=${mapView}`}
            className="border-0"
          />
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white shadow-elevation-1 w-10 h-10"
            onClick={() => window.open(`https://www.google.com/maps?q=${property.latitude},${property.longitude}`, '_blank')}
          >
            <Icon name="ExternalLink" size={16} />
          </Button>
        </div>
      </div>

      {/* Location Details */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">
              {language === 'en' ? 'Address' : 'સરનામું'}
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Icon name="MapPin" size={14} className="mr-2" />
                <span>{property.village}, {property.taluka}</span>
              </div>
              <div className="flex items-center">
                <Icon name="Building" size={14} className="mr-2" />
                <span>{property.district}, Gujarat</span>
              </div>
              <div className="flex items-center">
                <Icon name="Navigation" size={14} className="mr-2" />
                <span>
                  {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">
              {language === 'en' ? 'Nearby Amenities' : 'નજીકની સુવિધાઓ'}
            </h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              {property.nearbyAmenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <Icon name="MapPin" size={14} className="mr-2" />
                  <span>
                    {language === 'en' ? amenity.name : amenity.nameGu} - {amenity.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Directions Button */}
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`, '_blank')}
            iconName="Navigation"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            {language === 'en' ? 'Get Directions' : 'દિશાઓ મેળવો'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;