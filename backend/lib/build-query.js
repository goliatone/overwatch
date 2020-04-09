'use strict';
const extend = require('gextend');

function parseWhere(query = {}) {
    if (!query.where) return {};
    if (typeof query.where === 'string') {
        try {
            return JSON.parse(query.where);
        } catch (error) {
            console.error('error parsing');
            console.error(query.where);

            return {};
        }
    }
    return query.where;
}

module.exports.parseWhere = parseWhere;

function pickFilters(query = {}, ignore = []) {
    let filters = {};
    Object.keys(query).forEach(key => {
        if (ignore.indexOf(key) !== -1) return;
        filters[key] = query[key];
    });
    return filters;
}

module.exports.pickFilters = pickFilters;

function buildQuery(req = {}) {

    let city = req.params.city;
    let { size = 50, page = 1 } = req.query;


    let filters = pickFilters(req.query, ['size', 'page', 'where']);

    let where = extend({}, { city }, filters, parseWhere(req.query));

    return {
        where,
        page,
        size
    };
}

module.exports.buildQuery = buildQuery;