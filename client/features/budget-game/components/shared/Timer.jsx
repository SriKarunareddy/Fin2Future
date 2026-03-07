import { useState, useEffect } from 'react';

/**
 * Timer Component
 * 
 * Reusable countdown timer with visual feedback
 */
const Timer = ({ duration, onComplete, isPaused = false, showWarning = true }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onComplete]);

  const percentage = (timeLeft / duration) * 100;
  const isWarning = showWarning && percentage < 30;
  const isCritical = showWarning && percentage < 10;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <svg className={`w-5 h-5 ${isCritical ? 'text-red-500 animate-pulse' : isWarning ? 'text-orange-500' : 'text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-lg font-bold ${isCritical ? 'text-red-600' : isWarning ? 'text-orange-600' : 'text-gray-700'}`}>
            {timeLeft}s
          </span>
        </div>
        <span className="text-sm text-gray-500">
          {Math.floor(percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear rounded-full ${
            isCritical
              ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse'
              : isWarning
              ? 'bg-gradient-to-r from-orange-400 to-orange-500'
              : 'bg-gradient-to-r from-blue-400 to-purple-500'
          }`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
