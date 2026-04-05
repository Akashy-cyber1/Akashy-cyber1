# SkyCode CRM

Production-style SaaS CRM for local businesses.

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Django, DRF, PostgreSQL, JWT (SimpleJWT)

## Setup

### 1) Environment
```bash
cp .env.example .env
```

### 2) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

## Auth API
- `POST /api/v1/auth/register/`
- `POST /api/v1/auth/login/`
- `POST /api/v1/auth/logout/`
- `GET /api/v1/auth/me/`

## Leads API (Phase 3)
- `GET, POST /api/v1/leads/`
- `GET, PATCH, DELETE /api/v1/leads/{id}/`
- `GET, POST /api/v1/leads/{id}/notes/`
- `GET, POST /api/v1/leads/sources/`
- `GET /api/v1/leads/staff/`
