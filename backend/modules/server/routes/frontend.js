'use strict';
const marked = require('marked');
const { readFileSync } = require('fs');

module.exports.init = function(server, config) {
    server.logger.info('Create frontend route...');

    server.get('/', (req, res) => {
        res.renderFile('index', {
            baseUrl: config.frontend.baseUrl,
            token: config.frontend.token
        });
    });

    server.get('/about', (req, res) => {
        const content = config.frontend.body.toString();
        res.renderFile('about', {
            title: config.frontend.title,
            // body: marked(config.frontend.body.toString())
            body: marked(content),
            version: config.frontend.version
        });
    });
};