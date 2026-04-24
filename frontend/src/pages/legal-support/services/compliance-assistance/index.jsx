import React from 'react';

const ComplianceAssistance = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Compliance Assistance Services</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-lg mb-4">
          Stay compliant with all relevant agricultural property regulations and requirements.
          Our compliance assistance service helps you navigate complex regulatory frameworks
          and ensures your property dealings meet all legal standards.
        </p>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Compliance Areas We Cover</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Land use regulations</li>
            <li>Environmental compliance</li>
            <li>Zoning requirements</li>
            <li>Property development standards</li>
            <li>Agricultural land preservation</li>
            <li>Water rights compliance</li>
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Our Assistance Includes</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Regulatory compliance audits</li>
            <li>Documentation review and updates</li>
            <li>Compliance training and education</li>
            <li>Regular compliance monitoring</li>
            <li>Risk assessment and mitigation</li>
            <li>Regulatory update notifications</li>
          </ul>
        </div>

        <div className="mt-8">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
            Request Compliance Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceAssistance;