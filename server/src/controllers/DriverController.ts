import { Request, Response } from 'express';
import * as DriverService from '../services/DriverServices';

export const createDriver = async (req: Request, res: Response) => {
    try {
        const driver = await DriverService.createDriver(req.body);
        res.status(201).json(driver);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllDrivers = async (req: Request, res: Response) => {
    try {
        const drivers = await DriverService.getAllDrivers();
        res.json(drivers);
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDriverById = async (req: Request, res: Response) => {
    try {
        const driver = await DriverService.getDriverById(parseInt(req.params.id));
        if (driver) {
            res.json(driver);
        } else {
            res.status(404).json({ message: "Driver not found" });
        }
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDriver = async (req: Request, res: Response) => {
    try {
        const updatedDriver = await DriverService.updateDriver(parseInt(req.params.id), req.body);
        res.json(updatedDriver);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteDriver = async (req: Request, res: Response) => {
    try {
        await DriverService.deleteDriver(parseInt(req.params.id));
        res.status(204).send();
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};
