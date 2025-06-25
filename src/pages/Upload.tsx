import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, Camera, AlertCircle, CheckCircle, Loader, Eye, Languages, Zap, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import ProgressSteps from '../components/ProgressSteps';
import { useVerification } from '../context/VerificationContext';
import { performOCR, ExtractedData } from '../utils/ocrUtils';
import { extractFaceFromAadhaar, extractFaceRegionFallback } from '../utils/faceDetection';

const Upload = () => {
  const navigate = useNavigate();
  const { setAadhaarData } = useVerification();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedData>({
    fullName: '',
    dateOfBirth: '',
  });
  const [extractedFace, setExtractedFace] = useState<string>('');
  const [faceDescriptor, setFaceDescriptor] = useState<Float32Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataExtracted, setIsDataExtracted] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');
  const [ocrAttempt, setOcrAttempt] = useState(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG) or PDF file');
      return;
    }

    // Validate file size (max 15MB for low quality images)
    if (file.size > 15 * 1024 * 1024) {
      toast.error('File size should be less than 15MB');
      return;
    }

    setUploadedFile(file);
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
    toast.success('File uploaded successfully!');
    
    // Start processing
    await processDocument(file, imageUrl);
  };

  const processDocument = async (file: File, imageUrl: string) => {
    setIsProcessing(true);
    setOcrProgress(0);
    setOcrAttempt(0);
    setProcessingStep('Initializing robust OCR...');
    
    const toastId = toast.loading('Processing document with enhanced OCR...', { duration: 0 });

    try {
      // Step 1: Robust OCR Processing
      setProcessingStep('Running robust OCR analysis...');
      toast.loading('🤖 Running robust OCR analysis...', { id: toastId });
      
      const { text, extractedData: ocrData } = await performOCR(file, (progress) => {
        setOcrProgress(Math.round(progress * 100));
        
        // Determine which OCR attempt we're on based on progress
        if (progress < 0.33) {
          setOcrAttempt(1);
          toast.loading(`🎯 Standard Mode: ${Math.round(progress * 300)}%`, { id: toastId });
        } else if (progress < 0.66) {
          setOcrAttempt(2);
          toast.loading(`🔍 Block Mode: ${Math.round((progress - 0.33) * 300)}%`, { id: toastId });
        } else {
          setOcrAttempt(3);
          toast.loading(`🚨 English Only Mode: ${Math.round((progress - 0.66) * 300)}%`, { id: toastId });
        }
      });

      console.log('Robust OCR completed:', ocrData);
      setExtractedData(ocrData);

      // Step 2: Face Detection and Extraction
      setProcessingStep('Detecting and extracting face...');
      toast.loading('👤 Detecting face in Aadhaar image...', { id: toastId });
      
      let faceData = null;
      try {
        faceData = await extractFaceFromAadhaar(imageUrl);
      } catch (error) {
        console.error('AI face extraction failed:', error);
      }

      if (faceData) {
        setExtractedFace(faceData.faceImage);
        setFaceDescriptor(faceData.descriptor);
        toast.success('✅ Face detected and extracted successfully!', { id: toastId });
      } else {
        // Fallback: Extract face region without AI
        console.log('Using fallback face extraction...');
        const fallbackFace = await extractFaceRegionFallback(imageUrl);
        setExtractedFace(fallbackFace);
        toast.success('📄 Document processed (face region extracted)', { id: toastId });
      }

      setIsDataExtracted(true);

      // Success message based on extraction results
      if (ocrData.hindiName && ocrData.englishName) {
        toast.success(`🎉 Both Hindi (${ocrData.hindiName}) and English (${ocrData.englishName}) names extracted!`, { id: toastId });
      } else if (ocrData.fullName && ocrData.dateOfBirth) {
        toast.success('✅ All data extracted successfully!', { id: toastId });
      } else if (ocrData.fullName || ocrData.dateOfBirth) {
        toast.success('📋 Partial data extracted. Please complete the missing information.', { id: toastId });
      } else {
        toast.success('📄 Document uploaded. Please enter the information manually.', { id: toastId });
      }

    } catch (error) {
      console.error('Processing Error:', error);
      
      // Even if OCR fails, we can still proceed with manual entry
      setIsDataExtracted(true);
      
      // Try to extract face even if OCR fails
      try {
        const fallbackFace = await extractFaceRegionFallback(imageUrl);
        setExtractedFace(fallbackFace);
      } catch (faceError) {
        console.error('Face extraction also failed:', faceError);
      }
      
      toast.error('⚠️ OCR failed, but you can enter the information manually.', { id: toastId });
    } finally {
      setIsProcessing(false);
      setOcrProgress(0);
      setOcrAttempt(0);
      setProcessingStep('');
    }
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleDataChange = (field: keyof ExtractedData, value: string) => {
    setExtractedData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (!extractedData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    
    if (!extractedData.dateOfBirth.trim()) {
      toast.error('Please enter your date of birth');
      return;
    }

    // Validate date format
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(extractedData.dateOfBirth)) {
      toast.error('Please enter date in DD/MM/YYYY format');
      return;
    }

    // Validate date
    const [day, month, year] = extractedData.dateOfBirth.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      toast.error('Please enter a valid date');
      return;
    }

    if (year < 1900 || year > 2010) {
      toast.error('Please enter a valid birth year (1900-2010)');
      return;
    }

    if (!extractedFace) {
      toast.error('Face extraction failed. Please try with a clearer image.');
      return;
    }

    // Save data to context
    setAadhaarData({
      fullName: extractedData.fullName,
      dateOfBirth: extractedData.dateOfBirth,
      aadhaarPhoto: uploadedImageUrl,
      extractedFace: extractedFace,
      faceDescriptor: faceDescriptor || undefined,
      hindiName: extractedData.hindiName,
      englishName: extractedData.englishName,
    });

    toast.success('✅ Aadhaar data saved successfully!');
    navigate('/selfie');
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadedImageUrl('');
    setIsDataExtracted(false);
    setExtractedData({ fullName: '', dateOfBirth: '' });
    setExtractedFace('');
    setFaceDescriptor(null);
    setIsProcessing(false);
    setOcrProgress(0);
    setOcrAttempt(0);
    setProcessingStep('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressSteps currentStep={1} />
      
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Aadhaar Document</h2>
          <p className="text-gray-600">
            Upload your Aadhaar card for robust dual-language OCR and face extraction
          </p>
          <div className="flex items-center justify-center mt-2 text-sm text-blue-600">
            <Languages className="w-4 h-4 mr-1" />
            <span>Supports Hindi & English with manual fallback</span>
          </div>
          <div className="flex items-center justify-center mt-1 text-xs text-green-600">
            <Zap className="w-3 h-3 mr-1" />
            <span>Robust processing with multiple OCR configurations</span>
          </div>
        </div>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            uploadedFile 
              ? 'border-green-300 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
          }`}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing}
          />
          
          {uploadedFile ? (
            <div className="space-y-3">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <p className="text-lg font-semibold text-green-700">File Uploaded Successfully</p>
              <p className="text-gray-600">{uploadedFile.name}</p>
              {uploadedImageUrl && (
                <div className="mt-4">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded Aadhaar"
                    className="max-w-xs max-h-48 mx-auto rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <UploadIcon className="w-12 h-12 text-gray-400 mx-auto" />
              <p className="text-lg font-semibold text-gray-700">
                Click to upload your Aadhaar card
              </p>
              <p className="text-gray-500">
                Supports JPEG, PNG images and PDF files (Max 15MB)
              </p>
              <div className="text-xs text-blue-600 mt-2">
                ✨ Robust OCR with manual fallback for any image quality
              </div>
            </div>
          )}
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-3 mb-4">
              <Loader className="animate-spin h-6 w-6 text-blue-600" />
              <span className="text-blue-700 font-medium text-lg">{processingStep}</span>
            </div>
            
            {/* OCR Configuration Indicator */}
            {ocrAttempt > 0 && (
              <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">OCR Configuration:</span>
                  <div className="flex items-center space-x-1">
                    <Settings className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600">
                      {ocrAttempt === 1 && 'Standard Mode'}
                      {ocrAttempt === 2 && 'Block Mode'}
                      {ocrAttempt === 3 && 'English Only Mode'}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {ocrAttempt === 1 && 'Using dual-language OCR for Hindi and English'}
                  {ocrAttempt === 2 && 'Single block processing for better text recognition'}
                  {ocrAttempt === 3 && 'English-only mode for maximum compatibility'}
                </div>
              </div>
            )}
            
            {ocrProgress > 0 && (
              <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                ></div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${ocrProgress > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span>Document Loading</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${ocrProgress > 25 ? 'bg-green-500' : ocrProgress > 0 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span>Text Recognition</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${ocrProgress > 75 ? 'bg-green-500' : ocrProgress > 50 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span>Data Extraction</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${ocrProgress > 90 ? 'bg-green-500' : ocrProgress > 75 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                <span>Face Detection</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm font-medium">
                🔬 Robust Processing Features:
              </p>
              <ul className="text-blue-700 text-xs mt-1 space-y-1">
                <li>• Multiple OCR configurations for maximum compatibility</li>
                <li>• Dual-language support (Hindi + English)</li>
                <li>• Automatic fallback to manual entry if OCR fails</li>
                <li>• Smart pattern matching for names and dates</li>
                <li>• Face extraction with AI and fallback methods</li>
              </ul>
            </div>
          </div>
        )}

        {/* Extracted Data Form */}
        {isDataExtracted && !isProcessing && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-2 text-green-600 mb-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Processing completed! Please verify and complete the information:</span>
            </div>

            {/* Dual Language Names Display */}
            {(extractedData.hindiName || extractedData.englishName) && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center mb-3">
                  <Languages className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Dual Language Names Detected</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {extractedData.hindiName && (
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">Hindi Name</div>
                      <div className="text-lg font-semibold text-blue-800" style={{ fontFamily: 'serif' }}>
                        {extractedData.hindiName}
                      </div>
                    </div>
                  )}
                  {extractedData.englishName && (
                    <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">English Name</div>
                      <div className="text-lg font-semibold text-blue-800">
                        {extractedData.englishName}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={extractedData.fullName}
                  onChange={(e) => handleDataChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name as per Aadhaar"
                />
                {!extractedData.fullName && (
                  <p className="text-sm text-amber-600 mt-1">⚠️ Name not detected - please enter manually</p>
                )}
                {extractedData.hindiName && extractedData.englishName && (
                  <p className="text-sm text-green-600 mt-1">✅ Both Hindi and English names detected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="text"
                  value={extractedData.dateOfBirth}
                  onChange={(e) => handleDataChange('dateOfBirth', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="DD/MM/YYYY"
                />
                {!extractedData.dateOfBirth && (
                  <p className="text-sm text-amber-600 mt-1">⚠️ Date of birth not detected - please enter manually</p>
                )}
              </div>
            </div>

            {/* Aadhaar Number (if extracted) */}
            {extractedData.aadhaarNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number (Detected)
                </label>
                <input
                  type="text"
                  value={extractedData.aadhaarNumber}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            )}

            {/* Extracted Face Preview */}
            {extractedFace && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Extracted Face for Verification
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <img
                      src={extractedFace}
                      alt="Extracted face"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-green-600 mb-1">✅ Face extracted successfully</p>
                      <p>This face will be compared with your selfie</p>
                      {faceDescriptor && (
                        <p className="text-xs text-blue-600">AI face features detected</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={resetUpload}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Upload Different File
              </button>
              <button
                onClick={handleNext}
                disabled={!extractedData.fullName || !extractedData.dateOfBirth || !extractedFace}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-2" />
                Next: Take Selfie
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="text-amber-800">
              <p className="font-medium mb-1">Robust OCR Tips:</p>
              <ul className="text-sm space-y-1">
                <li>• Works with any image quality - clear or blurry</li>
                <li>• Multiple OCR configurations automatically try different approaches</li>
                <li>• Manual entry fallback if OCR fails completely</li>
                <li>• Supports both Hindi and English name extraction</li>
                <li>• Smart pattern matching for dates and Aadhaar numbers</li>
                <li>• All processing happens locally - your data never leaves your device</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;