const mongoose = require('mongoose');
const { Schema } = mongoose;

const Review = new Schema({
    seller: { type: String, required: true },
    comment: { type: String, required: true },
    type: { type: String, required: true },
    stars: { type: Number, required: true },
    user: { type: String, default: 'Anónimo', required: false}
},
{ versionKey: false });

module.exports = mongoose.model('Review', Review);
/* FIN */