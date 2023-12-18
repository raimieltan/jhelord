import express from 'express';
import * as BookingController from '../controllers/BookingController';

const router = express.Router();

router.post('/', BookingController.createBooking);
router.get('/', BookingController.getAllBookings);
router.get('/:id', BookingController.getBookingById);
router.get('/user/:id', BookingController.getBookingByUserId);
router.get('/driver/:id', BookingController.getBookingByDriverId);
router.put('/:id', BookingController.updateBooking);
router.delete('/:id', BookingController.deleteBooking);
router.patch('/:id/status', BookingController.changeBookingStatus);

export default router;
