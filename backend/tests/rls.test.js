import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { db } from '../src/config/database.js';
import { tenantMiddleware } from '../src/middlewares/tenant.js';
import { userRepository } from '../src/repositories/user.repository.js';
import { pharmacyRepository } from '../src/repositories/pharmacy.repository.js';
import { medicineRepository } from '../src/repositories/medicine.repository.js';
import { inventoryRepository } from '../src/repositories/inventory.repository.js';
import { orderRepository } from '../src/repositories/order.repository.js';
import { auditRepository } from '../src/repositories/audit.repository.js';
import { courierRepository } from '../src/repositories/courier.repository.js';
import { prescriptionRepository } from '../src/repositories/prescription.repository.js';

describe('Phase 3: Data Models & Multi-Tenant RLS Engine', () => {
  beforeEach(async () => {
    // Reset database to initial seed state before each test
    await db.reset();
  });

  describe('1. Schema & Dataset Initialization', () => {
    it('should seed all 10 domain tables with production mock records', () => {
      expect(db.tables.users.length).toBeGreaterThanOrEqual(4);
      expect(db.tables.pharmacies.length).toBeGreaterThanOrEqual(3);
      expect(db.tables.medicines.length).toBeGreaterThanOrEqual(3);
      expect(db.tables.pharmacy_inventory.length).toBeGreaterThanOrEqual(5);
      expect(db.tables.couriers.length).toBeGreaterThanOrEqual(2);
      expect(db.tables.orders.length).toBeGreaterThanOrEqual(1);
      expect(db.tables.order_items.length).toBeGreaterThanOrEqual(2);
      expect(db.tables.prescriptions.length).toBeGreaterThanOrEqual(2);
      expect(db.tables.chain_of_custody_events.length).toBeGreaterThanOrEqual(3);
      expect(db.tables.audit_events.length).toBeGreaterThanOrEqual(3);
    });

    it('should contain expected seed entities matching frontend specs', async () => {
      const patient = await userRepository.findByEmail('sarah.connor@example.com');
      expect(patient).toBeDefined();
      expect(patient.role).toBe('PATIENT');

      const pharmacistEast = await userRepository.findByEmail('kimberly.young@wellspringmeds.com');
      expect(pharmacistEast).toBeDefined();
      expect(pharmacistEast.tenant_id).toBe('tenant_east_04');

      const cetirizine = await medicineRepository.findByGenericName('Cetirizine HCl');
      expect(cetirizine).toBeDefined();
      expect(cetirizine.brand_name_equivalent).toBe('Zyrtec®');
      expect(cetirizine.generic_price).toBe(8.99);

      const courier = await courierRepository.findByBadge('#MC-882');
      expect(courier).toBeDefined();
      expect(courier.name).toBe('Marcus Jenkins');
    });
  });

  describe('2. Multi-Tenant Row-Level Security (RLS) Isolation', () => {
    it('should enforce strict tenant isolation for tenant_east_04 (WellSpring Meds)', async () => {
      db.setTenantContext('tenant_east_04', 'PHARMACIST');

      const inventory = await inventoryRepository.findAll();
      expect(inventory.length).toBe(1);
      expect(inventory[0].tenant_id).toBe('tenant_east_04');
      expect(inventory[0].pharmacy_id).toBe('PHARM-01');

      const orders = await orderRepository.findAll();
      expect(orders.length).toBe(1);
      expect(orders[0].tenant_id).toBe('tenant_east_04');
      expect(orders[0].id).toBe('GM-94281');

      const prescriptions = await prescriptionRepository.findAll();
      expect(prescriptions.length).toBe(1);
      expect(prescriptions[0].tenant_id).toBe('tenant_east_04');
    });

    it('should enforce strict tenant isolation for tenant_central_04 (Apex Medicos)', async () => {
      db.setTenantContext('tenant_central_04', 'PHARMACIST');

      const inventory = await inventoryRepository.findAll();
      expect(inventory.length).toBe(4);
      expect(inventory.every((i) => i.tenant_id === 'tenant_central_04')).toBe(true);

      // Apex Medicos has no orders in initial seed
      const orders = await orderRepository.findAll();
      expect(orders.length).toBe(0);

      // Verify Apex Medicos CANNOT access WellSpring inventory or orders
      const wellSpringOrder = await orderRepository.findById('GM-94281');
      expect(wellSpringOrder).toBeNull();
    });

    it('should block cross-tenant inventory reads (fail-closed when no context is set)', async () => {
      db.resetTenantContext();

      const inventory = await inventoryRepository.findAll();
      expect(inventory).toEqual([]);

      const orders = await orderRepository.findAll();
      expect(orders).toEqual([]);
    });

    it('should permit Trust Officer role to override RLS for system-wide governance auditing', async () => {
      // Role is TRUST_OFFICER (Elena Vance)
      db.setTenantContext('public_core', 'TRUST_OFFICER');

      const allInventory = await inventoryRepository.findAll();
      expect(allInventory.length).toBe(5);

      const allOrders = await orderRepository.findAll();
      expect(allOrders.length).toBe(1);
      expect(allOrders[0].id).toBe('GM-94281');
    });
  });

  describe('3. Tenant Context HTTP Middleware Integration', () => {
    it('should automatically bind and isolate tenant based on X-Tenant-ID header', async () => {
      const testApp = express();
      testApp.use(tenantMiddleware);

      testApp.get('/test-tenant-inventory', async (req, res) => {
        const inventory = await inventoryRepository.findAll();
        res.status(200).json({ success: true, count: inventory.length, items: inventory });
      });

      // Request for tenant_east_04
      const eastRes = await request(testApp)
        .get('/test-tenant-inventory')
        .set('X-Tenant-ID', 'tenant_east_04');

      expect(eastRes.status).toBe(200);
      expect(eastRes.body.count).toBe(1);
      expect(eastRes.body.items[0].tenant_id).toBe('tenant_east_04');

      // Request for tenant_central_04
      const centralRes = await request(testApp)
        .get('/test-tenant-inventory')
        .set('X-Tenant-ID', 'tenant_central_04');

      expect(centralRes.status).toBe(200);
      expect(centralRes.body.count).toBe(4);
      expect(centralRes.body.items.every((i) => i.tenant_id === 'tenant_central_04')).toBe(true);

      // Verify context was reset after response finished
      expect(db.currentTenant).toBeNull();
    });
  });

  describe('4. Repository Domain Behaviors', () => {
    it('OrderRepository should track PIN attempts and order items', async () => {
      db.setTenantContext('tenant_east_04', 'PHARMACIST');

      const order = await orderRepository.findById('GM-94281');
      expect(order).toBeDefined();

      const items = await orderRepository.findItemsByOrderId('GM-94281');
      expect(items.length).toBe(2);

      const attempts = await orderRepository.incrementPinAttempts('GM-94281');
      expect(attempts).toBe(1);

      const updatedOrder = await orderRepository.findById('GM-94281');
      expect(updatedOrder.pin_attempts).toBe(1);
    });

    it('InventoryRepository should identify near-expiry items and apply liquidation discounts', async () => {
      db.setTenantContext('tenant_central_04', 'PHARMACIST');

      // Batch #DX-8819 is already marked Quarantine in initial seed
      const item = await inventoryRepository.quarantine('#DX-8819', 'AUTO_LIQUIDATE');
      expect(item).toBeDefined();
      expect(item.status).toBe('Quarantine');
      // Original 5.84, with discount: 5.84 * 0.65 = 3.80
      expect(item.unit_price).toBe(3.8);
    });

    it('AuditRepository should query append-only cryptographic records and latest block', async () => {
      const latestBlock = await auditRepository.findLatestBlock();
      expect(latestBlock).toBeDefined();
      expect(latestBlock.previous_hash).toBeDefined();
      expect(latestBlock.merkle_root).toBeDefined();

      const hipaaEvents = await auditRepository.findAll({ classification: 'HIPAA / PHI' });
      expect(hipaaEvents.length).toBe(1);
      expect(hipaaEvents[0].target).toContain('Order #ORD-94281');
    });
  });
});
