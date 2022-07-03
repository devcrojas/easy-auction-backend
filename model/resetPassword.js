const { toString } = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProdSchema = new Schema({
    userId: { type: Object, required: true },
    timestamp: { type: Date, require: true },
    JWToken: {type: String, require: true}
});

module.exports = mongoose.model('resetPasswords', ProdSchema);