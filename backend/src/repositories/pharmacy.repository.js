import { db } from '../config/database.js';

export class PharmacyRepository {
  async findAll(filter = {}) {
    let list = db.tables.pharmacies;
    if (filter.tenant_id) {
      list = list.filter((p) => p.tenant_id === filter.tenant_id);
    }
    if (filter.cold_chain_certified !== undefined) {
      list = list.filter((p) => p.cold_chain_certified === filter.cold_chain_certified);
    }
    return list;
  }

  async findById(id) {
    return db.tables.pharmacies.find((p) => p.id === id) || null;
  }

  async findByTenantId(tenantId) {
    return db.tables.pharmacies.filter((p) => p.tenant_id === tenantId);
  }

  async findByLicenseNumber(licenseNumber) {
    if (!licenseNumber) return null;
    return db.tables.pharmacies.find((p) => p.license_number === licenseNumber) || null;
  }

  async findByDeaNumber(deaNumber) {
    if (!deaNumber) return null;
    return db.tables.pharmacies.find((p) => p.dea_number === deaNumber) || null;
  }

  async create(pharmacyData) {
    const newPharmacy = {
      id: pharmacyData.id || `PHARM-${Math.floor(10 + Math.random() * 90)}`,
      trust_score: 95,
      rating: 4.8,
      cold_chain_certified: false,
      created_at: new Date(),
      ...pharmacyData,
    };
    db.tables.pharmacies.push(newPharmacy);
    return newPharmacy;
  }

  async update(id, updates) {
    const pharmacy = await this.findById(id);
    if (!pharmacy) return null;
    Object.assign(pharmacy, updates);
    return pharmacy;
  }
}

export const pharmacyRepository = new PharmacyRepository();
