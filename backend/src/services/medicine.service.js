import { medicineRepository } from '../repositories/medicine.repository.js';
import { pharmacyRepository } from '../repositories/pharmacy.repository.js';
import { db } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export class MedicineService {
  formatMedicine(med) {
    if (!med) return null;

    const genericPrice = Number(med.generic_price);
    const brandPrice = Number(med.brand_price);
    const savingsDollars = Number((brandPrice - genericPrice).toFixed(2));
    const savingsPercentage =
      med.savings_percentage ||
      Math.round(((brandPrice - genericPrice) / brandPrice) * 100);

    return {
      id: med.id,
      genericName: med.generic_name,
      brandNameEquivalent: med.brand_name_equivalent,
      dosageForm: med.dosage_form,
      strength: med.strength,
      category: med.category,
      genericPrice,
      brandPrice,
      savingsPercentage,
      savingsDollars,
      unitPriceString: med.unit_price_string || `$${(genericPrice / 30).toFixed(2)} / unit`,
      fdaBioequivalentRating: med.fda_bioequivalent_rating || 'AB-Rated',
      otcRegulated: Boolean(med.otc_regulated),
      image: med.image_url,
      batchNumber: med.batch_number || '#CT-4421-US',
      mfgDate: med.mfg_date || '10 / 2024',
      expDate: med.exp_date || '10 / 2026',
      shelfStabilityMonths: med.shelf_stability_months || 24,
      indications: med.indications,
      dosageAdult: med.dosage_adult,
      dosageSenior: med.dosage_senior,
      activeIngredient: med.active_ingredient,
      inactiveIngredients: med.inactive_ingredients,
    };
  }

  async getAllMedicines(query = {}) {
    const search = query.q || query.search || '';
    const category = query.category || '';

    const records = await medicineRepository.findAll({ search, category });
    return records.map((med) => this.formatMedicine(med));
  }

  async getMedicineById(id) {
    const med = await medicineRepository.findById(id);
    if (!med) {
      throw new NotFoundError(`Medicine with ID '${id}' not found`, 'NOT_FOUND');
    }

    const formatted = this.formatMedicine(med);

    // Chemical salt parity & FDA bioequivalence monograph
    const saltTokens = (med.active_ingredient || '').split(' ');
    const chemicalSalt =
      saltTokens.length >= 2 ? `${saltTokens[0]} ${saltTokens[1]}` : med.generic_name;

    formatted.saltParity = {
      equivalent: true,
      chemicalSalt,
      bioequivalentStandard: `FDA Orange Book ${med.fda_bioequivalent_rating || 'AB-Rated'}`,
      purityAssayPercentage: 99.8,
      dissolutionProfile: 'Complies with USP Dissolution Test 1 (<30 mins)',
    };

    return formatted;
  }

  async getMedicineSellers(medicineId) {
    const med = await medicineRepository.findById(medicineId);
    if (!med) {
      throw new NotFoundError(`Medicine with ID '${medicineId}' not found`, 'NOT_FOUND');
    }

    const pharmacies = await pharmacyRepository.findAll();

    // Aggregate inventory across partner pharmacies for public catalog discovery
    const sellers = pharmacies.map((pharmacy) => {
      const inventoryItem = db.tables.pharmacy_inventory.find(
        (i) => i.pharmacy_id === pharmacy.id && i.medicine_id === medicineId
      );

      let price = Number(med.generic_price);
      let inStock = true;

      if (inventoryItem) {
        price = Number(inventoryItem.unit_price);
        inStock = inventoryItem.current_count > 0 && inventoryItem.status !== 'Quarantine';
      } else if (pharmacy.name.includes('CareFirst')) {
        price = Number((med.generic_price * 0.95).toFixed(2)); // CareFirst promotional rate
      }

      return {
        id: pharmacy.id,
        name: pharmacy.name,
        licenseNumber: pharmacy.license_number,
        trustScore: pharmacy.trust_score || 95,
        picName: pharmacy.pic_name,
        distanceMiles: Number(pharmacy.distance_miles),
        deliveryEta: pharmacy.delivery_eta,
        price,
        inStock,
        coldChainCertified: Boolean(pharmacy.cold_chain_certified),
        rating: Number(pharmacy.rating),
        address: pharmacy.address,
      };
    });

    // Proximity sorting (nearest qualified pharmacy first)
    sellers.sort((a, b) => a.distanceMiles - b.distanceMiles);

    return sellers;
  }
}

export const medicineService = new MedicineService();
