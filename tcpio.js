var net = require('net');

exports.frameSize = 4096;

exports.createConnection = function (opt) {
    return net.createConnection(opt);
};

exports.createServer = function (cb) {
    return net.createServer({allowHalfOpen: false}, cb);
};

