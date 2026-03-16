import { useState, useEffect } from 'react';
import QuestionDisplay from './QuestionDisplay';
import ProgressIndicator from './ProgressIndicator';
import ResultScreen from './ResultScreen';
import { quizApi } from '../api/quiz.api';
import GameModuleLayout from './shared/GameModuleLayout';
import { getPlayerProgress, savePlayerProgress, awardGameXP } from '../utils/progressManager';

/**
 * Main Quiz Component
 * 
 * Manages quiz state and orchestrates quiz flow from start to finish.
 */
const Quiz = ({ userId = 'demo-user', onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [playerProgress, setPlayerProgress] = useState(null);

  // Load player progress on component mount
  useEffect(() => {
    const progress = getPlayerProgress(userId);
    setPlayerProgress(progress);
  }, [userId]);

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await quizApi.getQuestions();
      setQuestions(data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      setLoading(false);
      console.error('Error fetching questions:', err);
    }
  };

  const handleOptionSelect = async (option) => {
    if (selectedOption || isTransitioning) return; // Prevent multiple selections

    setSelectedOption(option);
    
    // Record the response
    const currentQuestion = questions[currentQuestionIndex];
    const newResponse = {
      questionId: currentQuestion.id,
      selectedOption: option
    };
    
    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 600));

    // Check if this was the last question
    if (currentQuestionIndex === questions.length - 1) {
      // Submit quiz
      await submitQuiz(updatedResponses);
    } else {
      // Move to next question
      setIsTransitioning(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsTransitioning(false);
    }
  };

  const submitQuiz = async (finalResponses) => {
    try {
      setLoading(true);
      const data = await quizApi.submitQuiz(userId, finalResponses);
      setResults(data.data);
      setQuizCompleted(true);
      setLoading(false);
      
      // Award XP only on quiz completion
      if (playerProgress) {
        const score = data.data.score || 0;
        const totalQuestions = questions.length;
        const correctAnswers = data.data.correctAnswers || 0;
        const perfect = correctAnswers === totalQuestions;
        
        // Use the new awardGameXP function
        const updatedProgress = awardGameXP(playerProgress, 'quiz', 'Basic', score, perfect);
        setPlayerProgress(updatedProgress);
        savePlayerProgress(userId, updatedProgress);
      }
      
      // Notify parent of completion with level
      if (onComplete) {
        onComplete(data.data.level);
      }
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setLoading(false);
      console.error('Error submitting quiz:', err);
    }
  };

  const handleRetakeQuiz = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResponses([]);
    setQuizCompleted(false);
    setResults(null);
    setSelectedOption(null);
    setIsTransitioning(false);
    fetchQuestions();
  };

  // Loading state
  if (loading && questions.length === 0) {
    return (
      <GameModuleLayout 
        title="Loading Quiz" 
        level={playerProgress?.level || 1} 
        currentXP={playerProgress?.xp || 0} 
        maxXP={(playerProgress?.level || 1) * 100} 
        coins={playerProgress?.coins || 0} 
        streak={playerProgress?.streaks?.current || 0}
      >
        <div className="flex items-center justify-center p-8">
          <div className="bg-slate-800/70 rounded-3xl p-8 max-w-md w-full shadow-lg ring-1 ring-amber-300/10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-lg font-medium text-amber-200">Loading your quiz...</p>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Error state
  if (error && questions.length === 0) {
    return (
      <GameModuleLayout 
        title="Quiz Error" 
        level={playerProgress?.level || 1} 
        currentXP={playerProgress?.xp || 0} 
        maxXP={(playerProgress?.level || 1) * 100} 
        coins={playerProgress?.coins || 0} 
        streak={playerProgress?.streaks?.current || 0}
      >
        <div className="flex items-center justify-center p-8">
          <div className="bg-slate-800/70 rounded-3xl p-8 max-w-md w-full shadow-lg ring-1 ring-red-500/10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-lg font-medium text-amber-200 text-center">{error}</p>
              <button
                onClick={fetchQuestions}
                className="px-6 py-3 bg-amber-400 text-slate-900 rounded-xl font-medium hover:brightness-95 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </GameModuleLayout>
    );
  }

  // Quiz completed - show results
  if (quizCompleted && results) {
    return <ResultScreen results={results} onRetake={handleRetakeQuiz} />;
  }

  // Quiz in progress
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <GameModuleLayout 
      title="Quiz" 
      level={playerProgress?.level || 1} 
      currentXP={playerProgress?.xp || 0} 
      maxXP={(playerProgress?.level || 1) * 100} 
      coins={playerProgress?.coins || 0} 
      streak={playerProgress?.streaks?.current || 0}
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <ProgressIndicator 
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />

        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          <QuestionDisplay
            question={currentQuestion}
            onSelectOption={handleOptionSelect}
            selectedOption={selectedOption}
            disabled={selectedOption !== null || isTransitioning}
          />
        </div>
      </div>
    </GameModuleLayout>
  );
};

export default Quiz;
