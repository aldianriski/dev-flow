// node --test src/__tests__/error-handler.test.js
'use strict';

const { test } = require('node:test');
const assert   = require('node:assert/strict');

const errorHandler = require('../middleware/error-handler');

function makeRes() {
  const res = { _status: null, _body: null };
  res.status = (code) => { res._status = code; return res; };
  res.json   = (body)  => { res._body  = body; return res; };
  return res;
}

test('operational error uses err.status and returns JSON shape', () => {
  const err = Object.assign(new Error('Bad input'), { status: 400 });
  const res = makeRes();
  errorHandler(err, {}, res, () => {});
  assert.equal(res._status, 400);
  assert.deepEqual(res._body, { error: 'Bad input', status: 400 });
});

test('unexpected error defaults to 500', () => {
  const err = new Error('Boom');
  const res = makeRes();
  errorHandler(err, {}, res, () => {});
  assert.equal(res._status, 500);
  assert.equal(res._body.status, 500);
});

test('stack trace not present in response body', () => {
  const err = new Error('Oops');
  const res = makeRes();
  errorHandler(err, {}, res, () => {});
  assert.ok(!('stack' in res._body), 'stack must not be in response');
});
