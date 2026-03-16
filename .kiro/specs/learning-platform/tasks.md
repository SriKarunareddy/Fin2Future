# Implementation Plan: Learning Module

## Overview

This implementation plan breaks down the Learning Module into incremental, testable steps. The approach follows a bottom-up strategy: starting with data models and core services, then building controllers and routes, followed by frontend components, and finally integration. Each major component includes property-based tests to validate correctness properties from the design document.

## Tasks

- [ ] 1. Set up project infrastructure and dependencies
  - Install and configure backend dependencies (Express, Mongoose, express-validator, cors, dotenv)
  - Install and configure frontend dependencies (React, axios, react-router-dom)
  - Install testing dependencies (Jest, fast-check, supertest, mongodb-memory-server, React Testing Library, MSW)
  - Set up database configuration module for MongoDB connection
  - Create environment variable configuration (.env files)
  - Set up Jest configuration for both backend and frontend
  - _Requirements: 11.1, 11.2, 11.4, 11.5_

- [ ] 2. Implement backend data models
  - [ ] 2.1 Create Lesson model with schema and validation
    - Define Lesson schema with title, description, category, level, duration, isLocked, prerequisiteLessonId, createdAt fields
    - Add enum validation for category (Budgeting, Saving, Credit, Investing, Debt, Housing)
    - Add enum validation for level (Beginner, Intermediate, Advanced)
    - Add validation for duration (positive number)
    - Add indexes for category, level, and createdAt
    - Add static method to validate prerequisite exists
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [ ]* 2.2 Write property tests for Lesson model
    - **Property 1: Lesson creation stores all required fields**
    - **Validates: Requirements 1.1, 1.6**
  
  - [ ]* 2.3 Write property test for category validation
    - **Property 2: Invalid categories are rejected**
    - **Validates: Requirements 1.2**
  
  - [ ]* 2.4 Write property test for level validation
    - **Property 3: Invalid levels are rejected**
    - **Validates: Requirements 1.3**
  
  - [ ]* 2.5 Write property test for duration validation
    - **Property 4: Non-positive durations are rejected**
    - **Validates: Requirements 1.4**
  
  - [ ]* 2.6 Write unit test for prerequisite validation
    - Test that creating lesson with non-existent prerequisite fails
  
  - [ ] 2.7 Create UserProgress model with schema and hooks
    - Define UserProgress schema with userId, lessonId, progress, completed, lastAccessed fields
    - Add validation for progress (0-100 range)
    - Add compound unique index on (userId, lessonId)
    - Add index on userId
    - Implement pre-save hook to set completed = true when progress = 100
    - Implement pre-save hook to update lastAccessed timestamp
    - _Requirements: 4.1, 4.2, 4.3, 4.5_
  
  - [ ]* 2.8 Write property test for progress completion
    - **Property 12: Progress of 100 marks lesson as completed**
    - **Validates: Requirements 4.3, 8.4**
  
  - [ ]* 2.9 Write property test for progress range validation
    - **Property 14: Progress values outside 0-100 range are rejected**
    - **Validates: Requirements 4.5, 8.2**

- [ ] 3. Implement lesson service layer
  - [ ] 3.1 Create lessonService with CRUD and filtering operations
    - Implement getAllLessons function (with optional category filter, return lessons and total count)
    - Implement getLessonById function (find by ID, return lesson or throw not found)
    - Implement searchLessons function (search title and description with regex, support category filter)
    - Implement filterByCategory function (filter by category)
    - Implement checkPrerequisite function (check if prerequisite is completed for a user)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 5.5_
  
  - [ ]* 3.2 Write property test for lesson retrieval
    - **Property 5: Lesson retrieval returns complete data**
    - **Validates: Requirements 2.2, 2.4**
  
  - [ ]* 3.3 Write property test for get all lessons
    - **Property 6: Get all lessons returns complete list with count**
    - **Validates: Requirements 2.1, 2.5**
  
  - [ ]* 3.4 Write property test for category filtering
    - **Property 7: Category filtering returns only matching lessons**
    - **Validates: Requirements 3.1**
  
  - [ ]* 3.5 Write property test for search
    - **Property 8: Search returns lessons containing search term**
    - **Validates: Requirements 3.2**
  
  - [ ]* 3.6 Write property test for combined filters
    - **Property 9: Multiple filters combine with AND logic**
    - **Validates: Requirements 3.3**
  
  - [ ]* 3.7 Write unit tests for edge cases
    - Test retrieving non-existent lesson returns 404
    - Test empty search results return empty list

- [ ] 4. Implement progress service layer
  - [ ] 4.1 Create progressService with progress tracking operations
    - Implement startLesson function (check if locked, create UserProgress with progress = 0)
    - Implement updateProgress function (validate range, update progress and lastAccessed, auto-complete at 100)
    - Implement getUserProgress function (get all progress records for user)
    - Implement getProgressStats function (calculate completed, inProgress, available, overallPercentage)
    - Implement isLessonCompleted function (check if progress = 100)
    - Implement getLessonStatus function (determine Start/Continue/Review/Locked based on progress and prerequisites)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 8.3_
  
  - [ ]* 4.2 Write property test for starting lessons
    - **Property 10: Starting a lesson creates progress record with initial values**
    - **Validates: Requirements 4.1**
  
  - [ ]* 4.3 Write property test for progress updates
    - **Property 11: Progress updates modify progress and timestamp**
    - **Validates: Requirements 4.2**
  
  - [ ]* 4.4 Write property test for get user progress
    - **Property 13: Get user progress returns all records**
    - **Validates: Requirements 4.4**
  
  - [ ]* 4.5 Write property test for prerequisite locking
    - **Property 15: Lessons with incomplete prerequisites are locked**
    - **Validates: Requirements 5.1, 5.5**
  
  - [ ]* 4.6 Write property test for prerequisite unlocking
    - **Property 16: Completing prerequisite unlocks dependent lessons**
    - **Validates: Requirements 5.2**
  
  - [ ]* 4.7 Write property test for locked lesson rejection
    - **Property 17: Starting locked lessons is rejected**
    - **Validates: Requirements 5.3, 9.5**
  
  - [ ]* 4.8 Write property test for unlocked lessons
    - **Property 18: Lessons without prerequisites are unlocked**
    - **Validates: Requirements 5.4**
  
  - [ ]* 4.9 Write property test for locked progress updates
    - **Property 19: Updating progress for locked lessons is rejected**
    - **Validates: Requirements 8.3**
  
  - [ ]* 4.10 Write property test for progress statistics
    - **Property 20: Progress statistics are calculated correctly**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
  
  - [ ]* 4.11 Write property tests for lesson status
    - **Property 21: Locked lessons show "Locked" status**
    - **Property 22: Lessons without progress show "Start" status**
    - **Property 23: In-progress lessons show "Continue" status**
    - **Property 24: Completed lessons show "Review" status**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
  
  - [ ]* 4.12 Write unit tests for edge cases
    - Test updating progress for non-existent lesson
    - Test starting already-started lesson (should be idempotent or return existing)

- [ ] 5. Checkpoint - Ensure service layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement lesson controllers and routes
  - [ ] 6.1 Create lessonController with request handlers
    - Implement getAllLessons controller (extract query params for category filter, call lessonService, return response)
    - Implement getLessonById controller (extract ID, call lessonService, return lesson)
    - Implement searchLessons controller (extract search term and filters, call lessonService, return results)
    - Add input validation using express-validator
    - Implement error handling
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_
  
  - [ ] 6.2 Create lessonRoutes with endpoint definitions
    - Define GET /api/lessons route (with optional ?category= query param)
    - Define GET /api/lessons/:id route
    - Define GET /api/lessons/search route (with ?q= and optional ?category= query params)
    - Wire routes to controller methods
    - _Requirements: 2.1, 2.2, 3.1, 3.2_
  
  - [ ]* 6.3 Write integration tests for lesson endpoints
    - Test GET /api/lessons returns all lessons
    - Test GET /api/lessons?category=Budgeting returns filtered lessons
    - Test GET /api/lessons/:id returns specific lesson
    - Test GET /api/lessons/search?q=credit returns matching lessons

- [ ] 7. Implement progress controllers and routes
  - [ ] 7.1 Create progressController with request handlers
    - Implement startLesson controller (extract userId and lessonId, call progressService, return progress record)
    - Implement updateProgress controller (extract userId, lessonId, progress, validate, call progressService, return updated record)
    - Implement getUserProgress controller (extract userId, call progressService, return all progress records)
    - Implement getProgressStats controller (extract userId, call progressService, return statistics)
    - Add input validation using express-validator
    - Implement error handling
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 6.1, 6.2, 6.3, 6.4_
  
  - [ ] 7.2 Create progressRoutes with endpoint definitions
    - Define POST /api/progress/start route
    - Define POST /api/progress/update route
    - Define GET /api/progress/user/:userId route
    - Define GET /api/progress/stats/:userId route
    - Wire routes to controller methods
    - _Requirements: 4.1, 4.2, 4.4, 6.1_
  
  - [ ]* 7.3 Write integration tests for progress endpoints
    - Test POST /api/progress/start creates progress record
    - Test POST /api/progress/update updates progress
    - Test GET /api/progress/user/:userId returns all user progress
    - Test GET /api/progress/stats/:userId returns correct statistics

- [ ] 8. Implement centralized error handling
  - [ ] 8.1 Create error handler middleware
    - Implement centralized error handler middleware
    - Map error types to HTTP status codes (validation: 400, forbidden: 403, not found: 404, server: 500)
    - Format error responses consistently with message, code, and details
    - Include prerequisite information in 403 errors for locked lessons
    - Log errors appropriately
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 8.2 Write property tests for error responses
    - **Property 25: Validation errors return 400 with details**
    - **Property 26: Not found errors return 404 with message**
    - **Validates: Requirements 9.1, 9.2, 9.4, 8.5**

- [ ] 9. Wire backend components together
  - [ ] 9.1 Create main server.js file
    - Initialize Express app
    - Connect to MongoDB using database config
    - Register body-parser middleware
    - Register CORS middleware
    - Register lesson routes at /api/lessons
    - Register progress routes at /api/progress
    - Register error handler middleware (must be last)
    - Start server on configured port
    - _Requirements: 10.1, 10.2, 11.1, 11.3, 11.4_
  
  - [ ]* 9.2 Write property test for JSON responses
    - **Property 27: API responses use JSON format**
    - **Validates: Requirements 10.2**

- [ ] 10. Checkpoint - Ensure backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement frontend API utility and services
  - [ ] 11.1 Create API client with axios
    - Create axios instance with base URL configuration
    - Implement response interceptor for global error handling
    - Export configured axios instance
    - _Requirements: 10.1, 10.2_
  
  - [ ] 11.2 Create lessonService for lesson API calls
    - Implement getAllLessons function (GET /api/lessons with optional category filter)
    - Implement getLessonById function (GET /api/lessons/:id)
    - Implement searchLessons function (GET /api/lessons/search with query params)
    - Handle API errors
    - _Requirements: 2.1, 2.2, 3.1, 3.2_
  
  - [ ] 11.3 Create progressService for progress API calls
    - Implement startLesson function (POST /api/progress/start)
    - Implement updateProgress function (POST /api/progress/update)
    - Implement getUserProgress function (GET /api/progress/user/:userId)
    - Implement getProgressStats function (GET /api/progress/stats/:userId)
    - Handle API errors
    - _Requirements: 4.1, 4.2, 4.4, 6.1_

- [ ] 12. Implement reusable UI components
  - [ ] 12.1 Create ProgressBar component
    - Accept progress (0-100) as prop
    - Display filled bar based on percentage
    - Show percentage text
    - Style with smooth transitions
    - _Requirements: 10.5_
  
  - [ ] 12.2 Create StatusBadge component
    - Accept status (Start, Continue, Review, Locked) as prop
    - Display status text with appropriate styling
    - Apply colors: green for Start, blue for Continue, gold for Review, gray for Locked
    - _Requirements: 10.4_
  
  - [ ] 12.3 Create CategoryFilter component
    - Accept selectedCategory and onCategoryChange props
    - Display category buttons (All, Budgeting, Saving, Credit, Investing, Debt, Housing)
    - Highlight selected category
    - Call onCategoryChange when clicked
    - _Requirements: 3.1_
  
  - [ ] 12.4 Create SearchBar component
    - Accept searchTerm and onSearchChange props
    - Display search input with icon
    - Debounce input changes (300ms)
    - Call onSearchChange with debounced value
    - _Requirements: 3.2_
  
  - [ ] 12.5 Create LessonCard component
    - Accept lesson, status, progress, onClick props
    - Display title, description (truncated), duration
    - Show level badge and category badge
    - Display progress bar if progress > 0
    - Show status badge
    - Disable click if status is "Locked"
    - Apply hover effects
    - _Requirements: 2.4, 10.4, 10.5_
  
  - [ ]* 12.6 Write unit tests for UI components
    - Test ProgressBar renders correctly with various progress values
    - Test StatusBadge displays correct colors for each status
    - Test CategoryFilter highlights selected category
    - Test SearchBar debounces input
    - Test LessonCard displays all information correctly

- [ ] 13. Implement Learning Dashboard page
  - [ ] 13.1 Create LearningDashboard page component
    - Accept userId prop (from context or route)
    - Add state for stats, loading, error
    - Fetch progress statistics on mount using progressService.getProgressStats
    - Display overall progress bar with percentage
    - Show completed, in-progress, and available counts in cards
    - Add "View All Lessons" button to navigate to lesson list
    - Display loading spinner during fetch
    - Display error messages on failure
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 10.3, 10.5_
  
  - [ ]* 13.2 Write unit tests for LearningDashboard
    - Test dashboard fetches and displays statistics
    - Test loading state
    - Test error handling

- [ ] 14. Implement Lesson List page
  - [ ] 14.1 Create LessonList page component
    - Accept userId prop (from context or route)
    - Add state for lessons, userProgress, selectedCategory, searchTerm, loading, error
    - Fetch lessons and user progress on mount
    - Implement category filtering (update selectedCategory, refetch lessons)
    - Implement search (update searchTerm, refetch lessons with search)
    - Merge lesson data with progress data to determine status for each lesson
    - Display lessons in grid layout using LessonCard components
    - Navigate to lesson player on card click
    - Display loading spinner during fetch
    - Display error messages on failure
    - Show "No lessons found" message when list is empty
    - _Requirements: 2.1, 3.1, 3.2, 3.3, 4.4, 7.1, 7.2, 7.3, 7.4, 10.3, 10.4, 10.5_
  
  - [ ]* 14.2 Write unit tests for LessonList
    - Test lesson list fetches and displays lessons
    - Test category filtering
    - Test search functionality
    - Test lesson status determination
    - Test navigation to lesson player

- [ ] 15. Implement Lesson Player page
  - [ ] 15.1 Create LessonPlayer page component
    - Accept userId and lessonId props (from route params)
    - Add state for lesson, progress, loading, error, isCompleted
    - Fetch lesson by ID on mount using lessonService.getLessonById
    - Check if lesson is already started, if not call progressService.startLesson
    - Display lesson title, description, category, level, duration
    - Display lesson content (placeholder for now - can be enhanced later)
    - Show progress bar with current progress
    - Add "Update Progress" slider or buttons to simulate progress
    - Call progressService.updateProgress when user progresses
    - Show completion message when progress reaches 100
    - Add "Back to Lessons" button
    - Display loading spinner during fetch
    - Display error messages on failure (including locked lesson errors)
    - _Requirements: 2.2, 4.1, 4.2, 4.3, 5.3, 8.3, 10.3, 10.5_
  
  - [ ]* 15.2 Write unit tests for LessonPlayer
    - Test lesson player fetches and displays lesson
    - Test starting a lesson
    - Test updating progress
    - Test completion message display
    - Test locked lesson error handling

- [ ] 16. Implement routing and wire frontend together
  - [ ] 16.1 Create App component with routing
    - Set up React Router with BrowserRouter
    - Define route for / (redirect to /dashboard)
    - Define route for /dashboard (LearningDashboard component)
    - Define route for /lessons (LessonList component)
    - Define route for /lessons/:id (LessonPlayer component)
    - Pass userId to all routes (hardcoded for now, can be from auth later)
    - Add navigation header with links
    - _Requirements: 11.2_
  
  - [ ] 16.2 Add basic styling
    - Create CSS for layout (grid, cards, buttons)
    - Style progress bars, badges, and status indicators
    - Add responsive design for mobile
    - Apply consistent color scheme
    - _Requirements: 10.4, 10.5_

- [ ] 17. Final integration and end-to-end testing
  - [ ]* 17.1 Write integration tests for complete user flows
    - Test complete flow: dashboard → lesson list → filter → lesson player → update progress → back to list
    - Test prerequisite locking: attempt to start locked lesson, complete prerequisite, verify unlock
    - Test search flow: search for lessons, click result, view lesson
    - Test progress statistics update after completing lessons

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based and unit tests that can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation follows a bottom-up approach: models → services → controllers → routes → frontend
- Property tests validate the 27 correctness properties defined in the design document
- Checkpoints ensure incremental validation at major milestones
- The userId is hardcoded in the frontend for now - authentication can be added later
- Lesson content is a placeholder - can be enhanced with rich content later
- Progress update mechanism in lesson player is simplified - can be enhanced with actual lesson interaction
