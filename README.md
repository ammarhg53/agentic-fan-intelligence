# Agentic Fan Intelligence Platform

AI-powered cricket analytics for real-time fan intelligence, match prediction, and cinematic live match storytelling.

## Overview

Agentic Fan Intelligence Platform turns complex cricket data into premium, judge-ready product experiences: live win probability, momentum shifts, smart player signals, AI commentary, and what-if simulation.

## Features

- Responsive Next.js App Router frontend
- Futuristic app shell with sidebar, navbar, and dashboard modules
- AI insight stream and match intelligence widgets
- Firestore-backed match detail pages at `/matches/[matchId]`
- Realtime AI commentary timeline from match subcollections
- Win probability and momentum visualization
- Zustand app state with hydration-safe persistence
- Vercel-ready frontend configuration
- Firebase Auth, Firestore, and secure Gemini server route
- Strict TypeScript configuration

## Architecture

```text
agentic-fan-intelligence/
  frontend/    Next.js, TypeScript, Tailwind CSS, Framer Motion, Zustand
  backend/     FastAPI service boundaries
  docs/        Product and deployment notes
  datasets/    Cricket datasets and sample telemetry
  architecture/ System design and planning artifacts
```

## Installation

```bash
cd agentic-fan-intelligence/frontend
npm ci
npm run dev
```

## Environment

Copy `frontend/.env.example` to `frontend/.env.local` and fill only public Firebase client values with the `NEXT_PUBLIC_` prefix. Keep `GEMINI_API_KEY` server-side only in `.env.local` and Vercel project environment variables.

Required frontend variables:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID="agentic-fan-intelligence"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-1.5-flash"
```

The browser talks to `/api/ai/insights`; the Gemini key is never shipped to client components.

## Deployment

Deploy to Vercel with Root Directory set to `frontend` for the simplest setup. The repository also includes a root deploy shim so Vercel can detect Next.js if Root Directory is left at the repository root.

Deploy Firestore rules and indexes with Firebase CLI from the repository root:

```bash
firebase deploy --only firestore:rules,firestore:indexes --project agentic-fan-intelligence
```

Seed the demo dashboard, match detail document, and realtime commentary timeline with Firebase Admin credentials:

```bash
cd frontend
npm run seed:firestore
```

Use either `GOOGLE_APPLICATION_CREDENTIALS` or a server-only `FIREBASE_SERVICE_ACCOUNT_JSON` value. Never expose Admin credentials or `GEMINI_API_KEY` to client components.

## Performance Notes

- Server-first App Router pages
- Client components only where state or animation is required
- Hydration-safe Zustand persistence
- Optimized package imports for icon and animation libraries
- CSS-first ambient effects to avoid canvas overhead on mobile

## Screenshots

Add dashboard screenshots after the local UI QA pass.

## Roadmap

- FastAPI prediction service
- Gemini-powered commentary generation
- Firebase auth and fan profile storage
- Real match ingestion pipeline
- Advanced player comparison and fantasy intelligence

## Security

- No secrets are committed
- Public environment variables are restricted to client-safe values
- Security headers are configured in Next.js
- AI calls route through `/api/ai/insights` so Gemini secrets remain server-side

## Author

Built for the Agentic Fan Intelligence hackathon team.
