import { db } from '../config/database.js';

export class UserRepository {
  async findById(id) {
    return db.tables.users.find((u) => u.id === id) || null;
  }

  async findByEmail(email) {
    if (!email) return null;
    return db.tables.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findByPhone(phone) {
    if (!phone) return null;
    return db.tables.users.find((u) => u.phone === phone) || null;
  }

  async findByLicenseNumber(licenseNumber) {
    if (!licenseNumber) return null;
    return db.tables.users.find((u) => u.license_number === licenseNumber) || null;
  }

  async findAll(filter = {}) {
    let list = db.tables.users;
    if (filter.role) {
      list = list.filter((u) => u.role === filter.role);
    }
    if (filter.tenant_id) {
      list = list.filter((u) => u.tenant_id === filter.tenant_id);
    }
    return list;
  }

  async create(userData) {
    const rolePrefix = userData.role ? userData.role.slice(0, 4).toUpperCase() : 'PAT';
    const newUser = {
      id: userData.id || `USR-${rolePrefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date(),
      fido2_verified: false,
      hipaa_consented: true,
      ...userData,
    };
    db.tables.users.push(newUser);
    return newUser;
  }

  async update(id, updates) {
    const user = await this.findById(id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  }
}

export const userRepository = new UserRepository();
