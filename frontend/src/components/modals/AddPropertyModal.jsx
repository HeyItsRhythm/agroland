import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import propertyService from '../../utils/propertyService';

const AddPropertyModal = ({ isOpen, onClose, onSuccess, language = 'en' }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'agricultural',
    price: '',
    area: '',
    location_village: '',
    location_district: '',
    location_state: 'Gujarat',
    amenities: []
  });

  const propertyTypes = [
    { value: 'agricultural', label: language === 'en' ? 'Agricultural Land' : 'કૃષિ જમીન' },
    { value: 'farm', label: language === 'en' ? 'Farm Land' : 'ફાર્મ જમીન' },
    { value: 'plot', label: language === 'en' ? 'Plot' : 'પ્લોટ' },
    { value: 'orchard', label: language === 'en' ? 'Orchard' : 'બાગ' }
  ];

  const amenitiesList = [
    { id: 'water', label: language === 'en' ? 'Water Source' : 'પાણીનો સ્ત્રોત' },
    { id: 'electricity', label: language === 'en' ? 'Electricity' : 'વીજળી' },
    { id: 'road', label: language === 'en' ? 'Road Access' : 'રસ્તાની સુવિધા' },
    { id: 'irrigation', label: language === 'en' ? 'Irrigation System' : 'સિંચાઈ સિસ્ટમ' },
    { id: 'storage', label: language === 'en' ? 'Storage Facility' : 'સ્ટોરેજ સુવિધા' },
    { id: 'fencing', label: language === 'en' ? 'Fencing' : 'વાડ' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => {
      const currentAmenities = [...prev.amenities];
      if (currentAmenities.includes(amenityId)) {
        return { ...prev, amenities: currentAmenities.filter(id => id !== amenityId) };
      } else {
        return { ...prev, amenities: [...currentAmenities, amenityId] };
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      property_type: 'agricultural',
      price: '',
      area: '',
      location_village: '',
      location_district: '',
      location_state: 'Gujarat',
      amenities: []
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    const requiredFields = ['title', 'price', 'area', 'location_village', 'location_district'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(language === 'en' 
        ? `Please fill in all required fields: ${missingFields.join(', ')}` 
        : `કૃપા કરીને બધા આવશ્યક ક્ષેત્રો ભરો: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    // Validate numeric fields
    if (isNaN(parseFloat(formData.price)) || isNaN(parseFloat(formData.area))) {
      setError(language === 'en' 
        ? 'Price and area must be valid numbers' 
        : 'કિંમત અને ક્ષેત્રફળ માન્ય સંખ્યાઓ હોવી જોઈએ');
      setLoading(false);
      return;
    }

    try {
      if (!user?.id) {
        throw new Error(language === 'en' ? 'You must be logged in to add a property' : 'પ્રોપર્ટી ઉમેરવા માટે તમારે લોગ ઇન હોવું આવશ્યક છે');
      }

      // Prepare property data
      const propertyData = {
        title: formData.title,
        description: formData.description || '',
        property_type: formData.property_type,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        location_village: formData.location_village,
        location_district: formData.location_district,
        location_state: formData.location_state,
        amenities: formData.amenities,
        seller_id: user.id,
        status: 'pending_approval',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        images: [],
        views_count: 0
      };

      // Call API to create property
      const result = await propertyService.createProperty(propertyData);
      
      if (result.success) {
        // Reset form and close modal
        resetForm();
        if (onSuccess) onSuccess(result.data);
        if (onClose) onClose();
      } else {
        throw new Error(result.error || (language === 'en' ? 'Failed to create property' : 'પ્રોપર્ટી બનાવવામાં નિષ્ફળ'));
      }
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err.message || (language === 'en' ? 'An error occurred' : 'એક ભૂલ આવી'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
          <h2 className="text-xl font-semibold text-foreground">
            {language === 'en' ? 'Add New Property' : 'નવી પ્રોપર્ટી ઉમેરો'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              {language === 'en' ? 'Basic Information' : 'મૂળભૂત માહિતી'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'Title' : 'શીર્ષક'} *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter property title' : 'પ્રોપર્ટી શીર્ષક દાખલ કરો'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'Property Type' : 'પ્રોપર્ટી પ્રકાર'} *
                </label>
                <Select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  options={propertyTypes}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'Price (₹)' : 'કિંમત (₹)'} *
                </label>
                <Input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter price' : 'કિંમત દાખલ કરો'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'Area (acres)' : 'ક્ષેત્રફળ (એકર)'} *
                </label>
                <Input
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter area' : 'ક્ષેત્રફળ દાખલ કરો'}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'Description' : 'વર્ણન'}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground resize-none"
                  placeholder={language === 'en' ? 'Enter property description' : 'પ્રોપર્ટી વર્ણન દાખલ કરો'}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              {language === 'en' ? 'Location' : 'સ્થાન'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'Village/Town' : 'ગામ/શહેર'} *
                </label>
                <Input
                  name="location_village"
                  value={formData.location_village}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter village/town' : 'ગામ/શહેર દાખલ કરો'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'District' : 'જિલ્લો'} *
                </label>
                <Input
                  name="location_district"
                  value={formData.location_district}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter district' : 'જિલ્લો દાખલ કરો'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {language === 'en' ? 'State' : 'રાજ્ય'}
                </label>
                <Input
                  name="location_state"
                  value={formData.location_state}
                  onChange={handleChange}
                  placeholder={language === 'en' ? 'Enter state' : 'રાજ્ય દાખલ કરો'}
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              {language === 'en' ? 'Amenities' : 'સુવિધાઓ'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity.id}`}
                    checked={formData.amenities.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor={`amenity-${amenity.id}`} className="text-sm text-foreground">
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              {language === 'en' ? 'Cancel' : 'રદ કરો'}
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {language === 'en' ? 'Add Property' : 'પ્રોપર્ટી ઉમેરો'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;