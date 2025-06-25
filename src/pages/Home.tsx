import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Eye, Lock, Zap, CheckCircle, Users } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Real-Time OCR',
      description: 'Advanced text extraction from Aadhaar documents using Tesseract.js',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Facial Recognition',
      description: 'AI-powered face matching with cosine similarity algorithms',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Complete Privacy',
      description: 'All processing happens in your browser - no data leaves your device',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Results',
      description: 'Get verification results in seconds with detailed match scores',
    },
  ];

  const stats = [
    { number: '95%', label: 'Accuracy Rate' },
    { number: '<3s', label: 'Average Time' },
    { number: '100%', label: 'Privacy Protected' },
    { number: '0', label: 'Data Stored' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Aadhaar Verify
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Real-Time Face & Age Verification
        </p>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Secure, private, and instant identity verification using advanced OCR and facial recognition technology. 
          All processing happens in your browser for maximum privacy.
        </p>
        
        <Link
          to="/upload"
          className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Shield className="w-5 h-5 mr-2" />
          Start Verification
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powered by Advanced Technology
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Simple 3-Step Process
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Upload Aadhaar',
              description: 'Upload your Aadhaar card image or PDF. Our OCR technology extracts your details instantly.',
            },
            {
              step: '02',
              title: 'Take Selfie',
              description: 'Capture a clear selfie using your camera. We ensure optimal lighting and face detection.',
            },
            {
              step: '03',
              title: 'Get Results',
              description: 'Receive instant verification results with detailed match scores and age confirmation.',
            },
          ].map((process, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white text-xl font-bold rounded-full mb-4">
                {process.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {process.title}
              </h3>
              <p className="text-gray-600">{process.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 text-center border border-green-100">
        <Lock className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Your Privacy is Our Priority
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          All data is processed privately in your browser. No Aadhaar information, photos, or personal data 
          is ever stored or transmitted to our servers. The verification happens entirely on your device.
        </p>
        <div className="flex justify-center items-center space-x-6 text-green-600">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">No Data Storage</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">No Server Upload</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">HTTPS Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;