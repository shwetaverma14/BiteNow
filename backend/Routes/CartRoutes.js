const express = require('express');
const CartItem = require('../models/CartItem');
const Razorpay = require('razorpay'); // Import Razorpay
const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay key ID
  key_secret: 'YOUR_RAZORPAY_KEY_SECRET', // Replace with your Razorpay key secret
});

// Add item to cart
router.post('/add', async (req, res) => {
  try {
    const { name, price, qty, size } = req.body;

    // Validate request body
    if (!name || !price || !qty || !size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if item exists in cart
    let existingItem = await CartItem.findOne({ name, size });

    if (existingItem) {
      existingItem.qty += qty;
      await existingItem.save();
      return res.json({ message: 'Quantity updated', cartItem: existingItem });
    }

    const newItem = new CartItem({ name, price, qty, size });
    await newItem.save();
    res.status(201).json({ message: 'Item added to cart', cartItem: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all cart items
router.get('/', async (req, res) => {
  try {
    const cartItems = await CartItem.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update quantity
router.put('/update/:id', async (req, res) => {
  try {
    const { qty } = req.body;

    // Validate request body
    if (!qty) {
      return res.status(400).json({ error: 'Quantity is required' });
    }

    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      { qty },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Quantity updated', cartItem: updatedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove item from cart
router.delete('/remove/:id', async (req, res) => {
  try {
    const deletedItem = await CartItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in the smallest currency unit (e.g., paise for INR)

    // Validate request body
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_receipt_${Date.now()}`, // Unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;