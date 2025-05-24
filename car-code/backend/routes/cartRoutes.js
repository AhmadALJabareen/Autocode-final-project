const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const authMiddleware = require('../middlewares/auth'); 


router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { partId, quantity } = req.body;
    const userId = req.user.id; 

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.partId.toString() === partId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ partId, quantity: quantity || 1 });
    }

    await cart.save();
    res.status(200).json({ message: 'تم إضافة العنصر للسلة', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.partId');
    if (!cart) {
      return res.status(404).json({ message: 'السلة غير موجودة' });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});


router.delete('/remove/:partId', authMiddleware, async (req, res) => {
  try {
    const { partId } = req.params;
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'السلة غير موجودة' });
    }

    cart.items = cart.items.filter((item) => item.partId.toString() !== partId);
    await cart.save();
    res.status(200).json({ message: 'تم إزالة العنصر من السلة', cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'خطأ في الخادم' });
  }
});

module.exports = router;