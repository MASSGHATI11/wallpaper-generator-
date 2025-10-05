
import React from 'react';

export const categories = [
  { name: 'Featured', icon: 'fa-star' },
  { name: 'Landscapes', icon: 'fa-mountain-sun' },
  { name: 'Sci-Fi', icon: 'fa-rocket' },
  { name: 'Abstract', icon: 'fa-shapes' },
  { name: 'Animals', icon: 'fa-paw' },
  { name: 'Cityscapes', icon: 'fa-city' },
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
