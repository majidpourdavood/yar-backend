const express = require('express');

const bill = require('../../controllers/api/v1/bill');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();

router.post('/v1/electricity-bill',[jwtMiddleware], bill.electricityBill);
router.post('/v1/water-bill',[jwtMiddleware], bill.waterBill);
router.post('/v1/gas-bill',[jwtMiddleware], bill.gasBill);
router.post('/v1/phone-bill',[jwtMiddleware], bill.phoneBill);
router.post('/v1/mobile-bill',[jwtMiddleware], bill.mobileBill);
router.post('/v1/rahvar-fines',[jwtMiddleware], bill.rahvarFines);
router.post('/v1/bill-pay',[jwtMiddleware], bill.billPay);
router.post('/v1/bill-pay-card',[jwtMiddleware], bill.billPayCard);
router.post('/v1/register-data',[jwtMiddleware], bill.registerData);
router.get('/v1/get-data',[jwtMiddleware], bill.getData);

module.exports = router;
