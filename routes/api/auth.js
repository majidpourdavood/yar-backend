const express = require('express');
const { body } = require('express-validator');

const User = require('../../models/user');
const authController = require('../../controllers/api/v1/auth');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();

// router.put(
//   '/signup',
//   [
//     body('email')
//       .isEmail()
//       .withMessage('Please enter a valid email.')
//       .custom((value, { req }) => {
//         return User.findOne({ email: value }).then(userDoc => {
//           if (userDoc) {
//             return Promise.reject('E-Mail address already exists!');
//           }
//         });
//       })
//       .normalizeEmail(),
//     body('password')
//       .trim()
//       .isLength({ min: 5 }),
//     body('name')
//       .trim()
//       .not()
//       .isEmpty()
//   ],
//   authController.signup
// );
//
// router.post('/login', authController.login);

router.post('/v1/auth', authController.auth);
router.post('/v1/auth/verifyCode', authController.verifyCode);
router.post('/v1/auth/repeatCode', authController.repeatCode);
router.post('/v1/auth/token', authController.token);
router.post('/v1/auth/check',[jwtMiddleware], authController.check);


module.exports = router;
