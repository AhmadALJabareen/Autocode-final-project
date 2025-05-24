const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middlewares/auth');
const partController = require('../controllers/partController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/my', auth, partController.getMyParts);
router.post('/', auth, upload.single('image'), partController.createPart);
router.get('/approved', partController.getApprovedParts);

module.exports = router;