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
        if (controller.hasOwnProperty(key)) {
            throw new Error('The key `' + key + '` is exists, and can not be replaced.');
        }
        alias[key].split('.').forEach(function(method) {
            fn = fn[method];
        });
        if (typeof fn !== 'function' && typeof fn !== 'object') {
            throw new Error('Alias value must be a function or object.');
        }

        controller[key] = fn;
    });
}


/**
 * express-route-tree
 * @param {String} dirname
 * @param {Object} [alias]
 * @param {Function} [unknowRouteHandle]
 * @return {Function}
 */
function Route(dirname, alias, unknowRouteHandle) {
    if (typeof alias === 'function') {
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
            isGet = req.method === 'GET',
            path,
            method;

        if (pathArr[0] && !app[pathArr[0]]) {
            if (unknowRouteHandle) {
                return unknowRouteHandle(req, res, next, controller);
            } else {
                return next('unknow route.');
            }
        }
        while (true) {
            // path== "0"
            path = pathArr.shift() || 'index';
            if (typeof app[path] === 'object') {
                app = app[path];
                continue;
            }
            method = isGet ? path : req.method.toLowerCase() + path.substring(0, 1).toUpperCase() + path.substring(1);
            if (typeof app[method] === 'function') {
                pathArr.unshift(req, res, next);
                app[method].apply(null, pathArr);
            } else {
                pathArr.unshift(req, res, next, path.replace('.html', ''));
                method = isGet ? 'index' : req.method.toLowerCase() + 'Index';
                if (typeof app[method] === 'function' && app[method].length > 3) { // the index function must contains more than 3 arguments
                    app[method].apply(null, pathArr);
                } else {
                    next('unknow route.');
                }
            }
            break;
        }
    };
};

// to get the original controller object
Route.controller = controller;

module.exports = Route;
