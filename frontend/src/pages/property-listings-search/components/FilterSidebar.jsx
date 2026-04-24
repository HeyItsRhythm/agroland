import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useLanguage } from '../../../contexts/LanguageContext';
import locationService from '../../../utils/locationService';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose }) => {
  const { language } = useLanguage();
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    // Load districts on mount
    const loadDistricts = async () => {
      try {
        const result = await locationService.getDistricts();
        if (result.success) setDistricts(result.data || []);
      } catch (e) {
        console.error('Error loading districts:', e);
      }
    };
    loadDistricts();
  }, []);

  useEffect(() => {
    // Load talukas when district changes
    const loadTalukas = async () => {
      if (!filters.district) {
        setTalukas([]);
        return;
      }
      try {
        const result = await locationService.getSubDistricts(filters.district);
        if (result.success) setTalukas(result.data || []);
      } catch (e) {
        console.error('Error loading talukas:', e);
      }
    };
    loadTalukas();
  }, [filters.district]);

  useEffect(() => {
    // Load villages when taluka changes
    const loadVillages = async () => {
      if (!filters.district || !filters.taluka) {
        setVillages([]);
        return;
      }
      try {
        const result = await locationService.getVillages(filters.district, filters.taluka);
        if (result.success) setVillages(result.data || []);
      } catch (e) {
        console.error('Error loading villages:', e);
      }
    };
    loadVillages();
  }, [filters.district, filters.taluka]);

  // Format options for the dropdown
  const districtOptions = districts.map(d => ({ value: d, label: d }));
  const talukaOptions = talukas.map(t => ({ value: t, label: t }));
  const villageOptions = villages.map(v => ({ value: v, label: v }));

  const propertyTypes = [
    { id: 'agricultural', label: language === 'en' ? 'Agricultural Land' : 'કૃષિ જમીન' },
    { id: 'residential', label: language === 'en' ? 'Residential Plot' : 'રહેણાંક પ્લોટ' },
    { id: 'commercial', label: language === 'en' ? 'Commercial Land' : 'વ્યાવસાયિક જમીન' },
    { id: 'industrial', label: language === 'en' ? 'Industrial Plot' : 'ઔદ્યોગિક પ્લોટ' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    
    // Reset subordinate filters
    if (key === 'district') {
      updatedFilters.taluka = '';
      updatedFilters.village = '';
    } else if (key === 'taluka') {
      updatedFilters.village = '';
    }
    
    onFiltersChange(updatedFilters);
  };

  const handlePropertyTypeChange = (typeId, checked) => {
    const updatedTypes = checked
      ? [...(filters.propertyTypes || []), typeId]
      : (filters.propertyTypes || []).filter(type => type !== typeId);

    handleFilterChange('propertyTypes', updatedTypes);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      district: '',
      taluka: '',
      village: '',
      minPrice: '',
      maxPrice: '',
      minSize: '',
      maxSize: '',
      propertyTypes: [],
      availabilityStatus: 'all'
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-auto w-80 lg:w-full
        bg-card border-r border-border lg:border-r-0 lg:border lg:rounded-lg
        transform transition-transform duration-300 z-50 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto lg:overflow-visible
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              {language === 'en' ? 'Filters' : 'ફિલ્ટર'}
            </h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                {language === 'en' ? 'Clear All' : 'બધું સાફ કરો'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Location Filters */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-foreground">
              {language === 'en' ? 'Location' : 'સ્થાન'}
            </h4>

            <Select
              label={language === 'en' ? 'District' : 'જિલ્લો'}
              placeholder={language === 'en' ? 'Select District' : 'જિલ્લો પસંદ કરો'}
              options={districtOptions}
              value={filters.district}
              onChange={(value) => handleFilterChange('district', value)}
              searchable
            />

            <Select
              label={language === 'en' ? 'Taluka' : 'તાલુકો'}
              placeholder={language === 'en' ? 'Select Taluka' : 'તાલુકો પસંદ કરો'}
              options={talukaOptions}
              value={filters.taluka}
              onChange={(value) => handleFilterChange('taluka', value)}
              disabled={!filters.district}
              searchable
            />

            <Select
              label={language === 'en' ? 'Village' : 'ગામ'}
              placeholder={language === 'en' ? 'Select Village' : 'ગામ પસંદ કરો'}
              options={villageOptions}
              value={filters.village}
              onChange={(value) => handleFilterChange('village', value)}
              disabled={!filters.taluka}
              searchable
            />
          </div>

          {/* Price Range */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-foreground">
              {language === 'en' ? 'Price Range (₹)' : 'કિંમત શ્રેણી (₹)'}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label={language === 'en' ? 'Min Price' : 'ન્યૂનતમ કિંમત'}
                placeholder={language === 'en' ? 'Min' : 'ન્યૂનતમ'}
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <Input
                type="number"
                label={language === 'en' ? 'Max Price' : 'મહત્તમ કિંમત'}
                placeholder={language === 'en' ? 'Max' : 'મહત્તમ'}
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Land Size */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-foreground">
              {language === 'en' ? 'Land Size' : 'જમીનનું કદ'}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                label={language === 'en' ? 'Min Size' : 'ન્યૂનતમ કદ'}
                placeholder={language === 'en' ? 'Min' : 'ન્યૂનતમ'}
                value={filters.minSize}
                onChange={(e) => handleFilterChange('minSize', e.target.value)}
              />
              <Input
                type="number"
                label={language === 'en' ? 'Max Size' : 'મહત્તમ કદ'}
                placeholder={language === 'en' ? 'Max' : 'મહત્તમ'}
                value={filters.maxSize}
                onChange={(e) => handleFilterChange('maxSize', e.target.value)}
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-4 mb-6">
            <h4 className="text-sm font-medium text-foreground">
              {language === 'en' ? 'Property Type' : 'પ્રોપર્ટીનો પ્રકાર'}
            </h4>

            <div className="space-y-3">
              {propertyTypes.map((type) => (
                <Checkbox
                  key={type.id}
                  label={type.label}
                  checked={(filters.propertyTypes || []).includes(type.id)}
                  onChange={(e) => handlePropertyTypeChange(type.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* Availability Status */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">
              {language === 'en' ? 'Availability' : 'ઉપલબ્ધતા'}
            </h4>

            <Select
              placeholder={language === 'en' ? 'Select Status' : 'સ્થિતિ પસંદ કરો'}
              options={[
                { value: 'all', label: language === 'en' ? 'All Properties' : 'બધી પ્રોપર્ટીઝ' },
                { value: 'available', label: language === 'en' ? 'Available' : 'ઉપલબ્ધ' },
                { value: 'sold', label: language === 'en' ? 'Sold' : 'વેચાઈ ગયેલ' },
                { value: 'pending', label: language === 'en' ? 'Under Review' : 'સમીક્ષા હેઠળ' }
              ]}
              value={filters.availabilityStatus}
              onChange={(value) => handleFilterChange('availabilityStatus', value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;