const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    diplome:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }

})

const service = mongoose.model('Service', serviceSchema);
module.exports = service;