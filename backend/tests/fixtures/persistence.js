'use strict';

const { resolve } = require('path');
const data = require(resolve('./tests/fixtures/data.json'));

module.exports = {
    filepath: resolve('./tests/fixtures/data.json'),
    data,
    query: {
        page: 1,
        size: 3
    },
    result: {
        data: data.slice(0, 3),
        meta: {
            page: 1,
            size: 3,
            count: data.length
        }
    }
};