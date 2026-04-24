import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import PropertyCard from '../../property-listings-search/components/PropertyCard';
import { useLanguage } from '../../../contexts/LanguageContext';
import propertyService from '../../../utils/propertyService';

const RelatedProperties = ({ currentPropertyId, district }) => {
  const { language } = useLanguage();
  const [relatedProperties, setRelatedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProperties = async () => {
      setLoading(true);
      if (!district) {
        setLoading(false);
        return;
      }

      try {
        const result = await propertyService.getProperties({
          location_district: district,
          status: 'active'
        });

        if (result.success && result.data) {
          const filtered = result.data
            .filter(p => (p.id || p._id) !== currentPropertyId)
            .slice(0, 3);
          setRelatedProperties(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch related properties", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProperties();
  }, [currentPropertyId, district]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[1.75rem] animate-pulse border border-slate-100" />
        ))}
      </div>
    );
  }

  if (relatedProperties.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedProperties.map((property) => (
        <PropertyCard key={property.id || property._id} property={property} />
      ))}
    </div>
  );
};

export default RelatedProperties;
