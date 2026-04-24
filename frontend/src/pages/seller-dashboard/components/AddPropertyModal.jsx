import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { cn } from '../../../utils/cn';
import propertyService from '../../../utils/propertyService';
import fileService from '../../../utils/fileService';
import locationService from '../../../utils/locationService';
import settingsService from '../../../utils/settingsService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddPropertyModal = ({ isOpen, onClose, onSuccess, language }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [maxImages, setMaxImages] = useState(3); // Updated to 3 as requested by user
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'agricultural',
    price: '',
    area: '',
    location_village: '',
    location_taluka: '',
    location_district: '',
    amenities: [],
    images: [],
    property_section: '',
    map_url: '',
    area_unit: 'vigha'
  });

  const areaUnits = [
    { value: 'vigha', label: language === 'en' ? 'Vigha' : 'વીઘા' },
    { value: 'acres', label: language === 'en' ? 'Acre' : 'એકર' },
    { value: 'guntha', label: language === 'en' ? 'Guntha' : 'ગુંઠા' },
    { value: 'sqft', label: language === 'en' ? 'Sq. Ft' : 'ચોરસ ફૂટ' },
    { value: 'sqyard', label: language === 'en' ? 'Sq. Yard' : 'વાર' }
  ];

  const propertyTypes = [
    { value: 'agricultural', label: language === 'en' ? 'Agricultural' : 'કૃષિ' },
    { value: 'residential', label: language === 'en' ? 'Residential' : 'રહેણાંક' },
    { value: 'commercial', label: language === 'en' ? 'Commercial' : 'વાણિજ્યિક' },
    { value: 'industrial', label: language === 'en' ? 'Industrial' : 'ઔદ્યોગિક' }
  ];

  // Load districts and settings initially
  useEffect(() => {
    (async () => {
      try {
        const result = await locationService.getDistricts();
        setDistricts(result.data || []);

        // Load system settings for max images
        // We need to import settingsService at the top first, assuming it is imported
        // const settingsRes = await settingsService.getSystemSettings();
        // if (settingsRes.success && settingsRes.data) {
        //   if (settingsRes.data.maxImagesPerProperty) {
        //     setMaxImages(settingsRes.data.maxImagesPerProperty);
        //   }
        // }
        // User explicitly asked for max 3 images, so we skip loading from settings if it might override to a higher value
        setMaxImages(3);
      } catch (e) {
        console.error('Failed to load initial data', e);
        setDistricts([]);
      }
    })();
  }, []);

  // Load talukas when district changes
  useEffect(() => {
    (async () => {
      if (!formData.location_district) { setTalukas([]); return; }
      try {
        const result = await locationService.getSubDistricts(formData.location_district);
        setTalukas(result.data || []);
      } catch (e) {
        console.error('Failed to load talukas', e);
        setTalukas([]);
      }
    })();
  }, [formData.location_district]);

  // Load villages when taluka changes
  useEffect(() => {
    (async () => {
      if (!formData.location_district || !formData.location_taluka) { setVillages([]); return; }
      try {
        const result = await locationService.getVillages(formData.location_district, formData.location_taluka);
        setVillages(result.data || []);
      } catch (e) {
        console.error('Failed to load villages', e);
        setVillages([]);
      }
    })();
  }, [formData.location_district, formData.location_taluka]);

  const commonAmenities = [
    'Water Connection', 'Electricity', 'Road Access', 'Irrigation', 'Fencing',
    'Storage Facility', 'Tube Well', 'Drainage', 'Transportation', 'Market Access'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Check limit
    if (formData.images.length + files.length > maxImages) {
      toast.error(language === 'en'
        ? `You can only upload a maximum of ${maxImages} images.`
        : `તમે મહત્તમ ${maxImages} છબીઓ અપલોડ કરી શકો છો.`);
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError(language === 'en' ? 'Please log in to add property' : 'પ્રોપર્ટી ઉમેરવા માટે લોગિન કરો');
      return;
    }

    setError(null);
    setFieldErrors({});

    // Validate required fields
    const newErrors = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = language === 'en' ? 'Property title is required' : 'પ્રોપર્ટી શીર્ષક આવશ્યક છે';
    }

    if (!formData.description || !formData.description.trim()) {
      newErrors.description = language === 'en' ? 'Description is required' : 'વર્ણન આવશ્યક છે';
    }

    if (!formData.property_type) {
      newErrors.property_type = language === 'en' ? 'Please select a property type' : 'કૃપા કરીને પ્રોપર્ટીનો પ્રકાર પસંદ કરો';
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = language === 'en' ? 'Please enter a valid price' : 'કૃપા કરીને માન્ય કિંમત દાખલ કરો';
    }

    if (!formData.area || isNaN(parseFloat(formData.area)) || parseFloat(formData.area) <= 0) {
      newErrors.area = language === 'en' ? 'Please enter a valid area' : 'કૃપા કરીને માન્ય વિસ્તાર દાખલ કરો';
    }

    if (!formData.area_unit) {
      newErrors.area_unit = language === 'en' ? 'Area unit is required' : 'વિસ્તારનો એકમ આવશ્યક છે';
    }

    if (!formData.location_district) {
      newErrors.location_district = language === 'en' ? 'District is required' : 'જિલ્લો આવશ્યક છે';
    }

    if (!formData.location_taluka) {
      newErrors.location_taluka = language === 'en' ? 'Taluka is required' : 'તાલુકો આવશ્યક છે';
    }

    if (!formData.location_village) {
      newErrors.location_village = language === 'en' ? 'Village is required' : 'ગામ આવશ્યક છે';
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.images = language === 'en' ? 'At least one image is required' : 'ઓછામાં ઓછી એક છબી આવશ્યક છે';
    }

    if (!formData.property_section || !formData.property_section.trim()) {
      newErrors.property_section = language === 'en' ? 'Property section is required' : 'પ્રોપર્ટી વિભાગ આવશ્યક છે';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError(language === 'en' ? 'Please fill all required fields correctly' : 'કૃપા કરીને બધા આવશ્યક ક્ષેત્રો યોગ્ય રીતે ભરો');
      
      // Auto-focus and scroll to the first error field
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        // Special case for images which uses a hidden input
        const selector = firstErrorKey === 'images' ? '#image-upload' : `[name="${firstErrorKey}"]`;
        const errorElement = document.querySelector(selector);
        
        if (errorElement) {
          // Find the container to scroll to (the parent div of Input/Select)
          const container = errorElement.closest('.space-y-2') || errorElement.parentElement;
          container.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Try to focus the element
          if (errorElement.tagName === 'INPUT' || errorElement.tagName === 'SELECT' || errorElement.tagName === 'BUTTON' || errorElement.tagName === 'TEXTAREA') {
            errorElement.focus();
          }
        }
      }, 100);
      return;
    }

    setLoading(true);

    try {

      if (formData.images.length > 3) {
        throw new Error(language === 'en' ? 'Maximum 3 images allowed' : 'મહત્તમ 3 છબીઓ મંજૂરી છે');
      }

      // Upload images if any
      let imageUrls = [];
      if (formData.images && formData.images.length > 0) {
        // Ensure the property-images bucket exists before uploading
        await fileService.ensureBucketExists('property-images');

        const uploadResult = await fileService.uploadMultipleFiles(formData.images);
        if (!uploadResult.success) {
          throw new Error(language === 'en' ?
            `Failed to upload images: ${uploadResult.error}` :
            `છબીઓ અપલોડ કરવામાં નિષ્ફળ: ${uploadResult.error}`);
        }
        imageUrls = uploadResult.urls;
      }

      // Ensure all required fields are present and properly formatted
      // Build propertyData explicitly to avoid including File objects
      const propertyData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        property_type: formData.property_type,
        seller_id: user.id,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        area_unit: formData.area_unit,
        location_village: formData.location_village.trim(),
        location_taluka: formData.location_taluka?.trim() || null,
        location_district: formData.location_district.trim(),
        location_section: formData.property_section.trim(),
        map_url: formData.map_url?.trim() || '',
        location_state: 'Gujarat',
        amenities: Array.isArray(formData.amenities) ? formData.amenities : [],
        images: imageUrls, // Use the uploaded image URLs
        status: 'pending_approval', // Properties need admin approval before becoming active
        views_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await propertyService.createProperty(propertyData);

      if (result.success) {
        onSuccess?.(result.data);
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          property_type: 'agricultural',
          price: '',
          area: '',
          location_village: '',
          location_taluka: '',
          location_district: '',
          amenities: [],
          images: [],
          property_section: '',
          area_unit: 'vigha'
        });
      } else {
        console.error('Property creation error:', result.error);
        setError(result.error || (language === 'en' ? 'Failed to add property' : 'પ્રોપર્ટી ઉમેરવામાં નિષ્ફળ'));
      }
    } catch (err) {
      console.error('Property creation error:', err);
      console.error('Error details:', {
        message: err?.message,
        stack: err?.stack,
        name: err?.name,
        error: err
      });

      // Show more specific errors where possible
      const errorMessage = err?.message || String(err || '');
      const msg = errorMessage.toLowerCase();

      if (msg.includes('enum') || msg.includes('invalid input value for enum')) {
        setError(language === 'en'
          ? 'Invalid property status. The system is updating. Please try again in a moment.'
          : 'અમાન્ય પ્રોપર્ટી સ્થિતિ. સિસ્ટમ અપડેટ થઈ રહી છે. કૃપા કરીને એક ક્ષણમાં ફરી પ્રયાસ કરો.');
      } else if (msg.includes('policy') || msg.includes('rls') || msg.includes('permission') || msg.includes('denied')) {
        setError(language === 'en'
          ? 'Permission denied. Please ensure you are logged in as a seller and try again.'
          : 'પરવાનગી નકારવામાં આવી. કૃપા કરીને ખાતરી કરો કે તમે વેચનાર તરીકે લોગ ઇન છો અને ફરી પ્રયાસ કરો.');
      } else if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
        setError(language === 'en'
          ? 'Network/database connection issue. Please check your internet connection and try again.'
          : 'નેટવર્ક/ડેટાબેઝ કનેક્શન સમસ્યા. કૃપા કરીને તમારું ઇન્ટરનેટ કનેક્શન તપાસો અને ફરી પ્રયાસ કરો.');
      } else if (msg.includes('null value') || msg.includes('not null')) {
        setError(language === 'en'
          ? 'Please fill all required fields correctly.'
          : 'કૃપા કરીને બધા આવશ્યક ક્ષેત્રો યોગ્ય રીતે ભરો.');
      } else if (errorMessage && errorMessage.length > 0) {
        // Use the actual error message if available
        setError(errorMessage);
      } else {
        setError(language === 'en'
          ? 'Something went wrong. Please check all fields and try again.'
          : 'કંઈક ખોટું થયું છે. કૃપા કરીને બધા ક્ષેત્રો તપાસો અને ફરી પ્રયાસ કરો.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {language === 'en' ? 'Add New Property' : 'નવી પ્રોપર્ટી ઉમેરો'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-6">
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

            <Input
              label={language === 'en' ? 'Property Title' : 'પ્રોપર્ટી શીર્ષક'}
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={language === 'en' ? 'Enter property title' : 'પ્રોપર્ટી શીર્ષક દાખલ કરો'}
              required
              error={fieldErrors.title}
            />

            <div className="space-y-2">
              <label className={cn(
                "text-sm font-bold leading-none mb-2 block",
                fieldErrors.description ? "text-destructive" : "text-foreground"
              )}>
                {language === 'en' ? 'Description' : 'વર્ણન'} <span className="text-destructive">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
                className={cn(
                  "w-full px-3 py-2 border rounded-xl bg-card text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20",
                  fieldErrors.description 
                    ? "border-destructive focus:ring-destructive" 
                    : "border-border focus:border-primary",
                  "text-foreground placeholder:text-muted-foreground"
                )}
                placeholder={language === 'en' ? 'Describe your property...' : 'તમારી પ્રોપર્ટીનું વર્ણન કરો...'}
              />
              {fieldErrors.description && (
                <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label={language === 'en' ? 'Property Type' : 'પ્રોપર્ટીનો પ્રકાર'}
                name="property_type"
                value={formData.property_type}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, property_type: val }));
                  if (fieldErrors.property_type) {
                    setFieldErrors(prev => ({ ...prev, property_type: null }));
                  }
                }}
                options={propertyTypes}
                required
                error={fieldErrors.property_type}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={language === 'en' ? 'Price (₹)' : 'કિંમત (₹)'}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                required
                error={fieldErrors.price}
              />

              <Input
                label={language === 'en' ? 'Property Section/Area Name' : 'પ્રોપર્ટી વિભાગ/વિસ્તારનું નામ'}
                name="property_section"
                value={formData.property_section}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'e.g. Phase 1, Section A' : 'દા.ત. ફેઝ ૧, સેક્શન એ'}
                required
                error={fieldErrors.property_section}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={language === 'en' ? 'Area' : 'વિસ્તાર'}
                name="area"
                type="number"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="0"
                required
                error={fieldErrors.area}
              />

              <Select
                label={language === 'en' ? 'Area Unit' : 'વિસ્તારનો એકમ'}
                name="area_unit"
                value={formData.area_unit}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, area_unit: val }));
                  if (fieldErrors.area_unit) {
                    setFieldErrors(prev => ({ ...prev, area_unit: null }));
                  }
                }}
                options={areaUnits}
                required
                error={fieldErrors.area_unit}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              {language === 'en' ? 'Location Details' : 'સ્થળની વિગતો'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label={language === 'en' ? 'District' : 'જિલ્લો'}
                value={formData.location_district}
                onChange={(val) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    location_district: val,
                    location_taluka: '',
                    location_village: ''
                  }));
                  if (fieldErrors.location_district) {
                    setFieldErrors(prev => ({ ...prev, location_district: null }));
                  }
                }}
                options={districts.map(d => ({ value: d, label: d }))}
                placeholder={language === 'en' ? 'Select district' : 'જિલ્લો પસંદ કરો'}
                required
                error={fieldErrors.location_district}
                searchable
              />

              <Select
                label={language === 'en' ? 'Taluka' : 'તાલુકો'}
                value={formData.location_taluka}
                onChange={(val) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    location_taluka: val,
                    location_village: ''
                  }));
                  if (fieldErrors.location_taluka) {
                    setFieldErrors(prev => ({ ...prev, location_taluka: null }));
                  }
                }}
                options={talukas.map(t => ({ value: t, label: t }))}
                placeholder={language === 'en' ? 'Select taluka' : 'તાલુકો પસંદ કરો'}
                required
                disabled={!formData.location_district}
                error={fieldErrors.location_taluka}
                searchable
              />

              <Select
                label={language === 'en' ? 'Village' : 'ગામ'}
                value={formData.location_village}
                onChange={(val) => {
                  setFormData(prev => ({ ...prev, location_village: val }));
                  if (fieldErrors.location_village) {
                    setFieldErrors(prev => ({ ...prev, location_village: null }));
                  }
                }}
                options={villages.map(v => ({ value: v, label: v }))}
                placeholder={language === 'en' ? 'Select village' : 'ગામ પસંદ કરો'}
                required
                error={fieldErrors.location_village}
                searchable
              />
            </div>

            <div className="pt-2">
              <Input
                label={language === 'en' ? 'Google Maps Link' : 'ગૂગલ મેપ્સ લિંક'}
                name="map_url"
                value={formData.map_url || ''}
                onChange={handleInputChange}
                placeholder={language === 'en' ? 'Paste Google Maps location link' : 'ગૂગલ મેપ્સ લોકેશન લિંક પેસ્ટ કરો'}
                error={fieldErrors.map_url}
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              {language === 'en' ? 'Property Images' : 'પ્રોપર્ટીની છબીઓ'}
            </h3>

            <div className="space-y-2">
              <label className={cn(
                "text-sm font-bold leading-none mb-2 block",
                fieldErrors.images ? "text-destructive" : "text-foreground"
              )}>
                {language === 'en' ? 'Upload Images' : 'છબીઓ અપલોડ કરો'} <span className="text-destructive">*</span>
              </label>
              <div className="relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    handleImageUpload(e);
                    if (fieldErrors.images) setFieldErrors(prev => ({ ...prev, images: null }));
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload"
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-primary/5 transition-all duration-200",
                    fieldErrors.images 
                      ? "border-destructive bg-destructive/5 hover:border-destructive/80" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Icon name="Image" size={24} className={cn("mb-2 group-hover:scale-110 transition-transform", fieldErrors.images ? "text-destructive" : "text-muted-foreground")} />
                  <span className="text-sm font-medium text-foreground">
                    {language === 'en' ? 'Click to upload images' : 'છબીઓ અપલોડ કરવા ક્લિક કરો'}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {language === 'en' ? '1 to 3 images allowed' : '1 થી 3 છબીઓ મંજૂરી છે'}
                  </span>
                </label>
              </div>
              {fieldErrors.images && (
                <p className="text-[10px] font-bold text-destructive uppercase tracking-tight">
                  {fieldErrors.images}
                </p>
              )}
              <p className="text-xs text-muted-foreground italic">
                {language === 'en' ? `Max 5MB each (JPG, PNG)` : `દરેક મહત્તમ 5MB (JPG, PNG)`}
              </p>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              {language === 'en' ? 'Amenities' : 'સુવિધાઓ'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {language === 'en' ? 'Cancel' : 'રદ કરો'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  {language === 'en' ? 'Adding...' : 'ઉમેરી રહ્યું છે...'}
                </div>
              ) : (
                language === 'en' ? 'Add Property' : 'પ્રોપર્ટી ઉમેરો'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;