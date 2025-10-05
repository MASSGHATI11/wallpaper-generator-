import React from 'react';

interface SizeSelectorProps {
  selectedSize: string;
  onSelectSize: (size: string) => void;
  isLoading: boolean;
}

const SizeOption: React.FC<{
  name: string;
  aspectRatio: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ name, aspectRatio, icon, isSelected, onClick, disabled }) => {
  const aspectClass = aspectRatio === '16:9' ? 'aspect-video w-24' : 'aspect-[9/16] h-24';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full p-4 rounded-lg border-2 transition-all duration-300 
        flex flex-col items-center justify-center gap-3 h-48
        group disabled:opacity-50 disabled:cursor-not-allowed
        ${isSelected
          ? 'bg-gray-700/50 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
        }
      `}
    >
      <div className="flex-grow flex items-center justify-center">
        <div className={`
          ${aspectClass}
          bg-gray-900/70 rounded-md flex items-center justify-center 
          border border-gray-600 group-hover:border-gray-500 transition-colors
          ${isSelected ? '!border-blue-600' : ''}
        `}>
          <i className={`fas ${icon} text-3xl transition-colors duration-300 ${
            isSelected ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-400'
          }`}></i>
        </div>
      </div>
      <span className={`text-sm font-semibold transition-colors duration-300 ${
        isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
      }`}>
        {name}
      </span>
    </button>
  );
};


const SizeSelector: React.FC<SizeSelectorProps> = ({ selectedSize, onSelectSize, isLoading }) => {
  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Choose a Size</h3>
      <div className="grid grid-cols-2 gap-4">
        <SizeOption
          name="Laptop"
          aspectRatio="16:9"
          icon="fa-laptop"
          isSelected={selectedSize === 'Laptop'}
          onClick={() => onSelectSize('Laptop')}
          disabled={isLoading}
        />
        <SizeOption
          name="Phone"
          aspectRatio="9:16"
          icon="fa-mobile-alt"
          isSelected={selectedSize === 'Phone'}
          onClick={() => onSelectSize('Phone')}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};

export default SizeSelector;