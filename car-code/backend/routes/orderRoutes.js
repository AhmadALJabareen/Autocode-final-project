const express = require('express');
const router = express.Router();
const axios = require('axios');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const authMiddleware = require('../middlewares/auth');

// توليد PayPal Access Token
async function generatePayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  try {
    const response = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        },
      }
    );
    console.log('Generated PayPal Access Token:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating PayPal Access Token:', error.response?.data || error.message);
    throw error;
  }
}


router.post('/create-paypal-order', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate('items.partId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'السلة فارغة' });
    }

    const totalAmount = cart.items.reduce(
      (total, item) => total + item.partId.price * item.quantity,
      0
    );

    const orderItems = cart.items.map((item) => ({
      partId: item.partId._id,
      quantity: item.quantity,
      price: item.partId.price,
    }));

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      paymentStatus: 'pending',
    });
    await order.save();

    const accessToken = await generatePayPalAccessToken();
    const paypalResponse = await axios.post(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: totalAmount.toFixed(2),
            },
            description: 'شراء قطع غيار',
          },
        ],
        application_context: {
          return_url: 'http://localhost:4000/api/orders/success',
          cancel_url: 'http://localhost:4000/api/orders/cancel',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          brand_name: 'Car Parts Store',
          locale: 'en-US',
        },
        payment_source: {
          paypal: {},
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('Created PayPal Order:', paypalResponse.data);

    order.paypalOrderId = paypalResponse.data.id;
    await order.save();

    res.status(200).json({ paypalOrderId: paypalResponse.data.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error.response?.data || error.message);
    res.status(500).json({ message: 'خطأ في إنشاء الطلب', details: error.response?.data || error.message });
  }
});


router.get('/get-paypal-order/:orderId', authMiddleware, async (req, res) => {
  const { orderId } = req.params;

  try {
    const accessToken = await generatePayPalAccessToken();
    const orderDetails = await axios.get(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Fetched PayPal Order Details:', orderDetails.data);
    res.status(200).json(orderDetails.data);
  } catch (error) {
    console.error('Error fetching PayPal order:', error.response?.data || error.message);
    res.status(500).json({ message: 'خطأ في جلب تفاصيل الطلب', details: error.response?.data || error.message });
  }
});


router.get('/success', async (req, res) => {
  const { token } = req.query; // PayPal بيرجّع orderId كـ token

  if (!token) {
    console.error('No token provided in success callback');
    return res.redirect('http://localhost:5173/cart');
  }

  try {
    const accessToken = await generatePayPalAccessToken();
    console.log('Attempting to capture PayPal order:', token);

    
    const orderStatus = await axios.get(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Order status before capture:', orderStatus.data);

    if (orderStatus.data.status !== 'APPROVED') {
      console.error('Order is not in APPROVED state:', orderStatus.data.status);
      return res.redirect('http://localhost:5173/cart');
    }

    const paypalResponse = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${token}/capture`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log('Captured PayPal Order:', paypalResponse.data);

    const order = await Order.findOne({ paypalOrderId: token, paymentStatus: 'pending' });
    if (!order) {
      console.error('Order not found for paypalOrderId:', token);
      return res.redirect('http://localhost:5173/cart');
    }

    order.paymentStatus = paypalResponse.data.status === 'COMPLETED' ? 'completed' : 'failed';
    await order.save();

    if (paypalResponse.data.status === 'COMPLETED') {
      await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });
    }

   
    res.redirect('http://localhost:5173/success');
  } catch (error) {
    console.error('Error capturing PayPal order in success callback:', error.response?.data || error.message);
    res.redirect('http://localhost:5173/spare-parts');
  }
});


router.get('/cancel', (req, res) => {
  console.log('Payment cancelled');
  res.redirect('http://localhost:5173/spare-parts');
});

module.exports = router;