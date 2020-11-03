// const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const moment = require('jalali-moment');
const axios = require('axios');


const User = require('../../../models/user');
const Bill = require('../../../models/bill');
// const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.electricityBill = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let mobile = req.mobile;
    let bill_id = req.body.bill_id;


    let data = {
        bill_id: bill_id,

    };
    let rules = {
        bill_id: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('bill_id').length > 0) {

            validation.errors.get('bill_id').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "bill_id";
                element.originalValue = req.body.bill_id;
                element.extraData = "";
                errors.push(element);
                //
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
        //     let resJson = Helpers.sendJson(0, [],
        //         error.toString(), "Fail1", {});
        //     return responseA.status(400).json(resJson);
        // }


        let data = JSON.stringify({
            "bill_id": req.body.bill_id
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/vas/tavanir/bills',
                    data: data,
                    headers: {
                        "Accept-Language": "fa",
                        "App-Key": "13509",
                        "Device-Id": "192.168.1.1",
                        'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
                        "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
                        "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
                        "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
                        "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",
                        "CLIENT-PLATFORM-TYPE": "ANDROID",
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(data)
                    }
                }
            );
            // console.log(response.toString());
            console.log(response.data);
        } catch (error) {

            console.error(error.response.data.errors);
            let resJson = Helpers.sendJson(0, error.response.data.errors,
                error.toString(), "Fail", {});
            return responseA.status(400).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "قبض برق با موفقیت دریافت شد.", "getElectricityBill", responseData);
        return responseA.status(200).json(resJson);

    }


};


exports.registerBill = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let mobile = req.mobile;
    let value = req.body.value;
    let type = req.body.type;


    const user = await User.findOne({
        mobile: mobile
    });

    let data = {
        value: value,

    };
    let rules = {
        value: 'required',
    };

    let message;

    //water-0  Electricity-1 Gas-2 Phone-3 Mobile-4 Motorcycle car-5
    switch (type) {
        case 0:
            message = "شناسه قبض با موفقیت ثبت شد.";
            break;
        case 1:
            message = "شناسه قبض با موفقیت ثبت شد.";
            break;
        case 2:
            message = "شناسه مشتری با موفقیت ثبت شد.";
            break;
        case 3:
            message = "تلفن با موفقیت ثبت شد.";
            break;
        case 4:
            message = "موبایل با موفقیت ثبت شد.";
            break;
        case 5:
            message = "بارکد با موفقیت ثبت شد.";
            break;
        default:
            message = "شناسه  با موفقیت ثبت شد.";
    }


    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('value').length > 0) {

            validation.errors.get('value').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "value";
                element.originalValue = req.body.value;
                element.extraData = "";
                errors.push(element);
                //
            });
        }

        let response = Helpers.sendJson(0, errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return responseA.status(400).json(response);
    } else {


        let response;
        try {
            response = await Bill.findOne({
                    type: type, value: value,
                },
                function (err, bill) {
                    console.log(bill);
                    if (bill) {
                        let userData = {
                            "type": bill.type,
                            "value": bill.value,
                            "createdAt": moment(bill.createdAt).locale('fa').format('YYYY/MM/DD'),
                        };

                        //water-0  Electricity-1 Gas-2 Phone-3 Mobile-4 Motorcycle car-5
                        switch (type) {
                            case 0:
                                message = "شناسه قبض قبلا ثبت شده است!!";
                                break;
                            case 1:
                                message = "شناسه قبض قبلا ثبت شده است!!";
                                break;
                            case 2:
                                message = "شناسه مشتری قبلا ثبت شده است!!";
                                break;
                            case 3:
                                message = "تلفن قبلا ثبت شده است!!";
                                break;
                            case 4:
                                message = "موبایل قبلا ثبت شده است!!";
                                break;
                            case 5:
                                message = "بارکد قبلا ثبت شده است!!";
                                break;
                            default:
                                message = "شناسه  قبلا ثبت شده است!!";
                        }

                        let resJson2 = Helpers.sendJson(0, [],
                            message, "ExistBill", userData);
                        return responseA.status(409).json(resJson2);

                    } else {

                        const BillSave = new Bill({
                            type: type,
                            value: value,
                            userId: user._id,
                        });
                        BillSave.save();

                        let userData = {
                            "type": BillSave.type,
                            "value": BillSave.value,
                            "createdAt": moment(BillSave.createdAt).locale('fa').format('YYYY/MM/DD'),
                        };
                        let resJson = Helpers.sendJson(1, [],
                            message, "success", userData);
                        return responseA.status(201).json(resJson);
                    }
                });
            // console.log(response.toString());
            console.log(response);
        } catch (error) {

            let resJson = Helpers.sendJson(0, [],
                error.toString(), "Fail", {});
            return responseA.status(400).json(resJson);
        }

    }

};


exports.waterBill = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let mobile = req.mobile;
    let bill_id = req.body.bill_id;


    let data = {
        bill_id: bill_id,

    };
    let rules = {
        bill_id: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('bill_id').length > 0) {

            validation.errors.get('bill_id').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "bill_id";
                element.originalValue = req.body.bill_id;
                element.extraData = "";
                errors.push(element);
                //
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
        //     let resJson = Helpers.sendJson(0,  [],
        //         error.toString(), "Fail1", {});
        //     return responseA.status(400).json(resJson);
        // }


        let data = JSON.stringify({
            "bill_id": req.body.bill_id,
            "identifier": bill_id.substr(bill_id.length - 6),
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/vas/abfa/bills',
                    data: data,
                    headers: {
                        "Accept-Language": "fa",
                        "App-Key": "13509",
                        "Device-Id": "192.168.1.1",
                        'Token-Id': typeof (token) != "undefined" && token !== null ? token : "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
                        "CLIENT-DEVICE-ID": typeof (clientDeviceId) != "undefined" && clientDeviceId !== null ? clientDeviceId : "121457845122222",
                        "CLIENT-IP-ADDRESS": typeof (clientIpAddress) != "undefined" && clientIpAddress !== null ? clientIpAddress : "127.0.0.1",
                        "CLIENT-USER-AGENT": typeof (clientUserAgent) != "undefined" && clientUserAgent !== null ? clientUserAgent : "android - Android 5.1 - Sumsung - Gallexy8",
                        "CLIENT-USER-ID": typeof (mobile) != "undefined" && mobile !== null ? mobile : "09360405004",
                        "CLIENT-PLATFORM-TYPE": "ANDROID",
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(data)
                    }
                }
            );
            // console.log(response.toString());
            console.log(response.data);
        } catch (error) {

            console.error(error.response.data.errors);
            let resJson = Helpers.sendJson(0, error.response.data.errors,
                error.toString(), "Fail", {});
            return responseA.status(400).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "قبض آب با موفقیت دریافت شد.", "getWaterBill", responseData);
        return responseA.status(200).json(resJson);

    }


};
