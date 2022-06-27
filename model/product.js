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
        initialP: { type: Number, required: true },
        buyNow: { type: Number, required: true },
        offered: { type: Number, required: false }
    }},
    auctionDate: { type: {
        initialD: { type: Date, required: false }, /* True: Fehca de inicio al autorizar subasta */
        final: { type: Date, required: false }
    }},
    images: { type: {
        img1: { type: String, required: true },
        img2: { type: String, required: false },
        img3: { type: String, required: false },
        img4: { type: String, required: false },
        img5: { type: String, required: false },
        img6: { type: String, required: false }
    }}
});

module.exports = mongoose.model('Product', Product);
