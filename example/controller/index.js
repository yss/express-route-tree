exports.index = function(req, res, next) {
    res.send('hello, this is index page.');
    res.end();
};

exports.putIndex = function(req, res, next, id) {
    res.send(id);
    res.end();
};

exports.deleteIndex = function(req, res, next, id) {
    res.send(id);
    res.end();
};
