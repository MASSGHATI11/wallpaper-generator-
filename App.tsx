
import React, { useState, useEffect, useCallback } from 'react';
import { generateCreativePrompt, generateImage } from './services/geminiService';
import WallpaperDisplay from './components/WallpaperDisplay';
import AdPlaceholder from './components/AdPlaceholder';
import Header from './components/Header';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const generateNewWallpaper = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const prompt = await generateCreativePrompt();
      setCurrentPrompt(prompt);
      const imageUrl = await generateImage(prompt);
      setCurrentImageUrl(imageUrl);
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
    generateNewWallpaper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isPaused]);

  useEffect(() => {
    if (countdown === 0 && !isPaused) {
      generateNewWallpaper();
    }
  }, [countdown, isPaused, generateNewWallpaper]);

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


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <Header />
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 p-4 md:p-8">
        <main className="flex-grow flex flex-col gap-4">
           <WallpaperDisplay
            imageUrl={currentImageUrl}
            isLoading={isLoading}
            error={error}
          />
          <Controls
            prompt={currentPrompt}
            countdown={countdown}
            isPaused={isPaused}
            onTogglePause={togglePause}
            onRegenerate={generateNewWallpaper}
            onDownload={handleDownload}
            isLoading={isLoading}
          />
        </main>
        <aside className="w-full md:w-72 flex-shrink-0 flex flex-col gap-8">
          <AdPlaceholder title="Upgrade to Pro" description="Remove ads and get high-resolution wallpapers." />
          <AdPlaceholder title="Sponsor" description="Your ad could be here. Reach thousands of creatives." />
        </aside>
      </div>
    </div>
  );
};

export default App;
