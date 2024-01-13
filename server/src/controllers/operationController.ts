import { Request, Response } from 'express'
import { retrieveOperations } from '../services/operationServices'

export const getAllOperations = async (req: Request, res: Response) => {
  const operations = await retrieveOperations()
  return res.json(operations)
}

export const getOperationsById = async (req: Request, res: Response) => {
  const operationId = parseInt(req.params.id);
  const operation = await retrieveOperations(operationId)
  return res.json(operation)
}