const mongoose = require('mongoose');
const { Schema } = mongoose;

let = dn = Date.now();
let d = new Date(dn);

const Review = new Schema({
    
    comment: { type: String, required: false },
    type: { type: String, required: false },
    stars: { type: Number, required: false },
    emailU: {
        type: String
    },
    emailP: {
        type: String
    },
    productId: {
        type: Schema.Types.ObjectId
    },
    datePublished: { type: String, default: d.toLocaleDateString() },
    status: {type: String, required: false}
},
{ versionKey: false });

module.exports = mongoose.model('Review', Review);

/* FIN 1.6 */
