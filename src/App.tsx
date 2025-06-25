import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Selfie from './pages/Selfie';
import Compare from './pages/Compare';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import { VerificationProvider } from './context/VerificationContext';

function App() {
  return (
    <VerificationProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/selfie" element={<Selfie />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </VerificationProvider>
  );
}

export default App;