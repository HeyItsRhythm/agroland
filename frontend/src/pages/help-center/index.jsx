import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Footer from '../home-landing-page/components/Footer';
import Header from '../../components/ui/Header';
import { useLanguage } from '../../contexts/LanguageContext';

const HelpCenter = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      title: language === 'en' ? 'Getting Started' : 'શરૂઆત કરવી',
      icon: 'Compass',
      topics: [
        {
          id: 'create-account',
          title: language === 'en' ? 'How to Create an Account' : 'ખાતું કેવી રીતે બનાવવું',
          content: language === 'en' 
            ? 'To create an account on AgroLand Portal, click on the "Register" button in the top right corner of the homepage. Fill in your details, select your role (buyer or seller), verify your email address, and complete your profile information.'
            : 'એગ્રોલેન્ડ પોર્ટલ પર ખાતું બનાવવા માટે, હોમપેજના ઉપરના જમણા ખૂણામાં "રજિસ્ટર" બટન પર ક્લિક કરો. તમારી વિગતો ભરો, તમારી ભૂમિકા (ખરીદનાર અથવા વેચનાર) પસંદ કરો, તમારા ઇમેઇલ સરનામાની ચકાસણી કરો, અને તમારી પ્રોફાઇલ માહિતી પૂર્ણ કરો.'
        },
        {
          id: 'search-properties',
          title: language === 'en' ? 'How to Search for Properties' : 'પ્રોપર્ટીઓ કેવી રીતે શોધવી',
          content: language === 'en'
            ? 'Use our advanced search filters to find agricultural properties that match your requirements. You can filter by location, price range, land area, water availability, and more. Browse through the listings and click on any property to view detailed information.'
            : 'તમારી જરૂરિયાતોને અનુરૂપ કૃષિ મિલકતો શોધવા માટે અમારા અદ્યતન શોધ ફિલ્ટર્સનો ઉપયોગ કરો. તમે સ્થાન, કિંમત શ્રેણી, જમીન વિસ્તાર, પાણીની ઉપલબ્ધતા, અને વધુ દ્વારા ફિલ્ટર કરી શકો છો. લિસ્ટિંગ્સ બ્રાઉઝ કરો અને વિગતવાર માહિતી જોવા માટે કોઈપણ પ્રોપર્ટી પર ક્લિક કરો.'
        },
        {
          id: 'contact-sellers',
          title: language === 'en' ? 'How to Contact Sellers' : 'વેચનારાઓનો સંપર્ક કેવી રીતે કરવો',
          content: language === 'en'
            ? 'When you find a property you\'re interested in, you can contact the seller directly through the property listing page. Click on the "Contact Seller" button, fill in your inquiry details, and submit. The seller will receive your message and can respond via email or phone.'
            : 'જ્યારે તમને એવી પ્રોપર્ટી મળે જેમાં તમને રસ હોય, ત્યારે તમે પ્રોપર્ટી લિસ્ટિંગ પેજ દ્વારા સીધા વેચનારનો સંપર્ક કરી શકો છો. "વેચનારનો સંપર્ક કરો" બટન પર ક્લિક કરો, તમારી પૂછપરછની વિગતો ભરો, અને સબમિટ કરો. વેચનારને તમારો સંદેશ મળશે અને ઇમેઇલ અથવા ફોન દ્વારા જવાબ આપી શકે છે.'
        }
      ]
    },
    {
      id: 'account-management',
      title: language === 'en' ? 'Account Management' : 'ખાતા વ્યવસ્થાપન',
      icon: 'User',
      topics: [
        {
          id: 'update-profile',
          title: language === 'en' ? 'How to Update Your Profile' : 'તમારી પ્રોફાઇલ કેવી રીતે અપડેટ કરવી',
          content: language === 'en'
            ? 'To update your profile, log in to your account and navigate to the "Profile" section in your dashboard. Here, you can edit your personal information, contact details, and preferences. Don\'t forget to click "Save Changes" when you\'re done.'
            : 'તમારી પ્રોફાઇલ અપડેટ કરવા માટે, તમારા ખાતામાં લૉગ ઇન કરો અને તમારા ડેશબોર્ડમાં "પ્રોફાઇલ" વિભાગમાં નેવિગેટ કરો. અહીં, તમે તમારી વ્યક્તિગત માહિતી, સંપર્ક વિગતો, અને પસંદગીઓ સંપાદિત કરી શકો છો. જ્યારે તમે પૂર્ણ કરો ત્યારે "ફેરફારો સાચવો" પર ક્લિક કરવાનું ભૂલશો નહીં.'
        },
        {
          id: 'change-password',
          title: language === 'en' ? 'How to Change Your Password' : 'તમારો પાસવર્ડ કેવી રીતે બદલવો',
          content: language === 'en'
            ? 'To change your password, go to your account settings and select the "Security" tab. Enter your current password, then your new password twice to confirm. For security reasons, choose a strong password that includes a mix of letters, numbers, and special characters.'
            : 'તમારો પાસવર્ડ બદલવા માટે, તમારા ખાતાની સેટિંગ્સમાં જાઓ અને "સુરક્ષા" ટેબ પસંદ કરો. તમારો વર્તમાન પાસવર્ડ દાખલ કરો, પછી પુષ્ટિ કરવા માટે તમારો નવો પાસવર્ડ બે વખત દાખલ કરો. સુરક્ષાના કારણોસર, એક મજબૂત પાસવર્ડ પસંદ કરો જેમાં અક્ષરો, નંબરો, અને વિશેષ અક્ષરોનું મિશ્રણ શામેલ હોય.'
        },
        {
          id: 'delete-account',
          title: language === 'en' ? 'How to Delete Your Account' : 'તમારું ખાતું કેવી રીતે કાઢી નાખવું',
          content: language === 'en'
            ? 'If you wish to delete your account, go to your account settings and select the "Delete Account" option at the bottom of the page. You\'ll be asked to confirm your decision and enter your password. Please note that account deletion is permanent and all your data will be removed from our system.'
            : 'જો તમે તમારું ખાતું કાઢી નાખવા માંગતા હો, તો તમારા ખાતાની સેટિંગ્સમાં જાઓ અને પૃષ્ઠના તળિયે "ખાતું કાઢી નાખો" વિકલ્પ પસંદ કરો. તમને તમારા નિર્ણયની પુષ્ટિ કરવા અને તમારો પાસવર્ડ દાખલ કરવા માટે કહેવામાં આવશે. કૃપા કરીને નોંધ કરો કે ખાતું કાઢી નાખવું કાયમી છે અને તમારો બધો ડેટા અમારી સિસ્ટમમાંથી દૂર કરવામાં આવશે.'
        }
      ]
    },
    {
      id: 'property-listings',
      title: language === 'en' ? 'Property Listings' : 'પ્રોપર્ટી લિસ્ટિંગ્સ',
      icon: 'Home',
      topics: [
        {
          id: 'list-property',
          title: language === 'en' ? 'How to List Your Property' : 'તમારી પ્રોપર્ટી કેવી રીતે લિસ્ટ કરવી',
          content: language === 'en'
            ? 'To list your property, log in to your seller account and click on "Add New Property" in your dashboard. Fill in all the required details about your agricultural land, upload high-quality photos, set your price, and provide accurate location information. The more details you provide, the more likely you are to attract serious buyers.'
            : 'તમારી પ્રોપર્ટી લિસ્ટ કરવા માટે, તમારા વેચનાર ખાતામાં લૉગ ઇન કરો અને તમારા ડેશબોર્ડમાં "નવી પ્રોપર્ટી ઉમેરો" પર ક્લિક કરો. તમારી કૃષિ જમીન વિશે બધી જરૂરી વિગતો ભરો, ઉચ્ચ-ગુણવત્તાવાળા ફોટા અપલોડ કરો, તમારી કિંમત સેટ કરો, અને સચોટ સ્થાન માહિતી પ્રદાન કરો. તમે જેટલી વધુ વિગતો પ્રદાન કરો છો, તેટલી વધુ સંભાવના છે કે તમે ગંભીર ખરીદદારોને આકર્ષિત કરશો.'
        },
        {
          id: 'edit-listing',
          title: language === 'en' ? 'How to Edit Your Listing' : 'તમારું લિસ્ટિંગ કેવી રીતે સંપાદિત કરવું',
          content: language === 'en'
            ? 'To edit your property listing, go to your seller dashboard and find the property you want to update in the "My Properties" section. Click on "Edit" and make the necessary changes to any field. You can update the price, description, photos, or any other details. Don\'t forget to save your changes when you\'re done.'
            : 'તમારી પ્રોપર્ટી લિસ્ટિંગ સંપાદિત કરવા માટે, તમારા વેચનાર ડેશબોર્ડ પર જાઓ અને "મારી પ્રોપર્ટીઝ" વિભાગમાં તમે અપડેટ કરવા માંગતા હો તે પ્રોપર્ટી શોધો. "સંપાદિત કરો" પર ક્લિક કરો અને કોઈપણ ક્ષેત્રમાં જરૂરી ફેરફારો કરો. તમે કિંમત, વર્ણન, ફોટા, અથવા અન્ય કોઈપણ વિગતો અપડેટ કરી શકો છો. જ્યારે તમે પૂર્ણ કરો ત્યારે તમારા ફેરફારો સાચવવાનું ભૂલશો નહીં.'
        },
        {
          id: 'remove-listing',
          title: language === 'en' ? 'How to Remove Your Listing' : 'તમારું લિસ્ટિંગ કેવી રીતે દૂર કરવું',
          content: language === 'en'
            ? 'If you\'ve sold your property or no longer wish to list it, you can remove the listing from your seller dashboard. Go to "My Properties," find the listing you want to remove, and click on "Delete" or "Mark as Sold." Confirm your action when prompted. Once removed, the listing will no longer be visible to potential buyers.'
            : 'જો તમે તમારી પ્રોપર્ટી વેચી દીધી હોય અથવા હવે તેને લિસ્ટ કરવા માંગતા ન હો, તો તમે તમારા વેચનાર ડેશબોર્ડમાંથી લિસ્ટિંગ દૂર કરી શકો છો. "મારી પ્રોપર્ટીઝ" પર જાઓ, તમે દૂર કરવા માંગતા હો તે લિસ્ટિંગ શોધો, અને "કાઢી નાખો" અથવા "વેચાયેલ તરીકે ચિહ્નિત કરો" પર ક્લિક કરો. પૂછવામાં આવે ત્યારે તમારી ક્રિયાની પુષ્ટિ કરો. એકવાર દૂર કરવામાં આવે, પછી લિસ્ટિંગ સંભવિત ખરીદદારોને દેખાશે નહીં.'
        }
      ]
    },
    {
      id: 'payments-transactions',
      title: language === 'en' ? 'Payments & Transactions' : 'ચુકવણીઓ અને વ્યવહારો',
      icon: 'CreditCard',
      topics: [
        {
          id: 'payment-methods',
          title: language === 'en' ? 'Accepted Payment Methods' : 'સ્વીકૃત ચુકવણી પદ્ધતિઓ',
          content: language === 'en'
            ? 'AgroLand Portal accepts various payment methods for our premium services, including credit/debit cards, net banking, UPI, and wallet payments. All transactions are secure and encrypted. For property transactions between buyers and sellers, we recommend secure banking channels and proper documentation.'
            : 'એગ્રોલેન્ડ પોર્ટલ અમારી પ્રીમિયમ સેવાઓ માટે વિવિધ ચુકવણી પદ્ધતિઓ સ્વીકારે છે, જેમાં ક્રેડિટ/ડેબિટ કાર્ડ્સ, નેટ બેંકિંગ, UPI, અને વૉલેટ ચુકવણીઓ શામેલ છે. બધા વ્યવહારો સુરક્ષિત અને એન્ક્રિપ્ટેડ છે. ખરીદદારો અને વેચનારાઓ વચ્ચેના પ્રોપર્ટી વ્યવહારો માટે, અમે સુરક્ષિત બેંકિંગ ચેનલો અને યોગ્ય દસ્તાવેજીકરણની ભલામણ કરીએ છીએ.'
        },
        {
          id: 'subscription-plans',
          title: language === 'en' ? 'Subscription Plans' : 'સબ્સ્ક્રિપ્શન પ્લાન્સ',
          content: language === 'en'
            ? 'We offer different subscription plans for sellers to promote their properties effectively. Our Basic plan is free and allows you to list up to 2 properties. Premium and Pro plans offer additional features like featured listings, priority placement, and detailed analytics. You can upgrade your plan anytime from your dashboard.'
            : 'અમે વેચનારાઓને તેમની પ્રોપર્ટીઓને અસરકારક રીતે પ્રમોટ કરવા માટે વિવિધ સબ્સ્ક્રિપ્શન પ્લાન્સ ઓફર કરીએ છીએ. અમારો બેઝિક પ્લાન મફત છે અને તમને 2 પ્રોપર્ટીઓ સુધી લિસ્ટ કરવાની મંજૂરી આપે છે. પ્રીમિયમ અને પ્રો પ્લાન્સ ફીચર્ડ લિસ્ટિંગ્સ, પ્રાથમિકતા પ્લેસમેન્ટ, અને વિગતવાર એનાલિટિક્સ જેવી વધારાની સુવિધાઓ ઓફર કરે છે. તમે તમારા ડેશબોર્ડમાંથી કોઈપણ સમયે તમારા પ્લાનને અપગ્રેડ કરી શકો છો.'
        },
        {
          id: 'refund-policy',
          title: language === 'en' ? 'Refund Policy' : 'રિફંડ નીતિ',
          content: language === 'en'
            ? 'If you\'re not satisfied with our premium services, you can request a refund within 7 days of your subscription purchase. To request a refund, contact our support team with your order details. Please note that refunds are not available for partially used subscription periods or if you\'ve already utilized the premium features.'
            : 'જો તમે અમારી પ્રીમિયમ સેવાઓથી સંતુષ્ટ નથી, તો તમે તમારી સબ્સ્ક્રિપ્શન ખરીદીના 7 દિવસની અંદર રિફંડની વિનંતી કરી શકો છો. રિફંડની વિનંતી કરવા માટે, તમારી ઓર્ડર વિગતો સાથે અમારી સપોર્ટ ટીમનો સંપર્ક કરો. કૃપા કરીને નોંધ કરો કે આંશિક રીતે વપરાયેલા સબ્સ્ક્રિપ્શન સમયગાળા માટે અથવા જો તમે પહેલેથી જ પ્રીમિયમ સુવિધાઓનો ઉપયોગ કર્યો હોય તો રિફંડ ઉપલબ્ધ નથી.'
        }
      ]
    },
    {
      id: 'legal-documentation',
      title: language === 'en' ? 'Legal Documentation' : 'કાનૂની દસ્તાવેજીકરણ',
      icon: 'FileText',
      topics: [
        {
          id: 'required-documents',
          title: language === 'en' ? 'Required Documents for Property Transfer' : 'પ્રોપર્ટી ટ્રાન્સફર માટે જરૂરી દસ્તાવેજો',
          content: language === 'en'
            ? 'For agricultural land transactions in Gujarat, you\'ll need several important documents: 1) Clear Title Deed/Ownership Proof, 2) Land Survey Records (7/12 and 8A extracts), 3) Non-Agricultural (NA) Permission (if applicable), 4) Tax Payment Receipts, 5) Encumbrance Certificate, 6) Identity Proofs of both parties, and 7) Recent Photographs of the property. Our platform can help connect you with legal experts for document verification.'
            : 'ગુજરાતમાં કૃષિ જમીનના વ્યવહારો માટે, તમને કેટલાક મહત્વપૂર્ણ દસ્તાવેજોની જરૂર પડશે: 1) સ્પષ્ટ ટાઇટલ ડીડ/માલિકીનો પુરાવો, 2) જમીન સર્વે રેકોર્ડ્સ (7/12 અને 8A એક્સટ્રેક્ટ્સ), 3) બિન-કૃષિ (NA) પરવાનગી (જો લાગુ પડે તો), 4) કર ચુકવણી રસીદો, 5) એન્કમ્બ્રન્સ સર્ટિફિકેટ, 6) બંને પક્ષોના ઓળખ પુરાવા, અને 7) પ્રોપર્ટીના તાજેતરના ફોટોગ્રાફ્સ. અમારું પ્લેટફોર્મ તમને દસ્તાવેજ ચકાસણી માટે કાનૂની નિષ્ણાતો સાથે જોડવામાં મદદ કરી શકે છે.'
        },
        {
          id: 'legal-verification',
          title: language === 'en' ? 'Legal Verification Process' : 'કાનૂની ચકાસણી પ્રક્રિયા',
          content: language === 'en'
            ? 'We recommend a thorough legal verification process before finalizing any property transaction. This includes: 1) Title verification by a qualified lawyer, 2) Checking for any pending litigation, 3) Verification of land use permissions, 4) Confirming boundary demarcations, 5) Checking for any loans or encumbrances, and 6) Verifying tax payment status. AgroLand Portal can recommend trusted legal partners who specialize in agricultural land transactions.'
            : 'અમે કોઈપણ પ્રોપર્ટી વ્યવહારને અંતિમ રૂપ આપતા પહેલા સંપૂર્ણ કાનૂની ચકાસણી પ્રક્રિયાની ભલામણ કરીએ છીએ. આમાં શામેલ છે: 1) યોગ્યતા ધરાવતા વકીલ દ્વારા શીર્ષક ચકાસણી, 2) કોઈપણ બાકી મુકદ્દમા માટે તપાસ, 3) જમીન ઉપયોગ પરવાનગીઓની ચકાસણી, 4) સીમા સીમાંકનની પુષ્ટિ, 5) કોઈપણ લોન અથવા ભારણ માટે તપાસ, અને 6) કર ચુકવણી સ્થિતિની ચકાસણી. એગ્રોલેન્ડ પોર્ટલ કૃષિ જમીનના વ્યવહારોમાં નિષ્ણાત વિશ્વસનીય કાનૂની ભાગીદારોની ભલામણ કરી શકે છે.'
        },
        {
          id: 'stamp-duty',
          title: language === 'en' ? 'Stamp Duty and Registration Fees' : 'સ્ટેમ્પ ડ્યુટી અને નોંધણી ફી',
          content: language === 'en'
            ? 'In Gujarat, agricultural land transactions require payment of stamp duty (typically 4.9% of the property value) and registration fees (1% of the property value, capped at ₹30,000). These rates may vary based on location and property value. It\'s advisable to check the current rates with the local Sub-Registrar\'s office or consult with a property lawyer for the most up-to-date information.'
            : 'ગુજરાતમાં, કૃષિ જમીનના વ્યવહારો માટે સ્ટેમ્પ ડ્યુટી (સામાન્ય રીતે મિલકતના મૂલ્યના 4.9%) અને નોંધણી ફી (મિલકતના મૂલ્યના 1%, ₹30,000 સુધી મર્યાદિત) ની ચુકવણીની આવશ્યકતા હોય છે. આ દરો સ્થાન અને મિલકતના મૂલ્યના આધારે બદલાઈ શકે છે. સૌથી અદ્યતન માહિતી માટે સ્થાનિક સબ-રજિસ્ટ્રારની ઓફિસ સાથે વર્તમાન દરોની તપાસ કરવી અથવા પ્રોપર્ટી વકીલ સાથે પરામર્શ કરવો સલાહભર્યું છે.'
        }
      ]
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState(helpCategories[0].id);
  const [selectedTopic, setSelectedTopic] = useState(helpCategories[0].topics[0].id);

  const filteredCategories = searchQuery
    ? helpCategories.map(category => ({
        ...category,
        topics: category.topics.filter(topic =>
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.topics.length > 0)
    : helpCategories;

  const currentCategory = helpCategories.find(cat => cat.id === selectedCategory);
  const currentTopic = currentCategory?.topics.find(topic => topic.id === selectedTopic);

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Help Center - AgroLand Portal' : 'સહાય કેન્દ્ર - એગ્રોલેન્ડ પોર્ટલ'}
        </title>
        <meta
          name="description"
          content={language === 'en' ? 'Find answers to frequently asked questions and get help with using AgroLand Portal.' : 'વારંવાર પૂછાતા પ્રશ્નોના જવાબો શોધો અને એગ્રોલેન્ડ પોર્ટલનો ઉપયોગ કરવા માટે મદદ મેળવો.'}
        />
      </Helmet>

      <div className="min-h-screen bg-[#fafafa] flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-white border-b border-border pt-16 pb-24">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
               <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-3xl opacity-60"></div>
               <div className="absolute top-[20%] -left-[5%] w-[30%] h-[50%] rounded-full bg-secondary/5 blur-3xl opacity-40"></div>
            </div>

            <div className="container relative z-10 mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto text-center"
              >
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 uppercase tracking-wider">
                  <Icon name="LifeBuoy" size={14} />
                  <span>{language === 'en' ? 'Support Portal' : 'સપોર્ટ પોર્ટલ'}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-foreground tracking-tight">
                  {language === 'en' ? 'How can we help you?' : 'અમે તમને કેવી રીતે મદદ કરી શકીએ?'}
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  {language === 'en' 
                    ? 'Search our comprehensive knowledge base or browse categories below to find professional answers to your questions.'
                    : 'તમારા પ્રશ્નોના વ્યાવસાયિક જવાબો શોધવા માટે અમારા વ્યાપક નોલેજ બેઝમાં શોધો અથવા નીચે શ્રેણીઓ બ્રાઉઝ કરો.'
                  }
                </p>
                
                {/* Search Bar Refinement */}
                <div className="relative max-w-2xl mx-auto mb-10 group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon name="Search" className="text-muted-foreground group-focus-within:text-primary transition-colors" size={22} />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-white shadow-elevation-2 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-300 text-lg"
                    placeholder={language === 'en' ? 'Search for help topics, guides, or keywords...' : 'સહાય વિષયો, માર્ગદર્શિકાઓ અથવા કીવર્ડ્સ માટે શોધો...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Quick Selection Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    { icon: 'User', en: 'Account Issues', gu: 'ખાતા સમસ્યાઓ', cat: 'account-management' },
                    { icon: 'CreditCard', en: 'Payment Help', gu: 'ચુકવણી સહાય', cat: 'payments-transactions' },
                    { icon: 'Home', en: 'Listing Problems', gu: 'લિસ્ટિંગ સમસ્યાઓ', cat: 'property-listings' },
                    { icon: 'Shield', en: 'Safety', gu: 'સલામતી', cat: 'legal-documentation' }
                  ].map((item, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-muted/50 hover:bg-primary/5 border border-border hover:border-primary/20 text-sm font-medium transition-all"
                      onClick={() => {
                        const target = helpCategories.find(c => c.id === item.cat);
                        if(target) {
                          setSelectedCategory(target.id);
                          setSelectedTopic(target.topics[0]?.id);
                          const contentElement = document.getElementById('help-content-area');
                          if(contentElement) {
                            contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                      }}
                    >
                      <Icon name={item.icon} size={16} className="text-primary" />
                      <span>{language === 'en' ? item.en : item.gu}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Help Content */}
          <section id="help-content-area" className="py-20 bg-background/50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Categories Sidebar */}
                <aside className="lg:w-1/3 xl:w-1/4">
                  <div className="sticky top-28 space-y-6">
                    <div className="bg-white rounded-3xl border border-border shadow-elevation-1 overflow-hidden">
                      <div className="p-6 border-b border-border bg-muted/20">
                        <h2 className="font-bold text-lg text-foreground flex items-center space-x-2">
                          <Icon name="LayoutGrid" size={20} className="text-primary" />
                          <span>{language === 'en' ? 'Help Categories' : 'સહાય શ્રેણીઓ'}</span>
                        </h2>
                      </div>
                      <nav className="p-4">
                        <ul className="space-y-2">
                          {filteredCategories.map((category) => (
                            <li key={category.id} className="space-y-2">
                              <button
                                className={`w-full text-left px-4 py-3 rounded-2xl flex items-center justify-between group transition-all duration-300 ${selectedCategory === category.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-muted'}`}
                                onClick={() => {
                                  setSelectedCategory(category.id);
                                  setSelectedTopic(category.topics[0]?.id);
                                }}
                              >
                                <div className="flex items-center space-x-3">
                                  <Icon name={category.icon} size={20} className={selectedCategory === category.id ? 'text-white' : 'text-muted-foreground group-hover:text-primary'} />
                                  <span className="font-medium">{category.title}</span>
                                </div>
                                <Icon name="ChevronRight" size={16} className={`transition-transform duration-300 ${selectedCategory === category.id ? 'rotate-90' : 'opacity-0 group-hover:opacity-100'}`} />
                              </button>
                              
                              {/* Topics under this category with animation */}
                              <AnimatePresence>
                                {selectedCategory === category.id && (
                                  <motion.ul 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-muted/30 rounded-2xl p-2 space-y-1"
                                  >
                                    {category.topics.map((topic) => (
                                      <li key={topic.id}>
                                        <button
                                          className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedTopic === topic.id ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                          onClick={() => setSelectedTopic(topic.id)}
                                        >
                                          {topic.title}
                                        </button>
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                              </AnimatePresence>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>

                    {/* Support Card in Sidebar */}
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-white shadow-xl">
                      <h3 className="text-lg font-bold mb-2">{language === 'en' ? 'Need faster help?' : 'ઝડપી મદદ જોઈએ છે?'}</h3>
                      <p className="text-white/80 text-sm mb-4">
                        {language === 'en' ? 'Our experts are available for live chat support.' : 'અમારા નિષ્ણાતો લાઇવ ચેટ સપોર્ટ માટે ઉપલબ્ધ છે.'}
                      </p>
                      <button 
                        onClick={() => window.JamieDoesChatbotThings?.open?.()}
                        className="w-full bg-white text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-colors"
                      >
                        {language === 'en' ? 'Chat Now' : 'ચેટ કરો'}
                      </button>
                    </div>
                  </div>
                </aside>
                
                {/* Content Area */}
                <div className="lg:flex-1">
                  <AnimatePresence mode="wait">
                    {currentTopic ? (
                      <motion.div 
                        key={currentTopic.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-[32px] border border-border p-8 md:p-12 shadow-elevation-1"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                          <div>
                            <div className="flex items-center space-x-2 text-primary text-sm font-semibold mb-2 uppercase tracking-wide">
                              <Icon name={currentCategory?.icon || 'FileText'} size={16} />
                              <span>{currentCategory?.title}</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground leading-tight">
                              {currentTopic.title}
                            </h2>
                          </div>
                          <div className="hidden md:block">
                             <div className="flex items-center space-x-4">
                                <button className="p-2 rounded-full border border-border hover:bg-muted transition-colors">
                                   <Icon name="Share2" size={20} className="text-muted-foreground" />
                                </button>
                                <button className="p-2 rounded-full border border-border hover:bg-muted transition-colors">
                                   <Icon name="Printer" size={20} className="text-muted-foreground" />
                                </button>
                             </div>
                          </div>
                        </div>

                        <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed">
                          <p className="mb-6">{currentTopic.content}</p>
                          <div className="bg-primary/5 rounded-2xl p-6 border-l-4 border-primary mt-8">
                             <p className="text-foreground font-medium italic mb-2">
                                {language === 'en' ? 'Pro Tip:' : 'પ્રો ટીપ:'}
                             </p>
                             <p className="text-sm">
                                {language === 'en' 
                                  ? 'Always keep your profile updated with latest contact details to receive instant notifications about new listings.'
                                  : 'નવા લિસ્ટિંગ વિશે ત્વરિત સૂચનાઓ પ્રાપ્ત કરવા માટે હંમેશા તમારી પ્રોફાઇલને નવીનતમ સંપર્ક વિગતો સાથે અપડેટ રાખો.'}
                             </p>
                          </div>
                        </div>
                        
                        {/* Was this helpful */}
                        <div className="mt-16 pt-8 border-t border-border flex flex-col items-center">
                          <p className="text-foreground font-bold mb-6 text-center">
                            {language === 'en' ? 'Was this information helpful?' : 'શું આ માહિતી મદદરૂપ હતી?'}
                          </p>
                          <div className="flex items-center space-x-4">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center space-x-3 px-8 py-3 rounded-2xl border border-border hover:bg-success hover:text-white hover:border-success transition-all font-semibold"
                            >
                              <Icon name="ThumbsUp" size={20} />
                              <span>{language === 'en' ? 'Yes, thanks!' : 'હા, આભાર!'}</span>
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center space-x-3 px-8 py-3 rounded-2xl border border-border hover:bg-destructive hover:text-white hover:border-destructive transition-all font-semibold"
                            >
                              <Icon name="ThumbsDown" size={20} />
                              <span>{language === 'en' ? 'Not really' : 'ના'}</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-[32px] border border-border p-12 text-center shadow-elevation-1"
                      >
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Icon name="SearchX" className="text-primary" size={40} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                          {language === 'en' ? 'We couldn\'t find that topic' : 'અમને તે વિષય મળ્યો નથી'}
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          {language === 'en'
                            ? 'Our search didn\'t yield any results under this category. Try using different keywords or clearing your search.'
                            : 'અમારી શોધમાં આ શ્રેણી હેઠળ કોઈ પરિણામ મળ્યું નથી. વિવિધ કીવર્ડ્સનો ઉપયોગ કરવાનો પ્રયાસ કરો અથવા તમારી શોધ સાફ કરો.'
                          }
                        </p>
                        <Button variant="default" onClick={() => setSearchQuery('')} size="lg">
                          {language === 'en' ? 'Clear Search' : 'શોધ સાફ કરો'}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support Section Refined */}
          <section className="bg-white border-t border-border py-24 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-muted/20 z-0"></div>
            
            <div className="container relative z-10 mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 tracking-tight">
                  {language === 'en' ? 'Still have questions?' : 'હજુ પણ પ્રશ્નો છે?'}
                </h2>
                <p className="text-muted-foreground text-lg">
                   {language === 'en' 
                     ? "Can't find the answer you're looking for? Reach out to our dedicated support team."
                     : "તમે જે જવાબ શોધી રહ્યા છો તે મળી શકતો નથી? અમારી સમર્પિત સપોર્ટ ટીમનો સંપર્ક કરો."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Contact Cards */}
                {[
                  {
                    icon: 'MessageCircle',
                    title: { en: 'Live Chat', gu: 'લાઇવ ચેટ' },
                    desc: { en: 'Connect instantly with our support specialist.', gu: 'અમારા સપોર્ટ સ્પેશિયાલિસ્ટ સાથે તરત જ કનેક્ટ થાઓ.' },
                    action: { en: 'Start Chat', gu: 'ચેટ શરૂ કરો' },
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    onClick: () => window.JamieDoesChatbotThings?.open?.()
                  },
                  {
                    icon: 'Mail',
                    title: { en: 'Email Support', gu: 'ઇમેઇલ સપોર્ટ' },
                    desc: { en: 'Get detailed resolution within 24 hours.', gu: '24 કલાકમાં વિગતવાર નિરાકરણ મેળવો.' },
                    action: { en: 'Send Email', gu: 'ઇમેઇલ મોકલો' },
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                    href: 'mailto:support@agrolandportal.com'
                  },
                  {
                    icon: 'Phone',
                    title: { en: 'Phone Support', gu: 'ફોન સપોર્ટ' },
                    desc: { en: 'Available Mon-Sat, 9 AM - 6 PM IST.', gu: 'ઉપલબ્ધ સોમ-શનિ, સવારે 9 - સાંજે 6 IST.' },
                    action: { en: 'Call Now', gu: 'હમણાં કૉલ કરો' },
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    href: 'tel:+917869542310'
                  }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx}
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-[32px] border border-border shadow-elevation-1 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
                  >
                    <div className={`w-20 h-20 ${item.bg} rounded-[24px] flex items-center justify-center mb-6`}>
                      <Icon name={item.icon} className={item.color} size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{language === 'en' ? item.title.en : item.title.gu}</h3>
                    <p className="text-muted-foreground text-sm mb-8 flex-grow leading-relaxed">
                      {language === 'en' ? item.desc.en : item.desc.gu}
                    </p>
                    {item.onClick ? (
                      <Button 
                        variant="default"
                        fullWidth
                        onClick={item.onClick}
                        className="rounded-2xl py-6"
                      >
                        {language === 'en' ? item.action.en : item.action.gu}
                      </Button>
                    ) : (
                      <Button 
                        as="a" 
                        href={item.href}
                        variant="outline"
                        fullWidth
                        className="rounded-2xl py-6 border-2 hover:bg-muted"
                      >
                        {language === 'en' ? item.action.en : item.action.gu}
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HelpCenter;