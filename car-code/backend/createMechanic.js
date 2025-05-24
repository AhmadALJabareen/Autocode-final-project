const mongoose = require('mongoose');
const Mechanic = require('./models/Mechanic');

mongoose.connect('mongodb+srv://ahmad:ahmad1234@clustertest.fwynm.mongodb.net/carApp?retryWrites=true&w=majority&appName=ClusterTest')
  .then(async () => {
    await Mechanic.create({
      user: new mongoose.Types.ObjectId('68027d039dcd659f3748d141'),
      workshopName: 'ورشة أنس',
      workSchedule: [
        { day: 'الأحد', from: '09:00', to: '18:00' },
        { day: 'الإثنين', from: '09:00', to: '18:00' },
        { day: 'الثلاثاء', from: '09:00', to: '18:00' },
        { day: 'الأربعاء', from: '09:00', to: '18:00' },
        { day: 'الخميس', from: '09:00', to: '18:00' }
      ],
      bookings: [],
      ratings: []
    });
    console.log('Mechanic created successfully');
    mongoose.connection.close();
  })
  .catch(err => console.error('Error:', err));
  