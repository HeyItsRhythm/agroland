import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { translations } from './translations';

const TeamSection = ({ language }) => {
  const t = translations[language].team;

  const teamConfig = [
    {
      image: '/assets/images/ceo.png',
      linkedin: '#',
      twitter: '#'
    },
    {
      image: '/assets/images/cto.png',
      linkedin: '',
      twitter: '#'
    },
    {
      image: '/assets/images/marketing.png',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const teamMembers = t.members.map((member, i) => ({
    ...member,
    ...teamConfig[i]
  }));

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-emerald-50/30 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-200/20 to-blue-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4 sm:mb-6 px-2 sm:px-0">
            {t.title}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-4 sm:px-0 leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-white to-emerald-50/50 border-2 border-slate-100 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -8 }}
              >
                {/* Decorative gradient */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-300/20 to-emerald-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="relative mb-6 overflow-hidden rounded-2xl w-32 h-32 sm:w-36 sm:h-36 mx-auto ring-4 ring-white shadow-xl group-hover:ring-emerald-100 transition-all duration-300">
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center">
                        <Icon name="User" size={48} className="text-green-600" />
                      </div>
                    </div>

                    {/* Social Links Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-green-600/95 to-emerald-600/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="flex space-x-3">
                        <motion.a
                          href={member.linkedin}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon name="Linkedin" size={18} className="text-white" />
                        </motion.a>
                        <motion.a
                          href={member.twitter}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Icon name="Instagram" size={18} className="text-white" />
                        </motion.a>
                      </div>
                    </motion.div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-green-700 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm sm:text-base text-green-600 font-semibold mb-4">
                    {member.role}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed px-2">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;