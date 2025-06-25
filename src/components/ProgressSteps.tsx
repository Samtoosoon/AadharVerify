import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  const steps = [
    { step: 1, label: 'Upload Aadhaar' },
    { step: 2, label: 'Take Selfie' },
    { step: 3, label: 'Verify Identity' },
    { step: 4, label: 'Results' },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                currentStep > step.step
                  ? 'bg-green-500 border-green-500 text-white'
                  : currentStep === step.step
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-500'
              }`}
            >
              {currentStep > step.step ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{step.step}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                currentStep >= step.step ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-0.5 mx-4 ${
                currentStep > step.step ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ProgressSteps;