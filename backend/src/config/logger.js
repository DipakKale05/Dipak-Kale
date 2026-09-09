const SENSITIVE_KEYS = new Set([
  'password',
  'passwordhash',
  'token',
  'jwt',
  'jwtsecret',
  'medicalreleasepin',
  'authorization',
  'cookie',
]);

function sanitizeData(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeData);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      clean[key] = sanitizeData(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export const logger = {
  info(msg, meta = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? JSON.stringify(sanitizeData(meta)) : '');
  },
  warn(msg, meta = {}) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? JSON.stringify(sanitizeData(meta)) : '');
  },
  error(msg, meta = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? JSON.stringify(sanitizeData(meta)) : '');
  },
  debug(msg, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${msg}`, Object.keys(meta).length ? JSON.stringify(sanitizeData(meta)) : '');
    }
  },
};
