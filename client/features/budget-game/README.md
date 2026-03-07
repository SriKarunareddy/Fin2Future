# Financial Literacy Quiz - UI Components

A modern, game-style quiz interface built with React and Tailwind CSS.

## 🎨 Design Philosophy

The quiz UI follows a **game-first, exam-never** approach:
- Colorful and vivid, yet balanced and professional
- Suitable for teens and adults
- Smooth animations and micro-interactions
- Clean, minimal, and friendly interface
- Accessible and responsive design

## 📦 Components

### Quiz.jsx
Main orchestrator component that manages quiz state and flow.

**Features:**
- Fetches questions from API
- Manages user responses
- Handles quiz submission
- Transitions between questions
- Error and loading states

### QuestionDisplay.jsx
Displays individual questions with four multiple-choice options.

**Features:**
- Large, readable question text
- Four colorful option cards (A, B, C, D)
- Smooth hover and selection animations
- Visual feedback on selection
- Disabled state during transitions

**Color Scheme:**
- Option A: Blue gradient
- Option B: Teal gradient
- Option C: Violet gradient
- Option D: Coral/Pink gradient

### ProgressIndicator.jsx
Shows quiz progress with visual indicators.

**Features:**
- Current question number display
- Animated progress bar
- Percentage completion
- Milestone dots for each question
- Brain icon for gamification

### ResultScreen.jsx
Celebration-style results display.

**Features:**
- Score display (X out of 10)
- Level assignment (Basic/Medium/Advanced)
- Circular progress ring
- Level-specific colors and icons
- Motivational messages
- Breakdown statistics
- Retake quiz option

**Level Configurations:**
- **Basic (0-3)**: Orange/Red theme, 🌱 icon, "Getting Started"
- **Medium (4-7)**: Blue/Purple theme, ⚡ icon, "Well Done"
- **Advanced (8-10)**: Green/Emerald theme, 🏆 icon, "Excellent"

## 🎭 Animations

All animations are smooth and subtle:
- `fadeIn`: Gentle fade and slide up
- `scaleIn`: Scale from 80% to 100%
- `slideDown`: Slide from top
- `bounce-slow`: Gentle bounce for celebration
- `shimmer`: Progress bar shimmer effect
- `pulse-glow`: Subtle glow animation

## 🎨 Color Palette

**Gradients:**
- Background: Blue-50 → Purple-50 → Pink-50
- Progress: Purple-400 → Pink-400 → Blue-400
- Options: Unique gradient per option

**Accessibility:**
- High contrast text
- Clear focus states
- Large tap targets (min 44x44px)
- Keyboard navigation support

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Usage

```jsx
import Quiz from './features/budget-game/components/Quiz';

function App() {
  return <Quiz userId="user-123" />;
}
```

## 🔧 API Integration

The quiz connects to three endpoints:
- `GET /api/quiz/questions` - Fetch questions
- `POST /api/quiz/submit` - Submit responses
- `GET /api/quiz/results/:userId` - Get previous results

## ♿ Accessibility

- ARIA labels on interactive elements
- Keyboard navigation (Tab, Enter, Space)
- Screen reader friendly
- High contrast mode compatible
- Focus indicators on all interactive elements

## 🎯 User Experience Flow

1. **Loading**: Animated spinner with friendly message
2. **Quiz**: One question at a time with progress indicator
3. **Selection**: Click option → Visual feedback → Auto-advance
4. **Transition**: Smooth fade between questions
5. **Results**: Celebration screen with score and level
6. **Retake**: Option to restart quiz

## 🎨 Customization

To customize colors, edit `tailwind.config.js`:
```javascript
colors: {
  coral: {
    400: '#FF7F7F',
    500: '#FF6B6B'
  }
}
```

To adjust animations, edit `quiz-animations.css`.

## 📝 Notes

- All animations respect `prefers-reduced-motion`
- Images and icons are optimized for performance
- Components are fully typed with PropTypes (optional)
- Error boundaries handle component failures gracefully
