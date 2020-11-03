const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');

const User = require('../../../models/user');
const Sms = require('../../../models/sms');
const Helpers = require('../../../util/helpers');
const request = require('request');


exports.auth = (req, res, next) => {


    let code = Math.floor(100000 + Math.random() * 900000);
    console.log(code);


    // console.log(Math.round(momment().add(90, "seconds").diff(momment()) / 1000));

    const mobile = req.body.mobile;

    let data = {
        mobile: mobile,
    };
    let rules = {
        mobile: 'required|digits:11,numeric',
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

        // let response = {
        //     "status": 0,
        //     "model": "User",
        //     "errors": errors,
        //     "message": "خطا در اعتبارسنجی رخ داد!!",
        //     "action" : "ValidationError",
        //     "data": []
        // };

        let response = Helpers.sendJson(0,  errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return res.status(400).json(response);
    } else {
        User.findOne({mobile: mobile})
            .then(user => {
                // let smsUser;
                if (user) {
                    Sms.find({
                            userId: user._id, createdAt:
                                {
                                    $gte: momment().subtract(2, 'hours').toISOString(),
                                    $lte: momment().toISOString()
                                }
                        },
                        function (err, docs) {
                            // console.log(docs);
                            // smsUser = docs;


                            if (docs.length < 6 || docs.length === 0) {

                                let expireDate = Math.round(momment(user.expireDate).diff(momment()) / 1000);
                                if (expireDate > 0) {

                                    let userData = {
                                        "mobile": user.mobile,
                                        "expireDate": Math.round(momment(user.expireDate).diff(momment()) / 1000),
                                        "token": "",
                                        "expireToken": "",
                                        "refreshToken": "",
                                        "expireRefreshToken": "",
                                        "name": user.name == null ? "" : user.name,
                                        "lastName": user.lastName == null ? "" : user.lastName,
                                    }

                                    // let response = {
                                    //     "status": 1,
                                    //     "model": "User",
                                    //     "errors": [],
                                    //     "message": 'کد تایید قبلا به شماره موبایل شما ارسال شده است.',
                                    //     "action" : "AlreadySendCode",
                                    //     "data": [
                                    //         userData
                                    //     ]
                                    // };

                                    let response = Helpers.sendJson(1,  [],
                                        "کد تایید قبلا به شماره موبایل شما ارسال شده است.", "AlreadySendCode", userData);

                                    return res.status(200).json(response);

                                } else {

                                    user.expireDate = momment().add(3, 'minutes').toISOString();
                                    user.code = code;
                                    user.save();

                                    console.log(user);

                                    const sms = new Sms({
                                        code: code,
                                        userId: user._id,
                                    });
                                    sms.save();

                                    let tokenKavenegar = "345A6B672F4F2F4D66396477586259314D387268425A6535522B422F796259414D4662683277325656696F3D";
                                    let receptor = mobile;
                                    let token = code;
                                    let template = "verifyCodeYar";
                                    let url = "https://api.kavenegar.com/v1/" + tokenKavenegar + "/verify/lookup.json?receptor=" + receptor + "&token=" + token + "&template=" + template;


                                    var options = {
                                        method: 'POST',
                                        url: url,
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                        },
                                        body: {},
                                        json: true,
                                    };

                                    request(options, function (error, response, body) {

                                        if (error) {
                                            console.log(error)
                                            // let resJson2 = Helpers.sendJson(0,  [],
                                            //     error2.toString(), "Fail", []);
                                            // return res.status(error2.statusCode).json(resJson2);
                                        }
                                        console.log(body);
                                        // let resJson2 = Helpers.sendJson(1,  [],
                                        //     [], "Success", [body2]);
                                        // return res.status(200).json(resJson2);

                                    });


                                    let userData = {
                                        "mobile": user.mobile,
                                        "expireDate": Math.round(momment(user.expireDate).diff(momment()) / 1000),
                                        "token": "",
                                        "expireToken": "",
                                        "refreshToken": "",
                                        "expireRefreshToken": "",
                                        "name": user.name == null ? "" : user.name,
                                        "lastName": user.lastName == null ? "" : user.lastName,
                                    };

                                    // let response = {
                                    //     "status": 1,
                                    //     "model": "User",
                                    //     "errors": [],
                                    //     "message": 'کد تایید  به شماره موبایل شما ارسال شد.',
                                    //     "action" : "SendCode",
                                    //     "data": [
                                    //         userData
                                    //     ]
                                    // };

                                    let response = Helpers.sendJson(1,  [],
                                        "کد تایید  به شماره موبایل شما ارسال شد.",
                                        "SendCode", userData);

                                    return res.status(200).json(response);
                                }


                            } else {
                                let response = Helpers.sendJson(0,  [],
                                    "شما در مدت دو ساعت بیش از 5 بار نمی توانید درخواست کد دهید.",
                                    "RequestCodeToo", {});
                                return res.status(400).json(response);
                            }
                        });

                } else {

                    const user = new User({
                        mobile: mobile,
                        code: code,
                        expireDate: momment().add(3, 'minutes').toISOString(),
                    });

                    user.save();
                    console.log(user);
                    const sms = new Sms({
                        code: code,
                        userId: user._id,
                    });
                    sms.save();

                    let tokenKavenegar = "345A6B672F4F2F4D66396477586259314D387268425A6535522B422F796259414D4662683277325656696F3D";
                    let receptor = mobile;
                    let token = code;
                    let template = "verifyCodeYar";
                    let url = "https://api.kavenegar.com/v1/" + tokenKavenegar + "/verify/lookup.json?receptor=" + receptor + "&token=" + token + "&template=" + template;

                    var options = {
                        method: 'POST',
                        url: url,
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: {},
                        json: true,
                    };

                    request(options, function (error, response, body) {

                        if (error) {
                            console.log(error)
                            // let resJson2 = Helpers.sendJson(0, [],
                            //     error2.toString(), "Fail", []);
                            // return res.status(error2.statusCode).json(resJson2);
                        }
                        console.log(body);
                        // let resJson2 = Helpers.sendJson(1,  [],
                        //     [], "Success", [body2]);
                        // return res.status(200).json(resJson2);

                    });


                    let userData = {
                        "mobile": user.mobile,
                        "expireDate": Math.round(momment(user.expireDate).diff(momment()) / 1000),
                        "token": "",
                        "expireToken": "",
                        "refreshToken": "",
                        "expireRefreshToken": "",
                        "name": user.name == null ? "" : user.name,
                        "lastName": user.lastName == null ? "" : user.lastName,
                    }
                    // let response = {
                    //     "status": 1,
                    //     "model": "User",
                    //     "errors": [],
                    //     "message": 'کاربر ساخته شد به صفحه تایید کد می رویم.',
                    //     "action" : "CreateUser",
                    //     "data": [
                    //         userData
                    //     ]
                    // };

                    let response = Helpers.sendJson(1,  [],
                        "کاربر ساخته شد به صفحه تایید کد می رویم.", "CreateUser", userData);

                    return res.status(201).json(response);
                }

            })
            .catch(err => {
                if (!err.statusCode) {
                    // let response = {
                    //     "status": 0,
                    //     "model": "User",
                    //     "errors": [],
                    //     "message": '' + err.toString() + '',
                    //     "action" : "Fail",
                    //     "data": []
                    // };

                    let response = Helpers.sendJson(0,  [],
                        err.toString(), "Fail", {});

                    return res.status(500).json(response);
                }

                // let response = {
                //     "status": 0,
                //     "model": "User",
                //     "errors": [],
                //     "message": '' + err.toString() + '',
                //     "action" : "Fail",
                //     "data": []
                // };
                let response = Helpers.sendJson(0,  [],
                    err.toString(), "Fail", {});
                return res.status(err.statusCode).json(response);
                // next(err);
            });
    }


};

exports.verifyCode = (req, res, next) => {

    const mobile = req.body.mobile;
    const code = req.body.code;

    let data = {
        mobile: mobile,
        code: code,
    };
    let rules = {
        mobile: 'required|digits:11,numeric',
        code: 'required|digits:6,numeric',
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

        if (validation.errors.get('code').length > 0) {
            validation.errors.get('code').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "code";
                element.originalValue = req.body.code;
                element.extraData = "";
                errors.push(element);
                //
            });
        }
        // let response = {
        //     "status": 0,
        //     "model": "User",
        //     "errors": errors,
        //     "message": "خطا در اعتبارسنجی رخ داد!!",
        //     "action" : "ValidationError",
        //     "data": []
        // };

        let response = Helpers.sendJson(0,  errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return res.status(400).json(response);
    } else {
        User.findOne({mobile: mobile, code: code})
            .then(user => {
                // let smsUser;
                // Sms.find({
                //     userId: user._id, createdAt:
                //         {
                //             $gte: momment().subtract(2, 'hours'),
                //             $lte: momment()
                //         }
                // },
                //     function (err, docs) {
                //     console.log(docs);
                //     // smsUser = docs;
                //
                //
                //     if(docs.length < 6 || docs.length === 0){
                if (!user) {


                    // let response = {
                    //     "status": 1,
                    //     "model": "User",
                    //     "errors": [],
                    //     "message": 'کاربر ساخته شد به صفحه تایید کد می رویم.',
                    //     "action" : "CreateUser",
                    //     "data": [
                    //         userData
                    //     ]
                    // };

                    let response = Helpers.sendJson(0,  [],
                        "چنین کاربری وجود ندارد!", "NotExistUser", {});

                    return res.status(404).json(response);
                } else {


                    user.active = true;
                    user.code = "";
                    user.save();

                    const token = jwt.sign(
                        {
                            mobile: user.mobile,
                            userId: user._id.toString()
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: process.env.ACCESS_TOKEN_LIFE}
                    );
                    const refreshToken = jwt.sign({
                            mobile: user.mobile,
                            userId: user._id.toString()
                        }, process.env.REFRESH_TOKEN_SECRET,
                        {expiresIn: process.env.REFRESH_TOKEN_LIFE});

                    let userData = {
                        "mobile": user.mobile,
                        "expireDate": Math.round(momment(user.expireDate).diff(momment()) / 1000),
                        "token": token,
                        "expireToken": process.env.ACCESS_TOKEN_LIFE,
                        "refreshToken": refreshToken,
                        "expireRefreshToken": process.env.REFRESH_TOKEN_LIFE,
                        "name": user.name == null ? "" : user.name,
                        "lastName": user.lastName == null ? "" : user.lastName,
                    };

                    // let response = {
                    //     "status": 1,
                    //     "model": "User",
                    //     "errors": [],
                    //     "message": 'کد تایید  به شماره موبایل شما ارسال شد.',
                    //     "action" : "SendCode",
                    //     "data": [
                    //         userData
                    //     ]
                    // };

                    let response = Helpers.sendJson(1,  [],
                        "کد تایید  درست است شما به اپلیکیشن وارد شدید.", "VerifyCode", userData);

                    return res.status(200).json(response);


                }
                //     }else{
                //         let response = Helpers.sendJson(0, [],
                //             "شما در مدت دو ساعت بیش از 5 بار نمی توانید درخواست کد دهید.",
                //             "RequestCodeToo", []);
                //         return res.status(400).json(response);
                //     }
                // });


                // const token = jwt.sign(
                //     {
                //         mobile: user.mobile,
                //         userId: user._id.toString()
                //     },
                //     process.env.JWT_SECRET,
                //     {expiresIn: '30 days'}
                // );
                // res.status(200).json({token: token, userId: user._id.toString()});

            })
            .catch(err => {
                if (!err.statusCode) {
                    // let response = {
                    //     "status": 0,
                    //     "model": "User",
                    //     "errors": [],
                    //     "message": '' + err.toString() + '',
                    //     "action" : "Fail",
                    //     "data": []
                    // };

                    let response = Helpers.sendJson(0,  [],
                        err.toString(), "Fail", {});

                    return res.status(500).json(response);
                }

                let response = Helpers.sendJson(0,  [],
                    err.toString(), "Fail", {});
                return res.status(err.statusCode).json(response);
                // next(err);
            });
    }


};

exports.token = (req, res, next) => {

    const refreshToken = req.body.refreshToken;
// console.log(refreshToken)
    let data = {
        refreshToken: refreshToken,
    };
    let rules = {
        refreshToken: 'required',
    };

    let validation = new Validator(data, rules);

    if (validation.fails()) {
        let errors = [];
        if (validation.errors.get('refreshToken').length > 0) {
            validation.errors.get('refreshToken').forEach(function (item) {
                let element = {};
                element.errorCode = 2;
                element.errorDescription = item;
                element.referenceName = "refreshToken";
                element.originalValue = req.body.refreshToken;
                element.extraData = "";
                errors.push(element);
                //
            });
        }

        let response = Helpers.sendJson(0,
            errors, "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return res.status(400).json(response);
    } else {


        let decodedToken;

        try {
            decodedToken = jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {

            let response = Helpers.sendJson(0,  [],
                err.toString(), "Fail", {});

            return res.status(500).json(response);
        }


        const token = jwt.sign(
            {
                mobile: decodedToken.mobile,
                userId: decodedToken.userId
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_LIFE}
        );
        const refreshToken = jwt.sign({
                mobile: decodedToken.mobile,
                userId: decodedToken.userId
            }, process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_LIFE});


        let userData;
        User.findOne({mobile: decodedToken.mobile})
            .then(user => {
                userData = {
                    "mobile": user.mobile,
                    "expireDate": Math.round(momment(user.expireDate).diff(momment()) / 1000),
                    "token": token,
                    "expireToken": process.env.ACCESS_TOKEN_LIFE,
                    "refreshToken": refreshToken,
                    "expireRefreshToken": process.env.REFRESH_TOKEN_LIFE,
                    "name": user.name == null ? "" : user.name,
                    "lastName": user.lastName == null ? "" : user.lastName,
                };

                let response = Helpers.sendJson(1,  [],
                    "توکن با موفق دریافت شد.", "GetToken", userData);

                return res.status(200).json(response);
            });


        // let response = {
        //     "status": 1,
        //     "model": "User",
        //     "errors": [],
        //     "message": 'کد تایید  به شماره موبایل شما ارسال شد.',
        //     "action" : "SendCode",
        //     "data": [
        //         userData
        //     ]
        // };


    }


};


exports.check = (req, res, next) => {
    console.log(req.mobile);
    User.findOne({mobile: req.mobile})
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            if (!err.statusCode) {
                return res.status(500).json(err.toString());
            }
            return res.status(err.statusCode).json(err.toString());
        });

};


exports.repeatCode = (req, res, next) => {


    let code = Math.floor(100000 + Math.random() * 900000);
    console.log(code);


    // console.log(Math.round(momment().add(90, "seconds").diff(momment()) / 1000));

    const mobile = req.body.mobile;

    let data = {
        mobile: mobile,
    };
    let rules = {
        mobile: 'required|digits:11,numeric',
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

        // let response = {
        //     "status": 0,
        //     "model": "User",
        //     "errors": errors,
        //     "message": "خطا در اعتبارسنجی رخ داد!!",
        //     "action" : "ValidationError",
        //     "data": []
        // };

        let response = Helpers.sendJson(0,  errors,
            "خطا در اعتبارسنجی رخ داد!!", "ValidationError", {});
        return res.status(400).json(response);
    } else {
        User.findOne({mobile: mobile})
            .then(user => {
                // let smsUser;
                Sms.find({
                    userId: user._id, createdAt:
                        {
                            $gte: momment().subtract(2, 'hours').toISOString(),
                            $lte: momment().toISOString()
                        }
                }, function (err, docs) {
                    // console.log(docs);
                    // smsUser = docs;


                    if (docs.length < 6 || docs.length === 0) {
                        if (!user) {

                            let response = Helpers.sendJson(0,  [],
                                "چنین کاربری وجود ندارد!", "NotExistUser", {});

                            return res.status(404).json(response);

                        } else {
                            let expireDate = Math.round(momment(user.expireDate).diff(momment()) / 1000);
                            if (expireDate > 0) {

                                let userData = {
                                    "mobile": user.mobile,
                                    "expireDate": Math.round(momment(user.expireDate).diff(momment()) / 1000),
                                    "token": "",
                                    "expireToken": "",
                                    "refreshToken": "",
                                    "expireRefreshToken": "",
                                    "name": user.name == null ? "" : user.name,
                                    "lastName": user.lastName == null ? "" : user.lastName,
                                }
                                // let response = {
                                //     "status": 1,
                                //     "model": "User",
                                //     "errors": [],
                                //     "message": 'کد تایید قبلا به شماره موبایل شما ارسال شده است.',
                                //     "action" : "AlreadySendCode",
                                //     "data": [
                                //         userData
                                //     ]
                                // };

                                let response = Helpers.sendJson(1,  [],
                                    "کد تایید قبلا به شماره موبایل شما ارسال شده است.",
                                    "AlreadySendCode", userData);

                                return res.status(200).json(response);

                            } else {

                                user.expireDate = momment().add(3, 'minutes').toISOString();
                                user.code = code;
                                user.save();

                                const sms = new Sms({
                                    code: code,
                                    userId: user._id,
                                });
                                sms.save();


                                let tokenKavenegar = "345A6B672F4F2F4D66396477586259314D387268425A6535522B422F796259414D4662683277325656696F3D";
                                let receptor = mobile;
                                let token = code;
                                let template = "verifyCodeYar";
                                let url = "https://api.kavenegar.com/v1/" + tokenKavenegar + "/verify/lookup.json?receptor=" + receptor + "&token=" + token + "&template=" + template;

                                var options = {
                                    method: 'POST',
                                    url: url,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json',
                                    },
                                    body: {},
                                    json: true,
                                };

                                request(options, function (error, response, body) {

                                    if (error) {
                                        console.log(error)
                                        // let resJson2 = Helpers.sendJson(0,  [],
                                        //     error2.toString(), "Fail", []);
                                        // return res.status(error2.statusCode).json(resJson2);
                                    }
                                    console.log(body);
                                    // let resJson2 = Helpers.sendJson(1,  [],
                                    //     [], "Success", [body2]);
                                    // return res.status(200).json(resJson2);

                                });

                                let userData = {
                                    "mobile": user.mobile,
                                    "expireDate": Math.round(momment(user.expireDate).diff(momment()) / 1000),
                                    "token": "",
                                    "expireToken": "",
                                    "refreshToken": "",
                                    "expireRefreshToken": "",
                                    "name": user.name == null ? "" : user.name,
                                    "lastName": user.lastName == null ? "" : user.lastName,
                                };

                                // let response = {
                                //     "status": 1,
                                //     "model": "User",
                                //     "errors": [],
                                //     "message": 'کد تایید  به شماره موبایل شما ارسال شد.',
                                //     "action" : "SendCode",
                                //     "data": [
                                //         userData
                                //     ]
                                // };

                                let response = Helpers.sendJson(1,  [],
                                    "کد تایید  به شماره موبایل شما ارسال شد.", "SendCode", userData);

                                return res.status(200).json(response);
                            }

                        }
                    } else {
                        let response = Helpers.sendJson(0,  [],
                            "شما در مدت دو ساعت بیش از 5 بار نمی توانید درخواست کد دهید.",
                            "RequestCodeToo", {});
                        return res.status(400).json(response);
                    }
                });


                // const token = jwt.sign(
                //     {
                //         mobile: user.mobile,
                //         userId: user._id.toString()
                //     },
                //     process.env.JWT_SECRET,
                //     {expiresIn: '30 days'}
                // );
                // res.status(200).json({token: token, userId: user._id.toString()});

            })
            .catch(err => {
                if (!err.statusCode) {
                    // let response = {
                    //     "status": 0,
                    //     "model": "User",
                    //     "errors": [],
                    //     "message": '' + err.toString() + '',
                    //     "action" : "Fail",
                    //     "data": []
                    // };

                    let response = Helpers.sendJson(0,  [],
                        err.toString(), "Fail", {});

                    return res.status(500).json(response);
                }

                // let response = {
                //     "status": 0,
                //     "model": "User",
                //     "errors": [],
                //     "message": '' + err.toString() + '',
                //     "action" : "Fail",
                //     "data": []
                // };

                let response = Helpers.sendJson(0,  [],
                    err.toString(), "Fail", {});
                return res.status(err.statusCode).json(response);
                // next(err);
            });
    }


};

