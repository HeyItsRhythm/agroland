import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { translations } from './translations';

const HeroSection = ({ language }) => {
  const t = translations[language].hero;

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 sm:py-16 md:py-20 lg:py-28 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      
      {/* Decorative Gradient Blobs with Animation */}
      <motion.div 
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-3xl opacity-60"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 0.4, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl opacity-60"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.4, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 text-xs sm:text-sm font-bold mb-4 sm:mb-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            {t.badge}
          </motion.div>

          {/* Main Heading - Improved Mobile Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-heading text-slate-900 mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
          >
            {t.titlePrefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 block mt-1 sm:mt-2">
              {t.titleHighlight}
            </span>
          </motion.h1>

          {/* Description - Better Mobile Spacing */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6"
          >
            {t.description}
          </motion.p>

          {/* Statistics - Improved Mobile Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 px-2 sm:px-0"
          >
            {t.stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl shadow-lg border border-slate-200/50 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name={['Home', 'Users', 'MapPin', 'TrendingUp'][index]} size={16} className="text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-600 to-emerald-600 mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 font-medium leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons - Better Mobile Layout */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <Button 
              size="lg" 
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-full text-sm sm:text-base font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Icon name="Users" size={20} className="mr-2" />
              {t.btnTeam}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="h-12 sm:h-14 px-6 sm:px-8 rounded-full text-sm sm:text-base font-bold bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
            >
              <Icon name="Target" size={20} className="mr-2" />
              {t.btnMission}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;