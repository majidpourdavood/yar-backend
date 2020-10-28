const jwt = require('jsonwebtoken');
const Validator = require('validatorjs');
const momment = require('jalali-moment');
const request = require('request');
const axios = require('axios');

const https = require('https');
const url = require('url'); // url parser

const User = require('../../../models/user');
const ApiToken = require('../../../models/apiToken');
const Helpers = require('../../../util/helpers');

exports.balance = async (req, responseA, next) => {
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

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    var data = JSON.stringify({
        "pan": "5029381014694897",
        "destination_pan": "5029381014694905",
        "track2": "",
        "pin": "85509",
        "pin_type": "CARD",
        "cvv2": "927",
        "exp_date": "0107",
        "loan_number": "",
        "amount": 10000
    });
    //
    // var options = {
    //     method: 'POST',
    //     url: 'https://api.sandbox.faraboom.co/v1/cards/holder',
    //     headers: {
    //         "Accept-Language": "fa",
    //         "App-Key": "13509",
    //         "Device-Id": "192.168.1.1",
    //         'Bank-Id': 'BOOMIR',
    //         'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
    //         "CLIENT-DEVICE-ID": "121457845122222",
    //         "CLIENT-IP-ADDRESS": "127.0.0.1",
    //         "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
    //         "CLIENT-USER-ID": "09360405004",
    //         "CLIENT-PLATFORM-TYPE": "ANDROID",
    //         'Content-Type': 'application/json',
    //         'Content-Length': Buffer.byteLength(data_body)
    //     },
    //     body: data_body
    // };
    //
    //
    // request(options, function (error, response, body) {
    //     // if (error) throw new Error(error);
    //
    //     responseA.status(200).send(JSON.parse(response.body));
    //     console.log(error);
    //     console.log(response);
    //     console.log(body);
    //
    // });

    await axios({
            method: 'POST',
            url: 'https://api.sandbox.faraboom.co/v1/cards/holder',
            data: data,
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
                'Content-Length': Buffer.byteLength(data)
            }
        }
    ).then(function (reactType) {
        console.log(reactType);
        responseA.send(reactType.data);


    }).catch(function (error) {
        console.log(error);
        responseA.send(error)

    })

    // let result;
    //
    // try {
    //     result = await axios({
    //             method: 'POST',
    //             url: 'https://api.sandbox.faraboom.co/v1/cards/holder',
    //             data: data,
    //             headers: {
    //                 "Accept-Language": "fa",
    //                 "App-Key": "13509",
    //                 "Device-Id": "192.168.1.1",
    //                 'Bank-Id': 'BOOMIR',
    //                 'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
    //                 "CLIENT-DEVICE-ID": "121457845122222",
    //                 "CLIENT-IP-ADDRESS": "127.0.0.1",
    //                 "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
    //                 "CLIENT-USER-ID": "09360405004",
    //                 "CLIENT-PLATFORM-TYPE": "ANDROID",
    //                 'Content-Type': 'application/json',
    //                 'Content-Length': Buffer.byteLength(data)
    //             }
    //         }
    //     )
    //     // console.log(result);
    //
    // } catch (error) {
    //
    //     responseA.status(500).send(error.toString());
    //
    // }
    // console.log(result.config);
    // console.log(result.data);
    // console.log(result.status);
    //
    // responseA.status(result.status).send(result.data);


    // {
    //     "switch_response_rrn": "030216458621",
    //     "available_balance": 2200139526,
    //     "ledger_balance": 2200139526,
    //     "currency": "IRR"
    // }


    // var callback_url = 'https://api.sandbox.faraboom.co/v1/cards/transfer';
    // var callback = url.parse(callback_url);
    // var data = JSON.stringify(
    //     {
    //     "pan": "5029381014694897",
    //     "pin": "85509",
    //     "pin_type": "CARD",
    //     "cvv2": "927",
    //     "exp_date": "0107",
    //     "destination": "5029381014694905",
    //     "destination_type": "PAN",
    //     "amount": 10000,
    //     "track2": "",
    //     "receiver_name": "",
    //     "holder_transaction_id": "18c16e38-0219-4472-8a4f-f25a11024d77",
    //     "merchant_id": "",
    // }
    // );
    // var options = {
    //     host: callback.hostname,
    //     path: callback.path,
    //     method: 'POST',
    //     headers: {
    //         "Accept-Language": "fa",
    //         "App-Key": "13509",
    //         "Device-Id": "192.168.1.1",
    //         'Bank-Id': 'BOOMIR',
    //         'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
    //         "CLIENT-DEVICE-ID": "121457845122222",
    //         "CLIENT-IP-ADDRESS": "127.0.0.1",
    //         "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
    //         "CLIENT-USER-ID": "09360405004",
    //         "CLIENT-PLATFORM-TYPE": "ANDROID",
    //         'Content-Type': 'application/json',
    //         'Content-Length': Buffer.byteLength(data)
    //     }
    // };
    // let result;
    //
    // try {
    //     result = await axios({
    //             method: 'POST',
    //             url: 'https://api.sandbox.faraboom.co/v1/cards/transfer',
    //             data: data,
    //             headers: {
    //                 "Accept-Language": "fa",
    //                 "App-Key": "13509",
    //                 "Device-Id": "192.168.1.1",
    //                 'Bank-Id': 'BOOMIR',
    //                 'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
    //                 "CLIENT-DEVICE-ID": "121457845122222",
    //                 "CLIENT-IP-ADDRESS": "127.0.0.1",
    //                 "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
    //                 "CLIENT-USER-ID": "09360405004",
    //                 "CLIENT-PLATFORM-TYPE": "ANDROID",
    //                 'Content-Type': 'application/json',
    //                 'Content-Length': Buffer.byteLength(data)
    //             }
    //         }
    //     )
    //
    // } catch(error) {
    //
    //     responseA.status(500).send(error.toString());
    //
    // }
    //
    // responseA.send(result);


    // var req = https.request(options, (res) => {
    //     console.log('statusCode:', res.statusCode);
    //     console.log('headers:', res.headers);
    //     res.on('data', (d) => {
    //         process.stdout.write(d);
    //         responseA.send(JSON.parse(d));
    //
    //     });
    // });
    // req.on('error', (e) => {
    //     console.error(e);
    // });
    // req.write(data);
    // req.end();


    // //transfer cart to cart merchant to yargan
    // var data_body = JSON.stringify({
    //     // "deposit_number": "0201255801006",
    //     // "pan": "5029381014694897",
    //     // "track2": "",
    //     // "pin": "85509",
    //     // "pin_type": "CARD",
    //     // "cvv2": "927",
    //     // "exp_date": "0107",
    //
    //     // "username": "yargan",
    //     // "password": "Yy123456@",
    //     // "client_id": "",
    //
    //     // "bill_id": "9399349604127",
    //
    //     "pan" : "5029381014694897",
    //     "pin" : "85509",
    //     "pin_type" : "CARD",
    //     "cvv2" : "927",
    //     "exp_date" : "0107",
    //     "destination" : "5029381014694905",
    //     "destination_type" : "PAN",
    //     "amount" : 10000,
    //     "track2" : "",
    //     "receiver_name" : "",
    //     "holder_transaction_id" : "cf64e760-fe7d-4d85-9e79-ebeb7a59efaf",
    //     "merchant_id" : "",
    //
    // });
    //
    //
    // var optionsCardsTransfer = {
    //     method: 'POST',
    //     url: 'https://api.sandbox.faraboom.co/v1/cards/transfer',
    //     headers: {
    //         "Accept-Language": "fa",
    //         "App-Key": "13509",
    //         "Device-Id": "192.168.1.1",
    //         'Bank-Id': 'BOOMIR',
    //         'Token-Id': "IWQIdD2rLDNOm0T0VrZyBbbiwNRhR0yBTWD1kWv6xykv0sqw3nIiyJfVjO10t3ZKjnERNyIOXzxPBd3R5FmCAgJM",
    //         "CLIENT-DEVICE-ID": "121457845122222",
    //         "CLIENT-IP-ADDRESS": "127.0.0.1",
    //         "CLIENT-USER-AGENT": "android - Android 5.1 - Sumsung - Gallexy8",
    //         "CLIENT-USER-ID": "09360405004",
    //         "CLIENT-PLATFORM-TYPE": "ANDROID",
    //         'Content-Type': 'application/json',
    //         'Content-Length': Buffer.byteLength(data_body)
    //     },
    //     body: data_body
    // };
    //
    //
    // request(optionsCardsTransfer, function (errorCardsTransfer, responseCardsTransfer, bodyCardsTransfer) {
    //     // if (error) throw new Error(error);
    //
    //     res.status(200).send(JSON.parse(responseCardsTransfer.body));
    //     console.log(errorCardsTransfer);
    //     console.log(responseCardsTransfer);
    //     console.log(bodyCardsTransfer);
    //
    // });
    //


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

