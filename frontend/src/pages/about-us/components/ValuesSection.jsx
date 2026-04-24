import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { translations } from './translations';

const ValuesSection = ({ language }) => {
  const t = translations[language].values;

  const valuesConfig = [
    {
      icon: 'Eye',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    {
      icon: 'Shield',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      icon: 'Users',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-50'
    },
    {
      icon: 'Lightbulb',
      gradient: 'from-amber-500 to-yellow-600',
      bgGradient: 'from-amber-50 to-yellow-50'
    },
    {
      icon: 'Heart',
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-50'
    },
    {
      icon: 'Star',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ];

  const values = t.list.map((item, i) => ({
    ...item,
    ...valuesConfig[i]
  }));

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 sm:px-0">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-4 sm:px-0 leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div 
              key={index} 
              className={`bg-gradient-to-br ${value.bgGradient} rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Decorative gradient blob */}
              <div className={`absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br ${value.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-start space-x-4 mb-4 sm:mb-5">
                  <motion.div 
                    className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${value.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon name={value.icon} size={24} className="text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                      {value.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {value.description}
                </p>
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-slate-400 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;