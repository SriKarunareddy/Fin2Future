# Premium Game UI Components Guide

## Overview

This guide covers the new premium game UI components with dark royal blue (#1E3A8A) to (#0F172A) gradient backgrounds and gold (#FACC15, #EAB308) accents. The system provides a mobile-game-like experience with smooth animations and gamification features.

## Core Components

### 1. **GameLayout**
The main wrapper for all game screens.

```jsx
import GameLayout from './shared/GameLayout';

<GameLayout
  title="Game Title"
  level={1}
  score={0}
  currentXP={150}
  maxXP={500}
  nextLevelXP={500}
  coins={25}
  streak={3}
  onBack={() => navigateBack()}
>
  {/* Game content goes here */}
</GameLayout>
```

**Props:**
- `title` - Game title (string)
- `level` - Current player level (number)
- `score` - Current score (number)
- `currentXP` - Current experience points (number)
- `maxXP` - Max XP for current level (number, default 100)
- `nextLevelXP` - XP needed for next level (number)
- `coins` - Player coins balance (number)
- `streak` - Current win streak (number)
- `onBack` - Callback for back button

---

### 2. **GameHeader**
Displays game title, level badge, and back button.

```jsx
import GameHeader from './shared/GameHeader';

<GameHeader 
  title="Needs vs Wants"
  level={3}
  onBack={() => navigateBack()}
/>
```

**Props:**
- `title` - Game title (string)
- `level` - Current level (number)
- `onBack` - Back button callback

**Features:**
- Level-based color coding for badge
- Gold accent styling
- Hover animations

---

### 3. **XPBar**
Animated experience progress bar with gold glow.

```jsx
import XPBar from './shared/XPBar';

<XPBar 
  currentXP={150}
  maxXP={500}
  nextLevelXP={500}
  animated={true}
/>
```

**Props:**
- `currentXP` - Current XP amount (number)
- `maxXP` - Maximum XP for this level (number, default 100)
- `nextLevelXP` - XP needed for next level (number)
- `animated` - Enable shimmer animation (boolean, default true)

**Features:**
- Gold gradient progress fill
- Glow shadow effects
- Shimmer animation
- Remaining XP display

---

### 4. **RewardCounter**
Shows coins, streak, and score in premium styled badges.

```jsx
import RewardCounter from './shared/RewardCounter';

<RewardCounter 
  coins={150}
  streak={5}
  score={200}
  showScore={true}
/>
```

**Props:**
- `coins` - Player coins (number)
- `streak` - Current streak (number)
- `score` - Current score (number)
- `showScore` - Show score display (boolean, default true)

**Features:**
- Animated bobbing for coins
- Pulsing flame for streak
- Spinning star for score
- Responsive layout

---

### 5. **GameCard**
Premium game challenge/question card with glow borders.

```jsx
import GameCard from './shared/GameCard';

<GameCard
  icon="📱"
  title="What is this item?"
  description="Classify this purchase as a need or want"
  highlight="Smartphones are optional devices"
  powerMode={true}
  className="min-h-96"
>
  {/* Additional content */}
</GameCard>
```

**Props:**
- `icon` - Emoji or icon (string)
- `title` - Card title (string)
- `description` - Card description (string)
- `highlight` - Highlighted text (string)
- `powerMode` - Enable power mode styling (boolean)
- `children` - Additional content (JSX)
- `className` - Additional CSS classes (string)

**Features:**
- Dark gradient background
- Glow border effects
- Hover lift animation
- Background orbs for depth
- Power mode styling with amber glow

---

### 6. **ActionButtons**
Premium CTA buttons with gold styling.

```jsx
import ActionButtons from './shared/ActionButtons';

<ActionButtons 
  buttons={[
    {
      label: 'NEED',
      icon: '👈',
      onClick: () => handleNeed(),
      disabled: false
    },
    {
      label: 'WANT',
      icon: '👉',
      onClick: () => handleWant(),
      variant: 'secondary'
    }
  ]}
  vertical={false}
/>
```

**Button Props:**
- `label` - Button text (string)
- `icon` - Button icon (string)
- `onClick` - Click handler (function)
- `disabled` - Disabled state (boolean)
- `variant` - 'primary' | 'secondary' | 'danger' (default 'primary')

**ActionButtons Props:**
- `buttons` - Array of button objects (array)
- `vertical` - Stack buttons vertically (boolean)
- `className` - Additional classes (string)

**Features:**
- Gold gradient primary buttons
- Dark secondary buttons
- Smooth hover and active animations
- Responsive sizing

---

### 7. **RewardModal**
Game completion reward display with confetti.

```jsx
import RewardModal from './shared/RewardModal';

<RewardModal
  isOpen={gameOver}
  score={250}
  reward={{
    xp: 375,
    coins: 50,
    badges: [
      { icon: '⚡', name: 'Streak Master' },
      { icon: '👑', name: 'Perfect Score' }
    ]
  }}
  onContinue={() => goToNextGame()}
  onReplay={() => restartGame()}
/>
```

**Props:**
- `isOpen` - Show modal (boolean)
- `score` - Game score (number)
- `xp` - XP earned (number)
- `coins` - Coins earned (number)
- `badges` - Array of badge objects (array)
- `reward` - Alternative format with xp, coins, badges (object)
- `onContinue` - Continue button callback
- `onReplay` - Replay button callback

**Features:**
- Animated reward displays
- Confetti celebration
- Badge unlocking display
- Staggered animations
- Dark theme with gold accents

---

### 8. **AchievementPopup**
Notification for achievements and milestones.

```jsx
import AchievementPopup from './shared/AchievementPopup';

<AchievementPopup
  isOpen={streakReached10}
  type="milestone"
  icon="⚡"
  title="10 In a Row!"
  description="Amazing streak achieved!"
  autoDismissMs={3000}
  onClose={() => setAchievementOpen(false)}
/>
```

**Props:**
- `isOpen` - Show popup (boolean)
- `type` - 'achievement' | 'milestone' | 'power-up' | 'badge' (default 'achievement')
- `icon` - Achievement icon/emoji (string)
- `title` - Achievement title (string)
- `description` - Achievement description (string)
- `autoDismissMs` - Auto-dismiss time in ms (number, default 3000)
- `onClose` - Close callback (function)

**Features:**
- Type-based color schemes
- Auto-dismiss with fade-out
- Smooth pop-in animation
- Glow effects based on type

---

### 9. **ConfettiEffect**
Canvas-based confetti celebration animation.

```jsx
import ConfettiEffect from './shared/ConfettiEffect';

<ConfettiEffect 
  trigger={correctAnswer}
  intensity="normal"
  colors={['#FACC15', '#EAB308', '#1E3A8A', '#3B82F6']}
/>
```

**Props:**
- `trigger` - Play confetti when true (boolean)
- `intensity` - 'light' | 'normal' | 'intense' (default 'normal')
- `colors` - Array of hex colors (array)

**Features:**
- Multiple burst patterns
- Customizable intensity
- Theme-matching colors
- Renders to canvas (no DOM impact)

---

### 10. **XPIncrementAnimation**
Floating XP gain notification.

```jsx
import XPIncrementAnimation from './shared/XPIncrementAnimation';

{xpAnimations.map(anim => (
  <XPIncrementAnimation
    key={anim.id}
    amount={anim.amount}
    x={50}
    y={50}
    onComplete={() => removeAnimation(anim.id)}
  />
))}
```

**Props:**
- `amount` - XP amount to display (number)
- `x` - Horizontal position % (number, default 50)
- `y` - Vertical position % (number, default 50)
- `onComplete` - Callback when animation finishes

**Features:**
- Floating up animation
- Glow effect
- Auto-cleanup on complete

---

## Animation Classes

All animations are defined in `quiz-animations.css` and available as Tailwind classes:

### Entrance Animations
- `animate-fadeIn` - Fade in from bottom
- `animate-popIn` - Pop in with bounce
- `animate-slide-in-top` - Slide from top
- `animate-slide-in-bottom` - Slide from bottom

### Looping Animations
- `animate-gentle-float` - Gentle floating motion
- `animate-bobbing` - Bobbing up/down
- `animate-bounce-flame` - Flame bounce for streak
- `animate-spin-slow` - Slow rotation
- `animate-pulse-scale` - Pulse and scale
- `animate-goldGlow` - Gold glow effect
- `animate-glow-pulse` - Text glow pulse
- `animate-bounce-celebration` - Celebration bounce

### Special Effects
- `animate-float-up` - Float upward with fade
- `animate-shimmer` - Shimmer effect for fills
- `animate-success-check` - Checkmark pop-in
- `animate-card-lift` - Card hover lift

---

## Color Theme

All components use the premium theme:

**Background Gradient:**
- From: `#1e3a8a` (Royal Blue Dark)
- Via: `#0f172a` (Dark Slate)
- To: `#1e3a8a` (Royal Blue Dark)

**Accent Colors:**
- Gold: `#FACC15`
- Gold Light: `#EAB308`
- Gold Dark: `#CA8A04`

**Text Colors:**
- Primary: `#FCD34D` (Amber)
- Secondary: `#BAE6FD` (Light Blue)
- Muted: `#94A3B8` (Slate)

---

## Complete Game Example

```jsx
import { useState } from 'react';
import GameLayout from './shared/GameLayout';
import GameCard from './shared/GameCard';
import ActionButtons from './shared/ActionButtons';
import RewardModal from './shared/RewardModal';
import ConfettiEffect from './shared/ConfettiEffect';

const ExampleGame = ({ onComplete, onBack, playerProgress }) => {
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(playerProgress?.coins || 0);
  const [gameOver, setGameOver] = useState(false);
  const [lastAnswer, setLastAnswer] = useState(null);

  const handleAnswer = (answer) => {
    setLastAnswer(answer);
    setScore(score + 10);
    setCoins(coins + 5);
    
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
          xp: score * 1.5,
          coins: coins,
          badges: score >= 100 ? [{ icon: '👑', name: 'Pro Player' }] : []
        }}
        onContinue={() => onComplete({ xp: score * 1.5, coins })}
        onReplay={() => {
          setScore(0);
          setCoins(playerProgress?.coins || 0);
          setGameOver(false);
        }}
      />
    );
  }

  return (
    <GameLayout
      title="Example Game"
      level={1}
      score={score}
      currentXP={score * 1.5}
      maxXP={150}
      coins={coins}
      onBack={onBack}
    >
      <ConfettiEffect trigger={lastAnswer === 'correct'} intensity="normal" />

      <div className="flex justify-center mb-8">
        <GameCard
          icon="🎮"
          title="Choose the right answer"
          description="This is a game example"
        />
      </div>

      <ActionButtons
        buttons={[
          { label: 'Answer A', onClick: () => handleAnswer('correct') },
          { label: 'Answer B', onClick: () => handleAnswer('wrong'), variant: 'secondary' }
        ]}
      />
    </GameLayout>
  );
};

export default ExampleGame;
```

---

## Best Practices

1. **Always wrap games with GameLayout** - Provides consistent header, XP bar, and stats
2. **Use GameCard for content** - Maintains visual consistency and provides animations
3. **Use ActionButtons for all CTAs** - Ensures consistent styling and interactions
4. **Trigger confetti on successes** - Enhances celebration feel
5. **Use AchievementPopup for milestones** - Makes achievements feel special
6. **Keep animations subtle** - Use normal intensity by default, intense only for big wins
7. **Manage XP animations** - Add to array, remove on complete to avoid memory leaks
8. **Test on mobile** - Ensure responsive layout works on all screens

---

## Responsive Behavior

All components are fully responsive:
- **Mobile (< 768px):** Stacked layouts, larger touch targets
- **Tablet (768px - 1024px):** Flexible grid layouts
- **Desktop (> 1024px):** Optimized spacing and sizing

Use `md:` breakpoints in Tailwind for desktop-specific styling.

---

## Performance Tips

1. **Lazy load confetti** - Import only when needed
2. **Batch state updates** - Group related state changes
3. **Use keys for animations** - Proper React keys for animation lists
4. **Clear animations** - Remove completed animations from DOM
5. **Debounce interactions** - Prevent rapid button clicks

---

## Customization

### Theme Colors

Modify in `tailwind.config.js`:
```javascript
extend: {
  colors: {
    'gold': {
      300: '#FCD34D',
      400: '#FACC15',
      500: '#EAB308'
    }
  }
}
```

### Animation Speed

Modify in `quiz-animations.css`:
```css
.animate-gentle-float {
  animation: gentleFloat 3s ease-in-out infinite; /* Change 3s */
}
```

### Component Styling

All components accept `className` prop for additional Tailwind classes.
