
import React from 'react';

interface HistoryItem {
  imageUrl: string;
  prompt: string;
}

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect }) => {
  return (
    <div className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
      <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-3">
        Recent Creations
      </h3>
      {history.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">
          Your generated wallpapers will appear here.
        </p>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {history.map((item, index) => (
            <button
              key={`${item.imageUrl.slice(-20)}-${index}`}
              onClick={() => onSelect(item)}
              className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-transform duration-200 hover:scale-105 group"
              aria-label={`Select wallpaper with prompt: ${item.prompt}`}
            >
              <img
                src={item.imageUrl}
                alt={item.prompt}
                className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
