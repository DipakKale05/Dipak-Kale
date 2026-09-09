import { db } from '../config/database.js';

export class OrderRepository {
  async findAll(filter = {}) {
    let records = db.applyRlsFilter('orders', db.tables.orders);

    if (filter.status) {
      records = records.filter((o) => o.status === filter.status);
    }
    if (filter.patient_id) {
      records = records.filter((o) => o.patient_id === filter.patient_id);
    }
    if (filter.pharmacy_id) {
      records = records.filter((o) => o.pharmacy_id === filter.pharmacy_id);
    }
    return records;
  }

  async findById(id) {
    const records = db.applyRlsFilter('orders', db.tables.orders);
    return records.find((o) => o.id === id) || null;
  }

  async findItemsByOrderId(orderId) {
    return db.tables.order_items.filter((item) => item.order_id === orderId);
  }

  async create(orderData, items = []) {
    const newOrder = {
      id: orderData.id || `GM-${Math.floor(10000 + Math.random() * 90000)}`,
      status: orderData.status || 'PLACED',
      pin_attempts: 0,
      created_at: new Date(),
      updated_at: new Date(),
      ...orderData,
    };

    db.tables.orders.push(newOrder);

    const createdItems = items.map((item, idx) => {
      const orderItem = {
        id: item.id || `OI-${Math.floor(10 + Math.random() * 90)}-${idx}`,
        order_id: newOrder.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        medicine_id: item.medicine_id,
        lot_number: item.lot_number || null,
        exp_date: item.exp_date || null,
      };
      db.tables.order_items.push(orderItem);
      return orderItem;
    });

    return { ...newOrder, items: createdItems };
  }

  async update(id, updates) {
    const order = await this.findById(id);
    if (!order) return null;
    Object.assign(order, { ...updates, updated_at: new Date() });
    return order;
  }

  async incrementPinAttempts(id) {
    const order = await this.findById(id);
    if (!order) return null;
    order.pin_attempts = (order.pin_attempts || 0) + 1;
    order.updated_at = new Date();
    return order.pin_attempts;
  }
}

export const orderRepository = new OrderRepository();
