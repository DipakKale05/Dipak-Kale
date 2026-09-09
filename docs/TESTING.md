# Testing Strategy: GenricMed

## 1. Overview
The testing suite validates clinical safety, multi-tenant isolation, cryptographic integrity, and REST API contracts.

---

## 2. Test Pyramid & Scope

### Unit Tests
- `merkle.test.js`: Validates SHA-256 block hashing, parent calculation, and tampering detection.
- `safety.test.js`: Validates APAP 4,000mg ceiling calculations and drug interaction alerts.
- `pin.test.js`: Validates 4-digit PIN attempt counting and lockout logic.
- `savings.test.js`: Validates bioequivalent discount percentage and unit price math.

### Integration / API Tests
- `auth.test.js`: User registration, email login, phone OTP verification, invalid credentials, rate limiting.
- `medicines.test.js`: Catalog search, detail retrieval, multi-seller stock & pricing aggregation.
- `orders.test.js`: Order placement, geofenced routing, PIN generation, and doorstep PIN verification (success & fail paths).
- `pharmacy.test.js`: Multi-tenant RLS isolation (tenant A cannot see tenant B orders), 5-point checklist submission, courier dispatch.
- `trustops.test.js`: Telemetry stream retrieval, bypass OTP issuance, Merkle audit log querying, and root cryptographic proof.

---

## 3. Running Tests

```powershell
# Run full automated test suite
cd backend
npm.cmd test

# Run tests in watch mode
npm.cmd run test:watch

# Generate code coverage report
npm.cmd run test:coverage
```
