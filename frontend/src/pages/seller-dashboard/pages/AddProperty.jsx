import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import propertyService from '../../../utils/propertyService';
import fileService from '../../../utils/fileService';
import locationService from '../../../utils/locationService';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

import { useLanguage } from '../../../contexts/LanguageContext';

const SellerAddProperty = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const isEditMode = !!editId;

  const { user } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // New loading state for fetching data
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    areaUnit: 'vigha',
    location_village: '',
    location_taluka: '',
    location_district: '',
    state: 'Gujarat',
    propertyType: 'agricultural',
    soilType: '',
    waterAvailability: '',
    roadAccess: '',
    electricity: false,
    irrigation: false,
    map_url: '',
    images: [] // Stores File objects (new) or URL strings (existing)
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const [existingImages, setExistingImages] = useState([]); // Separate state for URLs to display

  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  // Fetch data for Edit Mode
  useEffect(() => {
    if (isEditMode && user?.id) {
      setFetching(true);
      (async () => {
        try {
          const result = await propertyService.getPropertyById(editId);
          if (result.success) {
            const data = result.data;
            // Verify ownership
            if (data.seller_id !== user.id) {
              setError(language === 'en' ? 'Unauthorized access' : 'અનધિકૃત પ્રવેશ');
              return;
            }

            // Use saved area and unit directly
            const unit = data.area_unit || 'vigha';
            const displayArea = data.area;

            // Extract amenities
            const am = data.amenities || [];
            const soil = am.find(a => a.startsWith('Soil Type: '))?.replace('Soil Type: ', '') || '';
            const water = am.find(a => a.startsWith('Water: '))?.replace('Water: ', '') || '';
            const road = am.find(a => a.startsWith('Road: '))?.replace('Road: ', '') || '';

            setFormData({
              title: data.title || '',
              description: data.description || '',
              price: data.price || '',
              area: Math.round(displayArea * 100) / 100, // Round to 2 decimals
              areaUnit: unit,
              location_village: data.location_village || '',
              location_taluka: data.location_taluka || '',
              location_district: data.location_district || '',
              state: data.location_state || 'Gujarat',
              propertyType: data.property_type === 'agricultural' ? 'agricultural' : data.property_type, // Map back if needed
              soilType: soil,
              waterAvailability: water,
              roadAccess: road,
              electricity: am.includes('Electricity'),
              irrigation: am.includes('Irrigation'),
              map_url: data.map_url || '',
              images: [] // New images only
            });
            setExistingImages(data.images || []);
          } else {
            setError(language === 'en' ? 'Failed to load property details' : 'પ્રોપર્ટી વિગતો લોડ કરવામાં નિષ્ફળ');
          }
        } catch (err) {
          console.error(err);
          setError(language === 'en' ? 'Error loading property' : 'પ્રોપર્ટી લોડ કરવામાં ભૂલ');
        } finally {
          setFetching(false);
        }
      })();
    }
  }, [editId, user, isEditMode, language]);

  useEffect(() => {
    (async () => {
      try {
        const result = await locationService.getDistricts();
        if (result.success) {
          setDistricts(result.data || []);
        } else {
          console.error("Failed to load districts:", result.error);
          setDistricts([]);
        }
      } catch (e) {
        console.error("Error loading districts:", e);
        setDistricts([]);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!formData.location_district) { setTalukas([]); return; }
      try {
        const result = await locationService.getSubDistricts(formData.location_district);
        if (result.success) {
          setTalukas(result.data || []);
        } else {
          // Keep existing taluka if loading fails or during init
          if (!talukas.includes(formData.location_taluka)) setTalukas([]);
        }
      } catch (e) {
        console.error("Error loading talukas:", e);
      }
    })();
  }, [formData.location_district]);

  useEffect(() => {
    (async () => {
      if (!formData.location_district || !formData.location_taluka) { setVillages([]); return; }
      try {
        const result = await locationService.getVillages(formData.location_district, formData.location_taluka);
        if (result.success) {
          setVillages(result.data || []);
        }
      } catch (e) {
        console.error("Error loading villages:", e);
      }
    })();
  }, [formData.location_district, formData.location_taluka]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + formData.images.length + files.length;
    
    if (totalImages > 3) {
      toast.error(language === 'en' 
        ? 'Maximum 3 images allowed in total.' 
        : 'કુલ મહત્તમ 3 છબીઓ મંજૂરી છે.');
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

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError(language === 'en' ? 'Please log in' : 'કૃપા કરીને લોગિન કરો');
      return;
    }

    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate required fields
      const newErrors = {};
      const { 
        title, description, 
        location_district, location_taluka, location_village,
        soilType, waterAvailability, roadAccess
      } = formData;

      if (!title?.trim()) {
        newErrors.title = language === 'en' ? 'Please enter a property title' : 'કૃપા કરીને પ્રોપર્ટીનું શીર્ષક દાખલ કરો';
      }
      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        newErrors.price = language === 'en' ? 'Please enter a valid price' : 'કૃપા કરીને માન્ય કિંમત દાખલ કરો';
      }
      if (!formData.area || isNaN(parseFloat(formData.area)) || parseFloat(formData.area) <= 0) {
        newErrors.area = language === 'en' ? 'Please enter a valid area' : 'કૃપા કરીને માન્ય વિસ્તાર દાખલ કરો';
      }
      if (!description?.trim()) {
        newErrors.description = language === 'en' ? 'Please enter a description' : 'કૃપા કરીને વર્ણન દાખલ કરો';
      }
      if (!location_district) {
        newErrors.location_district = language === 'en' ? 'Please select a district' : 'કૃપા કરીને જિલ્લો પસંદ કરો';
      }
      if (!location_taluka) {
        newErrors.location_taluka = language === 'en' ? 'Please select a taluka' : 'કૃપા કરીને તાલુકો પસંદ કરો';
      }
      if (!location_village) {
        newErrors.location_village = language === 'en' ? 'Please select a village' : 'કૃપા કરીને ગામ પસંદ કરો';
      }
      if (!soilType?.trim()) {
        newErrors.soilType = language === 'en' ? 'Please enter soil type' : 'કૃપા કરીને માટીનો પ્રકાર દાખલ કરો';
      }
      if (!waterAvailability?.trim()) {
        newErrors.waterAvailability = language === 'en' ? 'Please enter water availability' : 'કૃપા કરીને પાણીની ઉપલબ્ધતા દાખલ કરો';
      }
      if (!roadAccess?.trim()) {
        newErrors.roadAccess = language === 'en' ? 'Please enter road access' : 'કૃપા કરીને રોડ એક્સેસ દાખલ કરો';
      }

      const totalImages = existingImages.length + (formData.images?.length || 0);
      if (totalImages === 0) {
        newErrors.images = language === 'en' ? 'Please upload at least one image' : 'કૃપા કરીને ઓછામાં ઓછી એક છબી અપલોડ કરો';
      }
      
      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        
        // Auto-focus and scroll to the first field error
        setTimeout(() => {
          const firstErrorKey = Object.keys(newErrors)[0];
          // Try to find by ID first (more reliable), then fallback to name
          const errorElement = document.getElementById(firstErrorKey) || 
                             document.querySelector(`[name="${firstErrorKey}"]`) ||
                             (firstErrorKey === 'images' ? document.getElementById('image-upload') : null);
          
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Give extra time for smooth scroll to finish and any re-renders to settle
            setTimeout(() => {
              if (typeof errorElement.focus === 'function') {
                errorElement.focus();
              }
            }, 300);
          }
        }, 100);

        throw new Error(language === 'en' ? 'Please fill all required fields correctly' : 'કૃપા કરીને બધા આવશ્યક ક્ષેત્રો યોગ્ય રીતે ભરો');
      }

      const price = parseFloat(formData.price);
      const area = parseFloat(formData.area);

      // Store raw area and price as per user requirement (No conversion)
      const areaInUnit = area;

      // Build amenities array
      const amenities = [];
      if (formData.electricity) amenities.push('Electricity');
      if (formData.irrigation) amenities.push('Irrigation');
      if (formData.soilType?.trim()) amenities.push(`Soil Type: ${formData.soilType.trim()}`);
      if (formData.waterAvailability?.trim()) amenities.push(`Water: ${formData.waterAvailability.trim()}`);
      if (formData.roadAccess?.trim()) amenities.push(`Road: ${formData.roadAccess.trim()}`);

      // Upload NEW images
      let newImageUrls = [];
      if (formData.images && formData.images.length > 0) {
        const uploadResult = await fileService.uploadMultipleFiles(formData.images);
        if (!uploadResult.success) throw new Error(uploadResult.error);
        newImageUrls = uploadResult.urls || [];
      }

      // Combine existing and new images
      const finalImages = [...existingImages, ...newImageUrls];

      const propertyData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
        property_type: formData.propertyType,
        seller_id: user.id,
        price: price,
        area: areaInUnit,
        area_unit: formData.areaUnit, 
        location_village: formData.location_village.trim(),
        location_taluka: formData.location_taluka?.trim() || null,
        location_district: formData.location_district.trim(),
        location_state: 'Gujarat',
        amenities: amenities,
        map_url: formData.map_url?.trim() || '',
        images: finalImages,
        status: 'pending_approval', // Always reset to pending on edit
        updated_at: new Date().toISOString()
      };

      let result;
      if (isEditMode) {
        result = await propertyService.updateProperty(editId, propertyData);
      } else {
        propertyData.created_at = new Date().toISOString();
        propertyData.views_count = 0;
        result = await propertyService.createProperty(propertyData);
      }

      if (result.success) {
        toast.success(language === 'en'
          ? (isEditMode ? 'Property updated! Waiting for approval.' : 'Property added! Waiting for approval.')
          : (isEditMode ? 'પ્રોપર્ટી અપડેટ થઈ! મંજૂરીની રાહ જોઈ રહ્યા છે.' : 'પ્રોપર્ટી ઉમેરાઈ! મંજૂરીની રાહ જોઈ રહ્યા છે.'));
        navigate('/seller-dashboard/properties');
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Operation error:', err);
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const propertyTypes = [
    { value: 'agricultural', label: language === 'en' ? 'Agricultural Land' : 'કૃષિ જમીન' },
    { value: 'farm', label: language === 'en' ? 'Farm Land' : 'ખેતી જમીન' },
    { value: 'orchard', label: language === 'en' ? 'Orchard' : 'બગીચો' },
    { value: 'plantation', label: language === 'en' ? 'Plantation' : 'વૃક્ષારોપણ' }
  ];

  const areaUnits = [
    { value: 'vigha', label: language === 'en' ? 'Vigha' : 'વીઘા' },
    { value: 'acres', label: language === 'en' ? 'Acre' : 'એકર' },
    { value: 'guntha', label: language === 'en' ? 'Guntha' : 'ગુંઠા' },
    { value: 'sqft', label: language === 'en' ? 'Sq Ft' : 'ચોરસ ફૂટ' },
    { value: 'sqyard', label: language === 'en' ? 'Sq Yard' : 'વાર' },
    { value: 'hectares', label: language === 'en' ? 'Hectare' : 'હેક્ટર' }
  ];

  const getPriceLabel = () => {
    const unit = areaUnits.find(u => u.value === formData.areaUnit)?.label || (language === 'en' ? 'Unit' : 'એકમ');
    return language === 'en' ? `Price per ${unit} (₹)` : `${unit} દીઠ કિંમત (₹)`;
  };

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Add Property - Seller Dashboard' : 'પ્રોપર્ટી ઉમેરો - વેચનાર ડેશબોર્ડ'}
        </title>
      </Helmet>

      <div className="max-w-4xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            {language === 'en' ? 'Add New Property' : 'નવી પ્રોપર્ટી ઉમેરો'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en' ? 'Fill in the details below to list your property for sale' : 'તમારી પ્રોપર્ટી વેચવા માટે નીચેની વિગતો ભરો'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {language === 'en' ? 'Basic Information' : 'મૂળભૂત માહિતી'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Property Title' : 'પ્રોપર્ટીનું શીર્ષક'}
                </label>
                <Input
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Enter property title' : 'પ્રોપર્ટીનું શીર્ષક દાખલ કરો'}
                  required
                  error={fieldErrors.title}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Property Type' : 'પ્રોપર્ટીનો પ્રકાર'} <span className="text-destructive">*</span>
                </label>
                <Select
                  name="propertyType"
                  id="propertyType"
                  value={formData.propertyType}
                  options={propertyTypes}
                  onChange={(val) => {
                    setFormData(prev => ({ ...prev, propertyType: val }));
                    if (fieldErrors.propertyType) setFieldErrors(prev => ({ ...prev, propertyType: null }));
                  }}
                  placeholder={language === 'en' ? 'Select type' : 'પ્રકાર પસંદ કરો'}
                  required
                  error={fieldErrors.propertyType}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {getPriceLabel()}
                </label>
                <Input
                  name="price"
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Enter price' : 'કિંમત દાખલ કરો'}
                  required
                  error={fieldErrors.price}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === 'en' ? 'Area' : 'વિસ્તાર'}
                  </label>
                  <Input
                    name="area"
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder={language === 'en' ? 'Area' : 'વિસ્તાર'}
                    required
                    error={fieldErrors.area}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === 'en' ? 'Unit' : 'એકમ'}
                  </label>
                  <Select
                    name="areaUnit"
                    id="areaUnit"
                    value={formData.areaUnit}
                    options={areaUnits}
                    onChange={(val) => {
                      setFormData(prev => ({ ...prev, areaUnit: val }));
                      if (fieldErrors.areaUnit) setFieldErrors(prev => ({ ...prev, areaUnit: null }));
                    }}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Description' : 'વર્ણન'} <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${fieldErrors.description ? 'border-destructive' : 'border-border'}`}
                  placeholder={language === 'en' ? 'Describe your property in detail' : 'તમારી પ્રોપર્ટીનું વિગતવાર વર્ણન કરો'}
                  required
                />
                {fieldErrors.description && <p className="text-[10px] font-bold text-destructive mt-1 uppercase tracking-tight">{fieldErrors.description}</p>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {language === 'en' ? 'Location Information' : 'સ્થાન માહિતી'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{language === 'en' ? 'District' : 'જિલ્લો'} <span className="text-destructive">*</span></label>
                <select
                  name="location_district"
                  id="location_district"
                  value={formData.location_district}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${fieldErrors.location_district ? 'border-destructive' : 'border-border'}`}
                  required
                >
                  <option value="">{language === 'en' ? 'Select district' : 'જિલ્લો પસંદ કરો'}</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {fieldErrors.location_district && <p className="text-[10px] font-bold text-destructive mt-1 uppercase tracking-tight">{fieldErrors.location_district}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{language === 'en' ? 'Taluka' : 'તાલુકો'} <span className="text-destructive">*</span></label>
                <select
                  name="location_taluka"
                  id="location_taluka"
                  value={formData.location_taluka}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${fieldErrors.location_taluka ? 'border-destructive' : 'border-border'}`}
                  required
                  disabled={!formData.location_district}
                >
                  <option value="">{language === 'en' ? 'Select taluka' : 'તાલુકો પસંદ કરો'}</option>
                  {talukas.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {fieldErrors.location_taluka && <p className="text-[10px] font-bold text-destructive mt-1 uppercase tracking-tight">{fieldErrors.location_taluka}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{language === 'en' ? 'Village' : 'ગામ'} <span className="text-destructive">*</span></label>
                <select
                  name="location_village"
                  id="location_village"
                  value={formData.location_village}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${fieldErrors.location_village ? 'border-destructive' : 'border-border'}`}
                  required
                  disabled={!formData.location_taluka}
                >
                  <option value="">{language === 'en' ? 'Select village' : 'ગામ પસંદ કરો'}</option>
                  {villages.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
                {fieldErrors.location_village && <p className="text-[10px] font-bold text-destructive mt-1 uppercase tracking-tight">{fieldErrors.location_village}</p>}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Google Maps Link' : 'ગૂગલ મેપ્સ લિંક'}
                </label>
                <Input
                  name="map_url"
                  value={formData.map_url}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'Paste Google Maps location link (optional)' : 'ગૂગલ મેપ્સ લોકેશન લિંક પેસ્ટ કરો (વૈકલ્પિક)'}
                  error={fieldErrors.map_url}
                />
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {language === 'en' ? 'Property Features' : 'પ્રોપર્ટી સુવિધાઓ'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Soil Type' : 'માટીનો પ્રકાર'} <span className="text-destructive">*</span>
                </label>
                <Input
                  name="soilType"
                  id="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g., Black soil, Red soil' : 'દા.ત., કાળી માટી, લાલ માટી'}
                  required
                  error={fieldErrors.soilType}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Water Availability' : 'પાણીની ઉપલબ્ધતા'} <span className="text-destructive">*</span>
                </label>
                <Input
                  name="waterAvailability"
                  id="waterAvailability"
                  value={formData.waterAvailability}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g., Well, Canal, River' : 'દા.ત., વાવ, નહેર, નદી'}
                  required
                  error={fieldErrors.waterAvailability}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === 'en' ? 'Road Access' : 'રોડ એક્સેસ'} <span className="text-destructive">*</span>
                </label>
                <Input
                  name="roadAccess"
                  id="roadAccess"
                  value={formData.roadAccess}
                  onChange={handleInputChange}
                  placeholder={language === 'en' ? 'e.g., Highway, Village road' : 'દા.ત., હાઇવે, ગામનો રોડ'}
                  required
                  error={fieldErrors.roadAccess}
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="electricity"
                      checked={formData.electricity}
                      onChange={handleInputChange}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground">
                      {language === 'en' ? 'Electricity Available' : 'વીજળી ઉપલબ્ધ છે'}
                    </span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="irrigation"
                      checked={formData.irrigation}
                      onChange={handleInputChange}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground">
                      {language === 'en' ? 'Irrigation System' : 'સિંચાઈ સિસ્ટમ'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              {language === 'en' ? 'Property Images' : 'પ્રોપર્ટી છબીઓ'}
            </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {language === 'en' ? 'Upload Images' : 'છબીઓ અપલોડ કરો'} <span className="text-destructive">*</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label 
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${fieldErrors.images ? 'border-destructive bg-destructive/5' : 'border-border hover:border-primary/50 hover:bg-primary/5'}`}
                    >
                      <Icon name="Image" size={32} className={`${fieldErrors.images ? 'text-destructive' : 'text-muted-foreground'} mb-2 group-hover:scale-110 transition-transform`} />
                      <span className="text-lg font-medium text-foreground">
                        {language === 'en' ? 'Click to upload property images' : 'પ્રોપર્ટી છબીઓ અપલોડ કરવા ક્લિક કરો'}
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === 'en' ? '1 to 3 images allowed' : '1 થી 3 છબીઓ મંજૂરી છે'}
                      </p>
                    </label>
                  </div>
                  {fieldErrors.images && <p className="text-[10px] font-bold text-destructive mt-1 uppercase tracking-tight">{fieldErrors.images}</p>}
                  <p className="text-xs text-muted-foreground italic mt-2">
                    {language === 'en' ? 'Max 5MB each. Supported formats: JPG, PNG, GIF' : 'દરેક મહત્તમ 5MB. સમર્થિત ફોર્મેટ્સ: JPG, PNG, GIF'}
                  </p>
                </div>

              {/* Display Existing Images (from Database) */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {language === 'en' ? 'Existing Images' : 'વર્તમાન છબીઓ'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingImages.map((imageUrl, index) => (
                      <div key={`existing-${index}`} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Existing Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                          onError={(e) => { e.target.src = "/assets/images/no_image.png"; }}
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm shadow-md hover:bg-destructive/90 transition-colors"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display New Images (Pending Upload) */}
              {formData.images.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">
                    {language === 'en' ? 'New Images' : 'નવી છબીઓ'}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New Property ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm shadow-md hover:bg-destructive/90 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              {language === 'en' ? 'Cancel' : 'રદ કરો'}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Adding...' : 'ઉમેરી રહ્યા છીએ...'}</span>
                </div>
              ) : (
                language === 'en' ? 'Add Property' : 'પ્રોપર્ટી ઉમેરો'
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SellerAddProperty; 