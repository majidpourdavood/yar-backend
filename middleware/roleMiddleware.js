const User = require('../models/user');
const Role = require('../models/role');



isAdmin = (req, res, next) => {

// console.log(req.session.user._id);
  User.findById(req.session.user._id).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        // for (let i = 0; i < roles.length; i++) {
        //   if (roles[i].slug === "admin") {
        //     next();
        //     return;
        //   }
        // }
        if (roles.length > 0) {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].slug === "admin") {
              next();
              return;
            }
          }
        } else {
          req.flash('info', 'Require Admin Role!');
          res.status(200).redirect('/panel/dashboard');

        }
        // res.status(403).redirect(req.session.cookie.path);


        // return;
      }
    );
  });
};

const roleMiddleware = {
  isAdmin
};
module.exports = roleMiddleware;
