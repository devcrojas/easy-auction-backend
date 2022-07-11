const { toString } = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProdSchema = new Schema({
    _id: { type: Object, required: false },
    user: { type: String, required: false },
    pts: { type: Number, require: true }
});

module.exports = mongoose.model('points', ProdSchema);