import express from 'express';
import * as UnitController from '../controllers/UnitController';

const router = express.Router();

router.post('/units', UnitController.createUnit);
router.get('/units', UnitController.getAllUnits);
router.get('/units/:id', UnitController.getUnitById);
router.put('/units/:id', UnitController.updateUnit);
router.delete('/units/:id', UnitController.deleteUnit);

export default router;
