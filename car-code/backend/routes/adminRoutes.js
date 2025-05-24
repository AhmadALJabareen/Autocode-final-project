const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'الوصول ممنوع: للمشرفين فقط' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Admin routes
router.get('/me', auth, adminAuth, adminController.getAdminProfile);
router.get('/users',adminController.getAllUsers);
router.get('/mechanics', adminController.getAllMechanics);



router.get('/parts',  adminController.getAllParts);
router.put('/parts/:id', auth, adminAuth, adminController.updatePartState);
router.delete('/parts/:id/soft-delete', auth, adminAuth, adminController.softDeletePart);

router.get('/bookings', auth, adminAuth, adminController.getAllBookings);
router.get('/stats', auth, adminAuth, adminController.getStats);
router.post('/change-password', auth, adminAuth, adminController.changePassword);
router.post('/profile-pic', auth, adminAuth, adminController.uploadProfilePic);
router.get('/contact-messages', auth, adminAuth, adminController.getAllContactMessages);
router.post('/contact-messages/reply', auth, adminAuth, adminController.replyToContactMessage);
router.get('/articles',  adminController.getAllArticles);
router.post('/articles', auth, adminAuth, adminController.addArticle);
router.get('/articles/:id',  adminController.getArticleById);

module.exports = router;