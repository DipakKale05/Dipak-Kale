import { db } from '../config/database.js';

/**
 * Multi-Tenant Context Middleware
 * Extracts tenant identifier and binds it to the current database session.
 * Automatically cleans up tenant context when the HTTP response completes.
 */
export function tenantMiddleware(req, res, next) {
  const headerTenant = req.headers['x-tenant-id'] || req.headers['x-tenant'];
  const userTenant = req.user?.tenant_id;
  const queryTenant = req.query?.tenantId;

  const tenantId = headerTenant || userTenant || queryTenant || null;
  const userRole = req.user?.role || null;

  if (tenantId) {
    db.setTenantContext(tenantId, userRole);
    req.tenantId = tenantId;
  }

  const cleanup = () => {
    db.resetTenantContext();
  };

  res.on('finish', cleanup);
  res.on('close', cleanup);

  next();
}
