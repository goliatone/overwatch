'use strict';
const test = require('tape');
const pkg = require('../package.json');

const supertest = require('supertest');

const server = supertest.agent('http://localhost:1981');

test('GET /api/v1/crime/sacramento', t => {
    server
        .get('/api/v1/crime/sacramento')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'Response has no error');
            t.ok(res, 'Response should have a res object');
            t.ok(res.body, 'Response has body');
            t.ok(res.body.status, 'Response response should have success');
            t.ok(res.body.meta, 'Response response should have meta object');
            t.ok(res.body.data, 'Response response should have data object');
            t.end();
        });
});

test.only('GET /api/v1/crime/sacramento?page=2&size=2', t => {

    server
        .get('/api/v1/crime/sacramento?page=2&size=2')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'Response has no error');
            t.ok(res, 'Response should have a res object');
            t.ok(res.body, 'Response has body');
            t.ok(res.body.status, 'Response response should have success');

            t.ok(res.body.data, 'Response response should have data object');
            t.ok(res.body.data.length, 2, 'We should include the right number of items in response');
            t.ok(res.body.meta, 'Response response should have meta object');
            t.ok(res.body.meta.size, 'Meta object should include size');
            t.ok(res.body.meta.count, 'Meta object should include size');
            t.ok(res.body.meta.count, 'Meta object should include size');
            t.end();
        });
});