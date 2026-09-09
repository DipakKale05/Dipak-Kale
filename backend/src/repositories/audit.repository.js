import { db } from '../config/database.js';

export class AuditRepository {
  async findAll(filter = {}) {
    let list = [...db.tables.audit_events];

    if (filter.classification) {
      list = list.filter((a) => a.classification === filter.classification);
    }
    if (filter.tenant_context) {
      list = list.filter((a) => a.tenant_context === filter.tenant_context);
    }
    if (filter.actor_id) {
      list = list.filter((a) => a.actor_id === filter.actor_id);
    }

    // Default reverse chronological order
    list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (filter.limit) {
      list = list.slice(0, filter.limit);
    }

    return list;
  }

  async findById(id) {
    return db.tables.audit_events.find((a) => a.id === id || a.event_id === id) || null;
  }

  async findLatestBlock() {
    if (db.tables.audit_events.length === 0) return null;
    return db.tables.audit_events[db.tables.audit_events.length - 1];
  }

  async create(auditData) {
    const newEvent = {
      id: auditData.id || `AE-${Math.floor(10 + Math.random() * 90)}`,
      event_id: auditData.event_id || `EVT-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: auditData.timestamp || new Date(),
      ...auditData,
    };
    db.tables.audit_events.push(newEvent);
    return newEvent;
  }
}

export const auditRepository = new AuditRepository();
