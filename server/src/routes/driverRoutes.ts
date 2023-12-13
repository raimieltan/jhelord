import express from 'express';
import * as DriverController from '../controllers/DriverController';

const router = express.Router();

router.post('/drivers', DriverController.createDriver);
router.get('/drivers', DriverController.getAllDrivers);
router.get('/drivers/:id', DriverController.getDriverById);
router.put('/drivers/:id', DriverController.updateDriver);
router.delete('/drivers/:id', DriverController.deleteDriver);

export default router;
