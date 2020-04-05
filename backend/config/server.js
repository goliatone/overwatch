'use strict';

const { resolve } = require('path');

module.exports = {
    host: process.env.NODE_APP_HOST,
    port: process.env.NODE_APP_PORT || 1345,
    https: false,
    dependencies: ['persistence'],
    info: {
        version: '${package.version}',
        boot: new Date()
    },
    middlewareOptions: {
        public: {
            path: resolve('./modules/server/public')
        },
        frontend: {
            baseUrl: '${server.host}',
            token: '256203db-dd78-4de3-8bd7-8a88861225f6'
        }
    }
};