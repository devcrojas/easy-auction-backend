const mongoose = require('mongoose');
const { Schema } = mongoose;
const Profile = require('./profile');

const Review = new Schema({
    seller: { type: String, required: true },
    comment: { type: String, required: true },
    type: { type: String, required: true },
    stars: { type: Number, required: true },
    email: { type: String, required: true },
    profileData: {
        firstName: { type: String, require: false },
        lastName: {type: String, require: false},
        
        email: { type: String, required: false },
        /* file: {
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
        } */
    }

},
{ versionKey: false });

module.exports = mongoose.model('Review', Review);
/* FIN */