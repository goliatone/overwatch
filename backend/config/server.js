'use strict';

const { resolve } = require('path');

module.exports = {
    host: process.env.NODE_APP_HOST,
    port: process.env.NODE_APP_PORT || 1345,
    env: process.env.NODE_ENV || 'production',
    https: false, //
    dependencies: ['persistence'],
    info: {
        version: '${package.version}',
        boot: new Date()
    },
    api: {
        version: 'v1'
    },
    middlewareOptions: {
        public: {
            path: resolve('./modules/server/public')
        },
        frontend: {
            baseUrl: '${server.host}',
            /**
             * We send this token to the front-end.
             * We would normally pull from user session
             * and use that... 
             */
            token: '256203db-dd78-4de3-8bd7-8a88861225f6'
        }
    }
};