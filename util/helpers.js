const User = require('../models/user');

function sendJson(status, errors, message, action, data) {
    let response = {
        "status": status,
        "errors": errors,
        "message":  message ,
        "action":  action ,
        "data": data
    };
    // console.log("I'm sending mail now...");
    return response;
}



exports.sendJson = sendJson;
