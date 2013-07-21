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
 * Support urls:
 * 1. /app/list => page: undefined | second: undefind
 * 2. /app/list/0 => page: 0 | second: undefined
 * 3. /app/list/1.html => page: 1 | second: undefined
 * 4. /app/list/1/a => page: 1 | second: a
 */
export.index = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
};

```
