
import React from 'react';

export const sizes = [
  { name: 'Laptop', icon: 'fa-laptop' },
  { name: 'Phone', icon: 'fa-mobile-alt' },
];

interface SizeSelectorProps {
  selectedSize: string;
  onSelectSize: (size: string) => void;
  isLoading: boolean;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, onSelectSize, isLoading }) => {
  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Choose a Size</h3>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size.name}
            onClick={() => onSelectSize(size.name)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedSize === size.name
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <i className={`fas ${size.icon}`}></i>
            <span>{size.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;
