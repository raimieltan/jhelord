import { Request, Response } from 'express';
import * as UnitService from '../services/unitServices';

export const createUnit = async (req: Request, res: Response) => {
    try {
        const unit = await UnitService.createUnit(req.body);
        res.status(201).json(unit);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUnits = async (req: Request, res: Response) => {
    try {
        const units = await UnitService.getAllUnits();
        res.json(units);
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUnitById = async (req: Request, res: Response) => {
    try {
        const unit = await UnitService.getUnitById(parseInt(req.params.id));
        if (unit) {
            res.json(unit);
        } else {
            res.status(404).json({ message: "Unit not found" });
        }
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUnit = async (req: Request, res: Response) => {
    try {
        const updatedUnit = await UnitService.updateUnit(parseInt(req.params.id), req.body);
        res.json(updatedUnit);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUnit = async (req: Request, res: Response) => {
    try {
        await UnitService.deleteUnit(parseInt(req.params.id));
        res.status(204).send();
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};
