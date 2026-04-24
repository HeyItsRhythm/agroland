import React from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import Icon from './AppIcon';


const ChatButton = () => {
  const [language, setLanguage] = React.useState('en');

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);
  }, []);

  const handleChatOpen = () => {
    if (window.JamieDoesChatbotThings && window.JamieDoesChatbotThings.open) {
      window.JamieDoesChatbotThings.open();
    } else {
      console.log('Chat functionality not available');
      toast.error(language === 'en' 
        ? 'Chat functionality is currently unavailable. Please try again later or use another contact method.'
        : 'ચેટ કાર્યક્ષમતા હાલમાં અનુપલબ્ધ છે. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો અથવા અન્ય સંપર્ક પદ્ધતિનો ઉપયોગ કરો.'
      );
    }
  };

  const location = useLocation();
  const hiddenPaths = ['/seller-dashboard/add-property'];
  const isHidden = hiddenPaths.includes(location.pathname);

  if (isHidden) return null;

  return (

    <button
      onClick={handleChatOpen}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-14 h-14 bg-primary rounded-full shadow-elevation-3 flex items-center justify-center hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      aria-label={language === 'en' ? 'Open chat' : 'ચેટ ખોલો'}
    >
      <Icon name="MessageCircle" className="text-white" size={24} />
    </button>
  );
};

export default ChatButton;