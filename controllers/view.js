const User = require('../models/user');
const Role = require('../models/role');
const Sms = require('../models/sms');
const momment = require('jalali-moment');


exports.deleteInfoMessage = (req, res, next) => {
    console.log(req.params.id);
    req.session.flash.info.splice(req.params.id, 1);
    res.status(200).redirect(req.session.cookie.path);

};

exports.getIndex = async (req, res, next) => {
    // console.log(req.session.user._id);
    // console.log(req.route.path);
    // console.log(req.session.user.roles);
    // console.log(req.path);
    // console.log(req);

  console.log(  momment().unix() *1000)
  console.log(  momment().toISOString())
  console.log(new Date())
    // const sms = new Sms({
    //     code: 234356,
    //     userId: "5f8b05e33962ba445a44f42d",
    // });
    // sms.save();

    // const role = new Role({
    //     name: "admin",
    //     slug: "admin",
    //     body: "admin",
    // });
    //  role.save();

    // await  Role.find(
    //     {
    //         _id: { $in: req.user.roles }
    //     },
    //     (err, roles) => {
    //         console.log(roles);
    //
    //         for (let i = 0; i < roles.length; i++) {
    //             if (roles[i].name === "admin") {
    //                 res.redirect('/admin/dashboard');
    //
    //             }
    //         }
    //     });
    // res.redirect('/panel/dashboard');

    await User.find()
        .then(users => {
            res.render('view/index', {
                users: users,
                pageTitle: 'index',
                path: '/',
                isAuthenticated: req.session.isLoggedIn,
                messages: req.session.flash
            });
        })
        .catch(err => {
            console.log(err);
        });
};


exports.panelDashboard = async (req, res, next) => {
    console.log(req.session.user._id);
    // console.log(req.session.cookie.path);
    // console.log(req.session.info);

    // const role = new Role({
    //     name: "admin"
    // });
    //  role.save();
    // await Role.find(
    //     {
    //         _id: {$in: req.session.user.roles}
    //     },
    //     (err, roles) => {
    //         if (roles.length > 0) {
    //             for (let i = 0; i < roles.length; i++) {
    //                 if (roles[i].slug === "admin") {
    //                     req.session.role = "admin";
    //                 }
    //             }
    //         } else {
    //             req.session.role = "user";
    //             // console.log("user");
    //             // console.log(req.session);
    //
    //         }
    //
    //     });
    await User.find()
        .then(users => {



            console.log(req.session.role);

            res.render('panel/dashboard', {
                users: users,
                pageTitle: 'dashboard',
                path: '/panel/dashboard',
                isAuthenticated: req.session.isLoggedIn,
                // role: `${req.session.role}`,
                messages: req.session.flash,
                // alert: {
                //     "status": "false"
                // }
            });
        })
        .catch(err => {
            console.log(err);
        });
};
