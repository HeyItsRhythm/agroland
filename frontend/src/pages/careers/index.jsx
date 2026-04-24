import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import careerService from '../../utils/careerService';

const CareersPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    setLoading(true);
    const result = await careerService.getActiveCareers();
    if (result.success) {
      setCareers(result.data);
    }
    setLoading(false);
  };

  const scrollToPositions = () => {
    document.getElementById('open-positions').scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    { icon: 'Zap', title: 'High Impact Work', desc: 'Directly impact the lives of farmers and landowners.' },
    { icon: 'Smile', title: 'Work-Life Balance', desc: 'Flexible hours and remote work options available.' },
    { icon: 'TrendingUp', title: 'Career Growth', desc: 'Rapid promotion cycles and learning budget.' },
    { icon: 'Users', title: 'Great Culture', desc: 'Collaborative, open, and fun work environment.' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Helmet>
        <title>{language === 'en' ? 'Careers at AgroLand | Join Our Mission' : 'એગ્રોલેન્ડમાં કારકિર્દી | અમારા મિશનમાં જોડાઓ'}</title>
        <meta name="description" content="Join AgroLand Portal and help revolutionize agricultural real estate in Gujarat. View open positions in Engineering, Sales, and Marketing." />
        <link rel="canonical" href="https://agrolandgujarat.in/careers" />
      </Helmet>

      <Header />

      <main className="overflow-hidden">
        {/* 🌟 Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6">
                {language === 'en' ? 'We are Hiring!' : 'અમે ભરતી કરી રહ્યા છીએ!'}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-slate-900">
                {language === 'en' ? 'Build the Future of' : 'ભવિષ્ય બનાવો'} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                  {language === 'en' ? 'Agri-Tech with Us' : 'અમારી સાથે એગ્રી-ટેકનું'}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                {language === 'en' 
                  ? 'Join a passionate team dedicated to transforming how agricultural land is bought, sold, and managed in India.'
                  : 'ભારતમાં કૃષિ જમીન કેવી રીતે ખરીદવામાં આવે છે, વેચવામાં આવે છે અને સંચાલિત થાય છે તેને બદલવા માટે સમર્પિત જુસ્સાદાર ટીમમાં જોડાઓ.'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={scrollToPositions}
                  className="h-12 px-8 rounded-xl text-base font-bold shadow-lg shadow-emerald-200 hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  {language === 'en' ? 'View Openings' : 'ખુલ્લી પોઝિશન જુઓ'}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/about-us')}
                  className="h-12 px-8 rounded-xl text-base font-bold border-2 hover:bg-slate-50"
                >
                  {language === 'en' ? 'Learn About Us' : 'અમારા વિશે જાણો'}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 🌟 Benefits Grid */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {benefits.map((benefit, idx) => (
                <motion.div key={idx} variants={itemVariants} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                    <Icon name={benefit.icon} size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-500 font-medium">{benefit.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 🌟 Job Listings */}
        <section id="open-positions" className="py-20 lg:py-28 relative">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                {language === 'en' ? 'Open Positions' : 'વર્તમાન ખાલી જગ્યાઓ'}
              </h2>
              <p className="text-slate-500 font-medium max-w-xl mx-auto">
                {language === 'en' 
                  ? 'Find a role that fits your skills and passion. We are always looking for great talent.'
                  : 'તમારી કુશળતા અને જુસ્સાને અનુરૂપ ભૂમિકા શોધો. અમે હંમેશા મહાન પ્રતિભા શોધી રહ્યા છીએ.'}
              </p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : careers.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {careers.map((job) => (
                  <motion.div 
                    key={job._id} 
                    variants={itemVariants}
                    whileHover={{ y: -4 }}
                    className="group bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                      <Icon name="ArrowRight" className="text-primary -rotate-45 group-hover:rotate-0 transition-transform duration-300" size={32} />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                            {job.department}
                          </span>
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wide">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-primary transition-colors">
                          {job.title?.[language] || job.title?.en}
                        </h3>
                        <div className="flex items-center text-sm font-bold text-slate-500 mb-4 gap-4">
                          <span className="flex items-center"><Icon name="MapPin" size={14} className="mr-1.5"/> {job.location}</span>
                          <span className="flex items-center"><Icon name="Banknote" size={14} className="mr-1.5"/> {job.salary}</span>
                        </div>
                        <p className="text-slate-600 mb-6 font-medium leading-relaxed max-w-2xl">
                          {job.description?.[language] || job.description?.en}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.tags && job.tags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 md:self-center flex-shrink-0">
                        <Button className="w-full md:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                          {language === 'en' ? 'Apply Now' : 'અરજી કરો'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-slate-500">
                  {language === 'en' ? 'No open positions right now.' : 'અત્યારે કોઈ ખુલ્લી પોઝિશન નથી.'}
                </p>
              </div>
            )}
          </div>
        </section>


        {/* 🌟 CTA Section */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-black mb-6">
              {language === 'en' ? 'Don\'t see the right role?' : 'યોગ્ય રોલ દેખાતો નથી?'}
            </h2>
            <p className="text-slate-300 text-lg mb-10 font-medium leading-relaxed">
              {language === 'en'
                  ? 'We are always looking for extraordinary talent. Send us your resume and tell us how you can make a difference.'
                  : 'અમે હંમેશા અસાધારણ પ્રતિભા શોધી રહ્યા છીએ. અમને તમારો રેઝ્યુમે મોકલો અને કહો કે તમે કેવી રીતે અલગ ફેરફાર લાવી શકો છો.'
              }
            </p>
            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-10 rounded-xl text-lg font-bold shadow-xl">
              {language === 'en' ? 'Email Your Resume' : 'તમારો રેઝ્યુમે ઈમેલ કરો'}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;