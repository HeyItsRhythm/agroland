import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { translations } from './translations';

const CallToActionSection = ({ language }) => {
  const t = translations[language].cta;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50/50 relative overflow-hidden">
      {/* Animated decorative blobs */}
      <motion.div 
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-300/20 to-emerald-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-purple-400/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 sm:px-0">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-0 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* For Sellers */}
          <motion.div 
            className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-green-100 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <motion.div 
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mx-auto mb-6 shadow-lg shadow-green-200"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon name="Upload" size={32} className="text-white" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                {t.seller.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
                {t.seller.desc}
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 mb-6 sm:mb-8">
                {t.seller.points.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon name="CheckCircle" size={14} className="text-green-600" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link to="/authentication-login-register?mode=register&role=seller">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="default" 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200 text-white font-bold h-12 sm:h-14 text-sm sm:text-base rounded-full"
                  >
                    {t.seller.btn}
                    <Icon name="ArrowRight" size={18} className="ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          {/* For Buyers */}
          <motion.div 
            className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-blue-100 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            {/* Decorative gradient blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            
            <div className="relative z-10">
              <motion.div 
                className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mx-auto mb-6 shadow-lg shadow-blue-200"
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Icon name="Search" size={32} className="text-white" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
                {t.buyer.title}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed">
                {t.buyer.desc}
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 mb-6 sm:mb-8">
                {t.buyer.points.map((item, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="CheckCircle" size={14} className="text-blue-600" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link to="/authentication-login-register?mode=register&role=buyer">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="default" 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-200 text-white font-bold h-12 sm:h-14 text-sm sm:text-base rounded-full"
                  >
                    {t.buyer.btn}
                    <Icon name="ArrowRight" size={18} className="ml-2" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;