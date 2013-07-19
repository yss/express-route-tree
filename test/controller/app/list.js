exports.index = function(req, res, next, page) {
    res.send('this is app list page. And the page number is ' +  (page || 0));
    res.end();
};
