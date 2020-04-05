'use strict';
const test = require('tape');

const formData = require('../lib/data-formatter');
const fixtures = require('./fixtures/format-data');

test('Should format data correctly', t => {
    const data = fixtures.raw;
    const result = formData.format(data);
    t.equals(result, fixtures.expected, 'Should format data');
    t.end();
});

test('Should trim strings', t => {
    let result = formData.trim(' string ');
    t.equals(result, 'string', 'Should trim strings');

    result = formData.trim();
    t.equals(result, '', 'Should handle empty strings');
    t.end();
});

test('Should parse integers from string', t => {
    let result = formData.int('3');
    t.equals(result, 3, 'Should parse integers');

    result = formData.int();
    t.not(result, 'Should handle empty strings');
    t.end();
});

test('Should parse floats from string', t => {
    let result = formData.float('-33.3333');
    t.equals(result, -33.3333, 'Should parse floats');

    result = formData.float();
    t.not(result, 'Should handle empty floats');

    result = formData.float(3);
    t.not(result, 'Should handle numbers');

    t.end();
});

test('Should capitalize strings', t => {
    let result = formData.capitalize('THIS IS MY UPPERCASE TEXT');
    t.equals(result, 'This is my uppercase text', 'Should capitalize strings');

    result = formData.capitalize('this is my lowercase text');
    t.equals(result, 'This is my lowercase text', 'Should capitalize strings');

    result = formData.capitalize();
    t.not(result, 'Should handle empty strings');

    t.end();
});

test('Should load JSON file', t => {
    let result = formData.load(fixtures.filepath);
    t.ok(result, 'Should load data');
    t.ok(typeof result === 'object', 'Should load data');
    t.end();
});

test('Should throw error if JSON file 404', t => {
    try {
        formData.load('./nothing/here.json');
    } catch (error) {
        t.ok(error, 'Should throw error');
    }
    t.end();
});