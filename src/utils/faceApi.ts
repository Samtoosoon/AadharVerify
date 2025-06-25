import * as faceapi from 'face-api.js';

let isInitialized = false;

export const initializeFaceApi = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    // Load face-api.js models from CDN
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    ]);

    isInitialized = true;
    console.log('Face-API models loaded successfully');
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw new Error('Failed to initialize face detection models');
  }
};

export const detectFace = async (imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement) => {
  if (!isInitialized) {
    await initializeFaceApi();
  }

  try {
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection;
  } catch (error) {
    console.error('Face detection error:', error);
    return null;
  }
};

export const compareFaces = (descriptor1: Float32Array, descriptor2: Float32Array): number => {
  try {
    // Calculate euclidean distance
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    // Convert distance to similarity percentage (lower distance = higher similarity)
    const similarity = Math.max(0, Math.min(100, (1 - distance) * 100));
    return Math.round(similarity);
  } catch (error) {
    console.error('Face comparison error:', error);
    return 0;
  }
};

export const extractFaceFromImage = async (imageUrl: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const detection = await detectFace(img);
        if (!detection) {
          console.log('No face detected in image');
          resolve(null);
          return;
        }

        // Create canvas to extract face region
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        const { x, y, width, height } = detection.detection.box;
        
        // Add padding around face
        const padding = 20;
        const faceX = Math.max(0, x - padding);
        const faceY = Math.max(0, y - padding);
        const faceWidth = Math.min(img.width - faceX, width + padding * 2);
        const faceHeight = Math.min(img.height - faceY, height + padding * 2);

        canvas.width = faceWidth;
        canvas.height = faceHeight;

        ctx.drawImage(img, faceX, faceY, faceWidth, faceHeight, 0, 0, faceWidth, faceHeight);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      } catch (error) {
        console.error('Error extracting face:', error);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
};