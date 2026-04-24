import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';

const SearchBar = ({ searchQuery, onSearchChange, onSearch }) => {
  const { language } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative z-50">
      <div className="group relative flex items-center bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 p-1.5 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
        <div className="flex-1 flex items-center pl-4">
          <Icon name="Search" size={18} className="text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            placeholder={language === 'en' ? 'Location, type, or keywords...' : 'સ્થાન, પ્રકાર અથવા કીવર્ડ...'}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-base text-slate-700 placeholder:text-slate-400 pl-3 h-10 md:h-12"
          />
        </div>

        <Button
          type="submit"
          className="h-10 md:h-12 px-6 md:px-10 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] md:text-[12px] shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
        >
           <span className="hidden md:inline">{language === 'en' ? 'Search' : 'શોધો'}</span>
           <Icon name="ArrowRight" size={16} className="md:hidden" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;