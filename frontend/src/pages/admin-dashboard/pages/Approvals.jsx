import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const AdminApprovals = () => {
  const [language, setLanguage] = useState('en');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Load pending approval properties
    loadPendingProperties();
  }, []);

  const loadPendingProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await propertyService.getPendingApprovalProperties();

      if (result.success) {
        setProperties(result.data);
      } else {
        setError(result.error || 'Failed to load properties');
      }
    } catch (err) {
      console.error('Error loading pending properties:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (propertyId) => {
    try {
      setActionLoading(propertyId);
      setError(null);

      const result = await propertyService.approveProperty(propertyId, user.id);

      if (result.success) {
        // Remove from list
        setProperties(prev => prev.filter(p => p.id !== propertyId));

        // Show success message
        const successMessage = language === 'en'
          ? 'Property approved successfully'
          : 'પ્રોપર્ટી સફળતાપૂર્વક મંજૂર કરવામાં આવી';
        toast.success(successMessage);
      } else {
        console.error('Failed to approve property:', result.error);
        toast.error(result.error || (language === 'en' ? 'Failed to approve property' : 'પ્રોપર્ટી મંજૂર કરવામાં નિષ્ફળ'));
      }
    } catch (err) {
      console.error('Error approving property:', err);
      toast.error(language === 'en' ? 'Something went wrong' : 'કંઈક ખોટું થયું');
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectionModal = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const handleRejectProperty = async () => {
    if (!selectedPropertyId) return;

    try {
      setActionLoading(selectedPropertyId);
      setError(null);

      const result = await propertyService.rejectProperty(
        selectedPropertyId,
        user.id,
        rejectionReason
      );

      if (result.success) {
        // Remove from list
        setProperties(prev => prev.filter(p => p.id !== selectedPropertyId));

        // Close modal
        setShowRejectionModal(false);
        setSelectedPropertyId(null);
        setRejectionReason('');

        // Show success message
        const successMessage = language === 'en'
          ? 'Property rejected successfully'
          : 'પ્રોપર્ટી સફળતાપૂર્વક નકારવામાં આવી';
        toast.success(successMessage);
      } else {
        console.error('Failed to reject property:', result.error);
        toast.error(result.error || (language === 'en' ? 'Failed to reject property' : 'પ્રોપર્ટી નકારવામાં નિષ્ફળ'));
      }
    } catch (err) {
      console.error('Error rejecting property:', err);
      toast.error(language === 'en' ? 'Something went wrong' : 'કંઈક ખોટું થયું');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {language === 'en' ? 'Property Approvals' : 'પ્રોપર્ટી મંજૂરીઓ'}
        </h1>
        <Button onClick={loadPendingProperties}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          {language === 'en' ? 'Refresh' : 'રિફ્રેશ'}
        </Button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">{language === 'en' ? 'Loading pending approvals...' : 'મંજૂરી માટેની પ્રોપર્ટી લોડ થઈ રહી છે...'}</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-destructive">
             <Icon name="AlertCircle" size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-medium">{error}</p>
            <Button variant="outline" className="mt-4" onClick={loadPendingProperties}>
              <Icon name="RefreshCw" size={16} className="mr-2" />
              {language === 'en' ? 'Try Again' : 'ફરી પ્રયાસ કરો'}
            </Button>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
             <Icon name="CheckCircle2" size={48} className="mx-auto mb-4 opacity-20 text-green-500" />
            <p className="font-medium">
              {language === 'en'
                ? 'Great! No properties pending approval'
                : 'સરસ! કોઈ પ્રોપર્ટી મંજૂરી માટે બાકી નથી'}
            </p>
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
                      {language === 'en' ? 'Seller' : 'વેચનાર'}
                    </th>
                    <th className="py-4 px-2 text-left font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Submitted' : 'સબમિટ કર્યું'}
                    </th>
                    <th className="py-4 px-6 text-right font-semibold text-foreground text-sm uppercase tracking-wider">
                      {language === 'en' ? 'Actions' : 'ક્રિયાઓ'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                            {property.images && property.images.length > 0 ? (
                              <Image
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Icon name="Building2" size={24} className="text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground truncate max-w-[200px]">{property.title}</p>
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
                        <div className="flex flex-col">
                           <span className="text-sm font-medium">{property.seller?.full_name || 'Unknown'}</span>
                           <span className="text-[10px] text-muted-foreground">{property.seller?.phone || ''}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(property.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApproveProperty(property.id)}
                            disabled={actionLoading === property.id}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full h-8 w-8"
                          >
                            {actionLoading === property.id ? (
                              <Icon name="Loader2" size={16} className="animate-spin" />
                            ) : (
                              <Icon name="CheckCircle" size={16} />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openRejectionModal(property.id)}
                            disabled={actionLoading === property.id}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full h-8 w-8"
                          >
                            {actionLoading === property.id ? (
                              <Icon name="Loader2" size={16} className="animate-spin" />
                            ) : (
                              <Icon name="XCircle" size={16} />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/property/${property.id}`, '_blank')}
                            className="text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8"
                          >
                            <Icon name="Eye" size={16} />
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
              {properties.map((property) => (
                <div key={property.id} className="bg-background border border-border rounded-xl p-4 shadow-sm">
                  <div className="flex gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0 border border-border shadow-sm">
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
                        <h3 className="font-bold text-foreground text-sm truncate pr-2">{property.title}</h3>
                        <span className="shrink-0 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-black uppercase tracking-widest">Pending</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-2">
                        <Icon name="MapPin" size={10} className="inline mr-1" />
                        {property.location_village}, {property.location_district}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-primary">₹{property.price.toLocaleString()}</span>
                        <div className="flex items-center text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-bold">
                           <Icon name="Calendar" size={10} className="mr-1" />
                           {new Date(property.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
                        <Icon name="User" size={14} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-foreground max-w-[100px] truncate leading-none">{property.seller?.full_name || 'Unknown'}</span>
                        <span className="text-[9px] text-muted-foreground font-bold">{property.seller?.phone || 'No phone'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                       <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 p-0 rounded-xl bg-blue-50 text-blue-600 border border-blue-100"
                        onClick={() => window.open(`/property/${property.id}`, '_blank')}
                      >
                         <Icon name="Eye" size={16} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApproveProperty(property.id)}
                        className="h-9 w-9 p-0 bg-green-50 text-green-600 border border-green-100 rounded-xl"
                      >
                        <Icon name="CheckCircle" size={16} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRejectionModal(property.id)}
                        className="h-9 w-9 p-0 bg-red-50 text-red-600 border border-red-100 rounded-xl"
                      >
                        <Icon name="XCircle" size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">
              {language === 'en' ? 'Reject Property' : 'પ્રોપર્ટી નકારો'}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {language === 'en' ? 'Reason for rejection' : 'નકારવાનું કારણ'}
              </label>
              <textarea
                className="w-full border border-border rounded-md p-2 h-24"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={language === 'en' ? 'Enter reason...' : 'કારણ દાખલ કરો...'}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectionModal(false)}
                disabled={actionLoading === selectedPropertyId}
              >
                {language === 'en' ? 'Cancel' : 'રદ કરો'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectProperty}
                disabled={actionLoading === selectedPropertyId || !rejectionReason.trim()}
              >
                {actionLoading === selectedPropertyId ? (
                  <Icon name="Loader2" size={14} className="animate-spin mr-2" />
                ) : null}
                {language === 'en' ? 'Reject Property' : 'પ્રોપર્ટી નકારો'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;