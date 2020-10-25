const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');
const request = require('request');

const User = require('../../../models/user');
const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.recharge = async (req, res, next) => {


    ApiToken.find({
            name: "qpin", tokenLife: {
                    $gte: momment().add(10, 'minutes'),
                }
        },
        function (err, docs) {
            console.log(docs);
            if (docs.length > 1) {




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

                    let resJson = Helpers.sendJson(0, "Recharge", [],
                        error.toString(), "Fail", []);
                    return res.status(error.statusCode).json(resJson);

                    const apiToken = new ApiToken({
                        name: "qpin",
                        token: body.Result.accessToken,
                        tokenLife: body.Result.tokenExpiration,
                        refreshToken: body.Result.refreshToken,
                    });

                    apiToken.save();


                    // res.status(200).json({apiToken});

                    var options2 = {
                        method: 'GET',
                        url: "https://31.24.236.150:8089/ESB.Api.ETCard.Ver1/api/etcard/1886005272133112",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + body.result.token,
                            'Accept': 'application/json',
                        },
                        body: {},
                        json: true,
                    };

                    request(options2, function (error2, response2, body2) {

                        if (error2) throw new Error(error2);
                        res.status(200).json({body: body2});

                    });


                });

                let response = Helpers.sendJson(0, "User", [],
                    "شما در مدت دو ساعت بیش از 5 بار نمی توانید درخواست کد دهید.",
                    "RequestCodeToo", []);
                return res.status(200).json(response);
            }
        });




};

