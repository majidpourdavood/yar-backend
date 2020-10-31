// const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
// const momment = require('jalali-moment');
const axios = require('axios');


// const User = require('../../../models/user');
// const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.inquireBillPay = async (req, responseA, next) => {

    // console.log(req);
    // console.log(req.mobile);


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;

    let mobile = req.mobile;
    let billId = req.body.billId;
    let payId = req.body.payId;


    let data = {
        billId: billId,
        payId: payId,
    };
    let rules = {
        billId: 'required',
        payId: 'required',
    };
    // console.log(data)
    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('billId').length > 0) {

            validation.errors.get('billId').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "billId";
                element.originalValue = req.body.billId;
                element.extraData = "";
                errors.push(element);
                //
            });
        }

        if (validation.errors.get('payId').length > 0) {

            validation.errors.get('payId').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "payId";
                element.originalValue = req.body.payId;
                element.extraData = "";
                errors.push(element);
                //
            });
        }
        let response = Helpers.sendJson(0, "Transaction", errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return res.status(400).json(response);
    } else {
        let dataLogin = JSON.stringify({
            "username": "yargan",
            "password": "Yy123456@",
            "client_id": ""
        });
        //
        let token;
        // let response1;

        // try {
        //     const response1 = await  await axios({
        //             method: 'POST',
        //             url: 'https://api.sandbox.faraboom.co/v1/auth/market/login',
        //             data: dataLogin,
        //             headers: {
        //                 "Accept-Language": "fa",
        //                 "App-Key": "13509",
        //                 "Device-Id": "192.168.1.1",
        //                 "CLIENT-DEVICE-ID": "121457845122222",
        //                 "CLIENT-IP-ADDRESS": "127.0.0.1",
        //                 "CLIENT-USER-AGENT":  "android - Android 5.1 - Sumsung - Gallexy8",
        //                 "CLIENT-USER-ID":  "09360405004",
        //                 "CLIENT-PLATFORM-TYPE": "ANDROID",
        //                 'Content-Type': 'application/json',
        //                 'Content-Length': Buffer.byteLength(dataLogin)
        //             }
        //         }
        //     );
        //     console.log(response1);
        // } catch (error) {
        //     console.error(error);
        //     let resJson = Helpers.sendJson(0, "Transaction", [],
        //         error.toString(), "Fail1", {});
        //     return responseA.status(400).json(resJson);
        // }

        // url: 'https://api.sandbox.faraboom.co/v1/bills/' + billId + '/payments/' + payId + '',


        let dataSend = JSON.stringify({
            "bill_id": billId
        });
        let response;

        try {
            response = await axios({
                    method: 'GET',
                    // url: 'https://api.sandbox.faraboom.co/v1/vas/tavanir/bills',
                    url: 'https://api.sandbox.faraboom.co/v1/bills/' + billId + '/payments/' + payId + '',
                    headers: {
                        "Accept-Language": "fa",
                        "App-Key": "13509",
                        "Device-Id": "192.168.1.1",
                        'Bank-Id': 'BOOMIR',
                        // 'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
                        // "CLIENT-DEVICE-ID": "121457845122222",
                        // "CLIENT-IP-ADDRESS": "127.0.0.1",
                        // "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
                        // "CLIENT-USER-ID": "09360405004",
                        'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
                        "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
                        "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
                        "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
                        "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",
                        "CLIENT-PLATFORM-TYPE": "ANDROID",
                        'Content-Type': 'application/json',
                        // 'Content-Length': Buffer.byteLength(dataSend)

                    },
                    // body: dataSend,

                }
            );
            // console.log(response.toString());
            console.log(response.data);
        } catch (error) {
            console.log(error.response);
            console.log(error.response.data.errors);

            let resJson = Helpers.sendJson(0, "Transaction", error.response.data.errors,
                "درخواست با خطا مواجه شد!", "Fail", {});
            return responseA.status(400).json(resJson);
        }


        let responseData = response.data;

        let resJson = Helpers.sendJson(1, "Transaction", [],
            "success", "success", response);
        return responseA.status(200).json(resJson);

    }


    // 'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
    //     "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
    //     "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
    //     "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
    //     "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",

    // {
    //     "switch_response_rrn": "030216458621",
    //     "available_balance": 2200139526,
    //     "ledger_balance": 2200139526,
    //     "currency": "IRR"
    // }


    // type transaction 0-cart 1-bill 2-recharge 3-internet 4-balance
    // let responseData = {
    //     "type": 4,
    //     "status": 1,
    //     "createdAt": momment(),
    //     "refId": "",
    //     "reference": "",
    //     "pinStart": "",
    //     "pinDestination": "",
    //     "nameDestinationCart": "",
    //     "amount": "",
    //     "error": "",
    //     "description": "",
    //     "billingID": "",
    //     "paymentCode": "",
    //     "mobileRecharge": "",
    //
    // };
    //
    // let resJson = Helpers.sendJson(0, "Transaction", [],
    //     error.toString(), "Fail", responseData);
    // return responseA.status(200).json(resJson);

};

