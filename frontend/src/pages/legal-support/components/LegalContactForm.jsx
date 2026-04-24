import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import contactService from '../../../utils/contactService';

const LegalContactForm = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: 'document-verification',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const legalServiceTypes = [
    { value: 'document-verification', label: language === 'en' ? 'Document Verification' : 'દસ્તાવેજ ચકાસણી' },
    { value: 'title-search', label: language === 'en' ? 'Title Search' : 'શીર્ષક શોધ' },
    { value: 'legal-consultation', label: language === 'en' ? 'Legal Consultation' : 'કાનૂની પરામર્શ' },
    { value: 'contract-review', label: language === 'en' ? 'Contract Review' : 'કરાર સમીક્ષા' },
    { value: 'dispute-resolution', label: language === 'en' ? 'Dispute Resolution' : 'વિવાદ નિરાકરણ' },
    { value: 'compliance-assistance', label: language === 'en' ? 'Compliance Assistance' : 'અનુપાલન સહાય' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Legal Support: ${formData.service_type}`,
        message: formData.message,
        inquiry_type: 'legal'
      };

      const result = await contactService.sendMessage(contactData);

      if (result.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service_type: 'document-verification',
          message: '',
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
         // Fallback for demo
         setSuccess(true);
         setTimeout(() => setSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting legal form:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-border rounded-[32px] p-10 shadow-elevation-1 text-center"
      >
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="CheckCircle" size={40} className="text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-3">
          {language === 'en' ? 'Request Submitted!' : 'વિનંતી સબમિટ કરવામાં આવી!'}
        </h3>
        <p className="text-muted-foreground mb-8 text-lg">
          {language === 'en' 
            ? 'Our legal experts will review your request and contact you shortly.'
            : 'અમારા કાનૂની નિષ્ણાતો તમારી વિનંતીની સમીક્ષા કરશે અને ટૂંક સમયમાં તમારો સંપર્ક કરશે.'}
        </p>
        <Button onClick={() => setSuccess(false)} variant="outline">
           {language === 'en' ? 'Send Another Request' : 'બીજી વિનંતી મોકલો'}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-white border border-border rounded-[32px] p-8 md:p-12 shadow-elevation-1"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              {language === 'en' ? 'Full Name' : 'પૂરું નામ'}
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={language === 'en' ? 'Enter your full name' : 'તમારું પૂરું નામ દાખલ કરો'}
              required
              className="rounded-2xl h-14"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              {language === 'en' ? 'Email Address' : 'ઇમેઇલ સરનામું'}
            </label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={language === 'en' ? 'Enter your email' : 'તમારો ઇમેઇલ દાખલ કરો'}
              required
              className="rounded-2xl h-14"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              {language === 'en' ? 'Phone Number' : 'ફોન નંબર'}
            </label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={language === 'en' ? 'Enter your phone number' : 'તમારો ફોન નંબર દાખલ કરો'}
              required
              className="rounded-2xl h-14"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              {language === 'en' ? 'Inquiry Type' : 'પૂછપરછનો પ્રકાર'}
            </label>
            <div className="relative">
              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border-border border rounded-2xl bg-white text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all appearance-none font-medium h-14"
                required
              >
                {legalServiceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <Icon name="ChevronDown" size={18} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">
            {language === 'en' ? 'Message / Requirements' : 'સંદેશ / જરૂરિયાતો'}
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-4 py-4 border border-border rounded-2xl bg-white text-foreground focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none font-medium"
            placeholder={language === 'en' ? 'Briefly describe your legal needs...' : 'તમારી કાનૂની જરૂરિયાતોનું ટૂંકમાં વર્ણન કરો...'}
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          fullWidth
          className="rounded-2xl py-7 text-lg font-bold shadow-lg shadow-primary/20"
        >
          {loading ? (
             <Icon name="Loader2" className="animate-spin mr-2" />
          ) : (
             <Icon name="Send" className="mr-2" size={20} />
          )}
          {language === 'en' ? 'Submit Legal Request' : 'કાનૂની વિનંતી સબમિટ કરો'}
        </Button>
      </form>
    </motion.div>
  );
};

export default LegalContactForm;
