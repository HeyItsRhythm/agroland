import React from 'react';

const TitleSearch = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Title Search Services</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-4">
          Our comprehensive title search service helps you uncover the complete history and
          current status of agricultural property ownership. We conduct thorough investigations
          to ensure clear property titles and identify any potential issues.
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Our Title Search Includes</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Historical ownership records</li>
            <li>Existing liens and encumbrances</li>
            <li>Property boundary verification</li>
            <li>Easement identification</li>
            <li>Legal restrictions check</li>
            <li>Tax assessment history</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Search Process</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Property information collection</li>
            <li>Public records examination</li>
            <li>Historical document review</li>
            <li>Current status verification</li>
            <li>Comprehensive report preparation</li>
            <li>Expert consultation on findings</li>
          </ol>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Prevent future ownership disputes</li>
            <li>Identify potential legal issues early</li>
            <li>Ensure clean property transfers</li>
            <li>Protect your investment</li>
            <li>Facilitate financing processes</li>
          </ul>
        </div>

        <div className="mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Request Title Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleSearch;