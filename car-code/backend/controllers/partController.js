const Part = require('../models/Part');

exports.getMyParts = async (req, res) => {
  try {
    const parts = await Part.find({ user: req.user.id });
    res.json({ parts });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في جلب قطع الغيار', error: err.message });
  }
};

exports.createPart = async (req, res) => {
  try {
    const { name, price, specifications, carModel, condition } = req.body;
    const part = await Part.create({
      user: req.user.id,
      name,
      price,
      specifications,
      carModel,
      condition,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    
    const io = req.app.get('io');
    io.to('adminRoom').emit('newPart', {
      id: part._id,
      name,
      price,
      createdAt: part.createdAt,
    });
    res.status(201).json({ message: 'تم إضافة قطعة الغيار', part });
  } catch (err) {
    res.status(500).json({ message: 'خطأ في إنشاء القطعة', error: err.message });
  }
};


// Get all approved parts for shop
exports.getApprovedParts = async (req, res) => {
  try {
    const parts = await Part.find({ state: 'approved',isDeleted: false })
      .populate('user', 'name email')
      .select('name price image description carModel user condition');
    res.json({ parts });
  } catch (error) {
    console.error('Error fetching approved parts:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};