const mongoose = require('mongoose');
const { Schema } = mongoose;

let = dn = Date.now();
let d = new Date(dn);

const Review = new Schema({
    comment: { type: String, required: true },
    type: { type: String, required: true },
    stars: { type: Number, required: true },

    emailU: {
        type: String
    },
    emailP: {
        type: String
    },
    productId: {
        type: Schema.Types.ObjectId
    },
    status: String,
    datePublished: { type: String, default: d.toLocaleDateString() }
},
{ versionKey: false });

module.exports = mongoose.model('Review', Review);

/* FIN 1.5 */
