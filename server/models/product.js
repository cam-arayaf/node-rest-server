const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;
const required = [true, '{PATH} is required'];

let productSchema = new Schema({
    name: { type: String, required },
    price: { type: Number, required },
    description: { type: String },
    available: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'category', required },
    user: { type: Schema.Types.ObjectId, ref: 'user' }
});

//productSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('product', productSchema);