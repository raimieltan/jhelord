import { Request, Response } from 'express';
import * as BookingService from '../services/BookingServices';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const booking = await BookingService.createBooking(req.body);
        res.status(201).json(booking);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await BookingService.getAllBookings();
        res.json(bookings);
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const booking = await BookingService.getBookingById(parseInt(req.params.id));
        if (booking) {
            res.json(booking);
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBooking = async (req: Request, res: Response) => {
    try {
        const updatedBooking = await BookingService.updateBooking(parseInt(req.params.id), req.body);
        res.json(updatedBooking);
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteBooking = async (req: Request, res: Response) => {
    try {
        await BookingService.deleteBooking(parseInt(req.params.id));
        res.status(204).send();
    } catch (error:any) {
        res.status(500).json({ message: error.message });
    }
};


export const changeBookingStatus = async (req: Request, res: Response) => {
    try {
        const bookingId = parseInt(req.params.id);
        const { status } = req.body;
        const updatedBooking = await BookingService.updateBookingStatus(bookingId, status);
        res.json(updatedBooking);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
