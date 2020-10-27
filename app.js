const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const csrf = require('csurf');
const flash = require('connect-flash');

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const User = require('./models/user');
const Role = require('./models/role');
const multer = require('multer');

const authRouteApi = require('./routes/api/auth');
const payment = require('./routes/api/payment');
const recharge = require('./routes/api/recharge');
const errorHandler = require('./util/error-handler');

require("dotenv").config({
    path: path.join(__dirname, "/.env")
});


const app = express();

const dbName = "yar";
const MONGODB_URI = "mongodb://127.0.0.1:27017" + "/" + dbName;

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();


const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const viewRoutes = require('./routes/view');
const auth = require('./routes/auth');

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json()); // application/json

app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
);

app.use(express.static(path.join(__dirname, '/public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

//api route
app.use('/api', authRouteApi);
app.use('/api', payment);
app.use('/api', recharge);

app.use(errorHandler);

app.use(csrfProtection);
app.use(flash());

// app.use((req, res, next) => {
//     if (!req.session.user) {
//         return next();
//     }
//
//     User.findById(req.session.user._id)
//         .then(user => {
//             req.user = user;
//             next();
//         })
//         .catch(err => console.log(err));
// });

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();

    // res.cookie('XSRF-TOKEN', req.csrfToken());

    next();
});


app.use('/admin', adminRoutes);
app.use(viewRoutes);
app.use(auth);
//

app.use(errorController.get404);



// app.use((error, req, res, next) => {
//     // res.status(error.httpStatusCode).render(...);
//     // res.redirect('/500');
//     res.status(500).render('500', {
//         pageTitle: 'Error!',
//         path: '/500',
//         isAuthenticated: req.session.isLoggedIn
//     });
// });



mongoose
    .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(result => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });

// mongoConnect(() => {
//     app.listen(8000);
// });