# Error Handling Standard: GenricMed

## Uniform Error Response Contract

All error responses from the backend adhere strictly to this JSON format:

```json
{
  "success": false,
  "message": "Human-readable description of the error",
  "code": "MACHINE_READABLE_ERROR_CODE",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ],
  "timestamp": "2026-09-08T14:55:00.000Z"
}
```

---

## Standard Error Codes & HTTP Status Mapping

| HTTP Status | Code | Meaning |
|---|---|---|
| **400 Bad Request** | `BAD_REQUEST` | Malformed request or illegal parameters |
| **400 Bad Request** | `PIN_MISMATCH` | Gatekeeper Medical Release PIN does not match |
| **400 Bad Request** | `PIN_MAX_ATTEMPTS` | PIN entry threshold exceeded (3 attempts reached) |
| **400 Bad Request** | `APAP_CEILING_EXCEEDED`| Daily Paracetamol limit (>4000mg) breached |
| **401 Unauthorized** | `AUTH_REQUIRED` | Missing or expired JWT access token |
| **401 Unauthorized** | `INVALID_CREDENTIALS` | Incorrect email, password, or OTP token |
| **403 Forbidden** | `FORBIDDEN` | Authenticated user lacks permission for this action |
| **403 Forbidden** | `TENANT_ACCESS_DENIED` | Attempted access to another tenant's pharmacy data |
| **404 Not Found** | `NOT_FOUND` | Requested entity does not exist |
| **409 Conflict** | `CONFLICT` | Entity already exists (e.g. email or license # in use) |
| **422 Unprocessable**| `VALIDATION_ERROR` | Request payload failed schema validation rules |
| **429 Too Many Req** | `RATE_LIMITED` | Exceeded API rate limits |
| **500 Server Error** | `INTERNAL_ERROR` | Unhandled server exception (stack trace redacted in prod) |

---

## Centralized Exception Architecture

1. Controllers never send ad-hoc `{ error: "msg" }` responses.
2. Domain services throw custom `AppError(message, statusCode, code, errors)` classes:
   - `NotFoundError`
   - `ValidationError`
   - `AuthenticationError`
   - `ForbiddenError`
   - `BusinessRuleError`
3. Central `errorHandler` middleware catches all exceptions, logs the event, and writes the standardized response.
