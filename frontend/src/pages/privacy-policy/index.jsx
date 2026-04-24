import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const PrivacyPolicy = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/home-landing-page" className="hover:text-foreground transition-micro">
            {language === 'en' ? 'Home' : 'હોમ'}
          </Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium">
            {language === 'en' ? 'Privacy Policy' : 'ગોપનીયતા નીતિ'}
          </span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            {language === 'en' ? 'Privacy Policy' : 'ગોપનીયતા નીતિ'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Last updated: June 15, 2023' : 'છેલ્લે અપડેટ કરેલ: જૂન 15, 2023'}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          {language === 'en' ? (
            <>
              <h2>Introduction</h2>
              <p>
                AgroLand Portal ("we," "our," or "us") respects your privacy and is committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.
              </p>

              <h2>Information We Collect</h2>
              <p>We collect several types of information from and about users of our website, including:</p>
              <ul>
                <li>Personal information such as name, email address, phone number, and location when you register for an account or list a property</li>
                <li>Information about your property when you list it on our platform</li>
                <li>Information about your internet connection, the equipment you use to access our website, and usage details</li>
                <li>Information collected through cookies and other tracking technologies</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use information that we collect about you or that you provide to us:</p>
              <ul>
                <li>To present our website and its contents to you</li>
                <li>To provide you with information, products, or services that you request from us</li>
                <li>To connect buyers and sellers of agricultural land</li>
                <li>To fulfill any other purpose for which you provide it</li>
                <li>To carry out our obligations and enforce our rights</li>
                <li>To notify you about changes to our website or any products or services we offer</li>
                <li>To improve our website and customer service</li>
              </ul>

              <h2>Disclosure of Your Information</h2>
              <p>We may disclose personal information that we collect or you provide:</p>
              <ul>
                <li>To our subsidiaries and affiliates</li>
                <li>To contractors, service providers, and other third parties we use to support our business</li>
                <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of our assets</li>
                <li>To fulfill the purpose for which you provide it</li>
                <li>For any other purpose disclosed by us when you provide the information</li>
                <li>With your consent</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls.
              </p>

              <h2>Your Choices About Our Collection, Use, and Disclosure of Your Information</h2>
              <p>You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies, please note that some parts of this site may then be inaccessible or not function properly.</p>

              <h2>Changes to Our Privacy Policy</h2>
              <p>
                It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the website home page.
              </p>

              <h2>Contact Information</h2>
              <p>
                To ask questions or comment about this privacy policy and our privacy practices, contact us at: <a href="mailto:privacy@agrolandportal.com" className="text-primary hover:text-primary/80">privacy@agrolandportal.com</a>
              </p>
            </>
          ) : (
            <>
              <h2>પરિચય</h2>
              <p>
                AgroLand Portal ("અમે," "અમારું," અથવા "અમને") તમારી ગોપનીયતાનો આદર કરે છે અને આ નીતિના પાલન દ્વારા તેને સુરક્ષિત રાખવા માટે પ્રતિબદ્ધ છે. આ નીતિ તે માહિતીના પ્રકારોનું વર્ણન કરે છે જે અમે તમારી પાસેથી એકત્રિત કરી શકીએ છીએ અથવા જે તમે અમારી વેબસાઇટની મુલાકાત લેતી વખતે પ્રદાન કરી શકો છો અને તે માહિતીને એકત્રિત કરવા, ઉપયોગ કરવા, જાળવવા, સુરક્ષિત કરવા અને જાહેર કરવા માટેની અમારી પ્રથાઓ.
              </p>

              <h2>અમે જે માહિતી એકત્રિત કરીએ છીએ</h2>
              <p>અમે અમારી વેબસાઇટના વપરાશકર્તાઓ પાસેથી અને તેમના વિશે કેટલાક પ્રકારની માહિતી એકત્રિત કરીએ છીએ, જેમાં:</p>
              <ul>
                <li>જ્યારે તમે ખાતા માટે નોંધણી કરો છો અથવા સંપત્તિ સૂચિબદ્ધ કરો છો ત્યારે નામ, ઇમેઇલ સરનામું, ફોન નંબર અને સ્થાન જેવી વ્યક્તિગત માહિતી</li>
                <li>જ્યારે તમે તમારી સંપત્તિને અમારા પ્લેટફોર્મ પર સૂચિબદ્ધ કરો છો ત્યારે તમારી સંપત્તિ વિશેની માહિતી</li>
                <li>તમારા ઇન્ટરનેટ કનેક્શન, અમારી વેબસાઇટને ઍક્સેસ કરવા માટે તમે જે ઉપકરણનો ઉપયોગ કરો છો અને વપરાશની વિગતો વિશેની માહિતી</li>
                <li>કૂકીઝ અને અન્ય ટ્રેકિંગ ટેકનોલોજીઓ દ્વારા એકત્રિત માહિતી</li>
              </ul>

              <h2>અમે તમારી માહિતીનો ઉપયોગ કેવી રીતે કરીએ છીએ</h2>
              <p>અમે તમારા વિશે અથવા તમે અમને પ્રદાન કરો છો તે માહિતીનો ઉપયોગ કરીએ છીએ:</p>
              <ul>
                <li>તમને અમારી વેબસાઇટ અને તેની સામગ્રી રજૂ કરવા માટે</li>
                <li>તમને તે માહિતી, ઉત્પાદનો અથવા સેવાઓ પ્રદાન કરવા માટે જે તમે અમારી પાસેથી વિનંતી કરો છો</li>
                <li>કૃષિ જમીનના ખરીદનારાઓ અને વેચનારાઓને જોડવા માટે</li>
                <li>તમે જે હેતુ માટે પ્રદાન કરો છો તે પૂર્ણ કરવા માટે</li>
                <li>અમારી જવાબદારીઓ પૂર્ણ કરવા અને અમારા અધિકારોનો અમલ કરવા માટે</li>
                <li>તમને અમારી વેબસાઇટ અથવા અમે ઓફર કરતા કોઈપણ ઉત્પાદનો અથવા સેવાઓમાં ફેરફારો વિશે સૂચિત કરવા માટે</li>
                <li>અમારી વેબસાઇટ અને ગ્રાહક સેવાને સુધારવા માટે</li>
              </ul>

              <h2>તમારી માહિતીનું જાહેરાત</h2>
              <p>અમે એકત્રિત કરીએ છીએ અથવા તમે પ્રદાન કરો છો તે વ્યક્તિગત માહિતી જાહેર કરી શકીએ છીએ:</p>
              <ul>
                <li>અમારી પેટાકંપનીઓ અને સંલગ્ન</li>
                <li>કોન્ટ્રાક્ટરો, સેવા પ્રદાતાઓ અને અન્ય ત્રીજા પક્ષો જેનો અમે અમારા વ્યવસાયને સમર્થન આપવા માટે ઉપયોગ કરીએ છીએ</li>
                <li>મર્જર, વિભાજન, પુનર્ગઠન, પુનર્ગઠન, વિસર્જન અથવા અમારી કેટલીક અથવા બધી સંપત્તિના અન્ય વેચાણ અથવા તબદીલીની ઘટનામાં ખરીદનાર અથવા અન્ય ઉત્તરાધિકારીને</li>
                <li>તમે જે હેતુ માટે પ્રદાન કરો છો તે પૂર્ણ કરવા માટે</li>
                <li>તમે માહિતી પ્રદાન કરો ત્યારે અમારા દ્વારા જાહેર કરેલા અન્ય કોઈપણ હેતુ માટે</li>
                <li>તમારી સંમતિ સાથે</li>
              </ul>

              <h2>ડેટા સુરક્ષા</h2>
              <p>
                અમે તમારી વ્યક્તિગત માહિતીને આકસ્મિક નુકસાન અને અનધિકૃત ઍક્સેસ, ઉપયોગ, ફેરફાર અને જાહેરાતથી સુરક્ષિત કરવા માટે ડિઝાઇન કરેલા પગલાં લાગુ કર્યા છે. તમે અમને પ્રદાન કરો છો તે તમામ માહિતી ફાયરવોલ્સની પાછળ સુરક્ષિત સર્વર્સ પર સંગ્રહિત છે.
              </p>

              <h2>તમારી માહિતીના અમારા સંગ્રહ, ઉપયોગ અને જાહેરાત વિશે તમારી પસંદગીઓ</h2>
              <p>તમે તમારા બ્રાઉઝરને તમામ અથવા કેટલાક બ્રાઉઝર કૂકીઝને નકારવા માટે અથવા જ્યારે કૂકીઝ મોકલવામાં આવી રહી હોય ત્યારે તમને સતર્ક કરવા માટે સેટ કરી શકો છો. જો તમે કૂકીઝને અક્ષમ કરો છો અથવા નકારો છો, તો કૃપા કરીને નોંધ કરો કે આ સાઇટના કેટલાક ભાગો પછી અપ્રાપ્ય હોઈ શકે છે અથવા યોગ્ય રીતે કાર્ય કરી શકતા નથી.</p>

              <h2>અમારી ગોપનીયતા નીતિમાં ફેરફારો</h2>
              <p>
                અમારી ગોપનીયતા નીતિમાં અમે કરેલા કોઈપણ ફેરફારોને આ પૃષ્ઠ પર પોસ્ટ કરવાની અમારી નીતિ છે. જો અમે અમારા વપરાશકર્તાઓની વ્યક્તિગત માહિતી સાથે કેવી રીતે વર્તીએ છીએ તેમાં ભૌતિક ફેરફારો કરીએ છીએ, તો અમે તમને વેબસાઇટ હોમ પેજ પર નોટિસ દ્વારા સૂચિત કરીશું.
              </p>

              <h2>સંપર્ક માહિતી</h2>
              <p>
                આ ગોપનીયતા નીતિ અને અમારી ગોપનીયતા પ્રથાઓ વિશે પ્રશ્નો પૂછવા અથવા ટિપ્પણી કરવા માટે, અમારો સંપર્ક કરો: <a href="mailto:privacy@agrolandportal.com" className="text-primary hover:text-primary/80">privacy@agrolandportal.com</a>
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;