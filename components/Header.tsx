
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex justify-center items-center border-b border-gray-800">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          AI Wallpaper Generator
        </h1>
        <p className="text-gray-400 mt-1">A new reality every minute, powered by Gemini.</p>
      </div>
    </header>
  );
};

export default Header;
