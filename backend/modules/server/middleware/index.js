'use strict';
const cors = require('cors');
const { urlencoded, json } = require('body-parser');
const Keypath = require('gkeypath');

module.exports.init = function(server, config) {

    const jsonOptions = Keypath.get(config, 'middlewareOptions.json', {});
    server.use(json(jsonOptions));
    server.use(urlencoded());
    server.use(cors());

    ['public', 'views'].map(name => {
        console.log('resigster middleware', name);

        let options = Keypath.get(config, `middlewareOptions.${name}`, {});
        require(`./${name}`).init(server, options);
    });
};