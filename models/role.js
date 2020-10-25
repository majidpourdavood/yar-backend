const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    body: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});


module.exports = mongoose.model('Role', roleSchema);
