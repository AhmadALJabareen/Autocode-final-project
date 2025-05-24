const User = require('../models/User');
const Part = require('../models/Part');
const Article = require('../models/Article');
const Mechanic = require('../models/Mechanic');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

// Configure multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Images only (jpeg, jpg, png)!'));
  },
});

// Get admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select('-password');
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Get all mechanics
exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find().populate('user', '-password');
    res.json({ mechanics });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};


exports.getAllParts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', state = '' } = req.query;
    const query = { isDeleted: false }; 

    if (search) {
      query.name = { $regex: search, $options: 'i' }; 
    }
    if (state && ['pending', 'approved', 'rejected'].includes(state)) {
      query.state = state;
    }

    const parts = await Part.find(query)
      .populate('user', '-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Part.countDocuments(query);

    res.json({
      parts,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching parts:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Update part state
exports.updatePartState = async (req, res) => {
  try {
    const { state } = req.body;
    if (!['approved', 'rejected'].includes(state)) {
      return res.status(400).json({ message: 'حالة غير صالحة (مقبول أو مرفوض فقط)' });
    }
    const part = await Part.findById(req.params.id);
    if (!part || part.isDeleted) {
      return res.status(404).json({ message: 'القطعة غير موجودة' });
    }
    part.state = state;
    await part.save();


    res.json({ part });
  } catch (error) {
    console.error('Error updating part state:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Soft delete part
exports.softDeletePart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part || part.isDeleted) {
      return res.status(404).json({ message: 'القطعة غير موجودة' });
    }
    part.isDeleted = true;
    await part.save();
    res.json({ message: 'تم حذف القطعة بنجاح' });
  } catch (error) {
    console.error('Error soft deleting part:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};



// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', '-password')
      .populate('mechanic');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Get stats
exports.getStats = async (req, res) => {
  try {
    // Bookings per month
    const bookings = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: {
            $arrayElemAt: [
              ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
              { $subtract: ['$_id', 1] },
            ],
          },
          عدد: '$count',
        },
      },
    ]);

    // Revenue (assuming price is from mechanic's pricing)
    const revenue = await Booking.aggregate([
      {
        $lookup: {
          from: 'mechanics',
          localField: 'mechanic',
          foreignField: '_id',
          as: 'mechanic',
        },
      },
      { $unwind: '$mechanic' },
      {
        $group: {
          _id: { $month: '$date' },
          total: {
            $sum: {
              $cond: [
                { $eq: ['$serviceType', 'home'] },
                '$mechanic.pricing.homeService',
                '$mechanic.pricing.workshopService',
              ],
            },
          },
        },
      },
      {
        $project: {
          name: {
            $arrayElemAt: [
              ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
              { $subtract: ['$_id', 1] },
            ],
          },
          إيراد: '$total',
        },
      },
    ]);

    // User types
    const userTypes = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: {
            $cond: [
              { $eq: ['$_id', 'user'] },
              'عملاء',
              { $cond: [{ $eq: ['$_id', 'mechanic'] }, 'ميكانيكيين', 'مشرفين'] },
            ],
          },
          قيمة: '$count',
        },
      },
    ]);

    res.json({ bookings, revenue, userTypes });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'كلمة المرور الحالية والجديدة مطلوبة' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
      }
  
      // Find admin
      const admin = await User.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: 'المستخدم غير موجود' });
      }
  
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });
      }
  
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update password
      admin.password = hashedPassword;
      await admin.save();
  
      res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
      console.error('Change Password Error:', error.message);
      res.status(500).json({ message: 'خطأ في السيرفر', error: error.message });
    }
  };

// Upload profile picture
exports.uploadProfilePic = async (req, res) => {
  try {
    const updateData = {};
    if (req.file) {
      updateData.image = `/Uploads/${req.file.filename}`;
    }

    const admin = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
console.log(admin)
    if (!admin) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    res.json({ message: 'تم تحديث الصورة الشخصية', admin });
  } catch (err) {
    console.error('Upload Profile Pic Error:', err.message);
    res.status(500).json({ message: 'خطأ في السيرفر', error: err.message });
  }
};




const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});



exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};


exports.replyToContactMessage = async (req, res) => {
  try {
    const { messageId, reply } = req.body;
    const contactMessage = await ContactMessage.findById(messageId);
    if (!contactMessage) {
      return res.status(404).json({ message: 'الرسالة غير موجودة' });
    }

    // إرسال الرد بالإيميل
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactMessage.email,
      subject: 'رد على استفسارك - أكواد أعطال السيارات',
      text: `مرحباً ${contactMessage.name},\n\nشكراً لتواصلك معنا. إليك ردنا على استفسارك:\n\n${reply}\n\nتحياتنا,\nفريق أكواد أعطال السيارات`,
    };

    await transporter.sendMail(mailOptions);

    // تحديث حالة الرسالة والرد
    contactMessage.status = 'replied';
    contactMessage.reply = reply;
    await contactMessage.save();

    res.json({ message: 'تم إرسال الرد بنجاح' });
  } catch (error) {
    console.error('خطأ في الرد:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};



exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json({ articles });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};


exports.addArticle = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'العنوان والمحتوى مطلوبان' });
    }

    const article = await Article.create({
      title,
      content,
      image,
      author: req.admin ? req.admin.name : 'Admin', 
    });

    res.status(201).json({ message: 'تم إضافة المقال بنجاح', article });
  } catch (error) {
    console.error('خطأ في إضافة المقال:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};


exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'المقال غير موجود' });
    }
    res.json({ article });
  } catch (error) {
    console.error('خطأ في جلب المقال:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};


// Add multer middleware to uploadProfilePic
exports.uploadProfilePic = [upload.single('profilePic'), exports.uploadProfilePic];