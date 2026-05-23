# 🧩 Jira Clone — Agile Project Management Tool

A full-stack **Atlassian Jira-inspired** project management application built from scratch using the **MERN Stack**. This project was developed as a Technical Assessment for a MERN Stack Developer Intern role.

It supports real-time Kanban board management, JWT-based authentication, team collaboration, and drag-and-drop task management — all in a clean, modern dark UI.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend | [https://jira-clone-frontend-5bg1.onrender.com](https://jira-clone-frontend-5bg1.onrender.com) |
| ⚙️ Backend API | [https://jira-clone-mern.onrender.com/api/health](https://jira-clone-mern.onrender.com/api/health) |

> ⚠️ **Note:** Hosted on Render free tier — first load may take 30-50 seconds to spin up.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure Signup & Login with token-based auth
- 🏢 **Project Workspaces** — Create projects, invite team members via email
- 👑 **Admin Controls** — Project creator becomes admin, can add/remove members
- 📋 **Kanban Board** — Visual task management with 3 columns: To Do, In Progress, Done
- 🖱️ **Drag & Drop** — Seamlessly move tasks between columns (updates DB instantly)
- 🎯 **Task Management** — Create tasks with Title, Description, Priority, Due Date, Assignee
- 🎨 **Modern Dark UI** — Clean, minimal interface built with Tailwind CSS
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Library |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side Routing |
| Axios | HTTP Requests |
| @hello-pangea/dnd | Drag and Drop |
| Lucide React | Icons |
| Context API | Global State Management |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | NoSQL Database |
| Mongoose | ODM for MongoDB |
| JSON Web Token | Authentication |
| bcryptjs | Password Hashing |
| dotenv | Environment Variables |
| cors | Cross-Origin Requests |
| nodemon | Development Auto-restart |

---

## 📁 Project Structure

```
jira-clone/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Register, Login logic
│   │   ├── projectController.js  # Project CRUD + Members
│   │   └── taskController.js     # Task CRUD + Status update
│   ├── middlewares/
│   │   └── authMiddleware.js     # JWT token verification
│   ├── models/
│   │   ├── User.js               # User Schema
│   │   ├── Project.js            # Project Schema
│   │   └── Task.js               # Task Schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── axiosInstance.js       # Axios base config + JWT interceptor
        ├── components/
        │   ├── auth/
        │   │   └── ProtectedRoute.jsx
        │   ├── board/
        │   │   ├── KanbanBoard.jsx
        │   │   ├── KanbanColumn.jsx
        │   │   └── TaskCard.jsx
        │   ├── modals/
        │   │   ├── CreateProjectModal.jsx
        │   │   └── CreateTaskModal.jsx
        │   └── layout/
        │       ├── Navbar.jsx
        │       └── Sidebar.jsx
        ├── context/
        │   └── AuthContext.jsx        # Global auth state
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── DashboardPage.jsx
        │   └── ProjectDetailsPage.jsx
        ├── services/
        │   ├── authService.js
        │   ├── projectService.js
        │   └── taskService.js
        └── utils/
            └── helpers.js
```

---

## 🗄️ Database Schemas

### User
```js
{
  name:       String,
  email:      String (unique),
  password:   String (bcrypt hashed),
  role:       String (admin | member),
  timestamps: true
}
```

### Project
```js
{
  title:       String,
  description: String,
  createdBy:   ObjectId → User,
  members:     [ObjectId → User],
  timestamps:  true
}
```

### Task
```js
{
  title:       String,
  description: String,
  status:      Enum → ["To Do", "In Progress", "Done"],
  priority:    Enum → ["High", "Medium", "Low"],
  projectId:   ObjectId → Project,
  assignedTo:  ObjectId → User,
  dueDate:     Date,
  timestamps:  true
}
```

---

## 🔌 API Reference

### Auth Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Register new user |
| POST | `/api/auth/login` | ✗ | Login user, returns JWT |
| GET | `/api/auth/me` | ✓ | Get logged-in user profile |

### Project Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | ✓ | Get all projects of user |
| POST | `/api/projects` | ✓ | Create new project |
| GET | `/api/projects/:id` | ✓ | Get single project |
| PUT | `/api/projects/:id` | ✓ Admin | Update project details |
| DELETE | `/api/projects/:id` | ✓ Admin | Delete project |
| POST | `/api/projects/:id/members` | ✓ Admin | Add member by email |
| DELETE | `/api/projects/:id/members/:userId` | ✓ Admin | Remove member |

### Task Routes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tasks?projectId=xxx` | ✓ | Get all tasks of a project |
| POST | `/api/tasks` | ✓ | Create new task |
| GET | `/api/tasks/:id` | ✓ | Get single task |
| PUT | `/api/tasks/:id` | ✓ | Update task details |
| PATCH | `/api/tasks/:id/status` | ✓ | Update task status (drag-drop) |
| DELETE | `/api/tasks/:id` | ✓ | Delete task |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/HarshKasaudhan29/Jira-Clone-MERN.git
cd Jira-Clone-MERN
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/jiraclone
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

### 4. Open in Browser
```
http://localhost:5173
```

---

## 🚀 Deployment

| Service | Platform |
|---|---|
| Frontend | Render (Static Site) |
| Backend | Render (Web Service) |
| Database | MongoDB Atlas |

---

## 👨‍💻 Developer

**Harsh Kasaudhan**
- GitHub: [@HarshKasaudhan29](https://github.com/HarshKasaudhan29)
- Email: harshkasaudhan105@gmail.com