const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerSchema, loginSchema } = require('../validations/userValidation');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;