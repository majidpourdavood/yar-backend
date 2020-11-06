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
    let clientPlatformType = req.headers.clientPlatformType;
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
            "bill_id": req.body.bill_id
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/vas/tavanir/bills',
                    data: data,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
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

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "قبض برق با موفقیت دریافت شد.", "getElectricityBill", responseData);
        return responseA.status(200).json(resJson);

    }


};

exports.billPayCard = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let mobile = req.mobile;
    let pan = req.body.pan;
    let pin = req.body.pin;
    let exp_date = req.body.exp_date;
    let cvv2 = req.body.cvv2;
    let amount = req.body.amount;
    let bill_id = req.body.bill_id;
    let pay_id = req.body.pay_id;


    let data = {
        bill_id: bill_id,
        pay_id: pay_id,
        pan: pan,
        pin: pin,

    };
    let rules = {
        bill_id: 'required',
        pay_id: 'required',
        pan: 'required',
        pin: 'required',
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
        if (validation.errors.get('pay_id').length > 0) {
            validation.errors.get('pay_id').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pay_id";
                element.originalValue = req.body.pay_id;
                element.extraData = "";
                errors.push(element);
                //
            });
        }
        if (validation.errors.get('pan').length > 0) {

            validation.errors.get('pan').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pan";
                element.originalValue = req.body.pan;
                element.extraData = "";
                errors.push(element);
                //
            });
        }
        if (validation.errors.get('pin').length > 0) {
            validation.errors.get('pin').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pin";
                element.originalValue = req.body.pin;
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
            "pan" : pan,
            "track2" : "",
            "pin" : pin,
            "pin_type" : "CARD",
            "cvv2" : cvv2,
            "exp_date" : exp_date,
            "merchant_id" : "",
            "require_verification" : "",
            "verification_expiration_time_out" : "",
            "amount" : amount,
            "bill_id": bill_id,
            "pay_id" : pay_id
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/bills/'+bill_id+'/payments/'+ pay_id +'/card',
                    data: data,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
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

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            " پرداخت با موفقیت انجام شد.", "billPayCard", responseData);
        return responseA.status(200).json(resJson);

    }


};

exports.billPay = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;

    // get bank from number cart boom-pasargad-mellat-iranzamin-
    let bankId = req.headers.bankId;
    let mobile = req.mobile;
    let bill_id = req.body.bill_id;
    let pay_id = req.body.pay_id;


    let data = {
        bill_id: bill_id,
        pay_id: pay_id,

    };
    let rules = {
        bill_id: 'required',
        pay_id: 'required',
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
        if (validation.errors.get('pay_id').length > 0) {
            validation.errors.get('pay_id').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "pay_id";
                element.originalValue = req.body.pay_id;
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


        // let data = JSON.stringify({
        //     "bill_id": req.body.bill_id,
        //     "pay_id": req.body.pay_id
        // });

        let response;
        try {
            response = await await axios({
                    method: 'GET',
                    url: 'https://api.sandbox.faraboom.co/v1/bills/' + bill_id + '/payments/' + pay_id,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
                        "Bank-Id": typeof (bankId) != "undefined" && bankId !== null ? bankId : "BOOMIR",
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
        } catch (error) {

            console.log(error.response.data.errors);
            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "استعلام  با موفقیت دریافت شد.", "billPay", responseData);
        return responseA.status(200).json(resJson);

    }


};


exports.registerData = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let mobile = req.mobile;
    let value = req.body.value;
    let type = req.body.type;


    let user;
    try {
        user = await User.findOne({
            mobile: mobile
        });
    } catch (error) {
        let resJson = Helpers.sendJson(0, [],
            "کاربر در دیتابیس وجود ندارد", "Fail", {});
        return responseA.status(404).json(resJson);
    }

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
            return responseA.status(500).json(resJson);
        }

    }

};

exports.getData = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.query.type);
    console.log(req.mobile);

    let mobile = req.mobile;

    let user;
    try {
        user = await User.findOne({
            mobile: mobile
        });
    } catch (error) {
        let resJson = Helpers.sendJson(0, [],
            "کاربر در دیتابیس وجود ندارد", "Fail", {});
        return responseA.status(404).json(resJson);
    }

    let message;
    let type = typeof (req.query.type) != "undefined" && req.query.type !== null ? req.query.type : 0;

    console.log(type);

    //water-0  Electricity-1 Gas-2 Phone-3 Mobile-4 Motorcycle car-5
    switch (type) {
        case 0:
            message = "لیست شناسه قبض وجود ندارد.";
            break;
        case 1:
            message = "لیست شناسه قبض وجود ندارد.";
            break;
        case 2:
            message = "لیست شناسه مشتری وجود ندارد.";
            break;
        case 3:
            message = "لیست تلفن وجود ندارد.";
            break;
        case 4:
            message = "لیست موبایل وجود ندارد.";
            break;
        case 5:
            message = "لیست بارکد وجود ندارد.";
            break;
        default:
            message = "لیست شناسه  وجود ندارد.";
    }

    let response;
    try {
        response = await Bill.find({
                type: type, userId: user._id, active: true
            },
            function (err, bills) {
                console.log(bills);
                if (bills.length > 0) {
                    let data = [];

                    bills.forEach(function (item) {
                        let element = {};
                        element.type = item.type;
                        element.value = item.value;
                        element.createdAt = moment(item.createdAt).locale('fa').format('YYYY/MM/DD');
                        data.push(element);
                        //
                    });

                    //water-0  Electricity-1 Gas-2 Phone-3 Mobile-4 Motorcycle car-5
                    switch (type) {
                        case 0:
                            message = "لیست شناسه قبض نمایش داده شد!!";
                            break;
                        case 1:
                            message = "لیست شناسه قبض نمایش داده شد!!";
                            break;
                        case 2:
                            message = "لیست شناسه مشتری نمایش داده شد!!";
                            break;
                        case 3:
                            message = "لیست تلفن نمایش داده شد!!";
                            break;
                        case 4:
                            message = "لیست موبایل نمایش داده شد!!";
                            break;
                        case 5:
                            message = "لیست بارکد نمایش داده شد!!";
                            break;
                        default:
                            message = "لیست شناسه  نمایش داده شد!!";
                    }
                    // let dataJSon = {"data": data};
                    let resJson2 = Helpers.sendJson(1, [],
                        message, "ShowList", data);
                    return responseA.status(200).json(resJson2);

                } else {

                    let resJson = Helpers.sendJson(0, [],
                        message, "NotFound", {});
                    return responseA.status(404).json(resJson);
                }
            });
        // console.log(response.toString());
        console.log(response);
    } catch (error) {

        let resJson = Helpers.sendJson(0, [],
            "داده ای از سرور دریافت نشد.", "Fail", {});
        return responseA.status(500).json(resJson);
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
    let clientPlatformType = req.headers.clientPlatformType;
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
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
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
            console.log(error.response.data.errors);

            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "قبض آب با موفقیت دریافت شد.", "getWaterBill", responseData);
        return responseA.status(200).json(resJson);

    }


};

exports.gasBill = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let mobile = req.mobile;
    let customer_id = req.body.customer_id;


    let data = {
        customer_id: customer_id,
    };
    let rules = {
        customer_id: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('customer_id').length > 0) {

            validation.errors.get('customer_id').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "customer_id";
                element.originalValue = req.body.customer_id;
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
            "customer_id": req.body.customer_id,
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/vas/gas/bills',
                    data: data,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
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
            console.log(error.response.data.errors);

            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "قبض گاز با موفقیت دریافت شد.", "getGasBill", responseData);
        return responseA.status(200).json(resJson);

    }


};

exports.phoneBill = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let mobile = req.mobile;
    let phone = req.body.phone;
    let midterm = typeof (req.body.midterm) != "undefined" && req.body.midterm !== null ? req.body.midterm : true;


    let data = {
        phone: phone,
    };
    let rules = {
        phone: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('phone').length > 0) {

            validation.errors.get('phone').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "phone";
                element.originalValue = req.body.phone;
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
            "phone": phone,
            "midterm": midterm,
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/vas/phone/bills',
                    data: data,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
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
            console.log(error.response.data.errors);

            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "قبض تلفن با موفقیت دریافت شد.", "getPhoneBill", responseData);
        return responseA.status(200).json(resJson);

    }


};

exports.mobileBill = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let mobile = req.mobile;
    let mobileBody = req.body.mobile;
    let midterm = typeof (req.body.midterm) != "undefined" && req.body.midterm !== null ? req.body.midterm : true;


    let data = {
        mobile: mobileBody,
    };
    let rules = {
        mobile: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('mobile').length > 0) {

            validation.errors.get('mobile').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "mobile";
                element.originalValue = req.body.mobile;
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
            "mobile": mobileBody,
            "midterm": midterm,
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/vas/mobile/bills',
                    data: data,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
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
            console.log(error.response.data.errors);

            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "قبض موبایل با موفقیت دریافت شد.", "getMobileBill", responseData);
        return responseA.status(200).json(resJson);

    }


};

exports.rahvarFines = async (req, responseA, next) => {

    // console.log(req);
    console.log(req.mobile);
    console.log(req.headers.clientDeviceId);

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    let clientDeviceId = req.headers.clientDeviceId;
    let clientIpAddress = req.headers.clientIpAddress;
    let clientUserAgent = req.headers.clientUserAgent;
    let clientPlatformType = req.headers.clientPlatformType;
    let mobile = req.mobile;
    let barcode = req.body.barcode;


    let data = {
        barcode: barcode,
    };
    let rules = {
        barcode: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('barcode').length > 0) {

            validation.errors.get('barcode').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "barcode";
                element.originalValue = req.body.barcode;
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
            "barcode": barcode,
        });

        let response;
        try {
            response = await await axios({
                    method: 'POST',
                    url: 'https://api.sandbox.faraboom.co/v1/vas/rahvar/fines',
                    data: data,
                    headers: {
                        "Accept-Language": process.env.Accept_Language_Faraboom,
                        "App-Key": process.env.App_Key_Faraboom,
                        "Device-Id": process.env.Device_Id_Faraboom,
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
            console.log(error.response.data.errors);

            let resJson = Helpers.sendJson(0, [],
                "داده ای از سرور دریافت نشد.", "Fail", {});
            return responseA.status(500).json(resJson);
        }

        let responseData = response.data;

        let resJson = Helpers.sendJson(1, [],
            "استعلام با موفقیت انجام شد.", "getrahvarFines", responseData);
        return responseA.status(200).json(resJson);

    }


};
