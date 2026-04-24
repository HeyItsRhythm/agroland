import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';
import locationService from '../../../utils/locationService';
import propertyService from '../../../utils/propertyService';

const HeroSection = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [villages, setVillages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    propertiesCount: 0,
    buyersCount: 0,
    sellersCount: 0,
    districtsCount: 0
  });
  const navigate = useNavigate();

  // Load districts on component mount
  useEffect(() => {
    // Load districts from our location service
    setIsLoading(true);
    const districtsResult = locationService.getDistricts();
    if (districtsResult.success) {
      console.log('Districts loaded:', districtsResult.data.length);
      setDistricts(districtsResult.data.map(district => ({
        value: district,
        label: district
      })));
    } else {
      console.error('Error loading districts:', districtsResult.error);
    }
    setIsLoading(false);

    // Fetch public stats
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const result = await propertyService.getPublicStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Error fetching public stats:', err);
    }
  };

  // Handle district change
  useEffect(() => {
    if (selectedDistrict) {
      setIsLoading(true);
      const subDistrictsResult = locationService.getSubDistricts(selectedDistrict);
      if (subDistrictsResult.success) {
        console.log('Talukas loaded:', subDistrictsResult.data.length);
        setTalukas(subDistrictsResult.data.map(taluka => ({
          value: taluka,
          label: taluka
        })));
      } else {
        console.error('Error loading talukas:', subDistrictsResult.error);
        setTalukas([]);
      }
      setIsLoading(false);
    } else {
      setTalukas([]);
    }
    setSelectedTaluka('');
    setSelectedVillage('');
    setVillages([]);
  }, [selectedDistrict]);

  // Handle taluka change
  useEffect(() => {
    if (selectedDistrict && selectedTaluka) {
      setIsLoading(true);
      const villagesResult = locationService.getVillages(selectedDistrict, selectedTaluka);
      if (villagesResult.success) {
        console.log('Villages loaded:', villagesResult.data.length);
        setVillages(villagesResult.data.map(village => ({
          value: village,
          label: village
        })));
      } else {
        console.error('Error loading villages:', villagesResult.error);
        setVillages([]);
      }
      setIsLoading(false);
    } else {
      setVillages([]);
    }
    setSelectedVillage('');
  }, [selectedDistrict, selectedTaluka]);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('search', searchQuery);
    if (selectedDistrict) searchParams.set('district', selectedDistrict);
    if (selectedTaluka) searchParams.set('taluka', selectedTaluka);
    if (selectedVillage) searchParams.set('village', selectedVillage);

    navigate(`/property-listings-search?${searchParams.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/hero-bg.png"
          alt="Lush Indian Farmland"
          className="w-full h-full object-cover"
          fetchpriority="high"
          loading="eager"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
            {language === 'en' ? 'FIND YOUR PERFECT LAND' : 'તમારી સંપૂર્ણ જમીન શોધો'}
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            {language === 'en' ? 'Discover premium agricultural properties across Gujarat with our comprehensive marketplace platform' : 'અમારા વ્યાપક માર્કેટપ્લેસ પ્લેટફોર્મ સાથે ગુજરાતમાં પ્રીમિયમ કૃષિ મિલકતો શોધો'
            }
          </p>

          {/* Search Form */}
          <div className="relative z-20 bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-elevation-3 max-w-4xl mx-auto hover:shadow-xl transition-shadow duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Search Input */}
              <div className="lg:col-span-1">
                <Input
                  type="search"
                  placeholder={language === 'en' ? 'Search properties...' : 'પ્રોપર્ટીઝ શોધો...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* District Select */}
              <div>
                <Select
                  placeholder={language === 'en' ? 'Select District' : 'જિલ્લો પસંદ કરો'}
                  options={districts}
                  value={selectedDistrict}
                  onChange={(value) => setSelectedDistrict(value)}
                  searchable
                  loading={isLoading}
                />
              </div>

              {/* Taluka Select */}
              <div>
                <Select
                  placeholder={language === 'en' ? 'Select Taluka' : 'તાલુકો પસંદ કરો'}
                  options={talukas}
                  value={selectedTaluka}
                  onChange={(value) => setSelectedTaluka(value)}
                  disabled={!selectedDistrict || isLoading}
                  searchable
                  loading={isLoading && selectedDistrict}
                />
              </div>

              {/* Village Select */}
              <div>
                <Select
                  placeholder={language === 'en' ? 'Select Village' : 'ગામ પસંદ કરો'}
                  options={villages}
                  value={selectedVillage}
                  onChange={(value) => setSelectedVillage(value)}
                  disabled={!selectedTaluka || isLoading}
                  searchable
                  loading={isLoading && selectedTaluka}
                />
              </div>
            </div>

            {/* Search Button */}
            <Button
              variant="default"
              size="lg"
              onClick={handleSearch}
              iconName="Search"
              iconPosition="left"
              className="w-full md:w-auto px-12"
            >
              {language === 'en' ? 'Search Properties' : 'પ્રોપર્ટીઝ શોધો'}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 text-white">
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2">{(stats.propertiesCount || 0).toLocaleString()}+</div>
              <div className="text-sm md:text-base opacity-90">
                {language === 'en' ? 'Properties Listed' : 'સૂચિબદ્ધ પ્રોપર્ટીઝ'}
              </div>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2">{(stats.buyersCount || 0).toLocaleString()}+</div>
              <div className="text-sm md:text-base opacity-90">
                {language === 'en' ? 'Happy Buyers' : 'ખુશ ખરીદદારો'}
              </div>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2">{(stats.sellersCount || 0).toLocaleString()}+</div>
              <div className="text-sm md:text-base opacity-90">
                {language === 'en' ? 'Verified Sellers' : 'ચકાસાયેલ વેચનારા'}
              </div>
            </div>
            <div className="text-center hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold mb-2">{(stats.districtsCount || 0).toLocaleString()}+</div>
              <div className="text-sm md:text-base opacity-90">
                {language === 'en' ? 'Districts Covered' : 'આવરી લેવાયેલા જિલ્લાઓ'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <Icon name="ChevronDown" size={32} className="text-white/70" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;