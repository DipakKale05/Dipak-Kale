import { db } from '../config/database.js';

export class InventoryRepository {
  async findByMedicine(medicineId) {
    const records = db.applyRlsFilter('pharmacy_inventory', db.tables.pharmacy_inventory);
    return records.filter((i) => i.medicine_id === medicineId);
  }

  async findByPharmacy(pharmacyId) {
    const records = db.applyRlsFilter('pharmacy_inventory', db.tables.pharmacy_inventory);
    return records.filter((i) => i.pharmacy_id === pharmacyId);
  }

  async findAll(filter = {}) {
    let records = db.applyRlsFilter('pharmacy_inventory', db.tables.pharmacy_inventory);

    if (filter.status) {
      records = records.filter((i) => i.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.pharmacy_id) {
      records = records.filter((i) => i.pharmacy_id === filter.pharmacy_id);
    }
    return records;
  }

  async findById(id) {
    const records = db.applyRlsFilter('pharmacy_inventory', db.tables.pharmacy_inventory);
    return records.find((i) => i.id === id) || null;
  }

  async findByLot(lotNumber) {
    const records = db.applyRlsFilter('pharmacy_inventory', db.tables.pharmacy_inventory);
    return records.find((i) => i.batch_number === lotNumber) || null;
  }

  async findNearExpiry(thresholdDays = 60) {
    const records = db.applyRlsFilter('pharmacy_inventory', db.tables.pharmacy_inventory);
    const now = new Date();
    const thresholdDate = new Date(now.getTime() + thresholdDays * 24 * 60 * 60 * 1000);

    return records.filter((i) => {
      if (!i.exp_date) return false;
      // Handle "MM/YYYY" format
      const parts = i.exp_date.split('/');
      let exp;
      if (parts.length === 2) {
        exp = new Date(parseInt(parts[1], 10), parseInt(parts[0], 10) - 1, 1);
      } else {
        exp = new Date(i.exp_date);
      }
      return exp <= thresholdDate;
    });
  }

  async quarantine(lotNumber, action) {
    const item = db.tables.pharmacy_inventory.find((i) => i.batch_number === lotNumber);
    if (!item) return null;

    item.status = 'Quarantine';
    if (action === 'AUTO_LIQUIDATE') {
      item.unit_price = Number((item.unit_price * 0.65).toFixed(2)); // 35% liquidation discount
    }
    return item;
  }

  async create(invData) {
    const newInv = {
      id: invData.id || `INV-${Math.floor(10 + Math.random() * 90)}`,
      status: 'Adequate',
      assay_verified: true,
      current_count: 0,
      created_at: new Date(),
      ...invData,
    };
    db.tables.pharmacy_inventory.push(newInv);
    return newInv;
  }

  async update(id, updates) {
    const item = db.tables.pharmacy_inventory.find((i) => i.id === id);
    if (!item) return null;
    Object.assign(item, updates);
    return item;
  }
}

export const inventoryRepository = new InventoryRepository();
