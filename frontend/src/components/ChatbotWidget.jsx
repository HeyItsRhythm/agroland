import React, { useState, useEffect, useRef } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';
import chatbotService from '../utils/chatbotService';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [providerStatus, setProviderStatus] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get language preference from localStorage
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    // Get provider status
    const status = chatbotService.getProviderStatus();
    setProviderStatus(status);

    // Add welcome message
    const welcomeMessage = savedLanguage === 'en'
      ? 'Hello! I\'m AgroLand Assistant. How can I help you today?'
      : 'નમસ્તે! હું એગ્રોલેન્ડ સહાયક છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?';
    
    setMessages([{
      type: 'bot',
      text: welcomeMessage,
      timestamp: new Date()
    }]);

    // Expose the open method to the window object
    if (window) {
      window.JamieDoesChatbotThings = {
        open: () => setIsOpen(true)
      };
    }

    return () => {
      // Clean up
      if (window && window.JamieDoesChatbotThings) {
        delete window.JamieDoesChatbotThings;
      }
    };
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(inputMessage, language);
      
      if (response && response.success) {
        const botMessage = {
          type: 'bot',
          text: response.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // If response is not successful, use a fallback response
        const fallbackMessage = {
          type: 'bot',
          text: language === 'en' 
            ? "I'm here to help with AgroLand Portal! How can I assist you today?"
            : "હું એગ્રોલેન્ડ પોર્ટલમાં મદદ કરવા માટે અહીં છું! આજે હું તમને કેવી રીતે મદદ કરી શકું?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      
      // Always provide a helpful response, never show error to user
      const fallbackMessage = {
        type: 'bot',
        text: language === 'en' 
          ? "I'm here to help with AgroLand Portal! How can I assist you today?"
          : "હું એગ્રોલેન્ડ પોર્ટલમાં મદદ કરવા માટે અહીં છું! આજે હું તમને કેવી રીતે મદદ કરી શકું?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetChat = () => {
    chatbotService.clearHistory();
    
    const welcomeMessage = language === 'en'
      ? 'Chat has been reset. How can I help you?'
      : 'ચેટ રીસેટ કરવામાં આવી છે. હું તમને કેવી રીતે મદદ કરી શકું?';
    
    setMessages([{
      type: 'bot',
      text: welcomeMessage,
      timestamp: new Date()
    }]);
    
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get provider display name
  const getProviderDisplayName = () => {
    if (providerStatus?.n8n && providerStatus?.current === 'n8n') {
      return language === 'en' ? 'n8n Chatbot' : 'n8n ચેટબોટ';
    } else if (providerStatus?.gemini) {
      return language === 'en' ? 'Gemini AI' : 'Gemini AI';
    } else if (providerStatus?.perplexity) {
      return language === 'en' ? 'Perplexity AI' : 'Perplexity AI';
    }
    return language === 'en' ? 'AI Assistant' : 'AI સહાયક';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 left-0 sm:bottom-4 sm:right-4 sm:left-auto z-50 flex flex-col w-full sm:w-[400px] h-[85vh] sm:h-[600px] sm:max-h-[calc(100vh-2rem)] bg-card rounded-t-2xl sm:rounded-xl shadow-elevation-3 border-t sm:border border-border overflow-hidden transition-all duration-300 ease-in-out">
      
      {/* Header */}
      <div className="bg-primary px-4 py-4 sm:px-6 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center min-w-0">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mr-3 flex-shrink-0 border border-white/10">
            <Icon name="MessageCircle" className="text-white" size={20} />
          </div>
          <div className="truncate">
            <h3 className="text-white font-bold text-sm sm:text-base leading-tight truncate">
              {language === 'en' ? 'AgroLand Assistant' : 'એગ્રોલેન્ડ સહાયક'}
            </h3>
            <p className="text-white/70 text-[10px] sm:text-xs font-medium truncate">
               <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
              {getProviderDisplayName()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={resetChat}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
            title={language === 'en' ? 'Reset Chat' : 'ચેટ રીસેટ કરો'}
          >
            <Icon name="RefreshCw" size={18} />
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-90"
            aria-label="Close"
          >
            <Icon name="X" size={22} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-background/50">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'}`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>
                <div 
                  className={`text-xs mt-1 ${message.type === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'}`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground max-w-[80%] rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={language === 'en' ? 'Type your message...' : 'તમારો સંદેશ લખો...'}
              className="w-full p-3 pr-10 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-background text-foreground placeholder:text-muted-foreground"
              rows="2"
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputMessage.trim()}
            className="h-10 w-10 rounded-full p-0 flex items-center justify-center"
          >
            <Icon name="Send" size={18} />
          </Button>
        </div>
        
        {/* Status and Help */}
        <div className="mt-2 text-xs text-muted-foreground text-center">
          {providerStatus?.gemini || providerStatus?.perplexity ? (
            <span>
              {language === 'en' 
                ? `Powered by ${getProviderDisplayName()}`
                : `${getProviderDisplayName()} દ્વારા સંચાલિત`}
            </span>
          ) : (
            <span className="text-amber-600">
              {language === 'en' 
                ? 'Using fallback responses - Add API keys for AI features'
                : 'ફોલબેક જવાબોનો ઉપયોગ કરી રહ્યા છીએ - AI સુવિધાઓ માટે API કી ઉમેરો'}
            </span>
          )}
        </div>
        
        {/* Quick Help */}
        <div className="mt-2 text-xs text-muted-foreground">
          <p className="text-center mb-1">
            {language === 'en' ? 'Try asking about:' : 'આ વિશે પૂછવાનો પ્રયાસ કરો:'}
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            {['properties', 'account', 'help'].map((topic) => (
              <button
                key={topic}
                onClick={() => setInputMessage(language === 'en' ? `Tell me about ${topic}` : `${topic} વિશે મને જણાવો`)}
                className="px-2 py-1 bg-muted rounded text-xs hover:bg-muted/80 transition-colors"
              >
                {language === 'en' ? topic : topic === 'properties' ? 'પ્રોપર્ટીઝ' : topic === 'account' ? 'એકાઉન્ટ' : 'મદદ'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;