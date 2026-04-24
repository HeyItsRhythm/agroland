import React, { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

const SEOContentSection = () => {
  const { language } = useLanguage();
  const [showAllBenefits, setShowAllBenefits] = useState(false);

  const content = {
    en: {
      h1: "AgroLand Gujarat - Agriculture Land for Sale in Gujarat | Land Buy Sell in Gujarat",
      intro: "Welcome to AgroLand Gujarat (agrolandgujarat.in) - Gujarat's #1 trusted marketplace for agriculture land for sale in Gujarat. Whether you want to buy agricultural land, sell farmland, or invest in premium farm properties, AgroLand makes land buy sell in Gujarat simple and secure. We connect farmers, investors, and landowners across all 33 districts of Gujarat with verified agricultural properties.",
      whyChooseTitle: "Why Choose AgroLand Gujarat for Land Buy Sell in Gujarat?",
      benefits: [
        "AgroLand Gujarat offers 100% verified agricultural properties across all 33 districts",
        "Direct land buy sell in Gujarat - connect with sellers without middlemen",
        "Detailed property information with high-quality photos, videos, and map locations",
        "Advanced filters: search by district, taluka, village, price range, and land size",
        "Free property listing for sellers on agrolandgujarat.in - reach thousands of buyers",
        "Secure platform with verified seller information, documents, and contact details",
        "Expert support for agriculture land for sale in Gujarat transactions",
        "Mobile-friendly platform - buy or sell farmland anytime, anywhere"
      ],
      locationsTitle: "AgroLand Gujarat - Agriculture Land for Sale Across All Districts",
      locationsText: "Find 100% verified agriculture land for sale across all 33 districts of Gujarat with AgroLand. From prime farmland in Ahmedabad, Vadodara, Surat, and Rajkot to investment opportunities in Saurashtra, Kutch, and North Gujarat. We verify every property to ensure a secure land buy-sell experience for farmers and investors alike.",
      howItWorksTitle: "How to Buy Agriculture Land in Gujarat Through AgroLand",
      steps: [
        {
          title: "Browse Properties",
          text: "Search through hundreds of verified agricultural land listings across Gujarat. Use our advanced filters to find properties that match your budget, location preference, and size requirements."
        },
        {
          title: "Contact Sellers",
          text: "Connect directly with property owners through WhatsApp, phone, or our messaging system. Get detailed information, schedule property visits, and negotiate prices directly."
        },
        {
          title: "Verify & Purchase",
          text: "Conduct legal verification of property documents including 7/12 extract, property card, and sale deed. Complete the purchase with proper documentation and legal guidance."
        }
      ],
      priceRangeTitle: "Agricultural Land Price Range in Gujarat",
      priceRangeText: "Agricultural land prices in Gujarat vary based on location, soil quality, water availability, and proximity to cities. Prices typically range from ₹5 lakhs to ₹50 lakhs per acre. Premium farmland near major cities like Ahmedabad, Vadodara, and Surat may command higher prices due to better infrastructure and market access. Use AgroLand's price filters to find properties within your budget.",
      documentsTitle: "Important Documents for Buying Agricultural Land",
      documentsText: "When purchasing agricultural land in Gujarat, ensure you verify these essential documents: 7/12 extract (Satbara), Property card (8A), Sale deed, Encumbrance certificate, Land revenue receipts, NA permission (if applicable), and proper identity and address proof. We recommend consulting with a legal expert before finalizing any property transaction.",
      cta: "Start browsing verified agriculture land for sale in Gujarat today and find your perfect farm property!"
    },
    gu: {
      h1: "એગ્રોલેન્ડ ગુજરાત - ગુજરાતમાં જમીન ખરીદો વેચો | ગુજરાતમાં કૃષિ જમીન વેચાણ",
      intro: "એગ્રોલેન્ડ ગુજરાત (agrolandgujarat.in) માં આપનું સ્વાગત છે - ગુજરાતમાં જમીન ખરીદો વેચો માટે નંબર 1 વિશ્વસનીય માર્કેટપ્લેસ. ગુજરાતમાં કૃષિ જમીન વેચાણ, ખેતની જમીન ખરીદો, અથવા પ્રીમિયમ ખેત મિલકતોમાં રોકાણ કરો - એગ્રોલેન્ડ ગુજરાત જમીન ખરીદી વેચાણને સરળ અને સુરક્ષિત બનાવે છે. અમે ગુજરાતના તમામ 33 જિલ્લાઓમાં ચકાસાયેલ કૃષિ મિલકતો સાથે ખેડૂતો, રોકાણકારો અને જમીન માલિકોને જોડીએ છીએ.",
      whyChooseTitle: "ગુજરાતમાં જમીન ખરીદો વેચો માટે એગ્રોલેન્ડ ગુજરાત કેમ પસંદ કરો?",
      benefits: [
        "એગ્રોલેન્ડ ગુજરાત - ગુજરાતના તમામ 33 જિલ્લાઓમાં 100% ચકાસાયેલ કૃષિ મિલકતો",
        "સીધી જમીન ખરીદી વેચાણ ગુજરાત - મધ્યસ્થી વિના વેચાણકર્તાઓ સાથે જોડાઓ",
        "ઉચ્ચ ગુણવત્તાવાળા ફોટા, વિડિયો અને નકશા સ્થાન સાથે વિગતવાર મિલકત માહિતી",
        "અદ્યતન ફિલ્ટર્સ: જિલ્લો, તાલુકો, ગામ, કિંમત શ્રેણી અને જમીનના કદ દ્વારા શોધો",
        "agrolandgujarat.in પર વેચાણકર્તાઓ માટે મફત મિલકત સૂચિ - હજારો ખરીદદારો સુધી પહોંચો",
        "ચકાસાયેલ વેચાણકર્તા માહિતી, દસ્તાવેજો અને સંપર્ક વિગતો સાથે સુરક્ષિત પ્લેટફોર્મ",
        "ગુજરાતમાં કૃષિ જમીન વેચાણ વ્યવહારો માટે નિષ્ણાત સહાય",
        "મોબાઇલ-ફ્રેન્ડલી પ્લેટફોર્મ - ગમે ત્યારે, ગમે ત્યાં ખેતની જમીન ખરીદો અથવા વેચો"
      ],
      locationsTitle: "એગ્રોલેન્ડ ગુજરાત - તમામ જિલ્લાઓમાં કૃષિ જમીન વેચાણ",
      locationsText: "એગ્રોલેન્ડ સાથે ગુજરાતના તમામ ૩૩ જિલ્લાઓમાં ૧૦૦% ચકાસાયેલ કૃષિ જમીન મેળવો. અમદાવાદ, વડોદરા, સુરત અને રાજકોટની મુખ્ય ખેતીની જમીનથી લઈને સૌરાષ્ટ્ર, કચ્છ અને ઉત્તર ગુજરાતમાં રોકાણની તકો સુધી. અમે ખેડૂતો અને રોકાણકારો માટે સુરક્ષિત લે-વેચનો અનુભવ સુનિશ્ચિત કરીએ છીએ.",
      howItWorksTitle: "એગ્રોલેન્ડ દ્વારા ગુજરાતમાં કૃષિ જમીન કેવી રીતે ખરીદવી",
      steps: [
        {
          title: "મિલકતો બ્રાઉઝ કરો",
          text: "ગુજરાતમાં સેંકડો ચકાસાયેલ કૃષિ જમીન સૂચિઓ દ્વારા શોધો. તમારા બજેટ, સ્થાન પસંદગી અને કદની જરૂરિયાતોને અનુરૂપ મિલકતો શોધવા માટે અમારા અદ્યતન ફિલ્ટર્સનો ઉપયોગ કરો."
        },
        {
          title: "વેચાણકર્તાઓનો સંપર્ક કરો",
          text: "વોટ્સએપ, ફોન અથવા અમારી મેસેજિંગ સિસ્ટમ દ્વારા મિલકત માલિકો સાથે સીધો સંપર્ક કરો."
        },
        {
          title: "ચકાસો અને ખરીદો",
          text: "7/12 અર્ક, મિલકત કાર્ડ અને વેચાણ ખત સહિત મિલકત દસ્તાવેજોની કાનૂની ચકાસણી કરો."
        }
      ],
      priceRangeTitle: "ગુજરાતમાં કૃષિ જમીનની કિંમત શ્રેણી",
      priceRangeText: "ગુજરાતમાં કૃષિ જમીનની કિંમતો સ્થાન, માટીની ગુણવત્તા, પાણીની ઉપલબ્ધતા અને શહેરોની નજીકતાના આધારે બદલાય છે. કિંમતો સામાન્ય રીતે ₹5 લાખથી ₹50 લાખ પ્રતિ એકર સુધીની હોય છે.",
      documentsTitle: "કૃષિ જમીન ખરીદવા માટે મહત્વપૂર્ણ દસ્તાવેજો",
      documentsText: "ગુજરાતમાં કૃષિ જમીન ખરીદતી વખતે, આ આવશ્યક દસ્તાવેજો ચકાસો: 7/12 અર્ક (સાતબારા), મિલકત કાર્ડ (8A), વેચાણ ખત, એન્કમ્બરન્સ પ્રમાણપત્ર, જમીન મહેસૂલ રસીદો.",
      cta: "આજે જ ગુજરાતમાં વેચાણ માટે ચકાસાયેલ કૃષિ જમીન બ્રાઉઝ કરવાનું શરૂ કરો!"
    }
  };

  const t = content[language] || content.en;

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-green-50/50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Main Heading & Intro */}
        <div className="text-center mb-16 max-w-4xl mx-auto relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-20 animate-pulse delay-700"></div>

          <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-900 mb-6 leading-tight tracking-tight">
            {t.h1}
          </h1>
          <p className="relative text-lg md:text-xl text-gray-600 leading-relaxed">
            {t.intro}
          </p>
        </div>

        {/* Why Choose AgroLand */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-3">Benefits</span>
            <h2 className="text-3xl font-bold text-gray-900">
              {t.whyChooseTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {t.benefits.map((benefit, index) => (
              <div
                key={index}
                className={`group flex items-start gap-4 p-6 bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-transparent hover:border-green-100 hover:-translate-y-1 ${index >= 3 && !showAllBenefits ? 'hidden md:flex' : 'flex'
                  }`}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300">
                  <svg className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <p className="text-gray-700 font-medium text-lg group-hover:text-green-900 transition-colors duration-200 leading-snug">
                    {benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button (Mobile Only) */}
          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => setShowAllBenefits(!showAllBenefits)}
              className="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-full text-green-600 bg-white hover:bg-green-50 transition-colors duration-200"
            >
              {showAllBenefits ? (
                <>
                  {language === 'gu' ? 'ઓછું બતાવો' : 'Show Less'}
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  {language === 'gu' ? 'વધુ બતાવો' : 'Show More'}
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Locations */}
        <div className="mb-20 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-green-400"></div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {t.locationsTitle}
          </h2>
          <p className="text-gray-600 leading-loose max-w-5xl mx-auto">
            {t.locationsText}
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-3">Process</span>
            <h2 className="text-3xl font-bold text-gray-900">
              {t.howItWorksTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.steps.map((step, index) => (
              <div key={index} className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors duration-300">
                <div className="absolute -top-6 left-8 bg-gradient-to-br from-green-500 to-green-600 text-white w-12 h-12 flex items-center justify-center rounded-xl text-xl font-bold shadow-lg shadow-green-200">
                  {index + 1}
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Split Section: Price Range & Documents */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-green-50/80 p-8 rounded-2xl border border-green-100">
            <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {t.priceRangeTitle}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t.priceRangeText}
            </p>
          </div>

          <div className="bg-blue-50/80 p-8 rounded-2xl border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              {t.documentsTitle}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t.documentsText}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="relative text-center bg-gradient-to-r from-green-700 to-green-600 text-white p-10 md:p-14 rounded-3xl shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <h3 className="text-2xl md:text-3xl font-bold mb-6 max-w-2xl mx-auto">{t.cta}</h3>
          <a
            href="/property-listings-search"
            className="inline-flex items-center justify-center bg-white text-green-700 font-bold py-4 px-10 rounded-full hover:bg-green-50 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            {language === 'gu' ? 'મિલકતો બ્રાઉઝ કરો' : 'Browse Properties'}
            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SEOContentSection;
