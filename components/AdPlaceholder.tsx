
import React from 'react';

interface AdPlaceholderProps {
  title: string;
  description: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ title, description }) => {
  return (
    <div className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Advertisement</h3>
      <div className="mt-2 text-center py-6 border-t border-b border-gray-700">
        <h4 className="text-lg font-semibold text-white">{title}</h4>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-md transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default AdPlaceholder;
