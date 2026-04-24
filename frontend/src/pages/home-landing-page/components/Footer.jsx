import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useLanguage } from '../../../contexts/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    company: {
      title: language === 'en' ? 'Company' : 'કંપની',
      links: [
        { label: language === 'en' ? 'About Us' : 'અમારા વિશે', path: '/about-us' },
        { label: language === 'en' ? 'Our Team' : 'અમારી ટીમ', path: '/about-us#team' },
        { label: language === 'en' ? 'Careers' : 'કારકિર્દી', path: '/careers' },
        { label: language === 'en' ? 'Press Releases' : 'પ્રેસ રિલીઝ', path: '/press-releases' }
      ]
    },
    services: {
      title: language === 'en' ? 'Services' : 'સેવાઓ',
      links: [
        { label: language === 'en' ? 'Buy Property' : 'પ્રોપર્ટી ખરીદો', path: '/property-listings-search' },
        { label: language === 'en' ? 'Sell Property' : 'પ્રોપર્ટી વેચો', path: '/seller-dashboard' },
        { label: language === 'en' ? 'Legal Support' : 'કાનૂની સહાય', path: '/legal-support' }
      ]
    },
    support: {
      title: language === 'en' ? 'Support' : 'સહાય',
      links: [
        { label: language === 'en' ? 'Help Center' : 'સહાય કેન્દ્ર', path: '/help-center' },
        { label: language === 'en' ? 'Contact Us' : 'અમારો સંપર્ક કરો', path: '/contact-us' },
        { label: language === 'en' ? 'FAQ' : 'FAQ', path: '/faq' },
        {
          label: language === 'en' ? 'Live Chat' : 'લાઇવ ચેટ',
          path: '#',
          onClick: () => {
            if (window.JamieDoesChatbotThings && window.JamieDoesChatbotThings.open) {
              window.JamieDoesChatbotThings.open();
            } else {
              toast.error(language === 'en' ? 'Chat is currently unavailable.' : 'ચેટ હાલમાં અનુપલબ્ધ છે.');
            }
          }
        }
      ]
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: 'Facebook', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: 'Twitter', color: 'hover:bg-sky-500' },
    { name: 'Instagram', icon: 'Instagram', color: 'hover:bg-pink-600' },
    { name: 'LinkedIn', icon: 'Linkedin', color: 'hover:bg-blue-700' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <footer className="relative bg-gray-200 overflow-hidden text-slate-900">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[160px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-[160px]" />

        {/* Animated Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-primary opacity-20"
            initial={{
              x: Math.random() * 100 + "%",
              y: "110%",
              rotate: 0
            }}
            animate={{
              y: "-10%",
              rotate: 360,
              x: (Math.random() - 0.5) * 20 + "%"
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ left: `${i * 15}%` }}
          >
            <Icon name="Leaf" size={24 + Math.random() * 20} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-16 pb-12">
        {/* Main Links Area */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
        >
          {/* Brand Identity */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 lg:space-y-10">
            <Link to="/home-landing-page" className="flex items-center space-x-5 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                className="w-14 h-14 lg:w-16 lg:h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 text-white"
              >
                <Icon name="Sprout" size={28} />
              </motion.div>
              <div className="flex flex-col text-left">
                <span className="text-2xl lg:text-3xl font-heading font-black tracking-tight text-slate-900 leading-none">AgroLand</span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mt-2">Portal</span>
              </div>
            </Link>

            <p className="text-slate-600 leading-relaxed text-sm font-medium lg:pr-8 max-w-md">
              {language === 'en' ? "Gujarat's premier agricultural land marketplace connecting verified buyers and sellers with secure, transparent transactions."
                : 'ગુજરાતનું પ્રીમિયર કૃષિ જમીન માર્કેટપ્લેસ જે ચકાસાયેલ ખરીદદારો અને વેચનારાઓને સુરક્ષિત, પારદર્શક વ્યવહારો સાથે જોડે છે.'}
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  className={`w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-white/50 border border-slate-300 flex items-center justify-center text-slate-500 transition-all ${social.color} hover:text-white hover:border-transparent`}
                >
                  <Icon name={social.icon} size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-x-3 sm:gap-x-8 gap-y-10">
            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key} className="space-y-5 lg:space-y-8">
                <h4 className="text-[11px] lg:text-xs font-black uppercase tracking-wider lg:tracking-[0.3em] text-primary flex items-center gap-2 lg:gap-3">
                  <div className="hidden lg:block w-4 h-[1px] bg-primary/30" />
                  {section.title}
                </h4>
                <ul className="space-y-3 lg:space-y-4">
                  {section.links.map((link, idx) => (
                    <motion.li
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className="group flex items-center gap-2"
                    >
                      <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
                      {link.onClick ? (
                        <button onClick={link.onClick} className="text-[10.5px] lg:text-sm font-extrabold text-slate-600 hover:text-primary transition-colors text-left uppercase tracking-tighter lg:tracking-tight leading-tight">
                          {link.label}
                        </button>
                      ) : (
                        <Link to={link.path} className="text-[10.5px] lg:text-sm font-extrabold text-slate-600 hover:text-primary transition-colors uppercase tracking-tighter lg:tracking-tight leading-tight">
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 lg:mt-24 pt-8 lg:pt-12 border-t border-slate-300 flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8"
        >
          <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6">
            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              © {new Date().getFullYear()} AGROLAND PORTAL
            </span>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-[9px] lg:text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">
              Digital Land Marketplace
            </span>
          </div>

          <div className="flex gap-6 lg:gap-10">
            <Link
              to="/privacy-policy"
              className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            >
              {language === 'en' ? 'Privacy' : 'ગોપનીયતા'}
            </Link>
            <Link
              to="/terms-of-service"
              className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            >
              {language === 'en' ? 'Terms' : 'શરતો'}
            </Link>
            <Link
              to="/disclaimer"
              className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors"
            >
              {language === 'en' ? 'Disclaimer' : 'ડિસ્ક્લેમર'}
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
