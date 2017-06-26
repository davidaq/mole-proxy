var version = process.version.match(/^v([0-9]+)\./)[1] - 0;
if (version < 6) {
    console.log('Node version too old (' + process.version + '), please update to v6.x');
    process.exit(1);
}

var argv = process.argv.slice(2);
var adapter;

if (argv[0] == 'udp') {
    argv = argv.slice(1);
    adapter = require('./udpio');
} else {
    adapter = require('./tcpio');
}

if (Math.floor(argv[0]) == argv[0]) {
    argv.unshift('cp01-rdqa-dev418-anqin-iwm.epc.baidu.com:8008');
}

if (argv[0] == 'server' && !argv[1]) {
    argv[1] = '8008';
} else if (argv[0] && argv[0] != 'server') {
    if (/[a-zA-Z0-9\.\-_\:]+/.test(argv[0])) {
        var parts = argv[0].split(':');
        argv.splice(0, 1, parts[0], parts[1] || '8008');
    } else {
        argv = [];
    }
}

if (argv.length == 2 && argv[0] == 'server') {
    if (Math.floor(argv[1]) == argv[1]) {
        require('./server')(adapter, argv[1]);
    } else {
        console.log('Listen port must be a integer');
    }
} else if (argv.length >= 3) {
    if (!argv[3]) {
        argv[3] = argv[2];
    }
    if (Math.floor(argv[1]) == argv[1] && Math.floor(argv[2]) == argv[2] && Math.floor(argv[3]) == argv[3]) {
        require('./client')(adapter, argv[0], argv[1], argv[2], argv[3]);
    } else {
        console.log('All ports should be integers');
    }
} else {
    var packageInfo = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, 'package.json')));
    console.log('Mole Proxy v' + packageInfo.version + '. Map your local listen port to a remote server.\n');
    console.log('Usage:');
    console.log('    mole-proxy [udp] server [tunnel port]');
    console.log(' or');
    console.log('    mole-proxy [udp] <server[:tunnel port]> <local port> [remote port]');
    console.log('\n');
    console.log('Server example:');
    console.log('    mole-proxy server');
    console.log('Client example:');
    console.log('    mole-proxy example.com 8080 8211');
    console.log('\n');
    console.log('Default tunnel port is 8008, you may change it by:');
    console.log('    mole-proxy server 8009');
    console.log(' or');
    console.log('    mole-proxy example.com:8009 8080 8211');
}

