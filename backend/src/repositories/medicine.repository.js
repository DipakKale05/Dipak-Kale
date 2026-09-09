import { db } from '../config/database.js';

export class MedicineRepository {
  async findAll(filter = {}) {
    let list = db.tables.medicines;

    if (filter.category) {
      list = list.filter((m) => m.category.toLowerCase() === filter.category.toLowerCase());
    }

    if (filter.otc_regulated !== undefined) {
      list = list.filter((m) => m.otc_regulated === filter.otc_regulated);
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (m) =>
          m.generic_name.toLowerCase().includes(q) ||
          m.brand_name_equivalent.toLowerCase().includes(q) ||
          m.active_ingredient.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.indications && m.indications.toLowerCase().includes(q))
      );
    }

    return list;
  }

  async findById(id) {
    return db.tables.medicines.find((m) => m.id === id) || null;
  }

  async findByGenericName(name) {
    if (!name) return null;
    return (
      db.tables.medicines.find(
        (m) => m.generic_name.toLowerCase() === name.toLowerCase()
      ) || null
    );
  }

  async create(medData) {
    const newMed = {
      id: medData.id || `MED-${Math.floor(10 + Math.random() * 90)}`,
      fda_bioequivalent_rating: 'AB-Rated',
      otc_regulated: true,
      shelf_stability_months: 24,
      created_at: new Date(),
      ...medData,
    };
    db.tables.medicines.push(newMed);
    return newMed;
  }

  async update(id, updates) {
    const med = await this.findById(id);
    if (!med) return null;
    Object.assign(med, updates);
    return med;
  }
}

export const medicineRepository = new MedicineRepository();
