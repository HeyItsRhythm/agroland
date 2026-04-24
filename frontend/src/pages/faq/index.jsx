import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const FAQPage = () => {
  const [language, setLanguage] = useState('en');
  const [activeCategory, setActiveCategory] = useState('general');
  const [openQuestions, setOpenQuestions] = useState({});

  useEffect(() => {
    // Set page title
    document.title = 'FAQ - AgroLand Portal';
    
    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Get language preference
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const toggleQuestion = (id) => {
    setOpenQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = [
    { id: 'general', label: language === 'en' ? 'General' : 'સામાન્ય' },
    { id: 'buying', label: language === 'en' ? 'Buying Land' : 'જમીન ખરીદવી' },
    { id: 'selling', label: language === 'en' ? 'Selling Land' : 'જમીન વેચવી' },
    { id: 'account', label: language === 'en' ? 'Account & Profile' : 'એકાઉન્ટ અને પ્રોફાઇલ' },
    { id: 'payment', label: language === 'en' ? 'Payments & Pricing' : 'ચુકવણી અને કિંમત' },
  ];

  const faqs = {
    general: [
      {
        id: 'general-1',
        question: language === 'en' ? 'What is AgroLand Portal?' : 'AgroLand પોર્ટલ શું છે?',
        answer: language === 'en' 
          ? 'AgroLand Portal is Gujarat\'s premier online marketplace dedicated to agricultural land transactions. We connect farmers, landowners, buyers, and investors to facilitate transparent and efficient land deals.'
          : 'AgroLand પોર્ટલ એ ગુજરાતનું પ્રીમિયર ઓનલાઇન માર્કેટપ્લેસ છે જે કૃષિ જમીન વ્યવહારો માટે સમર્પિત છે. અમે પારદર્શક અને કાર્યક્ષમ જમીન સોદાઓની સુવિધા માટે ખેડૂતો, જમીન માલિકો, ખરીદદારો અને રોકાણકારોને જોડીએ છીએ.'
      },
      {
        id: 'general-2',
        question: language === 'en' ? 'Which regions does AgroLand Portal cover?' : 'AgroLand પોર્ટલ કયા પ્રદેશોને આવરી લે છે?',
        answer: language === 'en'
          ? 'Currently, AgroLand Portal covers all districts in Gujarat. We plan to expand to neighboring states in the future.'
          : 'હાલમાં, AgroLand પોર્ટલ ગુજરાતના તમામ જિલ્લાઓને આવરી લે છે. અમે ભવિષ્યમાં પડોશી રાજ્યોમાં વિસ્તરણ કરવાની યોજના ધરાવીએ છીએ.'
      },
      {
        id: 'general-3',
        question: language === 'en' ? 'How do I contact customer support?' : 'હું ગ્રાહક સહાયનો સંપર્ક કેવી રીતે કરું?',
        answer: language === 'en'
          ? 'You can contact our customer support team through the "Contact Us" page on our website, by emailing support@agrolandportal.com, or by calling our helpline at +91 79 4000 5000. Our support hours are Monday to Saturday, 9 AM to 6 PM.'
          : 'તમે અમારી વેબસાઇટ પર "અમારો સંપર્ક કરો" પેજ દ્વારા, support@agrolandportal.com પર ઇમેઇલ કરીને, અથવા +91 79 4000 5000 પર અમારી હેલ્પલાઇનને કૉલ કરીને અમારી ગ્રાહક સહાય ટીમનો સંપર્ક કરી શકો છો. અમારા સપોર્ટના કલાકો સોમવારથી શનિવાર, સવારે 9 થી સાંજે 6 વાગ્યા સુધી છે.'
      },
      {
        id: 'general-4',
        question: language === 'en' ? 'Is AgroLand Portal available in multiple languages?' : 'શું AgroLand પોર્ટલ બહુવિધ ભાષાઓમાં ઉપલબ્ધ છે?',
        answer: language === 'en'
          ? 'Yes, AgroLand Portal is currently available in English and Gujarati. We plan to add more regional languages in the future to better serve our users.'
          : 'હા, AgroLand પોર્ટલ હાલમાં અંગ્રેજી અને ગુજરાતીમાં ઉપલબ્ધ છે. અમે અમારા વપરાશકર્તાઓને વધુ સારી રીતે સેવા આપવા માટે ભવિષ્યમાં વધુ પ્રાદેશિક ભાષાઓ ઉમેરવાની યોજના ધરાવીએ છીએ.'
      },
    ],
    buying: [
      {
        id: 'buying-1',
        question: language === 'en' ? 'How do I search for agricultural land on AgroLand Portal?' : 'હું AgroLand પોર્ટલ પર કૃષિ જમીનની શોધ કેવી રીતે કરું?',
        answer: language === 'en'
          ? 'You can search for agricultural land by using the search filters on our homepage. Filter by location, price range, land size, soil type, water availability, and more to find properties that match your requirements.'
          : 'તમે અમારા હોમપેજ પર શોધ ફિલ્ટર્સનો ઉપયોગ કરીને કૃષિ જમીનની શોધ કરી શકો છો. તમારી આવશ્યકતાઓને અનુરૂપ સંપત્તિઓ શોધવા માટે સ્થાન, કિંમત શ્રેણી, જમીનનું કદ, માટીનો પ્રકાર, પાણીની ઉપલબ્ધતા અને વધુ દ્વારા ફિલ્ટર કરો.'
      },
      {
        id: 'buying-2',
        question: language === 'en' ? 'Can I schedule a visit to view the land before purchasing?' : 'શું હું ખરીદી કરતા પહેલા જમીન જોવા માટે મુલાકાતનું સમયપત્રક નક્કી કરી શકું?',
        answer: language === 'en'
          ? 'Yes, you can schedule a site visit through our platform. Simply click the "Schedule Visit" button on any property listing, select your preferred date and time, and our team will coordinate with the seller to arrange the visit.'
          : 'હા, તમે અમારા પ્લેટફોર્મ દ્વારા સાઇટ મુલાકાતનું સમયપત્રક નક્કી કરી શકો છો. કોઈપણ પ્રોપર્ટી લિસ્ટિંગ પર "મુલાકાત શેડ્યૂલ કરો" બટન પર ક્લિક કરો, તમારી પસંદગીની તારીખ અને સમય પસંદ કરો, અને અમારી ટીમ મુલાકાતની વ્યવસ્થા કરવા માટે વિક્રેતા સાથે સંકલન કરશે.'
      },
      {
        id: 'buying-3',
        question: language === 'en' ? 'How do I verify the authenticity of land documents?' : 'હું જમીન દસ્તાવેજોની પ્રમાણિકતાની ચકાસણી કેવી રીતે કરું?',
        answer: language === 'en'
          ? 'AgroLand Portal provides a document verification service. For properties with the "Verified" badge, our legal team has already reviewed the essential documents. For additional verification, you can request our premium document verification service or consult with your own legal advisor.'
          : 'AgroLand પોર્ટલ દસ્તાવેજ ચકાસણી સેવા પ્રદાન કરે છે. "ચકાસાયેલ" બેજ ધરાવતી સંપત્તિઓ માટે, અમારી કાનૂની ટીમે પહેલેથી જ આવશ્યક દસ્તાવેજોની સમીક્ષા કરી છે. વધારાની ચકાસણી માટે, તમે અમારી પ્રીમિયમ દસ્તાવેજ ચકાસણી સેવાની વિનંતી કરી શકો છો અથવા તમારા પોતાના કાનૂની સલાહકાર સાથે પરામર્શ કરી શકો છો.'
      },
    ],
    selling: [
      {
        id: 'selling-1',
        question: language === 'en' ? 'How do I list my agricultural land for sale?' : 'હું મારી કૃષિ જમીન વેચાણ માટે કેવી રીતે સૂચિબદ્ધ કરું?',
        answer: language === 'en'
          ? 'To list your land, create an account on AgroLand Portal, click on "Sell Land" in your dashboard, and fill out the property details form. Upload clear photos, provide accurate information about your land, and set your asking price. Our team will review your listing before it goes live.'
          : 'તમારી જમીન સૂચિબદ્ધ કરવા માટે, AgroLand પોર્ટલ પર એક એકાઉન્ટ બનાવો, તમારા ડેશબોર્ડમાં "જમીન વેચો" પર ક્લિક કરો, અને પ્રોપર્ટી વિગતો ફોર્મ ભરો. સ્પષ્ટ ફોટા અપલોડ કરો, તમારી જમીન વિશે સચોટ માહિતી પ્રદાન કરો, અને તમારી માંગણી કિંમત સેટ કરો. તમારી લિસ્ટિંગ લાઇવ થાય તે પહેલા અમારી ટીમ તેની સમીક્ષા કરશે.'
      },
      {
        id: 'selling-2',
        question: language === 'en' ? 'What documents do I need to sell my land?' : 'મારી જમીન વેચવા માટે મને કયા દસ્તાવેજોની જરૂર છે?',
        answer: language === 'en'
          ? 'You will need to provide proof of ownership (7/12 extract), land survey number, property tax receipts, non-agricultural use permission (if applicable), and any encumbrance certificates. Our platform guides you through the document upload process during listing creation.'
          : 'તમારે માલિકીનો પુરાવો (7/12 ઉતારો), જમીન સર્વે નંબર, મિલકત વેરા રસીદો, બિન-કૃષિ ઉપયોગની પરવાનગી (જો લાગુ પડે તો), અને કોઈપણ એન્કમ્બ્રન્સ સર્ટિફિકેટ્સ પ્રદાન કરવાની જરૂર પડશે. અમારું પ્લેટફોર્મ તમને લિસ્ટિંગ બનાવતી વખતે દસ્તાવેજ અપલોડ પ્રક્રિયા દ્વારા માર્ગદર્શન આપે છે.'
      },
      {
        id: 'selling-3',
        question: language === 'en' ? 'How much does it cost to list my property?' : 'મારી સંપત્તિ સૂચિબદ્ધ કરવાનો કેટલો ખર્ચ થાય છે?',
        answer: language === 'en'
          ? 'Basic listings are free for the first 30 days. Premium listings, which include featured placement, professional photography, and enhanced visibility, start at ₹2,999. You only pay a success fee when your property is sold through our platform.'
          : 'પ્રથમ 30 દિવસો માટે બેઝિક લિસ્ટિંગ્સ મફત છે. પ્રીમિયમ લિસ્ટિંગ્સ, જેમાં ફીચર્ડ પ્લેસમેન્ટ, પ્રોફેશનલ ફોટોગ્રાફી અને વધારેલી દૃશ્યતા શામેલ છે, તે ₹2,999 થી શરૂ થાય છે. તમારી સંપત્તિ અમારા પ્લેટફોર્મ દ્વારા વેચાય ત્યારે જ તમે સફળતા ફી ચૂકવો છો.'
      },
    ],
    account: [
      {
        id: 'account-1',
        question: language === 'en' ? 'How do I create an account?' : 'હું એકાઉન્ટ કેવી રીતે બનાવું?',
        answer: language === 'en'
          ? 'To create an account, click on the "Sign Up" button in the top right corner of our website. Enter your name, email address, phone number, and create a password. Verify your email address and phone number to complete the registration process.'
          : 'એકાઉન્ટ બનાવવા માટે, અમારી વેબસાઇટના ઉપરના જમણા ખૂણામાં "સાઇન અપ" બટન પર ક્લિક કરો. તમારું નામ, ઇમેઇલ એડ્રેસ, ફોન નંબર દાખલ કરો અને પાસવર્ડ બનાવો. નોંધણી પ્રક્રિયા પૂર્ણ કરવા માટે તમારા ઇમેઇલ એડ્રેસ અને ફોન નંબરની ચકાસણી કરો.'
      },
      {
        id: 'account-2',
        question: language === 'en' ? 'How do I reset my password?' : 'હું મારો પાસવર્ડ કેવી રીતે રીસેટ કરું?',
        answer: language === 'en'
          ? 'To reset your password, click on "Login" and then "Forgot Password". Enter the email address associated with your account, and we\'ll send you a password reset link. Click the link in the email and follow the instructions to create a new password.'
          : 'તમારો પાસવર્ડ રીસેટ કરવા માટે, "લોગિન" પર ક્લિક કરો અને પછી "પાસવર્ડ ભૂલી ગયા". તમારા એકાઉન્ટ સાથે સંકળાયેલ ઇમેઇલ એડ્રેસ દાખલ કરો, અને અમે તમને પાસવર્ડ રીસેટ લિંક મોકલીશું. ઇમેઇલમાં લિંક પર ક્લિક કરો અને નવો પાસવર્ડ બનાવવા માટે સૂચનાઓને અનુસરો.'
      },
      {
        id: 'account-3',
        question: language === 'en' ? 'How do I update my profile information?' : 'હું મારી પ્રોફાઇલ માહિતી કેવી રીતે અપડેટ કરું?',
        answer: language === 'en'
          ? 'Log in to your account, click on your profile picture in the top right corner, and select "Profile Settings". From there, you can update your personal information, contact details, and notification preferences.'
          : 'તમારા એકાઉન્ટમાં લોગ ઇન કરો, ઉપરના જમણા ખૂણામાં તમારા પ્રોફાઇલ પિક્ચર પર ક્લિક કરો, અને "પ્રોફાઇલ સેટિંગ્સ" પસંદ કરો. ત્યાંથી, તમે તમારી વ્યક્તિગત માહિતી, સંપર્ક વિગતો અને સૂચના પસંદગીઓ અપડેટ કરી શકો છો.'
      },
    ],
    payment: [
      {
        id: 'payment-1',
        question: language === 'en' ? 'What payment methods are accepted?' : 'કયા ચુકવણી પદ્ધતિઓ સ્વીકારવામાં આવે છે?',
        answer: language === 'en'
          ? 'We accept various payment methods including credit/debit cards, net banking, UPI, and wallet payments for our services. For property transactions, we facilitate secure escrow services through our banking partners.'
          : 'અમે અમારી સેવાઓ માટે ક્રેડિટ/ડેબિટ કાર્ડ, નેટ બેંકિંગ, UPI અને વોલેટ પેમેન્ટ્સ સહિત વિવિધ ચુકવણી પદ્ધતિઓ સ્વીકારીએ છીએ. પ્રોપર્ટી વ્યવહારો માટે, અમે અમારા બેંકિંગ ભાગીદારો દ્વારા સુરક્ષિત એસ્ક્રો સેવાઓની સુવિધા આપીએ છીએ.'
      },
      {
        id: 'payment-2',
        question: language === 'en' ? 'Is there a fee for using AgroLand Portal?' : 'શું AgroLand પોર્ટલનો ઉપયોગ કરવા માટે કોઈ ફી છે?',
        answer: language === 'en'
          ? 'Browsing properties and basic account features are free. We charge a success fee only when a property transaction is completed through our platform. Premium services like featured listings, professional photography, and legal verification have additional charges.'
          : 'પ્રોપર્ટીઝ બ્રાઉઝ કરવી અને મૂળભૂત એકાઉન્ટ સુવિધાઓ મફત છે. અમે ફક્ત ત્યારે જ સફળતા ફી લઈએ છીએ જ્યારે અમારા પ્લેટફોર્મ દ્વારા પ્રોપર્ટી વ્યવહાર પૂર્ણ થાય છે. ફીચર્ડ લિસ્ટિંગ્સ, પ્રોફેશનલ ફોટોગ્રાફી અને કાનૂની ચકાસણી જેવી પ્રીમિયમ સેવાઓ માટે વધારાના ચાર્જ છે.'
      },
      {
        id: 'payment-3',
        question: language === 'en' ? 'How secure are the payments on AgroLand Portal?' : 'AgroLand પોર્ટલ પર ચુકવણી કેટલી સુરક્ષિત છે?',
        answer: language === 'en'
          ? 'All payments on AgroLand Portal are secured with industry-standard encryption and processed through PCI-DSS compliant payment gateways. For property transactions, we offer secure escrow services through trusted banking partners to ensure safe transfers.'
          : 'AgroLand પોર્ટલ પર તમામ ચુકવણીઓ ઉદ્યોગ-માનક એન્ક્રિપ્શન સાથે સુરક્ષિત છે અને PCI-DSS અનુપાલન પેમેન્ટ ગેટવે દ્વારા પ્રક્રિયા કરવામાં આવે છે. પ્રોપર્ટી વ્યવહારો માટે, અમે સુરક્ષિત ટ્રાન્સફર સુનિશ્ચિત કરવા માટે વિશ્વસનીય બેંકિંગ ભાગીદારો દ્વારા સુરક્ષિત એસ્ક્રો સેવાઓ પ્રદાન કરીએ છીએ.'
      },
    ],
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
                {language === 'en' ? 'Frequently Asked Questions' : 'વારંવાર પૂછાતા પ્રશ્નો'}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {language === 'en' 
                  ? 'Find answers to common questions about AgroLand Portal'
                  : 'AgroLand પોર્ટલ વિશે સામાન્ય પ્રશ્નોના જવાબો શોધો'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" size="sm">
                  <Icon name="MessageCircle" size={16} className="mr-2" />
                  {language === 'en' ? 'Live Chat Support' : 'લાઈવ ચેટ સપોર્ટ'}
                </Button>
                <Button variant="outline" size="sm">
                  <Icon name="Mail" size={16} className="mr-2" />
                  {language === 'en' ? 'Email Support' : 'ઈમેલ સપોર્ટ'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Categories */}
              <div className="lg:w-1/4">
                <div className="bg-card p-6 rounded-lg shadow-sm sticky top-24">
                  <h3 className="text-lg font-semibold mb-4">
                    {language === 'en' ? 'Categories' : 'શ્રેણીઓ'}
                  </h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Questions and Answers */}
              <div className="lg:w-3/4">
                <div className="space-y-6">
                  {faqs[activeCategory]?.map((faq) => (
                    <div key={faq.id} className="bg-card rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => toggleQuestion(faq.id)}
                        className="w-full flex justify-between items-center p-6 text-left font-semibold focus:outline-none"
                      >
                        <span>{faq.question}</span>
                        <Icon 
                          name={openQuestions[faq.id] ? 'ChevronUp' : 'ChevronDown'} 
                          size={20} 
                          className="flex-shrink-0 ml-4"
                        />
                      </button>
                      {openQuestions[faq.id] && (
                        <div className="px-6 pb-6 pt-0">
                          <div className="pt-4 border-t">
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Still Have Questions */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-6">
                {language === 'en' ? 'Still Have Questions?' : 'હજી પણ પ્રશ્નો છે?'}
              </h2>
              <p className="text-muted-foreground mb-8">
                {language === 'en'
                  ? 'Our support team is here to help you with any questions or concerns you may have.'
                  : 'અમારી સપોર્ટ ટીમ તમને તમારા કોઈપણ પ્રશ્નો અથવા ચિંતાઓમાં મદદ કરવા માટે અહીં છે.'
                }
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card p-8 rounded-lg shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon name="MessageCircle" className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'Live Chat Support' : 'લાઈવ ચેટ સપોર્ટ'}
                    </h3>
                    <p className="text-muted-foreground text-center mb-6">
                      {language === 'en'
                        ? 'Chat with our support team in real-time for immediate assistance.'
                        : 'તાત્કાલિક સહાય માટે અમારી સપોર્ટ ટીમ સાથે રીયલ-ટાઇમમાં ચેટ કરો.'
                      }
                    </p>
                    <Button>
                      {language === 'en' ? 'Start Chat' : 'ચેટ શરૂ કરો'}
                    </Button>
                  </div>
                </div>
                
                <div className="bg-card p-8 rounded-lg shadow-sm">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Icon name="Mail" className="text-primary" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'Email Support' : 'ઈમેલ સપોર્ટ'}
                    </h3>
                    <p className="text-muted-foreground text-center mb-6">
                      {language === 'en'
                        ? 'Send us an email and we\'ll get back to you within 24 hours.'
                        : 'અમને ઈમેલ મોકલો અને અમે 24 કલાકની અંદર તમારો સંપર્ક કરીશું.'
                      }
                    </p>
                    <Button variant="outline">
                      <Icon name="Mail" size={16} className="mr-2" />
                      {language === 'en' ? 'Email Us' : 'અમને ઈમેલ કરો'}
                    </Button>
                  </div>
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

export default FAQPage;