# MERN JWT AUTH STARTER

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend

```bash
cd backend
npm run dev        # dev server with hot reload (tsx watch)
npm run build      # compile TS to dist/
npm start          # run compiled output
```

### Frontend

```bash
cd frontend
npm run dev        # Vite dev server
npm run build      # tsc + vite build
npm run lint       # ESLint
npm run preview    # preview production build
```

### Docker

```bash
docker-compose up  # MongoDB + API (port 4004)
```

No tests exist yet.

## Architecture

MERN stack with JWT auth. Backend runs on port 4004, frontend on port 5173.

### Backend (`backend/src/`)

Express 5 + TypeScript + MongoDB (Mongoose). ES modules (`"type": "module"`).

**Auth flow**: cookies-based JWT. Access token (15m) + refresh token (30d) stored as httpOnly cookies. Sessions tracked in MongoDB.

Key layers:

- `models/` — Mongoose schemas: `User`, `Session`, `VerificationCode`
- `services/auth.service.ts` — all auth business logic (register, login, refresh, email verify, password reset)
- `controllers/auth.controller.ts` — thin Express handlers wrapping services
- `middleware/authenticate.ts` — validates `accessToken` cookie, injects `userId`/`sessionId` into request
- `middleware/errorHandler.ts` — handles `AppError` and Zod validation errors
- `utils/` — JWT (`jwt.ts`), bcrypt, cookies, email templates, `appAssert.ts` (throws typed errors), `catchErrors.ts` (async wrapper)

Routes: `POST/GET /auth/*` (public), `GET /user/*` and `GET /sessions/*` (protected, require auth middleware).

Email via Resend API (`utils/sendMail.ts`). Validation via Zod.

### Frontend (`frontend/src/`)

React 19 + TypeScript + Vite. React Router 7, TanStack React Query 5, Chakra UI 2.

- `main.tsx` — providers: Router, Chakra (dark theme), React Query
- `App.tsx` — route definitions
- `config/queryClient.ts` — React Query client (retries disabled)
- `theme/` — Chakra UI customization

Frontend is minimal/early-stage; backend is more complete.

## Environment

Backend `.env` keys: `NODE_ENV`, `APP_ORIGIN`, `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `EMAIL_SENDER`, `RESEND_API_KEY`.

In Docker, MongoDB is `mongo:27017`. For local dev without Docker, use a local MongoDB URI.
