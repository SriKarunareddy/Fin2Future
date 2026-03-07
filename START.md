# 🚀 Financial Literacy Quiz - Quick Start Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Installation & Setup

### Step 1: Install Dependencies

Open **TWO** terminal windows:

**Terminal 1 - Install Client Dependencies:**
```bash
cd client
npm install
```

**Terminal 2 - Install Server Dependencies:**
```bash
cd server
npm install
```

### Step 2: Start the Application

**Terminal 1 - Start Backend Server (Port 5000):**
```bash
cd server
npm start
```

You should see:
```
🚀 Server running on http://localhost:5000
📚 Quiz API available at http://localhost:5000/api/quiz
```

**Terminal 2 - Start Frontend (Port 3000):**
```bash
cd client
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Step 3: Open in Browser

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎮 Using the Quiz

1. The quiz will automatically load 10 financial literacy questions
2. Click on any option (A, B, C, or D) to select your answer
3. The quiz will automatically advance to the next question
4. After answering all 10 questions, you'll see your results:
   - Your score (X out of 10)
   - Your level (Basic, Medium, or Advanced)
   - Motivational message
   - Option to retake the quiz

## 🎨 Features

- **Modern UI**: Game-style interface with smooth animations
- **Responsive**: Works on mobile and desktop
- **Colorful**: Gradient backgrounds and vibrant option cards
- **Accessible**: Keyboard navigation and high contrast
- **Auto-advance**: Automatically moves to next question after selection

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

**For Client (Port 3000):**
Edit `client/vite.config.js` and change the port:
```javascript
server: {
  port: 3001  // Change to any available port
}
```

**For Server (Port 5000):**
Edit `server/index.js` and change:
```javascript
const PORT = process.env.PORT || 5001;  // Change to any available port
```

### API Connection Issues

Make sure:
1. Backend server is running on port 5000
2. Frontend proxy is configured correctly in `client/vite.config.js`
3. Both servers are running simultaneously

### Dependencies Not Installing

Try:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## 📁 Project Structure

```
.
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── main.jsx       # Entry point
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── features/
│   │   └── budget-game/
│   │       ├── components/  # React components
│   │       ├── api/        # API client
│   │       └── styles/     # Custom CSS
│   └── package.json
│
├── server/                # Express.js backend
│   ├── index.js          # Server entry point
│   ├── features/
│   │   └── budget-game/
│   │       ├── controllers/  # Request handlers
│   │       ├── services/     # Business logic
│   │       ├── routes/       # API routes
│   │       └── data/         # Question data
│   └── package.json
│
└── package.json          # Root package.json
```

## 🎯 API Endpoints

- `GET /api/quiz/questions` - Get all quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/results/:userId` - Get user results
- `GET /health` - Health check

## 🎨 Customization

### Change Colors
Edit `client/tailwind.config.js` to customize the color scheme.

### Add More Questions
Edit `server/features/budget-game/data/questions.js` to add or modify questions.

### Adjust Level Thresholds
Edit `server/features/budget-game/services/level-assignment.service.js` to change scoring ranges.

## 📝 Notes

- User data is stored in-memory (resets on server restart)
- For production, replace in-memory storage with a database
- The quiz uses a demo userId: "demo-user-123"

Enjoy the quiz! 🎉
