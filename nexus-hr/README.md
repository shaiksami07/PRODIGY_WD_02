# NexusHR — Enterprise Workforce Management Platform

Full-stack MERN app: React 19 + Vite + Tailwind frontend, Express + MongoDB backend,
JWT auth with refresh tokens, RBAC, and 10 functional modules (Auth, Employees,
Departments, Designations, Leave, Attendance, Payroll Preview, Dashboard Analytics,
Notifications, Audit Logs).

See `ARCHITECTURE.md` for the layered design (Routes → Controllers → Services →
Repositories → Models) and the diagram.

## Important: run this locally

This was built in a sandbox **with no internet access**, so `npm install` could not
be run here. Every backend file has been syntax-checked (`node --check`) and every
import/require path verified to resolve to a real file — but you need to install
dependencies and do the first real boot yourself.

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI (local mongod or Atlas), and real JWT/COOKIE secrets
npm install
npm run seed     # creates roles, a default department/designation, and an admin user
npm run dev
```

Default admin login created by the seed script:
```
email: admin@nexushr.com
password: ChangeMe123!
```
**Change this password immediately after first login.**

Verify it's running:
```bash
curl http://localhost:5000/api/health
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_BASE_URL defaults to http://localhost:5000/api
npm install
npm run dev
```

Open http://localhost:5173 and log in with the seeded admin account.

## What's implemented

**Backend (backend/)**
- JWT access + refresh tokens (refresh token in httpOnly cookie), RBAC middleware,
  password hashing, rate limiting (global + stricter on auth routes), helmet, CORS,
  mongo sanitization, XSS cleaning, centralized error handler that understands
  Mongoose/JWT error types, consistent `{success, message, data, errors}` responses.
- Models: User, Role, Employee, Department, Designation, Leave, Attendance,
  Performance, Payroll, Notification, AuditLog — all with timestamps, soft-delete
  fields where relevant, and indexes.
- Full CRUD + soft delete + restore + bulk delete for Employees; department
  safety check (can't delete a department with active employees).
- Leave request + review (approve/reject) workflow with RBAC.
- Attendance check-in/check-out with computed work hours.
- Payroll preview generation (computed allowances/deductions per active employee).
- Dashboard analytics endpoints (summary cards, department distribution, gender
  distribution, hiring trend, upcoming birthdays) using MongoDB aggregation.
- Audit logging wired into every mutating action (employee/department/leave/auth).
- Seed script for roles + default admin + starter department/designation.

**Frontend (frontend/)**
- Vite + Tailwind, glassmorphism cards, gradient accents, dark mode toggle.
- Axios client with automatic access-token refresh on 401 (queues concurrent
  requests during refresh).
- Auth context (login/logout/me/role checks), protected routes.
- Sidebar + topbar layout, Dashboard (stat cards + pie/line charts via Recharts),
  Employees (search, pagination, table), Employee create/edit form
  (department/designation dropdowns, react-hook-form), Departments (list + create),
  Leave requests (list + approve/reject), Attendance (check-in/out + history),
  Payroll preview, Analytics, Notifications, Audit Logs, Settings.

## Known gaps (called out honestly — this is a large spec)

These were intentionally left as follow-ups rather than stubbed with fake code:
- File uploads (resume/ID proof/offer letter) — Multer is in `package.json` but no
  upload route is wired yet.
- Socket.io real-time notifications — package included, not yet wired to the client.
- CSV bulk import/export, command palette (Ctrl+K), employee timeline/activity feed,
  skill matrix, attendance heatmap — not built.
- No automated test suite yet (Jest/RTL/Supertest) — the service/repository
  separation is test-friendly, but tests themselves aren't written.
- No Dockerfiles/docker-compose or CI config yet.

Tell me which of these matter most and I'll build them next — happy to keep going
module by module.

## Folder structure

```
nexus-hr/
├── ARCHITECTURE.md
├── README.md
├── frontend/                # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/{layout,auth,dashboard,employee,common,ui,charts,forms}/
│   │   ├── context/AuthContext.jsx
│   │   ├── services/{apiClient,authApi,employeeApi}.js
│   │   ├── pages/ (Login, Dashboard, Employees, EmployeeForm, Departments,
│   │   │           Leaves, Attendance, Payroll, Analytics, Notifications,
│   │   │           AuditLogs, Settings, NotFound, ServerError)
│   │   └── App.jsx, main.jsx
│   ├── tailwind.config.js, vite.config.js, postcss.config.js
│   └── package.json
└── backend/                 # Express + MongoDB backend
    ├── config/ (env.js, db.js)
    ├── models/ (User, Role, Employee, Department, Designation, Leave,
    │            Attendance, Performance, Payroll, Notification, AuditLog)
    ├── validators/ (auth, employee, department, leave + handleValidation)
    ├── middleware/ (auth.js, rbac.js, notFound.js, errorHandler.js)
    ├── repositories/ (employeeRepository.js, departmentRepository.js)
    ├── services/ (authService, employeeService, departmentService, leaveService,
    │              attendanceService, notificationService, auditLogService)
    ├── controllers/ + routes/ (one pair per module)
    ├── database/seed/index.js
    ├── helpers/tokenHelper.js
    ├── utils/ (logger.js, apiResponse.js)
    ├── app.js, server.js
    └── package.json
```
