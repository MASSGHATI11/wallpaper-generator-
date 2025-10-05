
import React from 'react';

interface ControlsProps {
  prompt: string;
  countdown: number;
  isPaused: boolean;
  onTogglePause: () => void;
  onRegenerate: () => void;
  onDownload: () => void;
  isLoading: boolean;
}

const IconButton: React.FC<{ icon: string; onClick: () => void; label: string; disabled?: boolean; spin?: boolean }> = ({ icon, onClick, label, disabled = false, spin = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-all duration-200"
        aria-label={label}
    >
        <i className={`fas ${icon} ${spin ? 'animate-spin' : ''}`}></i>
        <span>{label}</span>
    </button>
);


const Controls: React.FC<ControlsProps> = ({ prompt, countdown, isPaused, onTogglePause, onRegenerate, onDownload, isLoading }) => {
  const progressPercentage = (countdown / 60) * 100;

  return (
    <div className="w-full bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="mb-4">
            <label className="text-sm font-semibold text-gray-400">Current Prompt</label>
            <p className="mt-1 p-3 bg-gray-900 rounded-md text-gray-300 h-16 overflow-y-auto text-sm italic">
                {prompt || 'Generating prompt...'}
            </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto flex items-center gap-4">
               <IconButton
                    icon={isPaused ? "fa-play" : "fa-pause"}
                    onClick={onTogglePause}
                    label={isPaused ? "Resume" : "Pause"}
                    disabled={isLoading}
                />
                 <IconButton
                    icon="fa-sync-alt"
                    onClick={onRegenerate}
                    label="Regenerate"
                    disabled={isLoading}
                    spin={isLoading}
                />
                <IconButton
                    icon="fa-download"
                    onClick={onDownload}
                    label="Download"
                    disabled={isLoading}
                />
            </div>
            <div className="w-full sm:w-1/3">
                 <div className="w-full bg-gray-700 rounded-full h-2.5 relative overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${isPaused ? progressPercentage : 100}%`, transition: isPaused ? 'width 0.3s' : `width ${countdown}s linear` }}
                    ></div>
                 </div>
                 <p className="text-center text-xs text-gray-400 mt-1">Next in {countdown}s</p>
            </div>
        </div>
    </div>
  );
};

export default Controls;
