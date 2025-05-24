const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');
const { createSlotSchema } = require('../validations/slotValidation');
const validate = require('../middlewares/validate');
const auth = require('../middlewares/auth');
const isMechanic = require('../middlewares/isMechanic');


router.post('/add', auth, isMechanic, validate(createSlotSchema), slotController.addSlot);


router.delete('/remove/:slotId', auth, isMechanic, slotController.removeSlot);


router.get('/mechanic/:mechanicId', slotController.getMechanicSlots);

module.exports = router;