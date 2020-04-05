'use strict';
const polka = require('polka');

module.exports.init = function(context, config) {
    const logger = context.getLogger('server');

    return new Promise((resolve, reject) => {

        const { createServer } = config.https ? require('https') : require('http');

        /**
         * We can overwrite the default classes used 
         * to handle req/res.
         * We can also pass certificate information.
         */
        const transport = createServer(config.options);

        //TODO: Reject using this error handler?
        const server = polka({ server: transport }).listen(config.port || 3000, err => {
            if (err) logger.error('ERROR: %s', err);
        });

        server.getTransport = function() {
            return transport;
        };

        server.logger = logger;

        server._subapps = {};

        server.emitCommand = function(type, event) {
            return context.emit(type, event);
        };

        server.getSubapp = function(id) {
            if (server._subapps[id]) {
                return server._subapps[id];
            }

            server._subapps[id] = polka();

            return server._subapps[id];
        };

        server.mountSubapp = function(route) {
            const app = this.getSubapp(route);
            if (!app) {
                logger.error('Sub application %s not found', route);
                return;
            }
            logger.warn('Mounting sub application %s', route);
            server.use(route, app);
        };

        /************************************************
         * MIDDLEWARE
         * Register root level middleware
         ***********************************************/
        require('./middleware').init(server, config);

        /************************************************
         * ROUTES
         * Register root level routes
         ***********************************************/
        require('./routes').init(server, config);

        resolve(server);
    });
};