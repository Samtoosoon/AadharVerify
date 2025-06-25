import * as faceapi from 'face-api.js';

let isInitialized = false;

export const initializeFaceAPI = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    console.log('Loading face-api.js models...');
    
    // Try loading from CDN with better error handling
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
    ]);

    isInitialized = true;
    console.log('Face-API models loaded successfully');
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw new Error('Failed to initialize face detection models');
  }
};

export const detectFaceInImage = async (imageElement: HTMLImageElement): Promise<any> => {
  if (!isInitialized) {
    await initializeFaceAPI();
  }

  try {
    // Try multiple detection methods for better accuracy
    let detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
      .withFaceLandmarks()
      .withFaceDescriptor();

    // If SSD fails, try TinyFaceDetector
    if (!detection) {
      console.log('SSD detection failed, trying TinyFaceDetector...');
      detection = await faceapi
        .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 }))
        .withFaceLandmarks()
        .withFaceDescriptor();
    }

    return detection;
  } catch (error) {
    console.error('Face detection error:', error);
    return null;
  }
};

export const extractFaceFromAadhaar = async (imageUrl: string): Promise<{ faceImage: string; descriptor: Float32Array } | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      try {
        console.log('Detecting face in Aadhaar image...');
        const detection = await detectFaceInImage(img);
        
        if (!detection) {
          console.log('No face detected in Aadhaar image');
          resolve(null);
          return;
        }

        console.log('Face detected in Aadhaar, extracting...');
        
        // Create canvas to extract face
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        const { x, y, width, height } = detection.detection.box;
        
        // Add more padding for better face extraction
        const padding = Math.min(width, height) * 0.4;
        const faceX = Math.max(0, x - padding);
        const faceY = Math.max(0, y - padding);
        const faceWidth = Math.min(img.width - faceX, width + padding * 2);
        const faceHeight = Math.min(img.height - faceY, height + padding * 2);

        canvas.width = 300; // Larger size for better quality
        canvas.height = 300;

        // Draw extracted face with better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          faceX, faceY, faceWidth, faceHeight,
          0, 0, 300, 300
        );

        const faceImage = canvas.toDataURL('image/jpeg', 0.9);
        
        resolve({
          faceImage,
          descriptor: detection.descriptor
        });
      } catch (error) {
        console.error('Error extracting face from Aadhaar:', error);
        resolve(null);
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load Aadhaar image');
      resolve(null);
    };
    
    img.src = imageUrl;
  });
};

export const extractFaceFromSelfie = async (imageUrl: string): Promise<{ faceImage: string; descriptor: Float32Array } | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = async () => {
      try {
        console.log('Detecting face in selfie...');
        const detection = await detectFaceInImage(img);
        
        if (!detection) {
          console.log('No face detected in selfie');
          resolve(null);
          return;
        }

        console.log('Face detected in selfie, extracting...');
        
        // Create canvas to extract face
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        const { x, y, width, height } = detection.detection.box;
        
        // Add padding around face
        const padding = Math.min(width, height) * 0.3;
        const faceX = Math.max(0, x - padding);
        const faceY = Math.max(0, y - padding);
        const faceWidth = Math.min(img.width - faceX, width + padding * 2);
        const faceHeight = Math.min(img.height - faceY, height + padding * 2);

        canvas.width = 300; // Match Aadhaar face size
        canvas.height = 300;

        // Draw extracted face with better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          faceX, faceY, faceWidth, faceHeight,
          0, 0, 300, 300
        );

        const faceImage = canvas.toDataURL('image/jpeg', 0.9);
        
        resolve({
          faceImage,
          descriptor: detection.descriptor
        });
      } catch (error) {
        console.error('Error extracting face from selfie:', error);
        resolve(null);
      }
    };
    
    img.onerror = () => {
      console.error('Failed to load selfie image');
      resolve(null);
    };
    
    img.src = imageUrl;
  });
};

export const compareFaceDescriptors = (descriptor1: Float32Array, descriptor2: Float32Array): number => {
  try {
    // Calculate euclidean distance
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);
    
    // Enhanced similarity calculation with better thresholds
    // Distance of 0.6 or less is considered a good match
    // Distance of 0.4 or less is considered an excellent match
    let similarity;
    
    if (distance <= 0.4) {
      // Excellent match: 85-100%
      similarity = 85 + (0.4 - distance) * 37.5; // Scale 0.4-0 to 85-100
    } else if (distance <= 0.6) {
      // Good match: 60-85%
      similarity = 60 + (0.6 - distance) * 125; // Scale 0.6-0.4 to 60-85
    } else if (distance <= 0.8) {
      // Fair match: 30-60%
      similarity = 30 + (0.8 - distance) * 150; // Scale 0.8-0.6 to 30-60
    } else {
      // Poor match: 0-30%
      similarity = Math.max(0, 30 - (distance - 0.8) * 100);
    }
    
    similarity = Math.max(0, Math.min(100, similarity));
    
    console.log('Enhanced face comparison - Distance:', distance, 'Similarity:', similarity);
    
    return Math.round(similarity);
  } catch (error) {
    console.error('Face comparison error:', error);
    return 0;
  }
};

// Enhanced fallback face extraction with better region detection
export const extractFaceRegionFallback = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        // Enhanced face region detection for Aadhaar cards
        // Aadhaar face is typically in the left portion, about 1/3 from top
        const faceRegionX = img.width * 0.05; // Start from 5% from left
        const faceRegionY = img.height * 0.25; // Start from 25% from top
        const faceRegionWidth = img.width * 0.35; // 35% of width
        const faceRegionHeight = img.height * 0.5; // 50% of height

        canvas.width = 300;
        canvas.height = 300;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(
          img,
          faceRegionX, faceRegionY, faceRegionWidth, faceRegionHeight,
          0, 0, 300, 300
        );

        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch (error) {
        console.error('Enhanced fallback face extraction error:', error);
        resolve(imageUrl);
      }
    };
    
    img.onerror = () => resolve(imageUrl);
    img.src = imageUrl;
  });
};