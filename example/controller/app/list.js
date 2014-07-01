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
 * For POST Request. Support urls:
 * 1. /app/list => page: undefined | second: undefind
 * 2. /app/list/0 => page: 0 | second: undefined
 * 3. /app/list/1.html => page: 1 | second: undefined
 * 4. /app/list/1/a => page: 1 | second: a
 */
exports.postSet = function(req, res, next, page, second) {
    res.send('Page: ' + page + ' Second: ' + second);
    res.end();
}
