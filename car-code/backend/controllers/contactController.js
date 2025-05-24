const ContactMessage = require('../models/ContactMessage');

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

   
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'الاسم، البريد الإلكتروني، والرسالة مطلوبة' });
    }

    
    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message,
    });
  
    const io = req.app.get('io');
    io.to('adminRoom').emit('newContactMessage', {
      id: contactMessage._id,
      name,
      email,
      message: message.substring(0, 50) + '...',
      createdAt: contactMessage.createdAt,
    });
    
    res.status(201).json({ message: 'تم إرسال الرسالة بنجاح', contactMessage });
  } catch (error) {
    console.error('خطأ في نموذج التواصل:', error.message);
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};