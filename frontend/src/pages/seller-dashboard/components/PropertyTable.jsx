import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/modals/ConfirmModal';
import { toast } from 'react-hot-toast';

const PropertyTable = ({ language, user: propUser }) => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  // Use the prop user if provided, otherwise use the user from auth context
  const user = propUser || authUser;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, propertyId: null });

  useEffect(() => {
    if (user?.id) {
      loadProperties();
    } else {
      // Set loading to false when no user is available
      setLoading(false);
    }
  }, [user]);

  const loadProperties = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Loading properties for user:', user.id);

      const result = await propertyService.getPropertiesBySeller(user.id);
      console.log('Load properties result:', result);

      if (result.success) {
        // Always set properties to the result data or empty array
        setProperties(result.data || []);
        // Clear any previous errors
        setError(null);
      } else {
        console.error('Failed to load properties:', result.error);
        setError(result.error || (language === 'en' ? 'Failed to load properties' : 'પ્રોપર્ટીઝ લોડ કરવામાં નિષ્ફળ'));
        // Ensure properties is an empty array when there's an error
        setProperties([]);
      }
    } catch (err) {
      console.error('Exception loading properties:', err);
      setError(language === 'en' ? 'Something went wrong loading properties' : 'પ્રોપર્ટીઝ લોડ કરતી વખતે કંઈક ખોટું થયું');
      // Ensure properties is an empty array when there's an error
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

  const handleStatusUpdate = async (propertyId, newStatus) => {
    try {
      setActionLoading(propertyId);
      setError(null);

      const result = await propertyService.updateProperty(propertyId, {
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      if (result.success) {
        setProperties(prev => prev.map(p =>
          p.id === propertyId ? { ...p, status: newStatus, updated_at: new Date().toISOString() } : p
        ));

        // Show success message
        toast.success(language === 'en'
          ? `Property status updated to ${newStatus}`
          : `પ્રોપર્ટી સ્ટેટસ ${newStatus} માં અપડેટ કરવામાં આવ્યું`);
      } else {
        console.error('Failed to update status:', result.error);
        toast.error(result.error || (language === 'en' ? 'Failed to update status' : 'સ્ટેટસ અપડેટ કરવામાં નિષ્ફળ'));
      }
    } catch (err) {
      console.error('Error updating property status:', err);
      toast.error(language === 'en' ? 'Something went wrong' : 'કંઈક ખોટું થયું');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (statusLower === 'active') return 'text-green-600 bg-green-50';
    if (statusLower === 'sold') return 'text-blue-600 bg-blue-50';
    if (statusLower === 'pending' || statusLower === 'pending_approval') return 'text-yellow-600 bg-yellow-50';
    if (statusLower === 'expired') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (status) => {
    const statusLower = (status || '').toLowerCase();
    if (language === 'en') {
      if (statusLower === 'active') return 'Active';
      if (statusLower === 'sold') return 'Sold';
      if (statusLower === 'pending' || statusLower === 'pending_approval') return 'Pending Approval';
      if (statusLower === 'expired') return 'Expired';
      return status || 'Unknown';
    } else {
      if (statusLower === 'active') return 'સક્રિય';
      if (statusLower === 'sold') return 'વેચાયેલ';
      if (statusLower === 'pending' || statusLower === 'pending_approval') return 'મંજૂરી બાકી';
      if (statusLower === 'expired') return 'સમય સમાપ્ત';
      return status || 'અજ્ઞાત';
    }
  };

  // Separate properties into pending and active sections
  const pendingProperties = properties.filter(p => {
    const status = (p.status || '').toLowerCase();
    return status === 'pending' || status === 'pending_approval';
  });

  const activeProperties = properties.filter(p => {
    const status = (p.status || '').toLowerCase();
    return status === 'active';
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-8">
        <div className="flex items-center justify-center">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">
            {language === 'en' ? 'Loading properties...' : 'પ્રોપર્ટીઝ લોડ કરી રહ્યું છે...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border shadow-elevation-1">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {language === 'en' ? 'My Properties' : 'મારી પ્રોપર્ટીઝ'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'en' ? 'Manage and track your property listings' : 'તમારી પ્રોપર્ટી લિસ્ટિંગ્સ મેનેજ કરો અને ટ્રેક કરો'}
              </p>
            </div>
            <Button
              onClick={() => navigate('/seller-dashboard/add-property')}
              iconName="Plus"
              iconPosition="left"
            >
              {language === 'en' ? 'Add Property' : 'પ્રોપર્ટી ઉમેરો'}
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-6">
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadProperties}
                className="mt-2"
              >
                {language === 'en' ? 'Retry' : 'ફરી પ્રયાસ કરો'}
              </Button>
            </div>
          )}

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Building2" size={32} className="text-muted-foreground" />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-2">
                {language === 'en' ? 'No Properties Listed' : 'કોઈ પ્રોપર્ટી લિસ્ટ નથી'}
              </h4>
              <p className="text-muted-foreground mb-6">
                {language === 'en' ? 'Start by adding your first property listing to reach potential buyers.' : 'સંભવિત ખરીદદારો સુધી પહોંચવા માટે તમારી પ્રથમ પ્રોપર્ટી લિસ્ટિંગ ઉમેરીને શરૂઆત કરો.'
                }
              </p>
              <Button onClick={() => navigate('/seller-dashboard/add-property')}>
                {language === 'en' ? 'Add Your First Property' : 'તમારી પ્રથમ પ્રોપર્ટી ઉમેરો'}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Pending Properties Section */}
              {pendingProperties.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {language === 'en' ? 'Pending Approval' : 'મંજૂરી બાકી'} ({pendingProperties.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Property' : 'પ્રોપર્ટી'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Type' : 'પ્રકાર'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Price' : 'કિંમત'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Status' : 'સ્થિતિ'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Views' : 'જોવાયેલા'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Actions' : 'ક્રિયાઓ'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingProperties.map((property) => (
                          <tr key={property.id} className="border-b border-border hover:bg-muted/20">
                            <td className="py-4 px-2">
                              <div>
                                <div className="font-medium text-foreground text-sm">
                                  {property.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {property.location_village}, {property.location_district}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <span className="capitalize text-sm text-foreground">
                                {property.property_type}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <span className="text-sm font-medium text-foreground">
                                {formatPrice(property.price)}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                {getStatusText(property.status)}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <span className="text-sm text-muted-foreground">
                                {property.views_count || 0}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDeleteProperty(property.id || property._id, e)}
                                  disabled={actionLoading === (property.id || property._id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  {actionLoading === (property.id || property._id) ? (
                                    <Icon name="Loader2" size={14} className="animate-spin" />
                                  ) : (
                                    <Icon name="Trash2" size={14} />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Active Properties Section */}
              {activeProperties.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-4">
                    {language === 'en' ? 'Active Listings' : 'સક્રિય લિસ્ટિંગ્સ'} ({activeProperties.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Property' : 'પ્રોપર્ટી'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Type' : 'પ્રકાર'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Price' : 'કિંમત'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Status' : 'સ્થિતિ'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Views' : 'જોવાયેલા'}
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                            {language === 'en' ? 'Actions' : 'ક્રિયાઓ'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeProperties.map((property) => (
                          <tr key={property.id} className="border-b border-border hover:bg-muted/20">
                            <td className="py-4 px-2">
                              <div>
                                <div className="font-medium text-foreground text-sm">
                                  {property.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {property.location_village}, {property.location_district}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-2">
                              <span className="capitalize text-sm text-foreground">
                                {property.property_type}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <span className="text-sm font-medium text-foreground">
                                {formatPrice(property.price)}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                                {getStatusText(property.status)}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <span className="text-sm text-muted-foreground">
                                {property.views_count || 0}
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(property.id, 'sold')}
                                  disabled={actionLoading === property.id}
                                >
                                  {actionLoading === property.id ? (
                                    <Icon name="Loader2" size={14} className="animate-spin" />
                                  ) : (
                                    <Icon name="CheckCircle" size={14} />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => handleDeleteProperty(property.id || property._id, e)}
                                  disabled={actionLoading === (property.id || property._id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  {actionLoading === (property.id || property._id) ? (
                                    <Icon name="Loader2" size={14} className="animate-spin" />
                                  ) : (
                                    <Icon name="Trash2" size={14} />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
    </>
  );
};

export default PropertyTable;