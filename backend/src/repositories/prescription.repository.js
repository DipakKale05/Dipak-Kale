import { db } from '../config/database.js';

export class PrescriptionRepository {
  async findAll(filter = {}) {
    let records = db.applyRlsFilter('prescriptions', db.tables.prescriptions);

    if (filter.patient_id) {
      records = records.filter((p) => p.patient_id === filter.patient_id);
    }
    if (filter.status) {
      records = records.filter((p) => p.status === filter.status);
    }
    return records;
  }

  async findById(id) {
    const records = db.applyRlsFilter('prescriptions', db.tables.prescriptions);
    return records.find((p) => p.id === id) || null;
  }

  async findByRxNumber(rxNumber) {
    const records = db.applyRlsFilter('prescriptions', db.tables.prescriptions);
    return records.find((p) => p.rx_number === rxNumber) || null;
  }

  async create(rxData) {
    const newRx = {
      id: rxData.id || `RX-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'ACTIVE',
      refills_remaining: 1,
      ddi_warnings: [],
      created_at: new Date(),
      ...rxData,
    };
    db.tables.prescriptions.push(newRx);
    return newRx;
  }

  async update(id, updates) {
    const rx = await this.findById(id);
    if (!rx) return null;
    Object.assign(rx, updates);
    return rx;
  }
}

export const prescriptionRepository = new PrescriptionRepository();
