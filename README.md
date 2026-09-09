# medicalbydk

A modern, production-grade clinical governance and bioequivalent medicine platform, engineered with a decoupled architecture featuring an independent React frontend and Express/Node.js multi-tenant backend.

---

## 📁 Project Structure

```
project-root/
├── frontend/                     # React 19 + Vite + TailwindCSS 4 Application
│   ├── public/                   # Static assets & icons
│   ├── src/                      # Frontend components, screens & state
│   │   ├── components/           # UI Components (CustomerHome, MedicationDetail, etc.)
│   │   ├── data/                 # Mock catalogs & assets
│   │   ├── services/             # REST API Client (api.ts)
│   │   ├── App.tsx               # Root application view
│   │   ├── main.tsx              # Entry point
│   │   ├── types.ts              # TypeScript domain types
│   │   └── index.css             # Tailwind CSS tokens & styling
│   ├── .env                      # Frontend environment variables
│   ├── .env.example              # Blueprint for frontend environment
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   └── vite.config.ts            # Vite build & proxy settings
│
├── backend/                      # Express.js Multi-Tenant REST API
│   ├── src/                      # API implementation
│   │   ├── config/               # Database, logger & environment config
│   │   ├── constants/            # Role definitions, error codes
│   │   ├── controllers/          # Request handlers (auth, medicines, health)
│   │   ├── middlewares/          # RLS tenant context, auth, rate limiting
│   │   ├── models/               # Seed data & database schemas
│   │   ├── repositories/         # Database persistence abstraction
│   │   ├── routes/               # API route definitions (/api/v1)
│   │   ├── services/             # Business logic & bioequivalent matching
│   │   ├── utils/                # Password hashing, tokens, errors
│   │   ├── validators/           # Zod schema validation
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # Server entry point
│   ├── tests/                    # Vitest automated test suite
│   ├── .env                      # Backend environment variables
│   ├── .env.example              # Blueprint for backend environment
│   └── package.json              # Backend dependencies
│
├── docs/                         # Architecture & specification documentation
├── .gitignore                    # Root gitignore rules
├── phases.md                     # Development roadmap & completed phases
└── README.md                     # Root project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **npm**: v9.0.0 or later

---

### 1. Installing Dependencies

You must install dependencies separately for both subprojects.

#### Install Backend Dependencies:
```bash
cd backend
npm install
```

#### Install Frontend Dependencies:
```bash
cd frontend
npm install
```

---

### 2. Environment Configuration

#### Backend Environment:
The backend configuration is located in `backend/.env`. A template is provided in `backend/.env.example`:
```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=super_secret_genricmed_jwt_key_994821_production_ready
JWT_EXPIRES_IN=8h
DATABASE_URL=
MONGODB_URI=mongodb+srv://dkale0254_db_user:p%40ssw0rd%279%27%21@cluster0.5ppulmj.mongodb.net/genricmed?appName=Cluster0
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
LOG_LEVEL=info
```

#### Frontend Environment:
The frontend configuration is located in `frontend/.env`. A template is provided in `frontend/.env.example`:
```ini
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

### 3. Running the Applications

#### Option A: Running Backend and Frontend in Separate Terminals (Recommended)

**Terminal 1 — Backend (Port 5000):**
```bash
cd backend
npm run dev
```
*Health Check endpoint: http://localhost:5000/api/v1/health*

**Terminal 2 — Frontend (Port 3000):**
```bash
cd frontend
npm run dev
```
*Frontend application will open at: http://localhost:3000*

---

#### Option B: Running Both Together from Project Root

You can start both services from the root folder:

On **Windows (PowerShell)**:
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm.cmd run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm.cmd run dev"
```

Or using an npm script runner from root if you prefer to run both in parallel.

---

## 🧪 Testing & Validation

### Backend Test Suite
Run the backend tests (all 37+ unit & integration tests):
```bash
cd backend
npm test
```

### Frontend Build & Lint Check
Validate TypeScript types and build production bundle:
```bash
cd frontend
npm run build
```

---

## 🔌 API Communication
The frontend is configured to communicate with the backend exclusively via REST API calls:
- API client: `frontend/src/services/api.ts`
- Vite dev server proxies `/api` to `http://localhost:5000` automatically.
- Live endpoints available:
  - `GET /api/v1/health` - System health and database status
  - `GET /api/v1/medicines` - Bioequivalent medicine search & catalog
  - `GET /api/v1/medicines/:id/sellers` - Multi-pharmacy inventory pricing
  - `POST /api/v1/auth/login` - User authentication & JWT generation
  - `POST /api/v1/auth/register` - User onboarding (Patient, Pharmacist, Trust Officer)
  - `POST /api/v1/auth/otp/send` & `verify` - SMS 4-digit MFA verification
