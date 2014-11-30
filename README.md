## express-route-tree
express-route-tree can provided a very convenient and quickly way to create routes for the express application.

Let's see it.

## Install
`npm install express-route-tree`

## Features

1. Auto route without a large configuration file.
2. Restful mode. Every path may be a parameter, if you want.
3. In index function and path not include 'index', the first 'xx.html' paramter will be parsed to 'xx' for SEO requirement.
4. support express 3.x and 4.x

## Update

1. There will be not come to the default index function when route not find corresponding function, if the index function have not more than 3 arguments.[new in 4.1.0]

## Usage

```js
// File: app.js

var express = require('express'),
    app = express(),
    route = require('express-route-tree');

app.use(route(__dirname + '/controller'));
/*
// Advanced Settings
var fileRouter = ['robots.txt'],
    shortAddress = ['mon', 'tus'],
    regionRoute = { china: { id: '1', name: '中国' } };
app.use(route(__dirname + '/controller', function(req, res, next, controller) {
    var pathname = req.path.substring(1);
    if (~fileRouter.indexOf(pathname)) {
        return res.sendFile(pathname, { maxAge: 3600 * 24 * 1000 });
    } else if (~shortAddress.indexOf(pathname))) {
        // some short address
        return controller.index.season(req, res, next, shortAddress[pathname] + 1);
    } else if (regionRoute[pathname]) {
        return controller.index.region(req, res, next, regionRoute[pathname].id, regionRoute[pathname].name);
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
 *  Also, if there is not matched function, such as '/app/test'(no `exports.test = function(){}` in app.js),
 *  Then, router will send this request to `app.index` function,
 *  And put the `test` as the four argument, like `function(req, res, next, test)`
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

// And also support any method from request header.
// like: exports.deleteApp = function(req, res, next, ...) { ... }

```

## Test

```sh
mocha
# or
npm test # npm run-script test
```

## The End

Anyway, try to use. And see the example in test directory.

Hope this is useful to you.

And give me your pull request if you have any improvements or suggestions
