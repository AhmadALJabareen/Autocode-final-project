const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');
const auth = require('../middlewares/auth');
const isMechanic = require('../middlewares/isMechanic');

router.get('/me', auth, isMechanic, mechanicController.getMechanicProfile);
router.put('/me', auth, isMechanic, mechanicController.updateMechanicProfile);
router.get('/earnings', auth, isMechanic, mechanicController.getMechanicEarnings);
router.get('/', mechanicController.getAllMechanics);

module.exports = router;