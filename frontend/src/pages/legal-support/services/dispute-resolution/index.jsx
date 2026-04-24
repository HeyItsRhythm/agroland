import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';
import Footer from '../../../home-landing-page/components/Footer';
import Header from '../../../../components/ui/Header';

const DisputeResolution = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const disputeTypes = [
    {
      icon: 'Map',
      title: language === 'en' ? 'Boundary Disputes' : 'સીમા વિવાદો',
      description: language === 'en' 
        ? 'Resolution of disputes related to property boundaries, encroachments, and right of way issues.'
        : 'મિલકત સીમાઓ, અતિક્રમણ અને રસ્તાના અધિકારના મુદ્દાઓ સંબંધિત વિવાદોનો ઉકેલ.'
    },
    {
      icon: 'Users',
      title: language === 'en' ? 'Inheritance Disputes' : 'વારસા વિવાદો',
      description: language === 'en'
        ? 'Mediation and resolution of conflicts arising from agricultural land inheritance and succession.'
        : 'કૃષિ જમીન વારસો અને ઉત્તરાધિકારથી ઉદ્ભવતા સંઘર્ષોનું મધ્યસ્થી અને ઉકેલ.'
    },
    {
      icon: 'FileText',
      title: language === 'en' ? 'Contract Disputes' : 'કરાર વિવાદો',
      description: language === 'en'
        ? 'Resolution of disagreements related to agricultural land contracts, leases, and agreements.'
        : 'કૃષિ જમીન કરારો, ભાડાપટ્ટા અને કરારો સંબંધિત મતભેદોનો ઉકેલ.'
    },
    {
      icon: 'Droplet',
      title: language === 'en' ? 'Water Rights Disputes' : 'પાણીના અધિકાર વિવાદો',
      description: language === 'en'
        ? 'Addressing conflicts over water access, irrigation rights, and water sharing arrangements.'
        : 'પાણી પહોંચ, સિંચાઈ અધિકારો અને પાણી વહેંચણી વ્યવસ્થા પર સંઘર્ષોને સંબોધિત કરવું.'
    }
  ];

  const resolutionMethods = [
    {
      icon: 'MessageCircle',
      title: language === 'en' ? 'Negotiation' : 'વાટાઘાટ',
      description: language === 'en'
        ? 'Facilitated discussions between parties to reach a mutually acceptable resolution without formal proceedings.'
        : 'ઔપચારિક કાર્યવાહી વિના પરસ્પર સ્વીકાર્ય ઉકેલ સુધી પહોંચવા માટે પક્ષો વચ્ચે સુવિધાજનક ચર્ચાઓ.'
    },
    {
      icon: 'Users',
      title: language === 'en' ? 'Mediation' : 'મધ્યસ્થી',
      description: language === 'en'
        ? 'A neutral third party helps disputing parties find common ground and develop their own solution.'
        : 'તટસ્થ ત્રીજો પક્ષ વિવાદિત પક્ષોને સામાન્ય જમીન શોધવા અને તેમનો પોતાનો ઉકેલ વિકસાવવામાં મદદ કરે છે.'
    },
    {
      icon: 'Award',
      title: language === 'en' ? 'Arbitration' : 'લવાદ',
      description: language === 'en'
        ? 'A formal process where an arbitrator reviews evidence and arguments to make a binding decision.'
        : 'એક ઔપચારિક પ્રક્રિયા જ્યાં લવાદ બંધનકર્તા નિર્ણય લેવા માટે પુરાવા અને દલીલોની સમીક્ષા કરે છે.'
    },
    {
      icon: 'Briefcase',
      title: language === 'en' ? 'Litigation' : 'મુકદ્દમાબાજી',
      description: language === 'en'
        ? 'Court-based resolution when other methods fail, resulting in a legally binding judgment.'
        : 'અન્ય પદ્ધતિઓ નિષ્ફળ જાય ત્યારે કોર્ટ-આધારિત ઉકેલ, જેના પરિણામે કાનૂની રીતે બંધનકર્તા ચુકાદો આવે છે.'
    }
  ];

  const benefits = [
    {
      icon: 'Clock',
      title: language === 'en' ? 'Time Efficiency' : 'સમય કાર્યક્ષમતા',
      description: language === 'en'
        ? 'Alternative dispute resolution methods are typically faster than traditional litigation.'
        : 'વૈકલ્પિક વિવાદ ઉકેલ પદ્ધતિઓ સામાન્ય રીતે પરંપરાગત મુકદ્દમાબાજી કરતાં ઝડપી હોય છે.'
    },
    {
      icon: 'DollarSign',
      title: language === 'en' ? 'Cost Savings' : 'ખર્ચ બચત',
      description: language === 'en'
        ? 'Resolving disputes outside of court can significantly reduce legal expenses.'
        : 'કોર્ટની બહાર વિવાદોનો ઉકેલ કાનૂની ખર્ચમાં નોંધપાત્ર ઘટાડો કરી શકે છે.'
    },
    {
      icon: 'Shield',
      title: language === 'en' ? 'Confidentiality' : 'ગોપનીયતા',
      description: language === 'en'
        ? 'Private resolution processes keep sensitive matters out of public court records.'
        : 'ખાનગી ઉકેલ પ્રક્રિયાઓ સંવેદનશીલ બાબતોને જાહેર કોર્ટ રેકોર્ડ્સથી દૂર રાખે છે.'
    },
    {
      icon: 'Users',
      title: language === 'en' ? 'Relationship Preservation' : 'સંબંધ જાળવણી',
      description: language === 'en'
        ? 'Collaborative approaches help maintain important business and family relationships.'
        : 'સહયોગી અભિગમો મહત્વપૂર્ણ વ્યાપાર અને પારિવારિક સંબંધો જાળવવામાં મદદ કરે છે.'
    }
  ];

  const process = [
    {
      title: language === 'en' ? 'Initial Consultation' : 'પ્રારંભિક પરામર્શ',
      description: language === 'en'
        ? 'We assess your dispute, understand your goals, and recommend the most appropriate resolution approach.'
        : 'અમે તમારા વિવાદનું મૂલ્યાંકન કરીએ છીએ, તમારા લક્ષ્યોને સમજીએ છીએ અને સૌથી યોગ્ય ઉકેલ અભિગમની ભલામણ કરીએ છીએ.'
    },
    {
      title: language === 'en' ? 'Case Evaluation' : 'કેસ મૂલ્યાંકન',
      description: language === 'en'
        ? 'Our legal team analyzes the strengths and weaknesses of your case and develops a strategic plan.'
        : 'અમારી કાનૂની ટીમ તમારા કેસની તાકાત અને નબળાઈઓનું વિશ્લેષણ કરે છે અને વ્યૂહાત્મક યોજના વિકસાવે છે.'
    },
    {
      title: language === 'en' ? 'Resolution Process' : 'ઉકેલ પ્રક્રિયા',
      description: language === 'en'
        ? 'We implement the chosen resolution method, whether negotiation, mediation, arbitration, or litigation.'
        : 'અમે પસંદ કરેલી ઉકેલ પદ્ધતિનો અમલ કરીએ છીએ, પછી ભલે તે વાટાઘાટ, મધ્યસ્થી, લવાદ અથવા મુકદ્દમાબાજી હોય.'
    },
    {
      title: language === 'en' ? 'Agreement & Implementation' : 'કરાર અને અમલીકરણ',
      description: language === 'en'
        ? 'We finalize the resolution agreement and ensure proper implementation of all terms.'
        : 'અમે ઉકેલ કરારને અંતિમ રૂપ આપીએ છીએ અને તમામ શરતોના યોગ્ય અમલીકરણની ખાતરી કરીએ છીએ.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>
          {language === 'en' ? 'Dispute Resolution - Legal Support - AgroLand Portal' : 'વિવાદ ઉકેલ - કાનૂની સહાય - એગ્રોલેન્ડ પોર્ટલ'}
        </title>
        <meta
          name="description"
          content={language === 'en' ? 'Professional dispute resolution services for agricultural land conflicts in Gujarat. We help resolve boundary disputes, inheritance conflicts, contract disagreements, and more.' : 'ગુજરાતમાં કૃષિ જમીન સંઘર્ષો માટે વ્યાવસાયિક વિવાદ ઉકેલ સેવાઓ. અમે સીમા વિવાદો, વારસા સંઘર્ષો, કરાર મતભેદો અને વધુ ઉકેલવામાં મદદ કરીએ છીએ.'}
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-primary/5 border-b border-border">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Link to="/" className="hover:text-foreground">
                    {language === 'en' ? 'Home' : 'હોમ'}
                  </Link>
                  <Icon name="ChevronRight" size={14} className="mx-2" />
                  <Link to="/legal-support" className="hover:text-foreground">
                    {language === 'en' ? 'Legal Support' : 'કાનૂની સહાય'}
                  </Link>
                  <Icon name="ChevronRight" size={14} className="mx-2" />
                  <span>{language === 'en' ? 'Dispute Resolution' : 'વિવાદ ઉકેલ'}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="md:w-2/3">
                    <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                      {language === 'en' ? 'Agricultural Land Dispute Resolution' : 'કૃષિ જમીન વિવાદ ઉકેલ'}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {language === 'en' 
                        ? 'Effective resolution of agricultural property disputes through negotiation, mediation, arbitration, and litigation. Our experienced legal team helps you find the most efficient path to resolution.'
                        : 'વાટાઘાટ, મધ્યસ્થી, લવાદ અને મુકદ્દમાબાજી દ્વારા કૃષિ મિલકત વિવાદોનો અસરકારક ઉકેલ. અમારી અનુભવી કાનૂની ટીમ તમને ઉકેલ માટે સૌથી કાર્યક્ષમ માર્ગ શોધવામાં મદદ કરે છે.'
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button size="lg">
                        <Icon name="MessageCircle" className="mr-2" size={18} />
                        {language === 'en' ? 'Discuss Your Dispute' : 'તમારા વિવાદ પર ચર્ચા કરો'}
                      </Button>
                      <Button variant="outline" size="lg">
                        <Icon name="Phone" className="mr-2" size={18} />
                        {language === 'en' ? 'Contact Us' : 'અમારો સંપર્ક કરો'}
                      </Button>
                    </div>
                  </div>
                  <div className="md:w-1/3 flex justify-center">
                    <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Scale" size={64} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dispute Types Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold mb-8 text-center">
                  {language === 'en' ? 'Types of Disputes We Handle' : 'અમે સંભાળતા વિવાદોના પ્રકારો'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {disputeTypes.map((type, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon name={type.icon} size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{type.title}</h3>
                      <p className="text-muted-foreground">{type.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Resolution Methods Section */}
          <section className="py-12 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold mb-8 text-center">
                  {language === 'en' ? 'Our Resolution Methods' : 'અમારી ઉકેલ પદ્ધતિઓ'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {resolutionMethods.map((method, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon name={method.icon} size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                      <p className="text-muted-foreground">{method.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold mb-8 text-center">
                  {language === 'en' ? 'Benefits of Our Dispute Resolution Services' : 'અમારી વિવાદ ઉકેલ સેવાઓના ફાયદા'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <Icon name={benefit.icon} size={24} className="text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section className="py-12 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold mb-8 text-center">
                  {language === 'en' ? 'Our Dispute Resolution Process' : 'અમારી વિવાદ ઉકેલ પ્રક્રિયા'}
                </h2>

                <div className="space-y-6">
                  {process.map((step, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                          <span className="text-primary font-semibold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Case Studies Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold mb-8 text-center">
                  {language === 'en' ? 'Case Studies' : 'કેસ સ્ટડીઝ'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'Boundary Dispute Resolution' : 'સીમા વિવાદ ઉકેલ'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {language === 'en'
                        ? 'A family in Mehsana was involved in a long-standing boundary dispute with their neighbor. Through our mediation services, we helped both parties reach an amicable agreement without going to court.'
                        : 'મહેસાણામાં એક પરિવાર તેમના પડોશી સાથે લાંબા સમયથી સીમા વિવાદમાં સામેલ હતો. અમારી મધ્યસ્થી સેવાઓ દ્વારા, અમે બંને પક્ષોને કોર્ટમાં ગયા વિના સૌહાર્દપૂર્ણ કરાર પર પહોંચવામાં મદદ કરી.'}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {language === 'en'
                        ? 'Result: Dispute resolved in 6 weeks with a clear boundary agreement and shared maintenance responsibilities.'
                        : 'પરિણામ: સ્પષ્ટ સીમા કરાર અને સહિયારી જાળવણી જવાબદારીઓ સાથે 6 અઠવાડિયામાં વિવાદનો ઉકેલ આવ્યો.'}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'Inheritance Conflict Resolution' : 'વારસા સંઘર્ષ ઉકેલ'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {language === 'en'
                        ? 'Three siblings were in conflict over the division of inherited agricultural land in Rajkot. Our team facilitated a series of structured negotiations that led to an equitable division acceptable to all parties.'
                        : 'રાજકોટમાં વારસામાં મળેલી કૃષિ જમીનના વિભાજન પર ત્રણ ભાઈ-બહેનો સંઘર્ષમાં હતા. અમારી ટીમે માળખાગત વાટાઘાટોની શ્રેણીની સુવિધા આપી જે તમામ પક્ષોને સ્વીકાર્ય ન્યાયી વિભાજન તરફ દોરી ગઈ.'}
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      {language === 'en'
                        ? 'Result: Family relationship preserved with a fair division agreement that respected each sibling\'s interests.'
                        : 'પરિણામ: દરેક ભાઈ-બહેનના હિતોનું સન્માન કરતા ન્યાયી વિભાજન કરાર સાથે પારિવારિક સંબંધ જળવાઈ રહ્યો.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-12 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold mb-8 text-center">
                  {language === 'en' ? 'What Our Clients Say' : 'અમારા ક્લાયન્ટ્સ શું કહે છે'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} name="Star" size={16} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      {language === 'en'
                        ? '"What impressed me most was how the team focused on finding a solution that worked for both parties. They were professional, patient, and truly committed to resolving our boundary dispute fairly."'
                        : '"જે વાત મને સૌથી વધુ પ્રભાવિત કરી તે એ હતી કે ટીમે બંને પક્ષો માટે કામ કરે તેવો ઉકેલ શોધવા પર ધ્યાન કેન્દ્રિત કર્યું. તેઓ વ્યાવસાયિક, ધૈર્યવાન અને ખરેખર અમારા સીમા વિવાદને ન્યાયી રીતે ઉકેલવા માટે પ્રતિબદ્ધ હતા."'}
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Harish Patel</p>
                        <p className="text-sm text-muted-foreground">{language === 'en' ? 'Landowner, Mehsana' : 'જમીન માલિક, મહેસાણા'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Icon key={i} name="Star" size={16} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      {language === 'en'
                        ? '"Our family was facing a complex inheritance dispute that threatened to tear us apart. The mediation services provided helped us communicate effectively and find a solution that respected everyone\'s needs."'
                        : '"અમારો પરિવાર એક જટિલ વારસા વિવાદનો સામનો કરી રહ્યો હતો જે અમને અલગ કરવાની ધમકી આપતો હતો. પૂરી પાડવામાં આવેલી મધ્યસ્થી સેવાઓએ અમને અસરકારક રીતે સંવાદ કરવામાં અને એવો ઉકેલ શોધવામાં મદદ કરી જે દરેકની જરૂરિયાતોનું સન્માન કરે."'}
                    </p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                        <Icon name="User" size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Meena Shah</p>
                        <p className="text-sm text-muted-foreground">{language === 'en' ? 'Farmer, Rajkot' : 'ખેડૂત, રાજકોટ'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-heading font-semibold mb-8 text-center">
                  {language === 'en' ? 'Frequently Asked Questions' : 'વારંવાર પૂછાતા પ્રશ્નો'}
                </h2>

                <div className="space-y-4">
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'How long does dispute resolution typically take?' : 'વિવાદ ઉકેલમાં સામાન્ય રીતે કેટલો સમય લાગે છે?'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'en'
                        ? 'The timeframe varies depending on the complexity of the dispute and the resolution method chosen. Mediation and negotiation can often be completed within 1-3 months, while arbitration may take 3-6 months. Litigation typically takes the longest, often 1-2 years or more.'
                        : 'સમયમર્યાદા વિવાદની જટિલતા અને પસંદ કરેલી ઉકેલ પદ્ધતિના આધારે બદલાય છે. મધ્યસ્થી અને વાટાઘાટો ઘણીવાર 1-3 મહિનાની અંદર પૂર્ણ થઈ શકે છે, જ્યારે લવાદમાં 3-6 મહિના લાગી શકે છે. મુકદ્દમાબાજીમાં સામાન્ય રીતે સૌથી વધુ સમય લાગે છે, ઘણીવાર 1-2 વર્ષ અથવા વધુ.'}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'Which resolution method is best for my situation?' : 'મારી પરિસ્થિતિ માટે કઈ ઉકેલ પદ્ધતિ શ્રેષ્ઠ છે?'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'en'
                        ? 'The best method depends on your specific circumstances, the relationship between the parties, the complexity of the issues, and your desired outcome. During our initial consultation, we\'ll assess your situation and recommend the most appropriate approach.'
                        : 'શ્રેષ્ઠ પદ્ધતિ તમારી ચોક્કસ પરિસ્થિતિઓ, પક્ષો વચ્ચેના સંબંધો, સમસ્યાઓની જટિલતા અને તમારા ઇચ્છિત પરિણામ પર આધાર રાખે છે. અમારા પ્રારંભિક પરામર્શ દરમિયાન, અમે તમારી પરિસ્થિતિનું મૂલ્યાંકન કરીશું અને સૌથી યોગ્ય અભિગમની ભલામણ કરીશું.'}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'What documents should I prepare for the initial consultation?' : 'પ્રારંભિક પરામર્શ માટે મારે કયા દસ્તાવેજો તૈયાર કરવા જોઈએ?'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'en'
                        ? 'Bring any documents related to your dispute, such as property deeds, survey maps, contracts, correspondence between parties, previous court filings (if any), and any other relevant documentation that helps explain the situation.'
                        : 'તમારા વિવાદ સંબંધિત કોઈપણ દસ્તાવેજો લાવો, જેમ કે મિલકત દસ્તાવેજો, સર્વે નકશા, કરારો, પક્ષો વચ્ચેનો પત્રવ્યવહાર, અગાઉની કોર્ટ ફાઇલિંગ (જો કોઈ હોય તો) અને અન્ય કોઈપણ સંબંધિત દસ્તાવેજીકરણ જે પરિસ્થિતિ સમજાવવામાં મદદ કરે.'}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold mb-2">
                      {language === 'en' ? 'Are dispute resolution agreements legally binding?' : 'શું વિવાદ ઉકેલ કરારો કાનૂની રીતે બંધનકર્તા છે?'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'en'
                        ? 'Yes, properly drafted settlement agreements from mediation, negotiation, or arbitration are legally binding and enforceable. We ensure all agreements are properly documented and meet legal requirements to protect your interests.'
                        : 'હા, મધ્યસ્થી, વાટાઘાટ અથવા લવાદમાંથી યોગ્ય રીતે તૈયાર કરેલા સમાધાન કરારો કાનૂની રીતે બંધનકર્તા અને અમલમાં મૂકી શકાય તેવા છે. અમે સુનિશ્ચિત કરીએ છીએ કે તમામ કરારો યોગ્ય રીતે દસ્તાવેજીકરણ કરેલા છે અને તમારા હિતોની સુરક્ષા માટે કાનૂની આવશ્યકતાઓને પૂર્ણ કરે છે.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary/5 border-t border-border py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
                  {language === 'en' ? 'Ready to Resolve Your Dispute?' : 'તમારો વિવાદ ઉકેલવા માટે તૈયાર છો?'}
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {language === 'en'
                    ? 'Contact our experienced legal team today to discuss your agricultural land dispute and explore the most effective resolution options.'
                    : 'તમારા કૃષિ જમીન વિવાદ વિશે ચર્ચા કરવા અને સૌથી અસરકારક ઉકેલ વિકલ્પો શોધવા માટે આજે અમારી અનુભવી કાનૂની ટીમનો સંપર્ક કરો.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    <Icon name="MessageCircle" className="mr-2" size={18} />
                    {language === 'en' ? 'Schedule a Consultation' : 'પરામર્શ શેડ્યૂલ કરો'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Icon name="Phone" className="mr-2" size={18} />
                    {language === 'en' ? 'Call: +91 98765 43210' : 'કૉલ: +91 98765 43210'}
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default DisputeResolution;