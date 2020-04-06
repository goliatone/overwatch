'use strict';
const { resolve } = require('path');
const { readFileSync } = require('fs');


module.exports = {
    host: process.env.NODE_APP_HOST,
    port: process.env.NODE_APP_PORT || 1345,
    env: process.env.NODE_ENV || 'production',
    https: false,
    /**
     * !NOTE: This is only for local development!!
     */
    // https: true,
    // options: {
    //     key: readFileSync('../ops/certs/crimeviz-localhost.key'),
    //     cert: readFileSync('../ops/certs/crimeviz-localhost.crt'),
    // },
    dependencies: ['persistence'],
    info: {
        version: '${package.version}',
        boot: new Date()
    },
    api: {
        version: 'v1'
    },
    frontend: {
        baseUrl: '${server.host}',
        /**
         * We send this token to the front-end.
         * We would normally pull from user session
         * and use that... 
         */
        token: '256203db-dd78-4de3-8bd7-8a88861225f6',
        title: 'Overwatch - Crime Watcher',
        bodyPath: resolve('../README.md'),
        body: readFileSync(resolve('../README.md')).toString()
    },
    middlewareOptions: {
        public: {
            path: resolve('./modules/server/public')
        }
    }
};