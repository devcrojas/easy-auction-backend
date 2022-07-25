const { toString } = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProdSchema = new Schema({
    _id: { type: Object, required: false },
    email: { type: String, required: true },
    name: { type: String, require: true },
    firstName: {type: String, require: true},
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: false }
});

module.exports = mongoose.model('logins', ProdSchema);