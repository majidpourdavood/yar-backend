const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    token: {
        type: String
    },
    tokenLife: {
        type: Date,
    },
    refreshToken: {
        type: String
    },
    active: {
        type: Boolean,
        default: 1
    },
    readAt: {
        type: Date,
    },

}, {timestamps: true});


module.exports = mongoose.model('ApiToken', userSchema);


