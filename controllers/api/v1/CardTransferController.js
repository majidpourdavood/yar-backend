const {validationResult} = require('express-validator');
const request = require('request');


exports.getDetailCart = async (req, res, next) => {
    //        $url = "https://185.167.72.9:7091/tsmsca/transfer/cardHolderNumberVerification";
    //        $url = "https://tsm.shaparak.net/tsmsca/transfer/cardHolderNumberVerification";
    var options = {
        method: 'POST',
        url: "https://185.167.72.9:7091/banking/cardHolderInquiry/sync",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic OTI2MjczOjEyMzQ1Ng==',
        },
        body: {
            "trackingNumber": "tr-1111111113",
            "sourcePAN": "5894631501869697",
            "cellphoneNumber": "09360405004",
            "destinationPAN": "5894631501869697",
            "amount": 10000,
            "transactionType": 0,
            "acceptorCode": "594808481600012",
            "terminalNumber": "59000014",
            "terminalType": 8,
            "rrn": "",
            "stan": 123456,
            "accessAddress": "45.156.184.89",
            "securityType": 0,
            "securityFactor": ""

        },
        json: true,
    };

    request(options, function (error, response, body) {

        if (error) throw new Error(error);

        res.status(200).json({body: body});
        // if (!error && body.Status == 100) {
        //     res.redirect('https://www.yarpay.net/showPsp/' + body.identify)
        // }else{
        //     console.log('transaction failed');
        //     res.redirect('/');
        // }
    });

    // res.status(200).json({ token: "uuuu" });
};

exports.directChargeFaraboom = async (req, res, next) => {
    //        $url = "https://185.167.72.9:7091/tsmsca/transfer/cardHolderNumberVerification";
    //        $url = "https://tsm.shaparak.net/tsmsca/transfer/cardHolderNumberVerification";

    let finnotech_user = 'yarpay';
    let finnotech_key = 'b803e542e00934827291';
    let token = Buffer.from(finnotech_user + ':' + finnotech_key).toString('base64');


    var options = {
        method: 'POST',
        url: "https://api.sandbox.faraboom.co/v1/dev/v2/oauth2/token",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: {
            "grant_type": "client_credentials"
            , "nid": "4240079837"
            , "scopes": "billing:cc-inquiry:get"

        },
        json: true,
    };

    request(options, function (error, response, body) {

        if (error) throw new Error(error);

        res.status(200).json({body: body});


        // var options2 = {
        //     method: 'GET',
        //     url: "https://sandboxapi.finnotech.ir/billing/v2/clients/yarpay/billingInquiry?parameter=9105936904121&type=Electricity",
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer '+ body.result.value ,
        //     },
        //     body: {},
        //     json: true,
        // };
        //
        // request(options2, function (error2, response2, body2) {
        //
        //     if (error2) throw new Error(error2);
        //     res.status(200).json({body: body2});
        //
        // });


    });

};


exports.getEtcard = async (req, res, next) => {


    var options = {
        method: 'POST',
        url: "https://31.24.236.150:8087/ESB.AccessControllerService.Ver1/api/oauth/Token",
        headers: {
            'Content-Type': 'application/json',
        },
        body: {
            "username": "yaregan@mytehran.ir",
            "password": "yaregan1386",
            "grant_type": "password",
            "refresh_token": ""

        },
        json: true,
    };

    res.status(200).json({body: options});

    request(options, function (error, response, body) {

        if (error) throw new Error(error);

        res.status(200).json({body: body});

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

        // if (!error && body.Status == 100) {
        //     res.redirect('https://www.yarpay.net/showPsp/' + body.identify)
        // }else{
        //     console.log('transaction failed');
        //     res.redirect('/');
        // }
    });
    // res.status(200).json({body: token2});

    // res.status(200).json({ token: "uuuu" });
};


exports.billingInquiryFinotech = async (req, res, next) => {
    //        $url = "https://185.167.72.9:7091/tsmsca/transfer/cardHolderNumberVerification";
    //        $url = "https://tsm.shaparak.net/tsmsca/transfer/cardHolderNumberVerification";

    let finnotech_user = 'yarpay';
    let finnotech_key = 'b803e542e00934827291';
    let token = Buffer.from(finnotech_user + ':' + finnotech_key).toString('base64');


    var options = {
        method: 'POST',
        url: "https://sandboxapi.finnotech.ir/dev/v2/oauth2/token",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + token,
        },
        body: {
            "grant_type": "client_credentials"
            , "nid": "4240079837"
            , "scopes": "billing:cc-inquiry:get"

        },
        json: true,
    };

    request(options, function (error, response, body) {

        if (error) throw new Error(error);


        var options2 = {
            method: 'GET',
            url: "https://sandboxapi.finnotech.ir/billing/v2/clients/yarpay/billingInquiry?parameter=9105936904121&type=Electricity",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + body.result.value,
            },
            body: {},
            json: true,
        };

        request(options2, function (error2, response2, body2) {

            if (error2) throw new Error(error2);
            res.status(200).json({body: body2});

        });

        // if (!error && body.Status == 100) {
        //     res.redirect('https://www.yarpay.net/showPsp/' + body.identify)
        // }else{
        //     console.log('transaction failed');
        //     res.redirect('/');
        // }
    });
    // res.status(200).json({body: token2});

    // res.status(200).json({ token: "uuuu" });
};
