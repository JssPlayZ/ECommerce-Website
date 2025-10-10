const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: Number, // Matching the ID type from Fake Store API
        required: true,
    },
    title: String,
    price: Number,
    image: String,
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
});


const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [CartItemSchema],
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);