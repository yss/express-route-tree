'use strict';

var fs = require('fs'),
    path = require('path');

var controller = {};

function isDirectory(filepath) {
    if (fs.existsSync(filepath)) {
        return fs.statSync(filepath).isDirectory();
    }
}

function initController(controller, dirname) {
    fs.readdirSync(dirname).forEach(function(item) {
        var filepath = path.join(dirname, item);
        if (isDirectory(filepath)) {
            controller[item] = {};
            initController(controller[item], filepath);
        } else if (/\.js$/.test(item) && item.indexOf('.') !== 0) { // js file and not hidden file
            controller[item.slice(0, -3)] = require(filepath);
            console.log('Loading:', filepath);
        }
    });
}

function addAlias(alias, controller) {
    if (!alias || typeof alias !== 'object') {
        return;
    }

    Object.keys(alias).forEach(function(key) {
        var fn = controller;
        alias[key].split('.').forEach(function(method) {
            fn = fn[method];
        });
        if (typeof fn !== 'function' && typeof fn !== 'object') {
            throw new Error('Alias value must be a function or object.');
        }

        var aliasController = controller,
            keyArr = key.split('.');

        key = keyArr.pop();

        keyArr.forEach(function(method) {
            aliasController = aliasController[method] = aliasController[method] || {};
        });

        if (aliasController.hasOwnProperty(key)) {
            throw new Error('The key `' + key + '` is exists, and can not be replaced.');
        }

        aliasController[key] = fn;
    });
}

var METHODS = 'post,put,delete'.split(','), // specially for get and head
    TYPE_FUNCTION = 'function',
    TYPE_OBJECT = 'object',
    METHOD_GET = 'GET',
    METHOD_HEAD = 'HEAD',
    METHOD_OPTIONS = 'OPTIONS',
    DEFAULT_PATH = 'index';

/**
 * express-route-tree
 * @param {String} dirname
 * @param {Object} [alias]
 * @param {Function} [unknowRouteHandle]
 * @return {Function}
 */
function Route(dirname, alias, unknowRouteHandle) {
    if (typeof alias === TYPE_FUNCTION) {
        unknowRouteHandle = alias;
        alias = null;
    }
    initController(controller, dirname);
    addAlias(alias, controller);
    // prevent the controller object to be modified.
    Object.seal(controller);
    return function(req, res, next) {
        var pathArr = req.path.substring(1).split('/'),
            app = controller,
            reqMethod = req.method,
            isGet = reqMethod === METHOD_GET,
            path,
            method;

        if (pathArr[0] && !app[pathArr[0]]) {
            if (unknowRouteHandle) {
                return unknowRouteHandle(req, res, next, controller);
            } else {
                return next('route not found.');
            }
        }
        while (true) {
            // path== "0"
            path = pathArr.shift() || DEFAULT_PATH;
            if (typeof app[path] === TYPE_OBJECT) {
                app = app[path];
                continue;
            }
            if (reqMethod === METHOD_HEAD) {
                Route.headRequestHandle(req, res, app, path);
                break;
            }
            if (reqMethod === METHOD_OPTIONS) {
                Route.optionsRequestHandle(req, res, app, path);
                break;
            }
            method = isGet ? path : reqMethod.toLowerCase() + path.substring(0, 1).toUpperCase() + path.substring(1);
            if (typeof app[method] === TYPE_FUNCTION) {
                pathArr.unshift(req, res, next);
                app[method].apply(null, pathArr);
            } else {
                pathArr.unshift(req, res, next, path.replace('.html', ''));
                method = isGet ? DEFAULT_PATH : reqMethod.toLowerCase() + 'Index';
                if (typeof app[method] === TYPE_FUNCTION && app[method].length > 3) { // the index function must contains more than 3 arguments
                    app[method].apply(null, pathArr);
                } else {
                    next('route not found.');
                }
            }
            break;
        }
    };
}

/**
 * for OPTIONS /
 * @param req
 * @param res
 * @param {Object} app the last controller object
 * @param {String} path
 */
Route.optionsRequestHandle = function(req, res, app, path) {
    var methods = [];

    if (typeof app[path] === TYPE_FUNCTION || typeof app.index === TYPE_FUNCTION) {
        methods.push(METHOD_HEAD, METHOD_GET);
    }

    METHODS.forEach(function(method) {
        if (typeof app[method + path.substring(0, 1).toUpperCase() + path.substring(1)] === TYPE_FUNCTION
            || typeof app[method + 'Index'] === TYPE_FUNCTION) {
            methods.push(method.toUpperCase());
        }
    });

    res.send(methods.join(','));
    res.end();
};

/**
 * for HEAD /
 * @param req
 * @param res
 * @param {Object} app the last controller object
 * @param {String} method
 */
Route.headRequestHandle = function(req, res, app, method) {
    if (typeof app[method] === TYPE_FUNCTION || typeof app.index === TYPE_FUNCTION) {
        res.status(200);
    } else {
        res.status(404);
    }
    res.end();
};

// to get the original controller object
Route.controller = controller;

module.exports = Route;
