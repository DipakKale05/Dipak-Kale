# Architecture Specification: GenricMed

## High-Level System Architecture

```text
+-----------------------------------------------------------------------------------+
|                                 CLIENT TOUCHPOINTS                                |
|  - Patient Mobile / Web App    - Pharmacy Partner Portal    - TrustOps Enterprise |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTPS / REST / JSON
                                         v
+-----------------------------------------------------------------------------------+
|                                 API GATEWAY / APP                                 |
|  - Express 4 Middleware Pipeline (CORS, Helmet, RateLimiter, Request Logger)       |
|  - Auth & RBAC Middleware (JWT Bearer Token, Role Verification)                   |
|  - Multi-Tenant RLS Context Middleware (SET LOCAL app.current_tenant)              |
|  - Input Validation Middleware (Zod)                                              |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                CONTROLLER LAYER                                   |
|  - AuthController        - MedicineController       - OrderController             |
|  - PrescriptionController - PharmacyController      - TrustOpsController          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                  SERVICE LAYER                                    |
|  - AuthService           - MedicineService          - OrderService                |
|  - ClinicalSafetyService - PharmacyService          - TelemetryService            |
|  - MerkleAuditService (Cryptographic SHA-256 Chaining & Digital Signatures)       |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                REPOSITORY LAYER                                   |
|  - UserRepository        - PharmacyRepository       - MedicineRepository          |
|  - OrderRepository       - InventoryRepository      - AuditRepository             |
+-----------------------------------------------------------------------------------+
                                         |
                    +--------------------+--------------------+
                    |                                         |
                    v                                         v
+---------------------------------------+ +---------------------------------------+
|        PRODUCTION PERSISTENCE         | |       LOCAL DEV & TEST ADAPTER        |
|  PostgreSQL with Row-Level Security   | |  SQLite / In-Memory Tenant Isolation  |
|  (tenant_central_04, tenant_east_04)  | |  (Zero setup, schema identical, RLS)  |
+---------------------------------------+ +---------------------------------------+
```

## Layer Responsibilities

### 1. Routes (`src/routes/`)
Maps HTTP methods and path patterns to middlewares and controller handler methods. Contains no business or database logic.

### 2. Middlewares (`src/middlewares/`)
- `auth`: Decodes JWT tokens and extracts user ID, role, and tenant ID into `req.user`.
- `rbac`: Enforces role-based permissions (`PATIENT`, `PHARMACIST`, `TRUST_OFFICER`).
- `tenant`: Sets tenant context (`tenant_central_04`, `tenant_east_04`, `public_core`).
- `validate`: Runs Zod schema validation against `req.body`, `req.query`, or `req.params`.
- `rateLimiter`: Protects against brute-force and DDoS attempts.
- `errorHandler`: Centrally formats all thrown application exceptions.

### 3. Controllers (`src/controllers/`)
Extracts HTTP parameters, delegates execution to service layer, and maps service outputs to HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `422`, `500`).

### 4. Services (`src/services/`)
Encapsulates domain logic and business rules:
- Bioequivalent savings and price comparison algorithms.
- Geofenced pharmacy order routing.
- Gatekeeper PIN generation, hashing, and attempt threshold checks.
- 5-point pharmacy regulatory verification.
- Near-expiry quarantine and liquidation triage.
- SHA-256 Merkle hash calculation and immutable audit block sealing.

### 5. Repositories (`src/repositories/`)
Performs database persistence and query execution with tenant filtering.

### 6. Telemetry Bus (`src/integrations/telemetryBus.js`)
Emulates real-time event distribution (Kafka topic streams) for GPS pings, BLE temperature telemetry, and seal tamper alerts.
