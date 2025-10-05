
import React, { useState, useEffect, useCallback } from 'react';
import { generateCreativePrompt, generateImage } from './services/geminiService';
import WallpaperDisplay from './components/WallpaperDisplay';
import AdPlaceholder from './components/AdPlaceholder';
import Header from './components/Header';
import Controls from './components/Controls';
import CategorySelector from './components/CategorySelector';
import SizeSelector from './components/SizeSelector';
import History from './components/History';

interface HistoryItem {
  imageUrl: string;
  prompt: string;
}

const App: React.FC = () => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Featured');
  const [selectedSize, setSelectedSize] = useState<string>('Laptop');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const generateNewWallpaper = useCallback(async (category: string, size: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = await generateCreativePrompt(category);
      setCurrentPrompt(prompt);
      const imageUrl = await generateImage(prompt, size);
      setCurrentImageUrl(imageUrl);
      setHistory(prev => [{ imageUrl, prompt }, ...prev].slice(0, 10));
    } catch (err) {
      console.error('Failed to generate wallpaper:', err);
      setError('Failed to generate wallpaper. The AI might be too busy. Please wait a moment.');
      // Keep the old wallpaper if a new one fails
    } finally {
      setIsLoading(false);
      setCountdown(60);
    }
  }, []);

  useEffect(() => {
    generateNewWallpaper(selectedCategory, selectedSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPaused || isLoading) return;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isPaused, isLoading]);

  useEffect(() => {
    if (countdown === 0 && !isPaused) {
      generateNewWallpaper(selectedCategory, selectedSize);
    }
  }, [countdown, isPaused, generateNewWallpaper, selectedCategory, selectedSize]);
  
  const handleCategoryChange = (category: string) => {
    if (isLoading) return;
    setSelectedCategory(category);
    generateNewWallpaper(category, selectedSize);
  };

  const handleSizeChange = (size: string) => {
    if (isLoading) return;
    setSelectedSize(size);
    generateNewWallpaper(selectedCategory, size);
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const handleDownload = () => {
    if (!currentImageUrl) return;
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = `${currentPrompt.substring(0, 30).replace(/\s/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleSelectFromHistory = (item: HistoryItem) => {
    if (isLoading) return;
    setCurrentImageUrl(item.imageUrl);
    setCurrentPrompt(item.prompt);
    setIsPaused(true); // Pause countdown when viewing an old image
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <Header />
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 p-4 md:p-8">
        <main className="flex-grow flex flex-col gap-4">
           <WallpaperDisplay
            imageUrl={currentImageUrl}
            isLoading={isLoading}
            error={error}
            size={selectedSize}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CategorySelector 
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              isLoading={isLoading}
            />
            <SizeSelector
              selectedSize={selectedSize}
              onSelectSize={handleSizeChange}
              isLoading={isLoading}
            />
          </div>
          <Controls
            prompt={currentPrompt}
            countdown={countdown}
            isPaused={isPaused}
            onTogglePause={togglePause}
            onRegenerate={() => generateNewWallpaper(selectedCategory, selectedSize)}
            onDownload={handleDownload}
            isLoading={isLoading}
          />
        </main>
        <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-8">
          <History history={history} onSelect={handleSelectFromHistory} />
          <AdPlaceholder title="Upgrade to Pro" description="Remove ads and get high-resolution wallpapers." />
          <AdPlaceholder title="Sponsor" description="Your ad could be here. Reach thousands of creatives." />
        </aside>
      </div>
    </div>
  );
};

export default App;
