import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';
const GoogleMapsLogo = "/assets/images/google-maps-logo.png";

const PropertyInfo = ({ property }) => {
  const { language } = useLanguage();
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const formatPrice = (p) => p >= 1e7 ? '₹' + (p / 1e7).toFixed(2) + ' Cr' : p >= 1e5 ? '₹' + (p / 1e5).toFixed(2) + ' L' : '₹' + p.toLocaleString('en-IN');
  const formatArea = (a) => a.toLocaleString('en-IN');

  const getUnitLabel = (unit) => {
    if (!unit) return language === 'en' ? 'Unit' : 'એકમ';
    const u = unit.toLowerCase().trim();
    const units = {
      'vigha': language === 'en' ? 'Vigha' : 'વીઘા',
      'acres': language === 'en' ? 'Acre' : 'એકર',
      'acre': language === 'en' ? 'Acre' : 'એકર',
      'sqft': language === 'en' ? 'Sq Ft' : 'ચોરસ ફૂટ',
      'square feet': language === 'en' ? 'Sq Ft' : 'ચોરસ ફૂટ',
      'guntha': language === 'en' ? 'Guntha' : 'ગુંઠા',
      'sqyard': language === 'en' ? 'Sq Yard' : 'વાર',
      'hectares': language === 'en' ? 'Hectare' : 'હેક્ટર',
      'hectare': language === 'en' ? 'Hectare' : 'હેક્ટર'
    };
    return units[u] || unit;
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'sold') return 'bg-rose-50 text-rose-600 border-rose-100';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const infoBlocks = [
    {
      label: language === 'en' ? 'Land Type' : 'જમીનનો પ્રકાર',
      value: language === 'en' ? property.landType : property.landTypeGu,
      icon: 'Sprout',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: language === 'en' ? 'Water Source' : 'પાણીનો સ્ત્રોત',
      value: language === 'en' ? property.waterSource : property.waterSourceGu,
      icon: 'Droplets',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: property.mapLink ? (language === 'en' ? 'Location Map' : 'નકશો જુઓ') : (language === 'en' ? 'Soil Type' : 'માટીનો પ્રકાર'),
      value: property.mapLink ? (language === 'en' ? 'Click to View' : 'ક્લિક કરો') : (language === 'en' ? property.soilType : property.soilTypeGu),
      icon: property.mapLink ? 'Map' : 'Layers',
      color: property.mapLink ? 'text-rose-600' : 'text-amber-700',
      bg: property.mapLink ? 'bg-rose-50' : 'bg-amber-50',
      isLink: !!property.mapLink,
      link: property.mapLink
    },
    {
      label: language === 'en' ? 'Total Area' : 'કુલ વિસ્તાર',
      value: `${formatArea(property.area)} ${getUnitLabel(property.area_unit || property.areaUnit)}`,
      icon: 'Maximize',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  const description = language === 'en' ? property.description : property.descriptionGu;
  const isLongDesc = description?.length > 300;
  const displayedDesc = isDescExpanded ? description : description?.slice(0, 300) + (isLongDesc ? '...' : '');

  return (
    <div className="space-y-8">
      {/* 2️⃣ Property Summary Card */}
      <section className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:border-primary/20 hover:scale-[1.01] transition-all duration-300">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(property.status)}`}>
                {property.status || 'Active'}
              </span>
              <span className="text-slate-300 font-bold hidden sm:inline">•</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Property ID: {property.id.slice(-6).toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black font-heading text-slate-900 tracking-tight leading-tight">
              {property.title}
            </h1>
            
            <div className="flex items-center text-slate-500 font-bold group">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm">
                <Icon name="MapPin" size={14} />
              </div>
              <span className="text-base md:text-lg">{property.village}, {property.taluka}, {property.district}</span>
            </div>
          </div>

          <div className="flex flex-col lg:items-end">
            <div className="bg-slate-50 border border-slate-200/40 p-6 md:p-8 rounded-[2rem] min-w-[240px] shadow-inner relative overflow-hidden group/price">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">
                {language === 'en' ? 'Asking Price' : 'માંગેલ કિંમત'}
              </div>
              <div className="flex items-baseline gap-2 relative z-10">
                <span className="text-3xl md:text-4xl font-black text-primary tracking-tighter group-hover/price:scale-105 transition-transform origin-left">
                  {formatPrice(property.price)}
                </span>
                <span className="text-slate-400 font-black text-sm tracking-tight capitalize">
                  / {getUnitLabel(property.area_unit || property.areaUnit)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3️⃣ Quick Info Highlights - Equal Grid Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-50">
          {infoBlocks.map((block, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -3 }}
              className={`${block.bg} rounded-3xl p-5 md:p-6 border border-white transition-all shadow-sm group ${block.isLink ? 'cursor-pointer hover:shadow-md hover:ring-2 hover:ring-primary/20' : ''}`}
              onClick={() => {
                if (block.isLink && block.link) {
                  window.open(block.link, '_blank');
                }
              }}
            >
              <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3 ${block.color}`}>
                {block.icon === 'Map' ? (
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <img 
                      src={GoogleMapsLogo}
                      alt="Map" 
                      className="w-full h-full object-contain relative z-10"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <Icon name="Map" size={20} className="absolute inset-0 m-auto text-slate-400 opacity-50" />
                  </div>
                ) : (
                  <Icon name={block.icon} size={20} />
                )}
              </div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{block.label}</div>
              <div className="text-sm md:text-base font-black text-slate-900 tracking-tight leading-tight flex items-center gap-1">
                {block.value}
                {block.isLink && <Icon name="ExternalLink" size={10} className="text-slate-400" />}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4️⃣ Property Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Description & Features */}
        <div className="space-y-8">
          {/* Description Section */}
          <section className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-lg shadow-slate-200/40 relative overflow-hidden hover:shadow-2xl hover:border-primary/20 hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-6">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              {language === 'en' ? 'Property Narrative' : 'પ્રોપર્ટી વર્ણન'}
            </h3>
            <div className="prose prose-slate prose-sm max-w-none">
              <p className="text-slate-500 leading-relaxed text-base font-medium whitespace-pre-line">
                {displayedDesc}
              </p>
            </div>
            {isLongDesc && (
              <button 
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="mt-6 text-primary font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all group"
              >
                {isDescExpanded 
                  ? (language === 'en' ? 'Read Less' : 'ઓછું વાંચો') 
                  : (language === 'en' ? 'Read More' : 'વધુ વાંચો')}
                <Icon name={isDescExpanded ? "ChevronUp" : "ChevronDown"} size={14} className="group-hover:translate-y-0.5 transition-transform" />
              </button>
            )}
          </section>

          {/* Key Features Grid */}
          <section className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:border-primary/20 hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-6">
              <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
              {language === 'en' ? 'Essential Features' : 'મુખ્ય સુવિધાઓ'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: language === 'en' ? 'Electricity' : 'વીજળી', value: language === 'en' ? 'Available' : 'ઉપલબ્ધ', icon: 'Zap', color: 'text-amber-500', bg: 'bg-amber-50' },
                { label: language === 'en' ? 'Irrigation' : 'સિંચાઈ', value: language === 'en' ? 'Available' : 'ઉપલબ્ધ', icon: 'CloudRain', color: 'text-blue-500', bg: 'bg-blue-50' },
                { label: language === 'en' ? 'Road Access' : 'રસ્તો', value: language === 'en' ? 'Direct Access' : 'સીધો રસ્તો', icon: 'Truck', color: 'text-slate-700', bg: 'bg-slate-100' },
                { label: language === 'en' ? 'Soil Quality' : 'જમીન', value: language === 'en' ? 'Verified' : 'ચકાસાયેલ', icon: 'CheckCircle', color: 'text-emerald-600', bg: 'bg-emerald-50' }
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center ${feature.color} shadow-sm group-hover:scale-105 transition-transform`}>
                    <Icon name={feature.icon} size={16} />
                  </div>
                  <div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{feature.label}</div>
                    <div className="text-xs font-black text-slate-800">{feature.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Specifications Table */}
        <section className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-lg shadow-slate-200/40 h-full hover:shadow-2xl hover:border-primary/20 hover:scale-[1.01] transition-all duration-300">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3 mb-8">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            {language === 'en' ? 'Technical Details' : 'તકનીકી વિગતો'}
          </h3>
          <div className="space-y-2">
            {[
              { label: language === 'en' ? 'Irrigation System' : 'સિંચાઈ સુવિધા', value: language === 'en' ? property.irrigation : property.irrigationGu, icon: 'Droplets' },
              { label: language === 'en' ? 'Approach Road' : 'રસ્તાની સુવિધા', value: language === 'en' ? property.roadAccess : property.roadAccessGu, icon: 'Navigation' },
              { label: language === 'en' ? 'Legal Standing' : 'કાનૂની સ્થિતિ', value: language === 'en' ? property.legalStatus : property.legalStatusGu, icon: 'FileCheck' },
              { label: language === 'en' ? 'Survey Registration' : 'સર્વે નંબર', value: property.surveyNumber, icon: 'Hash' },
              { label: language === 'en' ? 'Listed Date' : 'લિસ્ટિંગ તારીખ', value: property.listedDate, icon: 'CalendarDays' },
              { label: language === 'en' ? 'Documentation' : 'દસ્તાવેજો', value: language === 'en' ? 'Verified' : 'ચકાસાયેલ', icon: 'ShieldCheck' }
            ].map((spec, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-primary transition-all shadow-sm">
                    <Icon name={spec.icon} size={16} />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{spec.label}</span>
                </div>
                <span className="text-xs md:text-sm font-black text-slate-900">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PropertyInfo;