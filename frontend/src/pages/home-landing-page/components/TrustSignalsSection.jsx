import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { useLanguage } from '../../../contexts/LanguageContext';

const TrustSignalsSection = () => {
  const { language } = useLanguage();

  const certifications = [
    {
      name: language === 'en' ? 'Gujarat Agriculture Department' : 'ગુજરાત કૃષિ વિભાગ',
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      description: language === 'en' ? 'Certified Partner' : 'પ્રમાણિત ભાગીદાર'
    },
    {
      name: language === 'en' ? 'Revenue Department Gujarat' : 'મહેસૂલ વિભાગ ગુજરાત',
      logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      description: language === 'en' ? 'Authorized Platform' : 'અધિકૃત પ્લેટફોર્મ'
    },
    {
      name: language === 'en' ? 'Digital India Initiative' : 'ડિજિટલ ઇન્ડિયા પહેલ',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      description: language === 'en' ? 'Recognized Platform' : 'માન્યતા પ્રાપ્ત પ્લેટફોર્મ'
    },
    {
      name: language === 'en' ? 'ISO 27001 Certified' : 'ISO 27001 પ્રમાણિત',
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
      description: language === 'en' ? 'Data Security' : 'ડેટા સુરક્ષા'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: language === 'en' ? 'Ramesh Patel' : 'રમેશ પટેલ',
      location: language === 'en' ? 'Ahmedabad' : 'અમદાવાદ',
      role: language === 'en' ? 'Land Buyer' : 'જમીન ખરીદદાર',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 5,
      testimonial: language === 'en'
        ? `Found the perfect agricultural land for my organic farming venture. The platform's verification process gave me complete confidence in the purchase.`
        : `મારા ઓર્ગેનિક ફાર્મિંગ વેન્ચર માટે સંપૂર્ણ કૃષિ જમીન મળી. પ્લેટફોર્મની ચકાસણી પ્રક્રિયાએ મને ખરીદીમાં સંપૂર્ણ વિશ્વાસ આપ્યો.`
    },
    {
      id: 2,
      name: language === 'en' ? 'Priya Shah' : 'પ્રિયા શાહ',
      location: language === 'en' ? 'Vadodara' : 'વડોદરા',
      role: language === 'en' ? 'Land Seller' : 'જમીન વેચનાર',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      testimonial: language === 'en' ? `Sold my family's agricultural property within 2 weeks. The platform connected me with serious buyers and handled all documentation smoothly.`
        : `2 અઠવાડિયામાં મારા પરિવારની કૃષિ મિલકત વેચી દીધી. પ્લેટફોર્મે મને ગંભીર ખરીદદારો સાથે જોડ્યો અને બધા દસ્તાવેજો સરળતાથી હેન્ડલ કર્યા.`
    },
    {
      id: 3,
      name: language === 'en' ? 'Kiran Desai' : 'કિરણ દેસાઈ',
      location: language === 'en' ? 'Surat' : 'સુરત',
      role: language === 'en' ? 'Agricultural Investor' : 'કૃષિ રોકાણકાર',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      rating: 5,
      testimonial: language === 'en'
        ? `Excellent platform for agricultural land investment. The detailed property information and location-based search made my decision easy.`
        : `કૃષિ જમીન રોકાણ માટે ઉત્તમ પ્લેટફોર્મ. વિગતવાર પ્રોપર્ટી માહિતી અને સ્થાન-આધારિત શોધે મારો નિર્ણય સરળ બનાવ્યો.`
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-3">
            {language === 'en' ? 'Trusted by Thousands' : 'હજારો લોકોનો વિશ્વાસ'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' ? 'Our platform is certified by government authorities and trusted by agricultural communities across Gujarat' : 'અમારું પ્લેટફોર્મ સરકારી સત્તાવાળાઓ દ્વારા પ્રમાણિત છે અને ગુજરાતભરના કૃષિ સમુદાયો દ્વારા વિશ્વસનીય છે'
            }
          </p>
        </div>

        {/* Certifications - Clean Strip */}
        <div className="mb-16">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center mb-8">
            {language === 'en' ? 'Officially Recognized By' : 'દ્વારા સત્તાવાર રીતે માન્યતા પ્રાપ્ત'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80">
            {certifications.map((cert, index) => (
              <div key={index} className="group relative flex flex-col items-center hover:-translate-y-1 transition-transform duration-300">
                <div className="w-16 h-16 md:w-20 md:h-20 grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 rounded-full overflow-hidden mb-2 shadow-sm group-hover:shadow-md">
                  <Image
                    src={cert.logo}
                    alt={cert.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6 whitespace-nowrap bg-background/80 px-2 py-1 rounded-md shadow-sm">
                  {cert.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials - Refined Cards */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group hover:bg-card/50">
                {/* Rating */}
                <div className="flex items-center mb-6 group-hover:scale-105 transition-transform duration-300 origin-left">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Icon key={i} name="Star" size={18} className="text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-foreground/80 mb-8 leading-relaxed text-lg">
                  "{testimonial.testimonial}"
                </p>

                {/* User Info */}
                <div className="flex items-center border-t border-border/50 pt-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300 group-hover:scale-110">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsSection;