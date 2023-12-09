import { Request, Response } from 'express'
import { retrieveOperations } from '../services/operationServices'

export const getAllOperations = async (req: Request, res: Response) => {
  const operations = await retrieveOperations()
  return res.json(operations)
}