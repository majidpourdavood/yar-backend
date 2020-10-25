// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
//
// let _db;
// const url = "mongodb://127.0.0.1:27017";
//
// const dbName = "shop";
// const mongoConnect = callback => {
//     MongoClient.connect(
//         // 'mongodb+srv://majid:uynj1opyGLyW0u2q@cluster0.pu8t4.gcp.mongodb.net/shop'
//         url
//         , {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         })
//         .then(client => {
//             console.log('Connected!');
//             _db = client.db(dbName);
//             callback();
//         })
//         .catch(err => {
//             console.log(err);
//             throw err;
//         });
// };
//
// const getDb = () => {
//     if (_db) {
//         return _db;
//     }
//     throw 'No database found!';
// };
//
// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;