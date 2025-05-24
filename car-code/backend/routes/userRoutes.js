const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.get('/me', auth, userController.getUserProfile);
router.put('/me', auth, userController.updateUserProfile);

module.exports = router;