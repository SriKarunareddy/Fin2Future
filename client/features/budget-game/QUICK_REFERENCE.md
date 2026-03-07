# Quick Reference Guide

## 🎮 Premium Game UI Components

### Component Quick Import

```jsx
// Layout & Structure
import GameLayout from './shared/GameLayout';
import GameHeader from './shared/GameHeader';

// Progress & Stats
import XPBar from './shared/XPBar';
import RewardCounter from './shared/RewardCounter';

// Game Content
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';

// Feedback & Animations
import RewardModal from './shared/RewardModal';
import AchievementPopup from './shared/AchievementPopup';
import ConfettiEffect from './shared/ConfettiEffect';
import XPIncrementAnimation from './shared/XPIncrementAnimation';
```

---

## 📋 Component Props Cheat Sheet

### GameLayout
```jsx
<GameLayout
  title="Game Name"              // string
  level={1}                      // number
  score={100}                    // number
  currentXP={250}                // number
  maxXP={500}                    // number (default: 100)
  nextLevelXP={500}              // number
  coins={50}                     // number
  streak={3}                     // number
  onBack={() => navigate('/')}   // function
>
  {children}
</GameLayout>
```

### GameCard
```jsx
<GameCard
  icon="🎯"                      // emoji/string
  title="Card Title"             // string
  description="Description"      // string
  highlight="Highlighted text"   // string
  powerMode={false}              // boolean
  className="min-h-96"           // string
>
  {children}
</GameCard>
```

### ActionButtons
```jsx
<ActionButtons
  buttons={[
    {
      label: 'Button Text',      // string (required)
      icon: '👍',                // emoji/string
      onClick: () => {},         // function (required)
      disabled: false,           // boolean
      variant: 'primary'         // 'primary' | 'secondary' | 'danger'
    }
  ]}
  vertical={false}               // boolean (stack vertically)
  className=""                   // string
/>
```

### RewardModal
```jsx
<RewardModal
  isOpen={true}                  // boolean
  score={100}                    // number
  xp={250}                       // number (OR use reward prop)
  coins={50}                     // number (OR use reward prop)
  badges={[]}                    // array of { icon, name }
  reward={{                      // OR this format
    xp: 250,
    coins: 50,
    badges: [{ icon: '⚡', name: 'Badge' }]
  }}
  onContinue={() => {}}          // function (required)
  onReplay={() => {}}            // function (required)
/>
```

### AchievementPopup
```jsx
<AchievementPopup
  isOpen={true}                  // boolean
  type="milestone"               // 'achievement' | 'milestone' | 'power-up' | 'badge'
  icon="⚡"                      // emoji/string
  title="Achievement Title"      // string
  description="Description"      // string
  autoDismissMs={3000}           // number (milliseconds)
  onClose={() => {}}             // function
/>
```

### ConfettiEffect
```jsx
<ConfettiEffect
  trigger={true}                 // boolean
  intensity="normal"             // 'light' | 'normal' | 'intense'
  colors={['#FACC15']}           // array of hex colors
/>
```

---

## 🎨 Color Reference

### Theme Colors
```
Royal Blue:      #1E3A8A (dark), #0F172A (darker)
Gold:            #FACC15 (bright), #EAB308 (warm)
Gold Dark:       #CA8A04
Amber:           #FCD34D (text)
Blue Light:      #BAE6FD (text)
Slate:           #94A3B8 (muted)
```

### Tailwind Dark Classes
```
bg-slate-900, bg-slate-950     (backgrounds)
text-amber-300, text-amber-400 (text)
ring-amber-500, ring-blue-500  (borders)
shadow-amber-500/50            (glow effects)
```

---

## ⚡ Animation Classes

### Entrance
```
animate-fadeIn      animate-popIn       animate-slide-in-top
animate-slide-in-bottom
```

### Looping
```
animate-gentle-float      animate-bobbing
animate-bounce-flame      animate-spin-slow
animate-pulse-scale       animate-goldGlow
animate-glow-pulse        animate-bounce-celebration
```

### Special
```
animate-float-up          animate-shimmer
animate-success-check     animate-card-lift
```

---

## 📊 Example: Complete Game

```jsx
import { useState } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';

export default function MyGame({ onBack, playerProgress = {} }) {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(playerProgress.coins || 0);
  const [xp, setXP] = useState(playerProgress.currentXP || 0);
  const [gameOver, setGameOver] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 10);
      setXP(xp + 25);
      setCoins(coins + 5);
      setCorrect(true);
    } else {
      setCorrect(false);
    }
    setTimeout(() => {
      if (score >= 100) setGameOver(true);
    }, 1000);
  };

  if (gameOver) {
    return (
      <RewardModal
        isOpen={true}
        score={score}
        reward={{ xp, coins }}
        onContinue={() => onBack()}
        onReplay={() => location.reload()}
      />
    );
  }

  return (
    <GameLayout
      title="My Game"
      level={playerProgress.level || 1}
      score={score}
      currentXP={xp}
      coins={coins}
      onBack={onBack}
    >
      <ConfettiEffect trigger={correct} />

      <GameCard icon="🎯" title="Question" />

      <ActionButtons
        buttons={[
          { label: 'Yes', onClick: () => handleAnswer(true) },
          { 
            label: 'No', 
            onClick: () => handleAnswer(false), 
            variant: 'secondary' 
          }
        ]}
      />
    </GameLayout>
  );
}
```

---

## 🔧 Common Customizations

### Change Theme Colors
```javascript
// tailwind.config.js - extend colors
colors: {
  'brand': {
    light: '#your-color',
    DEFAULT: '#your-color'
  }
}
```

### Adjust Animation Speed
```css
/* quiz-animations.css */
.animate-gentle-float {
  animation: gentleFloat 2s ease-in-out infinite; /* was 3s */
}
```

### Create Button Variant
```jsx
const buttons = [
  {
    label: 'Action',
    onClick: handleClick,
    variant: custom ? 'danger' : 'primary'
  }
];
```

### Add Custom Class
```jsx
<GameCard className="p-10 md:p-16 lg:max-w-2xl" />
```

---

## 🚀 Performance Tips

1. **Memoize components if re-rendering often**
   ```jsx
   export default React.memo(MyGame);
   ```

2. **Track animation cleanup**
   ```jsx
   const [animations, setAnimations] = useState([]);
   // Remove on complete: setAnimations(prev => prev.filter(...))
   ```

3. **Batch state updates**
   ```jsx
   // Instead of multiple setters, batch them
   setScore(s => s + 10);
   setXP(x => x + 25);
   setCoins(c => c + 5);
   ```

4. **Use proper React keys**
   ```jsx
   {animations.map(anim => (
     <Animation key={anim.id} {...anim} />
   ))}
   ```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Animations choppy | Check GPU acceleration, reduce intensity |
| Confetti not showing | Ensure canvas-confetti installed |
| Colors wrong | Clear browser cache, check Tailwind config |
| Layout broken on mobile | Check responsive breakpoints (md:, lg:) |
| Components not found | Verify import paths |
| State not updating | Check async setState timing |

---

## 📚 Full Documentation Links

- **Component Specs:** See `PREMIUM_UI_GUIDE.md`
- **Code Examples:** See `GAME_EXAMPLES.md`
- **Implementation:** See `IMPLEMENTATION_SUMMARY.md`
- **What's New:** See `CHANGELOG.md`

---

## 🎯 50/50 Use Cases

### Scenario 1: Quiz Game
→ Use: GameLayout + GameCard + ActionButtons + RewardModal
→ Reference: GAME_EXAMPLES.md - Template 2

### Scenario 2: Matching Game
→ Use: GameLayout + multiple GameCards + AchievementPopup
→ Reference: GAME_EXAMPLES.md - Template 3

### Scenario 3: Timed Challenge
→ Use: GameLayout (with timer) + GameCard + ConfettiEffect
→ Reference: GAME_EXAMPLES.md - Template 5

### Scenario 4: Level Progression
→ Use: GameLayout + AchievementPopup on level complete
→ Reference: GAME_EXAMPLES.md - Template 6

### Scenario 5: Free-form Game
→ Use: GameLayout + Children (custom content)
→ Reference: GAME_EXAMPLES.md - Template 1

---

## ✅ Pre-Launch Checklist

- [ ] All imports from correct paths
- [ ] Props match component spec
- [ ] onBack callback defined
- [ ] Game over screen shows RewardModal
- [ ] Animations not causing lag
- [ ] Tested on mobile (< 480px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1080px+)
- [ ] All buttons clickable and working
- [ ] Confetti triggers on success

---

## 🎓 Learning Path

1. **Start:** Read this Quick Reference
2. **Learn Components:** Review PREMIUM_UI_GUIDE.md
3. **Copy Template:** Use GAME_EXAMPLES.md
4. **Customize:** Adjust props and behavior
5. **Test:** Try on real devices
6. **Deploy:** Send to production!

---

*Version: 1.0 - Quick Reference v1*
*For full docs, see the guide files in the budget-game folder*
