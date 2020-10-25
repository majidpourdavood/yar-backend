const express = require('express');

const rechargeController = require('../../controllers/api/v1/recharge');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();


router.post('/v1/recharge', rechargeController.recharge);
// router.post('/v1/auth/check',[jwtMiddleware], rechargeController.check);


module.exports = router;
