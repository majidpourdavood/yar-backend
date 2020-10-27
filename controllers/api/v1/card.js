const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');
const request = require('request');

const User = require('../../../models/user');
const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.balance = async (req, res, next) => {
    //
    //
    // ApiToken.findOne({
    //         name: "faraboom", tokenLife: {
    //             $gte: momment().add(10, 'minutes').toISOString(),
    //         }
    //     },
    //     function (err, faraboom) {
    //         console.log(faraboom);
            // if (faraboom) {
            //
            //     var options2 = {
            //         method: 'POST',
            //         url: "https://api.portal.faraboom.co/v1/cards/balance",
            //         headers: {
            //             "Accept-Language": "fa",
            //             "App-Key": "13509",
            //             "Device-Id": "192.168.1.1",
            //             "CLIENT-DEVICE-ID": "127.0.0.1",
            //             "CLIENT-IP-ADDRESS": "127.0.0.1",
            //             "CLIENT-USER-AGENT": "Android - Android 5.1 - Sumsung - Gallexy8",
            //             "CLIENT-USER-ID": "09360405004",
            //             "CLIENT-PLATFORM-TYPE": "ANDROID",
            //             'Content-Type': 'application/json',
            //             'Accept': 'application/json',
            //             'Bank-Id': '',
            //             'Token-Id': faraboom.token,
            //             'Content-Length': Buffer.byteLength(data)
            //         },
            //         body: {
            //             "deposit_number":"0201255801006",
            //             "pan":"5029381014694897",
            //             "track2":"",
            //             "pin":"85509",
            //             "pin_type":"CARD",
            //             "cvv2":"927",
            //             "exp_date":"0701"
            //         },
            //         json: true,
            //     };
            //
            //     request(options2, function (error2, response2, body2) {
            //
            //         if (error2) {
            //             let resJson2 = Helpers.sendJson(0, "balanceCard", [],
            //                 error2.toString(), "Fail", []);
            //             return res.status(error2.statusCode).json(resJson2);
            //         }
            //         let resJson2 = Helpers.sendJson(1, "balanceCard", [],
            //             [], "Success", [body2]);
            //         return res.status(200).json(resJson2);
            //
            //
            //     });
            //
            //
            // }
            // else {

                // var options = {
                //     method: 'POST',
                //     url: "https://api.sandbox.faraboom.co/v1/auth/market/login",
                //     headers: {
                //         "Accept-Language": "fa",
                //         "App-Key": "13509",
                //         "Device-Id": "192.168.1.1",
                //         "CLIENT-DEVICE-ID": "192.168.1.1",
                //         "CLIENT-IP-ADDRESS": "127.0.0.1",
                //         "CLIENT-USER-AGENT": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
                //         "CLIENT-USER-ID": "09365707968",
                //         "CLIENT-PLATFORM-TYPE": "WEB",
                //         'Content-Type': 'application/json',
                //     },
                //     body: {
                //         "username":"yargan",
                //         "password":"Yy123456@",
                //         "client_id":""
                //     },
                //     json: true,
                // };

                // request(options, function (error, response, body) {
                //
                //     // if (error) throw new Error(error);
                //
                //     if (error) {
                //         let resJson = Helpers.sendJson(0, "balanceCard", [],
                //             error.toString(), "Fail", []);
                //         return res.status(400).json(resJson);
                //     }

                    // const apiToken = new ApiToken({
                    //     name: "faraboom",
                    //     token: body.Result.accessToken,
                    //     tokenLife: body.Result.tokenExpiration,
                    //     refreshToken: body.Result.refreshToken,
                    // });
                    //
                    // apiToken.save();
                    // console.log(body)

                    // res.status(200).json({apiToken});

    var data_body = '{\
    "deposit_number":"0201255801006",\
    "pan":"5029381014694897",\
    "track2":"",\
    "pin":"85509",\
    "pin_type":"CARD",\
    "cvv2":"927",\
    "exp_date":"0701"\
}';
    var options = { method: 'POST',
        url: 'https://api.portal.faraboom.co/v1/cards/balance',
        qs: {  },
        headers: {
                            "Accept-Language": "fa",
                            "App-Key": "13509",
                            "Device-Id": "192.168.1.1",
                            'Bank-Id': '',
                            'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM" ,
                            "CLIENT-DEVICE-ID": "127.0.0.1",
                            "CLIENT-IP-ADDRESS": "127.0.0.1",
                            "CLIENT-USER-AGENT": "",
                            "CLIENT-USER-ID": "09365707968",
                            "CLIENT-PLATFORM-TYPE": "WEB",
                            'Content-Type': 'application/json',
        },
        body: data_body };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });


// let data = {
//     "deposit_number":"0201255801006",
//     "pan":"5029381014694897",
//     "track2":"",
//     "pin":"85509",
//     "pin_type":"CARD",
//     "cvv2":"927",
//     "exp_date":"0701"
// };
//                     var options2 = {
//                         method: 'POST',
//                         url: "https://api.sandbox.faraboom.co/v1/cards/balance",
//                         headers: {
//                             "Accept-Language": "fa",
//                             "App-Key": "13509",
//                             "Device-Id": "192.168.1.1",
//                             'Bank-Id': '',
//                             'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM" ,
//                             "CLIENT-DEVICE-ID": "127.0.0.1",
//                             "CLIENT-IP-ADDRESS": "127.0.0.1",
//                             "CLIENT-USER-AGENT": "",
//                             "CLIENT-USER-ID": "09365707968",
//                             "CLIENT-PLATFORM-TYPE": "WEB",
//                             'Content-Type': 'application/json',
//                         },
//                         body: data,
//                         json: true,
//                     };
//
//                     request(options2, function (error2, response2, body2) {
//
//                         // console.log('statusCode:', response2.statusCode);
//
//                         if (error2) {
//                             let resJson2 = Helpers.sendJson(0, "balanceCard", [],
//                                 error2.toString(), "Fail", []);
//                             return res.status(400).json(resJson2);
//                         }
//                         let resJson2 = Helpers.sendJson(1, "balanceCard", [],
//                             [], "Success", [body2]);
//                         return res.status(200).json(resJson2);
//
//
//
//
//                     });


                // });


        //     }
        // });


};

