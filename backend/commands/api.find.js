'use strict';


class ApiFindCommand {
    async execute(event) {
        const context = event.context;
        const logger = context.getLogger('api.find');

        let query = event.query;

        _cast(query, 'page', 'int');
        _cast(query, 'size', 'int');

        logger.info('query', query);
        const result = await context.persistence.find(query);

        return result;
    }
}

ApiFindCommand.ID = 'ApiFindCommand';

module.exports = ApiFindCommand;

function _cast(src, attr, type = 'int') {
    if (!src.hasOwnProperty(attr)) return;
    switch (type) {
        case 'int':
            src[attr] = parseInt(src[attr]);
            break;
    }

}