const AvailableSlot = require('../models/AvailableSlot');
const Mechanic = require('../models/Mechanic');


exports.addSlot = async (req, res) => {
  try {
    
    const mechanic = await Mechanic.findOne({ user: req.user.id });
    if (!mechanic) return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });

    
    const exists = await AvailableSlot.findOne({
      mechanic: mechanic._id,
      date: req.body.date,
      time: req.body.time
    });
    if (exists) return res.status(400).json({ message: 'هذا الموعد مسجل مسبقًا' });

    const slot = await AvailableSlot.create({
      mechanic: mechanic._id,
      date: req.body.date,
      time: req.body.time
    });

    res.status(201).json({ message: 'تم إضافة الموعد بنجاح', slot });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء إضافة الموعد', error: err.message });
  }
};


exports.removeSlot = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user.id });
    if (!mechanic) return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });

    const slot = await AvailableSlot.findOneAndDelete({
      _id: req.params.slotId,
      mechanic: mechanic._id,
      isBooked: false
    });

    if (!slot) return res.status(404).json({ message: 'الموعد غير موجود أو محجوز بالفعل' });

    res.json({ message: 'تم حذف الموعد بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'خطأ أثناء حذف الموعد', error: err.message });
  }
};



exports.getMechanicSlots = async (req, res) => {
  try {
    const { mechanicId } = req.params;
    const slots = await AvailableSlot.find({
      mechanic: mechanicId,
      isBooked: false,
    }).sort({ date: 1, time: 1 });
    res.json({ slots });
  } catch (error) {
    console.error('Get Mechanic Slots Error:', error.message);
    res.status(500).json({ message: 'خطأ أثناء جلب المواعيد', error: error.message });
  }
};