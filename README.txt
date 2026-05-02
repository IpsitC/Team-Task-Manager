================================================================================
  TASKFLOW — TEAM TASK MANAGER
================================================================================

  Live Demo : https://ttaskmanager.up.railway.app/
  GitHub    : https://github.com/IpsitC/Team-Task-Manager

  A full-stack collaborative team task management platform with JWT auth,
  role-based access control, kanban boards, analytics, and a live activity feed.

================================================================================
  FEATURES
================================================================================

AUTHENTICATION & AUTHORIZATION
  - Secure signup, login, logout with JWT (stored in memory, not localStorage)
  - Axios interceptor auto-attaches tokens and handles 401 auto-logout
  - Protected routes enforced on both client and server

ROLE-BASED ACCESS CONTROL (RBAC)
  - Two roles per project: Admin and Member
  - Project creator is automatically assigned as Admin
  - Admin only : create/edit/delete tasks, add/remove members, delete project
  - Member     : update status of tasks assigned to them

PROJECT MANAGEMENT
  - Create projects with name and description
  - Join available workspace projects
  - View joined projects vs. available ones separately
  - Member list with role badges per project

KANBAN BOARD
  - Three-column board: To Do -> In Progress -> Done
  - Drag and drop status changes
  - Task cards show priority badge and assignee avatar
  - Filter by search text, priority, status, and assignee

MY TASKS
  - Personal task view across all joined projects
  - Active and overdue task counts shown at a glance
  - Tasks sorted: overdue first, done last, rest by due date
  - Each card links directly into the project kanban

ANALYTICS & DASHBOARD
  - Summary tiles: Total tasks, Completed, In Progress, Overdue
  - Tasks by status distribution (progress bars + pie chart)
  - Workload by user bar chart
  - Completion rate and overdue rate KPIs
  - Busiest team member highlight
  - Active projects with live progress bars
  - Needs Attention: overdue/high-priority tasks surfaced automatically

UI & UX
  - Responsive SaaS-style design with sidebar navigation
  - Light/dark mode toggle
  - Toast notifications for all user actions
  - Lucide React icon set

================================================================================
  TECH STACK
================================================================================

  FRONTEND
  --------
  React 18 + Vite          Component framework & dev server
  React Router DOM v6      Client-side routing & protected routes
  Tailwind CSS 3           Utility-first styling
  Axios                    HTTP client with JWT interceptor
  dnd-kit                  Drag and drop for kanban board
  Recharts                 Analytics charts
  react-hot-toast          Toast notifications
  lucide-react             Icon library

  BACKEND
  -------
  Node.js + Express        REST API server
  MongoDB + Mongoose       Database & ODM
  JWT + bcryptjs           Authentication & password hashing
  express-validator        Request validation
  helmet                   HTTP security headers
  morgan                   Request logging
  nodemon                  Dev auto-reload

================================================================================
  PROJECT STRUCTURE
================================================================================

  TT1/
  |-- client/                   React + Vite frontend
  |   |-- src/
  |       |-- api/              Axios instance & API helpers
  |       |-- components/       Reusable UI components
  |       |-- context/          Auth context provider
  |       |-- hooks/            Custom React hooks
  |       |-- pages/
  |       |   |-- LandingPage.jsx
  |       |   |-- LoginPage.jsx
  |       |   |-- SignupPage.jsx
  |       |   |-- DashboardPage.jsx
  |       |   |-- ProjectsPage.jsx
  |       |   |-- ProjectDetailPage.jsx
  |       |   |-- AnalyticsPage.jsx
  |       |   |-- MyTasksPage.jsx
  |       |-- routes/           Protected route wrappers
  |       |-- styles/           Global CSS
  |       |-- utils/            Utility functions
  |
  |-- server/                   Node.js + Express backend
  |   |-- config/               DB connection
  |   |-- controllers/          Route handler logic
  |   |-- middleware/            Auth middleware
  |   |-- models/
  |   |   |-- User.js
  |   |   |-- Project.js
  |   |   |-- Task.js
  |   |   |-- Activity.js
  |   |-- routes/
  |   |   |-- authRoutes.js
  |   |   |-- projectRoutes.js
  |   |   |-- taskRoutes.js
  |   |   |-- dashboardRoutes.js
  |   |-- utils/                Helper utilities
  |   |-- seed.js               Demo data seeder
  |   |-- server.js             App entry point
  |
  |-- docs/screenshots/         README screenshots
  |-- package.json              Root workspace scripts
  |-- README.md

================================================================================
  LOCAL SETUP
================================================================================

  Prerequisites:
    - Node.js >= 18
    - MongoDB Atlas cluster (free tier works fine)

  1. CLONE & INSTALL
     ----------------
     git clone https://github.com/IpsitC/Team-Task-Manager.git
     cd Team-Task-Manager
     npm run install:all

  2. CONFIGURE ENVIRONMENT VARIABLES
     ----------------------------------
     Create server/.env:

       MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
       JWT_SECRET=replace_with_a_long_random_secret
       JWT_EXPIRES_IN=7d
       PORT=5001
       CLIENT_URL=http://localhost:5173
       COMPANY_EMAIL_DOMAIN=taskflow.demo

     Create client/.env:

       VITE_API_BASE_URL=http://localhost:5001/api
       VITE_COMPANY_EMAIL_DOMAIN=taskflow.demo

  3. RUN DEVELOPMENT SERVERS
     -------------------------
     npm run dev

     Frontend    : http://localhost:5173
     Backend API : http://localhost:5001/api
     Health check: http://localhost:5001/api/health

================================================================================
  DEMO DATA (SEED)
================================================================================

  Run after configuring server/.env:

    npm run seed

  All seeded accounts use password: Password123!

    NAME              EMAIL                          DESIGNATION                ROLE
    Rajesh Kumar      rajesh.kumar@taskflow.demo     Engineering Manager        Admin (all projects)
    Priya Nair        priya.nair@taskflow.demo       Product Manager            Member
    Arjun Mehta       arjun.mehta@taskflow.demo      Senior Backend Engineer    Member
    Neha Sharma       neha.sharma@taskflow.demo      Frontend Engineer          Member
    Vikram Singh      vikram.singh@taskflow.demo     QA Analyst                 Member
    Ananya Rao        ananya.rao@taskflow.demo       UI/UX Designer             Member

  The seed script is idempotent — re-running it safely replaces only the demo
  data without affecting user-created content.

================================================================================
  API REFERENCE
================================================================================

  AUTH  /api/auth
    POST   /register        Create new account       (no auth required)
    POST   /login           Login & receive JWT      (no auth required)
    GET    /me              Get current user         (auth required)

  PROJECTS  /api/projects
    POST   /                Create project           (any authenticated user)
    GET    /                List all projects        (any authenticated user)
    GET    /:id             Get project detail       (project member)
    PUT    /:id/add-member  Add member               (admin only)
    DELETE /:id/remove-member  Remove member         (admin only)
    DELETE /:id             Delete project           (admin only)

  TASKS  /api/tasks
    POST   /                Create task              (admin only)
    GET    /project/:id     List project tasks       (project member)
    PUT    /:id             Update task              (admin or assignee)
    DELETE /:id             Delete task              (admin only)

  DASHBOARD  /api/dashboard
    GET    /stats           Aggregated analytics     (auth required)

================================================================================
  DEPLOYMENT (RAILWAY)
================================================================================

  Two Railway services from the same GitHub repository:

  SERVER SERVICE
    Root directory   : server
    Install command  : npm install
    Start command    : node server.js
    Env variables    : MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, PORT, CLIENT_URL

  CLIENT SERVICE
    Root directory   : client
    Install command  : npm install
    Build command    : npm run build
    Publish dir      : dist
    Env variables    : VITE_API_BASE_URL

================================================================================
  SCRIPTS
================================================================================

  npm run dev           Start frontend & backend in dev mode (concurrently)
  npm run install:all   Install all dependencies (root + client + server)
  npm run seed          Seed demo data into MongoDB
  npm run build         Build the client for production
  npm start             Start the server in production mode

================================================================================
