'use strict';
const test = require('tape');
const pkg = require('../package.json');

const supertest = require('supertest');

const server = supertest.agent('http://localhost:1981');

test('GET /health', t => {
    server
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'Response has no error');
            t.ok(res, 'Response should have a res object');
            t.ok(res.body, 'Response has body');
            t.ok(res.body.status, 'Status should be ok');
            t.end();
        });
});

test('GET /info', t => {
    server
        .get('/info')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'Response has no error');
            t.ok(res, 'Response should have a res object');
            t.ok(res.body, 'Response has body');
            t.ok(res.body.status, 'Status should be ok');
            t.equals(res.body.version, pkg.version, 'Version should match package version');
            t.ok(res.body.boot, 'Should have boot info');
            t.end();
        });
});