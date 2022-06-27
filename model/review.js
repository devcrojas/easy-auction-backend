const mongoose = require('mongoose');
const { Schema } = mongoose;

const Review = new Schema({
    comment: { type: String, required: true },
    type: { type: String, required: true },
    stars: { type: Number, required: true }
});

module.exports = mongoose.model('Review', Review);
/* FIN */