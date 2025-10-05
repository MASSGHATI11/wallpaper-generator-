
import React, { useState, useEffect, useCallback } from 'react';
import { generateCreativePrompt, generateImage } from './services/geminiService';
import WallpaperDisplay from './components/WallpaperDisplay';
import AdPlaceholder from './components/AdPlaceholder';
import Header from './components/Header';
import Controls from './components/Controls';
import CategorySelector from './components/CategorySelector';
import SizeSelector from './components/SizeSelector';
import History from './components/History';
import AdvancedOptions from './components/AdvancedOptions';

interface HistoryItem {
  imageUrl: string;
  prompt: string;
}

export interface AdvancedPromptOptions {
  artStyle: string;
  colorPalette: string;
  detailLevel: number;
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
  const [advancedOptions, setAdvancedOptions] = useState<AdvancedPromptOptions>({
    artStyle: 'Any',
    colorPalette: 'Any',
    detailLevel: 3, // Mid-point for a 1-5 slider
  });

  const generateNewWallpaper = useCallback(async (category: string, size: string, options: AdvancedPromptOptions) => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = await generateCreativePrompt(category, options);
      setCurrentPrompt(prompt);
      const imageUrl = await generateImage(prompt, size);
      setCurrentImageUrl(imageUrl);
      setHistory(prev => [{ imageUrl, prompt }, ...prev].slice(0, 10));
    } catch (err: any) {
      console.error('Failed to generate wallpaper:', err);
      if (err.message === "QUOTA_EXHAUSTED") {
        setError("API quota exceeded. Automatic regeneration is paused. Please check your billing details or try again later.");
        setIsPaused(true);
      } else {
        setError('Failed to generate wallpaper. The AI might be too busy. Please wait a moment.');
      }
      // Keep the old wallpaper if a new one fails
    } finally {
      setIsLoading(false);
      setCountdown(60);
    }
  }, []);

  useEffect(() => {
    generateNewWallpaper(selectedCategory, selectedSize, advancedOptions);
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
      generateNewWallpaper(selectedCategory, selectedSize, advancedOptions);
    }
  }, [countdown, isPaused, generateNewWallpaper, selectedCategory, selectedSize, advancedOptions]);
  
  const handleCategoryChange = (category: string) => {
    if (isLoading) return;
    setSelectedCategory(category);
    generateNewWallpaper(category, selectedSize, advancedOptions);
  };

  const handleSizeChange = (size: string) => {
    if (isLoading) return;
    setSelectedSize(size);
    generateNewWallpaper(selectedCategory, size, advancedOptions);
  };

  const handleAdvancedOptionsChange = (newOptions: Partial<AdvancedPromptOptions>) => {
    if (isLoading) return;
    const updatedOptions = { ...advancedOptions, ...newOptions };
    setAdvancedOptions(updatedOptions);
    generateNewWallpaper(selectedCategory, selectedSize, updatedOptions);
  };


  const togglePause = () => {
    setIsPaused(prev => !prev);
  };
  
  const handleDownload = () => {
    if (!currentImageUrl) return;

    // 1. More robustly sanitize the prompt for a safe filename
    const sanitizedPrompt = currentPrompt
      .substring(0, 50) // Use a portion of the prompt for brevity
      .replace(/[\\/:*?"<>|]/g, '_') // Replace invalid OS-specific characters with an underscore
      .replace(/\s+/g, '_') // Replace whitespace with a single underscore
      .replace(/__+/g, '_') // Collapse multiple underscores into one
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

    // 2. Create a formatted timestamp (YYYYMMDDHHMMSS) for uniqueness
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');
    const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    
    // 3. Combine parts, using a default if the sanitized prompt is empty
    const filename = `${sanitizedPrompt || 'ai-wallpaper'}_${timestamp}.png`;

    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = filename;
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
          <AdvancedOptions 
            options={advancedOptions}
            onOptionsChange={handleAdvancedOptionsChange}
            isLoading={isLoading}
          />
          <Controls
            prompt={currentPrompt}
            countdown={countdown}
            isPaused={isPaused}
            onTogglePause={togglePause}
            onRegenerate={() => generateNewWallpaper(selectedCategory, selectedSize, advancedOptions)}
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