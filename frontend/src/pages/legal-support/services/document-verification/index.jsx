import React from 'react';

const DocumentVerification = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Document Verification Services</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-4">
          Ensure the authenticity and legal validity of your agricultural property documents
          with our comprehensive document verification service. Our experts thoroughly examine
          all property-related documentation to prevent future legal complications.
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Documents We Verify</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Property ownership certificates</li>
            <li>Land title documents</li>
            <li>Survey reports and maps</li>
            <li>Property tax records</li>
            <li>Previous sale deeds</li>
            <li>Encumbrance certificates</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Verification Process</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Document submission and initial review</li>
            <li>Authentication check with relevant authorities</li>
            <li>Cross-verification with public records</li>
            <li>Legal compliance assessment</li>
            <li>Detailed verification report generation</li>
            <li>Expert recommendations if issues found</li>
          </ol>
        </div>

        <div className="mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Submit Documents for Verification
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentVerification;