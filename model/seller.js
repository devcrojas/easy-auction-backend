const mongoose = require('mongoose');
const { Schema } = mongoose;

const Seller = new Schema({
    
    firstNameSeller: { type: String, require: true },
    lastNameSeller: {type: String, require: true},
    birthday: {type: Date, require: false},
    address: {
        cpp: { type: String, require: false },
        street: { type: String, require: false },
        suburb: { type: String, require: false },
        municipaly: { type: String, require: false },
        state: { type: String, require: false }
    },
    phone: {type: String, require: true},
    email: { type: String, required: false },
    password: { type: String, required: false},
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