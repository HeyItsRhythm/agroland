import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';


import { useLanguage } from '../../../contexts/LanguageContext';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import { toast } from 'react-hot-toast';

const SellerProperties = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, propertyId: null });
  const { user } = useAuth();

  const loadProperties = async () => {
    try {
      setLoading(true);

      if (user?.id) {
        const result = await propertyService.getPropertiesBySeller(user.id);

        if (result.success) {
          setProperties(result.data);
        } else {
          console.error('Error loading properties:', result.error);
          setProperties([]);
        }
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Error loading properties:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteProperty = (propertyId, e) => {
    if (e) e.stopPropagation();
    setDeleteModal({ isOpen: true, propertyId });
  };

  const handleConfirmDelete = async () => {
    const propertyId = deleteModal.propertyId;
    if (!propertyId) return;

    try {
      setActionLoading(propertyId);
      const result = await propertyService.deleteProperty(propertyId);

      if (result.success) {
        setProperties(prev => prev.filter(p => (p.id || p._id) !== propertyId));
        toast.success(language === 'en' ? 'Property deleted successfully' : 'પ્રોપર્ટી સફળતાપૂર્વક ડિલીટ કરવામાં આવી');
      } else {
        toast.error(result.error || (language === 'en' ? 'Failed to delete property' : 'પ્રોપર્ટી ડિલીટ કરવામાં નિષ્ફળ'));
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      toast.error(language === 'en' ? 'Something went wrong' : 'કંઈક ખોટું થયું');
    } finally {
      setActionLoading(null);
      setDeleteModal({ isOpen: false, propertyId: null });
    }
  };

  useEffect(() => {
    // Load properties from the API when user is available
    if (user?.id) {
      console.log('Loading properties for seller:', user.id);
      loadProperties();
    } else {
      console.log('User ID not available, clearing properties');
      setProperties([]);
      setLoading(false);
    }
  }, [user?.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'pending': return 'text-warning';
      case 'inactive': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return language === 'en' ? 'Active' : 'સક્રિય';
      case 'pending': return language === 'en' ? 'Pending' : 'પેન્ડિંગ';
      case 'inactive': return language === 'en' ? 'Inactive' : 'નિષ્ક્રિય';
      default: return status;
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    if (filter === 'pending') {
      return property.status === 'pending' || property.status === 'pending_approval';
    }
    return property.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto" key={language}>
      <Helmet>
        <title>
          {language === 'en' ? 'My Properties - Seller Dashboard' : 'મારી પ્રોપર્ટીઝ - વેચનાર ડેશબોર્ડ'}
        </title>
      </Helmet>

      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {language === 'en' ? 'My Properties' : 'મારી પ્રોપર્ટીઝ'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Manage your property listings and track their performance' : 'તમારી પ્રોપર્ટી લિસ્ટિંગ્સ મેનેજ કરો અને તેમની પરફોર્મન્સ ટ્રેક કરો'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: 'all', label: language === 'en' ? 'All' : 'બધી' },
            { value: 'active', label: language === 'en' ? 'Active' : 'સક્રિય' },
            { value: 'pending', label: language === 'en' ? 'Pending' : 'પેન્ડિંગ' },
            { value: 'inactive', label: language === 'en' ? 'Inactive' : 'નિષ્ક્રિય' }
          ].map((filterOption) => (
            <Button
              key={filterOption.value}
              variant={filter === filterOption.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption.value)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 transition-shadow">
                {/* Property Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                  <img
                    src={property.images && property.images.length > 0 ? property.images[0] : "/assets/images/no_image.png"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "/assets/images/no_image.png"; }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-background/80 ${getStatusColor(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    {property.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    <Icon name="MapPin" size={14} className="inline mr-1" />
                    {property.location_village ? `${property.location_village}, ` : ''}{property.location_district}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-primary">
                      ₹{Number(property.price).toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {(() => {
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
                        const unit = unitMapping[property.area_unit?.toLowerCase()] || property.area_unit || (language === 'en' ? 'Unit' : 'એકમ');
                        return `${property.area} ${unit}`;
                      })()}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={14} />
                      <span>{property.views_count || 0} views</span>
                    </div>
                    {/* Inquiry count lookup would require complex query, hiding for list view or defaulting to 0 */}
                    <div className="flex items-center gap-1">
                      <Icon name="MessageSquare" size={14} />
                      <span>{property.inquiries_count || 0} inquiries</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/seller-dashboard/add-property?id=${property.id}`)}
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      {language === 'en' ? 'Edit' : 'એડિટ'}
                    </Button>
                    <Button 
                      className="flex gap-2 font-semibold text-red-500"
                      onClick={(e) => handleDeleteProperty(property.id || property._id, e)} 
                      variant="outline" 
                      size="sm"
                      disabled={actionLoading === (property.id || property._id)}
                    >
                      {actionLoading === (property.id || property._id) ? (
                        <Icon name="Loader2" size={14} className="animate-spin" />
                      ) : (
                        <Icon name="Trash" size={14} />
                      )}
                      {language === 'en' ? 'Delete' : 'ડિલીટ'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {language === 'en' ? 'No Properties Found' : 'કોઈ પ્રોપર્ટીઝ મળી નથી'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {language === 'en' ? 'Start by adding your first property listing' : 'તમારી પહેલી પ્રોપર્ટી લિસ્ટિંગ ઉમેરીને શરૂ કરો'}
            </p>
            <Button size="lg" onClick={() => window.location.href = '/seller-dashboard/add-property'}>
              <Icon name="Plus" size={20} className="mr-2" />
              {language === 'en' ? 'Add Property' : 'પ્રોપર્ટી ઉમેરો'}
            </Button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, propertyId: null })}
        onConfirm={handleConfirmDelete}
        loading={!!actionLoading}
        title={language === 'en' ? 'Delete Property?' : 'પ્રોપર્ટી ડિલીટ કરવી છે?'}
        message={language === 'en' 
          ? 'Are you sure you want to delete this property? This action cannot be undone and the listing will be permanently removed.' 
          : 'શું તમે ખરેખર આ પ્રોપર્ટી ડિલીટ કરવા માંગો છો? આ ક્રિયા પાછી લાવી શકાશે નહીં અને લિસ્ટિંગ કાયમી ધોરણે દૂર કરવામાં આવશે.'
        }
        confirmText={language === 'en' ? 'Delete Permanently' : 'કાયમી ધોરણે ડિલીટ કરો'}
        cancelText={language === 'en' ? 'Keep Listing' : 'લિસ્ટિંગ રહેવા દો'}
        variant="destructive"
      />
    </div>
  );
};

export default SellerProperties;