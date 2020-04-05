'use strict';

const send = require('@polka/send-type');
const authenticate = require('../../../lib/auth');
const buildQuery = require('../../../lib/build-query');

module.exports.init = function(server, config) {

    server.logger.info('Server version %s', config.api.version);

    const version = config.api.version;
    const mountId = `api/${version}`;

    const api = server.getSubapp(mountId);

    /**
     * Handle main requests for incident data.
     * 
     * We take a very naïve approach to handling 
     * errors here, if a query is malformed we just 
     * throw.  
     */
    api.get('crime/:city', authenticate, (req, res) => {
        try {
            let query = buildQuery(req);
            server.emitCommand('api.find', {
                query,
                respondTo(event) {
                    let { data, meta } = event.response;
                    send(res, 200, {
                        status: true,
                        data,
                        meta
                    });
                }
            });
        } catch (error) {
            server.logger.error('Error handling request');
            server.logger.error(error);

            send(res, 500, {
                status: false,
                message: 'Internal Server Error'
            });
        }


    });

    server.mountSubapp(mountId);
};