import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { db } from '../src/config/database.js';

describe('Phase 5: Catalog & Bioequivalent Engine (/api/v1/medicines)', () => {
  beforeEach(async () => {
    await db.reset();
  });

  describe('1. Catalog Discovery (GET /api/v1/medicines)', () => {
    it('should return catalog items with accurate savings calculations', async () => {
      const res = await request(app).get('/api/v1/medicines');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);

      const cetirizine = res.body.data.find((m) => m.id === 'MED-01');
      expect(cetirizine).toBeDefined();
      expect(cetirizine.genericName).toBe('Cetirizine HCl');
      expect(cetirizine.brandNameEquivalent).toBe('Zyrtec®');
      expect(cetirizine.genericPrice).toBe(8.99);
      expect(cetirizine.brandPrice).toBe(18.5);
      expect(cetirizine.savingsPercentage).toBe(51);
      expect(cetirizine.savingsDollars).toBe(9.51);
      expect(cetirizine.fdaBioequivalentRating).toBe('AB-Rated');
      expect(cetirizine.otcRegulated).toBe(true);
    });

    it('should filter catalog by search query string for generic name or brand equivalent', async () => {
      // Search by generic name
      const genericRes = await request(app).get('/api/v1/medicines?q=Cetirizine');
      expect(genericRes.status).toBe(200);
      expect(genericRes.body.data.length).toBe(1);
      expect(genericRes.body.data[0].id).toBe('MED-01');

      // Search by brand equivalent
      const brandRes = await request(app).get('/api/v1/medicines?q=Zyrtec');
      expect(brandRes.status).toBe(200);
      expect(brandRes.body.data.length).toBe(1);
      expect(brandRes.body.data[0].id).toBe('MED-01');

      // Search with no results
      const emptyRes = await request(app).get('/api/v1/medicines?q=UnknownNonExistentMedication');
      expect(emptyRes.status).toBe(200);
      expect(emptyRes.body.data).toEqual([]);
    });

    it('should filter catalog by therapeutic category', async () => {
      const res = await request(app).get('/api/v1/medicines?category=Pain%20%26%20Fever');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].genericName).toBe('Paracetamol');
      expect(res.body.data[0].category).toBe('Pain & Fever');
    });
  });

  describe('2. Bioequivalent Detail & Salt Parity (GET /api/v1/medicines/:id)', () => {
    it('should return full clinical monograph and 1:1 salt parity analysis', async () => {
      const res = await request(app).get('/api/v1/medicines/MED-01');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('MED-01');
      expect(res.body.data.genericName).toBe('Cetirizine HCl');
      expect(res.body.data.indications).toContain('hay fever');
      expect(res.body.data.dosageAdult).toContain('10mg tablet once daily');
      expect(res.body.data.activeIngredient).toContain('Cetirizine HCl');

      // Verify Salt Parity specification
      expect(res.body.data.saltParity).toBeDefined();
      expect(res.body.data.saltParity.equivalent).toBe(true);
      expect(res.body.data.saltParity.chemicalSalt).toContain('Cetirizine');
      expect(res.body.data.saltParity.bioequivalentStandard).toContain('FDA Orange Book AB-Rated');
      expect(res.body.data.saltParity.purityAssayPercentage).toBe(99.8);
      expect(res.body.data.saltParity.dissolutionProfile).toContain('USP Dissolution Test 1');
    });

    it('should return 404 with standardized error for non-existent medicine ID', async () => {
      const res = await request(app).get('/api/v1/medicines/MED-999-NONEXISTENT');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('NOT_FOUND');
      expect(res.body.message).toContain('not found');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('3. Multi-Seller Price Aggregation (GET /api/v1/medicines/:id/sellers)', () => {
    it('should aggregate multi-pharmacy seller pricing, distance sorting, and cold-chain badge', async () => {
      const res = await request(app).get('/api/v1/medicines/MED-01/sellers');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);

      // Verify sorted by distance ascending (nearest first)
      for (let i = 0; i < res.body.data.length - 1; i++) {
        expect(res.body.data[i].distanceMiles).toBeLessThanOrEqual(res.body.data[i + 1].distanceMiles);
      }

      // First seller: WellSpring Meds (0.8 mi)
      const wellSpring = res.body.data[0];
      expect(wellSpring.id).toBe('PHARM-01');
      expect(wellSpring.name).toBe('WellSpring Meds');
      expect(wellSpring.distanceMiles).toBe(0.8);
      expect(wellSpring.price).toBe(8.99);
      expect(wellSpring.coldChainCertified).toBe(true);
      expect(wellSpring.inStock).toBe(true);
      expect(wellSpring.trustScore).toBe(98);
      expect(wellSpring.picName).toBe('Dr. Kimberly Young, PharmD');

      // Second seller: Apex Medicos (1.4 mi)
      const apex = res.body.data[1];
      expect(apex.id).toBe('PHARM-02');
      expect(apex.name).toBe('Apex Medicos');
      expect(apex.distanceMiles).toBe(1.4);
      expect(apex.price).toBe(9.2);
      expect(apex.coldChainCertified).toBe(false);
      expect(apex.inStock).toBe(true);
    });

    it('should return 404 for sellers query on non-existent medicine ID', async () => {
      const res = await request(app).get('/api/v1/medicines/MED-DOES-NOT-EXIST/sellers');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });
});
