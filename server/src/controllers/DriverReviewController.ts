import { Request, Response } from 'express';
import * as DriverReviewService from '../services/DriverReviewServices';

export const addReview = async (req: Request, res: Response) => {
    try {
        const review = await DriverReviewService.createReview(req.body);
        res.status(201).json(review);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getReview = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const review = await DriverReviewService.getReviewById(id);
        res.json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getReviewsForDriver = async (req: Request, res: Response) => {
    try {
        const driverId = parseInt(req.params.driverId);
        if (isNaN(driverId)) {
            return res.status(400).json({ message: "Invalid driver ID" });
        }
        const reviews = await DriverReviewService.getReviewsByDriverId(driverId);
        res.json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};



export const updateReview = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedReview = await DriverReviewService.updateReview(id, req.body);
        res.json(updatedReview);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await DriverReviewService.deleteReview(id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAverageRating = async (req: Request, res: Response) => {
    try {
        const driverId = parseInt(req.params.driverId);
        const averageRating = await DriverReviewService.calculateAverageRating(driverId);
        res.json({ averageRating: averageRating || 0 });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
