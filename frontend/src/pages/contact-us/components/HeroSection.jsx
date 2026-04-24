import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { translations } from './translations';

const HeroSection = ({ language }) => {
  const t = translations[language].hero;

  const statsConfig = [
    { icon: 'Clock', gradient: 'from-blue-500 to-cyan-600' },
    { icon: 'Users', gradient: 'from-green-500 to-emerald-600' },
    { icon: 'MapPin', gradient: 'from-purple-500 to-pink-600' }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-blue-50/30 pt-16 sm:pt-20 pb-12 sm:pb-16 lg:pt-32 lg:pb-24">
      {/* Animated Background Gradients - Mobile Optimized */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            x: [0, 50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-[80px] sm:blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.5, 0.4],
            x: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-1/4 -left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-[80px] sm:blur-[100px]" 
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge - iPhone Optimized */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-green-100 text-green-700 rounded-full text-xs sm:text-sm font-bold shadow-lg shadow-green-100/50 mb-6 sm:mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
            <Icon name="MessageCircle" size={14} className="mr-1.5 sm:mr-2" />
            {t.badge}
          </motion.div>

          {/* Main Heading - Better Mobile Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight px-2 sm:px-0 leading-tight"
          >
            {t.titlePrefix}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 block mt-1 sm:mt-2">
              {t.titleHighlight}
            </span>
          </motion.h1>

          {/* Description - Mobile Optimized */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            {t.description}
          </motion.p>

          {/* Stats Cards - iPhone Optimized Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 px-2 sm:px-0"
          >
            {t.stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 rounded-2xl sm:rounded-3xl border-2 border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <motion.div 
                  className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${statsConfig[idx].gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon name={statsConfig[idx].icon} size={24} className="text-white" />
                </motion.div>
                <div className="font-bold text-slate-900 text-sm sm:text-base">{stat.label}</div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons - Mobile Optimized Touch Targets */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0"
          >
            <a href="tel:+919879438937" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-sm sm:text-base lg:text-lg shadow-xl shadow-green-200 hover:shadow-2xl hover:shadow-green-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transform transition-all duration-300"
                >
                  <Icon name="Phone" size={20} className="mr-2" />
                  {t.btnCall}
                </Button>
              </motion.div>
            </a>
            <a href="#contact-form" className="w-full sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-sm sm:text-base lg:text-lg border-2 border-green-200 hover:border-green-400 hover:text-green-700 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300"
                >
                  <Icon name="Mail" size={20} className="mr-2" />
                  {t.btnMessage}
                </Button>
              </motion.div>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;