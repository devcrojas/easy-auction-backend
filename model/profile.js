const mongoose = require('mongoose');
const { Schema } = mongoose;


const size = "8.36 KB";

const Profile = new Schema({
    
    firstName: { type: String, require: true },
    lastName: {type: String, require: true},
    birthday: {type: Date, require: false},
    address: {
        cpp: { type: String, require: true },
        stree: { type: String, require: false },
        suburb: { type: String, require: false },
        municipaly: { type: String, require: false },
        state: { type: String, require: true }
        },
    phone: { type: String, require: false },
    email: { type: String, required: false },
    password: { type: String, required: false},
    bankAccount: { type:{
        cardNumber: { type: Number, require: false },
        expiration: { type: String, require: false },
        cvv: { type: Number, require: false }
    }},
    emailPaypal: { type: String, required: false },
    status: { type: String, default:'Active', required: false },
    file: {
        fileName: {
            type: String,
            required: false
        },
        filePath: {
            type: String,
            required: false
        },
        fileType: {
            type: String,
            required: false
        },
        fileSize: {
            type: String,
            required: false
        }
    }
},
{ versionKey: false });

module.exports = mongoose.model('Profile', Profile);