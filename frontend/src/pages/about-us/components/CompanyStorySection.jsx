import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { translations } from './translations';

const CompanyStorySection = ({ language }) => {
  const t = translations[language].story;

  const milestonesConfig = [
    {
      icon: 'Sprout',
      gradient: 'from-green-500 to-emerald-600',
      lightBg: 'from-green-50 to-emerald-50'
    },
    {
      icon: 'Rocket',
      gradient: 'from-blue-500 to-cyan-600',
      lightBg: 'from-blue-50 to-cyan-50'
    },
    {
      icon: 'TrendingUp',
      gradient: 'from-amber-500 to-orange-600',
      lightBg: 'from-amber-50 to-orange-50'
    },
    {
      icon: 'Zap',
      gradient: 'from-indigo-500 to-purple-600',
      lightBg: 'from-indigo-50 to-purple-50'
    },
    {
      icon: 'Crown',
      gradient: 'from-yellow-500 to-amber-600',
      lightBg: 'from-yellow-50 to-amber-50'
    },
    {
      icon: 'Eye',
      gradient: 'from-violet-500 to-fuchsia-600',
      lightBg: 'from-violet-50 to-fuchsia-50'
    }
  ];

  const milestones = t.milestones.map((m, i) => ({
    ...m,
    ...milestonesConfig[i]
  }));

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-10 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-3 sm:mb-4 px-2 sm:px-0">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Mobile-friendly vertical timeline */}
          <div className="space-y-8 sm:space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                  {/* Year Badge */}
                  <motion.div 
                    className={`flex-shrink-0 relative z-10 bg-gradient-to-br ${milestone.gradient} rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl min-w-[100px] sm:min-w-[120px]`}
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center">
                      <motion.div 
                        className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-2"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon name={milestone.icon} size={24} className="text-white" />
                      </motion.div>
                      <div className="text-2xl sm:text-3xl font-bold text-white">
                        {milestone.year}
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    className={`flex-1 bg-gradient-to-br ${milestone.lightBg} border-2 border-slate-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Decorative corner gradient */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${milestone.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
                    
                    <div className="relative z-10">
                      <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                        {milestone.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-slate-200 to-transparent group-hover:via-slate-400 transition-colors" />
                  </motion.div>
                </div>

                {/* Connecting line - visible on larger screens between cards */}
                {index < milestones.length - 1 && (
                  <div className="hidden sm:block absolute left-[60px] top-full h-12 w-0.5 bg-gradient-to-b from-slate-300 to-transparent ml-0 mt-0" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-12 sm:mt-16 lg:mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-green-300/30 to-emerald-400/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-300/30 to-purple-400/30 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-slate-900 mb-3 sm:mb-4 px-2 sm:px-0">
                {t.ctaTitle}
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed">
                {t.ctaDesc}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                <motion.button 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon name="UserPlus" size={20} />
                  {t.btnJoin}
                </motion.button>
                <motion.button 
                  className="border-2 border-slate-300 hover:border-slate-400 bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base transition-all hover:shadow-lg inline-flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon name="MessageCircle" size={20} />
                  {t.btnContact}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyStorySection;