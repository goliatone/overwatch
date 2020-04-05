'use strict';
const path = require('path');
const sirv = require('sirv');

module.exports.init = function(server, config) {
    console.log('config', config)
    let defaultPath = path.join(__dirname, '../public');
    const publicPath = path.resolve(config.path || defaultPath);


    const files = sirv(publicPath);
    console.log('path is', files);
    server.use(files);
};