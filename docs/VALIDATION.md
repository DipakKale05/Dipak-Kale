# Request Validation Standards: GenricMed

## Validation Engine
All untrusted input payloads (`body`, `query`, `params`) are validated using **Zod** schema definitions before reaching controllers.

---

## Validation Schemas

### 1. Registration (`authValidator.registerSchema`)
- `email`: Required, valid email format, max 255 chars, lowercased.
- `password`: Minimum 8 chars, containing at least one letter and one number or special character.
- `name`: Required, 2 to 100 chars.
- `phone`: Optional, valid E.164 phone format if provided.
- `role`: Enum: `'PATIENT' | 'PHARMACIST' | 'TRUST_OFFICER'`.
- `pharmacyName`: Required if `role === 'PHARMACIST'`.
- `licenseNumber`: Required if `role === 'PHARMACIST'`.
- `hipaaConsented`: Must be `true` for all users.

### 2. Login (`authValidator.loginSchema`)
- `email`: Required, valid email format.
- `password`: Required, min 6 chars.

### 3. Phone OTP (`authValidator.otpVerifySchema`)
- `phone`: Required, valid phone string.
- `code`: Required, exactly 4 numeric digits.

### 4. Order Creation (`orderValidator.createOrderSchema`)
- `pharmacyId`: Required, string ID.
- `destinationAddress`: Required, min 5 chars.
- `items`: Array of items, min 1 item:
  - `medicineId`: Required string ID.
  - `quantity`: Positive integer, min 1, max 100.

### 5. PIN Verification (`orderValidator.verifyPinSchema`)
- `pin`: Required, string of exactly 4 numeric digits.

### 6. Regulatory Checklist (`pharmacyValidator.verifyChecklistSchema`)
- `pmpChecked`: Boolean, required `true`.
- `ndcMatched`: Boolean, required `true`.
- `expirySafe`: Boolean, required `true`.
- `coldChainAttached`: Boolean, required.
- `sealNumber`: Required string, format matching `#SEAL-[0-9A-Z]+`.

### 7. Quarantine Triage (`pharmacyValidator.quarantineSchema`)
- `lotNumber`: Required string.
- `action`: Enum: `'AUTO_LIQUIDATE' | 'PHYSICAL_QUARANTINE'`.
