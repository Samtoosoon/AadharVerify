import React from 'react';
import { Shield, Lock, Eye, Server, Database, UserCheck } from 'lucide-react';

const Privacy = () => {
  const principles = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Local Processing Only',
      description: 'All OCR and facial recognition processing happens entirely in your browser. No data is ever transmitted to external servers.',
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: 'Zero Data Storage',
      description: 'We do not store any Aadhaar information, photos, or personal data. Everything is processed in memory and cleared immediately.',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'No Tracking',
      description: 'We do not use cookies, analytics, or any tracking mechanisms. Your usage patterns remain completely private.',
    },
    {
      icon: <Server className="w-8 h-8" />,
      title: 'Secure Communication',
      description: 'All communications use HTTPS encryption. The application works offline once loaded for maximum security.',
    },
  ];

  const dataHandling = [
    {
      category: 'Aadhaar Document',
      data: 'Image/PDF file',
      processing: 'OCR text extraction locally',
      storage: 'None - processed in browser memory',
      retention: 'Cleared on page refresh/exit',
    },
    {
      category: 'Extracted Text',
      data: 'Name, Date of Birth',
      processing: 'Age calculation and validation',
      storage: 'Temporary browser memory only',
      retention: 'Cleared immediately after use',
    },
    {
      category: 'Selfie Photo',
      data: 'Camera captured image',
      processing: 'Facial feature extraction',
      storage: 'Browser memory only',
      retention: 'Cleared on session end',
    },
    {
      category: 'Comparison Results',
      data: 'Match scores and verification status',
      processing: 'Report generation',
      storage: 'Not stored anywhere',
      retention: 'Available only during session',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full">
            <Shield className="w-16 h-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-xl text-gray-600">
          Your privacy is our top priority. Learn how we protect your data.
        </p>
      </div>

      {/* Privacy by Design */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Privacy by Design</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg text-green-600">
                  {principle.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600">{principle.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Handling Table */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Data Handling Transparency</h2>
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Data Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">What We Process</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">How We Process</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Storage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dataHandling.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.data}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.processing}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.storage}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.retention}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Technical Security */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Technical Security Measures</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-2 text-blue-600" />
              Encryption & Security
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>HTTPS/TLS encryption for all communications</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>Client-side processing eliminates data transmission</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>No persistent storage mechanisms</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                <span>Secure camera access protocols</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <UserCheck className="w-6 h-6 mr-2 text-green-600" />
              User Control
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span>Complete control over data processing</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span>Ability to stop processing at any time</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span>Transparent processing indicators</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                <span>Clear consent mechanisms</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Legal Framework */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Legal Framework & Compliance</h2>
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">GDPR Compliance</h3>
              <p className="text-gray-600">
                Our privacy-by-design architecture ensures full compliance with the General Data Protection 
                Regulation (GDPR). Since no personal data is stored or transmitted, many GDPR requirements 
                are inherently satisfied.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Minimization</h3>
              <p className="text-gray-600">
                We process only the minimum data necessary for identity verification. No additional 
                information is collected, stored, or used for any other purpose.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Right to be Forgotten</h3>
              <p className="text-gray-600">
                Since we don't store any data, the right to be forgotten is automatically satisfied. 
                All data is immediately discarded after processing.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Consent Management</h3>
              <p className="text-gray-600">
                By using this application, you consent to the local processing of your Aadhaar document 
                and selfie for identity verification purposes. You can withdraw this consent at any time 
                by simply closing the application.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              question: 'Is my Aadhaar data safe?',
              answer: 'Yes, absolutely. Your Aadhaar data never leaves your device. All processing happens locally in your browser, and no data is transmitted to any server.',
            },
            {
              question: 'Can you access my camera or photos?',
              answer: 'We only access your camera when you explicitly grant permission for selfie capture. We cannot access your photo gallery or any stored images.',
            },
            {
              question: 'How long is my data retained?',
              answer: 'No data is retained. All information is processed in temporary memory and immediately cleared when you close the application or refresh the page.',
            },
            {
              question: 'Can this be used for official verification?',
              answer: 'No, this is a demonstration application. For official KYC or legal identity verification, please use authorized government channels.',
            },
            {
              question: 'Do you share data with third parties?',
              answer: 'No, we cannot share data because we never collect or store any data in the first place. Everything is processed locally.',
            },
            {
              question: 'Is the verification accurate?',
              answer: 'Our algorithms are highly accurate for demonstration purposes, but should not be relied upon for critical decisions or official verification.',
            },
          ].map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">Privacy Questions?</h3>
          <p className="text-blue-700 mb-6">
            If you have any questions about our privacy practices or this policy, 
            please don't hesitate to reach out to us.
          </p>
          <div className="flex justify-center">
            <a
              href="/contact"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center mt-8 text-gray-500">
        <p>Last Updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Privacy;