import express from 'express';
import { getAllOperations } from '../controllers/operationController';
const operationRouter = express.Router();

operationRouter.get('/', getAllOperations);

export default operationRouter;