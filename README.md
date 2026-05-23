# Jira Clone — MERN Stack

A production-ready Agile Project Management Tool built with React, Node.js, Express, and MongoDB.

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
# Edit .env — set MONGO_URI and JWT_SECRET
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
# Edit .env — set VITE_API_URL (default: http://localhost:5000/api)
npm run dev
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | ✗ | Register user |
| POST | /api/auth/login | ✗ | Login user |
| GET  | /api/auth/me | ✓ | Get current user |
| GET  | /api/projects | ✓ | List user's projects |
| POST | /api/projects | ✓ | Create project |
| GET  | /api/projects/:id | ✓ | Get project |
| PUT  | /api/projects/:id | ✓ Admin | Update project |
| DELETE | /api/projects/:id | ✓ Admin | Delete project |
| POST | /api/projects/:id/members | ✓ Admin | Add member by email |
| DELETE | /api/projects/:id/members/:userId | ✓ Admin | Remove member |
| GET  | /api/tasks?projectId=xxx | ✓ | List project tasks |
| POST | /api/tasks | ✓ | Create task |
| PUT  | /api/tasks/:id | ✓ | Update task |
| PATCH | /api/tasks/:id/status | ✓ | Update status (drag-drop) |
| DELETE | /api/tasks/:id | ✓ | Delete task |

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, @hello-pangea/dnd, Lucide React
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs
- **Database**: MongoDB
