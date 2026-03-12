# MERN JWT AUTH STARTER

Full-stack auth app: Express 5 API + React 19 frontend.

## Structure

```
backend/   # Express 5 + MongoDB + TypeScript
frontend/  # React 19 + Vite + Chakra UI
```

## Dev

```bash
# Start MongoDB + backend (Docker)
docker-compose up

# Backend only (requires MongoDB running)
cd backend && npm run dev   # port 4004

# Frontend
cd frontend && npm run dev  # port 5173
```

## Build

```bash
cd backend && npm run build   # tsc + esbuild → dist/
cd frontend && npm run build  # tsc -b && vite build
```

## Stack

**Backend:** Express 5, TypeScript, MongoDB/Mongoose, JWT, Zod, Resend (email)
**Frontend:** React 19, React Query 5, React Router 7, Chakra UI 2, Axios

## Auth Flow

- Access token (15m) + refresh token (30d) as httpOnly cookies
- Sessions stored in MongoDB
- Frontend axios interceptor auto-refreshes on 401 + `InvalidAccessToken`
- `authenticate` middleware injects `userId`/`sessionId` into req

## API Routes

**Public:** `POST /auth/register|login`, `GET /auth/logout|refresh`, `GET /auth/email/verify/:code`, `POST /auth/password/forgot|reset`
**Protected:** `GET /user`, `GET /sessions`, `DELETE /sessions/:id`

## Key Files

- `backend/src/services/auth.service.ts` — core auth logic
- `backend/src/middleware/authenticate.ts` — JWT validation
- `frontend/src/config/apiClient.ts` — axios + refresh interceptor
- `frontend/src/lib/api.ts` — API endpoint functions

## No tests yet.
