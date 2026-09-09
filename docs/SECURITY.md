# Security Specification: GenricMed

## 1. Compliance Standard
GenricMed adheres to **HIPAA Security Rule §164.312** (Technical Safeguards) and **SOC2 Type II Trust Principles** (Security, Confidentiality, and Availability).

---

## 2. Authentication & Credential Handling
- **Password Hashing**: Salted hashing with `bcryptjs` (salt rounds: 10). Plain-text passwords are never logged, stored, or returned in API responses.
- **JWT Management**:
  - Signed with HMAC-SHA256 using `JWT_SECRET`.
  - Expiration set to 8 hours for clinical/pharmacist sessions and 30 days for mobile patient sessions.
  - Revocation: Expired and invalid tokens immediately return `401 Unauthorized`.
- **FIDO2 / WebAuthn**: Supported for Pharmacists and Trust Officers to enforce hardware-backed biometric authentication.

---

## 3. Authorization & Multi-Tenancy
- **Role-Based Access Control (RBAC)**:
  - `PATIENT`: Can only view their own prescriptions, orders, and public catalog.
  - `PHARMACIST`: Can only access orders and inventory assigned to their licensed `tenant_id`.
  - `TRUST_OFFICER`: Authorized to monitor cross-tenant logistics telemetry and Merkle audit trails.
- **Tenant Context Verification**:
  - `tenantId` is extracted from the authenticated JWT, never trusted from client input payloads.

---

## 4. Cryptographic Ledger & Merkle Chaining
- Audit records compute a SHA-256 hash over `(eventId, timestamp, actorId, action, target, payloadJson, previousHash)`.
- Verification of the Merkle tree ensures block history cannot be altered after the fact.
- ECDSA signatures simulate cryptographic non-repudiation for high-privilege operations.

---

## 5. Network & Request Protection
- **Security Headers**: Managed with `helmet` (X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options).
- **CORS**: Strict allow-list of origins (e.g. `http://localhost:3000`, `http://localhost:5173`).
- **Rate Limiting**:
  - `/api/v1/auth/*`: Max 10 attempts per 15-minute window to stop credential stuffing.
  - `/api/v1/*`: Max 100 requests per minute per IP.

---

## 6. Sensitive Data Sanitization
- Passwords, JWT secrets, database connection credentials, and patient SSNs/unmasked payment details are prohibited in application logs.
- Centralized logger automatically masks sensitive keys before writing output.
