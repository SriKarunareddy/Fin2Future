# Quick Integration Examples

## 1. Basic Game Template

```jsx
import { useState } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';

const MyGame = ({ onComplete, onBack, playerProgress = {} }) => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAnswer = (correct) => {
    if (correct) {
      setScore(score + 10);
      setCurrentXP(currentXP + 25);
      setCoins(coins + 5);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    if (score >= 100) {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <RewardModal
        isOpen={true}
        score={score}
        reward={{
          xp: currentXP,
          coins: coins,
          badges: []
        }}
        onContinue={() => onComplete({ xp: currentXP, coins })}
        onReplay={() => location.reload()}
      />
    );
  }

  return (
    <GameLayout
      title="My Game"
      level={playerProgress.level || 1}
      score={score}
      currentXP={currentXP}
      coins={coins}
      onBack={onBack}
    >
      <ConfettiEffect trigger={showConfetti} intensity="normal" />
      
      <GameCard
        icon="🎯"
        title="Game Challenge"
        description="Do something awesome"
      />

      <ActionButtons
        buttons={[
          { label: 'Yes', onClick: () => handleAnswer(true) },
          { label: 'No', onClick: () => handleAnswer(false), variant: 'secondary' }
        ]}
      />
    </GameLayout>
  );
};

export default MyGame;
```

---

## 2. Quiz Game with Multiple Questions

```jsx
import { useState, useEffect } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';
import AchievementPopup from './shared/AchievementPopup';

const QuizGame = ({ onComplete, onBack, playerProgress = {} }) => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievement, setAchievement] = useState(null);

  const questions = [
    { question: 'Question 1', answer: 'a', options: ['a', 'b', 'c'] },
    { question: 'Question 2', answer: 'b', options: ['a', 'b', 'c'] }
  ];

  const handleAnswer = (selected) => {
    const isCorrect = selected === questions[currentQuestion].answer;
    
    if (isCorrect) {
      setScore(score + 10);
      setCurrentXP(currentXP + 25);
      setCoins(coins + 5);
      setShowConfetti(true);
      
      if (score % 50 === 0) {
        setAchievement({
          type: 'milestone',
          icon: '⭐',
          title: 'Milestone!',
          description: `${score + 10} points reached!`
        });
      }
    }

    setTimeout(() => {
      if (currentQuestion >= questions.length - 1) {
        setGameOver(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setShowConfetti(false);
      }
    }, 1000);
  };

  if (gameOver) {
    return (
      <RewardModal
        isOpen={true}
        score={score}
        reward={{ xp: currentXP, coins }}
        onContinue={() => onComplete({ xp: currentXP, coins })}
        onReplay={() => location.reload()}
      />
    );
  }

  return (
    <GameLayout
      title="Quiz Game"
      level={playerProgress.level || 1}
      score={score}
      currentXP={currentXP}
      coins={coins}
      onBack={onBack}
    >
      <ConfettiEffect trigger={showConfetti} />
      <AchievementPopup
        isOpen={achievement !== null}
        type={achievement?.type}
        icon={achievement?.icon}
        title={achievement?.title}
        description={achievement?.description}
        onClose={() => setAchievement(null)}
      />

      <div className="mb-6">
        <p className="text-amber-300 font-bold text-sm text-center">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <GameCard
        icon="❓"
        title={questions[currentQuestion].question}
      />

      <ActionButtons
        buttons={questions[currentQuestion].options.map((opt, i) => ({
          label: opt.toUpperCase(),
          onClick: () => handleAnswer(opt),
          variant: i === 0 ? 'primary' : 'secondary'
        }))}
      />
    </GameLayout>
  );
};

export default QuizGame;
```

---

## 3. Trading/Matching Game

```jsx
import { useState } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';

const MatchingGame = ({ onComplete, onBack, playerProgress = {} }) => {
  const [pairs, setPairs] = useState([
    { id: 1, left: 'Item A', right: 'Match 1' },
    { id: 2, left: 'Item B', right: 'Match 2' }
  ]);
  const [matched, setMatched] = useState([]);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleMatch = (id) => {
    setMatched([...matched, id]);
    setScore(score + 20);
    setCurrentXP(currentXP + 30);
    setCoins(coins + 10);
    setShowConfetti(true);

    if (matched.length === pairs.length - 1) {
      setTimeout(() => {
        return (
          <RewardModal
            isOpen={true}
            score={score + 20}
            reward={{ xp: currentXP + 30, coins: coins + 10 }}
            onContinue={() => onComplete({ xp: currentXP + 30, coins: coins + 10 })}
          />
        );
      }, 1000);
    }
  };

  return (
    <GameLayout
      title="Matching Game"
      level={playerProgress.level || 1}
      score={score}
      currentXP={currentXP}
      coins={coins}
      onBack={onBack}
    >
      <ConfettiEffect trigger={showConfetti} intensity="normal" />

      <div className="grid grid-cols-1 gap-4 mb-8">
        {pairs.map(pair => (
          <div key={pair.id} className="flex gap-4">
            <GameCard
              title={pair.left}
              icon="📌"
              className="flex-1"
            />
            <GameCard
              title={pair.right}
              icon="🎯"
              className="flex-1"
            />
          </div>
        ))}
      </div>

      <ActionButtons
        buttons={pairs
          .filter(p => !matched.includes(p.id))
          .map(p => ({
            label: `Match ${p.id}`,
            onClick: () => handleMatch(p.id)
          }))}
      />
    </GameLayout>
  );
};

export default MatchingGame;
```

---

## 4. Drag & Drop Game

```jsx
import { useState } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';

const DragDropGame = ({ onComplete, onBack, playerProgress = {} }) => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', category: 'A' },
    { id: 2, name: 'Item 2', category: 'B' }
  ]);
  const [categorized, setCategorized] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const handleDropItem = (itemId, category) => {
    const item = items.find(i => i.id === itemId);
    
    if (item.category === category) {
      setScore(score + 10);
      setCurrentXP(currentXP + 25);
      setCoins(coins + 5);
      setCategorized([...categorized, itemId]);
      
      if (categorized.length === items.length - 1) {
        setGameOver(true);
      }
    }
  };

  if (gameOver) {
    return (
      <RewardModal
        isOpen={true}
        score={score}
        reward={{ xp: currentXP, coins }}
        onContinue={() => onComplete({ xp: currentXP, coins })}
      />
    );
  }

  return (
    <GameLayout
      title="Sort & Organize"
      level={playerProgress.level || 1}
      score={score}
      currentXP={currentXP}
      coins={coins}
      onBack={onBack}
    >
      <div className="grid grid-cols-2 gap-4 mb-8">
        <GameCard
          title="Category A"
          icon="📦"
          className="min-h-64"
        >
          <ActionButtons
            buttons={[
              { label: 'Drop Here', onClick: () => console.log('drop') }
            ]}
          />
        </GameCard>
        <GameCard
          title="Category B"
          icon="📦"
          className="min-h-64"
        >
          <ActionButtons
            buttons={[
              { label: 'Drop Here', onClick: () => console.log('drop') }
            ]}
          />
        </GameCard>
      </div>

      <div className="flex justify-center gap-4">
        {items
          .filter(i => !categorized.includes(i.id))
          .map(item => (
            <GameCard
              key={item.id}
              title={item.name}
              icon="🎁"
            />
          ))}
      </div>
    </GameLayout>
  );
};

export default DragDropGame;
```

---

## 5. Timer-based Game

```jsx
import { useState, useEffect } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';

const TimerGame = ({ onComplete, onBack, playerProgress = {} }) => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCorrect = () => {
    setScore(score + 10);
    setCurrentXP(currentXP + 25);
    setCoins(coins + 5);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 500);
  };

  if (gameOver) {
    return (
      <RewardModal
        isOpen={true}
        score={score}
        reward={{ xp: currentXP, coins }}
        onContinue={() => onComplete({ xp: currentXP, coins })}
      />
    );
  }

  return (
    <GameLayout
      title="Speed Challenge"
      level={playerProgress.level || 1}
      score={score}
      currentXP={currentXP}
      coins={coins}
      onBack={onBack}
    >
      <ConfettiEffect trigger={showConfetti} />

      {/* Timer Display */}
      <div className="flex justify-center mb-8">
        <div className={`
          w-24 h-24 rounded-full 
          flex items-center justify-center
          bg-gradient-to-br from-amber-400 to-orange-500
          shadow-lg shadow-amber-500/50
          ring-4 ring-amber-300
        `}>
          <span className="text-4xl font-black text-white">
            {timeLeft}s
          </span>
        </div>
      </div>

      <GameCard
        icon="⚡"
        title="Answer Quickly!"
        description="Time is running out"
        highlight={`${timeLeft} seconds remaining`}
      />

      <ActionButtons
        buttons={[
          { label: 'Answer (Correct)', onClick: handleCorrect },
          { label: 'Answer (Wrong)', onClick: () => setScore(score), variant: 'secondary' }
        ]}
      />
    </GameLayout>
  );
};

export default TimerGame;
```

---

## 6. Progressive Difficulty Game

```jsx
import { useState } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';
import AchievementPopup from './shared/AchievementPopup';

const ProgressiveGame = ({ onComplete, onBack, playerProgress = {} }) => {
  const [stage, setStage] = useState(1);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [currentXP, setCurrentXP] = useState(playerProgress.currentXP || 0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievement, setAchievement] = useState(null);

  const TOTAL_STAGES = 5;
  const difficulty = ['Easy', 'Medium', 'Hard', 'Harder', 'Insane'];

  const handleAnswer = (correct) => {
    if (correct) {
      const points = stage * 10;
      const xp = stage * 25;
      const coinsEarned = stage * 5;

      setScore(score + points);
      setCurrentXP(currentXP + xp);
      setCoins(coins + coinsEarned);
      setShowConfetti(true);

      if (stage < TOTAL_STAGES) {
        setAchievement({
          type: 'milestone',
          icon: '🎯',
          title: `Stage ${stage} Complete!`,
          description: `Next: ${difficulty[stage]}`,
          autoDismissMs: 2000
        });

        setTimeout(() => {
          setStage(stage + 1);
          setShowConfetti(false);
        }, 2500);
      } else {
        setTimeout(() => {
          return (
            <RewardModal
              isOpen={true}
              score={score + points}
              reward={{
                xp: currentXP + xp,
                coins: coins + coinsEarned,
                badges: [
                  { icon: '👑', name: 'Level Master' }
                ]
              }}
              onContinue={() => onComplete({ 
                xp: currentXP + xp, 
                coins: coins + coinsEarned 
              })}
            />
          );
        }, 1000);
      }
    }
  };

  return (
    <GameLayout
      title="Progressive Levels"
      level={playerProgress.level || 1}
      score={score}
      currentXP={currentXP}
      coins={coins}
      onBack={onBack}
    >
      <ConfettiEffect trigger={showConfetti} />
      <AchievementPopup
        isOpen={achievement !== null}
        type={achievement?.type}
        icon={achievement?.icon}
        title={achievement?.title}
        description={achievement?.description}
        autoDismissMs={achievement?.autoDismissMs}
        onClose={() => setAchievement(null)}
      />

      <GameCard
        icon={['🟢', '🟡', '🟠', '🔴', '💀'][stage - 1]}
        title={`Stage ${stage}: ${difficulty[stage - 1]}`}
        description="The challenge gets harder with each stage"
        highlight={`Complete ${TOTAL_STAGES} stages to master this game`}
        powerMode={stage > 3}
      />

      <div className="flex justify-center gap-4 mt-8">
        <p className="text-amber-300 font-black">
          Progress: {stage} / {TOTAL_STAGES}
        </p>
      </div>

      <ActionButtons
        buttons={[
          { label: 'Correct', onClick: () => handleAnswer(true) },
          { label: 'Wrong', onClick: () => handleAnswer(false), variant: 'secondary' }
        ]}
      />
    </GameLayout>
  );
};

export default ProgressiveGame;
```

---

## Tips for Integration

1. **Copy one of these templates** as a starting point
2. **Replace the mock data** with your actual game logic
3. **Update texts and icons** to match your game
4. **Test on mobile** to ensure responsive layout
5. **Customize colors** if needed in `tailwind.config.js`
6. **Monitor performance** with React DevTools profiler

All templates follow best practices and use all the premium UI components!
