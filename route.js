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
        } else if (/\.js$/.test(item)) {
            controller[item.slice(0, -3)] = require(filepath);
            console.log('Loading:', filepath);
        }
    });
}

/**
 * express-route-tree
 * @param {String} dirname
 * @param [Function] routeFilter
 * @return {Function}
 */
function Route(dirname, routeFilter) {
    initController(controller, dirname);
    Object.seal(controller);
    return function(req, res, next) {
        var pathArr = req.path.substring(1).split('/'),
            app = controller,
            isGet = req.method === 'GET',
            method;

        if (pathArr[0] && !app[pathArr[0]]) {
            if (routeFilter) {
                return routeFilter(req, res, next, app);
            } else {
                return next('unknow route.');
            }
        }
        while (true) {
            // method == "0"
            method = pathArr.shift() || 'index';
            if (typeof app[method] === 'object') {
                app = app[method];
                continue;
            }
            if (!isGet) {
                method = req.method.toLowerCase() + method.substring(0, 1).toUpperCase() + method.substring(1);
            }
            if (typeof app[method] === 'function') {
                pathArr.unshift(req, res, next);
                app[method].apply(null, pathArr);
            } else {
                pathArr.unshift(req, res, next, method.replace('.html', ''));
                app.index.apply(null, pathArr);
            }
            break;
        }
    };
};

// to get the original controller object
Route.controller = controller;

module.exports = Route;
