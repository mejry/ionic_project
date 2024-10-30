const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
})
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
