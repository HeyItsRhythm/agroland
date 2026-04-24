import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Footer from '../home-landing-page/components/Footer';
import Header from '../../components/ui/Header';

const Disclaimer = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Disclaimer - AgroLand Portal' : 'અસ્વીકરણ - એગ્રોલેન્ડ પોર્ટલ'}
        </title>
        <meta
          name="description"
          content={language === 'en' ? 'Disclaimer for AgroLand Portal - Important information regarding the use of our agricultural land marketplace platform.' : 'એગ્રોલેન્ડ પોર્ટલ માટે અસ્વીકરણ - અમારા કૃષિ જમીન માર્કેટપ્લેસ પ્લેટફોર્મના ઉપયોગ અંગે મહત્વપૂર્ણ માહિતી.'}
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                {language === 'en' ? 'Disclaimer' : 'અસ્વીકરણ'}
              </h1>

              <div className="prose prose-lg max-w-none">
                {language === 'en' ? (
                  <>
                    <h2>Website Disclaimer</h2>
                    <p>
                      The information provided on AgroLand Portal ("the Site") is for general informational purposes only. All information on the Site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
                    </p>

                    <h2>No Liability</h2>
                    <p>
                      Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Site or reliance on any information provided on the Site. Your use of the Site and your reliance on any information on the Site is solely at your own risk.
                    </p>

                    <h2>External Links Disclaimer</h2>
                    <p>
                      The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
                    </p>

                    <h2>Professional Disclaimer</h2>
                    <p>
                      The Site cannot and does not contain legal advice. The legal information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.
                    </p>

                    <h2>Property Listings Disclaimer</h2>
                    <p>
                      AgroLand Portal acts as a marketplace connecting buyers and sellers of agricultural land. We do not own, buy, or sell any properties listed on our platform. While we strive to ensure all listings are accurate and legitimate, we cannot guarantee the accuracy of all information provided by sellers. Buyers are encouraged to verify all property details, including but not limited to ownership, boundaries, soil quality, water access, and legal status before making any purchase decisions or financial commitments.
                    </p>

                    <h2>Errors and Omissions Disclaimer</h2>
                    <p>
                      The information given by the Site is for general guidance on matters of interest only. Even if the Site takes every precaution to ensure that the content is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules, and regulations, there may be delays, omissions, or inaccuracies in the information contained on the Site.
                    </p>

                    <h2>Fair Use Disclaimer</h2>
                    <p>
                      The Site may use copyrighted material which has not always been specifically authorized by the copyright owner. We are making such material available for criticism, comment, news reporting, teaching, scholarship, or research.
                    </p>

                    <h2>Views Expressed Disclaimer</h2>
                    <p>
                      The views and opinions expressed in the Site are those of the authors and do not necessarily reflect the official policy or position of any other agency, organization, employer, or company, including AgroLand Portal itself.
                    </p>

                    <h2>No Responsibility Disclaimer</h2>
                    <p>
                      The information on the Site is provided with the understanding that AgroLand Portal is not herein engaged in rendering legal, accounting, tax, or other professional advice and services. As such, it should not be used as a substitute for consultation with professional accounting, tax, legal, or other competent advisers.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                      If you have any questions or concerns about this Disclaimer, please contact us at <a href="mailto:legal@agrolandportal.com">legal@agrolandportal.com</a>.
                    </p>
                  </>
                ) : (
                  <>
                    <h2>વેબસાઇટ અસ્વીકરણ</h2>
                    <p>
                      એગ્રોલેન્ડ પોર્ટલ ("સાઇટ") પર પ્રદાન કરવામાં આવેલી માહિતી માત્ર સામાન્ય માહિતીના હેતુઓ માટે છે. સાઇટ પર બધી માહિતી સારા વિશ્વાસમાં પ્રદાન કરવામાં આવે છે, જો કે, અમે સાઇટ પર કોઈપણ માહિતીની ચોકસાઈ, પર્યાપ્તતા, માન્યતા, વિશ્વસનીયતા, ઉપલબ્ધતા, અથવા સંપૂર્ણતા અંગે કોઈપણ પ્રકારની રજૂઆત અથવા વોરંટી આપતા નથી.
                    </p>

                    <h2>કોઈ જવાબદારી નહીં</h2>
                    <p>
                      કોઈપણ સંજોગોમાં અમારી પાસે સાઇટના ઉપયોગ અથવા સાઇટ પર પ્રદાન કરવામાં આવેલી કોઈપણ માહિતી પર આધાર રાખવાના પરિણામે થયેલા કોઈપણ પ્રકારના નુકસાન અથવા નુકસાન માટે તમારા પ્રત્યે કોઈ જવાબદારી રહેશે નહીં. સાઇટનો તમારો ઉપયોગ અને સાઇટ પર કોઈપણ માહિતી પર તમારો આધાર માત્ર તમારા પોતાના જોખમે છે.
                    </p>

                    <h2>બાહ્ય લિંક્સ અસ્વીકરણ</h2>
                    <p>
                      સાઇટમાં અન્ય વેબસાઇટ્સ અથવા તૃતીય પક્ષોને સંબંધિત અથવા તેમાંથી ઉદ્ભવતી સામગ્રીની લિંક્સ અથવા બેનર્સ અથવા અન્ય જાહેરાતોમાં વેબસાઇટ્સ અને સુવિધાઓની લિંક્સ હોઈ શકે છે. આવી બાહ્ય લિંક્સની ચોકસાઈ, પર્યાપ્તતા, માન્યતા, વિશ્વસનીયતા, ઉપલબ્ધતા, અથવા સંપૂર્ણતા માટે અમારા દ્વારા તપાસ, નિરીક્ષણ, અથવા તપાસવામાં આવતી નથી.
                    </p>

                    <h2>વ્યાવસાયિક અસ્વીકરણ</h2>
                    <p>
                      સાઇટ કાનૂની સલાહ ધરાવતી નથી અને ધરાવી શકતી નથી. કાનૂની માહિતી માત્ર સામાન્ય માહિતી અને શૈક્ષણિક હેતુઓ માટે પ્રદાન કરવામાં આવે છે અને તે વ્યાવસાયિક સલાહનો વિકલ્પ નથી. તદનુસાર, આવી માહિતીના આધારે કોઈપણ પગલાં લેતા પહેલા, અમે તમને યોગ્ય વ્યાવસાયિકો સાથે પરામર્શ કરવા પ્રોત્સાહિત કરીએ છીએ.
                    </p>

                    <h2>પ્રોપર્ટી લિસ્ટિંગ્સ અસ્વીકરણ</h2>
                    <p>
                      એગ્રોલેન્ડ પોર્ટલ કૃષિ જમીનના ખરીદનારાઓ અને વેચનારાઓને જોડતા માર્કેટપ્લેસ તરીકે કાર્ય કરે છે. અમે અમારા પ્લેટફોર્મ પર સૂચિબદ્ધ કોઈપણ પ્રોપર્ટીની માલિકી, ખરીદી, અથવા વેચાણ કરતા નથી. અમે બધા લિસ્ટિંગ્સ સચોટ અને કાયદેસર છે તેની ખાતરી કરવાનો પ્રયાસ કરીએ છીએ, અમે વેચનારાઓ દ્વારા પ્રદાન કરવામાં આવેલી તમામ માહિતીની ચોકસાઈની ખાતરી આપી શકતા નથી. ખરીદદારોને કોઈપણ ખરીદી નિર્ણયો અથવા નાણાકીય પ્રતિબદ્ધતાઓ કરતા પહેલા માલિકી, સીમાઓ, માટીની ગુણવત્તા, પાણીની ઍક્સેસ, અને કાનૂની સ્થિતિ સહિત, પરંતુ તે સુધી મર્યાદિત નથી, તમામ પ્રોપર્ટી વિગતોની ચકાસણી કરવા પ્રોત્સાહિત કરવામાં આવે છે.
                    </p>

                    <h2>ભૂલો અને ચૂક અસ્વીકરણ</h2>
                    <p>
                      સાઇટ દ્વારા આપવામાં આવેલી માહિતી માત્ર રસના બાબતો પર સામાન્ય માર્ગદર્શન માટે છે. સાઇટ સામગ્રી બંને વર્તમાન અને સચોટ છે તેની ખાતરી કરવા માટે દરેક સાવચેતી લે છે, તેમ છતાં ભૂલો થઈ શકે છે. વધુમાં, કાયદા, નિયમો, અને નિયમનોની બદલાતી પ્રકૃતિને ધ્યાનમાં રાખીને, સાઇટમાં સમાવિષ્ટ માહિતીમાં વિલંબ, ચૂક, અથવા અચોકસાઈઓ હોઈ શકે છે.
                    </p>

                    <h2>ફેર યુઝ અસ્વીકરણ</h2>
                    <p>
                      સાઇટ કૉપિરાઇટવાળી સામગ્રીનો ઉપયોગ કરી શકે છે જેને હંમેશા કૉપિરાઇટ માલિક દ્વારા વિશિષ્ટ રીતે અધિકૃત કરવામાં આવી નથી. અમે આવી સામગ્રીને ટીકા, ટિપ્પણી, સમાચાર રિપોર્ટિંગ, શિક્ષણ, વિદ્વતા, અથવા સંશોધન માટે ઉપલબ્ધ કરાવી રહ્યા છીએ.
                    </p>

                    <h2>અભિવ્યક્ત મંતવ્યો અસ્વીકરણ</h2>
                    <p>
                      સાઇટમાં વ્યક્ત કરાયેલા મંતવ્યો અને અભિપ્રાયો લેખકોના છે અને તેઓ એગ્રોલેન્ડ પોર્ટલ સહિત, કોઈપણ અન્ય એજન્સી, સંસ્થા, નિયોક્તા, અથવા કંપનીની સત્તાવાર નીતિ અથવા સ્થિતિને પ્રતિબિંબિત કરતા નથી.
                    </p>

                    <h2>કોઈ જવાબદારી અસ્વીકરણ</h2>
                    <p>
                      સાઇટ પર માહિતી એ સમજણ સાથે પ્રદાન કરવામાં આવે છે કે એગ્રોલેન્ડ પોર્ટલ અહીં કાનૂની, એકાઉન્ટિંગ, કર, અથવા અન્ય વ્યાવસાયિક સલાહ અને સેવાઓ આપવામાં રોકાયેલ નથી. આ રીતે, તેનો ઉપયોગ વ્યાવસાયિક એકાઉન્ટિંગ, કર, કાનૂની, અથવા અન્ય સક્ષમ સલાહકારો સાથે પરામર્શના વિકલ્પ તરીકે કરવો જોઈએ નહીં.
                    </p>

                    <h2>અમારો સંપર્ક કરો</h2>
                    <p>
                      જો તમને આ અસ્વીકરણ વિશે કોઈ પ્રશ્નો અથવા ચિંતાઓ હોય, તો કૃપા કરીને અમારો સંપર્ક <a href="mailto:legal@agrolandportal.com">legal@agrolandportal.com</a> પર કરો.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Disclaimer;