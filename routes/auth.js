const path = require('path');
const { check, body } = require('express-validator');
const User = require('../models/user');

const express = require('express');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const redirectAthenticated = require('../middleware/redirectAthenticated');

const router = express.Router();

router.get('/login',[redirectAthenticated] ,authController.getLogin);

router.get('/signup' ,[redirectAthenticated], authController.getSignup);


router.post(
    '/login',
    [
        body('mobile')
            .isNumeric()
            .withMessage('نام کاربری یا پسورد اشتباه است!!'),
        body('password', 'رمز عبور باید معتبر باشد.')
            .isLength({ min: 5 })
            .isString()
    ],
    authController.postLogin
);

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('ایمیل نامعتبر هست!!')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //   throw new Error('This email address if forbidden.');
                // }
                // return true;
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'ایمیل قبلا وجود داشته است!!'
                        );
                    }
                });
            }),
        body(
            'password',
            'لطفا ایمیل بیشتر از 6 رقم و عدد باشد.'
        )
            .isLength({ min: 5 })
            .isString(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('تکرار ایمیل مطابقت ندارد!!');
            }
            return true;
        })
    ],
    authController.postSignup
);
router.post('/logout', authController.postLogout);

module.exports = router;

