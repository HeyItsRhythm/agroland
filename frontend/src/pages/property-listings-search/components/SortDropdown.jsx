import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import { useLanguage } from '../../../contexts/LanguageContext';

const SortDropdown = ({ sortBy, onSortChange, isMobile }) => {
  const { language } = useLanguage();

  const sortOptions = [
    {
      value: 'relevance',
      label: language === 'en' ? (isMobile ? 'Relevant' : 'Most Relevant') : 'સંબંધિત'
    },
    {
      value: 'price-low-high',
      label: language === 'en' ? (isMobile ? 'Price: Low' : 'Price: Low to High') : 'કિંમત: ઓછા'
    },
    {
      value: 'price-high-low',
      label: language === 'en' ? (isMobile ? 'Price: High' : 'Price: High to Low') : 'કિંમત: વધારા'
    },
    {
      value: 'date-newest',
      label: language === 'en' ? (isMobile ? 'Newest' : 'Newest First') : 'નવા'
    },
    {
      value: 'views-high-low',
      label: language === 'en' ? (isMobile ? 'Popular' : 'Most Viewed') : 'લોકપ્રિય'
    }
  ];

  return (
    <div className={isMobile ? 'w-full' : 'w-48'}>
      <Select
        placeholder={language === 'en' ? 'Sort' : 'ક્રમ'}
        options={sortOptions}
        value={sortBy}
        onChange={onSortChange}
        className={isMobile ? 'h-10 text-[9px] font-bold uppercase tracking-tight' : ''}
      />
    </div>
  );
};

export default SortDropdown;