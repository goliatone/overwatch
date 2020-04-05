'use strict';
const test = require('tape');

const Persistence = require('../lib/database');
const fixtures = require('./fixtures/persistence');

test('Persistence should take dbPath parameter', t => {
    const config = {
        dbPath: fixtures.filepath
    };

    const db = new Persistence(config);

    t.equals(db.dbPath, fixtures.filepath, 'Should have file path');
    t.end();
});

test('Persistence should be able to load data', t => {
    const config = {
        dbPath: fixtures.filepath,
        logger: {
            info() {},
            error() {}
        }
    };

    const db = new Persistence(config);

    db.load();

    t.ok(db.data, 'Should load data');
    t.end();
});

test('Persistence should throw if unable to load data', t => {
    const config = {
        dbPath: './nothing/here.json',
        logger: {
            info() {},
            error() {}
        }
    };

    const db = new Persistence(config);

    try {
        db.load();
    } catch (error) {
        t.ok(error, 'Should throw if no file');
    }

    t.end();
});

test('Persistence should be able to find items', async t => {
    const config = {
        data: fixtures.data
    };

    const db = new Persistence(config);
    const result = await db.find(fixtures.query);
    t.deepEquals(result, fixtures.result, 'Should load data');
    t.end();
});

test('Persistence should be able to paginate items', async t => {

    const data = [1, 2, 3, 4, 5, 6, 7, 8];

    const config = {
        data: [1, 2, 3, 4, 5, 6, 7, 8]
    };

    const db = new Persistence(config);

    let result;

    result = db.paginate(data, 0, 4);
    t.deepEquals(result.data, [1, 2, 3, 4], 'Should page data');

    result = db.paginate(data, 1, 4);
    t.deepEquals(result.data, [1, 2, 3, 4], 'Should page data');

    result = db.paginate(data, 2, 4);
    t.deepEquals(result.data, [5, 6, 7, 8], 'Should page data');

    result = db.paginate();
    t.deepEquals(result.data, [], 'Should page data');

    result = db.paginate(data, 3, 4);
    t.deepEquals(result.data, [5, 6, 7, 8], 'Should page data');

    result = db.paginate(data, 3, 40);
    t.deepEquals(result.data, data, 'Should page data');

    t.end();
});