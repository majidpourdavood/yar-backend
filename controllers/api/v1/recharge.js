const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');
const request = require('request');

const User = require('../../../models/user');
const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.recharge = async (req, res, next) => {


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
                        "amount": 6000,
                        "mobileNumber": "09360405004",
                        "rechargeCode": 20,
                        "clientTransactionId":  ''+momment().unix() *1000
                    },
                    json: true,
                };

                request(options2, function (error2, response2, body2) {

                    if (error2){
                        let resJson2 = Helpers.sendJson(0, "Recharge", [],
                            error2.toString(), "Fail", []);
                        return res.status(error2.statusCode).json(resJson2);
                    }

                    console.log(body2)
                    let resJson2 = Helpers.sendJson(1, "Recharge", [],
                       [], "Success", [body2]);
                    return res.status(200).json(resJson2);

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

                    if (error){
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
                            "amount": 6000,
                            "mobileNumber": "09360405004",
                            "rechargeCode": 20,
                            "clientTransactionId": ''+momment().unix() *1000
                        },
                        json: true,
                    };

                    request(options2, function (error2, response2, body2) {

                        if (error2){
                            let resJson2 = Helpers.sendJson(0, "Recharge", [],
                                error2.toString(), "Fail", []);
                            return res.status(error2.statusCode).json(resJson2);
                        }
console.log(body2)
                        let resJson2 = Helpers.sendJson(1, "Recharge", [],
                            [], "Success", [body2]);
                        return res.status(200).json(resJson2);

                    });


                });


            }
        });




};

