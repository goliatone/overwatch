'use strict';

const send = require('@polka/send-type');

module.exports.init = function(server, config) {

    const version = 'v1';
    const mountId = `api/${version}`;

    // const api = server.getSubapp(mountId);
    // api.get('crime/sacramento', (req, res) => {

    server.get('api/v1/crime/sacramento', (req, res) => {

        let { size = 50, page = 1 } = req.query;

        server.emitCommand('api.find', {
            query: {
                page,
                size
            },
            respondTo(event) {
                let { data, meta } = event.response;
                send(res, 200, {
                    status: true,
                    data,
                    meta
                });
            }
        });
    });

    // server.mountSubapp(mountId);

};