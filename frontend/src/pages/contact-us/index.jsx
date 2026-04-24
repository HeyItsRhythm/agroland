import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import HeroSection from './components/HeroSection';
import ContactForm from './components/ContactForm';
import ContactInfo from './components/ContactInfo';

const ContactUsPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Set page title
    document.title = language === 'en' ? 'Contact Us - AgroLand Portal' : 'અમારો સંપર્ક કરો - એગ્રોલેન્ડ પોર્ટલ';

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection language={language} />

        {/* Contact Form & Info */}
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-50/30 to-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 max-w-7xl mx-auto">
              <ContactForm language={language} />
              <ContactInfo language={language} />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUsPage;
