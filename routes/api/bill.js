const express = require('express');

const bill = require('../../controllers/api/v1/bill');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();

router.post('/v1/inquire-bill-pay',[jwtMiddleware], bill.inquireBillPay);

module.exports = router;
