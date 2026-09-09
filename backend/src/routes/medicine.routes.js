import { Router } from 'express';
import { medicineController } from '../controllers/medicine.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  medicineQuerySchema,
  medicineIdParamSchema,
} from '../validators/medicine.validator.js';

const router = Router();

/**
 * @route GET /api/v1/medicines
 * @desc Search and browse catalog by query string or therapeutic category
 * @access Public
 */
router.get('/', validate(medicineQuerySchema, 'query'), (req, res, next) =>
  medicineController.getAll(req, res, next)
);

/**
 * @route GET /api/v1/medicines/:id
 * @desc Retrieve AB-rated bioequivalent monograph, salt parity, and dosage rules
 * @access Public
 */
router.get('/:id', validate(medicineIdParamSchema, 'params'), (req, res, next) =>
  medicineController.getById(req, res, next)
);

/**
 * @route GET /api/v1/medicines/:id/sellers
 * @desc Multi-seller live inventory aggregation with pricing, distance, and stock
 * @access Public
 */
router.get('/:id/sellers', validate(medicineIdParamSchema, 'params'), (req, res, next) =>
  medicineController.getSellers(req, res, next)
);

export default router;
