'use strict';


class ApiFindCommand {
    async execute(event) {
        const context = event.context;
        const logger = context.getLogger('api.find');

        let query = event.query;
        logger.info('query', query);
        const result = await context.persistence.find(query);

        return result;
    }
}

ApiFindCommand.ID = 'ApiFindCommand';

module.exports = ApiFindCommand;