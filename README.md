# Aadhaar Card Verification System

[Live Demo](https://grand-florentine-cb2bd6.netlify.app/) | [Demo Video](https://drive.google.com/file/d/1sBvlnlZTaPqozEoOj5n_Rw5C0T9Ee8xq/view)

## Overview

The **Aadhaar Card Verification System** is a web application that verifies user identity by extracting information from an uploaded Aadhaar card image and matching it with a live selfie. The system supports multiple Indian languages and leverages OCR and face recognition technologies to provide accurate and secure verification.

## Problem Statement

Manual identity verification is often slow and error-prone. This system automates the process by extracting text and photo data from Aadhaar cards and matching it with a live selfie, enabling quick, reliable, and inclusive identity verification for digital services.

## Workflow

1. **User Uploads Aadhaar Image**  
   - Upload scanned or photographed Aadhaar card images supporting multiple Indian languages.  
   - *Technology:* React.js file upload interface.

2. **OCR Text Extraction**  
   - Extracts text including Date of Birth (DOB) and photo from the Aadhaar image.  
   - *Technology:* [tesseract.js](https://github.com/naptha/tesseract.js).

3. **Live Selfie Capture**  
   - User captures a real-time selfie via webcam or mobile camera.  
   - *Technology:* `getUserMedia()`, HTML5 `<canvas>`.

4. **Face Detection and Matching**  
   - Compares Aadhaar photo and live selfie using face detection and embedding comparison.  
   - Outputs a confidence score indicating match accuracy.  
   - *Technology:* [face-api.js](https://github.com/justadudewhohacks/face-api.js).

5. **Age Calculation and Verification**  
   - Calculates age from extracted DOB and verifies age criteria (e.g., 18+).  
   - *Technology:* JavaScript `Date()`.

6. **Result Display**  
   - Shows verification results including face match confidence, age eligibility, and selfie quality feedback (e.g., blur, lighting).  
   - UI includes toasters, progress bars, and error messages.

7. **Optional Data Security Measures**  
   - Secure session data handling using `sessionStorage`.  
   - Privacy considerations integrated throughout.

## Technology Stack

| Feature                    | Technology/Library     |
|----------------------------|-----------------------|
| Frontend UI                | React.js              |
| OCR Text Extraction        | tesseract.js          |
| Live Selfie Capture        | getUserMedia(), HTML5 Canvas |
| Face Detection & Matching  | face-api.js           |
| Age Calculation            | JavaScript Date       |
| Data Security & Storage    | sessionStorage, HTTPS |

## Unique Selling Points (USPs)

- **Supports All Local Indian Languages:** Accurate OCR extraction across multiple Indian languages ensures inclusivity.  
- **Secure and Reliable:** Encrypted data transmission via HTTPS and secure session handling protect user privacy.  
- **User-Friendly and Accessible:** Intuitive UI enables seamless Aadhaar image upload and selfie capture.  
- **Confidence Score & Feedback:** Clear match confidence and selfie quality feedback improve user experience.  
- **Scalable Architecture:** Built with modern web technologies for easy maintenance and future enhancements.

## Future Scope

- **Multimodal Verification:** Integrate voice biometrics alongside face and document verification for higher accuracy.  
- **Indic Language Support with Sarvam API:** Use Sarvam’s translation and transliteration APIs for regional language support.  
- **Real-Time Translation:** Enable dynamic translation of extracted text and system feedback between English and Indian languages.  
- **Voice Interaction:** Incorporate speech-to-text and text-to-speech APIs for voice commands and audio feedback.  
- **Additional Biometrics:** Add fingerprint or iris recognition to strengthen identity verification.  
- **Enhanced Data Privacy & Security:** Implement encryption and secure data handling for sensitive biometric data.
