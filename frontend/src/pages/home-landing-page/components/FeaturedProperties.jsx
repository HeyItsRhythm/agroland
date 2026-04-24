import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import propertyViewService from '../../../utils/propertyViewService';
import propertyService from '../../../utils/propertyService';
import settingsService from '../../../utils/settingsService';

const FeaturedProperties = () => {
  const { language } = useLanguage();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // First fetch settings to get the limit
      let limit = 6;
      try {
        const settingsRes = await settingsService.getSystemSettings();
        if (settingsRes.success && settingsRes.data?.featuredPropertiesLimit) {
          limit = settingsRes.data.featuredPropertiesLimit;
        }
      } catch (err) {
        console.warn('Failed to fetch settings, using default limit');
      }

      // Fetch properties from the database - only 6 most recent as requested
      const result = await propertyService.getProperties({
        sort_by: 'created_at',
        sort_order: 'desc',
        limit: 6
      });

      if (result.success) {
        console.log('Fetched properties for featured section:', result.data);
        setFeaturedProperties(result.data);
      } else {
        console.error('Failed to fetch featured properties:', result.error);
        setError(result.error);
        // Fallback to demo data if database fetch fails
        setFeaturedProperties([
          {
            id: 1,
            title: language === 'en' ? 'Premium Agricultural Land in Sanand' : 'સાણંદમાં પ્રીમિયમ કૃષિ જમીન',
            location: language === 'en' ? 'Sanand, Ahmedabad' : 'સાણંદ, અમદાવાદ',
            price: '₹12,50,000',
            area: language === 'en' ? '2.5 Acres' : '2.5 એકર',
            image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            features: language === 'en'
              ? ['Water Connection', 'Road Access', 'Fertile Soil', 'Clear Title']
              : ['પાણીનું કનેક્શન', 'રોડ એક્સેસ', 'ફળદ્રુપ માટી', 'સ્પષ્ટ ટાઇટલ'],
            views: 245,
            isVerified: true
          },
          {
            id: 2,
            title: language === 'en' ? 'Organic Farm Land in Vadodara' : 'વડોદરામાં ઓર્ગેનિક ફાર્મ લેન્ડ',
            location: language === 'en' ? 'Padra, Vadodara' : 'પાદરા, વડોદરા',
            price: '₹8,75,000',
            area: language === 'en' ? '1.8 Acres' : '1.8 એકર',
            image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            features: language === 'en'
              ? ['Organic Certified', 'Drip Irrigation', 'Storage Facility', 'Power Supply']
              : ['ઓર્ગેનિક પ્રમાણિત', 'ડ્રિપ સિંચાઈ', 'સ્ટોરેજ સુવિધા', 'પાવર સપ્લાય'],
            views: 189,
            isVerified: true
          },
          {
            id: 3,
            title: language === 'en' ? 'Mango Orchard in Surat' : 'સુરતમાં કેરીનો બગીચો',
            location: language === 'en' ? 'Chorasi, Surat' : 'ચોરાસી, સુરત',
            price: '₹15,25,000',
            area: language === 'en' ? '3.2 Acres' : '3.2 એકર',
            image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            features: language === 'en'
              ? ['Mature Trees', 'Bore Well', 'Farm House', 'Market Access']
              : ['પરિપક્વ વૃક્ષો', 'બોર વેલ', 'ફાર્મ હાઉસ', 'માર્કેટ એક્સેસ'],
            views: 312,
            isVerified: true
          },
          {
            id: 4,
            title: language === 'en' ? 'Cotton Field in Rajkot' : 'રાજકોટમાં કપાસનું ખેતર',
            location: language === 'en' ? 'Morbi, Rajkot' : 'મોરબી, રાજકોટ',
            price: '₹6,80,000',
            area: language === 'en' ? '1.5 Acres' : '1.5 એકર',
            image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            features: language === 'en'
              ? ['Black Soil', 'Canal Irrigation', 'Equipment Shed', 'Transport Hub']
              : ['કાળી માટી', 'કેનાલ સિંચાઈ', 'સાધન શેડ', 'ટ્રાન્સપોર્ટ હબ'],
            views: 156,
            isVerified: false
          },
          {
            id: 5,
            title: language === 'en' ? 'Vegetable Farm in Gandhinagar' : 'ગાંધીનગરમાં શાકભાજીનું ફાર્મ',
            location: language === 'en' ? 'Kalol, Gandhinagar' : 'કાલોલ, ગાંધીનગર',
            price: '₹9,95,000',
            area: language === 'en' ? '2.0 Acres' : '2.0 એકર',
            image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            features: language === 'en'
              ? ['Greenhouse', 'Modern Irrigation', 'Cold Storage', 'Highway Access']
              : ['ગ્રીનહાઉસ', 'આધુનિક સિંચાઈ', 'કોલ્ડ સ્ટોરેજ', 'હાઇવે એક્સેસ'],
            views: 203,
            isVerified: true
          },
          {
            id: 6,
            title: language === 'en' ? 'Wheat Field in Bhavnagar' : 'ભાવનગરમાં ઘઉંનું ખેતર',
            location: language === 'en' ? 'Sihor, Bhavnagar' : 'સિહોર, ભાવનગર',
            price: '₹7,45,000',
            area: language === 'en' ? '1.7 Acres' : '1.7 એકર',
            image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            features: language === 'en'
              ? ['Tube Well', 'Tractor Shed', 'Boundary Wall', 'Village Road']
              : ['ટ્યુબ વેલ', 'ટ્રેક્ટર શેડ', 'બાઉન્ડ્રી વોલ', 'ગામડાનો રસ્તો'],
            views: 134,
            isVerified: true
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching featured properties:', error);
      setError('Failed to load featured properties');
      // Fallback to empty array
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = async (propertyId) => {
    // Track property view using propertyViewService
    await propertyViewService.trackPropertyView(user?.id, propertyId);

    // Navigate to property detail page
    navigate(`/property-detail-view?id=${propertyId}`);
  };

  const handleViewAllProperties = () => {
    navigate('/property-listings-search');
  };

  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-3">
            {language === 'en' ? 'Featured Properties' : 'વિશેષ પ્રોપર્ટીઝ'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' ? 'Discover handpicked premium agricultural lands with verified documentation and excellent investment potential' : 'ચકાસાયેલ દસ્તાવેજીકરણ અને ઉત્તમ રોકાણ સંભાવના સાથે હાથથી પસંદ કરેલી પ્રીમિયમ કૃષિ જમીનો શોધો'
            }
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {loading ? (
            // Loading state
            <div className="col-span-3 flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <Icon name="Loader2" size={32} className="animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">
                  {language === 'en' ? 'Loading properties...' : 'પ્રોપર્ટીઝ લોડ થઈ રહી છે...'}
                </p>
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className="col-span-3 flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <Icon name="AlertTriangle" size={32} className="text-destructive mb-4" />
                <p className="text-muted-foreground">
                  {language === 'en' ? 'Failed to load properties' : 'પ્રોપર્ટીઝ લોડ કરવામાં નિષ્ફળ'}
                </p>
              </div>
            </div>
          ) : featuredProperties.length === 0 ? (
            // Empty state
            <div className="col-span-3 flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <Icon name="Search" size={32} className="text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {language === 'en' ? 'No properties found' : 'કોઈ પ્રોપર્ટીઝ મળી નથી'}
                </p>
              </div>
            </div>
          ) : (
            // Properties list
            featuredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-card rounded-2xl shadow-elevation-2 overflow-hidden hover:shadow-elevation-3 transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
                    }
                    alt={property.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />

                  {/* Verification Badge */}
                  {property.status === 'active' && (
                    <div className="absolute top-4 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Icon name="CheckCircle" size={14} />
                      <span>{language === 'en' ? 'Verified' : 'ચકાસાયેલ'}</span>
                    </div>
                  )}

                  {/* Views Counter */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center space-x-1">
                    <Icon name="Eye" size={12} />
                    <span>{property.views_count || 0}</span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2 line-clamp-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-muted-foreground mb-3">
                    <Icon name="MapPin" size={16} className="mr-2" />
                    <span className="text-sm">
                      {property.location_village && property.location_district ?
                        `${property.location_village}, ${property.location_district}` :
                        property.location_district || 'Location not specified'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(property.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {property.area} {
                        property.area_unit === 'vigha' ? (language === 'en' ? 'Vigha' : 'વીઘા') :
                          property.area_unit === 'acres' ? (language === 'en' ? 'Acre' : 'એકર') :
                            property.area_unit === 'guntha' ? (language === 'en' ? 'Guntha' : 'ગુંઠા') :
                              property.area_unit === 'sqft' ? (language === 'en' ? 'Sq. Ft' : 'ચોરસ ફૂટ') :
                                property.area_unit === 'sqyard' ? (language === 'en' ? 'Sq. Yard' : 'વાર') :
                                  property.area_unit || (language === 'en' ? 'Unit' : 'એકમ')
                      }
                    </div>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {(property.amenities || []).slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-muted-foreground">
                        <Icon name="Check" size={12} className="mr-1 text-success" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    onClick={() => handleViewProperty(property.id)}
                    iconName="ArrowRight"
                    iconPosition="right"
                    className="w-full"
                  >
                    {language === 'en' ? 'View Details' : 'વિગતો જુઓ'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            variant="default"
            size="lg"
            onClick={handleViewAllProperties}
            iconName="Grid3X3"
            iconPosition="left"
            className="px-8"
          >
            {language === 'en' ? 'View All Properties' : 'બધી પ્રોપર્ટીઝ જુઓ'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;