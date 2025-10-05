import React from 'react';

export const categories = [
  { name: 'Featured', icon: 'fa-star' },
  { name: 'Landscapes', icon: 'fa-mountain-sun' },
  { name: 'Nature', icon: 'fa-leaf' },
  { name: 'Sci-Fi', icon: 'fa-rocket' },
  { name: 'Cyberpunk', icon: 'fa-robot' },
  { name: 'Cars', icon: 'fa-car' },
  { name: 'Anime', icon: 'fa-eye' },
  { name: 'Fantasy', icon: 'fa-dragon' },
  { name: 'Space', icon: 'fa-meteor' },
  { name: 'Underwater', icon: 'fa-water' },
  { name: 'Cityscapes', icon: 'fa-city' },
  { name: 'Animals', icon: 'fa-paw' },
  { name: 'Abstract', icon: 'fa-shapes' },
  { name: 'Minimalist', icon: 'fa-ellipsis-h' },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isLoading: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelectCategory, isLoading }) => {
  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Choose a Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedCategory === category.name
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            <i className={`fas ${category.icon}`}></i>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
