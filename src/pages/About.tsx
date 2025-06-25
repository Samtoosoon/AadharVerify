import React from 'react';
import { Shield, Eye, Zap, Lock, Code, Users, Award, Globe } from 'lucide-react';

const About = () => {
  const technologies = [
    {
      name: 'Tesseract.js',
      description: 'Advanced OCR engine for text extraction from documents',
      icon: <Eye className="w-6 h-6" />,
    },
    {
      name: 'Face-API.js',
      description: 'Real-time facial recognition and feature comparison',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      name: 'WebRTC',
      description: 'Secure camera access for live selfie capture',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      name: 'Client-Side Processing',
      description: 'All computations happen in your browser for privacy',
      icon: <Lock className="w-6 h-6" />,
    },
  ];

  const features = [
    {
      title: 'Real OCR Technology',
      description: 'Uses Tesseract.js to extract text from Aadhaar documents with high accuracy. Supports multiple image formats and handles various document conditions.',
    },
    {
      title: 'Advanced Facial Recognition',
      description: 'Employs face-api.js with neural networks for face detection, feature extraction, and similarity comparison using cosine distance algorithms.',
    },
    {
      title: 'Complete Privacy Protection',
      description: 'All processing happens locally in your browser. No Aadhaar data, photos, or personal information is ever uploaded to external servers.',
    },
    {
      title: 'Age Verification',
      description: 'Automatically calculates age from extracted date of birth and verifies minimum age requirements for various use cases.',
    },
    {
      title: 'Quality Validation',
      description: 'Performs real-time quality checks on captured images including lighting conditions, face visibility, and image clarity.',
    },
    {
      title: 'Instant Results',
      description: 'Provides immediate verification results with detailed match scores, confidence levels, and comprehensive reporting.',
    },
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          About Aadhaar Verify
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A cutting-edge identity verification system that combines advanced OCR and facial recognition 
          technologies to provide secure, private, and instant Aadhaar-based identity verification.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-16 border border-blue-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto">
            To democratize identity verification by providing a free, open-source, and privacy-first 
            solution that leverages the power of modern web technologies. We believe in putting users 
            in control of their data while maintaining the highest standards of security and accuracy.
          </p>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powered by Advanced Technologies
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {technologies.map((tech, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-gray-600">{tech.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Key Features & Capabilities
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: '1',
              title: 'Document Upload',
              description: 'Upload your Aadhaar card image or PDF document.',
              icon: <Code className="w-8 h-8" />,
            },
            {
              step: '2',
              title: 'OCR Processing',
              description: 'Advanced OCR extracts name, DOB, and photo from the document.',
              icon: <Eye className="w-8 h-8" />,
            },
            {
              step: '3',
              title: 'Live Capture',
              description: 'Take a live selfie using your device camera.',
              icon: <Users className="w-8 h-8" />,
            },
            {
              step: '4',
              title: 'AI Verification',
              description: 'Facial recognition compares photos and provides match score.',
              icon: <Award className="w-8 h-8" />,
            },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                {step.icon}
              </div>
              <div className="text-lg font-bold text-blue-600 mb-2">Step {step.step}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Technical Specifications
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">OCR Capabilities</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Supports JPEG, PNG, and PDF formats</li>
              <li>• Multi-language text recognition (English, Hindi)</li>
              <li>• Handles various document orientations</li>
              <li>• Advanced image preprocessing</li>
              <li>• Error correction and validation</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Facial Recognition</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 68-point facial landmark detection</li>
              <li>• Neural network-based feature extraction</li>
              <li>• Cosine similarity matching algorithm</li>
              <li>• Real-time quality assessment</li>
              <li>• Anti-spoofing measures</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy & Security</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 100% client-side processing</li>
              <li>• No data transmission to servers</li>
              <li>• Secure HTTPS communication</li>
              <li>• Automatic session cleanup</li>
              <li>• GDPR compliant architecture</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Sub-3 second verification time</li>
              <li>• 95%+ accuracy rate</li>
              <li>• Works offline after initial load</li>
              <li>• Optimized for mobile devices</li>
              <li>• Progressive web app capabilities</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Use Cases & Applications
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Educational Verification',
              description: 'Verify student identity for online examinations and course enrollments.',
              icon: <Users className="w-6 h-6" />,
            },
            {
              title: 'Digital Onboarding',
              description: 'Streamline customer onboarding for financial and digital services.',
              icon: <Globe className="w-6 h-6" />,
            },
            {
              title: 'Age Verification',
              description: 'Confirm age requirements for age-restricted content and services.',
              icon: <Shield className="w-6 h-6" />,
            },
            {
              title: 'Event Registration',
              description: 'Secure identity verification for conferences and events.',
              icon: <Award className="w-6 h-6" />,
            },
            {
              title: 'Healthcare Access',
              description: 'Verify patient identity for telemedicine and healthcare services.',
              icon: <Lock className="w-6 h-6" />,
            },
            {
              title: 'Government Services',
              description: 'Enable secure access to digital government services and benefits.',
              icon: <Code className="w-6 h-6" />,
            },
          ].map((useCase, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mr-3">
                  {useCase.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {useCase.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 rounded-xl p-8 border border-amber-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-amber-800 mb-4">Important Disclaimer</h3>
          <div className="text-amber-700 space-y-3 max-w-4xl mx-auto">
            <p>
              <strong>Demo Purpose Only:</strong> This application is designed for demonstration and 
              educational purposes. It should not be used for actual KYC (Know Your Customer) 
              verification or official identity validation processes.
            </p>
            <p>
              <strong>Legal Compliance:</strong> Users are responsible for ensuring compliance with 
              local laws and regulations regarding identity verification and data processing.
            </p>
            <p>
              <strong>Accuracy:</strong> While our algorithms are highly accurate, results should 
              always be validated through official channels for critical applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;