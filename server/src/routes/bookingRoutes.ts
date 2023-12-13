import express from 'express';
import * as BookingController from '../controllers/BookingController';

const router = express.Router();

router.post('/bookings', BookingController.createBooking);
router.get('/bookings', BookingController.getAllBookings);
router.get('/bookings/:id', BookingController.getBookingById);
router.put('/bookings/:id', BookingController.updateBooking);
router.delete('/bookings/:id', BookingController.deleteBooking);

export default router;
