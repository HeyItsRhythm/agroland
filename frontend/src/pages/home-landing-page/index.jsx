import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturedProperties from './components/FeaturedProperties';
import SEOContentSection from './components/SEOContentSection';
import TrustSignalsSection from './components/TrustSignalsSection';
import CallToActionSection from './components/CallToActionSection';
import Footer from './components/Footer';
import { Helmet } from 'react-helmet';

const HomeLandingPage = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Set page title
    document.title = 'Agriculture Land for Sale in Gujarat | Buy & Sell Farm Land | AgroLand';

    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background" key={language}>
      {/* Header */}
      <Header />

      <Helmet>
        <title>{language === 'en' ? 'Agriculture Land for Sale in Gujarat | Buy & Sell Farm Land | AgroLand' : 'ગુજરાતમાં કૃષિ જમીન વેચાણ | જમીન ખરીદો વેચો | એગ્રોલેન્ડ'}</title>
        <meta name="description" content={language === 'en' ? "AgroLand Gujarat - #1 marketplace for agriculture land for sale in Gujarat. Buy verified farmland, agricultural plots & premium farm properties across all districts." : "એગ્રોલેન્ડ ગુજરાત - ગુજરાતમાં કૃષિ જમીન વેચાણ માટેનું શ્રેષ્ઠ માર્કેટપ્લેસ. સમગ્ર ગુજરાતમાં ચકાસાયેલ ખેતની જમીન ખરીદો અને વેચો."} />
        <link rel="canonical" href="https://agrolandgujarat.in/" />
      </Helmet>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Properties */}
        <FeaturedProperties />

        {/* SEO Content Section */}
        <SEOContentSection />

        {/* Trust Signals */}
        <TrustSignalsSection />

        {/* Call to Action */}
        <CallToActionSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeLandingPage;