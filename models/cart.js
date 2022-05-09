const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId, //mongoose.Schema.Types.ObjectId
    ref: "User",
    required: true,
  },
  cartItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId, //mongoose.Schema.Types.ObjectId
        ref: "Product",
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);

