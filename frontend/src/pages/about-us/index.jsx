import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import HeroSection from './components/HeroSection';
import MissionVisionSection from './components/MissionVisionSection';
import CompanyStorySection from './components/CompanyStorySection';
import TeamSection from './components/TeamSection';
import ValuesSection from './components/ValuesSection';
import CallToActionSection from './components/CallToActionSection';

import { useLanguage } from '../../contexts/LanguageContext';

const AboutUsPage = () => {
  const { language } = useLanguage();
  
  // Import translations locally or determine them based on state
  // ideally we import them at top level content
  
  useEffect(() => {
    // Set page title
    document.title = language === 'en' ? 'About Us - AgroLand Portal' : 'અમારા વિશે - એગ્રોલેન્ડ પોર્ટલ';

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [language]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection language={language} />

        {/* Mission & Vision */}
        <MissionVisionSection language={language} />

        {/* Company Story */}
        <CompanyStorySection language={language} />

        {/* Team Section */}
        {/* <TeamSection language={language} /> */}

        {/* Values Section */}
        <ValuesSection language={language} />

        {/* Call to Action */}
        <CallToActionSection language={language} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUsPage;