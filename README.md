# TaskFlow — Team Task Manager

<p align="center">
  <img src="docs/screenshots/landing_page.png" alt="TaskFlow Landing Page" width="100%"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens" alt="JWT"/>
  <img src="https://img.shields.io/badge/Drag%20%26%20Drop-dnd--kit-FF6B6B?style=flat-square" alt="dnd-kit"/>
  <img src="https://img.shields.io/badge/Charts-Recharts-8884d8?style=flat-square" alt="Recharts"/>
</p>

> A full-stack collaborative task management platform with JWT auth, role-based access control, kanban boards, analytics, and a live activity feed.

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center"><strong>🔑 Login</strong></td>
    <td align="center"><strong>📊 Dashboard</strong></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/login_page.png" alt="Login Page"/></td>
    <td><img src="docs/screenshots/dashboard.png" alt="Dashboard"/></td>
  </tr>
  <tr>
    <td align="center"><strong>✅ My Tasks</strong></td>
    <td align="center"><strong>📁 Projects</strong></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/my_tasks.png" alt="My Tasks"/></td>
    <td><img src="docs/screenshots/projects.png" alt="Projects Page"/></td>
  </tr>
  <tr>
    <td align="center"><strong>🗂️ Kanban Board</strong></td>
    <td align="center"><strong>📈 Analytics</strong></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/kanban_board.png" alt="Kanban Board"/></td>
    <td><img src="docs/screenshots/analytics.png" alt="Analytics"/></td>
  </tr>
</table>

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure signup, login, logout with **JWT** (stored in memory, not localStorage)
- Axios interceptor auto-attaches tokens and handles **401 auto-logout**
- Protected routes on both client and server

### 👥 Role-Based Access Control (RBAC)
- Two roles per project: **Admin** and **Member**
- Project creator is automatically assigned as **Admin**
- **Admin only**: create/edit/delete tasks, add/remove members, delete project
- **Member**: update status of tasks assigned to them

### 📋 Project Management
- Create projects with name and description
- Join available workspace projects
- View your joined projects vs. available ones separately
- Member list with role badges per project

### 🗂️ Kanban Board
- Three-column board: **To Do → In Progress → Done**
- **Drag and drop** status changes via `dnd-kit`
- Task cards show priority badge and assignee avatar
- Filter tasks by **search text**, **priority**, **status**, and **assignee**

### ✅ My Tasks
- Personal task view across all joined projects
- See active and overdue task counts at a glance
- Each task card shows project name, description, priority, status, and due date

### 📊 Analytics & Dashboard
- Summary tiles: Total tasks, Completed, In Progress, Overdue
- **Tasks by status** distribution chart (Recharts)
- **Workload by user** bar chart showing assignment load
- Completion rate and overdue rate KPIs
- Busiest team member highlight

### 🕐 Activity Feed
- Real-time log of task creates, updates, status changes, and member events
- Per-project activity visible to all project members

### 🖥️ UI & UX
- Responsive SaaS-style design with sidebar navigation
- Light/dark mode toggle
- Toast notifications for all user actions (`react-hot-toast`)
- Lucide React icon set throughout

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | Component framework & dev server |
| React Router DOM v6 | Client-side routing & protected routes |
| Tailwind CSS 3 | Utility-first styling |
| Axios | HTTP client with JWT interceptor |
| dnd-kit | Drag and drop for kanban board |
| Recharts | Analytics charts |
| react-hot-toast | Toast notifications |
| lucide-react | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT + bcryptjs | Authentication & password hashing |
| express-validator | Request validation |
| helmet | HTTP security headers |
| morgan | Request logging |
| nodemon | Dev auto-reload |

---

## 🗂️ Project Structure

```
TT1/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/             # Axios instance & API helpers
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Auth context provider
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route-level page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── ProjectDetailPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── MyTasksPage.jsx
│   │   ├── routes/          # Protected route wrappers
│   │   ├── styles/          # Global CSS
│   │   └── utils/           # Utility functions
│   └── vite.config.js
│
├── server/                  # Node.js + Express backend
│   ├── config/              # DB connection
│   ├── controllers/         # Route handler logic
│   ├── middleware/           # Auth middleware
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── Activity.js
│   ├── routes/              # Express routers
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/               # Helper utilities
│   ├── seed.js              # Demo data seeder
│   └── server.js            # App entry point
│
├── docs/screenshots/        # README screenshots
├── package.json             # Root workspace scripts
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js ≥ 18
- A MongoDB Atlas cluster (free tier works fine)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
npm run install:all
```

### 2. Configure Environment Variables

**`server/.env`**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=http://localhost:5173
COMPANY_EMAIL_DOMAIN=taskflow.demo
```

**`client/.env`**
```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_COMPANY_EMAIL_DOMAIN=taskflow.demo
```

### 3. Run Development Servers

```bash
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001/api |
| Health check | http://localhost:5001/api/health |

---

## 🌱 Demo Data (Seed)

After configuring `server/.env`, populate the database with realistic demo users, projects, tasks, and activity:

```bash
npm run seed
```

All seeded accounts use password: **`Password123!`**

| Email | Role |
|---|---|
| `avery.admin@taskflow.demo` | Admin |
| `maya.chen@taskflow.demo` | Member |
| `noah.patel@taskflow.demo` | Member |
| `lina.brooks@taskflow.demo` | Member |
| `omar.reyes@taskflow.demo` | Member |

> The seed script is **idempotent** — re-running it safely replaces only the demo data without affecting user-created content.

---

## 🔌 API Reference

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | ❌ | Create new account |
| POST | `/login` | ❌ | Login & receive JWT |
| GET | `/me` | ✅ | Get current user |

### Projects — `/api/projects`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/` | ✅ | Any | Create project |
| GET | `/` | ✅ | Any | List all projects |
| GET | `/:id` | ✅ | Member | Get project detail |
| PUT | `/:id/add-member` | ✅ | Admin | Add member |
| DELETE | `/:id/remove-member` | ✅ | Admin | Remove member |
| DELETE | `/:id` | ✅ | Admin | Delete project |

### Tasks — `/api/tasks`
| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/` | ✅ | Admin | Create task |
| GET | `/project/:projectId` | ✅ | Member | List project tasks |
| PUT | `/:id` | ✅ | Admin/Assignee | Update task |
| DELETE | `/:id` | ✅ | Admin | Delete task |

### Dashboard — `/api/dashboard`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/stats` | ✅ | Aggregated analytics stats |

---

## 🚀 Deployment (Railway)

Create **two separate Railway services** from the same repository.

### Server Service
| Setting | Value |
|---|---|
| Root directory | `server` |
| Install command | `npm install` |
| Start command | `node server.js` |

**Environment variables:**
```
MONGO_URI=<your Atlas URI>
JWT_SECRET=<long random secret>
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=https://your-client.up.railway.app
```

### Client Service
| Setting | Value |
|---|---|
| Root directory | `client` |
| Install command | `npm install` |
| Build command | `npm run build` |
| Publish directory | `dist` |

**Environment variables:**
```
VITE_API_BASE_URL=https://your-server.up.railway.app/api
```

### Post-Deployment Checklist
- [ ] `/api/health` returns 200
- [ ] Signup & login work
- [ ] Project creation & member invite
- [ ] Task create, edit, delete
- [ ] Drag-and-drop status updates on kanban
- [ ] Dashboard charts load with real data
- [ ] Analytics page renders correctly

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start both frontend & backend in dev mode |
| `npm run install:all` | Install all dependencies (root + client + server) |
| `npm run seed` | Seed demo data into MongoDB |
| `npm run build` | Build the client for production |
| `npm start` | Start the server in production mode |

---

## 📄 License

MIT
