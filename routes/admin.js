const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');
const roleMiddleware = require('../middleware/roleMiddleware');

const UserController = require('../controllers/Admin/UserController');

const router = express.Router();

// // /admin/add-product => GET
router.get('/dashboard',[isAuth, roleMiddleware.isAdmin ], adminController.adminDashboard);


router.get('/users',[isAuth, roleMiddleware.isAdmin  ], UserController.users);

router.post('/user/delete/:userID',[isAuth, roleMiddleware.isAdmin ], UserController.postDeleteUser);

router.get('/edit/user/:userID',[isAuth, roleMiddleware.isAdmin  ], UserController.getEditUser);

router.post('/update/user/:userID',[isAuth, roleMiddleware.isAdmin  ], UserController.postUpdateUser);


//
// // /admin/products => GET
// router.get('/products', adminController.getProducts);
//
// // /admin/add-product => POST
// router.post('/add-product', adminController.postAddProduct);
//
// router.get('/edit-product/:productId', adminController.getEditProduct);
//
// router.post('/edit-product', adminController.postEditProduct);
//
// router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
