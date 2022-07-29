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
        offered: { type: Number, required: false },
        winOffered: {type: String, required: false},
        logOffered: {type: Object, required: false}
    }},
    phase: { type: String, required: false },
    auctionDate: { type: {
        create: { type: Date, required: false }, /* Fecha de creacion de la subasta y en que se solicito la subasta */
        initialD: { type: Date, required: false }, /* True: Fecha en que se inicia subasta (programada) */
        final: { type: Date, required: false } /* Fecha cierre de la subasta */
    }},
    adminAuth: String,
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
    email: {
        type: String
    },
    offerActivity: { type: Boolean, required: false },
    userInOfferActivity: {type: String, required: false},
    profile: {
        type: String
    },
    logAuthProd: {type: Object, required: false},
    profileWin: String
},
{ versionKey: false });

module.exports = mongoose.model('Product', Product);

/* FIN 1.51 */