const express = require("express");
require("dotenv").config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const codeRoutes = require('./routes/codeRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const slotRoutes = require('./routes/slotRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const partRoutes = require('./routes/partRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const postRoutes = require('./routes/postRoutes');
const contactRoutes =require('./routes/contactRoutes');
const { Server } = require('socket.io');
const http = require('http');
//init App
const app = express();
// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // السماح للفرونت
    credentials: true,               // السماح بإرسال الكوكيز
  }));
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/codes', codeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/slots',slotRoutes);
app.use('/api/users',userRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/mechanic', mechanicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/contact', contactRoutes);


// WebSocket events
io.on('connection', (socket) => {
  console.log('Admin connected:', socket.id);

  socket.on('joinAdmin', () => {
    console.log('Admin joined adminRoom:', socket.id);
    socket.join('adminRoom');
  });

  socket.on('disconnect', () => {
    console.log('Admin disconnected:', socket.id);
  });
});
// WebSocket
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
// Make io accessible to controllers
app.set('io', io);

const PORT = process.env.PORT||8000;
server.listen(PORT,()=> console.log(`Server is running on http://localhost:${PORT}`));
