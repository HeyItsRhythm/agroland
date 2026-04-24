import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickContactSection = () => {
  const quickActions = [
    {
      icon: 'MessageCircle',
      title: 'WhatsApp Support',
      description: 'Get instant support through WhatsApp',
      action: 'Chat Now',
      href: 'https://wa.me/918200072638',
      color: 'bg-green-500 text-white',
      external: true
    },
    {
      icon: 'Phone',
      title: 'Request Callback',
      description: 'We\'ll call you back within 30 minutes',
      action: 'Request Callback',
      href: '#',
      color: 'bg-blue-500 text-white',
      external: false
    },
    {
      icon: 'Mail',
      title: 'Email Support',
      description: 'Send us your questions via email',
      action: 'Send Email',
      href: 'mailto:support@agrolandportal.com',
      color: 'bg-purple-500 text-white',
      external: false
    }
  ];

  const supportCategories = [
    {
      title: 'Technical Support',
      description: 'Platform issues, account problems, and technical questions',
      icon: 'Settings',
      contactMethod: 'tech@agrolandportal.com'
    },
    {
      title: 'Sales Inquiries',
      description: 'Pricing, features, and subscription questions',
      icon: 'DollarSign',
      contactMethod: 'sales@agrolandportal.com'
    },
    {
      title: 'Property Listing',
      description: 'Help with listing your agricultural land',
      icon: 'Upload',
      contactMethod: 'listing@agrolandportal.com'
    },
    {
      title: 'General Support',
      description: 'Any other questions or concerns',
      icon: 'HelpCircle',
      contactMethod: 'info@agrolandportal.com'
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-6">
            Quick Contact Options
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the fastest way to get in touch with our support team.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {quickActions.map((action, index) => (
            <div key={index} className="bg-card rounded-lg p-6 border border-border text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mx-auto mb-4">
                <Icon name={action.icon} size={32} className="text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {action.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              
              <Button
                variant="default"
                size="sm"
                asChild
                className="w-full"
              >
                <a
                  href={action.href}
                  target={action.external ? '_blank' : undefined}
                  rel={action.external ? 'noopener noreferrer' : undefined}
                >
                  <div className="inline-flex items-center justify-center space-x-2">
                    <span>{action.action}</span>
                    {action.external && <Icon name="ExternalLink" size={14} />}
                  </div>
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Support Categories */}
        <div>
          <h3 className="text-2xl font-heading font-bold text-foreground text-center mb-8">
            Contact by Category
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-4">
                  <Icon name={category.icon} size={24} className="text-secondary" />
                </div>
                
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {category.title}
                </h4>
                
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full"
                >
                  <a
                    href={`mailto:${category.contactMethod}`}
                  >
                    <div className="inline-flex items-center justify-center space-x-2">
                      <Icon name="Mail" size={14} />
                      <span>Contact</span>
                    </div>
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Support */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 border border-red-200 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-lg mx-auto mb-4">
              <Icon name="AlertTriangle" size={32} className="text-red-600" />
            </div>
            
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Need Urgent Help?
            </h3>
            
            <p className="text-red-700 mb-6 max-w-2xl mx-auto">
              For critical issues affecting your property listings or urgent technical problems 
              that need immediate attention, contact our emergency support line.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                asChild
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <a href="tel:+919876543200" className="inline-flex items-center space-x-2">
                  <Icon name="Phone" size={16} />
                  <span>Emergency: +91 98765 43200</span>
                </a>
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <a href="https://wa.me/919876543200" target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2">
                  <Icon name="MessageCircle" size={16} />
                  <span>WhatsApp Emergency</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickContactSection;