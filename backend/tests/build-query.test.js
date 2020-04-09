'use strict';
const test = require('tape');

const buildQuery = require('../lib/build-query').buildQuery;
const parseWhere = require('../lib/build-query').parseWhere;
const pickFilters = require('../lib/build-query').pickFilters;

test('buildQuery should build query from request', t => {
    const request = {
        params: {
            city: 'sacramento'
        },
        query: {
            page: 23,
            size: 399,
            where: {
                codeLabel: 'test'
            },
            code: 666
        }
    };

    const expected = {
        page: 23,
        size: 399,
        where: {
            code: 666,
            codeLabel: 'test',
            city: 'sacramento'
        }
    };

    const query = buildQuery(request);

    t.deepEquals(query, expected, 'Should build valid query');
    t.end();
});

test('pickFilters should pick filters from object', t => {
    const request = {
        params: {
            city: 'sacramento'
        },
        query: {
            page: 23,
            size: 399,
            where: {
                codeLabel: 'test'
            },
            code: 666
        }
    };

    const expected = {
        code: 666,
    };

    const filters = pickFilters(request.query, ['size', 'page', 'where']);

    t.deepEquals(filters, expected, 'Should build valid query');
    t.end();
});

test('parseWhere should handle where objects', t => {
    let query = {
        page: 23,
        size: 399,
        where: {
            codeLabel: 'test'
        },
        code: 666
    };

    let expected = {
        codeLabel: 'test'
    };

    const filters = parseWhere(query);

    t.deepEquals(filters, expected, 'Should build valid query');
    t.end();
});

test('parseWhere should handle where strings', t => {
    let query = {
        where: '{"codeLabel": "test"}'
    };

    let expected = {
        codeLabel: 'test'
    };

    const filters = parseWhere(query);

    t.deepEquals(filters, expected, 'Should build valid query');
    t.end();
});