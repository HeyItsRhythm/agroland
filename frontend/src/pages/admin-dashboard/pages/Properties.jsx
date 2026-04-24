import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AdminProperties = () => {
  const [language, setLanguage] = useState('en');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Load properties
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await propertyService.getProperties({ includeAll: true });

      if (result.success) {
        setProperties(result.data);
      } else {
        setError(result.error || 'Failed to load properties');
      }
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
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
        const successMessage = language === 'en'
          ? `Property status updated to ${newStatus}`
          : `પ્રોપર્ટી સ્ટેટસ ${newStatus} માં અપડેટ કરવામાં આવ્યું`;
        toast.success(successMessage);
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

  const handleDeleteProperty = (propertyId) => {
    toast((t) => (
      <div className="flex flex-col gap-2 min-w-[200px]">
        <p className="font-medium text-sm">
          {language === 'en' ? 'Delete this property?' : 'આ પ્રોપર્ટી ડિલીટ કરવી છે?'}
        </p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-200"
            onClick={() => toast.dismiss(t.id)}
          >
            {language === 'en' ? 'Cancel' : 'રદ કરો'}
          </button>
          <button 
            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700"
            onClick={() => {
              toast.dismiss(t.id);
              performDeleteProperty(propertyId);
            }}
          >
            {language === 'en' ? 'Delete' : 'ડિલીટ'}
          </button>
        </div>
      </div>
    ), { 
      duration: 5000, 
      icon: '⚠️',
      style: {
        background: '#fff',
        color: '#333',
        border: '1px solid #e5e7eb',
      }
    });
  };

  const performDeleteProperty = async (propertyId) => {
    try {
      setActionLoading(propertyId);
      setError(null);

      const result = await propertyService.deleteProperty(propertyId);

      if (result.success) {
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        // Show success message
        const successMessage = language === 'en' ? 'Property deleted successfully' : 'પ્રોપર્ટી સફળતાપૂર્વક ડિલીટ કરવામાં આવી';
        toast.success(successMessage);
      } else {
        console.error('Failed to delete property:', result.error);
        toast.error(result.error || (language === 'en' ? 'Failed to delete property' : 'પ્રોપર્ટી ડિલીટ કરવામાં નિષ્ફળ'));
      }
    } catch (err) {
      console.error('Error deleting property:', err);
      toast.error(language === 'en' ? 'Something went wrong' : 'કંઈક ખોટું થયું');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'sold': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'expired': return 'text-red-600 bg-red-50';
      case 'pending_approval': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status) => {
    if (language === 'en') {
      switch (status) {
        case 'active': return 'Active';
        case 'sold': return 'Sold';
        case 'pending': return 'Pending';
        case 'expired': return 'Expired';
        case 'pending_approval': return 'Pending Approval';
        default: return status;
      }
    } else {
      switch (status) {
        case 'active': return 'સક્રિય';
        case 'sold': return 'વેચાયેલ';
        case 'pending': return 'બાકી';
        case 'expired': return 'સમય સમાપ્ત';
        case 'pending_approval': return 'મંજૂરી બાકી';
        default: return status;
      }
    }
  };

  const filteredProperties = statusFilter === 'all'
    ? properties
    : properties.filter(property => property.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'en' ? 'Manage Properties' : 'પ્રોપર્ટીઝ મેનેજ કરો'}
        </h1>
        <div className="flex items-center gap-2">
          <select
            className="border border-border rounded-md px-3 py-2 bg-background text-foreground"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">{language === 'en' ? 'All Properties' : 'બધી પ્રોપર્ટીઝ'}</option>
            <option value="active">{language === 'en' ? 'Active' : 'સક્રિય'}</option>
            <option value="pending_approval">{language === 'en' ? 'Pending Approval' : 'મંજૂરી બાકી'}</option>
            <option value="sold">{language === 'en' ? 'Sold' : 'વેચાયેલ'}</option>
            <option value="pending">{language === 'en' ? 'Pending' : 'બાકી'}</option>
            <option value="expired">{language === 'en' ? 'Expired' : 'સમય સમાપ્ત'}</option>
          </select>
          <Button onClick={loadProperties}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            {language === 'en' ? 'Refresh' : 'રિફ્રેશ'}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">{language === 'en' ? 'Loading properties...' : 'પ્રોપર્ટીઝ લોડ થઈ રહી છે...'}</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive">
            <Icon name="AlertCircle" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">{error}</p>
            <Button variant="outline" className="mt-4" onClick={loadProperties}>
              <Icon name="RefreshCw" size={16} className="mr-2" />
              {language === 'en' ? 'Try Again' : 'ફરી પ્રયાસ કરો'}
            </Button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <Icon name="SearchX" size={48} className="mx-auto mb-4 opacity-20" />
            <p>{language === 'en' ? 'No properties found matching your selection' : 'તમારી પસંદગી સાથે મેળ ખાતી કોઈ પ્રોપર્ટી મળી નથી'}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="py-4 px-6 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Property' : 'પ્રોપર્ટી'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Type' : 'પ્રકાર'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Price' : 'કિંમત'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Status' : 'સ્થિતિ'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Seller' : 'વેચનાર'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Views' : 'વ્યૂઝ'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Phone' : 'ફોન'}
                    </th>
                    <th className="py-4 px-6 text-right font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Actions' : 'ક્રિયાઓ'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 cursor-pointer group" onClick={() => setSelectedProperty(property)}>
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border group-hover:border-primary transition-colors">
                            {property.images && property.images.length > 0 ? (
                              <Image
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon name="Building2" size={24} className="text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate max-w-[200px] group-hover:text-primary transition-colors">{property.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              <Icon name="MapPin" size={10} className="inline mr-1" />
                              {property.location_village}, {property.location_district}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-sm px-2 py-1 bg-muted rounded-md capitalize font-medium">{property.property_type}</span>
                      </td>
                      <td className="py-4 px-2 text-sm font-bold text-primary">
                        ₹{property.price.toLocaleString()}
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(
                            property.status
                          )}`}
                        >
                          {getStatusText(property.status)}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{property.seller?.full_name || 'Unknown'}</span>
                          <span className="text-[10px] text-muted-foreground">{property.seller?.phone || ''}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Icon name="Eye" size={12} className="mr-1" />
                          {property.views_count || 0}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                         <span className="text-sm font-medium">{property.seller?.phone || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {property.status === 'pending_approval' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusUpdate(property.id, 'active')}
                              disabled={actionLoading === property.id}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full h-8 w-8"
                              title="Approve"
                            >
                              {actionLoading === property.id ? (
                                <Icon name="Loader2" size={16} className="animate-spin" />
                              ) : (
                                <Icon name="CheckCircle" size={16} />
                              )}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-full h-8 w-8 text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedProperty(property)}
                            title="View Details"
                          >
                             <Icon name="Eye" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={actionLoading === property.id}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8"
                            title="Delete"
                          >
                            {actionLoading === property.id ? (
                              <Icon name="Loader2" size={16} className="animate-spin" />
                            ) : (
                              <Icon name="Trash2" size={16} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-4 space-y-4">
              {filteredProperties.map((property) => (
                <div key={property.id} className="bg-background border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex gap-4 mb-4 cursor-pointer" onClick={() => setSelectedProperty(property)}>
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                      {property.images && property.images.length > 0 ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="Building2" size={32} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-foreground text-sm truncate pr-2 group-hover:text-primary">{property.title}</h3>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${getStatusColor(property.status)}`}>
                          {getStatusText(property.status)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        <Icon name="MapPin" size={10} className="inline mr-1" />
                        {property.location_village}, {property.location_district}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-primary">₹{property.price.toLocaleString()}</span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-md font-bold uppercase tracking-tight">{property.property_type}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Icon name="User" size={12} />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground max-w-[80px] truncate">{property.seller?.full_name || 'Unknown'}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                       <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 rounded-lg shrink-0"
                        onClick={() => setSelectedProperty(property)}
                      >
                         <Icon name="Eye" size={14} />
                      </Button>
                      
                      {property.status === 'pending_approval' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(property.id, 'active')}
                          disabled={actionLoading === property.id}
                          className="h-8 w-8 p-0 text-green-600 border-green-200 bg-green-50 rounded-lg shrink-0"
                        >
                          <Icon name="CheckCircle" size={14} />
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProperty(property.id)}
                        disabled={actionLoading === property.id}
                        className="h-8 w-8 p-0 text-destructive border-red-200 bg-red-50 rounded-lg shrink-0"
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl scale-in-center transition-transform">
            {/* Modal Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(selectedProperty.status)}`}>
                  <Icon name="Landmark" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold truncate max-w-[300px]">{selectedProperty.title}</h2>
                  <p className="text-xs text-muted-foreground">ID: {selectedProperty.id}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedProperty(null)}
                className="rounded-full hover:bg-muted"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Media Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-video rounded-xl bg-muted overflow-hidden border border-border shadow-inner">
                  {selectedProperty.images && selectedProperty.images.length > 0 ? (
                    <Image
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Icon name="Image" size={48} className="opacity-20" />
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-primary">₹{selectedProperty.price.toLocaleString()}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusColor(selectedProperty.status)}`}>
                      {getStatusText(selectedProperty.status)}
                    </span>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                       <Icon name="MapPin" size={16} className="text-primary" />
                       <span className="font-medium text-sm">{selectedProperty.location_village}, {selectedProperty.location_taluka}, {selectedProperty.location_district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Icon name="Maximize" size={16} className="text-primary" />
                       <span className="font-medium text-sm">{selectedProperty.area} {selectedProperty.area_unit}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Icon name="Layout" size={16} className="text-primary" />
                       <span className="font-medium text-sm capitalize">{selectedProperty.property_type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 rounded-xl h-11"
                      onClick={() => window.open(`/property/${selectedProperty.id}`, '_blank')}
                    >
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      Public View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Icon name="AlignLeft" size={18} className="text-primary" />
                  Description
                </h3>
                <div className="text-muted-foreground leading-relaxed bg-muted/20 p-4 rounded-xl border border-border/50">
                  {selectedProperty.description || 'No description provided.'}
                </div>
              </div>

              {/* Seller Information */}
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Icon name="User" size={18} className="text-primary" />
                  Seller Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon name="User" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Full Name</p>
                      <p className="font-bold">{selectedProperty.seller?.full_name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Icon name="Phone" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone Number</p>
                      <p className="font-bold">{selectedProperty.seller?.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-border col-span-1 md:col-span-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <Icon name="Mail" size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email Address</p>
                      <p className="font-bold">{selectedProperty.seller?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Listed on: {new Date(selectedProperty.created_at).toLocaleDateString()}
              </span>
              <div className="flex gap-2">
                {selectedProperty.status === 'pending_approval' && (
                  <Button 
                    variant="outline" 
                    className="text-green-600 border-green-200 hover:bg-green-50 rounded-xl"
                    onClick={() => {
                        handleStatusUpdate(selectedProperty.id, 'active');
                        setSelectedProperty(null);
                    }}
                  >
                    Approve Property
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  className="rounded-xl"
                  onClick={() => {
                      handleDeleteProperty(selectedProperty.id);
                      setSelectedProperty(null);
                  }}
                >
                  Delete Property
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProperties;