import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../home-landing-page/components/Footer';
import Icon from '../../components/AppIcon';

const TermsOfService = () => {
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
            {language === 'en' ? 'Terms of Service' : 'સેવાની શરતો'}
          </span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            {language === 'en' ? 'Terms of Service' : 'સેવાની શરતો'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {language === 'en' ? 'Last updated: June 15, 2023' : 'છેલ્લે અપડેટ કરેલ: જૂન 15, 2023'}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          {language === 'en' ? (
            <>
              <h2>Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you and AgroLand Portal ("we," "us," or "our"), concerning your access to and use of the AgroLand Portal website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
              </p>
              <p>
                You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Site and you must discontinue use immediately.
              </p>

              <h2>User Registration</h2>
              <p>
                You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
              </p>

              <h2>User Representations</h2>
              <p>By using the Site, you represent and warrant that:</p>
              <ol>
                <li>All registration information you submit will be true, accurate, current, and complete;</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary;</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service;</li>
                <li>You are not a minor in the jurisdiction in which you reside;</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise;</li>
                <li>You will not use the Site for any illegal or unauthorized purpose;</li>
                <li>Your use of the Site will not violate any applicable law or regulation.</li>
              </ol>

              <h2>Prohibited Activities</h2>
              <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
              <p>As a user of the Site, you agree not to:</p>
              <ol>
                <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
                <li>Use the Site to advertise or offer to sell goods and services.</li>
                <li>Circumvent, disable, or otherwise interfere with security-related features of the Site.</li>
                <li>Engage in unauthorized framing of or linking to the Site.</li>
                <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                <li>Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site.</li>
                <li>Attempt to impersonate another user or person or use the username of another user.</li>
              </ol>

              <h2>Submissions</h2>
              <p>
                You acknowledge and agree that any questions, comments, suggestions, ideas, feedback, or other information regarding the Site ("Submissions") provided by you to us are non-confidential and shall become our sole property. We shall own exclusive rights, including all intellectual property rights, and shall be entitled to the unrestricted use and dissemination of these Submissions for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.
              </p>

              <h2>Site Management</h2>
              <p>
                We reserve the right, but not the obligation, to: (1) monitor the Site for violations of these Terms of Service; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Terms of Service, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Site or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Site in a manner designed to protect our rights and property and to facilitate the proper functioning of the Site.
              </p>

              <h2>Term and Termination</h2>
              <p>
                These Terms of Service shall remain in full force and effect while you use the Site. WITHOUT LIMITING ANY OTHER PROVISION OF THESE TERMS OF SERVICE, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SITE (INCLUDING BLOCKING CERTAIN IP ADDRESSES), TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE TERMS OF SERVICE OR OF ANY APPLICABLE LAW OR REGULATION. WE MAY TERMINATE YOUR USE OR PARTICIPATION IN THE SITE OR DELETE YOUR ACCOUNT AND ANY CONTENT OR INFORMATION THAT YOU POSTED AT ANY TIME, WITHOUT WARNING, IN OUR SOLE DISCRETION.
              </p>

              <h2>Modifications and Interruptions</h2>
              <p>
                We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
              </p>

              <h2>Governing Law</h2>
              <p>
                These Terms of Service and your use of the Site are governed by and construed in accordance with the laws of India applicable to agreements made and to be entirely performed within India, without regard to its conflict of law principles.
              </p>

              <h2>Contact Us</h2>
              <p>
                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at: <a href="mailto:legal@agrolandportal.com" className="text-primary hover:text-primary/80">legal@agrolandportal.com</a>
              </p>
            </>
          ) : (
            <>
              <h2>શરતો સાથે સંમતિ</h2>
              <p>
                આ સેવાની શરતો તમારા અને AgroLand Portal ("અમે," "અમને," અથવા "અમારું") વચ્ચે કાનૂની રીતે બંધનકર્તા કરાર બનાવે છે, જે AgroLand Portal વેબસાઇટ તેમજ અન્ય કોઈપણ મીડિયા ફોર્મ, મીડિયા ચેનલ, મોબાઇલ વેબસાઇટ અથવા મોબાઇલ એપ્લિકેશન સંબંધિત, લિંક કરેલ, અથવા અન્યથા તેની સાથે જોડાયેલ (સામૂહિક રીતે, "સાઇટ") ની તમારી ઍક્સેસ અને ઉપયોગને લગતી છે.
              </p>
              <p>
                તમે સંમત થાઓ છો કે સાઇટને ઍક્સેસ કરીને, તમે આ બધી સેવાની શરતો વાંચી છે, સમજી છે, અને તેનાથી બંધાયેલા રહેવા સંમત થાઓ છો. જો તમે આ બધી સેવાની શરતો સાથે સંમત નથી, તો તમને સાઇટનો ઉપયોગ કરવાથી સ્પષ્ટપણે પ્રતિબંધિત કરવામાં આવે છે અને તમારે તરત જ ઉપયોગ બંધ કરવો આવશ્યક છે.
              </p>

              <h2>વપરાશકર્તા નોંધણી</h2>
              <p>
                તમારે સાઇટ સાથે નોંધણી કરાવવાની જરૂર પડી શકે છે. તમે તમારો પાસવર્ડ ગુપ્ત રાખવા સંમત થાઓ છો અને તમારા એકાઉન્ટ અને પાસવર્ડના તમામ ઉપયોગ માટે જવાબદાર રહેશો. જો અમે નિર્ધારિત કરીએ છીએ, અમારી એકમાત્ર વિવેકબુદ્ધિમાં, કે આવું વપરાશકર્તા નામ અયોગ્ય, અશ્લીલ, અથવા અન્યથા વાંધાજનક છે, તો અમે તમે પસંદ કરેલા વપરાશકર્તા નામને દૂર કરવાનો, પુનઃપ્રાપ્ત કરવાનો, અથવા બદલવાનો અધિકાર અનામત રાખીએ છીએ.
              </p>

              <h2>વપરાશકર્તા રજૂઆતો</h2>
              <p>સાઇટનો ઉપયોગ કરીને, તમે રજૂ કરો છો અને ખાતરી આપો છો કે:</p>
              <ol>
                <li>તમે સબમિટ કરેલી તમામ નોંધણી માહિતી સાચી, સચોટ, વર્તમાન અને સંપૂર્ણ હશે;</li>
                <li>તમે આવી માહિતીની ચોકસાઈ જાળવી રાખશો અને જરૂર મુજબ આવી નોંધણી માહિતીને ત્વરિતપણે અપડેટ કરશો;</li>
                <li>તમારી પાસે કાનૂની ક્ષમતા છે અને તમે આ સેવાની શરતોનું પાલન કરવા સંમત થાઓ છો;</li>
                <li>તમે તમે રહો છો તે અધિકારક્ષેત્રમાં સગીર નથી;</li>
                <li>તમે બોટ, સ્ક્રિપ્ટ, અથવા અન્યથા, સ્વચાલિત અથવા બિન-માનવ માધ્યમો દ્વારા સાઇટને ઍક્સેસ કરશો નહીં;</li>
                <li>તમે કોઈપણ ગેરકાયદેસર અથવા અનધિકૃત હેતુ માટે સાઇટનો ઉપયોગ કરશો નહીં;</li>
                <li>સાઇટનો તમારો ઉપયોગ કોઈપણ લાગુ કાયદા અથવા નિયમનનું ઉલ્લંઘન કરશે નહીં.</li>
              </ol>

              <h2>પ્રતિબંધિત પ્રવૃત્તિઓ</h2>
              <p>તમે સાઇટને અન્ય કોઈપણ હેતુ માટે ઍક્સેસ કરી શકતા નથી અથવા ઉપયોગ કરી શકતા નથી સિવાય કે જેના માટે અમે સાઇટને ઉપલબ્ધ કરીએ છીએ. સાઇટનો ઉપયોગ કોઈપણ વ્યાવસાયિક પ્રયાસો સાથે જોડાણમાં કરી શકાતો નથી સિવાય કે તે જે અમારા દ્વારા ખાસ કરીને સમર્થિત અથવા મંજૂર કરવામાં આવ્યા હોય.</p>
              <p>સાઇટના વપરાશકર્તા તરીકે, તમે નીચેના કાર્યો ન કરવા સંમત થાઓ છો:</p>
              <ol>
                <li>અમારી લેખિત પરવાનગી વિના સીધી રીતે અથવા પરોક્ષ રીતે, સંગ્રહ, સંકલન, ડેટાબેસ, અથવા ડિરેક્ટરી બનાવવા અથવા સંકલિત કરવા માટે સાઇટમાંથી ડેટા અથવા અન્ય સામગ્રીને વ્યવસ્થિત રીતે પુનઃપ્રાપ્ત કરવી.</li>
                <li>અનિચ્છનીય ઇમેઇલ મોકલવાના હેતુ માટે ઇલેક્ટ્રોનિક અથવા અન્ય માધ્યમો દ્વારા વપરાશકર્તાઓના વપરાશકર્તા નામો અને/અથવા ઇમેઇલ સરનામાંઓ એકત્રિત કરવા સહિત, સાઇટનો કોઈપણ અનધિકૃત ઉપયોગ કરવો, અથવા સ્વચાલિત માધ્યમો દ્વારા અથવા ખોટા બહાના હેઠળ વપરાશકર્તા ખાતા બનાવવા.</li>
                <li>માલ અને સેવાઓ વેચવા માટે જાહેરાત આપવા અથવા ઓફર કરવા માટે સાઇટનો ઉપયોગ કરવો.</li>
                <li>સાઇટની સુરક્ષા-સંબંધિત સુવિધાઓને ફરતે જવું, અક્ષમ કરવું, અથવા અન્યથા દખલ કરવી.</li>
                <li>સાઇટના અનધિકૃત ફ્રેમિંગ અથવા લિંકિંગમાં સામેલ થવું.</li>
                <li>અમને અને અન્ય વપરાશકર્તાઓને છેતરવા, ધોખો આપવા, અથવા ગેરમાર્ગે દોરવા, ખાસ કરીને વપરાશકર્તા પાસવર્ડ જેવી સંવેદનશીલ ખાતા માહિતી શીખવાના કોઈપણ પ્રયાસમાં.</li>
                <li>અમારી સપોર્ટ સેવાઓનો અયોગ્ય ઉપયોગ કરવો અથવા દુરુપયોગ અથવા ગેરવર્તણૂકના ખોટા અહેવાલો સબમિટ કરવા.</li>
                <li>ટિપ્પણીઓ અથવા સંદેશાઓ મોકલવા માટે સ્ક્રિપ્ટનો ઉપયોગ કરવા જેવા સિસ્ટમના કોઈપણ સ્વચાલિત ઉપયોગમાં સામેલ થવું, અથવા કોઈપણ ડેટા માઇનિંગ, રોબોટ્સ, અથવા સમાન ડેટા એકત્રિત કરવા અને નિષ્કર્ષણ સાધનોનો ઉપયોગ કરવો.</li>
                <li>સાઇટ અથવા સાઇટ સાથે જોડાયેલા નેટવર્ક્સ અથવા સેવાઓમાં દખલ કરવી, વિક્ષેપ પાડવો, અથવા અયોગ્ય બોજો ઊભો કરવો.</li>
                <li>અન્ય વપરાશકર્તા અથવા વ્યક્તિની નકલ કરવાનો પ્રયાસ કરવો અથવા અન્ય વપરાશકર્તાના વપરાશકર્તા નામનો ઉપયોગ કરવો.</li>
              </ol>

              <h2>સબમિશન્સ</h2>
              <p>
                તમે સ્વીકારો છો અને સંમત થાઓ છો કે સાઇટ સંબંધિત કોઈપણ પ્રશ્નો, ટિપ્પણીઓ, સૂચનો, વિચારો, પ્રતિસાદ, અથવા અન્ય માહિતી ("સબમિશન્સ") જે તમારા દ્વારા અમને પ્રદાન કરવામાં આવે છે તે બિન-ગોપનીય છે અને અમારી એકમાત્ર મિલકત બની જશે. અમે બૌદ્ધિક સંપત્તિના અધિકારો સહિત, વિશિષ્ટ અધિકારોના માલિક રહેશું, અને તમને સ્વીકૃતિ અથવા વળતર વિના, કોઈપણ કાયદેસર હેતુ, વ્યાવસાયિક અથવા અન્યથા, માટે આ સબમિશન્સના અપ્રતિબંધિત ઉપયોગ અને પ્રસારણ માટે હકદાર રહેશું.
              </p>

              <h2>સાઇટ મેનેજમેન્ટ</h2>
              <p>
                અમે અધિકાર અનામત રાખીએ છીએ, પરંતુ જવાબદારી નહીં: (1) આ સેવાની શરતોના ઉલ્લંઘન માટે સાઇટની દેખરેખ રાખવી; (2) જે કોઈપણ, અમારી એકમાત્ર વિવેકબુદ્ધિમાં, કાયદા અથવા આ સેવાની શરતોનું ઉલ્લંઘન કરે છે, તેની વિરુદ્ધ યોગ્ય કાનૂની પગલાં લેવા, જેમાં આવા વપરાશકર્તાને કાયદા અમલીકરણ સત્તાવાળાઓને જાણ કરવી સહિત મર્યાદા વિના; (3) અમારી એકમાત્ર વિવેકબુદ્ધિમાં અને મર્યાદા વિના, તમારા યોગદાન અથવા તેના કોઈપણ ભાગને નકારવા, ઍક્સેસને પ્રતિબંધિત કરવા, ઉપલબ્ધતાને મર્યાદિત કરવા, અથવા અક્ષમ કરવા (તકનીકી રીતે શક્ય હોય ત્યાં સુધી); (4) અમારી એકમાત્ર વિવેકબુદ્ધિમાં અને મર્યાદા, નોટિસ, અથવા જવાબદારી વિના, સાઇટમાંથી દૂર કરવા અથવા અન્યથા તમામ ફાઇલો અને સામગ્રી અક્ષમ કરવા જે કદમાં અત્યંત વધારે છે અથવા કોઈપણ રીતે અમારી સિસ્ટમ્સ માટે બોજારૂપ છે; અને (5) અન્યથા સાઇટનું સંચાલન એવી રીતે કરવું જે અમારા અધિકારો અને મિલકતનું રક્ષણ કરવા અને સાઇટના યોગ્ય કાર્યને સુવિધાજનક બનાવવા માટે રચાયેલ છે.
              </p>

              <h2>મુદત અને સમાપ્તિ</h2>
              <p>
                આ સેવાની શરતો તમે સાઇટનો ઉપયોગ કરો ત્યાં સુધી પૂર્ણ બળ અને અસરમાં રહેશે. આ સેવાની શરતોની કોઈપણ અન્ય જોગવાઈને મર્યાદિત કર્યા વિના, અમે અધિકાર અનામત રાખીએ છીએ, અમારી એકમાત્ર વિવેકબુદ્ધિમાં અને નોટિસ અથવા જવાબદારી વિના, કોઈપણ વ્યક્તિને કોઈપણ કારણસર અથવા કોઈ કારણ વિના, સાઇટની ઍક્સેસ અને ઉપયોગ (ચોક્કસ IP સરનામાંઓને અવરોધિત કરવા સહિત) નકારવા, જેમાં આ સેવાની શરતોમાં સમાવિષ્ટ કોઈપણ રજૂઆત, વોરંટી, અથવા કરારના ઉલ્લંઘન અથવા કોઈપણ લાગુ કાયદા અથવા નિયમનના ઉલ્લંઘન માટે મર્યાદા વિના સમાવેશ થાય છે. અમે તમારા સાઇટના ઉપયોગ અથવા ભાગીદારીને સમાપ્ત કરી શકીએ છીએ અથવા તમારું ખાતું અને તમે પોસ્ટ કરેલી કોઈપણ સામગ્રી અથવા માહિતીને કોઈપણ સમયે, ચેતવણી વિના, અમારી એકમાત્ર વિવેકબુદ્ધિમાં કાઢી શકીએ છીએ.
              </p>

              <h2>સુધારાઓ અને વિક્ષેપો</h2>
              <p>
                અમે કોઈપણ સમયે અથવા કોઈપણ કારણસર અમારી એકમાત્ર વિવેકબુદ્ધિમાં નોટિસ વિના સાઇટની સામગ્રીને બદલવા, સુધારવા, અથવા દૂર કરવાનો અધિકાર અનામત રાખીએ છીએ. જો કે, અમારી સાઇટ પરની કોઈપણ માહિતીને અપડેટ કરવાની અમારી કોઈ જવાબદારી નથી. અમે કોઈપણ સમયે નોટિસ વિના સાઇટના તમામ અથવા ભાગને સુધારવા અથવા બંધ કરવાનો અધિકાર પણ અનામત રાખીએ છીએ.
              </p>

              <h2>શાસક કાયદો</h2>
              <p>
                આ સેવાની શરતો અને સાઇટનો તમારો ઉપયોગ ભારતના કાયદાઓ દ્વારા નિયંત્રિત અને અર્થઘટન કરવામાં આવે છે જે ભારતની અંદર કરવામાં આવેલા અને સંપૂર્ણપણે ભારતમાં કરવાના કરારોને લાગુ પડે છે, તેના સંઘર્ષના કાયદાના સિદ્ધાંતોને ધ્યાનમાં લીધા વિના.
              </p>

              <h2>અમારો સંપર્ક કરો</h2>
              <p>
                સાઇટ સંબંધિત ફરિયાદનો ઉકેલ લાવવા માટે અથવા સાઇટના ઉપયોગ સંબંધિત વધુ માહિતી મેળવવા માટે, કૃપા કરીને અમારો સંપર્ક કરો: <a href="mailto:legal@agrolandportal.com" className="text-primary hover:text-primary/80">legal@agrolandportal.com</a>
              </p>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;