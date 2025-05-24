const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get Profile Error:', err.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, location } = req.body;
    const updateData = { name, email, phone, location };

    
    if (req.file) {
      updateData.image = `/Uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json({ message: 'تم تحديث الملف الشخصي', user });
  } catch (err) {
    console.error('Update Profile Error:', err.message);
    res.status(500).json({ message: 'خطأ في الخادم', error: err.message });
  }
};



// إضافة multer كـ middleware لـ updateUserProfile
exports.updateUserProfile = [upload.single('image'), exports.updateUserProfile];