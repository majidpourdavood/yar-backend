const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RechargeSchema = new Schema({
    clientTransactionId: {
        type: String
    },
    rechargeCode: {
        type: String
    },
    mobileOperatorId: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    status: {
        type: Boolean,
        default: 0
    }, amount: {
        type: String
    },
    userId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ,
}, {timestamps: true});


module.exports = mongoose.model('Recharge', RechargeSchema);


