import React from 'react';

/**
 * ProgressIndicator Component
 * 
 * Displays the current question number and a visual progress bar.
 * Includes gamification elements like icons and smooth animations.
 */
const ProgressIndicator = ({ currentQuestion, totalQuestions }) => {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 animate-slideDown">
      <div className="flex items-center justify-between mb-3">
        {/* Question Counter with Icon */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Question</p>
            <p className="text-xl font-bold text-gray-800">
              {currentQuestion} <span className="text-gray-400">of</span> {totalQuestions}
            </p>
          </div>
        </div>

        {/* Percentage Badge */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-2 rounded-xl">
          <p className="text-sm font-bold text-purple-600">
            {Math.round(progressPercentage)}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full transition-all duration-500 ease-out shadow-md"
          style={{ width: `${progressPercentage}%` }}
        >
          {/* Animated shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>

      {/* Milestone indicators */}
      <div className="flex justify-between mt-2 px-1">
        {[...Array(totalQuestions)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index < currentQuestion
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 scale-110'
                : 'bg-gray-300 scale-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
