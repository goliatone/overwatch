'use strict';
const path = require('path');
const sirv = require('sirv');

module.exports.init = function(server, config) {
    let defaultPath = path.join(__dirname, '../public');
    const publicPath = path.resolve(config.path || defaultPath);

    const files = sirv(publicPath, { dev: true });
    server.use(files);
};