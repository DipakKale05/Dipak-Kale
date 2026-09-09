import { medicineService } from '../services/medicine.service.js';

export class MedicineController {
  async getAll(req, res, next) {
    try {
      const medicines = await medicineService.getAllMedicines(req.query);
      res.status(200).json({
        success: true,
        data: medicines,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const medicine = await medicineService.getMedicineById(req.params.id);
      res.status(200).json({
        success: true,
        data: medicine,
      });
    } catch (err) {
      next(err);
    }
  }

  async getSellers(req, res, next) {
    try {
      const sellers = await medicineService.getMedicineSellers(req.params.id);
      res.status(200).json({
        success: true,
        data: sellers,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const medicineController = new MedicineController();
