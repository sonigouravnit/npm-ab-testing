'use strict';

var cookieParser = require('cookie-parser')

var reqCount = 0;
var originalKey = 'originalAB';
var parentConfig = {
    cookieName: 'abTestCookie',
    weightage: {

    },
    expireTimeInHours: 1
};

function middlewareWrapper(req, res, next) {

    if (undefined === req.cookies || null === req.cookies) {
        next('Please use cookie parser before calling getABTestCases method.')
    } else {

        if (req.cookies[parentConfig.cookieName]) {
            //res.cookie('cookieName',randomNumber, { maxAge: 900000, httpOnly: true });
        } else {
            var result = [];
            reqCount = reqCount + 1;
            for (var i in parentConfig.weightage) {
                if (parentConfig.weightage[i] * 100 > reqCount) {
                    result.push(i);
                }
            }
            if (!result.length) {
                result.push(originalKey);
            }
            //res.cookie(parentConfig.cookieName, result.toString(), { maxAge: parentConfig.expireTimeInHours * 60 * 60 * 1000, httpOnly: true });
        }

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
