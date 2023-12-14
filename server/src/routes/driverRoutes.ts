import express from 'express';
import * as DriverController from '../controllers/DriverController';

const router = express.Router();

router.post('/', DriverController.createDriver);
router.get('/', DriverController.getAllDrivers);
router.get('/:id', DriverController.getDriverById);
router.put('/:id', DriverController.updateDriver);
router.delete('/:id', DriverController.deleteDriver);

export default router;
