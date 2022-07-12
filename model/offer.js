const mongoose = require('mongoose');
const { Schema } = mongoose;

let = dn = Date.now();
let d = new Date(dn);

const Offer = new Schema({
    offer: { type: Number, required: true },

    profile: {
        type: String,
        ref: 'Profile'
    },
    offerDate: { type: String, default: d.toLocaleDateString() }
},
{ versionKey: false });

module.exports = mongoose.model('Offer', Offer);

/* FIN 1.0 */
