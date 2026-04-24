import { GoogleGenerativeAI } from '@google/generative-ai';

class ChatbotService {
  constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.perplexityApiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    this.n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    this.initialized = false;
    this.chatHistory = [];
    this.currentProvider = this.n8nWebhookUrl ? 'n8n' : 'gemini'; // Default to n8n if available

    console.log('Chatbot service initializing...');
    console.log('Gemini API key available:', !!this.geminiApiKey);
    console.log('Perplexity API key available:', !!this.perplexityApiKey);

    // Initialize Gemini if API key is available
    if (this.geminiApiKey) {
      try {
        console.log('Initializing Gemini with API key and v1beta endpoint (Gemini 2.0)...');
        this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
        // Using 'gemini-2.0-flash' as it's available for this key in Dec 2025
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });
        this.initialized = true;
        console.log('✅ Gemini API initialized successfully with gemini-2.0-flash (v1beta)');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini API during construction:', error);
        this.initialized = false;
      }
    } else {
      console.log('⚠️ No Gemini API key found - using fallback responses');
    }

    console.log('Chatbot service initialized. Init status:', this.initialized);
  }

  async initialize() {
    if (this.geminiApiKey && !this.initialized) {
      try {
        console.log('Attempting to re-initialize Gemini API...');
        // Initialize Gemini if not already done in constructor
        if (!this.genAI) {
          this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
          this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });
          console.log('Gemini API initialized during initialize call (v1beta - 2.0)');
        }
        this.initialized = true;
        return Promise.resolve();
      } catch (error) {
        console.error('❌ Failed to initialize Gemini API in initialize():', error);
        this.initialized = false;
        return Promise.reject(error);
      }
    }

    return Promise.resolve();
  }

  // Define comprehensive fallback responses
  fallbackResponses = {
    en: [
      "I'm here to help with AgroLand Portal questions! I can assist with property listings, user accounts, and general inquiries.",
      "Welcome to AgroLand! I'm your AI assistant. How can I help you with agricultural properties today?",
      "Hello! I'm here to help you navigate AgroLand Portal. What would you like to know about?",
      "I'm your AgroLand assistant! I can help with property searches, account management, and more.",
      "Hi there! I'm ready to help you with AgroLand Portal. What can I assist you with today?"
    ],
    gu: [
      "હું એગ્રોલેન્ડ પોર્ટલ પ્રશ્નોમાં મદદ કરવા માટે અહીં છું! હું પ્રોપર્ટી લિસ્ટિંગ્સ, વપરાશકર્તા ખાતાઓ અને સામાન્ય પૂછપરછમાં મદદ કરી શકું છું.",
      "એગ્રોલેન્ડમાં આપનું સ્વાગત છે! હું તમારો AI સહાયક છું. આજે કૃષિ પ્રોપર્ટીઝમાં હું તમને કેવી રીતે મદદ કરી શકું?",
      "નમસ્તે! હું તમને એગ્રોલેન્ડ પોર્ટલમાં નેવિગેટ કરવામાં મદદ કરવા માટે અહીં છું. તમે શું જાણવા માંગો છો?",
      "હું તમારો એગ્રોલેન્ડ સહાયક છું! હું પ્રોપર્ટી શોધ, એકાઉન્ટ મેનેજમેન્ટ અને વધુમાં મદદ કરી શકું છું.",
      "હાય! હું એગ્રોલેન્ડ પોર્ટલમાં તમને મદદ કરવા માટે તૈયાર છું. આજે હું તમને શું મદદ કરી શકું?"
    ]
  };

  // Define context-aware responses for common questions
  contextResponses = {
    en: {
      'property': [
        "I can help you find agricultural properties! You can search by location, price range, or property type. Would you like me to guide you through the search process?",
        "Looking for properties? I can help you navigate our property listings. We have agricultural, residential, and commercial properties available.",
        "Property search is easy on AgroLand! You can filter by district, price, or land type. What kind of property are you looking for?",
        "I can help you find the perfect agricultural land! Our search filters include location, size, price, and soil type. What's your preferred area?",
        "Need help finding properties? I can guide you through our advanced search options including map view, price ranges, and property features."
      ],
      'account': [
        "Need help with your account? I can guide you through login, registration, or profile updates. What specific account issue are you experiencing?",
        "Account management is straightforward on AgroLand. I can help with password resets, profile updates, or account settings.",
        "Having trouble with your account? Let me know what you need help with - login, registration, or something else?",
        "I can help you manage your AgroLand account! This includes profile updates, password changes, and account preferences.",
        "Account issues? I'm here to help! Whether it's login problems, registration, or profile management, I can guide you through it."
      ],
      'help': [
        "I'm here to help! I can assist with property searches, account management, general inquiries, and more. What do you need help with?",
        "Need assistance? I can help you navigate AgroLand Portal, find properties, manage your account, or answer any questions you have.",
        "I'm your AgroLand assistant! I can help with property listings, user accounts, search functionality, and general support.",
        "How can I help you today? I'm knowledgeable about properties, accounts, search features, and general portal navigation.",
        "I'm here to make your AgroLand experience better! Ask me about properties, accounts, search tips, or anything else you need help with."
      ]
    },
    gu: {
      'property': [
        "હું તમને કૃષિ પ્રોપર્ટીઝ શોધવામાં મદદ કરી શકું છું! તમે સ્થાન, કિંમત રેન્જ અથવા પ્રોપર્ટી પ્રકાર દ્વારા શોધી શકો છો. શું તમે ચાહો છો કે હું તમને શોધ પ્રક્રિયા દ્વારા માર્ગદર્શન કરું?",
        "પ્રોપર્ટીઝ શોધી રહ્યા છો? હું તમને અમારી પ્રોપર્ટી લિસ્ટિંગ્સમાં નેવિગેટ કરવામાં મદદ કરી શકું છું. અમારી પાસે કૃષિ, રહેણાંક અને વ્યાપારી પ્રોપર્ટીઝ ઉપલબ્ધ છે.",
        "એગ્રોલેન્ડ પર પ્રોપર્ટી શોધ સરળ છે! તમે જિલ્લા, કિંમત અથવા જમીન પ્રકાર દ્વારા ફિલ્ટર કરી શકો છો. તમે કયા પ્રકારની પ્રોપર્ટી શોધી રહ્યા છો?",
        "હું તમને સંપૂર્ણ કૃષિ જમીન શોધવામાં મદદ કરી શકું છું! અમારા શોધ ફિલ્ટર્સમાં સ્થાન, કદ, કિંમત અને માટીનો પ્રકાર સમાવેશ થાય છે. તમારો પ્રાથમિક વિસ્તાર કયો છે?",
        "પ્રોપર્ટીઝ શોધવામાં મદદની જરૂર છે? હું તમને અમારા એડવાન્સ્ડ શોધ વિકલ્પો દ્વારા માર્ગદર્શન કરી શકું છું જેમાં મેપ વ્યૂ, કિંમત રેન્જ અને પ્રોપર્ટી સુવિધાઓ સમાવેશ થાય છે."
      ],
      'account': [
        "તમના એકાઉન્ટમાં મદદની જરૂર છે? હું તમને લૉગિન, નોંધણી અથવા પ્રોફાઇલ અપડેટ્સ દ્વારા માર્ગદર્શન કરી શકું છું. તમે કયા ચોક્કસ એકાઉન્ટ મુદ્દાનો અનુભવ કરી રહ્યા છો?",
        "એગ્રોલેન્ડ પર એકાઉન્ટ મેનેજમેન્ટ સરળ છે. હું પાસવર્ડ રીસેટ, પ્રોફાઇલ અપડેટ્સ અથવા એકાઉન્ટ સેટિંગ્સમાં મદદ કરી શકું છું.",
        "તમના એકાઉન્ટ સાથે મુશ્કેલીનો અનુભવ કરી રહ્યા છો? મને જણાવો કે તમને શું મદદની જરૂર છે - લૉગિન, નોંધણી અથવા કંઈક બીજું?",
        "હું તમને તમારા એગ્રોલેન્ડ એકાઉન્ટનું સંચાલન કરવામાં મદદ કરી શકું છું! આમાં પ્રોફાઇલ અપડેટ્સ, પાસવર્ડ ફેરફારો અને એકાઉન્ટ પસંદગીઓ સમાવેશ થાય છે.",
        "એકાઉન્ટ મુદ્દાઓ? હું મદદ કરવા માટે અહીં છું! ભલે તે લૉગિન સમસ્યાઓ, નોંધણી, અથવા પ્રોફાઇલ મેનેજમેન્ટ હોય, હું તમને તે દ્વારા માર્ગદર્શન કરી શકું છું."
      ],
      'help': [
        "હું મદદ કરવા માટે અહીં છું! હું પ્રોપર્ટી શોધ, એકાઉન્ટ મેનેજમેન્ટ, સામાન્ય પૂછપરછ અને વધુમાં મદદ કરી શકું છું. તમને શું મદદની જરૂર છે?",
        "સહાયની જરૂર છે? હું તમને એગ્રોલેન્ડ પોર્ટલમાં નેવિગેટ કરવામાં, પ્રોપર્ટીઝ શોધવામાં, તમારા એકાઉન્ટનું સંચાલન કરવામાં અથવા તમારા કોઈપણ પ્રશ્નોનો જવાબ આપવામાં મદદ કરી શકું છું.",
        "હું તમારો એગ્રોલેન્ડ સહાયક છું! હું પ્રોપર્ટી લિસ્ટિંગ્સ, વપરાશકર્તા એકાઉન્ટ્સ, શોધ કાર્યક્ષમતા અને સામાન્ય સપોર્ટમાં મદદ કરી શકું છું.",
        "આજે હું તમને કેવી રીતે મદદ કરી શકું? હું પ્રોપર્ટીઝ, એકાઉન્ટ્સ, શોધ સુવિધાઓ અને સામાન્ય પોર્ટલ નેવિગેશન વિશે જાણકાર છું.",
        "હું તમારા એગ્રોલેન્ડ અનુભવને વધુ સારો બનાવવા માટે અહીં છું! મને પ્રોપર્ટીઝ, એકાઉન્ટ્સ, શોધ ટિપ્સ, અથવા તમને મદદની જરૂર હોય તે કંઈપણ વિશે પૂછો."
      ]
    }
  };

  async sendMessage(message, language = 'en') {
    // Add user message to history
    this.chatHistory.push({ role: 'user', parts: [{ text: message }] });

    try {
      // Try n8n if prioritized
      if (this.currentProvider === 'n8n' && this.n8nWebhookUrl && this.n8nWebhookUrl !== 'YOUR_N8N_URL_HERE') {
        try {
          const response = await this.sendToN8N(message, language);
          if (response.success) {
            return response;
          }
        } catch (n8nError) {
          console.error('n8n failed, tried to fallback:', n8nError.message);
        }
      }

      // Try Gemini next if available and properly initialized
      if (this.geminiApiKey && this.model && this.initialized) {
        try {
          const response = await this.sendToGemini(message, language);
          if (response.success) {
            return response;
          }
        } catch (geminiError) {
          console.log('Gemini failed, using fallback responses:', geminiError.message);
          // Continue to fallback responses
        }
      }

      // Always fallback to context-aware responses if Gemini fails or is not available
      console.log('Falling back to context response. Gemini Available:', !!this.geminiApiKey, 'Initialized:', this.initialized);
      return this.getContextResponse(message, language);

    } catch (error) {
      console.error('Error in sendMessage:', error);

      // Always return context-aware response as fallback, never throw
      return this.getContextResponse(message, language);
    }
  }

  async sendToGemini(message, language) {
    try {
      if (!this.initialized || !this.model) {
        await this.initialize();
      }

      // Build message with system context
      const systemInstruction = `You are AgroLand Assistant, a professional and friendly AI assistant for "AgroLand Portal", Gujarat's premier agricultural land marketplace.
      Your goal is to help users with:
      1. Finding agricultural properties (land, farms, plots) across Gujarat's districts.
      2. Explaining portal features (buying, selling, legal verification, drone surveys).
      3. Assisting with account-related questions (registration, profile management).
      4. Providing general information about agricultural real estate in Gujarat.
      
      Guidelines:
      - Keep responses concise, helpful, and professional.
      - If you don't know something specific about a property, suggest contacting the seller or AgroLand support.
      - You can respond in English or Gujarati as requested by the user.
      - Current user language: ${language === 'en' ? 'English' : 'Gujarati'}.`;

      // Start chat with history plus system instruction
      const chat = this.model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemInstruction }] },
          { role: 'model', parts: [{ text: "Understood. I am AgroLand Assistant, ready to help users with their agricultural property needs in Gujarat. How can I assist you today?" }] },
          ...this.chatHistory.slice(0, -1)
        ],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(message);
      const botResponse = result.response.text();

      // Add bot response to chat history
      this.chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });

      return {
        success: true,
        message: botResponse
      };
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      console.error('API Key Status:', !!this.geminiApiKey ? 'Present' : 'Missing');
      throw error;
    }
  }

  async sendToN8N(message, language) {
    try {
      const response = await fetch(this.n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: message, // Standard field for n8n AI nodes
          language,
          sessionId: 'agroland-session-' + (localStorage.getItem('user_id') || 'guest'),
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n responded with ${response.status}`);
      }

      const data = await response.json();

      // n8n Chat Trigger usually returns { output: "..." }
      const botResponse = data.output || data.text || data.message || (typeof data === 'string' ? data : "I'm processing your request.");

      this.chatHistory.push({ role: 'model', parts: [{ text: botResponse }] });

      return {
        success: true,
        message: botResponse
      };
    } catch (error) {
      console.error('Error sending message to n8n:', error);
      throw error;
    }
  }

  getContextResponse(message, language) {
    const lowerMessage = message.toLowerCase();
    let contextType = 'help';

    // Determine context based on message content
    if (lowerMessage.includes('property') || lowerMessage.includes('land') || lowerMessage.includes('plot') || lowerMessage.includes('farm') || lowerMessage.includes('agricultural') || lowerMessage.includes('crop') || lowerMessage.includes('soil') || lowerMessage.includes('buy') || lowerMessage.includes('buying') || lowerMessage.includes('sell') || lowerMessage.includes('selling') || lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
      contextType = 'property';
    } else if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('register') || lowerMessage.includes('password') || lowerMessage.includes('profile') || lowerMessage.includes('sign') || lowerMessage.includes('user')) {
      contextType = 'account';
    } else if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('look') || lowerMessage.includes('browse')) {
      contextType = 'property'; // Search is usually for properties
    } else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('assist') || lowerMessage.includes('guide') || lowerMessage.includes('contact') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
      contextType = 'help';
    }

    // Get appropriate responses
    const responses = this.contextResponses[language === 'en' ? 'en' : 'gu'][contextType] || this.contextResponses[language === 'en' ? 'en' : 'gu']['help'];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Add fallback response to chat history
    this.chatHistory.push({ role: 'model', parts: [{ text: randomResponse }] });

    console.log(`Using ${contextType} context response for message: "${message}"`);

    return {
      success: true,
      message: randomResponse
    };
  }

  clearHistory() {
    this.chatHistory = [];
  }

  // Method to switch between AI providers
  setProvider(provider) {
    if (provider === 'gemini' && this.geminiApiKey) {
      this.currentProvider = 'gemini';
      return true;
    } else if (provider === 'perplexity' && this.perplexityApiKey) {
      this.currentProvider = 'perplexity';
      return true;
    }
    return false;
  }

  // Get current provider status
  getProviderStatus() {
    return {
      gemini: !!this.geminiApiKey,
      perplexity: !!this.perplexityApiKey,
      n8n: !!this.n8nWebhookUrl && this.n8nWebhookUrl !== 'YOUR_N8N_URL_HERE',
      current: this.currentProvider
    };
  }
}

export default new ChatbotService();