# Referral Platform

A full-stack referral platform where authenticated users can post referrals, track applicants, close referrals, discover others’ referrals, and apply to them.

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- Auth: JWT (JSON Web Tokens) with `x-auth-token` header, bcrypt for password hashing

## Live Demo

- Web app: https://referral-platform.vercel.app/

## Test Credentials (for assignment review)

- Email: `hire-me@anshumat.org`
- Password: `HireMe@2025!`

## Features

- Authentication
  - User signup and login with JWT-based sessions
- Referral Management
  - Create a referral (title, company, description, status)
  - View your referrals and applicant counts
  - Update status to Open/Closed
  - Delete your referral
- Discovery & Application
  - Browse all referrals
  - Apply to others’ referrals (cannot apply to your own)
- Profile
  - Create/Update profile (headline/title, skills, education, experience)
  - Delete profile and user

## Tech Stack

- Frontend
  - React, Vite, Tailwind CSS (Tailwind v4 via `@tailwindcss/vite`)
  - axios, react-router-dom, react-icons
- Backend
  - Node.js, Express
  - MongoDB with Mongoose
  - bcryptjs, jsonwebtoken
- Tooling
  - Vite dev server & build
  - Nodemon for backend dev

## Repository Structure

```
referal_platform/
├─ backend/
│  ├─ config/
│  │  └─ db.js
│  ├─ middleware/
│  │  └─ auth.js
│  ├─ models/
│  │  ├─ Profile.js
│  │  ├─ Referral.js
│  │  └─ User.js
│  ├─ routes/
│  │  ├─ auth.js
│  │  ├─ profile.js
│  │  └─ referral.js
│  ├─ server.js
│  ├─ package.json
│  └─ .env (not committed)
└─ frontend/
   ├─ public/
   ├─ src/
   │  ├─ assets/
   │  ├─ components/
   │  ├─ pages/
   │  └─ services/
   ├─ vite.config.js
   ├─ package.json
   └─ .env
```

## Environment Variables

Create the following `.env` files.

- Backend: `backend/.env`
  - `PORT=5000`
  - `MONGO_URI=<your-mongodb-connection-string>`
  - `JWT_SECRET=<a-strong-secret>`

- Frontend: `frontend/.env`
  - `VITE_API_URL=http://localhost:5000`  # or your deployed backend URL

The frontend composes API endpoints as `${VITE_API_URL}/api/...`.

## Install & Run (Development)

Open two terminals: one for backend and one for frontend.

- Backend
  - `cd backend`
  - `npm install`
  - `npm run dev`  # starts server with nodemon
  - or `npm start`  # starts with node

- Frontend
  - `cd frontend`
  - `npm install`
  - `npm run dev`  # starts Vite dev server (e.g., http://localhost:5173)

## Production Build

- Frontend
  - `cd frontend`
  - `npm run build`
  - `npm run preview` (optional local preview)

- Backend
  - Typically run `npm start` with proper environment variables set.

## Backend Scripts and Dependencies

From `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.18.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

## Frontend Scripts and Dependencies

From `frontend/package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.1.13",
    "axios": "^1.11.0",
    "jwt-decode": "^4.0.0",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.8.2",
    "tailwindcss": "^4.1.13"
  }
}
```

## API Overview

Base URL (from `backend/server.js`): `${VITE_API_URL}/api`

- Auth (`/api/auth`)
  - `POST /signup` — Create user, returns `{ token }`
  - `POST /login` — Authenticate user, returns `{ token }`

- Profile (`/api/profile`)
  - `GET /me` — Get current user profile (requires `x-auth-token`)
  - `POST /` — Create/Update profile (requires `x-auth-token`)
  - `DELETE /` — Delete profile and user (requires `x-auth-token`)

- Referrals (`/api/referrals`)
  - `POST /` — Create referral (requires `x-auth-token`)
  - `GET /` — Get current user’s referrals (requires `x-auth-token`)
  - `PUT /:id` — Update referral (requires `x-auth-token` and ownership)
  - `DELETE /:id` — Delete referral (requires `x-auth-token` and ownership)
  - `GET /all` — Get all referrals (requires `x-auth-token`)
  - `POST /apply/:id` — Apply to referral (requires `x-auth-token`, cannot be owner)
  - `PUT /status/:id` — Update status to `Open` or `Closed` (requires `x-auth-token` and ownership)
  - `GET /:id` — Get referral by id with poster/applicant names (requires `x-auth-token`)

### Auth Header

The frontend sends tokens via a custom header defined in `frontend/src/services/*Service.js`:

```
'x-auth-token': <JWT>
```

## Data Models (Summary)

- `User` (`backend/models/User.js`)
  - `name`, `email` (unique), `password` (hashed), timestamps

- `Referral` (`backend/models/Referral.js`)
  - `user` (ref User), `title`, `company`, `description`, `status` (Open|Closed, default Open)
  - `applications[]` of `{ user, date }`
  - `date` (created)

- `Profile` (`backend/models/Profile.js`)
  - `user` (ref User), `professionalTitle`, `bio`, `skills[]`, `social{}`, `experience[]`, `education[]`, `date`

Check the model files for exact field validation and shapes.

## Tailwind CSS

Tailwind v4 is integrated via the Vite plugin `@tailwindcss/vite`. Ensure your global CSS imports Tailwind directives and that the Vite config includes the Tailwind plugin.

## Deployment

- Backend
  - Configure environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`).
  - Deploy to your provider of choice (Render, Railway, etc.).
- Frontend
  - Set `VITE_API_URL` to the deployed backend base (e.g., `https://your-api.example.com`).
  - Build and deploy the `frontend` app (Vercel, Netlify, etc.).

## Notes

- The backend currently expects auth tokens in `x-auth-token` (see `backend/middleware/auth.js`).
- The test route `GET /` on the backend returns a simple greeting.

## License

MIT

---

If you encounter issues or want to add features (filters, notifications, RBAC, analytics), feel free to open an issue or PR.
