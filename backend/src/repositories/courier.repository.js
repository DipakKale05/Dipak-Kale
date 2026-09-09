import { db } from '../config/database.js';

export class CourierRepository {
  async findAll(filter = {}) {
    let list = db.tables.couriers;
    if (filter.cold_chain_certified !== undefined) {
      list = list.filter((c) => c.cold_chain_certified === filter.cold_chain_certified);
    }
    if (filter.is_verified !== undefined) {
      list = list.filter((c) => c.is_verified === filter.is_verified);
    }
    return list;
  }

  async findById(id) {
    return db.tables.couriers.find((c) => c.id === id) || null;
  }

  async findByBadge(badgeNumber) {
    return db.tables.couriers.find((c) => c.badge_number === badgeNumber) || null;
  }

  async updateLocation(id, lat, lng) {
    const courier = await this.findById(id);
    if (!courier) return null;
    courier.current_lat = lat;
    courier.current_lng = lng;
    return courier;
  }

  async create(courierData) {
    const newCourier = {
      id: courierData.id || `DVR-${Math.floor(100 + Math.random() * 900)}`,
      is_verified: true,
      cold_chain_certified: false,
      created_at: new Date(),
      ...courierData,
    };
    db.tables.couriers.push(newCourier);
    return newCourier;
  }

  async update(id, updates) {
    const courier = await this.findById(id);
    if (!courier) return null;
    Object.assign(courier, updates);
    return courier;
  }
}

export const courierRepository = new CourierRepository();
