import React from 'react';

const ContractReview = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contract Review Services</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-4">
          Ensure your agricultural property contracts are thorough and protect your interests
          with our professional contract review service. Our legal experts will carefully analyze
          all aspects of your property-related agreements.
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">What We Review</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Purchase and sale agreements</li>
            <li>Lease agreements</li>
            <li>Land use contracts</li>
            <li>Property management agreements</li>
            <li>Development contracts</li>
            <li>Joint venture agreements</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Our Review Process</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Submit your contract for review</li>
            <li>Initial assessment and scope definition</li>
            <li>Detailed clause-by-clause analysis</li>
            <li>Identification of potential risks and issues</li>
            <li>Recommendations for modifications</li>
            <li>Final review report delivery</li>
          </ol>
        </div>

        <div className="mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Submit Contract for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractReview;