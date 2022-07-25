const mongoose = require('mongoose');
const { Schema } = mongoose;

const Profile = new Schema({
    _id: { type: String, require: false },
    firstName: { type: String, require: false },
    lastName: {type: String, require: false},
    birthday: {type: Date, require: false},
    address: {
        postalCode: { type: String, require: false },
        street: { type: String, require: false },
        suburb: { type: String, require: false },
        municipality: { type: String, require: false },
        state: { type: String, require: false }
    },
    phone: { type: String, require: false },
    email: { type: String, required: false },
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