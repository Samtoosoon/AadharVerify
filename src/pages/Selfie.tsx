import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, RotateCcw, CheckCircle, AlertTriangle, ArrowLeft, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import ProgressSteps from '../components/ProgressSteps';
import { useVerification } from '../context/VerificationContext';
import { extractFaceFromSelfie } from '../utils/faceDetection';

const Selfie = () => {
  const navigate = useNavigate();
  const { verificationData, setSelfiePhoto, setSelfieData } = useVerification();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [extractedFace, setExtractedFace] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const [isProcessingFace, setIsProcessingFace] = useState(false);

  useEffect(() => {
    // Check if user has uploaded Aadhaar data
    if (!verificationData.aadhaarData) {
      toast.error('Please upload your Aadhaar first');
      navigate('/upload');
      return;
    }

    // Auto-start camera when component loads
    startCamera();
  }, [verificationData.aadhaarData, navigate]);

  const startCamera = async () => {
    try {
      setError('');
      
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      console.log('Requesting camera access...');
      
      const constraints = {
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Got media stream:', mediaStream);
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing');
                setIsStreaming(true);
                toast.success('Camera started successfully!');
              })
              .catch((err) => {
                console.error('Play error:', err);
                setError('Failed to start video playback');
              });
          }
        };

        videoRef.current.onerror = (e) => {
          console.error('Video error:', e);
          setError('Video error occurred');
        };
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      
      let errorMessage = 'Camera access failed. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and refresh the page.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += 'Please check your camera settings and try again.';
      }
      
      setError(errorMessage);
      toast.error('Failed to access camera');
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) {
      toast.error('Camera not ready');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      toast.error('Canvas not supported');
      return;
    }

    try {
      // Set canvas size
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      // Draw video frame to canvas (mirrored)
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();

      // Convert to data URL
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photoDataUrl);
      
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setIsStreaming(false);
      
      toast.success('Photo captured successfully!');
      
      // Process face extraction
      await processSelfie(photoDataUrl);
      
    } catch (error) {
      console.error('Capture error:', error);
      toast.error('Failed to capture photo');
    }
  };

  const processSelfie = async (photoDataUrl: string) => {
    setIsProcessingFace(true);
    const toastId = toast.loading('Detecting face in selfie...');

    try {
      const faceData = await extractFaceFromSelfie(photoDataUrl);
      
      if (faceData) {
        setExtractedFace(faceData.faceImage);
        setSelfieData(faceData.faceImage, faceData.descriptor);
        toast.success('Face detected and extracted!', { id: toastId });
      } else {
        // Use original photo if face extraction fails
        setExtractedFace(photoDataUrl);
        toast.success('Photo processed (using full image)', { id: toastId });
      }
    } catch (error) {
      console.error('Face processing error:', error);
      setExtractedFace(photoDataUrl);
      toast.error('Face detection failed, using full image', { id: toastId });
    } finally {
      setIsProcessingFace(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto('');
    setExtractedFace('');
    setError('');
    startCamera();
  };

  const handleNext = () => {
    if (!capturedPhoto) {
      toast.error('Please capture a selfie first');
      return;
    }

    if (!extractedFace) {
      toast.error('Face processing incomplete. Please try again.');
      return;
    }

    setSelfiePhoto(capturedPhoto);
    toast.success('Selfie saved successfully!');
    navigate('/compare');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressSteps currentStep={2} />
      
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Camera className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Take Your Selfie</h2>
          <p className="text-gray-600">
            Capture a clear photo for real-time face verification
          </p>
        </div>

        {/* Camera/Photo Display */}
        <div className="mb-8">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden max-w-md mx-auto">
            {!capturedPhoto ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto"
                  style={{ 
                    transform: 'scaleX(-1)',
                    minHeight: '300px',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    display: isStreaming ? 'block' : 'none'
                  }}
                />
                
                {!isStreaming && (
                  <div className="aspect-video flex items-center justify-center bg-gray-800 text-white min-h-[300px]">
                    <div className="text-center p-6">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg mb-2">Starting camera...</p>
                      {error && (
                        <p className="text-sm text-red-300 mt-2 max-w-xs mx-auto">
                          {error}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Camera overlay when streaming */}
                {isStreaming && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                        <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse"></div>
                        Live
                      </div>
                    </div>
                    <div className="absolute inset-4 border-2 border-white rounded-full opacity-30"></div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                      Position your face in the circle
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="relative">
                <img
                  src={capturedPhoto}
                  alt="Captured selfie"
                  className="w-full h-auto max-h-[400px] object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Captured
                  </div>
                </div>
                {isProcessingFace && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="text-sm">Processing face...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Extracted Face Preview */}
        {extractedFace && capturedPhoto && !isProcessingFace && (
          <div className="mb-6">
            <div className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-center">
                <Eye className="w-4 h-4 mr-2" />
                Extracted Face for Verification
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={extractedFace}
                    alt="Extracted face"
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-green-600 mb-1">✓ Face extracted</p>
                    <p>Ready for comparison</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-red-700">
                <p className="font-medium">Camera Error</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={startCamera}
                  className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!capturedPhoto ? (
            <>
              {!isStreaming ? (
                <button
                  onClick={startCamera}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera
                </button>
              ) : (
                <button
                  onClick={capturePhoto}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Photo
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={retakePhoto}
                disabled={isProcessingFace}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium flex items-center justify-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Photo
              </button>
              <button
                onClick={handleNext}
                disabled={isProcessingFace || !extractedFace}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Proceed to Verification
              </button>
            </>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/upload')}
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Upload
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-blue-800">
              <p className="font-medium mb-1">Camera Tips:</p>
              <ul className="text-sm space-y-1">
                <li>• Allow camera permissions when prompted</li>
                <li>• Ensure good lighting on your face</li>
                <li>• Look directly at the camera</li>
                <li>• Keep a neutral expression</li>
                <li>• Remove glasses or hats if possible</li>
                <li>• Wait for face detection to complete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selfie;