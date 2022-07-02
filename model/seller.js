const mongoose = require('mongoose');
const { Schema } = mongoose;

const Seller = new Schema({
    
    firstNameSeller: { type: String, require: true },
    lastNameSeller: {type: String, require: true},
    birthday: {type: Date, require: false},
    address: {type: String, require: true},
    phone: {type: String, require: true},
    email: { type: String, required: false },
    password: { type: String, required: false},
    bankAccount: { type:{
        cardNumber: { type: Number, require: false },
        expiration: { type: String, require: false },
        cvv: { type: Number, require: false }
    }},
    emailPaypal: { type: String, required: false },
    status: { type: String, default:'Inactive', required: false },
    file: {
        fileName: {
            type: String,
            required: true
        },
        filePath: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        fileSize: {
            type: String,
            required: true
        }
    }
},
{ versionKey: false });

module.exports = mongoose.model('Seller', Seller);