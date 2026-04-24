import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import PropertyImageGallery from './components/PropertyImageGallery';
import PropertyInfo from './components/PropertyInfo';
import SellerContact from './components/SellerContact';
import RelatedProperties from './components/RelatedProperties';
import PropertyActions from './components/PropertyActions';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import propertyViewService from '../../utils/propertyViewService';
import propertyService from '../../utils/propertyService';
import Button from '../../components/ui/Button';
import { Helmet } from 'react-helmet';

const PropertyDetailView = () => {
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  const propertyId = searchParams.get('id');

  useEffect(() => {
    let isMounted = true;
    const fetchProperty = async () => {
      if (!propertyId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const result = await propertyService.getPropertyById(propertyId);
        if (isMounted) {
          if (result.success && result.data) {
            const data = result.data;
            let sellerStats = { totalListings: 1, soldProperties: 0, yearsExperience: 1 };
            try {
              if (data.seller_id?.id) {
                const statsResult = await propertyService.getSellerAnalytics(data.seller_id.id);
                if (statsResult.success && statsResult.data) {
                  sellerStats.totalListings = statsResult.data.totalProperties || 0;
                  sellerStats.soldProperties = statsResult.data.soldProperties || 0;
                }
                if (data.seller_id?.created_at) {
                  const joinDate = new Date(data.seller_id.created_at);
                  const now = new Date();
                  const years = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24 * 365));
                  sellerStats.yearsExperience = Math.max(0, years);
                }
              }
            } catch (err) { console.warn("Seller stats failed", err); }

            const mappedProperty = {
              id: data.id,
              title: data.title,
              price: data.price,
              area: data.area, 
              areaUnit: data.area_unit,
              district: data.location_district,
              taluka: data.location_taluka,
              village: data.location_village,
              status: data.status,
              description: data.description,
              descriptionGu: data.description,
              landType: data.property_type,
              landTypeGu: data.property_type,
              waterSource: data.amenities?.find(a => a.includes('Water')) || 'Not specified',
              waterSourceGu: data.amenities?.find(a => a.includes('Water')) || 'ઉલ્લેખ નથી',
              soilType: data.amenities?.find(a => a.includes('Soil'))?.replace('Soil Type: ', '') || 'Not specified',
              soilTypeGu: data.amenities?.find(a => a.includes('Soil'))?.replace('Soil Type: ', '') || 'ઉલ્લેખ નથી',
              irrigation: data.amenities?.includes('Irrigation') ? 'Available' : 'Not specified',
              irrigationGu: data.amenities?.includes('Irrigation') ? 'ઉપલબ્ધ' : 'ઉલ્લેખ નથી',
              roadAccess: data.amenities?.find(a => a.includes('Road'))?.replace('Road: ', '') || 'Not specified',
              roadAccessGu: data.amenities?.find(a => a.includes('Road'))?.replace('Road: ', '') || 'ઉલ્લેખ નથી',
              legalStatus: 'Clear Title',
              legalStatusGu: 'સ્પષ્ટ ટાઇટલ',
              surveyNumber: 'Verified',
              listedDate: new Date(data.created_at).toLocaleDateString(),
              lastUpdated: new Date(data.updated_at).toLocaleDateString(),
              viewCount: data.views_count || 0,
              inquiries: 0,
              images: data.images || [],
              mapLink: data.map_url || '',
              features: (data.amenities || []).map(a => ({ en: a, gu: a })),
              seller: {
                id: data.seller_id?.id || data.seller_id,
                name: data.seller?.full_name || data.seller_id?.full_name || 'Seller',
                avatar: data.seller_id?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
                phone: data.seller?.phone || data.seller_id?.phone || '',
                rating: 4.5,
                reviewCount: 10,
                location: data.location_district,
                totalListings: sellerStats.totalListings,
                soldProperties: sellerStats.soldProperties,
                yearsExperience: sellerStats.yearsExperience
              }
            };
            setProperty(mappedProperty);
          } else {
            setProperty(null);
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        if (isMounted) setProperty(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProperty();

    let viewTimer = null;
    if (user && propertyId) {
      viewTimer = setTimeout(async () => {
        try {
          if (isMounted) await propertyViewService.trackPropertyView(user.id, propertyId);
        } catch (e) { console.warn("Track view failed", e); }
      }, 2000);
    }

    return () => {
      isMounted = false;
      if (viewTimer) clearTimeout(viewTimer);
    };
  }, [propertyId, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Icon name="Loader2" size={32} className="text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    const loginUrl = `/authentication-login-register?mode=login&from=${encodeURIComponent(`/property-detail-view?id=${propertyId}`)}`;
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-100">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="Lock" size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-black font-heading mb-3 tracking-tight">Login Required</h2>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">Please log in to view complete property records and connect with verified sellers.</p>
            <Link to={loginUrl}>
              <Button className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 transition-transform active:scale-95">Log In Securely</Button>
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Icon name="SearchX" size={48} className="text-slate-200 mb-4" />
          <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">Listing Not Found</h2>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header />
      <Helmet>
        <title>{property?.title ? `${property.title} | AgroLand Gujarat` : 'Property Details | AgroLand'}</title>
        <meta name="description" content={property?.description ? property.description.substring(0, 160) : 'View property details, price, and location on AgroLand.'} />
        {property?.images?.[0] && <meta property="og:image" content={property.images[0]} />}
        <link rel="canonical" href={`https://agrolandgujarat.in/property-detail-view?id=${searchParams.get('id')}`} />
      </Helmet>

      
      <main className="flex-1 relative overflow-x-hidden pt-4 pb-24">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          
          {/* Breadcrumbs */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6"
          >
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Icon name="ChevronRight" size={8} className="mx-2 opacity-30" />
            <Link to="/property-listings-search" className="hover:text-primary transition-colors">Market</Link>
            <Icon name="ChevronRight" size={8} className="mx-2 opacity-30" />
            <span className="text-slate-900 line-clamp-1">{property.title}</span>
          </motion.div>

          {/* 🧩 STACKED BODY STRUCTURE */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* 1️⃣ Property Media Section (Top) */}
            <motion.div variants={itemVariants}>
              <PropertyImageGallery 
                images={property.images} 
                propertyName={property.title} 
                propertyStatus={property.status}
              />
            </motion.div>

            {/* 2, 3, 4 Sections (Summary, Quick Info, Details) */}
            <motion.div variants={itemVariants}>
              <PropertyInfo property={property} />
            </motion.div>

            {/* 5️⃣ Seller & Action Section (Horizontal Below) */}
            <motion.div variants={itemVariants} id="seller-section">
              <SellerContact 
                seller={property.seller} 
                propertyId={property.id} 
                propertyTitle={property.title} 
              />
            </motion.div>

            {/* 6️⃣ Action Tools Section (Extra Utilities) */}
            <motion.div variants={itemVariants}>
              <PropertyActions property={property} />
            </motion.div>

            {/* Similar Properties */}
            <motion.div 
              variants={itemVariants} 
              className="pt-10 border-t border-slate-200"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-black font-heading tracking-tight">Market Recommendations</h2>
                <Link to="/property-listings-search" className="text-[9px] font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1.5 transition-all">
                  Browse All <Icon name="ArrowRight" size={12} />
                </Link>
              </div>
              <RelatedProperties currentPropertyId={property.id} district={property.district} taluka={property.taluka} />
            </motion.div>

            {/* Footer Line removed */}
          </motion.div>
        </div>

        {/* 📱 Mobile Sticky Bottom CTA Bar */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[999]">
           <motion.div 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="w-full bg-white/95 backdrop-blur-xl border border-white p-2.5 rounded-[1.5rem] shadow-2xl flex items-center gap-2.5 ring-1 ring-slate-900/5"
           >
              <button 
                onClick={() => {
                   const sellerPhone = property.seller.phone || '76983595256';
                   const cleanPhone = sellerPhone.replace(/\D/g, '');
                   const message = encodeURIComponent(`Hello, I'm interested in your property "${property.title}" (ID: ${propertyId.slice(-6).toUpperCase()}) listed on AgroLand. ${window.location.href}`);
                   window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
                }}
                className="flex-[2] h-11 bg-[#25D366] text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
              >
                 <Icon name="MessageCircle" size={14} />
                 WhatsApp
              </button>
              <button 
                onClick={() => document.getElementById('seller-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex-1 h-11 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2.5 active:scale-95 transition-transform"
              >
                 Inquiry
              </button>
           </motion.div>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetailView;
