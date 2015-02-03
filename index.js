/**
 * Created by Khashayar Fereidani on 2/2/15.
 */
"use strict";
var session=require('express-session');
var store=require('connect-redis')(session);


// NOTICE : DO NOT EDIT THESE SETTINGS DIRECTLY , SET YOUR DESIRED VALUE IN YOUR CONFIG FILE.

var finalSessionSettings={
        "name":"skyport",
        "secret":"hello world!!"
    };

var finalRedisSettings={
    "db":0,
    "prefix":"sess:"
    };

var settings={
    defaultError:"Redis Connection Timeout/Problem !"
    };


function cp(from,to){
    if(from!=undefined && from instanceof Object){
        for(var index in from){
            to[index]=from[index];
        }
    }
}

module.exports=function(sessionSettings,redisSettings,middlewareSettings) {
    cp(middlewareSettings,settings)
    cp(sessionSettings, finalSessionSettings);
    cp(redisSettings, finalRedisSettings);
    finalSessionSettings.store = new store(finalRedisSettings);
    var sessionHandler = session(finalSessionSettings);
    return function (req, res, next) {
        sessionHandler(req, res, function () {
            if (!req.session) {
                return next(new Error(settings.defaultError));// throw error
            }else {
                next();// no error continue
            }
        });
    }
}
