const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  size: { type: String, required: true },
  img: { type: String }, // Make img optional
});

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true, // Store email in lowercase
  },
  order_data: {
    type: [OrderItemSchema], // Array of OrderItemSchema
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now,
  },
  payment_id: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Order', OrderSchema);