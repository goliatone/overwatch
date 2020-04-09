'use strict';

const { resolve } = require('path');
const filepath = resolve('./tests/fixtures/data.json');
const data = require(filepath);

module.exports = {
    filepath,
    data,
    query: {
        page: 1,
        size: 3
    },
    result: {
        data: data.incidents.slice(0, 3),
        meta: {
            page: 1,
            size: 3,
            total: data.incidents.length,
            count: 3
        }
    },
    /**
     * Our items are indexed 
     */
    filter: { where: { codeLabel: 'label' }, size: data.indices.label.length },
    filtered: data.incidents.slice(0, 7),
    filteredResult: {
        data: data.incidents.slice(0, data.indices.label.length),
        meta: {
            page: 1,
            size: data.indices.label.length,
            count: data.indices.label.length,
            total: data.incidents.length,
        }
    }
};