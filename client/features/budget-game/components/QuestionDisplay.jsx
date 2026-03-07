import React from 'react';

/**
 * QuestionDisplay Component
 * 
 * Displays a single quiz question with four multiple choice options.
 * Features smooth animations and modern game-style UI.
 */
const QuestionDisplay = ({ question, onSelectOption, selectedOption, disabled }) => {
  if (!question) return null;

  const options = ['A', 'B', 'C', 'D'];

  const getOptionColor = (option) => {
    const colors = {
      A: 'from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600',
      B: 'from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600',
      C: 'from-violet-400 to-violet-500 hover:from-violet-500 hover:to-violet-600',
      D: 'from-coral-400 to-pink-500 hover:from-coral-500 hover:to-pink-600'
    };
    return colors[option] || colors.A;
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mt-6 animate-fadeIn">
      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {options.map((option) => {
          const isSelected = selectedOption === option;
          const optionText = question.options[option];

          return (
            <button
              key={option}
              onClick={() => !disabled && onSelectOption(option)}
              disabled={disabled}
              className={`
                w-full text-left p-6 rounded-2xl transition-all duration-300 transform
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] hover:shadow-xl'}
                ${isSelected 
                  ? `bg-gradient-to-r ${getOptionColor(option)} text-white shadow-lg scale-[1.02] ring-4 ring-offset-2 ring-${option === 'A' ? 'blue' : option === 'B' ? 'teal' : option === 'C' ? 'violet' : 'pink'}-300`
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-2 border-gray-200'
                }
                ${!disabled && !isSelected ? 'hover:border-gray-300' : ''}
              `}
            >
              <div className="flex items-center space-x-4">
                {/* Option Letter Badge */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
                  ${isSelected 
                    ? 'bg-white bg-opacity-30 text-white' 
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700'
                  }
                  transition-all duration-300
                `}>
                  {option}
                </div>

                {/* Option Text */}
                <div className={`
                  flex-1 text-lg md:text-xl font-medium
                  ${isSelected ? 'text-white' : 'text-gray-800'}
                  transition-colors duration-300
                `}>
                  {optionText}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="flex-shrink-0 animate-scaleIn">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper Text */}
      {!disabled && !selectedOption && (
        <p className="mt-6 text-center text-gray-500 text-sm animate-pulse">
          Select your answer to continue
        </p>
      )}
    </div>
  );
};

export default QuestionDisplay;
