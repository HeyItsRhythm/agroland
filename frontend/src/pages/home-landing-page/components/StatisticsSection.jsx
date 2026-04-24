import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../contexts/LanguageContext';

const StatisticsSection = () => {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    properties: 0,
    buyers: 0,
    sellers: 0,
    districts: 0
  });
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const targets = {
        properties: 2500,
        buyers: 1200,
        sellers: 850,
        districts: 25
      };

      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      Object.keys(targets).forEach((key) => {
        const target = targets[key];
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current = Math.min(Math.floor(increment * step), target);

          setCounters(prev => ({
            ...prev,
            [key]: current
          }));

          if (step >= steps) {
            clearInterval(timer);
          }
        }, stepDuration);
      });
    }
  }, [isVisible]);

  const statistics = [
    {
      icon: 'Building2',
      value: counters.properties,
      suffix: '+',
      label: language === 'en' ? 'Properties Listed' : 'સૂચિબદ્ધ પ્રોપર્ટીઝ',
      description: language === 'en' ? 'Verified agricultural lands' : 'ચકાસાયેલ કૃષિ જમીનો',
      color: 'text-primary'
    },
    {
      icon: 'Users',
      value: counters.buyers,
      suffix: '+',
      label: language === 'en' ? 'Happy Buyers' : 'ખુશ ખરીદદારો',
      description: language === 'en' ? 'Successful transactions' : 'સફળ વ્યવહારો',
      color: 'text-success'
    },
    {
      icon: 'UserCheck',
      value: counters.sellers,
      suffix: '+',
      label: language === 'en' ? 'Verified Sellers' : 'ચકાસાયેલ વેચનારા',
      description: language === 'en' ? 'Trusted land owners' : 'વિશ્વસનીય જમીન માલિકો',
      color: 'text-secondary'
    },
    {
      icon: 'MapPin',
      value: counters.districts,
      suffix: '+',
      label: language === 'en' ? 'Districts Covered' : 'આવરી લેવાયેલા જિલ્લાઓ',
      description: language === 'en' ? 'Across Gujarat state' : 'ગુજરાત રાજ્યમાં',
      color: 'text-warning'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {language === 'en' ? 'Platform Statistics' : 'પ્લેટફોર્મ આંકડા'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'en' ? 'Join thousands of satisfied users who have found their perfect agricultural land through our platform' : 'હજારો સંતુષ્ટ વપરાશકર્તાઓ સાથે જોડાઓ જેમણે અમારા પ્લેટફોર્મ દ્વારા તેમની સંપૂર્ણ કૃષિ જમીન મેળવી છે'
            }
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 text-center shadow-elevation-2 hover:shadow-elevation-3 transition-state group"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent mb-6 group-hover:scale-110 transition-micro ${stat.color}`}>
                <Icon name={stat.icon} size={32} />
              </div>

              {/* Counter */}
              <div className="mb-4">
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                  {stat.value.toLocaleString('en-IN')}{stat.suffix}
                </div>
                <h3 className="text-lg font-heading font-semibold text-foreground">
                  {stat.label}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-2xl p-8 shadow-elevation-2 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">99.5%</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Customer Satisfaction' : 'ગ્રાહક સંતુષ્ટિ'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Support Available' : 'સહાય ઉપલબ્ધ'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Verified Properties' : 'ચકાસાયેલ પ્રોપર્ટીઝ'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;