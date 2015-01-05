var Path = require('path');
var controllerDirname = Path.join(__dirname, '../example/controller/');

function mix(s, o) {
    for(var k in o) {
        s[k] = o[k];
    }
    return s;
}
function noop(){}
function simulator(obj) {
    var Router = require('../route.js');
    obj = obj || {};
    Router(controllerDirname, obj.unknowRouteHandle)(
        mix({path: '/', method: 'GET'}, obj.req || {}),
        mix({send: noop, end: noop}, obj.res),
        obj.next || noop
    );
}
describe('express-route-tree', function() {
    describe('HTTP GET /', function() {
        it('Should be return a welcome string.', function(done) {
            simulator({
                res: {
                    send: function(str) {
                        str.should.equal('hello, this is index page.');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP POST /', function() {
        it('Should be come to next function.', function(done) {
            simulator({
                req: {
                    method: 'POST'
                },
                next: function() {
                    done();
                }
            });
        });
    });

    describe('HTTP PUT /index/id', function() {
        it('Should be return id.', function(done) {
            simulator({
                req: {
                    method: 'PUT',
                    path: '/index/id'
                },
                res: {
                    send: function(str) {
                        str.should.equal('id');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP DELETE /index/id', function() {
        it('Should be return id.', function(done) {
            simulator({
                req: {
                    method: 'DELETE',
                    path: '/index/id'
                },
                res: {
                    send: function(str) {
                        str.should.equal('id');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP GET /app/list', function() {
        it('Should be send a String with Page: undefined Second: undefined', function(done) {
            simulator({
                req: {
                    path: '/app/list'
                },
                res: {
                    send: function(str) {
                        str.should.equal('Page: undefined Second: undefined');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP GET /app/list/1', function() {
        it('Should be send a String with Page: 1 Second: undefined', function(done) {
            simulator({
                req: {
                    path: '/app/list/1'
                },
                res: {
                    send: function(str) {
                        str.should.equal('Page: 1 Second: undefined');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP GET /app/list/1/a', function() {
        it('Should be send a String with Page: 1 Second: a', function(done) {
            simulator({
                req: {
                    path: '/app/list/1/a'
                },
                res: {
                    send: function(str) {
                        str.should.equal('Page: 1 Second: a');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP POST /app/list/set', function() {
        it('Should be send a String with Page: undefined Second: undefined', function(done) {
            simulator({
                req: {
                    path: '/app/list/set',
                    method: 'POST'
                },
                res: {
                    send: function(str) {
                        str.should.equal('Page: undefined Second: undefined');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP POST /app/list/set/1', function() {
        it('Should be send a String with Page: 1 Second: undefined', function(done) {
            simulator({
                req: {
                    path: '/app/list/set/1',
                    method: 'POST'
                },
                res: {
                    send: function(str) {
                        str.should.equal('Page: 1 Second: undefined');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP POST /app/list/set/1/a', function() {
        it('Should be send a String with Page: 1 Second: a', function(done) {
            simulator({
                req: {
                    path: '/app/list/set/1/a',
                    method: 'POST'
                },
                res: {
                    send: function(str) {
                        str.should.equal('Page: 1 Second: a');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP PUT /app/list/set/1/a', function() {
        it('Should be send a String with Page: 1 Second: a', function(done) {
            simulator({
                req: {
                    path: '/app/list/set/1/a',
                    method: 'PUT'
                },
                res: {
                    send: function(str) {
                        str.should.equal('Page: 1 Second: a');
                        done();
                    }
                }
            });
        });
    });

    describe('HTTP GET /xx', function() {
        it('Should be come to unknowRouteHandle', function(done) {
            simulator({
                req: {
                    path: '/xx'
                },
                unknowRouteHandle: function() {
                    done();
                }
            })
        });
    });

    describe('HTTP GET /index/xx', function() {
        it('This is a very special test.');
        it('Should be come to next function with unknow route. Because the index.index function not have more than 3 arguments', function(done) {
            simulator({
                req: {
                    path: '/index/xx'
                },
                next: function(str) {
                    str.should.equal('unknow route.');
                    done();
                }
            });
        });
    });
});


