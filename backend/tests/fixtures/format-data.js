'use strict';

const { resolve } = require('path');

module.exports = {
    filepath: resolve('./tests/fixtures/load.json'),
    raw: [{
            "cdatetime": "1/1/06 0:00",
            "address": "3108 OCCIDENTAL DR",
            "district": "3",
            "beat": "3C        ",
            "grid": "1115",
            "crimedescr": "10851(A)VC TAKE VEH W/O OWNER",
            "ucr_ncic_code": "2404",
            "latitude": "38.55042047",
            "longitude": "-121.3914158"
        },
        {
            "cdatetime": "1/1/06 0:00",
            "address": "2082 EXPEDITION WAY",
            "district": "5",
            "beat": "5A        ",
            "grid": "1512",
            "crimedescr": "459 PC  BURGLARY RESIDENCE",
            "ucr_ncic_code": "2204",
            "latitude": "38.47350069",
            "longitude": "-121.4901858"
        },
        {
            "cdatetime": "1/1/06 0:00",
            "address": "4 PALEN CT",
            "district": "2",
            "beat": "2A        ",
            "grid": "212",
            "crimedescr": "10851(A)VC TAKE VEH W/O OWNER",
            "ucr_ncic_code": "2404",
            "latitude": "38.65784584",
            "longitude": "-121.4621009"
        }
    ],
    expected: '[{"id":1,"date":"1/1/06 0:00","timestamp":"2006-01-01T08:00:00.000Z","address":"3108 occidental dr","beat":"3C","grid":1115,"description":"10851(a)vc take veh w/o owner","code":"2404","coordinates":[-121.3914158,38.55042047]},{"id":2,"date":"1/1/06 0:00","timestamp":"2006-01-01T08:00:00.000Z","address":"2082 expedition way","beat":"5A","grid":1512,"description":"459 pc  burglary residence","code":"2204","coordinates":[-121.4901858,38.47350069]},{"id":3,"date":"1/1/06 0:00","timestamp":"2006-01-01T08:00:00.000Z","address":"4 palen ct","beat":"2A","grid":212,"description":"10851(a)vc take veh w/o owner","code":"2404","coordinates":[-121.4621009,38.65784584]}]'
};