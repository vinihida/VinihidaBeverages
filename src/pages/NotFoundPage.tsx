import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container px-4 mx-auto">
        <div className="max-w-md mx-auto text-center">
          <Wine className="h-20 w-20 text-primary-500 mx-auto mb-6" />
          
          <h1 className="text-4xl font-serif font-bold mb-4">Page Not Found</h1>
          
          <p className="text-neutral-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <Link to="/" className="btn-primary inline-flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;