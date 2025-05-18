const express = require('express');
const Razorpay = require('razorpay');
const mongoDb = require('./db.js');
const cartRoutes = require('./Routes/CartRoutes');
const cors = require('cors');
const dotenv = require('dotenv');
const Order = require('./models/order');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Initialize Razorpay only once
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Enhanced CORS configuration
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://bitnoww.netlify.app',
      'https://bitenow-in0i.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

app.use(express.json());
mongoDb();

// Remove the /api/clean-food-data route since it's not needed

// API Routes
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api/cart', cartRoutes);

// Payment routes
app.post('/api/create-order', async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: 'INR',
      receipt: `order_receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/auth/myOrderData', async (req, res) => {
  try {
    const orders = await Order.find({ email: req.body.email.toLowerCase() })
      .sort({ order_date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});

app.post('/api/payment-confirmation', async (req, res) => {
  try {
    const newOrder = new Order({
      email: req.body.email.toLowerCase(),
      order_data: req.body.order_data.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        size: item.size,
        img: item.img || 'default_image_url',
      })),
      payment_id: req.body.payment_id,
      order_id: req.body.order_id,
      order_date: new Date(),
    });
    await newOrder.save();
    res.json({ success: true, message: 'Order saved successfully.' });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: 'Failed to save order.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});