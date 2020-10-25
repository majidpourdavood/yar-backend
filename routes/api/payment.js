const express = require('express');
const { body } = require('express-validator');

const CardTransferController = require('../../controllers/api/v1/CardTransferController');

const router = express.Router();

router.get('/getDetailCart', CardTransferController.getDetailCart);
router.get('/billingInquiryFinotech', CardTransferController.billingInquiryFinotech);
router.get('/directChargeFaraboom', CardTransferController.directChargeFaraboom);
router.get('/getEtcard', CardTransferController.getEtcard);

module.exports = router;
