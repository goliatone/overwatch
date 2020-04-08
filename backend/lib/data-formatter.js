'use strict';

const moment = require('moment');
const { resolve } = require('path');
const { existsSync } = require('fs');



var descriptionCodes = {
    909: ['manslaughter'],
    999: ['homicide'],
    1099: ['child-custody'],
    1210: ['robbery'],
    1211: ['robbery'],
    1212: ['carjacking'],
    1299: ['robbery'],
    1310: ['assault'],
    1313: ['battery'],
    1313: ['battery'],
    1602: ['threat'],
    2099: ['arson'],

    2004: ['theft'],
    2203: ['burglary'],
    2204: ['burglary'],
    2206: ['burglary'],
    2299: ['burglary'],
    2301: ['theft'],
    2302: ['theft'],
    2303: ['theft'],
    2304: ['theft'],
    2305: ['theft'],
    2307: ['theft'],
    2308: ['theft'],
    2309: ['theft'],
    2310: ['theft'],
    2399: ['theft'],
    2404: ['theft'],
    2501: ['forgery'],
    2503: ['forgery'],
    2505: ['forgery'],
    2506: ['forgery'],
    2589: ['forgery'],

    2602: ['fraud'],
    2604: ['impersonation'],
    2605: ['fraud'],
    2699: ['fraud'],
    2799: ['embezzlement'],
    2803: ['stolen-property'],
    2999: ['vandalism'],

    3522: ['drugs'],
    3532: ['drugs'],
    3560: ['drugs'],
    3562: ['drugs'],
    3563: ['drugs'],
    3564: ['drugs'],
    3570: ['drugs'],
    3571: ['drugs'],
    3571: ['drugs'],
    3582: ['drugs'],

    3605: ['indecent'],
    3611: ['indecent'],
    3699: ['indecent'],

    3805: ['disturbance'],

    4004: ['prostitution'],
    4099: ['prostitution'],

    4104: ['minor'],
    4199: ['minor'],

    5005: ['disobedience'],
    5007: ['disobedience'],
    5011: ['disobedience'],
    5012: ['disobedience'],

    5202: ['arms'],
    5207: ['arms'],
    5212: ['arms'],
    5213: ['arms'],
    5299: ['arms'],

    5307: ['disturbance'],
    5309: ['disturbance'],
    5311: ['disturbance'],
    5399: ['disturbance'],

    5400: ['traffic-accident'],
    5401: ['hit-run'],
    5404: ['dui'],
    5499: ['traffic-offense'],
    5599: ['health-safety'],
    5707: ['trespass'],

    7299: ['lewd-conduct'],
    7399: ['public-offense'],
    8101: ['parole'],
    8102: ['provation'],
};


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
        out.codeLabel = descriptionCodes[out.code] ? descriptionCodes[out.code][0] : 'other';
        out.coordinates = [
            methods.float(item.longitude),
            methods.float(item.latitude)
        ];
        return out;
    },
    range(data = [], start = 0, end = undefined) {
        return data.slice(start, end);
    },
    trim(str = '') {
        if (!str) return '';
        if (typeof str !== 'string') return '';
        return (str.trim()).replace(/\s\s+/, ' ');
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
    },
    getTags(str = '') {
        return str.split(' ');
    }
};

module.exports = methods;