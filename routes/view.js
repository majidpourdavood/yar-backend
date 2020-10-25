const path = require('path');

const express = require('express');

const viewController = require('../controllers/view');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', viewController.getIndex);
router.get('/panel/dashboard',isAuth, viewController.panelDashboard);

router.get('/delete/infoMessage/:id', viewController.deleteInfoMessage);

// router.get('/products', shopController.getProducts);
//
// router.get('/products/:productId', shopController.getProduct);
//
// router.get('/cart', shopController.getCart);
//
// router.post('/cart', shopController.postCart);
//
// router.post('/cart-delete-item', shopController.postCartDeleteProduct);
//
// router.post('/create-order', shopController.postOrder);
//
// router.get('/orders', shopController.getOrders);

module.exports = router;
