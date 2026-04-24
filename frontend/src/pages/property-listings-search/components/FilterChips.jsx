import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';

const FilterChips = ({ filters, onFilterRemove, onClearAll }) => {
  const { language } = useLanguage();

  const getActiveFilters = () => {
    const activeFilters = [];

    if (filters.district) {
      activeFilters.push({
        key: 'district',
        label: `${language === 'en' ? 'District' : 'જિલ્લો'}: ${filters.district}`,
        value: filters.district
      });
    }

    if (filters.taluka) {
      activeFilters.push({
        key: 'taluka',
        label: `${language === 'en' ? 'Taluka' : 'તાલુકો'}: ${filters.taluka}`,
        value: filters.taluka
      });
    }

    if (filters.village) {
      activeFilters.push({
        key: 'village',
        label: `${language === 'en' ? 'Village' : 'ગામ'}: ${filters.village}`,
        value: filters.village
      });
    }

    if (filters.minPrice || filters.maxPrice) {
      const priceLabel = language === 'en' ? 'Price' : 'કિંમત';
      let priceRange = '';
      if (filters.minPrice && filters.maxPrice) {
        priceRange = `₹${filters.minPrice} - ₹${filters.maxPrice}`;
      } else if (filters.minPrice) {
        priceRange = `₹${filters.minPrice}+`;
      } else if (filters.maxPrice) {
        priceRange = `Up to ₹${filters.maxPrice}`;
      }

      activeFilters.push({
        key: 'price',
        label: `${priceLabel}: ${priceRange}`,
        value: 'price'
      });
    }

    if (filters.minSize || filters.maxSize) {
      const sizeLabel = language === 'en' ? 'Size' : 'કદ';
      let sizeRange = '';
      if (filters.minSize && filters.maxSize) {
        sizeRange = `${filters.minSize} - ${filters.maxSize} ${language === 'en' ? 'Acres' : 'એકર'}`;
      } else if (filters.minSize) {
        sizeRange = `${filters.minSize}+ ${language === 'en' ? 'Acres' : 'એકર'}`;
      } else if (filters.maxSize) {
        sizeRange = `Up to ${filters.maxSize} ${language === 'en' ? 'Acres' : 'એકર'}`;
      }

      activeFilters.push({
        key: 'size',
        label: `${sizeLabel}: ${sizeRange}`,
        value: 'size'
      });
    }

    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      const typeLabels = {
        agricultural: language === 'en' ? 'Agricultural' : 'કૃષિ',
        residential: language === 'en' ? 'Residential' : 'રહેણાંક',
        commercial: language === 'en' ? 'Commercial' : 'વ્યાવસાયિક',
        industrial: language === 'en' ? 'Industrial' : 'ઔદ્યોગિક'
      };

      filters.propertyTypes.forEach(type => {
        activeFilters.push({
          key: 'propertyType',
          label: typeLabels[type] || type,
          value: type
        });
      });
    }

    if (filters.availabilityStatus && filters.availabilityStatus !== 'all') {
      const statusLabels = {
        available: language === 'en' ? 'Available' : 'ઉપલબ્ધ',
        sold: language === 'en' ? 'Sold' : 'વેચાઈ ગયેલ',
        pending: language === 'en' ? 'Under Review' : 'સમીક્ષા હેઠળ'
      };

      activeFilters.push({
        key: 'availabilityStatus',
        label: statusLabels[filters.availabilityStatus] || filters.availabilityStatus,
        value: filters.availabilityStatus
      });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-2 md:mb-4">
      <span className="text-[10px] md:text-sm font-medium text-muted-foreground">
        {language === 'en' ? 'Active Filters:' : 'સક્રિય ફિલ્ટર:'}
      </span>

      {activeFilters.map((filter, index) => (
        <div
          key={`${filter.key}-${index}`}
          className="inline-flex items-center bg-accent text-accent-foreground px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-sm"
        >
          <span>{filter.label}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterRemove(filter.key, filter.value)}
            className="ml-1 md:ml-2 p-0 h-auto hover:bg-transparent"
          >
            <Icon name="X" size={12} />
          </Button>
        </div>
      ))}

      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-[10px] md:text-xs text-muted-foreground hover:text-foreground h-auto p-1"
        >
          {language === 'en' ? 'Clear All' : 'બધું સાફ કરો'}
        </Button>
      )}
    </div>
  );
};

export default FilterChips;