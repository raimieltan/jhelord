import express from 'express';
import { getAllUnits, getUnitById } from '../controllers/unitController';
const unitRouter = express.Router();

unitRouter.get('/', getAllUnits)
unitRouter.get('/:id', getUnitById)

export default unitRouter;