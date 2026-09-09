import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import medicineRoutes from './medicine.routes.js';

const router = Router();

// Mount health & monitoring routes
router.use('/health', healthRoutes);

// Mount authentication & identity routes
router.use('/auth', authRoutes);

// Mount catalog & bioequivalent medicine discovery routes
router.use('/medicines', medicineRoutes);

export default router;
