import React from 'react';

interface WallpaperDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  size: string;
}

const WallpaperDisplay: React.FC<WallpaperDisplayProps> = ({ imageUrl, isLoading, error, size }) => {
  const containerClass = size === 'Phone'
    ? "relative w-full max-w-sm mx-auto aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden shadow-2xl transition-all duration-500"
    : "relative w-full aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-2xl transition-all duration-500";
    
  return (
    <div className={containerClass}>
      {imageUrl && !isLoading && (
        <img
          key={imageUrl}
          src={imageUrl}
          alt="Generated AI Wallpaper"
          className="w-full h-full object-cover animate-fade-in-zoom"
        />
      )}
      
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-10 scanline-container">
          <i className="fas fa-brain text-4xl text-blue-300 animate-pulse-slow"></i>
          <p className="mt-4 text-lg font-semibold text-white tracking-wider animate-pulse-slow">
            Generating new reality...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-80 p-4 z-10">
          <i className="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
          <h3 className="text-xl font-bold text-white text-center">An Error Occurred</h3>
          <p className="text-red-200 text-center mt-2">{error}</p>
        </div>
      )}

      {/* Keep previous image visible during loading, but dimmed */}
      {imageUrl && isLoading && (
         <img
          src={imageUrl}
          alt="Previous AI Wallpaper"
          className="w-full h-full object-cover opacity-50"
        />
      )}
    </div>
  );
};

export default WallpaperDisplay;