const Booking = require('../models/Booking');
const Mechanic = require('../models/Mechanic');
const User = require('../models/User');
const AvailableSlot = require('../models/AvailableSlot');





exports.createBooking = async (req, res) => {
    try {
      const userId = req.user.id;
      const { mechanicId, serviceType, location, date, time, notes, slotId } = req.body;
  
      let assignedMechanic = null;
      let bookingDate = date;
      let bookingTime = time;
  
      if (mechanicId) {
        const mechanic = await Mechanic.findById(mechanicId);
        if (!mechanic) return res.status(404).json({ message: 'الميكانيكي غير موجود' });
        assignedMechanic = mechanic._id;
      }
  
      let slot = null;
      if (slotId) {
        slot = await AvailableSlot.findOne({ _id: slotId, isBooked: false });
        if (!slot) return res.status(400).json({ message: 'الموعد غير متاح' });
  
        bookingDate = slot.date;
        bookingTime = slot.time;
        assignedMechanic = slot.mechanic;
      }
  
      const booking = await Booking.create({
        user: userId,
        mechanic: assignedMechanic,
        serviceType,
        location,
        date: bookingDate,
        time: bookingTime,
        status: 'pending',
        notes,
        payment: { paid: false }
      });
  
      await User.findByIdAndUpdate(userId, { $push: { bookings: booking._id } });
  
      if (assignedMechanic) {
        await Mechanic.findByIdAndUpdate(assignedMechanic, { $push: { bookings: booking._id } });
      }
  
      if (slot) {
        slot.isBooked = true;
        await slot.save();
      }
  
      if (assignedMechanic) {
        const user = await User.findById(userId);
        const mechanic = await Mechanic.findById(assignedMechanic);
        const io = req.app.get('io');
        const notification = {
          _id: new Date().toISOString(), 
          message: `حجز جديد من ${user.name} لخدمة ${serviceType === 'home' ? 'منزلية' : 'ورشة'}`,
          type: 'new_booking',
          booking: booking._id,
          createdAt: new Date(),
          read: false
        };
        console.log('Emitting notification to user:', mechanic.user._id.toString());
        io.to(mechanic.user._id.toString()).emit('notification', notification);
      }
  
      res.status(201).json({
        message: 'تم حجز الموعد بنجاح! في انتظار موافقة الميكانيكي',
        booking
      });
  
    } catch (err) {
      console.error('Error in createBooking:', err);
      res.status(500).json({ message: 'حدث خطأ أثناء الحجز', error: err.message });
    }
};


exports.getMyBookings = async (req, res) => {
    try {
     
      const mechanic = await Mechanic.findOne({ user: req.user.id });
      if (!mechanic) return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });
  
      
      const bookings = await Booking.find({ mechanic: mechanic._id })
        .populate('user', 'name phone')
        .sort({ date: 1, time: 1 });
  
      res.json({ bookings });
    } catch (err) {
      res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات', error: err.message });
    }
  };
  

  exports.getMyUserBookings = async (req, res) => {
    try {
     
      const userId = req.user.id;
  
      
      const bookings = await Booking.find({ user: userId })
        .populate({
          path: 'mechanic',
          populate: { path: 'user', select: 'name phone email' } 
        })
        .sort({ date: -1, time: -1 }); 
  
      res.json({ bookings });
    } catch (err) {
      res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات', error: err.message });
    }
  };


  
  
  exports.cancelBooking = async (req, res) => {
    try {
      const userId = req.user.id;
      const booking = await Booking.findOne({ _id: req.params.bookingId, user: userId });
  
      if (!booking) {
        return res.status(404).json({ message: 'الحجز غير موجود أو لا يخصك' });
      }
  
      
      if (booking.status !== 'pending' && booking.status !== 'accepted') {
        return res.status(400).json({ message: 'لا يمكن إلغاء هذا الحجز' });
      }
  
      booking.status = 'cancelled';
      await booking.save();
  
      
      if (booking.slotId) {
        await AvailableSlot.findByIdAndUpdate(booking.slotId, { isBooked: false });
      }
  
      res.json({ message: 'تم إلغاء الحجز بنجاح', booking });
    } catch (err) {
      res.status(500).json({ message: 'حدث خطأ أثناء إلغاء الحجز', error: err.message });
    }
  };
  
  
  exports.completeBooking = async (req, res) => {
    try {
      const bookingId = req.params.bookingId;
      const userId = req.user.id;
  
    
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'الحجز غير موجود' });
      }
  
     
      const mechanic = await Mechanic.findOne({ user: userId });
      if (booking.user.toString() !== userId && (!mechanic || booking.mechanic.toString() !== mechanic._id.toString())) {
        return res.status(403).json({ message: 'لا تملك صلاحية إنهاء هذا الحجز' });
      }
  
    
      if (booking.status !== 'accepted') {
        return res.status(400).json({ message: 'لا يمكن إنهاء حجز غير مقبول' });
      }
  
      booking.status = 'completed';
      booking.completedAt = new Date();
      await booking.save();
  
      res.json({ message: 'تم إنهاء الحجز بنجاح', booking });
    } catch (err) {
      res.status(500).json({ message: 'حدث خطأ أثناء إنهاء الحجز', error: err.message });
    }
  };










 
exports.acceptBooking = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user.id });
    if (!mechanic) return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });

    const booking = await Booking.findOne({ _id: req.params.bookingId, mechanic: mechanic._id })
      .populate('user', 'name')
      .populate('mechanic', 'workshopName');
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود أو لا يخصك' });

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'لا يمكن قبول حجز غير معلق' });
    }

    booking.status = 'accepted';
    await booking.save();

   
    await Notification.create({
      user: booking.user._id,
      message: `تم قبول حجزك مع ${booking.mechanic.workshopName} في ${booking.date.toISOString().split('T')[0]} الساعة ${booking.time}`,
      type: 'booking_accepted',
      booking: booking._id
    });

    res.json({ message: 'تم قبول الحجز بنجاح', booking });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء قبول الحجز', error: err.message });
  }
};


exports.rejectBooking = async (req, res) => {
  try {
    const mechanic = await Mechanic.findOne({ user: req.user.id });
    if (!mechanic) return res.status(404).json({ message: 'حساب الميكانيكي غير موجود' });

    const booking = await Booking.findOne({ _id: req.params.bookingId, mechanic: mechanic._id })
      .populate('user', 'name')
      .populate('mechanic', 'workshopName');
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود أو لا يخصك' });

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'لا يمكن رفض حجز غير معلق' });
    }

    booking.status = 'rejected';
    await booking.save();

   
    if (booking.slotId) {
      await AvailableSlot.findByIdAndUpdate(booking.slotId, { isBooked: false });
    }


    await Notification.create({
      user: booking.user._id,
      message: `تم رفض حجزك مع ${booking.mechanic.workshopName}`,
      type: 'booking_rejected',
      booking: booking._id
    });

    res.json({ message: 'تم رفض الحجز بنجاح', booking });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء رفض الحجز', error: err.message });
  }
};