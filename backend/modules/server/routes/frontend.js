'use strict';

module.exports.init = function(server, config) {
    server.logger.info('Create frontend route...');

    server.get('/', (req, res) => {
        res.renderFile('index', {
            baseUrl: config.baseUrl,
            token: config.token
        });
    });
};