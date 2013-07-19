var express = require('express'),
    app = express(),
    route = require('../route.js');

app.use(express.logger());
app.use(route(__dirname + '/controller'));

app.use(function(err, req, res, next) {
    if (err.stack) {
        res.send(JSON.stringify(err.stack));
    } else {
        res.send(JSON.stringify(err));
    }
    res.end();
});

app.listen(3000);
