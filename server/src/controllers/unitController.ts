import { Request, Response } from 'express'
import { retrieveUnits } from '../services/unitServices'

export const getAllUnits = async (req: Request, res: Response) => {
  const units = await retrieveUnits();
  return res.json(units)
}

export const getUnitById = async (req: Request, res: Response) => {
  const unitId = parseInt(req.params.id);
  const units = await retrieveUnits(unitId);

  console.log("UNITS: ", units);

  return res.json(units);
}