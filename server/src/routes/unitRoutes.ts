import express from 'express';
import * as UnitController from '../controllers/UnitController';

const router = express.Router();

router.post('/', UnitController.createUnit);
router.get('/', UnitController.getAllUnits);
router.get('/:id', UnitController.getUnitById);
router.put('/:id', UnitController.updateUnit);
router.delete('/:id', UnitController.deleteUnit);
// In routes/unitRoutes.ts

router.patch('/:id/location', UnitController.updateUnitLocation);

export default router;
