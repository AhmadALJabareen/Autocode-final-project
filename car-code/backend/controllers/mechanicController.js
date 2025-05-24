const Mechanic = require('../models/Mechanic');
const User = require('../models/User');
const Booking = require('../models/Booking');
const multer = require('multer');
const path = require('path');


exports.getMechanicEarnings = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user.id });
    if (!mechanic) {
      return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });
    }

    const bookings = await Booking.find({
      mechanic: mechanic._id,
      status: 'completed',
    }).populate('user', 'name');

    const earnings = bookings.map(booking => ({
      date: booking.completedAt,
      customer: booking.user.name,
      service: booking.serviceType === 'home' ? 'خدمة منزلية' : 'ورشة',
      amount: booking.payment?.amount || 0,
      paymentMethod: booking.payment?.method || 'غير محدد',
    }));

    const totalRevenue = earnings.reduce((sum, e) => sum + e.amount, 0);

    res.json({ earnings, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب الإيرادات', error: err.message });
  }
};


exports.getAllMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find()
      .populate('user', 'name phone email location image')
      .select('user workshopName specializations experienceYears pricing ratings available');
    res.json(mechanics);
  } catch (error) {
    console.error('Get All Mechanics Error:', error.message);
    res.status(500).json({ message: 'خطأ في جلب الميكانيكيين', error: error.message });
  }
};











const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

exports.updateMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user.id });
    if (!mechanic) {
      return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });
    }

    const { workshopName, workSchedule, user: userUpdates } = req.body;

    if (workshopName) mechanic.workshopName = workshopName;
    if (workSchedule) mechanic.workSchedule = workSchedule;

    await mechanic.save();

    
    const updateData = {};
    if (userUpdates) {
      const { name, email, phone, location } = userUpdates;
      updateData.name = name;
      updateData.email = email;
      updateData.phone = phone;
      updateData.location = location;
    }
    if (req.file) {
      updateData.image = `/Uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({ message: 'تم تحديث الملف الشخصي بنجاح', mechanic, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في تحديث الملف الشخصي', error: err.message });
  }
};


exports.updateMechanicProfile = [upload.single('image'), exports.updateMechanicProfile];


exports.getMechanicProfile = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user.id })
      .populate('user', 'name email phone location image') 
      .populate({
        path: 'ratings.user',
        select: 'name',
      });
    if (!mechanic) {
      return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });
    }

    const completedBookings = await Booking.find({
      mechanic: mechanic._id,
      status: 'completed',
    });
    const revenue = completedBookings.reduce((sum, booking) => sum + (booking.payment?.amount || 0), 0);

    res.json({
      mechanic: {
        id: mechanic._id,
        user: mechanic.user,
        workshopName: mechanic.workshopName,
        workSchedule: mechanic.workSchedule,
        ratings: mechanic.ratings,
        revenue,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب بيانات الميكانيكي', error: err.message });
  }
};