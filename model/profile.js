const mongoose = require('mongoose');
const { Schema } = mongoose;

const noUserImage = "uploads\\noUserImage.jpg";
const name =  "noUserImage.jpg";
const tipo = "image/jpeg";
const size = "8.36 KB";

const Profile = new Schema({
    
    firstName: { type: String, require: true },
    lastName: {type: String, require: true},
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
    status: { type: String, default:'Active', required: false },
    file: {
        fileName: {
            type: String,
            default: name,
            required: false
        },
        filePath: {
            type: String,
            default: noUserImage,
            required: false
        },
        fileType: {
            type: String,
            default: tipo,
            required: false
        },
        fileSize: {
            type: String,
            default: size,
            required: false
        }
    }
},
{ versionKey: false });

module.exports = mongoose.model('Profile', Profile);