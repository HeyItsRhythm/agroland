import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';
import inquiryService from '../../../utils/inquiryService';

const SellerContact = ({ seller, propertyId, propertyTitle }) => {
  const { language } = useLanguage();
  const [showContactForm, setShowContactForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: language === 'en' 
      ? `I am interested in "${propertyTitle || 'this property'}" (ID: ${propertyId.slice(-6).toUpperCase()})` 
      : `મને "${propertyTitle || 'આ પ્રોપર્ટી'}" માં રસ છે (ID: ${propertyId.slice(-6).toUpperCase()})`
  });

  useEffect(() => {
    if (user && userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.full_name || '',
        email: user.email || '',
        phone: userProfile.phone || ''
      }));
    }
  }, [user, userProfile, propertyId, language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateInquiryAttempt = () => {
    if (!user) {
    if (!user) {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <span className="font-medium text-sm">
            {language === 'en' 
              ? "Please login to send an inquiry. Would you like to login now?" 
              : "પૂછપરછ મોકલવા માટે લોગ ઇન કરવું જરૂરી છે. શું તમે અત્યારે લોગ ઇન કરવા માંગો છો?"}
          </span>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs font-medium hover:bg-gray-200"
              onClick={() => toast.dismiss(t.id)}
            >
              {language === 'en' ? 'Cancel' : 'રદ કરો'}
            </button>
            <button
              className="px-3 py-1 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary/90"
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/authentication-login-register?mode=login', { state: { from: location } });
              }}
            >
              {language === 'en' ? 'Login' : 'લોગ ઇન'}
            </button>
          </div>
        </div>
      ), { duration: 5000, icon: '🔒' });
      return;
    }
    }
    setShowContactForm(!showContactForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    try {
      const inquiryPayload = {
        property_id: propertyId,
        sender_id: user.id,
        seller_id: seller.id,
        message: formData.message,
        contact_mobile: formData.phone,
        contact_email: formData.email,
        status: 'pending'
      };

      const result = await inquiryService.createInquiry(inquiryPayload);
      if (result.success) {
        toast.success(language === 'en' ? 'Your inquiry has been sent!' : 'તમારી પૂછપરછ મોકલવામાં આવી છે!');
        setFormData(prev => ({ ...prev, message: '' }));
        setShowContactForm(false);
      } else {
        toast.error(result.error || 'Failed to send inquiry.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    // Ensure we have a phone number to send to
    const sellerPhone = seller.phone || '76983595256'; // Fallback to provided number if none exists
    const cleanPhone = sellerPhone.replace(/\D/g, '');
    
    const message = encodeURIComponent(`Hello ${seller.name}, I am interested in your property "${propertyTitle || 'land'}" (ID: ${propertyId.slice(-6).toUpperCase()}) listed on AgroLand. ${window.location.href}`);
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative group hover:shadow-2xl hover:border-primary/20 hover:scale-[1.01] transition-all duration-300">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Seller Identity Card */}
          <div className="flex items-center gap-6 flex-1 w-full">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-white shadow-xl ring-1 ring-slate-100">
                <Image
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-white p-1.5 rounded-xl border-2 border-white shadow-lg">
                <Icon name="ShieldCheck" size={12} />
              </div>
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl md:text-2xl font-black font-heading text-slate-900 tracking-tight">
                  {seller.name}
                </h3>
                <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                  <Icon name="Star" size={10} fill="currentColor" />
                  <span className="text-[10px] font-black ml-1 uppercase">{seller.rating}</span>
                </div>
              </div>
              
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Icon name="MapPin" size={12} className="text-primary" />
                {seller.location || (language === 'en' ? 'Verified Location' : 'ચકાસાયેલ સ્થાન')}
              </p>

              <div className="flex gap-4 pt-1">
                <div className="text-center">
                  <div className="text-base font-black text-slate-900 leading-none">{seller.totalListings}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Listings</div>
                </div>
                <div className="w-px h-6 bg-slate-100"></div>
                <div className="text-center">
                  <div className="text-base font-black text-slate-900 leading-none">{seller.soldProperties}</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Sold</div>
                </div>
                <div className="w-px h-6 bg-slate-100"></div>
                <div className="text-center">
                  <div className="text-base font-black text-slate-900 leading-none">{seller.yearsExperience}+</div>
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Exp</div>
                </div>
              </div>
            </div>
          </div>

          {/* 🚀 Call To Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-72">
            <Button
              variant="default"
              onClick={handleWhatsApp}
              className="flex-1 h-14 rounded-2xl bg-[#075E54] hover:bg-[#128C7E] text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/10 border-0 flex items-center justify-center gap-3 active:scale-95 transition-all group/btn"
            >
              <div className="bg-white/20 p-2 rounded-xl group-hover/btn:rotate-12 transition-transform">
                <Icon name="MessageCircle" size={20} />
              </div>
              <span>WhatsApp Connect</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleCreateInquiryAttempt}
              className="flex-1 h-12 rounded-2xl border-2 border-slate-200 hover:border-primary/40 hover:bg-primary/5 font-black uppercase tracking-widest text-[9px] active:scale-95 text-slate-600 transition-all flex items-center justify-center gap-2"
            >
              <Icon name="Mail" size={16} />
              Draft Inquiry
            </Button>
          </div>
        </div>

        {/* 📝 Inquiry Expanded Form */}
        <AnimatePresence>
          {showContactForm && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-8 pt-6 border-t border-slate-50 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-12 bg-slate-50 border-0 rounded-xl px-5 font-bold text-xs focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-12 bg-slate-50 border-0 rounded-xl px-5 font-bold text-xs focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Enter your phone"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full h-[100px] bg-slate-50 border-0 rounded-xl p-5 font-bold text-xs focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Describe your interest..."
                      required
                    />
                  </div>
                  <Button
                    variant="default"
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/20"
                  >
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Footer */}
      <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
          <Icon name="ShieldCheck" className="text-emerald-600" size={12} />
          <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Official Partner</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
          <Icon name="Lock" className="text-blue-600" size={12} />
          <span className="text-[9px] font-black text-blue-800 uppercase tracking-widest">Secure Vault</span>
        </div>
      </div>
    </div>
  );
};

export default SellerContact;
