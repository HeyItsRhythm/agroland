import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Footer from '../home-landing-page/components/Footer';
import Header from '../../components/ui/Header';
import LegalContactForm from './components/LegalContactForm';

const LegalSupport = () => {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('services');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const legalServices = [
    {
      id: 'document-verification',
      icon: 'FileCheck',
      title: language === 'en' ? 'Document Verification' : 'દસ્તાવેજ ચકાસણી',
      description: language === 'en' 
        ? 'Our legal experts verify property documents to ensure they are legally valid and free from encumbrances.'
        : 'અમારા કાનૂની નિષ્ણાતો મિલકત દસ્તાવેજોની ચકાસણી કરે છે જેથી તેઓ કાનૂની રીતે માન્ય છે અને ભારણથી મુક્ત છે.'
    },
    {
      id: 'title-search',
      icon: 'Search',
      title: language === 'en' ? 'Title Search' : 'શીર્ષક શોધ',
      description: language === 'en'
        ? 'Comprehensive title search to verify ownership history and identify any potential legal issues.'
        : 'માલિકીના ઇતિહાસની ચકાસણી કરવા અને કોઈપણ સંભવિત કાનૂની સમસ્યાઓને ઓળખવા માટે વ્યાપક શીર્ષક શોધ.'
    },
    {
      id: 'legal-consultation',
      icon: 'Users',
      title: language === 'en' ? 'Legal Consultation' : 'કાનૂની પરામર્શ',
      description: language === 'en'
        ? 'One-on-one consultation with experienced agricultural property lawyers to address your specific concerns.'
        : 'તમારી ચોક્કસ ચિંતાઓને સંબોધવા માટે અનુભવી કૃષિ મિલકત વકીલો સાથે વન-ઓન-વન પરામર્શ.'
    },
    {
      id: 'contract-review',
      icon: 'FileText',
      title: language === 'en' ? 'Contract Review' : 'કરાર સમીક્ષા',
      description: language === 'en'
        ? 'Expert review of sale agreements, lease contracts, and other legal documents related to agricultural land.'
        : 'વેચાણ કરાર, લીઝ કરાર અને કૃષિ જમીન સંબંધિત અન્ય કાનૂની દસ્તાવેજોની નિષ્ણાત સમીક્ષા.'
    },
    {
      id: 'dispute-resolution',
      icon: 'Shield',
      title: language === 'en' ? 'Dispute Resolution' : 'વિવાદ નિરાકરણ',
      description: language === 'en'
        ? 'Assistance with resolving property disputes through mediation, arbitration, or legal proceedings.'
        : 'મધ્યસ્થી, લવાદ અથવા કાનૂની કાર્યવાહી દ્વારા મિલકત વિવાદોના નિરાકરણમાં સહાય.'
    },
    {
      id: 'compliance-assistance',
      icon: 'CheckCircle',
      title: language === 'en' ? 'Compliance Assistance' : 'અનુપાલન સહાય',
      description: language === 'en'
        ? 'Guidance on regulatory compliance related to agricultural land ownership, use, and transactions.'
        : 'કૃષિ જમીનની માલિકી, ઉપયોગ અને વ્યવહારો સંબંધિત નિયમનકારી અનુપાલન પર માર્ગદર્શન.'
    }
  ];

  const legalResources = [
    {
      id: 'guides',
      icon: 'BookOpen',
      title: language === 'en' ? 'Legal Guides' : 'કાનૂની માર્ગદર્શિકાઓ',
      description: language === 'en'
        ? 'Comprehensive guides on various legal aspects of agricultural land transactions in Gujarat.'
        : 'ગુજરાતમાં કૃષિ જમીનના વ્યવહારોના વિવિધ કાનૂની પાસાઓ પર વ્યાપક માર્ગદર્શિકાઓ.'
    },
    {
      id: 'templates',
      icon: 'FileText',
      title: language === 'en' ? 'Document Templates' : 'દસ્તાવેજ ટેમ્પલેટ્સ',
      description: language === 'en'
        ? 'Standard templates for common legal documents with guidance on customization.'
        : 'કસ્ટમાઇઝેશન પર માર્ગદર્શન સાથે સામાન્ય કાનૂની દસ્તાવેજો માટે માનક ટેમ્પલેટ્સ.'
    },
    {
      id: 'faq',
      icon: 'HelpCircle',
      title: language === 'en' ? 'Legal FAQs' : 'કાનૂની FAQs',
      description: language === 'en'
        ? 'Answers to frequently asked legal questions about agricultural land ownership and transactions.'
        : 'કૃષિ જમીનની માલિકી અને વ્યવહારો વિશે વારંવાર પૂછાતા કાનૂની પ્રશ્નોના જવાબો.'
    },
    {
      id: 'regulations',
      icon: 'Bookmark',
      title: language === 'en' ? 'Regulations Library' : 'નિયમન લાઇબ્રેરી',
      description: language === 'en'
        ? 'Collection of relevant laws, regulations, and government notifications related to agricultural land.'
        : 'કૃષિ જમીન સંબંધિત સંબંધિત કાયદા, નિયમો અને સરકારી સૂચનાઓનો સંગ્રહ.'
    }
  ];

  const legalPartners = [
    {
      name: 'Patel & Associates',
      specialty: language === 'en' ? 'Agricultural Property Law' : 'કૃષિ મિલકત કાયદો',
      location: language === 'en' ? 'Ahmedabad, Gujarat' : 'અમદાવાદ, ગુજરાત',
      rating: 4.9,
      reviews: 127
    },
    {
      name: 'Shah Legal Consultants',
      specialty: language === 'en' ? 'Land Dispute Resolution' : 'જમીન વિવાદ નિરાકરણ',
      location: language === 'en' ? 'Vadodara, Gujarat' : 'વડોદરા, ગુજરાત',
      rating: 4.8,
      reviews: 93
    },
    {
      name: 'Gujarat Land Law Experts',
      specialty: language === 'en' ? 'Rural Property Transactions' : 'ગ્રામીણ મિલકત વ્યવહારો',
      location: language === 'en' ? 'Rajkot, Gujarat' : 'રાજકોટ, ગુજરાત',
      rating: 4.7,
      reviews: 85
    },
    {
      name: 'Mehta & Mehta LLP',
      specialty: language === 'en' ? 'Agricultural Compliance' : 'કૃષિ અનુપાલન',
      location: language === 'en' ? 'Surat, Gujarat' : 'સુરત, ગુજરાત',
      rating: 4.8,
      reviews: 112
    }
  ];

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Legal Support - AgroLand Portal' : 'કાનૂની સહાય - એગ્રોલેન્ડ પોર્ટલ'}
        </title>
        <meta
          name="description"
          content={language === 'en' ? 'Legal support services for agricultural land transactions in Gujarat. Document verification, title search, legal consultation, and more.' : 'ગુજરાતમાં કૃષિ જમીનના વ્યવહારો માટે કાનૂની સહાય સેવાઓ. દસ્તાવેજ ચકાસણી, શીર્ષક શોધ, કાનૂની પરામર્શ, અને વધુ.'}
        />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-white border-b border-border pt-20 pb-28">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
               <div className="absolute -top-[15%] -right-[10%] w-[50%] h-[70%] rounded-full bg-primary/5 blur-3xl opacity-60"></div>
               <div className="absolute top-[30%] -left-[10%] w-[40%] h-[60%] rounded-full bg-secondary/5 blur-3xl opacity-40"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-center"
              >
                <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 uppercase tracking-[0.1em]">
                  <Icon name="Scale" size={16} />
                  <span>{language === 'en' ? 'Professional Legal Services' : 'વ્યાવસાયિક કાનૂની સેવાઓ'}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black mb-8 text-foreground leading-[1.1] tracking-tight">
                  {language === 'en' ? 'Legal Support Services' : 'કાનૂની સહાય સેવાઓ'}
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                  {language === 'en' 
                    ? 'Expert legal assistance for secure, transparent, and fully compliant agricultural land transactions across Gujarat.'
                    : 'સમગ્ર ગુજરાતમાં સુરક્ષિત, પારદર્શક અને સંપૂર્ણ સુસંગત કૃષિ જમીન વ્યવહારો માટે નિષ્ણાત કાનૂની સહાય.'
                  }
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="xl" className="rounded-2xl px-10 shadow-xl shadow-primary/20">
                      <Icon name="Calendar" className="mr-3" size={20} />
                      {language === 'en' ? 'Schedule Consultation' : 'પરામર્શ શેડ્યૂલ કરો'}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="xl" className="rounded-2xl px-10 border-2">
                      <Icon name="Phone" className="mr-3" size={20} />
                      {language === 'en' ? 'Call Legal Team' : 'કાનૂની ટીમને કૉલ કરો'}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Tabs Navigation Refined */}
          <section className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
            <div className="container mx-auto px-4">
              <div className="flex justify-center space-x-2 md:space-x-8">
                {[
                  { id: 'services', en: 'Legal Services', gu: 'કાનૂની સેવાઓ', icon: 'ShieldCheck' },
                  { id: 'resources', en: 'Legal Resources', gu: 'કાનૂની સંસાધનો', icon: 'BookOpen' },
                  { id: 'partners', en: 'Legal Partners', gu: 'કાનૂની ભાગીદારો', icon: 'Users' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`group relative px-6 py-6 font-bold text-sm md:text-base whitespace-nowrap transition-all flex items-center space-x-2 ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon name={tab.icon} size={18} className={activeTab === tab.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary transition-colors'} />
                    <span>{language === 'en' ? tab.en : tab.gu}</span>
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Tab Content */}
          <section className="py-24">
            <div className="container mx-auto px-4">
              <AnimatePresence mode="wait">
                {/* Legal Services Tab */}
                {activeTab === 'services' && (
                  <motion.div 
                    key="services"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="max-w-4xl mx-auto mb-16 text-center">
                      <h2 className="text-3xl md:text-4xl font-heading font-black mb-6">
                        {language === 'en' ? 'Professional Legal Solutions' : 'વ્યાવસાયિક કાનૂની ઉકેલો'}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {language === 'en'
                          ? 'AgroLand Portal provides end-to-end legal support to safeguard your property investments and ensure hassle-free ownership transfers.'
                          : 'એગ્રોલેન્ડ પોર્ટલ તમારા મિલકત રોકાણોને સુરક્ષિત રાખવા અને ઝંઝટ-મુક્ત માલિકી ટ્રાન્સફર સુનિશ્ચિત કરવા માટે એન્ડ-ટુ-એન્ડ કાનૂની સહાય પૂરી પાડે છે.'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {legalServices.map((service, idx) => (
                        <motion.div 
                          key={service.id} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white border border-border rounded-[32px] p-8 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group"
                        >
                          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                            <Icon name={service.icon} size={28} className="text-primary" />
                          </div>
                          <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                          <p className="text-muted-foreground leading-relaxed mb-8">{service.description}</p>
                          <Link to={`/legal-support/services/${service.id}`} className="inline-flex items-center text-primary font-bold hover:translate-x-1 transition-transform">
                            {language === 'en' ? 'Explore details' : 'વિગતો શોધો'}
                            <Icon name="ArrowRight" size={18} className="ml-2" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div 
                      className="max-w-5xl mx-auto mt-20 bg-gradient-to-br from-primary to-primary/90 rounded-[40px] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden"
                    >
                      {/* Decorative background for card */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                      
                      <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[32px] flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                          <Icon name="Scale" size={48} className="text-white" />
                        </div>
                        <div className="text-center lg:text-left">
                          <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                            {language === 'en' ? 'Need a Custom Legal Strategy?' : 'કસ્ટમ કાનૂની વ્યૂહરચનાની જરૂર છે?'}
                          </h3>
                          <p className="text-white/80 text-lg mb-8 leading-relaxed max-w-2xl">
                            {language === 'en'
                              ? 'Our senior legal advisors can design bespoke frameworks for large-scale agricultural acquisitions and complex ownership structures.'
                              : 'અમારા વરિષ્ઠ કાનૂની સલાહકારો મોટા પાયે કૃષિ સંપાદન અને જટિલ માલિકીના માળખા માટે અનુરૂપ ફ્રેમવર્ક ડિઝાઇન કરી શકે છે.'
                            }
                          </p>
                          <Button variant="outline" className="bg-white text-primary hover:bg-white/90 border-transparent rounded-2xl px-10 py-7 text-lg font-bold">
                            {language === 'en' ? 'Speak with an Expert' : 'નિષ્ણાત સાથે વાત કરો'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Legal Resources Tab */}
                {activeTab === 'resources' && (
                  <motion.div 
                    key="resources"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="max-w-4xl mx-auto mb-16 text-center">
                      <h2 className="text-3xl md:text-4xl font-heading font-black mb-6">
                        {language === 'en' ? 'Legal Resources' : 'કાનૂની સંસાધનો'}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {language === 'en'
                          ? 'Access our comprehensive collection of legal resources to help you understand the legal aspects of agricultural land transactions in Gujarat.'
                          : 'ગુજરાતમાં કૃષિ જમીન વ્યવહારોના કાનૂની પાસાઓને સમજવામાં મદદ કરવા માટે અમારા વ્યાપક કાનૂની સંસાધનોના સંગ્રહને ઍક્સેસ કરો.'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                      {legalResources.map((resource) => (
                        <motion.div 
                          key={resource.id} 
                          whileHover={{ y: -5 }}
                          className="bg-white border border-border rounded-[32px] p-8 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <Icon name={resource.icon} size={24} className="text-primary" />
                          </div>
                          <h3 className="text-xl font-bold mb-3">{resource.title}</h3>
                          <p className="text-muted-foreground mb-6 leading-relaxed">{resource.description}</p>
                          <Link to={`/legal-support/resources/${resource.id}`} className="inline-flex items-center text-primary font-bold">
                            {language === 'en' ? 'Browse Resources' : 'સંસાધનો બ્રાઉઝ કરો'}
                            <Icon name="ChevronRight" size={18} className="ml-1" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    <div className="max-w-5xl mx-auto bg-muted/30 border border-border rounded-[40px] p-10 md:p-12">
                      <h3 className="text-2xl font-bold mb-8 text-center">
                        {language === 'en' ? 'Popular Legal Articles' : 'લોકપ્રિય કાનૂની લેખો'}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { url: "/legal-support/articles/agricultural-land-ownership-laws", titleEn: "Agricultural Land Ownership Laws in Gujarat", titleGu: "ગુજરાતમાં કૃષિ જમીન માલિકીના કાયદાઓ", date: "June 15, 2023" },
                          { url: "/legal-support/articles/land-transaction-documentation", titleEn: "Essential Documentation Checklist", titleGu: "આવશ્યક દસ્તાવેજીકરણ ચેકલિસ્ટ", date: "August 22, 2023" },
                          { url: "/legal-support/articles/dispute-resolution-guide", titleEn: "Land Dispute Resolution Guide", titleGu: "જમીન વિવાદ નિરાકરણ માર્ગદર્શિકા", date: "Oct 05, 2023" },
                          { url: "/legal-support/articles/legal-compliance-checklist", titleEn: "Buyer Compliance Standards", titleGu: "ખરીદનાર અનુપાલન ધોરણો", date: "Dec 12, 2023" }
                        ].map((article, idx) => (
                          <Link key={idx} to={article.url} className="bg-white p-6 rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all group">
                            <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                              {language === 'en' ? article.titleEn : article.titleGu}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {language === 'en' ? `Published: ${article.date}` : `પ્રકાશિત: ${article.date}`}
                            </p>
                          </Link>
                        ))}
                      </div>
                      <div className="text-center mt-10">
                        <Button variant="outline" className="rounded-xl px-8">
                          {language === 'en' ? 'View All Articles' : 'બધા લેખો જુઓ'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Legal Partners Tab */}
                {activeTab === 'partners' && (
                  <motion.div 
                    key="partners"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="max-w-4xl mx-auto mb-16 text-center">
                      <h2 className="text-3xl md:text-4xl font-heading font-black mb-6">
                        {language === 'en' ? 'Trusted Legal Network' : 'વિશ્વસનીય કાનૂની નેટવર્ક'}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {language === 'en'
                          ? 'We partner with the regions most respected legal minds to provide localized expertise and institutional-grade legal security.'
                          : 'અમે સ્થાનિક નિપુણતા અને સંસ્થાકીય-ગ્રેડ કાનૂની સુરક્ષા પ્રદાન કરવા માટે પ્રદેશના સૌથી પ્રતિષ્ઠિત કાનૂની દિગ્ગજો સાથે ભાગીદારી કરીએ છીએ.'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                      {legalPartners.map((partner, index) => (
                        <motion.div 
                          key={index} 
                          whileHover={{ y: -5 }}
                          className="bg-white border border-border rounded-[32px] p-8 hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start gap-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-[24px] flex items-center justify-center flex-shrink-0">
                              <Icon name="UserCheck" size={32} className="text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-1">{partner.name}</h3>
                              <p className="text-primary font-bold text-sm mb-3">{partner.specialty}</p>
                              <div className="flex items-center text-sm text-muted-foreground mb-4">
                                <Icon name="MapPin" size={14} className="mr-2" />
                                {partner.location}
                              </div>
                              <div className="flex items-center mb-6">
                                <div className="flex mr-3">
                                  {[...Array(5)].map((_, i) => (
                                    <Icon 
                                      key={i} 
                                      name="Star" 
                                      size={16} 
                                      className={i < Math.floor(partner.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-bold">{partner.rating} <span className="text-muted-foreground font-medium">({partner.reviews} {language === 'en' ? 'reviews' : 'સમીક્ષાઓ'})</span></span>
                              </div>
                              <Button variant="outline" size="sm" className="rounded-xl w-full border-2">
                                {language === 'en' ? 'View Profile' : 'પ્રોફાઇલ જુઓ'}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/10 rounded-[40px] p-10 text-center">
                      <h3 className="text-2xl font-bold mb-4">
                        {language === 'en' ? 'Are You a Legal Professional?' : 'શું તમે કાનૂની વ્યાવસાયિક છો?'}
                      </h3>
                      <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                        {language === 'en'
                          ? 'Join our network of elite legal partners and help shape the future of agricultural land transparency in Gujarat.'
                          : 'અમારા ભદ્ર કાનૂની ભાગીદારોના નેટવર્કમાં જોડાઓ અને ગુજરાતમાં કૃષિ જમીનની પારદર્શિતાના ભવિષ્યને આકાર આપવામાં મદદ કરો.'
                        }
                      </p>
                      <Button className="rounded-xl px-10 py-6 font-bold shadow-lg shadow-primary/10">
                        {language === 'en' ? 'Apply to Partner Program' : 'ભાગીદાર કાર્યક્રમ માટે અરજી કરો'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Contact Form Section Refined */}
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
               <div className="absolute bottom-[10%] -right-[5%] w-[30%] h-[40%] bg-primary/5 blur-3xl rounded-full"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                  <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-6">
                    <Icon name="MessageSquare" size={32} className="text-primary" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-heading font-black mb-6">
                    {language === 'en' ? 'Get Direct Legal Help' : 'સીધી કાનૂની સહાય મેળવો'}
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {language === 'en'
                      ? 'Submit your case details and our specialized legal response unit will analyze your requirements and get back within one business day.'
                      : 'તમારા કેસની વિગતો સબમિટ કરો અને અમારા વિશિષ્ટ કાનૂની પ્રતિભાવ યુનિટ તમારી જરૂરિયાતોનું વિશ્લેષણ કરશે અને એક વ્યવસાયિક દિવસમાં પાછા આવશે.'
                    }
                  </p>
                </div>
                
                <LegalContactForm language={language} />
              </div>
            </div>
          </section>
          
          {/* CTA Section */}
          <section className="bg-primary/5 border-t border-border py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
                  {language === 'en' ? 'Need Immediate Assistance?' : 'તાત્કાલિક સહાયની જરૂર છે?'}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {language === 'en'
                    ? 'For urgent legal matters, you can reach out to our team directly.'
                    : 'તાત્કાલિક કાનૂની બાબતો માટે, તમે સીધા અમારી ટીમનો સંપર્ક કરી શકો છો.'
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    <Icon name="Calendar" className="mr-2" size={18} />
                    {language === 'en' ? 'Schedule Consultation' : 'પરામર્શ શેડ્યૂલ કરો'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Icon name="Phone" className="mr-2" size={18} />
                    {language === 'en' ? 'Call: +91 98765 43210' : 'કૉલ: +91 98765 43210'}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default LegalSupport;