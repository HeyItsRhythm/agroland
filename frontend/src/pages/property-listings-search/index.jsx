import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import { useLanguage } from '../../contexts/LanguageContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import SortDropdown from './components/SortDropdown';
import FilterChips from './components/FilterChips';
import PropertyGrid from './components/PropertyGrid';
import MapView from './components/MapView';
import { Helmet } from 'react-helmet';
import propertyService from '../../utils/propertyService';

const PropertyListingsSearch = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    district: '', taluka: '', village: '',
    minPrice: '', maxPrice: '',
    minSize: '', maxSize: '',
    propertyTypes: [], availabilityStatus: 'all'
  });
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const result = await propertyService.getProperties();
      if (result.success) setProperties(result.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const applyFiltersAndSearch = useCallback(() => {
    let filtered = [...properties];
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      filtered = filtered.filter(p =>
        (p.title?.toLowerCase() || '').includes(q) ||
        (p.location_district?.toLowerCase() || '').includes(q) ||
        (p.location_taluka?.toLowerCase() || '').includes(q) ||
        (p.location_village?.toLowerCase() || '').includes(q)
      );
    }

    if (filters.district) {
      filtered = filtered.filter(p => 
        (p.location_district?.toLowerCase() || '') === filters.district.toLowerCase() ||
        (p.district?.toLowerCase() || '') === filters.district.toLowerCase()
      );
    }
    if (filters.taluka) {
      filtered = filtered.filter(p => 
        (p.location_taluka?.toLowerCase() || '') === filters.taluka.toLowerCase() ||
        (p.taluka?.toLowerCase() || '') === filters.taluka.toLowerCase()
      );
    }
    if (filters.village) {
      filtered = filtered.filter(p => 
        (p.location_village?.toLowerCase() || '') === filters.village.toLowerCase() ||
        (p.village?.toLowerCase() || '') === filters.village.toLowerCase()
      );
    }
    
    if (filters.minPrice) filtered = filtered.filter(p => (p.price || 0) >= parseInt(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(p => (p.price || 0) <= parseInt(filters.maxPrice));
    
    if (filters.minSize) filtered = filtered.filter(p => (p.area || 0) >= parseFloat(filters.minSize));
    if (filters.maxSize) filtered = filtered.filter(p => (p.area || 0) <= parseFloat(filters.maxSize));
    
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.property_type || p.type));
    }

    if (filters.availabilityStatus !== 'all') filtered = filtered.filter(p => p.status === filters.availabilityStatus);

    switch (sortBy) {
      case 'price-low-high': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-high-low': filtered.sort((a, b) => b.price - a.price); break;
      case 'views-high-low': filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0)); break;
      case 'date-newest': filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)); break;
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters, sortBy]);

  useEffect(() => { applyFiltersAndSearch(); }, [applyFiltersAndSearch]);

  const clearAllFilters = useCallback(() => {
    setFilters({
      district: '', taluka: '', village: '',
      minPrice: '', maxPrice: '',
      minSize: '', maxSize: '',
      propertyTypes: [], availabilityStatus: 'all'
    });
  }, []);

  const handleFilterRemove = useCallback((key, value) => {
    setFilters(prev => {
      if (key === 'propertyType') {
        return {
          ...prev,
          propertyTypes: prev.propertyTypes.filter(t => t !== value)
        };
      }
      if (key === 'price') {
        return { ...prev, minPrice: '', maxPrice: '' };
      }
      if (key === 'size') {
        return { ...prev, minSize: '', maxSize: '' };
      }
      return { ...prev, [key]: '' };
    });
  }, []);

  return (
    <div className='h-screen flex flex-col bg-[#F9FAFB] font-sans overflow-hidden'>
      <Header />
      <Helmet>
        <title>{language === 'en' ? 'Search Properties | AgroLand Gujarat' : 'પ્રોપર્ટી શોધો | એગ્રોલેન્ડ ગુજરાત'}</title>
        <meta name="description" content="Search verified agricultural land, farm plots, and investment properties across Gujarat. Filter by district, price, and size." />
        <link rel="canonical" href="https://agrolandgujarat.in/property-listings-search" />
      </Helmet>
 
      <main className='flex-1 flex flex-col min-h-0 container mx-auto px-4 lg:max-w-screen-2xl overflow-hidden'>
        {/* Compact Header & Search Bar Row - Fixed at top */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-3 md:gap-6 py-4 md:py-6 flex-shrink-0 relative z-40'>
          <div className='flex-shrink-0'>
            <h1 className='text-xl md:text-3xl font-bold md:font-black text-slate-900 tracking-tight uppercase font-heading'>
              {language === 'en' ? 'Properties' : 'પ્રોપર્ટીઝ'}
            </h1>
          </div>
          <div className='flex-1 lg:max-w-2xl'>
            <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onSearch={applyFiltersAndSearch} />
          </div>
        </div>
 
        {/* Responsive Content Container */}
        <div className='flex-1 flex flex-col lg:flex-row gap-4 md:gap-8 min-h-0 overflow-hidden'>
          {/* Desktop Sidebar SCROLLER */}
          <aside className='lg:w-72 flex-shrink-0 lg:overflow-y-auto lg:pr-4 lg:pb-12 custom-scrollbar lg:h-full hidden lg:block'>
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </aside>
 
          {/* Main List / Map Area SCROLLER */}
          <div className='flex-1 flex flex-col min-h-0 relative lg:overflow-hidden'>
 
            {/* Mobile Controls Layer */}
            <div className='lg:hidden sticky top-[64px] z-30 bg-[#F9FAFB]/95 backdrop-blur-xl py-2 -mx-4 px-4 border-b border-slate-200/60 shadow-sm flex-shrink-0'>
              <div className='flex items-center gap-2'>
                <Button
                  onClick={() => setIsFilterOpen(true)}
                  variant='outline'
                  className='flex-1 h-10 rounded-xl font-bold text-[9px] border-slate-200 bg-white flex items-center justify-center gap-2 uppercase tracking-tight'
                >
                  <Icon name='Filter' size={12} />
                  {language === 'en' ? 'Filters' : 'ફિલ્ટર'}
                </Button>
 
                <div className='flex-[1.2]'>
                  <SortDropdown sortBy={sortBy} onSortChange={setSortBy} isMobile />
                </div>
 
                <div className='flex bg-white/50 border border-slate-200 rounded-xl p-0.5 shrink-0'>
                  <button onClick={() => setViewMode('grid')} className={'w-9 h-9 rounded-lg flex items-center justify-center transition-all ' + (viewMode === 'grid' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400')}>
                    <Icon name='Grid3X3' size={16} />
                  </button>
                  <button onClick={() => setViewMode('map')} className={'w-9 h-9 rounded-lg flex items-center justify-center transition-all ' + (viewMode === 'map' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400')}>
                    <Icon name='Map' size={16} />
                  </button>
                </div>
              </div>
 
              {/* Scrollable Filter Chips (Mobile) */}
              <div className='mt-2 flex overflow-x-auto gap-1.5 pb-0.5 no-scrollbar scroll-smooth whitespace-nowrap'>
                <FilterChips
                  filters={filters}
                  onFilterRemove={handleFilterRemove}
                  onClearAll={clearAllFilters}
                />
              </div>
            </div>
 
            {/* Desktop Controls Bar (Fixed at top of main area) */}
            <div className='hidden lg:block pt-1 pb-4 bg-[#F9FAFB] flex-shrink-0 relative z-30'>
              <FilterChips
                filters={filters}
                onFilterRemove={handleFilterRemove}
                onClearAll={clearAllFilters}
              />
 
              <div className='flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40'>
                <div className='text-[11px] font-black uppercase tracking-[0.2em] text-slate-400'>
                  {filteredProperties.length} {language === 'en' ? 'Total Listings' : 'કુલ લિસ્ટિંગ'}
                </div>
                <div className='flex items-center gap-3'>
                  <SortDropdown sortBy={sortBy} onSortChange={setSortBy} />
                  <div className='flex bg-slate-50 border border-slate-100 rounded-xl p-1 gap-1'>
                    <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} onClick={() => setViewMode('grid')} className='h-8 w-8 p-0 rounded-lg'>
                      <Icon name='Grid3X3' size={14} />
                    </Button>
                    <Button variant={viewMode === 'map' ? 'default' : 'ghost'} onClick={() => setViewMode('map')} className='h-8 w-8 p-0 rounded-lg'>
                      <Icon name='Map' size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
 
            {/* List/Grid Content Area - INDEPENDENT SCROLLER */}
            <div className='flex-1 min-h-0 overflow-y-auto custom-scrollbar lg:pb-12 mt-3 lg:mt-0'>
              <div className='mb-3 lg:hidden text-[9px] font-bold uppercase tracking-widest text-slate-400/80 px-1'>
                {filteredProperties.length} {language === 'en' ? 'Results found' : 'પરિણામો મળ્યા'}
              </div>
 
              {viewMode === 'grid' ? (
                <PropertyGrid properties={filteredProperties} loading={loading} />
              ) : (
                <div className='h-[60vh] lg:h-full min-h-[400px] lg:min-h-[550px] rounded-2xl lg:rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative'>
                  <MapView
                    properties={filteredProperties}
                    selectedProperty={selectedProperty}
                    onPropertySelect={setSelectedProperty}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Filter Sidebar Drawer for Mobile */}
      <div className='lg:hidden'>
        <FilterSidebar
          filters={filters}
          onFiltersChange={setFilters}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>

      {/* Scrollbar & Helper Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 1024px) {
          .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
        }
      `}} />
    </div>
  );
};

export default PropertyListingsSearch;