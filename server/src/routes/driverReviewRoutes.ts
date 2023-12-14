import express from 'express';
import * as DriverReviewController from '../controllers/DriverReviewController';

const router = express.Router();

router.post('/', DriverReviewController.addReview);
router.get('/:id', DriverReviewController.getReview);
router.get('/driver/:driverId', DriverReviewController.getReviewsForDriver);
router.put('/:id', DriverReviewController.updateReview);
router.delete('/:id', DriverReviewController.deleteReview);
router.get('/driver/:driverId/average', DriverReviewController.getAverageRating);

export default router;
