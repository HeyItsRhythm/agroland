import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import propertyService from '../../../utils/propertyService';
import propertyViewService from '../../../utils/propertyViewService';
const GoogleMapsLogo = "/assets/images/google-maps-logo.png";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkIfSaved = async () => {
      const pid = property.id || property._id;
      if (user && pid) {
        try {
          const saved = await propertyService.getSavedProperties(user.id);
          setIsSaved(saved.some(s => s.id === pid || (s.property && (s.property._id === pid || s.property.id === pid))));
        } catch (e) { console.error(e); }
      }
    };
    checkIfSaved();
  }, [user, property]);

  const formatPrice = (p) => p >= 1e7 ? (p / 1e7).toFixed(2) + ' Cr' : p >= 1e5 ? (p / 1e5).toFixed(2) + ' L' : p.toLocaleString('en-IN');

  const getUnitLabel = (unit) => {
    if (!unit) return language === 'en' ? 'Unit' : 'એકમ';

    // Normalize unit string
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
      'hectare': language === 'en' ? 'Hectare' : 'હેક્ટર',
      'hecter': language === 'en' ? 'Hectare' : 'હેક્ટર'
    };

    return units[u] || unit;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className='bg-white border border-slate-200/60 rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col h-full group relative'
    >
      {/* Property Image Section */}
      <div className='relative h-44 sm:h-56 overflow-hidden bg-slate-50'>
        <Image
          src={
            property.images?.[0] ||
            property.image_urls?.[0] ||
            '/assets/images/placeholder-property.jpg'
          }
          alt={property.title}
          className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700'
          loading="lazy"
          decoding="async"
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

        {/* Compact View Count Badge */}
        <div className='absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border border-white/10 z-10'>
          <Icon name='Eye' size={10} />
          <span>{property.views_count || 0}</span>
        </div>

        {/* Small/Neat Land Type Tag */}
        <div className='absolute bottom-2 left-2 bg-white/95 backdrop-blur-md text-slate-800 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-sm z-10 border border-slate-100'>
          {property.property_type || property.type || 'Land'}
        </div>
      </div>

      <div className='p-3.5 sm:p-5 flex flex-col flex-1 bg-white'>
        {/* Title & Price */}
        <div className='mb-3 sm:mb-4'>
          <h3 className='text-xs sm:text-base font-bold text-slate-900 mb-0.5 line-clamp-1 group-hover:text-primary transition-colors uppercase tracking-tight'>
            {property.title}
          </h3>
          <div className='flex items-baseline gap-1'>
            <span className='text-base sm:text-xl font-bold text-primary tracking-tight'>
              ₹{formatPrice(property.price)}
            </span>
            <span className='text-[10px] sm:text-xs font-semibold text-slate-500'>
              / {getUnitLabel(property.area_unit)}
            </span>
          </div>
        </div>

        {/* Area Badge */}
        <div className='flex items-center gap-2 text-slate-700 text-[10px] sm:text-[12px] mb-2 font-bold'>
          <Icon name='Maximize' size={14} className="text-primary" />
          <span>{property.area} {getUnitLabel(property.area_unit)}</span>
        </div>

        {/* Location Badge */}
        <div className='flex items-center gap-2 text-slate-500 text-[9px] sm:text-[11px] mb-4 sm:mb-6 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100/50'>
          <Icon name='MapPin' size={10} className="text-slate-400" />
          <span className='font-medium line-clamp-1 truncate opacity-90 leading-tight'>
            {property.location_village || property.village || 'Local'}, {property.location_district || property.district || 'Gujarat'}
          </span>
        </div>

        {/* Action Bar - Optimized for Mobile Symmetry */}
        <div className='flex items-center gap-2 mt-auto'>
          <Link
            to={'/property-detail-view?id=' + (property.id || property._id)}
            className='flex-[2.5]'
            onClick={async () => {
              if (user) await propertyViewService.trackPropertyView(user.id, property.id || property._id);
            }}
          >
            <Button
              size='sm'
              className='w-full h-9 sm:h-11 rounded-lg sm:rounded-xl font-bold uppercase tracking-widest text-[8px] sm:text-[10px] shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300'
            >
              {language === 'en' ? 'View Details' : 'વિગતો જુઓ'}
            </Button>
          </Link>

          <div className='flex flex-1 items-center gap-1'>
            <Button
              variant='outline'
              className={'flex-1 h-9 sm:h-11 rounded-lg sm:rounded-xl border-slate-200 flex items-center justify-center transition-all duration-300 ' + (isSaved ? 'text-rose-500 bg-rose-50 border-rose-100' : 'text-slate-400 hover:bg-slate-50')}
              onClick={async (e) => {
                e.preventDefault();
                if (!user) return navigate('/authentication-login-register');
                const pid = property.id || property._id;
                setLoading(true);
                try {
                  if (isSaved) { await propertyService.removeSavedProperty(user.id, pid); setIsSaved(false); }
                  else { await propertyService.saveProperty(user.id, pid); setIsSaved(true); }
                } catch (e) { console.error(e); }
                finally { setLoading(false); }
              }}
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Icon name='Loader2' size={12} className='animate-spin' />
                  </motion.div>
                ) : (
                  <motion.div key="heart" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                    <Icon name='Heart' size={13} fill={isSaved ? 'currentColor' : 'none'} strokeWidth={isSaved ? 0 : 2} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Map Button - Only visual if link exists */}
            {property.map_url && (
              <Button
                variant='outline'
                className='flex-1 h-9 sm:h-11 rounded-lg sm:rounded-xl text-slate-400 border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all duration-300'
                onClick={(e) => {
                  e.preventDefault();
                  window.open(property.map_url, '_blank');
                }}
                title={language === 'en' ? 'View on Map' : 'નકશા પર જુઓ'}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <img
                    src={GoogleMapsLogo}
                    alt="Map"
                    className="w-full h-full object-contain relative z-10"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <Icon name="Map" size={14} className="absolute inset-0 m-auto text-slate-400 opacity-50" />
                </div>
              </Button>
            )}

            <Button
              variant='outline'
              className='flex-1 h-9 sm:h-11 rounded-lg sm:rounded-xl text-slate-400 border-slate-200 hover:bg-slate-50 flex items-center justify-center transition-all duration-300'
              onClick={async () => {
                const url = window.location.origin + '/property-detail-view?id=' + (property.id || property._id);
                if (navigator.share) {
                  try { await navigator.share({ title: property.title, url }); }
                  catch (err) { console.log('Error sharing:', err); }
                } else {
                  navigator.clipboard.writeText(url);
                  toast.success(language === 'en' ? 'Link copied!' : 'લિંક કોપી કરી!');
                }
              }}
            >
              <Icon name='Share2' size={13} />
            </Button>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default PropertyCard;