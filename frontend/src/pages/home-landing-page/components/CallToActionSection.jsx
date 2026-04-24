import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { useLanguage } from '../../../contexts/LanguageContext';
import Icon from '../../../components/AppIcon';

const CallToActionSection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleGetStarted = (role) => {
    // Store the intended role for registration
    localStorage.setItem('intendedRole', role);
    navigate('/authentication-login-register');
  };

  const userTypes = [
    {
      type: 'buyer',
      icon: 'ShoppingCart',
      title: language === 'en' ? 'For Buyers' : 'ખરીદદારો માટે',
      description: language === 'en' ? 'Find your perfect agricultural land with advanced search filters and verified listings' : 'અદ્યતન શોધ ફિલ્ટર્સ અને ચકાસાયેલ લિસ્ટિંગ્સ સાથે તમારી સંપૂર્ણ કૃષિ જમીન શોધો',
      benefits: language === 'en'
        ? ['Advanced Property Search', 'Verified Listings', 'Legal Documentation Support']
        : ['અદ્યતન પ્રોપર્ટી શોધ', 'ચકાસાયેલ લિસ્ટિંગ્સ', 'કાનૂની દસ્તાવેજીકરણ સહાય'],
      buttonText: language === 'en' ? 'Start Buying' : 'ખરીદવાનું શરૂ કરો',
      gradient: 'from-blue-600 via-blue-500 to-indigo-600',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-100 text-blue-700',
      hoverGlow: 'group-hover:shadow-blue-200'
    },
    {
      type: 'seller',
      icon: 'Store',
      title: language === 'en' ? 'For Sellers' : 'વેચનારા માટે',
      description: language === 'en' ? 'List your agricultural property and connect with verified buyers across Gujarat' : 'તમારી કૃષિ મિલકત સૂચિબદ્ધ કરો અને ગુજરાતભરના ચકાસાયેલ ખરીદદારો સાથે જોડાઓ',
      benefits: language === 'en'
        ? ['Easy Property Listing', 'Verified Buyer Network', 'Analytics Dashboard']
        : ['સરળ પ્રોપર્ટી લિસ્ટિંગ', 'ચકાસાયેલ ખરીદદાર નેટવર્ક', 'એનાલિટિક્સ ડેશબોર્ડ'],
buttonText: language === 'en' ? 'Start Selling' : 'વેચવાનું શરૂ કરો',
      gradient: 'from-green-600 via-emerald-500 to-teal-600',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600',
      badgeColor: 'bg-green-100 text-green-700',
      hoverGlow: 'group-hover:shadow-green-200'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-30 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-green-50 border border-slate-200 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 animate-pulse"></div>
            <span className="text-sm font-bold text-slate-700">
              {language === 'en' ? 'GET STARTED TODAY' : 'આજે જ શરૂઆત કરો'}
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-slate-900 mb-4 sm:mb-6">
            {language === 'en' ? 'Ready to Get Started?' : 'શરૂ કરવા તૈયાર છો?'}
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4">
            {language === 'en' 
              ? 'Join thousands of satisfied users who have successfully bought and sold agricultural properties through our platform' 
              : 'હજારો સંતુષ્ટ વપરાશકર્તાઓ સાથે જોડાઓ જેમણે અમારા પ્લેટફોર્મ દ્વારા સફળતાપૂર્વક કૃષિ મિલકતો ખરીદી અને વેચી છે'}
          </p>
        </div>

        {/* CTA Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {userTypes.map((userType, index) => (
            <div
              key={userType.type}
              className={`bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl hover:shadow-2xl ${userType.hoverGlow} transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden border-2 border-slate-100 hover:border-slate-200`}
            >
              {/* Decorative gradient background */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${userType.gradient} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className={`absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr ${userType.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <div className="relative z-10">
                {/* Icon Badge */}
                <div className="flex items-start justify-between mb-6 sm:mb-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl ${userType.iconBg} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon name={userType.icon} size={window.innerWidth < 640 ? 28 : 36} />
                  </div>
                  
                  {/* Badge */}
                  <div className={`${userType.badgeColor} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm`}>
                    {language === 'en' ? 'Popular' : 'લોકપ્રિય'}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-black text-slate-900 mb-3 sm:mb-4 leading-tight">
                  {userType.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed font-medium">
                  {userType.description}
                </p>

                {/* Benefits List */}
                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                  {userType.benefits.map((benefit, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start sm:items-center text-sm sm:text-base text-slate-700 transform hover:translate-x-1 transition-transform duration-200"
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${userType.iconBg} flex items-center justify-center mr-3 sm:mr-4 shadow-md`}>
                        <Icon name="Check" size={14} className="text-white font-bold" />
                      </div>
                      <span className="font-semibold leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => handleGetStarted(userType.type)}
                  iconName="ArrowRight"
                  iconPosition="right"
                  className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-full text-base sm:text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-r ${userType.gradient} hover:scale-[1.02] active:scale-[0.98]`}
                >
                  {userType.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-500 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={18} className="text-green-600" />
              <span className="font-semibold">{language === 'en' ? '100% Secure' : '100% સુરક્ષિત'}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <Icon name="Users" size={18} className="text-blue-600" />
              <span className="font-semibold">{language === 'en' ? '10,000+ Users' : '10,000+ વપરાશકર્તાઓ'}</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <Icon name="Award" size={18} className="text-yellow-600" />
              <span className="font-semibold">{language === 'en' ? 'Verified Platform' : 'ચકાસાયેલ પ્લેટફોર્મ'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;