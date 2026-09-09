# Deployment & Operations: GenricMed

## 1. Environment Variables (`.env.example`)

```bash
# Server Port & Mode
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=super_secret_production_ready_jwt_key_994821
JWT_EXPIRES_IN=8h

# Database Configuration
# When DATABASE_URL is set, the server connects to PostgreSQL with RLS enabled.
# When omitted, the server falls back to an embedded SQLite/in-memory tenant store.
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/genricmed

# CORS Allowed Origins
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
```

---

## 2. Launch Commands

### Local Development
```powershell
# From project root:
cd backend
npm.cmd install
npm.cmd run dev
```

### Production Build & Run
```powershell
cd backend
npm.cmd ci --only=production
npm.cmd start
```

---

## 3. Health & Monitoring Endpoints
- `GET /api/v1/health`: Returns server status, memory metrics, database driver in use (`postgresql` or `sqlite_memory`), and uptime.
- `GET /api/v1/health/ready`: Confirms database connectivity and RLS tenant engine readiness.
