const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');
const axios = require('axios');


const User = require('../../../models/user');
const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');


exports.cardsHolder = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    // console.log(req.headers.clientDeviceId);


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let bankId = req.headers.bankId;

    let mobile = req.mobile;
    let pan = req.body.pan;
    let pin = req.body.pin;
    // let cvv2 = req.body.cvv2;
    // let exp_date = req.body.exp_date;
    let destination_pan = req.body.destination_pan;
    // let amount = req.body.amount;

    let data = {
        pan: pan,
        pin: pin,
    };
    let rules = {
        pan: 'required|numeric',
        pin: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('pan').length > 0) {
            validation.errors.get('pan').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pan";
                element.originalValue = typeof (req.body.pan) != "undefined" && req.body.pan !== null ? req.body.pan : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('pin').length > 0) {
            validation.errors.get('pin').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pin";
                element.originalValue = typeof (req.body.pin) != "undefined" && req.body.pin !== null ? req.body.pin : "";
                element.extraData = "";
                errors.push(element);
            });
        }


        let response = Helpers.sendJson(0, errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return responseA.status(400).json(response);
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
        //     console.log(error);
        // let resJson = Helpers.sendJson(0, [],
        //     "داده ای از سرور دریافت نشد.", "Fail", {});
        // return responseA.status(500).json(resJson);
        // }


        let data = JSON.stringify({
            "pan": pan,
            "destination_pan": destination_pan,
            // "track2": "",
            "pin": pin,
            "pin_type": "CARD",
            // "cvv2": cvv2,
            // "exp_date": exp_date,
            // "loan_number": "",
            // "amount": amount
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/cards/holder',
                    data: data,
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
                        'Content-Length': Buffer.byteLength(data)
                    }
                }
            );
            // console.log(response.toString());
            console.log(response.data);
            console.log(response.status);
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

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, errors,
                "خطا از سمت سرویس دهنده می باشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }


        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "مشخصات صاحب کارت با موفقیت دریافت شد.", "getCardsHolder", responseData);
        return responseA.status(200).json(resJson);

    }

};


exports.cardsTransactions = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    // console.log(req.headers.clientDeviceId);


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
    let from_date = req.body.from_date;
    let to_date = req.body.to_date;
    let to_amount = req.body.to_amount;
    let from_amount = req.body.from_amount;
    let transaction_types = req.body.transaction_types;
    let destination_pan = req.body.destination_pan;

    let data = {
        pan: pan,
        pin: pin,
        cvv2: cvv2,
        exp_date: exp_date,
        transaction_types: transaction_types,
    };
    let rules = {
        pan: 'required|numeric',
        pin: 'required',
        cvv2: 'required',
        exp_date: 'required',
        transaction_types: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('pan').length > 0) {
            validation.errors.get('pan').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pan";
                element.originalValue = typeof (req.body.pan) != "undefined" && req.body.pan !== null ? req.body.pan : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('transaction_types').length > 0) {
            validation.errors.get('transaction_types').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "transaction_types";
                element.originalValue = typeof (req.body.transaction_types) != "undefined" && req.body.transaction_types !== null ? req.body.transaction_types : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('pin').length > 0) {
            validation.errors.get('pin').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pin";
                element.originalValue = typeof (req.body.pin) != "undefined" && req.body.pin !== null ? req.body.pin : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('cvv2').length > 0) {
            validation.errors.get('cvv2').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "cvv2";
                element.originalValue = typeof (req.body.cvv2) != "undefined" && req.body.cvv2 !== null ? req.body.cvv2 : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('exp_date').length > 0) {
            validation.errors.get('exp_date').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "exp_date";
                element.originalValue = typeof (req.body.exp_date) != "undefined" && req.body.exp_date !== null ? req.body.exp_date : "";
                element.extraData = "";
                errors.push(element);
            });
        }
        let response = Helpers.sendJson(0, errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return responseA.status(400).json(response);
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
        //     console.log(error);
        // let resJson = Helpers.sendJson(0, [],
        //     "داده ای از سرور دریافت نشد.", "Fail", {});
        // return responseA.status(500).json(resJson);
        // }

        console.log(transaction_types)
        let data = JSON.stringify({
            "pan": pan,
            "destination_pan": destination_pan,
            // "track2": "",
            "pin": pin,
            "pin_type": "CARD",
            "cvv2": cvv2,
            "exp_date": exp_date,
            "transaction_types": transaction_types,
            "from_date": from_date,
            "to_date": to_date,
            "from_amount": from_amount,
            "to_amount": to_amount,
            "offset":0,
            "length":0
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/cards/' + pan + '/transactions ',
                    data: data,
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
                        'Content-Length': Buffer.byteLength(data)
                    }
                }
            );
            // console.log(response.toString());
            console.log(response.data);
            console.log(response.status);
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

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, errors,
                "خطا از سمت سرویس دهنده می باشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }


        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "لیست تراکنش های کارت با موفقیت دریافت شد.", "getCardsTransactions", responseData);
        return responseA.status(200).json(resJson);

    }

};

exports.ibanInfo = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    // console.log(req.headers.clientDeviceId);


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let bankId = req.headers.bankId;

    let mobile = req.mobile;
    let iban = req.body.iban;

    let data = {
        iban: iban,
    };
    let rules = {
        iban: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('iban').length > 0) {
            validation.errors.get('iban').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "iban";
                element.originalValue = typeof (req.body.iban) != "undefined" && req.body.iban !== null ? req.body.iban : "";
                element.extraData = "";
                errors.push(element);
            });
        }


        let response = Helpers.sendJson(0, errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return responseA.status(400).json(response);
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
        //     console.log(error);
        // let resJson = Helpers.sendJson(0, [],
        //     "داده ای از سرور دریافت نشد.", "Fail", {});
        // return responseA.status(500).json(resJson);
        // }


        let response;
        try {
            response = await await axios({
                    method: 'GET',
                    url: 'https://api.sandbox.faraboom.co/v1/ach/iban/' + iban + '/info ',
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
                    }
                }
            );
            // console.log(response.toString());
            console.log(response.data);
            console.log(response.status);
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

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, errors,
                "خطا از سمت سرویس دهنده می باشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }


        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "اطلاعات شبا با موفقیت دریافت شد.", "getIbanInfo", responseData);
        return responseA.status(200).json(resJson);

    }

};


exports.cardsTransfer = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let bankId = req.headers.bankId;

    let pan = req.body.pan;
    let pin = req.body.pin;
    let cvv2 = req.body.cvv2;
    let exp_date = req.body.exp_date;
    let destination = req.body.destination;
    let amount = req.body.amount;
    let holder_transaction_id = req.body.holder_transaction_id;

    let data = {
        pan: pan,
        pin: pin,
        destination: destination,
        cvv2: cvv2,
        exp_date: exp_date,
        amount: amount,
    };
    let rules = {
        pan: 'required|numeric',
        pin: 'required',
        destination: 'required',
        cvv2: 'required',
        exp_date: 'required',
        amount: 'required',
    };


    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('pan').length > 0) {
            validation.errors.get('pan').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pan";
                element.originalValue = typeof (req.body.pan) != "undefined" && req.body.pan !== null ? req.body.pan : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('destination').length > 0) {
            validation.errors.get('destination').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "destination";
                element.originalValue = typeof (req.body.destination) != "undefined" && req.body.destination !== null ? req.body.destination : "";
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validation.errors.get('cvv2').length > 0) {
            validation.errors.get('cvv2').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "cvv2";
                element.originalValue = typeof (req.body.cvv2) != "undefined" && req.body.cvv2 !== null ? req.body.cvv2 : "";
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validation.errors.get('pin').length > 0) {
            validation.errors.get('pin').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pin";
                element.originalValue = typeof (req.body.pin) != "undefined" && req.body.pin !== null ? req.body.pin : "";
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validation.errors.get('exp_date').length > 0) {
            validation.errors.get('exp_date').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "exp_date";
                element.originalValue = typeof (req.body.exp_date) != "undefined" && req.body.exp_date !== null ? req.body.exp_date : "";
                element.extraData = "";
                errors.push(element);
            });
        }
        if (validation.errors.get('amount').length > 0) {
            validation.errors.get('amount').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "amount";
                element.originalValue = typeof (req.body.amount) != "undefined" && req.body.amount !== null ? req.body.amount : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        let response = Helpers.sendJson(0, errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return responseA.status(400).json(response);
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
        //     console.log(error);
        // let resJson = Helpers.sendJson(0, [],
        //     "داده ای از سرور دریافت نشد.", "Fail", {});
        // return responseA.status(500).json(resJson);
        // }


        let data = JSON.stringify({
            "pan": pan,
            "pin": pin,
            "pin_type": "CARD",
            "cvv2": cvv2,
            "exp_date": exp_date,
            "destination": destination,
            "destination_type": "PAN",
            "amount": amount,
            "track2": "",
            "receiver_name": "",
            "holder_transaction_id": holder_transaction_id,
            "merchant_id": "",
        });

        let response;
        try {
            response = await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/cards/transfer',
                    data: data,
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
                        'Content-Length': Buffer.byteLength(data)
                    }
                }
            );
            // console.log(response.toString());
            console.log(response.data);
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

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, errors,
                "خطا از سمت سرویس دهنده می باشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "تراکنش با موفقیت انجام شد.", "getCardsHolder", responseData);
        return responseA.status(200).json(resJson);

    }

};

exports.balance = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

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

    let data = {
        pan: pan,
        pin: pin,
        cvv2: cvv2,
        exp_date: exp_date,
    };
    let rules = {
        pan: 'required|numeric',
        pin: 'required',
        cvv2: 'required',
        exp_date: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('pan').length > 0) {
            validation.errors.get('pan').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pan";
                element.originalValue = typeof (req.body.pan) != "undefined" && req.body.pan !== null ? req.body.pan : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('pin').length > 0) {
            validation.errors.get('pin').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pin";
                element.originalValue = typeof (req.body.pin) != "undefined" && req.body.pin !== null ? req.body.pin : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('cvv2').length > 0) {
            validation.errors.get('cvv2').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "cvv2";
                element.originalValue = typeof (req.body.cvv2) != "undefined" && req.body.cvv2 !== null ? req.body.cvv2 : "";
                element.extraData = "";
                errors.push(element);
            });
        }

        if (validation.errors.get('exp_date').length > 0) {
            validation.errors.get('exp_date').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "exp_date";
                element.originalValue = typeof (req.body.exp_date) != "undefined" && req.body.exp_date !== null ? req.body.exp_date : "";
                element.extraData = "";
                errors.push(element);
            });
        }
        let response = Helpers.sendJson(0, errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return responseA.status(400).json(response);
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
        //     console.log(error);
        // let resJson = Helpers.sendJson(0, [],
        //     "داده ای از سرور دریافت نشد.", "Fail", {});
        // return responseA.status(500).json(resJson);
        // }


        let data = JSON.stringify({
            "pan": pan,
            "track2": "",
            "pin": pin,
            "pin_type": "CARD",
            "cvv2": cvv2,
            "exp_date": exp_date,
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/cards/' + pan + '/balance',
                    data: data,
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
                        'Content-Length': Buffer.byteLength(data)
                    }
                }
            );
            // console.log(response.toString());
            console.log(response.data);
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

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, errors,
                "خطا از سمت سرویس دهنده می باشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }


        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "موجودی کارت با موفقیت دریافت شد.", "getBalance", responseData);
        return responseA.status(200).json(resJson);

    }


};


// exports.balance = async (req, responseA, next) => {
//
//     // console.log(req);
//     console.log(req.mobile);
//     console.log(req.headers.clientDeviceId);
//
//     process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
//
//     let clientDeviceId = req.headers.clientDeviceId;
//     let clientIpAddress = req.headers.clientIpAddress;
//     let clientUserAgent = req.headers.clientUserAgent;
//     let mobile = req.mobile;
//     let pan = req.body.pan;
//     let cvv2 = req.body.cvv2;
//     let exp_date = req.body.exp_date;
//
//     let data = {
//         pan: pan,
//         cvv2: cvv2,
//         exp_date: exp_date,
//     };
//     let rules = {
//         pan: 'required|numeric',
//         cvv2: 'required',
//         exp_date: 'required',
//     };
//
//     let validation = new Validator(data, rules);
//
//     if (validation.fails()) {
//         let errors = [];
//         if (validation.errors.get('mobile').length > 0) {
//
//             validation.errors.get('mobile').forEach(function (item) {
//                 let element = {};
//                 element.errorCode = 2;
//                 element.errorDescription = item;
//                 element.referenceName = "mobile";
//                 element.originalValue = req.body.mobile;
//                 element.extraData = "";
//                 errors.push(element);
//                 //
//             });
//         }
//
//
//         let response = Helpers.sendJson(0,  errors,
//             "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
//         return res.status(400).json(response);
//     } else {
//         let dataLogin = JSON.stringify({
//             "username": "yargan",
//             "password": "Yy123456@",
//             "client_id": ""
//         });
//         //
//         let token;
//         // let response1;
//
//         // try {
//         //     const response1 = await  await axios({
//         //             method: 'POST',
//         //             url: 'https://api.sandbox.faraboom.co/v1/auth/market/login',
//         //             data: dataLogin,
//         //             headers: {
//         //                 "Accept-Language": "fa",
//         //                 "App-Key": "13509",
//         //                 "Device-Id": "192.168.1.1",
//         //                 "CLIENT-DEVICE-ID": "121457845122222",
//         //                 "CLIENT-IP-ADDRESS": "127.0.0.1",
//         //                 "CLIENT-USER-AGENT":  "android - Android 5.1 - Sumsung - Gallexy8",
//         //                 "CLIENT-USER-ID":  "09360405004",
//         //                 "CLIENT-PLATFORM-TYPE": "ANDROID",
//         //                 'Content-Type': 'application/json',
//         //                 'Content-Length': Buffer.byteLength(dataLogin)
//         //             }
//         //         }
//         //     );
//         //     console.log(response1);
//         // } catch (error) {
//         //     console.log(error);
//         //     let resJson = Helpers.sendJson(0,  [],
//         //         error.toString(), "Fail1", {});
//         //     return responseA.status(400).json(resJson);
//         // }
//
//
//         let data = JSON.stringify({
//             "pan": req.body.pan,
//             "track2": "",
//             "pin": req.body.pin,
//             "pin_type": "CARD",
//             "cvv2": req.body.cvv2,
//             "exp_date": req.body.exp_date,
//             "loan_number": "",
//             "amount": req.body.amount
//         });
//
//         let response;
//         try {
//             response = await await axios({
//                     method: 'POST',
//                     url: 'https://api.sandbox.faraboom.co/v1/cards/balance',
//                     data: data,
//                     headers: {
//                         "Accept-Language": "fa",
//                         "App-Key": "13509",
//                         "Device-Id": "192.168.1.1",
//                         'Bank-Id': 'BOOMIR',
//                         // 'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
//                         // "CLIENT-DEVICE-ID": "121457845122222",
//                         // "CLIENT-IP-ADDRESS": "127.0.0.1",
//                         // "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
//                         // "CLIENT-USER-ID": "09360405004",
//
//                         'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
//                         "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
//                         "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
//                         "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
//                         "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",
//
//                         "CLIENT-PLATFORM-TYPE": "ANDROID",
//                         'Content-Type': 'application/json',
//                         'Content-Length': Buffer.byteLength(data)
//                     }
//                 }
//             );
//             // console.log(response.toString());
//             console.log(response.data);
//         } catch (error) {
//
//             console.log(error);
//             let resJson = Helpers.sendJson(0,  [],
//                 error.toString(), "Fail", {});
//             return responseA.status(400).json(resJson);
//         }
//
//
//         let responseData = response.data;
//
//         let resJson = Helpers.sendJson(1, [],
//             "success", "success", responseData);
//         return responseA.status(200).json(resJson);
//
//     }
//
//
//
//
//
//
//     // 'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
//     //     "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
//     //     "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
//     //     "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
//     //     "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",
//
//     // {
//     //     "switch_response_rrn": "030216458621",
//     //     "available_balance": 2200139526,
//     //     "ledger_balance": 2200139526,
//     //     "currency": "IRR"
//     // }
//
//
//     // type transaction 0-cart 1-bill 2-recharge 3-internet 4-balance
//     // let responseData = {
//     //     "type": 4,
//     //     "status": 1,
//     //     "createdAt": momment(),
//     //     "refId": "",
//     //     "reference": "",
//     //     "pinStart": "",
//     //     "pinDestination": "",
//     //     "nameDestinationCart": "",
//     //     "amount": "",
//     //     "error": "",
//     //     "description": "",
//     //     "billingID": "",
//     //     "paymentCode": "",
//     //     "mobileRecharge": "",
//     //
//     // };
//     //
//     // let resJson = Helpers.sendJson(0,  [],
//     //     error.toString(), "Fail", responseData);
//     // return responseA.status(200).json(resJson);
//
// };

