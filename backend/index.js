const express = require('express');
const Razorpay = require('razorpay');
const mongoDb = require('./db.js');
const cartRoutes = require('./Routes/CartRoutes');
const cors = require('cors'); // Import the cors package
const dotenv = require('dotenv');
const Order = require('./models/order'); // Import the Order model

// Load environment variables
dotenv.config();

// Debug logs to verify environment variables
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
console.log('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET);

const app = express();
const port = 5000;

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post('/api/verify-payment', async (req, res) => {
  const { payment_id } = req.body;

  try {
    const payment = await razorpay.payments.fetch(payment_id);
    console.log('Payment details:', payment); // Debug log

    if (payment.status === 'captured') {
      res.json({ success: true, message: 'Payment verified successfully.' });
    } else {
      res.status(400).json({ success: false, message: 'Payment not captured.' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment.' });
  }
});

// Middleware for CORS
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
  })
);

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB
mongoDb();

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));
app.use('/api/cart', cartRoutes);

// New Route: Create Razorpay Order
app.post('/api/create-order', async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount, // Amount in paise
    currency: 'INR',
    receipt: `order_receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Route: Fetch Order History for a User
app.post('/api/auth/myOrderData', async (req, res) => {
  const { email } = req.body;
  console.log('Fetching orders for email:', email); // Debug log

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Fetch orders from the database for the given email
    const orders = await Order.find({ email: normalizedEmail }).sort({ order_date: -1 });
    console.log('Orders found:', orders); // Debug log

    if (orders.length > 0) {
      res.json({ success: true, orders });
    } else {
      res.json({ success: false, message: 'No orders found for this user.' });
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
});
// Route: Handle Payment Confirmation and Save Order
app.post('/api/payment-confirmation', async (req, res) => {
  const { payment_id, order_id, email, order_data } = req.body;
  console.log('Payment confirmation request:', { payment_id, order_id, email, order_data }); // Debug log

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Ensure each item in order_data has an img field
    const validatedOrderData = order_data.map(item => ({
      name: item.name,
      price: item.price,
      qty: item.qty,
      size: item.size,
      img: item.img || 'default_image_url', // Provide a default image URL if img is missing
    }));

    // Create a new order document
    const newOrder = new Order({
      email: normalizedEmail,
      order_data: validatedOrderData,
      order_date: new Date(),
    });

    // Save the order to the database
    await newOrder.save();
    console.log('Order saved successfully:', newOrder); // Debug log

    res.json({ success: true, message: 'Order saved successfully.' });
  } catch (error) {
    console.error('Error confirming payment and saving order:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment and save order.' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});