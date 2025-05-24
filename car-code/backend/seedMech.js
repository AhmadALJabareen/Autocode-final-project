const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Mechanic = require('./models/Mechanic');
const AvailableSlot = require('./models/AvailableSlot');
const connectDB = require('./config/db');

const seedMechanics = async () => {
  try {
    await connectDB();
    // Uncomment to clear existing data
    await User.deleteMany({ role: 'mechanic' });
    await Mechanic.deleteMany({});
    await AvailableSlot.deleteMany({});

    // Seed Users (4 mechanics)
    const users = [
      {
        name: 'كريم محمد',
        email: 'karem@gmail.com',
        password: await bcrypt.hash('123456', 10),
        phone: '0791234567',
        location: 'عمان',
        image: '/Uploads/kareem.png',
        role: 'mechanic',
      },
      {
        name: 'أحمد خالد',
        email: 'ahmadkh@gmail.com',
        password: await bcrypt.hash('123456', 10),
        phone: '0782345678',
        location: 'إربد',
        image: '/Uploads/ahmad.jpg',
        role: 'mechanic',
      },
      {
        name: 'محمود علي',
        email: 'mahmoud@gmail.com',
        password: await bcrypt.hash('123456', 10),
        phone: '0773456789',
        location: 'الزرقاء',
        image: '/Uploads/mahmoud.jpg',
        role: 'mechanic',
      },
      {
        name: 'يوسف حسن',
        email: 'yousef@gmail.com',
        password: await bcrypt.hash('123456', 10),
        phone: '0794567890',
        location: 'عجلون',
        image: '/Uploads/yousef.jpg',
        role: 'mechanic',
      },
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Users created:', createdUsers.map((u) => u.email));

    // Seed Mechanics
    const mechanics = [
      {
        user: createdUsers[0]._id,
        workshopName: 'ورشة كريم',
        workSchedule: [
          { day: 'sunday', hours: [{ start: '09:00', end: '17:00' }] },
          { day: 'monday', hours: [{ start: '09:00', end: '17:00' }] },
          { day: 'tuesday', hours: [{ start: '09:00', end: '17:00' }] },
          { day: 'wednesday', hours: [{ start: '09:00', end: '17:00' }] },
          { day: 'thursday', hours: [{ start: '09:00', end: '17:00' }] },
        ],
        pricing: {
          homeService: 20, // 20 JOD per hour
          workshopService: 10, // 10 JOD per service
        },
        ratings: [],
        bookings: [],
        available: true,
      },
      {
        user: createdUsers[1]._id,
        workshopName: 'ورشة أحمد للسيارات',
        workSchedule: [
          { day: 'monday', hours: [{ start: '08:00', end: '16:00' }] },
          { day: 'tuesday', hours: [{ start: '08:00', end: '16:00' }] },
          { day: 'wednesday', hours: [{ start: '08:00', end: '16:00' }] },
          { day: 'thursday', hours: [{ start: '08:00', end: '16:00' }] },
          { day: 'saturday', hours: [{ start: '10:00', end: '14:00' }] },
        ],
        pricing: {
          homeService: 25, // 25 JOD per hour
          workshopService: 15, // 15 JOD per service
        },
        ratings: [],
        bookings: [],
        available: true,
      },
      {
        user: createdUsers[2]._id,
        workshopName: 'مركز محمود للصيانة',
        workSchedule: [
          { day: 'sunday', hours: [{ start: '10:00', end: '18:00' }] },
          { day: 'tuesday', hours: [{ start: '10:00', end: '18:00' }] },
          { day: 'wednesday', hours: [{ start: '10:00', end: '18:00' }] },
          { day: 'thursday', hours: [{ start: '10:00', end: '18:00' }] },
          { day: 'friday', hours: [{ start: '12:00', end: '16:00' }] },
        ],
        pricing: {
          homeService: 15, // 15 JOD per hour
          workshopService: 8, // 8 JOD per service
        },
        ratings: [],
        bookings: [],
        available: true,
      },
      {
        user: createdUsers[3]._id,
        workshopName: 'ورشة يوسف السريعة',
        workSchedule: [
          { day: 'monday', hours: [{ start: '09:00', end: '15:00' }] },
          { day: 'tuesday', hours: [{ start: '09:00', end: '15:00' }] },
          { day: 'wednesday', hours: [{ start: '09:00', end: '15:00' }] },
          { day: 'thursday', hours: [{ start: '09:00', end: '15:00' }] },
          { day: 'saturday', hours: [{ start: '11:00', end: '17:00' }] },
        ],
        pricing: {
          homeService: 30, // 30 JOD per hour
          workshopService: 20, // 20 JOD per service
        },
        ratings: [],
        bookings: [],
        available: true,
      },
    ];

    const createdMechanics = await Mechanic.insertMany(mechanics);
    console.log('Mechanics created:', createdMechanics.map((m) => m.workshopName));

    // Seed Available Slots (3 slots per mechanic)
    const slots = [
      // Slots for Kareem
      {
        mechanic: createdMechanics[0]._id,
        date: new Date('2025-05-25T00:00:00.000Z'),
        time: '10:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[0]._id,
        date: new Date('2025-05-26T00:00:00.000Z'),
        time: '14:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[0]._id,
        date: new Date('2025-05-27T00:00:00.000Z'),
        time: '16:00',
        isBooked: false,
      },
      // Slots for Ahmad
      {
        mechanic: createdMechanics[1]._id,
        date: new Date('2025-05-26T00:00:00.000Z'),
        time: '09:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[1]._id,
        date: new Date('2025-05-27T00:00:00.000Z'),
        time: '13:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[1]._id,
        date: new Date('2025-05-29T00:00:00.000Z'),
        time: '15:00',
        isBooked: false,
      },
      // Slots for Mahmoud
      {
        mechanic: createdMechanics[2]._id,
        date: new Date('2025-05-27T00:00:00.000Z'),
        time: '11:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[2]._id,
        date: new Date('2025-05-28T00:00:00.000Z'),
        time: '14:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[2]._id,
        date: new Date('2025-05-30T00:00:00.000Z'),
        time: '16:00',
        isBooked: false,
      },
      // Slots for Yousef
      {
        mechanic: createdMechanics[3]._id,
        date: new Date('2025-05-26T00:00:00.000Z'),
        time: '10:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[3]._id,
        date: new Date('2025-05-27T00:00:00.000Z'),
        time: '12:00',
        isBooked: false,
      },
      {
        mechanic: createdMechanics[3]._id,
        date: new Date('2025-05-28T00:00:00.000Z'),
        time: '14:00',
        isBooked: false,
      },
    ];

    const createdSlots = await AvailableSlot.insertMany(slots);
    console.log('Available slots created:', createdSlots.length);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedMechanics();