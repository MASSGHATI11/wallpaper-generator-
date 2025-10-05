
import React, { useState } from 'react';
import { AdvancedPromptOptions } from '../App';

interface AdvancedOptionsProps {
    options: AdvancedPromptOptions;
    onOptionsChange: (newOptions: Partial<AdvancedPromptOptions>) => void;
    isLoading: boolean;
}

const artStyles = ['Any', 'Photorealistic', 'Impressionistic', 'Surrealist', 'Pixel Art', 'Bauhaus', 'Anime', 'Cyberpunk'];
const colorPalettes = ['Any', 'Vibrant', 'Muted', 'Monochromatic', 'Pastel', 'Neon'];
const detailLevels = {
    1: 'Minimalist',
    2: 'Simple',
    3: 'Balanced',
    4: 'Detailed',
    5: 'Intricate'
};

const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ options, onOptionsChange, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between items-center bg-gray-700 hover:bg-gray-600 transition-colors"
                aria-expanded={isOpen}
            >
                <h3 className="text-sm font-semibold text-gray-300">
                    <i className="fas fa-sliders-h mr-2"></i>
                    Advanced Options
                </h3>
                <i className={`fas fa-chevron-down transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 p-4' : 'max-h-0 p-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Art Style */}
                    <div>
                        <label htmlFor="art-style" className="block text-xs font-medium text-gray-400 mb-1">Art Style</label>
                        <select
                            id="art-style"
                            value={options.artStyle}
                            onChange={(e) => onOptionsChange({ artStyle: e.target.value })}
                            disabled={isLoading}
                            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:opacity-50"
                        >
                            {artStyles.map(style => <option key={style} value={style}>{style}</option>)}
                        </select>
                    </div>

                    {/* Color Palette */}
                    <div>
                        <label htmlFor="color-palette" className="block text-xs font-medium text-gray-400 mb-1">Color Palette</label>
                        <select
                            id="color-palette"
                            value={options.colorPalette}
                            onChange={(e) => onOptionsChange({ colorPalette: e.target.value })}
                            disabled={isLoading}
                            className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:opacity-50"
                        >
                            {colorPalettes.map(palette => <option key={palette} value={palette}>{palette}</option>)}
                        </select>
                    </div>

                    {/* Detail Level */}
                    <div className="md:col-span-1">
                        <label htmlFor="detail-level" className="block text-xs font-medium text-gray-400 mb-1">
                            Detail Level: <span className="font-bold text-blue-400">{detailLevels[options.detailLevel as keyof typeof detailLevels]}</span>
                        </label>
                        <input
                            id="detail-level"
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={options.detailLevel}
                            onChange={(e) => onOptionsChange({ detailLevel: parseInt(e.target.value, 10) })}
                            disabled={isLoading}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedOptions;
