const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        // required: true

    },
    mobile: {
        type: String,
        // required: true
    },
    password: {
        type: String,
        // required: true
    },
    body: {
        type: String
    },
    code: {
        type: String
    },
    expireDate: {
        type: Date
    },
    name: {
        type: String
    }, lastName: {
        type: String
    },
    image: {
        type: String
    },
    active: {
        type: Boolean,
        default: 0
    },
    roles: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('User', userSchema);


// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;
//
// const ObjectId = mongodb.ObjectId;
//
// class User {
//     constructor(email, password) {
//         this.email = email;
//         this.password = password;
//         this._id = id;
//     }
//
//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }
//
//
//     static fetchAll() {
//         const db = getDb();
//
//
//         // db.listCollections().toArray(function(err, collInfos) {
//         //     console.log(collInfos);
//         // });
//
//
//         return db
//             .collection('users')
//             .find()
//             .toArray()
//             .then(users => {
//                 console.log(users);
//                 return users;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
//
//
//     static findById(userId) {
//         const db = getDb();
//         return db
//             .collection('users')
//             .findOne({_id: new ObjectId(userId)})
//             .then(user => {
//                 console.log(user);
//                 return user;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }
// }
//
// module.exports = User;
