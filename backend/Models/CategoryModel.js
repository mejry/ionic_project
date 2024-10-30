const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    service:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Service'
    }]
});

serviceCategorySchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const ServiceCategory = mongoose.model('ServiceCategory', serviceCategorySchema);
module.exports = ServiceCategory;
