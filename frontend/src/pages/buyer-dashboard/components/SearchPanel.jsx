import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';

const SearchPanel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    district: '',
    taluka: '',
    village: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    landType: '',
    availability: ''
  });

  const districtOptions = [
    { value: 'ahmedabad', label: language === 'en' ? 'Ahmedabad' : 'અમદાવાદ' },
    { value: 'surat', label: language === 'en' ? 'Surat' : 'સુરત' },
    { value: 'vadodara', label: language === 'en' ? 'Vadodara' : 'વડોદરા' },
    { value: 'rajkot', label: language === 'en' ? 'Rajkot' : 'રાજકોટ' },
    { value: 'bhavnagar', label: language === 'en' ? 'Bhavnagar' : 'ભાવનગર' }
  ];

  const landTypeOptions = [
    { value: 'agricultural', label: language === 'en' ? 'Agricultural' : 'કૃષિ' },
    { value: 'residential', label: language === 'en' ? 'Residential' : 'રહેણાંક' },
    { value: 'commercial', label: language === 'en' ? 'Commercial' : 'વ્યાપારી' },
    { value: 'industrial', label: language === 'en' ? 'Industrial' : 'ઔદ્યોગિક' }
  ];

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/property-listings-search?${params.toString()}`);
  };

  const handleSaveSearch = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast.success(language === 'en' ? 'Search preferences saved!' : 'સર્ચ પસંદગીઓ સાચવવામાં આવી!');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-elevation-2">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Icon name="Search" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-foreground">
                {language === 'en' ? 'Advanced Property Search' : 'એડવાન્સ પ્રોપર્ટી સર્ચ'}
              </h3>
              <p className="text-sm text-muted-foreground">Adjust filters to find your perfect land</p>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary Discovery */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Location Details</h4>
              <Input
                label={language === 'en' ? 'Quick Search' : 'ઝડપી શોધ'}
                placeholder={language === 'en' ? 'Enter city, village or area...' : 'શહેર, ગામ અથવા વિસ્તાર...'}
                value={searchFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                iconName="MapPin"
              />
              <Select
                label={language === 'en' ? 'District' : 'જિલ્લો'}
                options={districtOptions}
                value={searchFilters.district}
                onChange={(v) => handleFilterChange('district', v)}
                dropdownStyle={{
                  maxHeight: 200,
                  overflowY: 'auto',
                }}
              />
            </div>

            {/* Financial Parameters */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Financial Range</h4>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={language === 'en' ? 'Min Price' : 'લઘુત્તમ કિંમત'}
                  type="number"
                  placeholder="₹ 0"
                  value={searchFilters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <Input
                  label={language === 'en' ? 'Max Price' : 'મહત્તમ કિંમત'}
                  type="number"
                  placeholder="₹ Any"
                  value={searchFilters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
              <Select
                label={language === 'en' ? 'Land Type' : 'જમીનનો પ્રકાર'}
                options={landTypeOptions}
                value={searchFilters.landType}
                onChange={(v) => handleFilterChange('landType', v)}
              />
            </div>

            {/* Property Specs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Specifications</h4>
              <Input
                label={language === 'en' ? 'Minimum Area (sq ft)' : 'લઘુત્તમ વિસ્તાર'}
                type="number"
                placeholder="e.g. 5000"
                value={searchFilters.minArea}
                onChange={(e) => handleFilterChange('minArea', e.target.value)}
                iconName="Maximize"
              />
              <Select
                label={language === 'en' ? 'Availability' : 'ઉપલબ્ધતા'}
                options={[
                  { value: 'immediate', label: 'Immediate' },
                  { value: '30days', label: 'Within 30 Days' }
                ]}
                value={searchFilters.availability}
                onChange={(v) => handleFilterChange('availability', v)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-border">
            <Button
              variant="default"
              size="lg"
              onClick={handleSearch}
              iconName="Search"
              className="w-full sm:flex-1 h-12 text-base shadow-lg shadow-primary/20"
            >
              {language === 'en' ? 'Search Properties' : 'પ્રોપર્ટીઝ શોધો'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSaveSearch}
              disabled={isSaving}
              className="w-full sm:w-auto h-12 px-8"
            >
              <div className="flex items-center gap-2">
                {isSaving ? <Icon name="Loader2" className="animate-spin" size={18} /> : <Icon name="Bookmark" size={18} />}
                {language === 'en' ? 'Save Search' : 'સર્ચ સાચવો'}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;