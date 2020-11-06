const express = require('express');
const { body } = require('express-validator');

const CardTransferController = require('../../controllers/api/v1/CardTransferController');
const card = require('../../controllers/api/v1/card');
const jwtMiddleware = require('../../middleware/api/is-auth');

const router = express.Router();

router.get('/getDetailCart', CardTransferController.getDetailCart);
router.get('/billingInquiryFinotech', CardTransferController.billingInquiryFinotech);
router.get('/directChargeFaraboom', CardTransferController.directChargeFaraboom);
router.get('/getEtcard', CardTransferController.getEtcard);


router.post('/v1/balance',[jwtMiddleware], card.balance);
router.post('/v1/cards-holder',[jwtMiddleware], card.cardsHolder);
router.post('/v1/cards-transfer',[jwtMiddleware], card.cardsTransfer);
router.post('/v1/cards-transactions',[jwtMiddleware], card.cardsTransactions);
router.post('/v1/iban-info',[jwtMiddleware], card.ibanInfo);

// router.post('/v1/inquire-bill-pay',[jwtMiddleware], card.inquireBillPay);

module.exports = router;
