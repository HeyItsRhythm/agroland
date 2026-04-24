import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { translations } from './translations';

const ContactInfo = ({ language }) => {
  const t = translations[language].info;

  const contactDetailsConfig = [
    {
      icon: 'Phone',
      details: ['+91 8200072638'],
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      linkType: 'phone'
    },
    {
      icon: 'Mail',
      details: ['agrolandsuport@gmail.com'],
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      linkType: 'email'
    },
    {
      icon: 'Clock',
      details: t.hours.details,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50',
      linkType: 'none'
    }
  ];

  const contactDetails = [
    {
      ...contactDetailsConfig[0],
      title: t.phone.title,
      description: t.phone.description
    },
    {
      ...contactDetailsConfig[1],
      title: t.email.title,
      description: t.email.description
    },
    {
      ...contactDetailsConfig[2],
      title: t.hours.title,
      description: ''
    }
  ];

  return (
    <div className="space-y-5 sm:space-y-6 md:space-y-8">
      {/* Contact Information */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="bg-white border-2 border-slate-100 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-slate-200/50"
      >
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 font-medium text-sm sm:text-base">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {contactDetails.map((contact, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-gradient-to-br ${contact.bgGradient} flex items-start space-x-3 sm:space-x-4 group p-4 sm:p-5 rounded-2xl border-2 border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
            >
              {/* Decorative gradient blob */}
              <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${contact.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
              
              <motion.div 
                className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${contact.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg relative z-10`}
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon name={contact.icon} size={24} />
              </motion.div>
              <div className="flex-1 min-w-0 pt-0.5 sm:pt-1 relative z-10">
                <h4 className="font-black text-slate-900 mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg">
                  {contact.title}
                </h4>
                <div className="space-y-1 sm:space-y-1.5">
                  {contact.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="text-slate-700 font-medium text-xs sm:text-sm">
                      {contact.linkType === 'phone' ? (
                        <a href={`tel:${detail.replace(/\s/g, '')}`} className="hover:text-green-600 transition-colors inline-flex items-center">
                          {detail}
                        </a>
                      ) : contact.linkType === 'email' ? (
                        <a href={`mailto:${detail}`} className="hover:text-purple-600 transition-colors break-all inline-flex items-center">
                          {detail}
                        </a>
                      ) : (
                        detail
                      )}
                    </div>
                  ))}
                </div>
                {contact.description && (
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-2 font-bold uppercase tracking-wide">
                    {contact.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* WhatsApp Quick Contact - Enhanced Design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-[#25D366] via-[#1EBE5A] to-[#128C7E] rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl shadow-emerald-300/50 text-white relative overflow-hidden group"
      >
        {/* Animated gradient blobs */}
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/20 rounded-full -mr-10 -mt-10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -ml-8 -mb-8 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="flex items-center space-x-4 sm:space-x-5 relative z-10">
          <motion.div 
            className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl ring-2 ring-white/40"
            whileHover={{ rotate: [0, -15, 15, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <Icon name="MessageCircle" size={32} className="text-white sm:w-9 sm:h-9" />
          </motion.div>
          <div className="flex-1">
            <h4 className="font-black text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
              {t.whatsapp.title}
            </h4>
            <p className="text-white/95 text-xs sm:text-sm md:text-base font-medium mb-3 sm:mb-4 leading-relaxed">
              {t.whatsapp.description}
            </p>
            <a
              href="https://wa.me/918200072638"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-white text-[#128C7E] px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-black transition-all active:scale-95 hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <span>{t.whatsapp.btnChat}</span>
              <Icon name="ExternalLink" size={16} className="sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;