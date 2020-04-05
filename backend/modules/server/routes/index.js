'use strict';
const extend = require('gextend');
const send = require('@polka/send-type');

module.exports.init = function(server, config) {

    server.get('/health', (req, res) => {
        send(res, 200, { status: true });
    });

    server.get('/info', (req, res) => {
        send(res, 200, extend({}, {
            status: true
        }, config.info));
    });

    server.post('/', (req, res) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        let json = JSON.stringify(req.body);
        res.end(json);
    });

    require('./frontend').init(server, config);

    require('./api').init(server, config);
};