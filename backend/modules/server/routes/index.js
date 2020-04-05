'use strict';
const extend = require('gextend');
const send = require('@polka/send-type');
const os = require('os');

module.exports.init = function(server, config) {

    config = extend({}, { env: 'prod', info: {} }, config);

    server.get('/health', (req, res) => {
        send(res, 200, {
            status: true
        });
    });

    /**
     * Only expose metrics enpoint during
     * development. In real world app we 
     * would hide this behind auth.
     */
    if (_isDevelopment(config)) {
        server.get('/metrics', (req, res) => {
            send(res, 200, {
                status: true,
                uptime: os.uptime(),
                fremem: os.freemem(),
                totalmem: os.totalmem(),
                memoryUsage: process.memoryUsage()
            });
        });
    }

    server.get('/info', (req, res) => {
        send(res, 200, extend({}, {
            status: true
        }, config.info));
    });

    require('./frontend').init(server, config);

    require('./api').init(server, config);
};

function _isDevelopment(config) {
    return config.env.indexOf('dev') === 0;
}