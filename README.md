# LearnPlay: E-Learning Platform

An interactive, gamified e-learning platform designed to make education engaging for students. It combines retro-style arcade games with dynamic educational question prompts, ensuring a fun and rewarding learning experience.

## Features

- **Retro Arcade Games:** Includes games like "Space Defender" and "Knowledge Runner" (a 3D perspective ball runner), "Math Siege", "Bubble Blaster", and "Word Tower".
- **Dynamic Question System:** Whenever a player interacts with an obstacle, they must answer a subject-specific question to survive or gain points. 
- **No Repeat Questions:** The platform tracks answered questions globally so students receive fresh content every time they play.
- **Video Lectures:** A dedicated dashboard for viewing organized video content grouped by subject and chapter.
- **Admin Dashboard:** Tools for teachers/admins to add new questions and manage student progress.

## Tech Stack

- **Frontend**: Next.js (React), Tailwind CSS, Lucide React (Icons), HTML5 Canvas (for Games)
- **Backend**: Node.js, Express, MongoDB
- **State Management**: Zustand

## Prerequisites

Before you begin, ensure you have met the following requirements:
* Node.js (v18 or newer recommended)
* npm or yarn
* MongoDB (running locally or a MongoDB URI)

## Setup & Installation

Follow these steps to get your development environment running:

### 1. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Ensure your MongoDB database is running. If you are using Docker, you can start the provided `docker-compose.yml` (if configured):
   ```bash
   docker-compose up -d
   ```
4. Seed the database with initial questions and the default admin account:
   ```bash
   npm run seed
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend typically runs on `http://localhost:5005`.*

### Default Admin Credentials
To access the `/admin` dashboard to manage students and questions, use the seeded admin account at the `/login` page:
- **Email:** `admin@e-learning.com`
- **Password:** `admin123`

### 2. Frontend Setup

1. Open a **new** terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`.

## Directory Structure

* `/frontend`: The Next.js React application containing all UI components, pages, state management, and the `canvas`-based game engines.
  * `/src/games`: Contains all the individual game logic (e.g., SpaceDefender, KnowledgeRunner).
  * `/src/components/game`: Shared game UI components like the `QuestionPopup`.
  * `/src/data`: Mock question banks for local development and testing.
* `/backend`: The Express server and REST API for authentication, user management, and question serving.

## Contributing
1. Create a feature branch.
2. Commit your changes.
3. Push to the branch.
4. Create a Pull Request.

---
*Happy Learning!*
