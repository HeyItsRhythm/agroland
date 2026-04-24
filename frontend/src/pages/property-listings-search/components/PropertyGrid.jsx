import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-muted" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded" />
              </div>
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
              <div className="flex space-x-2">
                <div className="h-8 bg-muted rounded flex-1" />
                <div className="h-8 w-8 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">
          No properties found
        </div>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;