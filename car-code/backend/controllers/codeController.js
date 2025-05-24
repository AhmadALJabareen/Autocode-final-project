const Code = require('../models/Code');
const User = require('../models/User');
const Part = require('../models/Part');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.searchCode = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    
    const now = new Date();
    const isSubscribed = user.subscription.type !== 'free' && user.subscription.expiresAt > now;
    const freeSearchesUsed = user.freeSearchCount >= 3;

    if (!isSubscribed && freeSearchesUsed) {
      return res.status(403).json({ 
        message: 'لقد استنفدت بحثاتك المجانية. يرجى الاشتراك لمتابعة البحث.',
        action: 'subscribe'
      });
    }

    
    const codeDoc = await Code.findOne({ code: code.toUpperCase() }).populate('suggestedParts');
    if (!codeDoc) {
      return res.status(404).json({ message: 'الكود غير موجود في قاعدة البيانات' });
    }

    if (req.user && req.user.id) {
      await User.findByIdAndUpdate(req.user.id, {
        $addToSet: { searchHistory: code.toUpperCase() },
        ...(user.subscription.type === 'free' && { $inc: { freeSearchCount: 1 } })
      });
    }

   
    res.json({
      code: codeDoc.code,
      problem: codeDoc.problem,
      solution: codeDoc.solution,
      suggestedParts: codeDoc.suggestedParts.map(part => ({
        id: part._id,
        name: part.name,
        price: part.price,
        condition: part.condition,
        available: part.available,
      }))
    });

  } catch (err) {
    console.error('Search Error:', err.message);
    res.status(500).json({ message: 'خطأ في البحث', error: err.message });
  }
};

exports.getErrorCodeHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('searchHistory');
    if (!user || !user.searchHistory || user.searchHistory.length === 0) {
      return res.status(200).json({ errorCodes: [] });
    }

    const errorCodes = await Code.find({ code: { $in: user.searchHistory } }).populate('suggestedParts');

    const formattedErrorCodes = errorCodes.map(code => ({
      _id: code._id,
      code: code.code,
      description: code.problem,
      createdAt: code.createdAt,
      solution: code.solution,
      suggestedParts: code.suggestedParts.map(part => ({
        id: part._id,
        name: part.name,
        price: part.price,
        condition: part.condition,
        available: part.available
      }))
    }));

    res.status(200).json({ errorCodes: formattedErrorCodes });
  } catch (error) {
    console.error('Get Error Code History Error:', error.message);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب السجل' });
  }
};


exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan } = req.body; // 'monthly' أو 'yearly'
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

   
    if (user.subscription.type !== 'free' && user.subscription.expiresAt > new Date()) {
      return res.status(400).json({ message: 'لديك اشتراك ساري بالفعل' });
    }

    
    const prices = {
      monthly: process.env.STRIPE_MONTHLY_PRICE_ID,
      yearly: process.env.STRIPE_YEARLY_PRICE_ID
    };

    if (!prices[plan]) {
      return res.status(400).json({ message: 'خطة غير صالحة' });
    }

    let stripeCustomerId = user.subscription.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user._id.toString() }
      });
      stripeCustomerId = customer.id;
      await User.findByIdAndUpdate(user._id, {
        'subscription.stripeCustomerId': stripeCustomerId
      });
    }

   
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: prices[plan],
        quantity: 1
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/error-code-search?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/error-code-search?cancelled=true`,
      metadata: { userId: user._id.toString(), plan }
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Checkout Session Error:', err.message);
    res.status(500).json({ message: 'خطأ في إنشاء جلسة الدفع', error: err.message });
  }
};

// Webhook لتحديث حالة الاشتراك بعد الدفع
exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    // تحديث حالة الاشتراك
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + (plan === 'yearly' ? 1 : 0));
    expiresAt.setMonth(expiresAt.getMonth() + (plan === 'monthly' ? 1 : 0));

    await User.findByIdAndUpdate(userId, {
      'subscription.type': plan,
      'subscription.expiresAt': expiresAt,
      'subscription.stripeSubscriptionId': session.subscription
    });

    console.log(`Subscription updated for user ${userId}: ${plan}`);
  }

  res.json({ received: true });
};


exports.getAllCodes = async (req, res) => {
  try {
    const codes = await Code.find().populate('suggestedParts'); 
    res.status(200).json(codes);
  } catch (error) {
    console.error('Error fetching codes:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الأكواد.' });
  }
};