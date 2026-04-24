import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: 'How do I list my agricultural land on the platform?',
      answer: 'To list your agricultural land, first create a seller account through our registration process. Once verified, you can access the seller dashboard where you can add property details, upload photos, set pricing, and manage your listings. Our team will review and approve your listing within 24 hours.'
    },
    {
      question: 'What documents do I need to verify my property listing?',
      answer: 'You need to provide land ownership documents (7/12 extract, property card), survey settlement number, khata number, and recent photographs of the land. Additional documents like soil test reports and water availability certificates can help attract more buyers.'
    },
    {
      question: 'How does the payment process work?',
      answer: 'We facilitate secure transactions between buyers and sellers. Our platform provides escrow services for added security. Payment terms are negotiated directly between parties, and we provide guidance on legal documentation and transfer processes.'
    },
    {
      question: 'Is there a fee for listing my property?',
      answer: 'Basic listing is free for the first 30 days. After that, we offer various subscription plans with different features like premium placement, analytics, and extended listing duration. Commission is charged only on successful transactions.'
    },
    {
      question: 'How do I know if a buyer inquiry is genuine?',
      answer: 'All buyers on our platform undergo verification processes. We provide buyer verification status, contact history, and previous transaction records. Our team also pre-screens inquiries to ensure they meet your listing criteria.'
    },
    {
      question: 'Can I modify or remove my listing after it\'s published?',
      answer: 'Yes, you can edit your listing details, update photos, change pricing, or remove the listing entirely through your seller dashboard. Changes are typically reflected within a few hours after our quality review.'
    },
    {
      question: 'What support do you provide for legal documentation?',
      answer: 'We provide guidance on required legal documents and can connect you with verified legal professionals in Gujarat who specialize in agricultural land transactions. However, we recommend consulting with legal experts for complex cases.'
    },
    {
      question: 'How quickly can I expect to find a buyer?',
      answer: 'The time to find a buyer depends on various factors like location, pricing, land quality, and market conditions. On average, well-priced properties with good documentation receive inquiries within 2-4 weeks. Premium listings typically get faster response.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-16 lg:py-24 bg-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Quick answers to common questions about our platform and services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-card rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <Icon
                      name={openFAQ === index ? 'ChevronUp' : 'ChevronDown'}
                      size={20}
                      className="text-muted-foreground flex-shrink-0"
                    />
                  </div>
                </button>
                
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-border pt-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Support */}
          <div className="mt-12 text-center">
            <div className="bg-card rounded-lg p-8 border border-border">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4">
                <Icon name="HelpCircle" size={32} className="text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Still Have Questions?
              </h3>
              
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help 
                with any questions or concerns you might have.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@agrolandportal.com"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Icon name="Mail" size={16} />
                  <span>Email Support</span>
                </a>
                
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
                >
                  <Icon name="Phone" size={16} />
                  <span>Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;