'use strict';

const extend = require('gextend');
const defaults = {
    logger: extend.shim(console),
    defaultQuery: {
        page: 1,
        size: 100
    },
    data: []
};

class Data {
    constructor(config = {}) {
        config = extend({}, this.constructor.defaults, config);
        this.init(config);
    }

    init(config = {}) {
        if (this.initialized) return;
        this.initialized = true;

        extend(this, config);
        extend.unshim(this);
    }

    load() {
        try {
            this.data = require(this.dbPath);
            this.logger.info('database loaded...');
        } catch (error) {
            this.logger.error('database error...');
            this.logger.error(error);
            throw new Error('Unable to load data');
        }
    }

    /**
     * Perform a query to our dataset.
     * 
     * @param {Object} query query object
     */
    find(query = {}) {
        query = extend({}, this.defaultQuery, query);

        let data = this.filter(query);
        let response = this.paginate(data, query.page, query.size);

        return Promise.resolve(response);
    }

    filter(query = {}) {
        if (query.where) {
            if (query.where.codeLabel) {
                let label = query.where.codeLabel;
                return this.findByCodeLabel(label);
            }
        }

        return (this.data.incidents || []).concat();
    }

    findByCodeLabel(label) {
        if (!Array.isArray(label)) {
            label = [label];
        }

        let indices = label.map(key => this.data.indices[key]);

        indices = indices.flat().filter(unique);

        return this.data.incidents.filter(item => {
            return indices.indexOf(item.id) !== -1;
        }) || [];
    }

    paginate(data = [], page = 1, size = 2) {

        let totalPages = Math.ceil(this.count / size);

        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        let end = page * size;

        let out = data.slice((page - 1) * size, end);

        return {
            data: out,
            meta: {
                page: page,
                size: size,
                count: out.length,
                total: this.count
            }
        };

    }

    get count() {
        return (this.data.incidents || []).length;
    }
}

Data.defaults = defaults;

module.exports = Data;

function unique(value, index, self) {
    return self.indexOf(value) === index;
}