import React, { useState } from 'react';
import { Wine, AlertTriangle } from 'lucide-react';

interface AgeVerificationProps {
  onVerify: () => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerify }) => {
  const [error, setError] = useState(false);

  const handleVerify = () => {
    onVerify();
  };

  const handleDeny = () => {
    setError(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="glass max-w-md w-full p-8 text-center animate-fade-in">
        <Wine className="h-16 w-16 text-primary-500 mx-auto mb-6" />
        
        <h2 className="text-3xl font-serif font-bold text-white mb-4">Age Verification</h2>
        
        {error ? (
          <div className="mb-6 text-white bg-error-500 bg-opacity-20 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-error-500 mr-2" />
              <span className="font-medium">You must be of legal drinking age</span>
            </div>
            <p className="text-sm">
              We cannot allow access to individuals under the legal drinking age. 
              Please return when you are of legal age to drink alcohol.
            </p>
          </div>
        ) : (
          <p className="text-white mb-6">
            You must be of legal drinking age to enter this website. 
            By entering, you confirm that you are at least 21 years of age or the legal drinking age in your country.
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleVerify}
            className="btn-primary py-2"
          >
            I am of legal age
          </button>
          <button 
            onClick={handleDeny}
            className="btn bg-neutral-700 text-white hover:bg-neutral-800 py-2"
          >
            I am under age
          </button>
        </div>
        
        <p className="mt-6 text-neutral-400 text-xs">
          Please drink responsibly. Don't drink and drive.
        </p>
      </div>
    </div>
  );
};

export default AgeVerification;