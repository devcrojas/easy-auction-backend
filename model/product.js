const mongoose = require('mongoose');
const { Schema } = mongoose;

const Product = new Schema({
    
    nameProduct: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: {
        material: { type: String, required: true },
        marca: { type: String, required: true },
        dimensions: { type: String, required: true },
        actualCondition: { type: String, required: true },
        observations: { type: String, required: true }
    }},
    status: { type: String, required: false },
    price: { type: {
        initialP: { type: Number, required: false },
        buyNow: { type: Number, required: false },
        offered: { type: Number, required: false }
    }},
    auctionDate: { type: {
        initialD: { type: Date, required: false }, /* True: Fehca de inicio al autorizar subasta */
        final: { type: Date, required: false }
    }},
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
    },
    files: [Object],
    email: { type: String, required: true },
    sellerData: {
        _id: { type: String, require: false },
        firstName: { type: String, require: false },
        lastName: {type: String, require: false},
        birthday: {type: Date, require: false},
        address: {
            cpp: { type: String, require: false },
            stree: { type: String, require: false },
            suburb: { type: String, require: false },
            municipaly: { type: String, require: false },
            state: { type: String, require: false }
            },
        phone: { type: String, require: false },
        email: { type: String, required: false },
        password: { type: String, required: false},
        status: { type: String, default:'inactive', required: false },
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
    }
},
{ versionKey: false });

module.exports = mongoose.model('Product', Product);

/* FIN 1.0 */