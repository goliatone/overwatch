'use strict';

const Persistence = require('../../lib/database');

module.exports.init = function(context, config) {
    const logger = context.getLogger(config.moduleid);

    logger.info('Initialize persistence...');

    return new Promise((resolve, reject) => {

        const db = new Persistence(config);

        try {
            db.load();
            resolve(db);
        } catch (error) {
            reject(error);
        }
    });
};