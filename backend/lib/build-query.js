'use strict';

function buildQuery(req = {}) {
    let city = req.params.city;
    let { size = 50, page = 1 } = req.query;

    return {
        where: { city },
        page,
        size
    };
}

module.exports = buildQuery;