import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import bookingController from '@/controllers/bookings-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', bookingController.getBooking)
  .post('/', bookingController.createBooking)
  .put('/:bookingId', bookingController.updateBooking);

export { bookingRouter };