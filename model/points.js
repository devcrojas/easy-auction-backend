const { toString } = require('body-parser');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProdSchema = new Schema({
    user: { type: String, required: false },
    pts: { type: Number, require: true },
    logsIncrement: {type: Array, required: true},
    logsDecrement: {type: Array, required: true}
},
{ versionKey: false });

module.exports = mongoose.model('points', ProdSchema);