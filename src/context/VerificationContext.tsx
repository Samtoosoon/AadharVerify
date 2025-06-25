import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AadhaarData {
  fullName: string;
  dateOfBirth: string;
  aadhaarPhoto: string;
  extractedFace?: string;
  faceDescriptor?: Float32Array;
  hindiName?: string;
  englishName?: string;
}

interface VerificationData {
  aadhaarData: AadhaarData | null;
  selfiePhoto: string | null;
  selfieFace?: string;
  selfieDescriptor?: Float32Array;
  matchScore: number | null;
  isVerified: boolean | null;
  age: number | null;
}

interface VerificationContextType {
  verificationData: VerificationData;
  setAadhaarData: (data: AadhaarData) => void;
  setSelfiePhoto: (photo: string) => void;
  setSelfieData: (face: string, descriptor: Float32Array) => void;
  setComparisonResults: (matchScore: number, isVerified: boolean, age: number) => void;
  resetVerification: () => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};

interface VerificationProviderProps {
  children: ReactNode;
}

export const VerificationProvider: React.FC<VerificationProviderProps> = ({ children }) => {
  const [verificationData, setVerificationData] = useState<VerificationData>({
    aadhaarData: null,
    selfiePhoto: null,
    matchScore: null,
    isVerified: null,
    age: null,
  });

  const setAadhaarData = (data: AadhaarData) => {
    setVerificationData(prev => ({ ...prev, aadhaarData: data }));
  };

  const setSelfiePhoto = (photo: string) => {
    setVerificationData(prev => ({ ...prev, selfiePhoto: photo }));
  };

  const setSelfieData = (face: string, descriptor: Float32Array) => {
    setVerificationData(prev => ({ 
      ...prev, 
      selfieFace: face,
      selfieDescriptor: descriptor 
    }));
  };

  const setComparisonResults = (matchScore: number, isVerified: boolean, age: number) => {
    setVerificationData(prev => ({ 
      ...prev, 
      matchScore, 
      isVerified, 
      age 
    }));
  };

  const resetVerification = () => {
    setVerificationData({
      aadhaarData: null,
      selfiePhoto: null,
      matchScore: null,
      isVerified: null,
      age: null,
    });
  };

  return (
    <VerificationContext.Provider
      value={{
        verificationData,
        setAadhaarData,
        setSelfiePhoto,
        setSelfieData,
        setComparisonResults,
        resetVerification,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};