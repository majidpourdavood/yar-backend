const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Role = require('../models/role');
const {validationResult} = require('express-validator');
const fileHelper = require('../util/file');

exports.getLogin = async (req, res, next) => {

    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }

    // if (req.session.isLoggedIn) {
    //
    //     try {
    //         await Role.find(
    //             {
    //                 _id: {$in: req.user.roles}
    //             },
    //             (err, roles) => {
    //                 console.log(roles);
    //                 if (roles.length > 0) {
    //                     for (let i = 0; i < roles.length; i++) {
    //                         if (roles[i].slug === "admin") {
    //                             res.status(200).redirect('/admin/dashboard');
    //                         }
    //                     }
    //                 } else {
    //                     res.status(200).redirect('/panel/dashboard');
    //
    //                 }
    //
    //             });
    //
    //     } catch (e) {
    //         console.log('Catch an error: ', e)
    //     }
    //
    // } else {
        return res.status(200).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: message
        });
    // }


};

exports.getSignup = async (req, res, next) => {


    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }


    // if (req.session.isLoggedIn) {
    //
    //     try {
    //         await Role.find(
    //             {
    //                 _id: {$in: req.user.roles}
    //             },
    //             (err, roles) => {
    //                 console.log(roles);
    //                 if (roles.length > 0) {
    //                     for (let i = 0; i < roles.length; i++) {
    //                         if (roles[i].slug === "admin") {
    //                             res.status(200).redirect('/admin/dashboard');
    //                         }
    //                     }
    //                 } else {
    //                     res.status(200).redirect('/panel/dashboard');
    //
    //                 }
    //
    //             });
    //
    //     } catch (e) {
    //         console.log('Catch an error: ', e)
    //     }
    //
    // } else {
        res.render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: message,
            oldInput: {
                email: '',
                password: '',
                confirmPassword: ''
            }
        });
    // }
};

// exports.postLogin = (req, res, next) => {
//     const email = req.body.email;
//     const password = req.body.password;
//
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(422).render('auth/login', {
//             path: '/login',
//             pageTitle: 'Login',
//             errorMessage: errors.array()[0].msg
//         });
//     }
//
//     User.findOne({email: email})
//         .then(user => {
//             if (!user) {
//                 return res.redirect('/login');
//             }
//             bcrypt
//                 .compare(password, user.password)
//                 .then(doMatch => {
//                     if (doMatch) {
//                         req.session.isLoggedIn = true;
//                         req.session.user = user;
//                         return req.session.save(err => {
//                             console.log(err);
//                             res.redirect('/');
//                         });
//                     }
//                     req.flash('error', 'Invalid email or password.');
//                     res.redirect('/login');
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     res.redirect('/login');
//                 });
//         })
//         .catch(err => console.log(err));
// };


exports.postLogin = async (req, res, next) => {
    const mobile = req.body.mobile;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg
        });
    }

    try {
        await User.findOne({mobile: mobile})
            .then(user => {
                if (!user) {
                    req.flash('error', 'نام کاربری یا پسورد اشتباه است!!');
                    return res.redirect('/login');
                }

                if (user.active === false) {
                    req.flash('error', 'اکانت فعال نشده است!');
                    return res.redirect('/login');
                }

                bcrypt
                    .compare(password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save(err => {
                                console.log(err);


                                Role.find(
                                    {
                                        _id: {$in: user.roles}
                                    },
                                    (err, roles) => {
                                        if (err) {
                                            res.status(200).redirect('/panel/dashboard');
                                        }

                                        if (roles.length == 0) {
                                            res.status(200).redirect('/panel/dashboard');
                                        }

                                        for (let i = 0; i < roles.length; i++) {
                                            if (roles[i].slug === "admin") {
                                                res.status(200).redirect('/admin/dashboard');
                                            }
                                        }
                                    });
                            });
                        }else{
                            req.flash('error', 'نام کاربری یا پسورد اشتباه است!!');
                            res.redirect('/login');
                        }

                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect('/login');
                    });
            })
            .catch(err => console.log(err));
    } catch (err) {
        next(err);
    }


};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const mobile = req.body.mobile;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            }
        });
    }

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                mobile: mobile,
                password: hashedPassword,
            });
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
            // return transporter.sendMail({
            //   to: email,
            //   from: 'shop@node-complete.com',
            //   subject: 'Signup succeeded!',
            //   html: '<h1>You successfully signed up!</h1>'
            // });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    });
};

