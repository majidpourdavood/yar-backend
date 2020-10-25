const User = require('../models/user');

exports.adminDashboard = async (req, res, next) => {

  await User.find()
      .then(users => {


        res.render('admin/dashboard', {
          users: users,
          pageTitle: 'dashboard',
          path: '/admin/dashboard',
          isAuthenticated: req.session.isLoggedIn,
          messages: req.session.flash,
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
