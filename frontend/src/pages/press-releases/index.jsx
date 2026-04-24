import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import pressReleaseService from '../../utils/pressReleaseService';

const PressReleasesPage = () => {
  const [language, setLanguage] = useState('en');
  const [pressReleases, setPressReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set page title
    document.title = 'Press Releases - AgroLand Portal';

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Get language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Fetch press releases from database
    fetchPressReleases();
  }, []);

  const fetchPressReleases = async () => {
    try {
      setLoading(true);
      const result = await pressReleaseService.getPublishedPressReleases();
      if (result.success) {
        setPressReleases(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching press releases:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'en' ? 'en-US' : 'gu-IN', options);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-muted py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
                {language === 'en' ? 'Press Releases' : 'પ્રેસ રિલીઝ'}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {language === 'en'
                  ? 'Latest news and announcements from AgroLand Portal'
                  : 'AgroLand પોર્ટલ તરફથી તાજેતરના સમાચાર અને જાહેરાતો'
                }
              </p>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="max-w-4xl mx-auto text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  {language === 'en' ? 'Loading press releases...' : 'પ્રેસ રિલીઝ લોડ કરી રહ્યા છીએ...'}
                </p>
              </div>
            ) : pressReleases.length === 0 ? (
              <div className="max-w-4xl mx-auto text-center py-12">
                <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {language === 'en' ? 'No press releases available at the moment.' : 'આ સમયે કોઈ પ્રેસ રિલીઝ ઉપલબ્ધ નથી.'}
                </p>
              </div>
            ) : (
              <div className="space-y-12 max-w-4xl mx-auto">
                {pressReleases.map((press) => (
                  <div key={press.id} className="bg-card rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={press.image_url}
                        alt={language === 'en' ? press.title_en : press.title_gu}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="text-sm text-muted-foreground mb-2">
                        {formatDate(press.published_date)}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">
                        {language === 'en' ? press.title_en : press.title_gu}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {language === 'en' ? press.summary_en : press.summary_gu}
                      </p>
                      <Button variant="link" className="p-0 text-primary hover:text-primary/80">
                        {language === 'en' ? 'Read Full Press Release' : 'સંપૂર્ણ પ્રેસ રિલીઝ વાંચો'}
                        <Icon name="ArrowRight" size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Media Contact */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
                {language === 'en' ? 'Media Contact' : 'મીડિયા સંપર્ક'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === 'en'
                  ? 'For press inquiries, please contact our media relations team:'
                  : 'પ્રેસ પૂછપરછ માટે, કૃપા કરીને અમારી મીડિયા સંબંધ ટીમનો સંપર્ક કરો:'
                }
              </p>

              <div className="bg-card p-8 rounded-lg shadow-sm">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Icon name="Users" className="text-primary" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {language === 'en' ? 'PR & Communications Team' : 'PR અને કોમ્યુનિકેશન્સ ટીમ'}
                  </h3>
                  <div className="space-y-2 mb-6">
                    <p className="flex items-center justify-center">
                      <Icon name="Mail" size={16} className="mr-2 text-muted-foreground" />
                      <a href="mailto:press@agrolandportal.com" className="text-primary hover:underline">press@agrolandportal.com</a>
                    </p>
                    <p className="flex items-center justify-center">
                      <Icon name="Phone" size={16} className="mr-2 text-muted-foreground" />
                      <a href="tel:+917940005001" className="text-primary hover:underline">+91 79 4000 5001</a>
                    </p>
                  </div>
                  <Button variant="outline">
                    {language === 'en' ? 'Schedule a Press Briefing' : 'પ્રેસ બ્રીફિંગ શેડ્યૂલ કરો'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PressReleasesPage;