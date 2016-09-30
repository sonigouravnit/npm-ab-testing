'use strict';

var cookieParser = require('cookie-parser')

var reqCount = 0;
var originalKey = 'originalAB';
var parentConfig = {
    cookieName: 'abTestCookie',
    weightage: {},
    expireTimeInHours: 1
};

function middlewareWrapper(req, res, next) {

    if (undefined === req.cookies || null === req.cookies) {
        throw('Please use cookie parser before calling getABTestCases() method.')
    } else {
        var result = [];
        if (req.cookies[parentConfig.cookieName]) {
            result = req.cookies[parentConfig.cookieName].split(',');
        } else {
            if (reqCount > 100) {
                reqCount = 0;
            }
            reqCount = reqCount + 1;
            for (var i in parentConfig.weightage) {
                if (parentConfig.weightage[i] * 100 > reqCount) {
                    result.push(i);
                }
            }
            if (!result.length) {
                result.push(originalKey);
            }
            res.cookie(parentConfig.cookieName, result.toString(), { maxAge: parentConfig.expireTimeInHours * 60 * 60 * 1000, httpOnly: true });
            //var a = 30 * 1000;
            //res.cookie(parentConfig.cookieName, result.toString(), { maxAge: a, httpOnly: true });
        }
        //res.clearCookie(parentConfig.cookieName);
        return result;
    }
}

function setABConfig(config) {
    if (validateConfig(config)) {
        parentConfig = config;
    } else {
        throw ('Provide correct configurations.');
    }
}

function validateConfig(config) {
    if (undefined !== config.cookieName && undefined !== config.weightage && undefined !== config.expireTimeInHours
        && config.cookieName.length > 0 && Object.keys(config.weightage).length > 0 && Number.isInteger(config.expireTimeInHours)) {
        for (var i in config.weightage) {
            if (config.weightage[i] < 0 && config.weightage[i] > 1) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

// can pass either an options hash, an options delegate, or nothing
module.exports = {
    setConfig: setABConfig,
    getABTestCases: middlewareWrapper
};
