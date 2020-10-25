const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const smsSchema = new Schema({
    code: {
        type: String
    },
    message: {
        type: String
    },
    userId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Sms', smsSchema);


