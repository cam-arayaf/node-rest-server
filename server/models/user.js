const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const required = [true, '{PATH} is required'];

const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid role'
}

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required
    },
    email: {
        type: String,
        unique: true,
        required
    },
    password: {
        type: String,
        required
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

userSchema.methods.toJSON = function() {
    let user = this.toObject();
    delete user.password;
    return user;
}

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('user', userSchema);