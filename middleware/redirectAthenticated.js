const Role = require('../models/role');

module.exports = async (req, res, next) => {

    if (req.session.isLoggedIn) {

        try {

            await Role.find(
                {
                    _id: {$in: req.session.user.roles}
                },
                (err, roles) => {
                    console.log(roles);

                    if (roles.length > 0) {
                        for (let i = 0; i < roles.length; i++) {
                            if (roles[i].slug === "admin") {
                                res.status(200).redirect('/admin/dashboard');
                            }
                        }
                    } else {
                        res.status(200).redirect('/panel/dashboard');

                    }
                });


        } catch (e) {
            console.log('Catch an error: ', e)
        }

    }else {
        next();
    }
        // next();


}