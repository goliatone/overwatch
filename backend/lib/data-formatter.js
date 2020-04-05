'use strict';

const moment = require('moment');
const { resolve } = require('path');
const { existsSync } = require('fs');

const methods = {
    load: (filepath) => {
        filepath = resolve(filepath)
        if (!existsSync(filepath)) {
            throw new Error('Need valid path');
        }
        return require(filepath);
    },
    format: (data = [], stringify = true) => {
        let output = data.map(methods.formatItem);
        if (stringify) output = JSON.stringify(output);
        return output;
    },
    formatItem(item, index) {
        let out = {};
        out.id = index + 1;
        out.date = item.cdatetime;
        out.timestamp = moment(item.cdatetime, 'M/D/YY H:mm').toDate();
        out.address = methods.capitalize(methods.trim(item.address));
        out.beat = methods.trim(item.beat);
        out.grid = methods.int(item.grid);
        out.description = methods.capitalize(methods.trim(item.crimedescr));
        out.code = methods.trim(item.ucr_ncic_code);
        out.coordinates = [
            methods.float(item.longitude),
            methods.float(item.latitude)
        ];
        return out;
    },
    trim(str = '') {
        if (!str) return '';
        if (typeof str !== 'string') return '';
        return str.trim();
    },
    int(str = '') {
        if (!str) return null;
        if (typeof str !== 'string') return null;
        return parseInt(str);
    },
    float(str = '') {
        if (!str) return null;
        if (typeof str !== 'string') return null;
        return parseFloat(str);
    },
    capitalize(str = '') {
        const firstLetter = str.charAt(0).toUpperCase();
        const restOfString = str.slice(1).toLowerCase();
        return firstLetter + restOfString;
    }
};

module.exports = methods;