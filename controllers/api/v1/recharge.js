const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');
const request = require('request');
const axios = require('axios');

const User = require('../../../models/user');
const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.recharge = async (req, responseA, next) => {

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let bankId = req.headers.bankId;

    let mobile = req.mobile;
    let pan = req.body.pan;
    let pin = req.body.pin;
    let cvv2 = req.body.cvv2;
    let exp_date = req.body.exp_date;
    let mobileRecharge = req.body.mobile;
    let mobileOperatorId = req.body.mobileOperatorId;
    let rechargeCode = req.body.rechargeCode;
    let amount = req.body.amount;



    let dataHolder = {
        pan: pan,
        pin: pin,
        cvv2: cvv2,
        exp_date: exp_date,
        mobile: mobileRecharge,
        mobileOperatorId: mobileOperatorId,
        rechargeCode: rechargeCode,
        amount: amount,
    };
    let rulesHolder = {
        pan: 'required|numeric',
        pin: 'required',
        cvv2: 'required',
        exp_date: 'required',
        mobile: 'required',
        mobileOperatorId: 'required',
        rechargeCode: 'required',
        amount: 'required',
    };

    let validationHolder = new Validator(dataHolder, rulesHolder);

    if (validationHolder.fails()) {
        let errors = [];
        if (validationHolder.errors.get('pan').length > 0) {
            validationHolder.errors.get('pan').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pan";
                element.originalValue = req.body.pan;
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validationHolder.errors.get('pin').length > 0) {
            validationHolder.errors.get('pin').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pin";
                element.originalValue = req.body.pin;
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validationHolder.errors.get('mobile').length > 0) {
            validationHolder.errors.get('mobile').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "mobile";
                element.originalValue = req.body.mobile;
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validationHolder.errors.get('mobileOperatorId').length > 0) {
            validationHolder.errors.get('mobileOperatorId').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "mobileOperatorId";
                element.originalValue = req.body.mobileOperatorId;
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validationHolder.errors.get('rechargeCode').length > 0) {
            validationHolder.errors.get('rechargeCode').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "rechargeCode";
                element.originalValue = req.body.rechargeCode;
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validationHolder.errors.get('cvv2').length > 0) {
            validationHolder.errors.get('cvv2').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "cvv2";
                element.originalValue = req.body.cvv2;
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validationHolder.errors.get('amount').length > 0) {
            validationHolder.errors.get('amount').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "amount";
                element.originalValue = req.body.amount;
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validationHolder.errors.get('exp_date').length > 0) {
            validationHolder.errors.get('exp_date').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "exp_date";
                element.originalValue = req.body.exp_date;
                element.extraData = "";
                errors.push(element);
            });
        }

        let response = Helpers.sendJson(0,  errors,
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
        // let responseLogin;

        // try {
        //      responseLogin =  await axios({
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
        // token = responseLogin.token;
        //     console.log(responseLogin);
        // } catch (error) {
        //     console.error(error);
        // let resJson = Helpers.sendJson(0, [],
        //     "داده ای از سرور دریافت نشد.", "Fail", {});
        // return responseA.status(500).json(resJson);
        // }

        let cardsYargan = "5029381014694905";
        let dataHolder = JSON.stringify({
            "pan": pan,
            "destination_pan": cardsYargan,
            "track2": "",
            "pin": pin,
            "pin_type": "CARD"
        });

        let responseHolder;
        try {
            responseHolder = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/cards/holder',
                    data: dataHolder,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
                        'Bank-Id': typeof (bankId) != "undefined" && bankId !== null ? bankId : "BOOMIR",
                        'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
                        "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
                        "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
                        "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
                        "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",
                        "CLIENT-PLATFORM-TYPE": typeof (clientPlatformType) != "undefined" && clientPlatformType !== null ? clientPlatformType : "ANDROID",
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(dataHolder)
                    }
                }
            );
            // console.log(response.toString());
            console.log(responseHolder.data);
        } catch (error) {

            let errors = [];
            if (error.response.data.errors.length > 0) {
                error.response.data.errors.forEach(function (item) {
                    let element = {};
                    element.errorCode = 3;
                    element.errorDescription = item.message;
                    element.referenceName = typeof (item.reference) != "undefined" && item.reference !== null ? item.reference : "";
                    element.originalValue = "";
                    element.extraData = "";
                    errors.push(element);
                });
            }

            console.error(error.response.data.errors);
            let resJson = Helpers.sendJson(0, errors,
                "خطا از سمت سرویس دهنده می باشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }


        if (responseHolder.status === 200) {
            let dataTransfer = JSON.stringify({
                "pan": pan,
                "pin": pin,
                "pin_type": "CARD",
                "cvv2": cvv2,
                "exp_date": exp_date,
                "destination": cardsYargan,
                "destination_type": "PAN",
                "amount": amount,
                "track2": "",
                "receiver_name": "",
                "holder_transaction_id": responseHolder.data.transaction_id,
                "merchant_id": "",
            });

            let responseTransfer;
            try {
                responseTransfer = await axios({
                        method: 'POST',
                        url: 'https://api.sandbox.faraboom.co/v1/cards/transfer',
                        data: dataTransfer,
                        headers: {
                            "Accept-Language": "fa",
                            "App-Key": "13509",
                            "Device-Id": "192.168.1.1",
                            'Bank-Id': 'BOOMIR',
                            'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
                            "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
                            "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
                            "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
                            "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",
                            "CLIENT-PLATFORM-TYPE": "ANDROID",
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(dataTransfer)
                        }
                    }
                );
                // console.log(response.toString());
                console.log(responseTransfer.data);
            } catch (error) {

                let errors = [];
                if (error.response.data.errors.length > 0) {
                    error.response.data.errors.forEach(function (item) {
                        let element = {};
                        element.errorCode = 3;
                        element.errorDescription = item.message;
                        element.referenceName = typeof (item.reference) != "undefined" && item.reference !== null ? item.reference : "";
                        element.originalValue = "";
                        element.extraData = "";
                        errors.push(element);
                    });
                }

                console.error(error.response.data.errors);
                let resJson = Helpers.sendJson(0, errors,
                    "خطا از سمت سرویس دهنده می باشد.", "Fail", {});
                return responseA.status(500).json(resJson);
            }


            // let responseData = responseTransfer.data;

            if (responseTransfer.status === 200) {
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
                                    "mobileOperatorId": mobileOperatorId,
                                    "amount": amount,
                                    "mobileNumber": mobileRecharge,
                                    "rechargeCode": rechargeCode,
                                    "clientTransactionId": '' + momment().unix() * 1000
                                },
                                json: true,
                            };

                            request(options2, function (error2, response2, body2) {

                                if (error2) {
                                    let resJson2 = Helpers.sendJson(0,  [],
                                        error2.toString(), "Fail", {});
                                    return responseA.status(error2.statusCode).json(resJson2);
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
                                            let resJson3 = Helpers.sendJson(0,  [],
                                                error3.toString(), "Fail", {});
                                            return responseA.status(error3.statusCode).json(resJson3);
                                        }

                                        console.log(body3)

                                        if (response3.statusCode == 200) {

                                            let resJson3 = Helpers.sendJson(1,  [],
                                                [], "Success", body3);
                                            return responseA.status(200).json(resJson3);
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
                                    let resJson = Helpers.sendJson(0,  [],
                                        error.toString(), "Fail", {});
                                    return responseA.status(error.statusCode).json(resJson);
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
                                        "mobileOperatorId": mobileOperatorId,
                                        "amount": amount,
                                        "mobileNumber": mobileRecharge,
                                        "rechargeCode": rechargeCode,
                                        "clientTransactionId": '' + momment().unix() * 1000
                                    },
                                    json: true,
                                };

                                request(options2, function (error2, response2, body2) {

                                    if (error2) {
                                        let resJson2 = Helpers.sendJson(0,  [],
                                            error2.toString(), "Fail", {});
                                        return responseA.status(error2.statusCode).json(resJson2);
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
                                                let resJson3 = Helpers.sendJson(0,  [],
                                                    error3.toString(), "Fail", {});
                                                return responseA.status(error3.statusCode).json(resJson3);
                                            }

                                            console.log(body3)

                                            if (response3.statusCode == 200) {

                                                let resJson3 = Helpers.sendJson(1,  [],
                                                    [], "Success", body3);
                                                return responseA.status(200).json(resJson3);
                                            }


                                        });

                                    }


                                });


                            });


                        }
                    });
            }
        }


    }


};

