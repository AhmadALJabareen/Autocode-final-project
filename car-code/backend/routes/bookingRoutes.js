const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { bookingCreateSchema } = require('../validations/bookingValidation');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const isMechanic = require('../middlewares/isMechanic');


router.post('/book', auth, validate(bookingCreateSchema), bookingController.createBooking);



router.get('/my', auth, isMechanic, bookingController.getMyBookings);


router.post('/accept/:bookingId', auth, isMechanic, bookingController.acceptBooking);


router.post('/reject/:bookingId', auth, isMechanic, bookingController.rejectBooking);


router.get('/my-user', auth, bookingController.getMyUserBookings);




router.post('/cancel/:bookingId', auth, bookingController.cancelBooking);


router.post('/complete/:bookingId', auth, bookingController.completeBooking);




module.exports = router;