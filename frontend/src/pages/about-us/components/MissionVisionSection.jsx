import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { translations } from './translations';

const MissionVisionSection = ({ language }) => {
  const t = translations[language].mission;

  const valuesConfig = [
    {
      icon: 'Shield',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50/30'
    },
    {
      icon: 'Zap',
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-50 to-orange-50/30'
    },
    {
      icon: 'Heart',
      gradient: 'from-pink-500 to-rose-600',
      bgGradient: 'from-pink-50 to-rose-50/30'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2 sm:px-0">
              {t.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
              {t.sectionSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Mission */}
            <motion.div 
              className="relative bg-gradient-to-br from-white to-green-50/30 border-2 border-green-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {/* Decorative gradient blob */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-300/20 to-emerald-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6 sm:mb-8">
                  <motion.div 
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-green-200"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon name="Target" size={28} className="text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">{t.missionTitle}</h3>
                    <p className="text-sm sm:text-base text-green-600 font-semibold">{t.missionSubtitle}</p>
                  </div>
                </div>

                <p className="text-slate-700 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {t.missionDesc}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {t.missionPoints.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start text-sm sm:text-base text-slate-700 group/item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:bg-green-500 transition-colors">
                        <Icon name="Check" size={14} className="text-green-600 group-hover/item:text-white transition-colors" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div 
              className="relative bg-gradient-to-br from-white to-blue-50/30 border-2 border-blue-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {/* Decorative gradient blob */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-300/20 to-indigo-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex items-center mb-6 sm:mb-8">
                  <motion.div 
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-blue-200"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon name="Eye" size={28} className="text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">{t.visionTitle}</h3>
                    <p className="text-sm sm:text-base text-blue-600 font-semibold">{t.visionSubtitle}</p>
                  </div>
                </div>

                <p className="text-slate-700 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
                  {t.visionDesc}
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {t.visionPoints.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-start text-sm sm:text-base text-slate-700 group/item"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5 group-hover/item:bg-blue-500 transition-colors">
                        <Icon name="Star" size={14} className="text-blue-600 group-hover/item:text-white transition-colors" />
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Core Values */}
          <motion.div 
            className="mt-10 sm:mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-3 sm:mb-4 px-2 sm:px-0">
                {t.valuesTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 px-4 sm:px-0">
                {t.valuesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {t.valuesList.map((value, index) => (
                <motion.div 
                  key={index} 
                  className={`relative text-center group p-6 sm:p-8 rounded-2xl bg-gradient-to-br ${valuesConfig[index].bgGradient} border border-slate-100 hover:border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -8 }}
                >
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${valuesConfig[index].gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon name={valuesConfig[index].icon} size={32} className="text-white" />
                    </motion.div>
                    <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">
                      {value.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;