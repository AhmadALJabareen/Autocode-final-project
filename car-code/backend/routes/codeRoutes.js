const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { codeSearchSchema } = require('../validations/codeValidation');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');


router.post('/search', auth, validate(codeSearchSchema), codeController.searchCode);
router.get('/history', auth, codeController.getErrorCodeHistory);
router.post('/checkout', auth, codeController.createCheckoutSession);
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), codeController.handleStripeWebhook);
router.get('/', codeController.getAllCodes);

module.exports = router;