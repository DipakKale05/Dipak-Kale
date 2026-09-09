import { logger } from './logger.js';
import { env } from './env.js';
import { seedDatabase } from '../models/seedData.js';
import pg from 'pg';

class InMemoryDatabase {
  constructor() {
    this.driverName = 'sqlite_in_memory_tenant_engine';
    this.currentTenant = null;
    this.currentUserRole = null;
    this.isSeeded = false;

    this.tables = {
      users: [],
      pharmacies: [],
      medicines: [],
      pharmacy_inventory: [],
      prescriptions: [],
      orders: [],
      order_items: [],
      couriers: [],
      chain_of_custody_events: [],
      audit_events: [],
    };
  }

  setTenantContext(tenantId, userRole = null) {
    this.currentTenant = tenantId;
    this.currentUserRole = userRole;
  }

  resetTenantContext() {
    this.currentTenant = null;
    this.currentUserRole = null;
  }

  // Row-Level Security (RLS) Filter Engine
  applyRlsFilter(tableName, records) {
    // Lead Trust Officers and Compliance Auditors bypass tenant filters for system-wide governance
    const isTrustGovernanceRole =
      this.currentUserRole === 'TRUST_OFFICER' ||
      this.currentUserRole === 'LEAD_TRUST_OFFICER' ||
      this.currentUserRole === 'COMPLIANCE_AUDITOR';

    if (isTrustGovernanceRole || this.currentTenant === 'public_core') {
      return records;
    }

    // Operational tables with strict RLS enforcement
    const rlsTables = ['pharmacy_inventory', 'orders', 'chain_of_custody_events', 'prescriptions'];
    if (rlsTables.includes(tableName)) {
      if (!this.currentTenant) {
        // Without explicit tenant context or trust officer role, tenant-isolated tables return empty
        return [];
      }
      return records.filter((r) => r.tenant_id === this.currentTenant);
    }

    return records;
  }

  async seed() {
    await seedDatabase(this);
    this.isSeeded = true;
    logger.info('In-memory multi-tenant database successfully seeded across 10 tables');
  }

  async reset() {
    this.resetTenantContext();
    this.tables = {
      users: [],
      pharmacies: [],
      medicines: [],
      pharmacy_inventory: [],
      prescriptions: [],
      orders: [],
      order_items: [],
      couriers: [],
      chain_of_custody_events: [],
      audit_events: [],
    };
    await this.seed();
  }

  async init() {
    if (!this.isSeeded) {
      await this.seed();
    }
  }
}

class PostgresDatabase {
  constructor(connectionString) {
    this.driverName = 'postgresql';
    this.connectionString = connectionString;
    this.pool = new pg.Pool({ connectionString });
    this.currentTenant = null;
    this.currentUserRole = null;
  }

  setTenantContext(tenantId, userRole = null) {
    this.currentTenant = tenantId;
    this.currentUserRole = userRole;
  }

  resetTenantContext() {
    this.currentTenant = null;
    this.currentUserRole = null;
  }

  async query(text, params = []) {
    const client = await this.pool.connect();
    try {
      if (this.currentTenant) {
        await client.query("SELECT set_config('app.current_tenant', $1, true)", [this.currentTenant]);
      }
      if (this.currentUserRole) {
        await client.query("SELECT set_config('app.user_role', $1, true)", [this.currentUserRole]);
      }
      return await client.query(text, params);
    } finally {
      client.release();
    }
  }

  async init() {
    logger.info('PostgreSQL RLS pool connected.');
  }
}

// Select database adapter based on configuration
export const db = env.DATABASE_URL
  ? new PostgresDatabase(env.DATABASE_URL)
  : new InMemoryDatabase();

// Auto-seed in-memory engine immediately on load
if (db.driverName === 'sqlite_in_memory_tenant_engine') {
  await db.init();
}

logger.info(`Database initialized with driver: ${db.driverName}`);
