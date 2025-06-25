import React, { useState } from 'react';
import { Mail, MessageCircle, HelpCircle, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      toast.success('Message sent successfully!');
    }, 1000);
  };

  const faqData = [
    {
      question: 'Is this application legal to use?',
      answer: 'Yes, this is a demonstration application using publicly available libraries. However, it should not be used for official KYC verification. Always use authorized channels for legal identity verification.',
    },
    {
      question: 'Can I use this for my business KYC requirements?',
      answer: 'No, this is a proof-of-concept application for educational purposes only. For business KYC, you need to use certified and authorized identity verification services.',
    },
    {
      question: 'How accurate is the face matching?',
      answer: 'The face matching uses industry-standard algorithms and can achieve high accuracy under good conditions. However, accuracy can vary based on image quality, lighting, and other factors.',
    },
    {
      question: 'What image formats are supported?',
      answer: 'We support JPEG, PNG images and PDF files for Aadhaar document upload. For best results, use clear, high-resolution images with good lighting.',
    },
    {
      question: 'Does this work on mobile devices?',
      answer: 'Yes, the application is fully responsive and works on mobile devices. The camera functionality is optimized for mobile browsers.',
    },
    {
      question: 'What happens if the OCR fails to extract text?',
      answer: 'If OCR fails, you can manually enter the required information (name and date of birth) in the provided fields after the extraction attempt.',
    },
    {
      question: 'Is my data stored anywhere?',
      answer: 'No, absolutely not. All processing happens locally in your browser. No Aadhaar data, photos, or personal information is stored or transmitted anywhere.',
    },
    {
      question: 'Can I integrate this into my application?',
      answer: 'This is an open-source demonstration. While you can learn from the code, please ensure compliance with all applicable laws and regulations before any commercial use.',
    },
  ];

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your message has been received. We'll get back to you as soon as possible.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <MessageCircle className="w-16 h-16 text-blue-600" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions about Aadhaar Verify? We're here to help. Send us a message or check our FAQ section.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="privacy">Privacy Questions</option>
                <option value="business">Business/Integration</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us how we can help you..."
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Response Time</h4>
              <p className="text-gray-600 text-sm">We typically respond within 24-48 hours</p>
            </div>
            
            <div>
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                <HelpCircle className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Support Hours</h4>
              <p className="text-gray-600 text-sm">Monday - Friday, 9 AM - 6 PM IST</p>
            </div>
            
            <div>
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Language</h4>
              <p className="text-gray-600 text-sm">English and Hindi support available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <p className="text-amber-800 text-sm text-center">
          <strong>Note:</strong> This is a demonstration application. For official support regarding 
          Aadhaar-related services, please contact UIDAI directly through their official channels.
        </p>
      </div>
    </div>
  );
};

export default Contact;