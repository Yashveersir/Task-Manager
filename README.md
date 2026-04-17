# TaskFlow — Real-Time Task Management Application

A production-ready, real-time collaborative task management system built with React, Node.js, Express, MongoDB, and Socket.io.

## 🚀 Features

- **User Authentication** — JWT-based signup/login with secure password hashing
- **Task Management** — Full CRUD operations with Kanban board
- **Drag & Drop** — Move tasks between columns (To Do → In Progress → Done)
- **Real-Time Updates** — All changes sync instantly via Socket.io
- **Task Assignment** — Assign tasks to team members
- **Dashboard** — Stats cards, charts, and recent activity feed
- **Notifications** — Toast notifications for assignments and completions
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Theme** — Premium dark UI with glassmorphism effects

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Real-Time | Socket.io |
| Auth | JWT + bcryptjs |
| Charts | Recharts |
| Icons | Lucide React |

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
cp .env.example .env  # Update MONGODB_URI
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
├── backend/
│   └── src/
│       ├── server.js          # Express + Socket.io server
│       ├── config/db.js       # MongoDB connection
│       ├── models/            # User, Task schemas
│       ├── controllers/       # Auth, Task, User logic
│       ├── routes/            # API routes
│       ├── middleware/auth.js # JWT middleware
│       └── socket/            # Real-time handlers
├── frontend/
│   └── src/
│       ├── App.jsx            # Router + providers
│       ├── pages/             # Dashboard, TaskBoard, Team
│       ├── components/        # Layout, Tasks, Dashboard, UI
│       ├── context/           # Auth + Socket contexts
│       ├── api/axios.js       # API client
│       └── utils/helpers.js   # Utilities
```

## 📡 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/tasks` | All tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PATCH | `/api/tasks/:id/status` | Update status |
| GET | `/api/tasks/stats` | Dashboard stats |
| GET | `/api/users` | All users |
