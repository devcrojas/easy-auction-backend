const mongoose = require('mongoose');
const { Schema } = mongoose;

let = dn = Date.now();
let d = new Date(dn);

const Review = new Schema({
    userData: { 
        name: { type: String, require: false },
        email: { type: String, required: false }
     },
    comment: { type: String, required: true },
    type: { type: String, required: true },
    stars: { type: Number, required: true },

    emailU: { type: String, required: true },
    emailP: { type: String, required: true },
    productId: { type: String, required: true },

    profileData: {
        firstName: { type: String, require: false },
        lastName: { type: String, require: false },
        email: { type: String, required: false },
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
    productData: {
        nameProduct: { type: String, required: true },
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
    datePublished: { type: String, default: d.toLocaleDateString() }
},
{ versionKey: false });

module.exports = mongoose.model('Review', Review);
/* FIN */