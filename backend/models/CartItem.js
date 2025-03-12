const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  size: { type: String, required: true },
});

module.exports = mongoose.model('CartItem', CartItemSchema);