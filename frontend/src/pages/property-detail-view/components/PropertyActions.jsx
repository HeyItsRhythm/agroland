import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import propertyService from '../../../utils/propertyService';

const PropertyActions = ({ property }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkIfSaved = async () => {
      if (user && property) {
        try {
          const savedProperties = await propertyService.getSavedProperties(user.id);
          const isSavedProperty = savedProperties.some(savedProp => savedProp.id === property.id);
          setIsSaved(isSavedProperty);
        } catch (error) {
          console.error('Error checking saved status:', error);
        }
      }
    };
    checkIfSaved();
  }, [user, property]);

  const handleSaveProperty = async () => {
    if (!user) {
      navigate('/authentication-login-register');
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await propertyService.removeSavedProperty(user.id, property.id);
        setIsSaved(false);
      } else {
        await propertyService.saveProperty(user.id, property.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling saved property:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareOptions = [
    { name: 'WhatsApp', icon: 'MessageCircle', color: 'text-emerald-500', bg: 'bg-emerald-50', action: () => window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank') },
    { name: 'Facebook', icon: 'Facebook', color: 'text-blue-600', bg: 'bg-blue-50', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank') },
    { name: 'Twitter', icon: 'Twitter', color: 'text-sky-500', bg: 'bg-sky-50', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`, '_blank') },
    { name: 'Email', icon: 'Mail', color: 'text-slate-500', bg: 'bg-slate-50', action: () => window.open(`mailto:?subject=AgroLand Property&body=${encodeURIComponent(window.location.href)}`, '_blank') }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 border border-slate-100 divide-y divide-slate-50 space-y-6 hover:shadow-2xl hover:border-primary/20 hover:scale-[1.01] transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:divide-x lg:divide-slate-100">
        
        {/* 💖 Save Action */}
        <div className="flex-1 lg:pr-8 w-full">
          <Button
            variant={isSaved ? 'default' : 'outline'}
            onClick={handleSaveProperty}
            disabled={loading}
            className={`w-full h-12 rounded-xl border-2 font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 ${isSaved ? 'bg-rose-500 border-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-100' : 'border-slate-200 hover:border-rose-100 hover:text-rose-500'}`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Heart" size={16} fill={isSaved ? "currentColor" : "none"} />
              {language === 'en' ? (isSaved ? 'Saved to Favorites' : 'Save to Favorites') : (isSaved ? 'ફેવરિટમાં સેવ કરેલ' : 'ફેવરિટમાં સેવ કરો')}
            </div>
          </Button>
        </div>

        {/* 📢 Share Marketplace */}
        <div className="flex-[2] lg:px-8 w-full">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center lg:text-left">
            {language === 'en' ? 'Promote listing' : 'લિસ્ટિંગ પ્રમોટ કરો'}
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {shareOptions.map((opt) => (
              <button
                key={opt.name}
                onClick={opt.action}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-10 h-10 ${opt.bg} ${opt.color} rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-90 border border-transparent group-hover:border-white shadow-sm`}>
                  <Icon name={opt.icon} size={18} />
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight">{opt.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 📊 Analytics Summary */}
        <div className="flex-1 lg:pl-8 w-full">
           <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
              <div className="bg-white p-3 text-center hover:bg-slate-50 transition-colors">
                <div className="text-xl font-black text-slate-900 mb-0.5">{property.viewCount}</div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  {language === 'en' ? 'Views' : 'વ્યૂઝ'}
                </div>
              </div>
              <div className="bg-white p-3 text-center hover:bg-slate-50 transition-colors">
                <div className="text-xl font-black text-primary mb-0.5">{property.inquiries || 0}</div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                  {language === 'en' ? 'Inquiries' : 'પૂછપરછ'}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* 🛠️ Secondary Utilities */}
      <div className="flex items-center justify-center gap-6 pt-6">
        <button onClick={() => window.print()} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-all group">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10">
            <Icon name="Printer" size={14} />
          </div>
          {language === 'en' ? 'Print' : 'પ્રિન્ટ'}
        </button>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
        <button onClick={() => toast.success('Reported')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-all group">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-rose-50">
            <Icon name="Flag" size={14} />
          </div>
          {language === 'en' ? 'Report' : 'રિપોર્ટ'}
        </button>
      </div>
    </div>
  );
};

export default PropertyActions;
