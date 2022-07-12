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
    status: { type: String, default:'inactive', required: false },
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
    profile: {
        type: String
    }
},
{ versionKey: false });

module.exports = mongoose.model('Product', Product);

/* FIN 1.3 */