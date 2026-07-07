# NexusHR — High-Level Architecture

```
                                   ┌────────────────────────────┐
                                   │        Client (SPA)        │
                                   │  React 19 + Vite + TS(UI)  │
                                   │  Tailwind, TanStack Query  │
                                   └──────────────┬─────────────┘
                                                  │ HTTPS (JSON, cookies)
                                                  ▼
                          ┌───────────────────────────────────────────┐
                          │              Express API Layer             │
                          │  helmet · cors · rate-limit · compression  │
                          │  morgan (logs) · cookie-parser · sanitize  │
                          └───────────────────┬─────────────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              ▼                               ▼                               ▼
     ┌─────────────────┐           ┌───────────────────┐           ┌───────────────────┐
     │  Auth Middleware │           │   Route Layer       │           │  Error Middleware   │
     │  JWT verify, RBAC│           │  /api/auth           │           │  centralized, typed │
     └────────┬────────┘           │  /api/employees       │           │  responses           │
              │                    │  /api/departments      │           └───────────────────┘
              ▼                    │  /api/leaves ...        │
     ┌─────────────────┐           └──────────┬─────────────┘
     │   Controllers    │◄─────────────────────┘
     │  request/response │
     │  orchestration     │
     └────────┬─────────┘
              ▼
     ┌─────────────────┐
     │    Services       │   business logic, validation rules,
     │                    │   permission checks, aggregation
     └────────┬─────────┘
              ▼
     ┌─────────────────┐
     │  Repositories      │   data-access layer, isolates
     │                    │   Mongoose queries from business logic
     └────────┬─────────┘
              ▼
     ┌─────────────────┐
     │     Models         │   Mongoose schemas: User, Employee,
     │  (MongoDB/Mongoose) │  Department, Leave, Attendance,
     │                    │   Notification, Role, AuditLog...
     └────────┬─────────┘
              ▼
     ┌─────────────────┐
     │     MongoDB         │
     └─────────────────┘

     Cross-cutting concerns (used across every layer):
     • JWT access + refresh token auth        • Centralized logger (utils/logger.js)
     • Role-Based Access Control (RBAC)        • Audit logging service
     • express-validator input validation      • Socket.io (real-time notifications, wired in later phase)
```

## Layered design rationale

- **Routes** only wire HTTP verbs/paths to controllers — no logic.
- **Controllers** parse req/res, call services, and format the standard API response.
- **Services** hold business rules (e.g. "an employee cannot be deleted if they manage other active employees").
- **Repositories** are the only layer that talks to Mongoose/MongoDB — this makes services testable and swappable.
- **Models** define schema, indexes, and soft-delete/timestamp behavior.

This mirrors the Repository Pattern + Service Layer requested in the spec, and keeps each file small, testable, and replaceable.

## Standard API response contract

Every endpoint returns:
```json
{ "success": true, "message": "string", "data": {}, "errors": null }
```

## Phase roadmap (per your spec's Output Rules)

1. ✅ Architecture Diagram + Folder Structure + Backend Initialization
2. Database Configuration + Models + Validators
3. Middleware + Authentication + Authorization
4. API Routes + Controllers + Services (core modules: Employee, Department)
5. Remaining modules: Leave, Attendance, Performance, Payroll Preview, Notifications, Audit Logs
6. Frontend Setup (Vite + Tailwind + routing + auth context)
7. Layout Components (sidebar, navbar, command palette)
8. Dashboard (cards, charts, activity feed)
9. Employee Module UI (list, profile, forms, bulk import/export)
10. Remaining feature UIs + Settings
11. Testing scaffolding
12. Deployment guide
