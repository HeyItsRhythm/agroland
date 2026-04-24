import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const CookiePolicy = () => {
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
            {language === 'en' ? 'Cookie Policy' : 'કૂકી પોલિસી'}
          </span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            {language === 'en' ? 'Cookie Policy' : 'કૂકી પોલિસી'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Last updated: June 15, 2023' : 'છેલ્લે અપડેટ કરેલ: જૂન 15, 2023'}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          {language === 'en' ? (
            <>
              <h2>What Are Cookies</h2>
              <p>
                As is common practice with almost all professional websites, AgroLand Portal uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored, however, this may downgrade or 'break' certain elements of the site's functionality.
              </p>

              <h2>How We Use Cookies</h2>
              <p>
                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
              </p>

              <h2>Disabling Cookies</h2>
              <p>
                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.
              </p>

              <h2>The Cookies We Set</h2>
              <ul>
                <li>
                  <strong>Account related cookies</strong>
                  <p>
                    If you create an account with us then we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out, however in some cases they may remain afterward to remember your site preferences when logged out.
                  </p>
                </li>

                <li>
                  <strong>Login related cookies</strong>
                  <p>
                    We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
                  </p>
                </li>

                <li>
                  <strong>Forms related cookies</strong>
                  <p>
                    When you submit data to through a form such as those found on contact pages or comment forms cookies may be set to remember your user details for future correspondence.
                  </p>
                </li>

                <li>
                  <strong>Site preferences cookies</strong>
                  <p>
                    In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences, we need to set cookies so that this information can be called whenever you interact with a page that is affected by your preferences.
                  </p>
                </li>
              </ul>

              <h2>Third Party Cookies</h2>
              <p>
                In some special cases, we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
              </p>
              <ul>
                <li>
                  <p>
                    This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
                  </p>
                  <p>
                    For more information on Google Analytics cookies, see the official Google Analytics page.
                  </p>
                </li>

                <li>
                  <p>
                    From time to time we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features, these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimizations our users appreciate the most.
                  </p>
                </li>

                <li>
                  <p>
                    We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work, the social media sites will set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.
                  </p>
                </li>
              </ul>

              <h2>More Information</h2>
              <p>
                Hopefully, that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
              </p>
              <p>
                However, if you are still looking for more information, you can contact us through one of our preferred contact methods:
              </p>
              <ul>
                <li>Email: <a href="mailto:privacy@agrolandportal.com" className="text-primary hover:text-primary/80">privacy@agrolandportal.com</a></li>
                <li>By visiting this link: <Link to="/contact-us" className="text-primary hover:text-primary/80">Contact Us</Link></li>
              </ul>
            </>
          ) : (
            <>
              <h2>કૂકીઝ શું છે</h2>
              <p>
                લગભગ બધા વ્યાવસાયિક વેબસાઇટ્સ સાથે સામાન્ય પ્રથા તરીકે, AgroLand Portal કૂકીઝનો ઉપયોગ કરે છે, જે નાના ફાઇલો છે જે તમારા અનુભવને સુધારવા માટે તમારા કમ્પ્યુટર પર ડાઉનલોડ થાય છે. આ પૃષ્ઠ વર્ણવે છે કે તેઓ કઈ માહિતી એકત્રિત કરે છે, અમે તેનો કેવી રીતે ઉપયોગ કરીએ છીએ, અને શા માટે અમને ક્યારેક આ કૂકીઝ સંગ્રહિત કરવાની જરૂર પડે છે. અમે એ પણ શેર કરીશું કે તમે આ કૂકીઝને સંગ્રહિત થતા કેવી રીતે અટકાવી શકો છો, જો કે, આ સાઇટની કાર્યક્ષમતાના ચોક્કસ તત્વોને ડાઉનગ્રેડ અથવા 'તોડી' શકે છે.
              </p>

              <h2>અમે કૂકીઝનો ઉપયોગ કેવી રીતે કરીએ છીએ</h2>
              <p>
                અમે નીચે વિગતવાર વિવિધ કારણોસર કૂકીઝનો ઉપયોગ કરીએ છીએ. દુર્ભાગ્યે, મોટાભાગના કિસ્સાઓમાં, આ સાઇટમાં તેઓ ઉમેરતા કાર્યક્ષમતા અને સુવિધાઓને સંપૂર્ણપણે અક્ષમ કર્યા વિના કૂકીઝને અક્ષમ કરવા માટે કોઈ ઉદ્યોગ માનક વિકલ્પો નથી. જો તમને ખાતરી નથી કે તમને તેમની જરૂર છે કે નહીં તો તમે તમામ કૂકીઝ ચાલુ રાખો તે ભલામણ કરવામાં આવે છે, કારણ કે તેઓ તમે ઉપયોગ કરો છો તેવી સેવા પ્રદાન કરવા માટે ઉપયોગમાં લેવામાં આવી શકે છે.
              </p>

              <h2>કૂકીઝને અક્ષમ કરવી</h2>
              <p>
                તમે તમારા બ્રાઉઝર પર સેટિંગ્સને સમાયોજિત કરીને કૂકીઝની સેટિંગને અટકાવી શકો છો (આ કેવી રીતે કરવું તે માટે તમારા બ્રાઉઝર હેલ્પ જુઓ). એ વાતથી અવગત રહો કે કૂકીઝને અક્ષમ કરવાથી આ અને અન્ય ઘણી વેબસાઇટ્સની કાર્યક્ષમતા પર અસર પડશે જે તમે મુલાકાત લો છો. કૂકીઝને અક્ષમ કરવાથી સામાન્ય રીતે આ સાઇટની ચોક્કસ કાર્યક્ષમતા અને સુવિધાઓને પણ અક્ષમ કરવામાં આવશે. તેથી એવી ભલામણ કરવામાં આવે છે કે તમે કૂકીઝને અક્ષમ ન કરો.
              </p>

              <h2>અમે જે કૂકીઝ સેટ કરીએ છીએ</h2>
              <ul>
                <li>
                  <strong>ખાતા સંબંધિત કૂકીઝ</strong>
                  <p>
                    જો તમે અમારી સાથે ખાતું બનાવો છો, તો અમે સાઇનઅપ પ્રક્રિયા અને સામાન્ય વહીવટ માટે કૂકીઝનો ઉપયોગ કરીશું. આ કૂકીઝ સામાન્ય રીતે તમે લોગ આઉટ કરો ત્યારે કાઢી નાખવામાં આવશે, જો કે કેટલાક કિસ્સાઓમાં તેઓ લોગ આઉટ થયા પછી તમારી સાઇટ પસંદગીઓને યાદ રાખવા માટે રહી શકે છે.
                  </p>
                </li>

                <li>
                  <strong>લોગિન સંબંધિત કૂકીઝ</strong>
                  <p>
                    જ્યારે તમે લોગ ઇન થાઓ છો ત્યારે અમે કૂકીઝનો ઉપયોગ કરીએ છીએ જેથી અમે આ હકીકતને યાદ રાખી શકીએ. આ તમને દરેક વખતે નવું પૃષ્ઠ મુલાકાત લો ત્યારે લોગ ઇન કરવાથી અટકાવે છે. આ કૂકીઝ સામાન્ય રીતે તમે લોગ આઉટ કરો ત્યારે દૂર કરવામાં આવે છે અથવા સાફ કરવામાં આવે છે, જેથી તમે માત્ર લોગ ઇન થયા હોય ત્યારે જ પ્રતિબંધિત સુવિધાઓ અને વિસ્તારોને ઍક્સેસ કરી શકો છો.
                  </p>
                </li>

                <li>
                  <strong>ફોર્મ્સ સંબંધિત કૂકીઝ</strong>
                  <p>
                    જ્યારે તમે સંપર્ક પૃષ્ઠો અથવા ટિપ્પણી ફોર્મ્સ પર મળેલા જેવા ફોર્મ દ્વારા ડેટા સબમિટ કરો છો, ત્યારે ભવિષ્યના પત્રવ્યવહાર માટે તમારી વપરાશકર્તા વિગતોને યાદ રાખવા માટે કૂકીઝ સેટ કરવામાં આવી શકે છે.
                  </p>
                </li>

                <li>
                  <strong>સાઇટ પસંદગીઓ કૂકીઝ</strong>
                  <p>
                    આ સાઇટ પર તમને શ્રેષ્ઠ અનુભવ પ્રદાન કરવા માટે, અમે તમને આ સાઇટ કેવી રીતે ચાલે છે તે માટે તમારી પસંદગીઓ સેટ કરવાની કાર્યક્ષમતા પ્રદાન કરીએ છીએ. તમારી પસંદગીઓને યાદ રાખવા માટે, અમારે કૂકીઝ સેટ કરવાની જરૂર છે જેથી જ્યારે તમે તમારી પસંદગીઓથી અસર પામતા પૃષ્ઠ સાથે ક્રિયાપ્રતિક્રિયા કરો ત્યારે આ માહિતીને કોલ કરી શકાય.
                  </p>
                </li>
              </ul>

              <h2>થર્ડ પાર્ટી કૂકીઝ</h2>
              <p>
                કેટલાક ખાસ કિસ્સાઓમાં, અમે વિશ્વસનીય થર્ડ પાર્ટીઓ દ્વારા પ્રદાન કરવામાં આવતી કૂકીઝનો પણ ઉપયોગ કરીએ છીએ. નીચેનો વિભાગ વિગતવાર જણાવે છે કે આ સાઇટ દ્વારા તમે કઈ થર્ડ પાર્ટી કૂકીઝનો સામનો કરી શકો છો.
              </p>
              <ul>
                <li>
                  <p>
                    આ સાઇટ Google Analytics નો ઉપયોગ કરે છે જે વેબ પર સૌથી વ્યાપક અને વિશ્વસનીય એનાલિટિક્સ સોલ્યુશન્સમાંનું એક છે જે અમને તમે સાઇટનો ઉપયોગ કેવી રીતે કરો છો અને અમે તમારા અનુભવને કેવી રીતે સુધારી શકીએ તે સમજવામાં મદદ કરે છે. આ કૂકીઝ એવી વસ્તુઓને ટ્રૅક કરી શકે છે જેમ કે તમે સાઇટ પર કેટલો સમય વિતાવો છો અને તમે મુલાકાત લો છો તે પૃષ્ઠો જેથી અમે આકર્ષક સામગ્રી ઉત્પન્ન કરવાનું ચાલુ રાખી શકીએ.
                  </p>
                  <p>
                    Google Analytics કૂકીઝ પર વધુ માહિતી માટે, અધિકૃત Google Analytics પૃષ્ઠ જુઓ.
                  </p>
                </li>

                <li>
                  <p>
                    સમયાંતરે અમે નવી સુવિધાઓનું પરીક્ષણ કરીએ છીએ અને સાઇટ કેવી રીતે પહોંચાડવામાં આવે છે તેમાં સૂક્ષ્મ ફેરફારો કરીએ છીએ. જ્યારે અમે હજી પણ નવી સુવિધાઓનું પરીક્ષણ કરી રહ્યા છીએ, ત્યારે આ કૂકીઝનો ઉપયોગ એ સુનિશ્ચિત કરવા માટે કરવામાં આવી શકે છે કે તમે સાઇટ પર સુસંગત અનુભવ મેળવો છો, જ્યારે એ સુનિશ્ચિત કરીએ છીએ કે અમારા વપરાશકર્તાઓ કયા ઓપ્ટિમાઇઝેશનની સૌથી વધુ કદર કરે છે તે અમે સમજીએ છીએ.
                  </p>
                </li>

                <li>
                  <p>
                    અમે આ સાઇટ પર સોશિયલ મીડિયા બટનો અને/અથવા પ્લગઇન્સનો પણ ઉપયોગ કરીએ છીએ જે તમને વિવિધ રીતે તમારા સોશિયલ નેટવર્ક સાથે જોડાવાની મંજૂરી આપે છે. આ કામ કરવા માટે, સોશિયલ મીડિયા સાઇટ્સ અમારી સાઇટ દ્વારા કૂકીઝ સેટ કરશે જેનો ઉપયોગ તેમની સાઇટ પર તમારી પ્રોફાઇલને વધારવા માટે અથવા તેમની સંબંધિત ગોપનીયતા નીતિઓમાં દર્શાવેલ વિવિધ હેતુઓ માટે તેઓ ધરાવતા ડેટામાં યોગદાન આપવા માટે કરી શકાય છે.
                  </p>
                </li>
              </ul>

              <h2>વધુ માહિતી</h2>
              <p>
                આશા છે કે તે તમારા માટે વસ્તુઓને સ્પષ્ટ કરી છે અને જેમ અગાઉ ઉલ્લેખ કરવામાં આવ્યો હતો, જો એવું કંઈક છે જેની તમને ખાતરી નથી કે તમારે તેની જરૂર છે કે નહીં, તો સામાન્ય રીતે કૂકીઝને સક્ષમ રાખવું વધુ સુરક્ષિત છે, કારણ કે તે અમારી સાઇટ પર તમે ઉપયોગ કરો છો તે સુવિધાઓમાંની એક સાથે ક્રિયાપ્રતિક્રિયા કરી શકે છે.
              </p>
              <p>
                જો કે, જો તમે હજી પણ વધુ માહિતી શોધી રહ્યા છો, તો તમે અમારી પસંદગીની સંપર્ક પદ્ધતિઓમાંથી એક દ્વારા અમારો સંપર્ક કરી શકો છો:
              </p>
              <ul>
                <li>ઇમેઇલ: <a href="mailto:privacy@agrolandportal.com" className="text-primary hover:text-primary/80">privacy@agrolandportal.com</a></li>
                <li>આ લિંકની મુલાકાત લઈને: <Link to="/contact-us" className="text-primary hover:text-primary/80">અમારો સંપર્ક કરો</Link></li>
              </ul>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;