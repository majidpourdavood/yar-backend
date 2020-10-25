const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const Role = require('../../models/role');
const {validationResult} = require('express-validator');
const fileHelper = require('../../util/file');


exports.users = async (req, res, next) => {

    await User.find()
        .then(users => {
            res.render('admin/users/index', {
                users: users,
                pageTitle: 'users',
                path: '/admin/users',
                isAuthenticated: req.session.isLoggedIn,
                messages: req.session.flash
            });
        })
        .catch(err => {
            console.log(err);
        });


    // res.render('admin/dashboard', {
    //   pageTitle: 'dashboard',
    //   path: '/admin/dashboard'
    // });
};

exports.postDeleteUser = (req, res, next) => {
    const userId = req.params.userID;

    console.log(req.params);
    console.log(req.params.userID);
    User.deleteOne({_id: userId})
        .then(() => {
            console.log('DESTROYED User');
            res.redirect('/');
        })
        .catch(err => console.log(err));
};


exports.getEditUser = (req, res, next) => {
    const userId = req.params.userID;


    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.redirect('/');
            }
            Role.find({}, function (err, roles) {

                console.log(roles.findIndex(x => x.id === '5f89841a975d1f0bf8924028'));
                res.render('admin/users/edit', {
                    pageTitle: 'Edit user',
                    path: '/admin/edit/user/' + userId,
                    user: user,
                    roles: roles,
                    hasError: false,
                    errorMessage: null,
                    validationErrors: []
                });
            });

        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postUpdateUser = (req, res, next) => {
    const userId = req.params.userID;
    const updatedBody = req.body.body;
    const updatedEmail = req.body.email;
    const updatedMobile = req.body.mobile;
    const image = req.file;

    // console.log(image);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/users/edit', {
            pageTitle: 'Edit user',
            path: '/admin/edit/user/' + userId,
            hasError: true,
            user: {
                body: updatedBody,
                email: updatedEmail,
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });


    }
    User.findById(userId)
        .then(user => {

            user.body = updatedBody;
            user.email = updatedEmail;
            user.mobile = updatedMobile;
            if (image) {
                if (user.image) {
                    fileHelper.deleteFile(user.image);
                }
                user.image = image.path;
            }

            // Role.findOne({ id: "admin" }, (err, role) => {
            //     if (err) {
            //         res.status(500).send({ message: err });
            //         return;
            //     }

            if (req.body.role == "0") {
                user.roles = [];
            } else {
                user.roles = [req.body.role];
            }

            return user.save().then(result => {
                console.log('UPDATED user!');
                console.log(user);
                res.redirect('/admin/users');
            });

            // });

        })
        .catch(err => console.log(err));
    // .catch(err => {
    //     const error = new Error(err);
    //     error.httpStatusCode = 500;
    //     return next(error);
    // });
};