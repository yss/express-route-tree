exports.index = function(req, res, next) {
    res.send('The params are:' + Array.prototype.slice.call(arguments, 3));
    res.end();
};
