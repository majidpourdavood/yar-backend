const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');
const request = require('request');

const User = require('../../../models/user');
const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.recharge = async (req, res, next) => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


    //transfer cart to cart merchant to yargan
    var data_body = JSON.stringify({
        // "deposit_number": "0201255801006",
        // "pan": "5029381014694897",
        // "track2": "",
        // "pin": "85509",
        // "pin_type": "CARD",
        // "cvv2": "927",
        // "exp_date": "0107",

        // "username": "yargan",
        // "password": "Yy123456@",
        // "client_id": "",

        // "bill_id": "9399349604127",

        "pan" : "5029381014694897",
        "pin" : "85509",
        "pin_type" : "CARD",
        "cvv2" : "927",
        "exp_date" : "0107",
        "destination" : "",
        "destination_pan" : "5029381014694905",
        "amount" : 10000,
        "track2" : "",
        "receiver_name" : "",
        "holder_transaction_id" : "9be21a78-c2af-4133-bf97-8c97ab78f2bf",
        "merchant_id" : "",

    });

    var optionsCardsTransfer = {
        method: 'POST',
        url: 'https://api.sandbox.faraboom.co/v1/cards/transfer',
        headers: {
            "Accept-Language": "fa",
            "App-Key": "13509",
            "Device-Id": "192.168.1.1",
            'Bank-Id': 'BOOMIR',
            'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
            "CLIENT-DEVICE-ID": "121457845122222",
            "CLIENT-IP-ADDRESS": "127.0.0.1",
            "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
            "CLIENT-USER-ID": "09360405004",
            "CLIENT-PLATFORM-TYPE": "ANDROID",
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data_body)
        },
        body: data_body
    };


    request(optionsCardsTransfer, function (errorCardsTransfer, responseCardsTransfer, bodyCardsTransfer) {
        // if (error) throw new Error(error);

        res.status(200).send(JSON.parse(responseCardsTransfer.body));
        console.log(errorCardsTransfer);
        console.log(responseCardsTransfer);
        console.log(body);

    });



    ApiToken.findOne({
            name: "qpin", tokenLife: {
                $gte: momment().add(10, 'minutes').toISOString(),
            }
        },
        function (err, qpin) {
            console.log(qpin);
            if (qpin) {

                var options2 = {
                    method: 'POST',
                    url: "https://api.qpin.ir/api/Recharge/TopupSubmit",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + qpin.token,
                        'Accept': 'application/json',
                    },
                    body: {
                        "mobileOperatorId": 2,
                        "amount": 10000,
                        "mobileNumber": "09360405004",
                        "rechargeCode": 20,
                        "clientTransactionId": '' + momment().unix() * 1000
                    },
                    json: true,
                };

                request(options2, function (error2, response2, body2) {

                    if (error2) {
                        let resJson2 = Helpers.sendJson(0, "Recharge", [],
                            error2.toString(), "Fail", []);
                        return res.status(error2.statusCode).json(resJson2);
                    }


                    if (response2.statusCode == 200) {
                        var options3 = {
                            method: 'POST',
                            url: "https://api.qpin.ir/api/Recharge/TopupConfirm",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + qpin.token,
                                'Accept': 'application/json',
                            },
                            body: {
                                "referenceNo": body2.Result.referenceNo,
                            },
                            json: true,
                        };

                        request(options3, function (error3, response3, body3) {

                            if (error3) {
                                let resJson3 = Helpers.sendJson(0, "Recharge", [],
                                    error3.toString(), "Fail", []);
                                return res.status(error3.statusCode).json(resJson3);
                            }

                            console.log(body3);

                            if (response3.statusCode == 200) {

                                let resJson3 = Helpers.sendJson(1, "Recharge", [],
                                    [], "Success", [body3]);
                                return res.status(200).json(resJson3);
                            }


                        });

                    }

                });


            } else {

                var options = {
                    method: 'POST',
                    url: "https://api.qpin.ir/api/Account/Token",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        "password": "@yargan123456",
                        "username": "yaaregan@gmail.com"
                    },
                    json: true,
                };

                request(options, function (error, response, body) {

                    // if (error) throw new Error(error);

                    if (error) {
                        let resJson = Helpers.sendJson(0, "Recharge", [],
                            error.toString(), "Fail", []);
                        return res.status(error.statusCode).json(resJson);
                    }

                    const apiToken = new ApiToken({
                        name: "qpin",
                        token: body.Result.accessToken,
                        tokenLife: body.Result.tokenExpiration,
                        refreshToken: body.Result.refreshToken,
                    });

                    apiToken.save();
                    console.log(body)

                    // res.status(200).json({apiToken});

                    var options2 = {
                        method: 'POST',
                        url: "https://api.qpin.ir/api/Recharge/TopupSubmit",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + body.Result.accessToken,
                            'Accept': 'application/json',
                        },
                        body: {
                            "mobileOperatorId": 2,
                            "amount": 10000,
                            "mobileNumber": "09360405004",
                            "rechargeCode": 20,
                            "clientTransactionId": '' + momment().unix() * 1000
                        },
                        json: true,
                    };

                    request(options2, function (error2, response2, body2) {

                        if (error2) {
                            let resJson2 = Helpers.sendJson(0, "Recharge", [],
                                error2.toString(), "Fail", []);
                            return res.status(error2.statusCode).json(resJson2);
                        }


                        if (response2.statusCode == 200) {
                            var options3 = {
                                method: 'POST',
                                url: "https://api.qpin.ir/api/Recharge/TopupConfirm",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + body.Result.accessToken,
                                    'Accept': 'application/json',
                                },
                                body: {
                                    "referenceNo": body2.Result.referenceNo,
                                },
                                json: true,
                            };

                            request(options3, function (error3, response3, body3) {

                                if (error3) {
                                    let resJson3 = Helpers.sendJson(0, "Recharge", [],
                                        error3.toString(), "Fail", []);
                                    return res.status(error3.statusCode).json(resJson3);
                                }

                                console.log(body3)

                                if (response3.statusCode == 200) {

                                    let resJson3 = Helpers.sendJson(1, "Recharge", [],
                                        [], "Success", [body3]);
                                    return res.status(200).json(resJson3);
                                }


                            });

                        }


                    });


                });


            }
        });


};

