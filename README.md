## express-route-tree
express-route-tree can provided a very convenient and quickly way to create routes for the express application. Let's see it.
## Features
1. Auto route without configuration
2. Restful mode
3. In index function and path not include 'index', the first 'xx.html' paramter will be parsed to 'xx' for SEO requirement.
## Usage
```js
// File: app.js

var express = require('express'),
    app = express(),
    route = require('../route.js');

app.use(express.logger());
app.use(route(__dirname + '/controller'));
/*
var fileRouter = ['robots.txt'],
    shortAddress = ['mon', 'tus'];
app.use(route(__dirname + '/controller', function(req, res, next, controller) {
    var pathname = req.path.substring(1);
    if (~fileRouter.indexOf(pathname)) {
        return res.sendFile(pathname, { maxAge: 3600 * 24 * 1000 });
    } else if (shortAddress.indexOf(pathname)) {
        // some short address
        return controller.season.index(req, res, next, shortAddress.indexOf(pathname) + 1);
    } else {
        return next('No such route.');
    }
});
*/

// try it:
// console.log(route.controller);
```
```js
// File: controller/app/list.js

/**
 * Normal Get Request, Support urls:
 * 1. /app/list => page: undefined | second: undefind
 * 2. /app/list/0 => page: 0 | second: undefined
 * 3. /app/list/1.html => page: 1 | second: undefined
 * 4. /app/list/1/a => page: 1 | second: a
 */
exports.index = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
};

/**
 * @Caution:
 *  if you want to use index with other(not get) request method.
 *  you must use full path: /app/list/index/1/a
 *  otherwise, request will be transfered to index function.
 */

/**
 * For POST Request. Support urls:
 * 1. /app/list/set => page: undefined | second: undefind
 * 2. /app/list/set/0 => page: 0 | second: undefined
 * 3. /app/list/set/1 => page: 1 | second: undefined
 * 4. /app/list/set/1/a => page: 1 | second: a
 */
exports.postSet = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
}

/**
 * For PUT Request. Support urls:
 * 1. /app/list/setapp => page: undefined | second: undefind
 * 2. /app/list/setapp/0 => page: 0 | second: undefined
 * 3. /app/list/setapp/1 => page: 1 | second: undefined
 * 4. /app/list/setapp/1/a => page: 1 | second: a
 */
exports.putSetapp = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
}

```
