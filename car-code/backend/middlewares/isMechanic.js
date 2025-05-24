// module.exports = (req, res, next) => {
//     if (req.user && req.user.role === 'mechanic') {
//       next();
//     } else {
//       res.status(403).json({ message: 'يجب أن تكون ميكانيكي للوصول لهذه الميزة' });
//     }
//   };




const Mechanic = require('../models/Mechanic');

module.exports = async (req, res, next) => {
  const mechanic = await Mechanic.findOne({ user: req.user.id });
  if (!mechanic) {
    return res.status(403).json({ message: 'يجب أن تكون ميكانيكيًا' });
  }
  req.mechanic = mechanic;
  next();
};