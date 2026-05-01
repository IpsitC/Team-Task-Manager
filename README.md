# Team Task Manager

A full-stack collaborative task manager built for the hiring assignment brief. It includes JWT authentication, project membership, admin/member RBAC, kanban task management, filtering, dashboard analytics, and an activity feed.

## Tech Stack

- React + Vite + Tailwind CSS
- React Router DOM v6
- Axios with JWT interceptor and automatic 401 logout
- Recharts analytics
- dnd-kit drag and drop
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcrypt
- express-validator

## Features

- Signup, login, logout, and protected routes
- Create projects with the creator automatically added as admin
- Admin-only member add/remove and project delete
- Admin-only task create/edit/delete and assignment
- Member status updates for tasks assigned to them
- Kanban board with drag and drop status changes
- Task filters by search, priority, status, and assignee
- Dashboard totals, status pie chart, tasks-per-user bar chart, recent tasks, and activity feed
- Responsive SaaS-style UI

## Local Setup

Install all dependencies:

```bash
npm run install:all
```

Create `server/.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team_task_manager
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
PORT=5001
CLIENT_URL=http://localhost:5173
COMPANY_EMAIL_DOMAIN=taskflow.demo
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_COMPANY_EMAIL_DOMAIN=taskflow.demo
```

Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5001/api/health`

## Demo Data

After setting `server/.env`, seed demo users, projects, members, tasks, and activity:

```bash
npm run seed
```

Seeded login accounts all use password `Password123!`.

- `avery.admin@taskflow.demo`
- `maya.chen@taskflow.demo`
- `noah.patel@taskflow.demo`
- `lina.brooks@taskflow.demo`
- `omar.reyes@taskflow.demo`

The seed is repeatable. It replaces only the demo users/projects created by this script.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id/add-member`
- `DELETE /api/projects/:id/remove-member`
- `DELETE /api/projects/:id`

### Tasks

- `POST /api/tasks`
- `GET /api/tasks/project/:projectId`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Dashboard

- `GET /api/dashboard/stats`

## Railway Deployment

Create two Railway services from the same repository.

### Server Service

- Root directory: `server`
- Install command: `npm install`
- Start command: `node server.js`
- Variables:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN=7d`
  - `PORT=5000`
  - `CLIENT_URL=https://your-client-service.up.railway.app`

### Client Service

- Root directory: `client`
- Install command: `npm install`
- Build command: `npm run build`
- Publish directory: `dist`
- Variables:
  - `VITE_API_BASE_URL=https://your-server-service.up.railway.app/api`

After deployment, verify `/api/health`, signup, project creation, member invitation, task creation, drag/drop status updates, and dashboard charts on the live URL.
