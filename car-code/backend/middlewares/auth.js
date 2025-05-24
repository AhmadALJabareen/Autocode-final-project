const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'يجب تسجيل الدخول أولاً' });
  }

  try {
   
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'جلسة غير صالحة أو منتهية' });
  }
}