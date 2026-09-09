# API Contract: GenricMed

Base URL: `/api/v1`

---

## 1. Authentication & Identity (`/api/v1/auth`)

### POST `/api/v1/auth/register`
- **Auth**: Public
- **Request**:
```json
{
  "name": "Sarah Connor",
  "email": "sarah.connor@example.com",
  "password": "SecurePassword!123",
  "phone": "+1 (555) 018-9921",
  "role": "PATIENT", // "PATIENT" | "PHARMACIST" | "TRUST_OFFICER"
  "dob": "1988-04-12",
  "deliveryAddress": "742 Evergreen Terr, Springfield",
  "pharmacyName": "WellSpring Meds", // Required if role === "PHARMACIST"
  "licenseNumber": "RPH-99281-IL", // Required if role === "PHARMACIST"
  "hipaaConsented": true
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "USR-PAT-7741",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com",
      "role": "PATIENT",
      "tenantId": "tenant_central_04"
    }
  }
}
```

### POST `/api/v1/auth/login`
- **Auth**: Public
- **Request**:
```json
{
  "email": "sarah.connor@example.com",
  "password": "SecurePassword!123"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "id": "USR-PAT-7741",
      "name": "Sarah Connor",
      "email": "sarah.connor@example.com",
      "role": "PATIENT",
      "tenantId": "tenant_central_04"
    }
  }
}
```

### POST `/api/v1/auth/otp/send`
- **Auth**: Public
- **Request**: `{ "phone": "+1 (555) 018-9921" }`
- **Response** (`200 OK`): `{ "success": true, "message": "Verification token transmitted via SMS." }`

### POST `/api/v1/auth/otp/verify`
- **Auth**: Public
- **Request**: `{ "phone": "+1 (555) 018-9921", "code": "4892" }`
- **Response** (`200 OK`): `{ "success": true, "data": { "token": "...", "user": { ... } } }`

### POST `/api/v1/auth/passkey/verify`
- **Auth**: Public
- **Request**: `{ "role": "TRUST_OFFICER", "tenantSchema": "tenant_central_04" }`
- **Response** (`200 OK`): `{ "success": true, "data": { "token": "...", "user": { ... } } }`

### GET `/api/v1/auth/me`
- **Auth**: Bearer Token
- **Response** (`200 OK`): `{ "success": true, "data": { "user": { ... } } }`

---

## 2. Catalog & Bioequivalent Discovery (`/api/v1/medicines`)

### GET `/api/v1/medicines`
- **Auth**: Public
- **Query Params**: `q` (search string), `category` (therapy category)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "MED-01",
      "genericName": "Cetirizine HCl",
      "brandNameEquivalent": "Zyrtec®",
      "dosageForm": "Film-Coated Tablet",
      "strength": "10mg",
      "category": "Allergy & Cold",
      "genericPrice": 8.99,
      "brandPrice": 18.50,
      "savingsPercentage": 51,
      "unitPriceString": "$0.30 / tablet",
      "fdaBioequivalentRating": "AB-Rated",
      "otcRegulated": true,
      "image": "https://..."
    }
  ]
}
```

### GET `/api/v1/medicines/:id`
- **Auth**: Public
- **Response** (`200 OK`): Full clinical details (indications, dosageAdult, dosageSenior, activeIngredient, inactiveIngredients, batchQuality).

### GET `/api/v1/medicines/:id/sellers`
- **Auth**: Public
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "PHARM-01",
      "name": "WellSpring Meds",
      "licenseNumber": "DL-88492-MED",
      "trustScore": 98,
      "picName": "Dr. Kimberly Young, PharmD",
      "distanceMiles": 0.8,
      "deliveryEta": "Same-Day Ready",
      "price": 8.99,
      "inStock": true,
      "coldChainCertified": true,
      "rating": 4.8
    }
  ]
}
```

---

## 3. Prescriptions & Safety (`/api/v1/prescriptions`)

### POST `/api/v1/prescriptions/upload`
- **Auth**: Bearer Token (Patient / Pharmacist)
- **Request**: `{ "imageUrl": "https://...", "ocrText": "Amoxicillin 500mg Q8H" }`
- **Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "RX-99210",
    "status": "VALIDATED",
    "extractedMedication": "Amoxicillin Trihydrate 500mg",
    "ddiWarnings": [],
    "apapCeilingExceeded": false
  }
}
```

---

## 4. Orders & Chain-of-Custody (`/api/v1/orders`)

### POST `/api/v1/orders`
- **Auth**: Bearer Token (Patient)
- **Request**:
```json
{
  "pharmacyId": "PHARM-01",
  "destinationAddress": "742 Evergreen Terr, Springfield",
  "items": [
    { "medicineId": "MED-01", "quantity": 1 }
  ]
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "orderId": "GM-94281",
    "status": "PLACED",
    "totalAmount": 8.99,
    "medicalReleasePin": "4892",
    "sealNumber": "#SEAL-9082",
    "etaMinutes": 25,
    "distanceMiles": 1.2
  }
}
```

### GET `/api/v1/orders/:id`
- **Auth**: Bearer Token
- **Response** (`200 OK`): Live order tracking dossier with courier info, telemetry, temperature, and timeline events.

### POST `/api/v1/orders/:id/verify-pin`
- **Auth**: Bearer Token (Courier / Dispatcher)
- **Request**: `{ "pin": "4892" }`
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "PIN verified successfully. Tamper seal released.",
  "data": { "status": "DELIVERED" }
}
```
- **Error Response** (`400 Bad Request` on Mismatch):
```json
{
  "success": false,
  "message": "Invalid Medical Release PIN. Attempt 2 of 3.",
  "code": "PIN_MISMATCH",
  "data": { "attemptsRemaining": 1 }
}
```

---

## 5. Pharmacy Dispensing Desk (`/api/v1/pharmacy`)

### GET `/api/v1/pharmacy/orders/queue`
- **Auth**: Bearer Token (Pharmacist)
- **Response** (`200 OK`): List of orders assigned to current tenant pharmacy.

### POST `/api/v1/pharmacy/orders/:id/verify-checklist`
- **Auth**: Bearer Token (Pharmacist)
- **Request**:
```json
{
  "pmpChecked": true,
  "ndcMatched": true,
  "expirySafe": true,
  "coldChainAttached": true,
  "sealNumber": "#SEAL-9082-CK"
}
```
- **Response** (`200 OK`): `{ "success": true, "message": "5-point regulatory verification confirmed." }`

### POST `/api/v1/pharmacy/orders/:id/handover`
- **Auth**: Bearer Token (Pharmacist)
- **Request**: `{ "courierId": "DVR-882" }`
- **Response** (`200 OK`): `{ "success": true, "data": { "status": "DISPATCHED" } }`

### GET `/api/v1/pharmacy/inventory`
- **Auth**: Bearer Token (Pharmacist)
- **Response** (`200 OK`): Inventory stock records with velocities and locations.

### POST `/api/v1/pharmacy/inventory/quarantine`
- **Auth**: Bearer Token (Pharmacist)
- **Request**: `{ "lotNumber": "DX-8819", "action": "AUTO_LIQUIDATE" }`
- **Response** (`200 OK`): `{ "success": true, "message": "Batch moved to quarantine liquidation." }`

---

## 6. TrustOps Governance & Merkle Audit (`/api/v1/trustops`)

### GET `/api/v1/trustops/telemetry/stream`
- **Auth**: Bearer Token (Trust Officer)
- **Response** (`200 OK`): Array of live transit pings (GPS, temperature, BLE logs).

### POST `/api/v1/trustops/gatekeeper/override`
- **Auth**: Bearer Token (Trust Officer)
- **Request**: `{ "orderId": "GM-94281", "action": "ISSUE_BYPASS_OTP" }`
- **Response** (`200 OK`): `{ "success": true, "message": "One-time bypass OTP sent to patient." }`

### GET `/api/v1/trustops/audit/logs`
- **Auth**: Bearer Token (Trust Officer)
- **Query Params**: `tenant`, `classification`, `search`
- **Response** (`200 OK`): List of Merkle-sealed audit events.

### GET `/api/v1/trustops/audit/verify`
- **Auth**: Bearer Token (Trust Officer)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "chainValid": true,
    "totalBlocks": 256,
    "merkleRoot": "0x99a3f761c4b281d77a092ef51b9201f84821ca39e557bb01d48c89b12",
    "verifiedAt": "2026-09-08T14:55:00.000Z"
  }
}
```
