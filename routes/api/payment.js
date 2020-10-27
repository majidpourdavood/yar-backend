const express = require('express');
const { body } = require('express-validator');

const CardTransferController = require('../../controllers/api/v1/CardTransferController');
const card = require('../../controllers/api/v1/card');

const router = express.Router();

router.get('/getDetailCart', CardTransferController.getDetailCart);
router.get('/billingInquiryFinotech', CardTransferController.billingInquiryFinotech);
router.get('/directChargeFaraboom', CardTransferController.directChargeFaraboom);
router.get('/getEtcard', CardTransferController.getEtcard);


router.post('/v1/balance', card.balance);

module.exports = router;
