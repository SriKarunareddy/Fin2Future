# Fin2Future - Learning Platform

A full-stack financial literacy learning platform built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT

## Project Structure

```
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Dashboard, LessonList, LessonPlayer
│   │   ├── services/     # API calls (auth, lessons, progress)
│   │   ├── utils/        # Axios instance
│   │   ├── theme.js      # Colors and shared constants
│   │   └── App.jsx       # Routes and nav
│   └── package.json
│
└── server/               # Express backend
    ├── models/           # User, Lesson, UserProgress
    ├── services/         # Business logic
    ├── controllers/      # Request handlers
    ├── routes/           # API routes
    ├── middleware/       # Auth, error handler
    ├── config/           # MongoDB connection
    └── server.js
```

## Setup

### Backend
```bash
cd server
npm install
# create .env from .env.example
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login user |
| GET | /api/lessons | Get all lessons |
| GET | /api/lessons/:id | Get lesson by ID |
| GET | /api/lessons/search | Search lessons |
| POST | /api/lessons | Create lesson (admin) |
| PUT | /api/lessons/:id | Update lesson (admin) |
| DELETE | /api/lessons/:id | Delete lesson (admin) |
| POST | /api/progress/start | Start a lesson |
| POST | /api/progress/update | Update progress |
| GET | /api/progress/user/:userId | Get user progress |
| GET | /api/progress/stats/:userId | Get progress stats |
