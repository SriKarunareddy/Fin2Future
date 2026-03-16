# Learning Platform

Full-stack web application with authentication and learning modules.

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT

## Features

### Authentication Module
- User signup with validation
- User login with JWT tokens
- Protected routes
- Admin role support

### Learning Module
- Lesson CRUD operations (admin only)
- Progress tracking
- Prerequisite-based lesson unlocking
- Category filtering and search
- Learning dashboard with statistics

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── utils/         # Utilities (API client)
│   │   ├── features/      # Feature modules
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── server/                # Node.js backend
    ├── models/            # Mongoose models
    ├── services/          # Business logic layer
    ├── controllers/       # Request handlers
    ├── routes/            # API routes
    ├── middleware/        # Custom middleware
    ├── config/            # Configuration files
    ├── server.js          # Entry point
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or connection string)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB URI and JWT secret:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your-secret-key-change-this
NODE_ENV=development
```

5. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Lessons (Protected)
- `GET /api/lessons` - Get all lessons (with optional category filter)
- `GET /api/lessons/search?q=term` - Search lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons` - Create lesson (admin only)
- `PUT /api/lessons/:id` - Update lesson (admin only)
- `DELETE /api/lessons/:id` - Delete lesson (admin only)

### Progress (Protected)
- `POST /api/progress/start` - Start a lesson
- `POST /api/progress/update` - Update progress
- `GET /api/progress/user/:userId` - Get user progress
- `GET /api/progress/stats/:userId` - Get progress statistics

## Usage

1. Sign up for a new account at `/signup`
2. Login at `/login`
3. View your learning dashboard at `/dashboard`
4. Browse lessons at `/lessons`
5. Filter by category or search for specific lessons
6. Click on a lesson to start learning
7. Track your progress as you complete lessons

## Admin Features

To create an admin user, manually update the user's role in MongoDB:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Admin users can:
- Create new lessons
- Update existing lessons
- Delete lessons

## Development Notes

- The frontend uses React Router for navigation
- Authentication tokens are stored in localStorage
- API requests automatically include JWT tokens
- Protected routes redirect to login if not authenticated
- Error handling is centralized on both frontend and backend
