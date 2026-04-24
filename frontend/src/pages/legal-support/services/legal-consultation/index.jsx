import React from 'react';

const LegalConsultation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Legal Consultation Services</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-4">
          Get expert legal advice from our team of experienced agricultural law professionals.
          We provide comprehensive consultation services to help you navigate complex legal matters
          related to your agricultural property transactions.
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Our Consultation Services Include:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Property transaction legal advice</li>
            <li>Agricultural land use regulations</li>
            <li>Environmental compliance consultation</li>
            <li>Water rights and usage guidance</li>
            <li>Zoning and land development consultation</li>
            <li>Property dispute resolution advice</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Schedule a consultation through our online booking system</li>
            <li>Provide relevant documentation and details about your case</li>
            <li>Meet with our legal expert virtually or in person</li>
            <li>Receive detailed legal advice and recommendations</li>
            <li>Get follow-up support as needed</li>
          </ol>
        </div>

        <div className="mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Schedule a Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalConsultation;