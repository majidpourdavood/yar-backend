const express = require('express');

const bill = require('../../controllers/api/v1/bill');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();

router.post('/v1/electricity-bill',[jwtMiddleware], bill.electricityBill);
router.post('/v1/water-bill',[jwtMiddleware], bill.waterBill);
router.post('/v1/register-bill',[jwtMiddleware], bill.registerBill);

module.exports = router;
