const test = require('node:test');
const assert = require('node:assert/strict');
const validateEmail = require('./validateEmail');

test('accepts standard email addresses', () => {
  assert.equal(validateEmail('user@example.com'), true);
  assert.equal(validateEmail('first.last@example.co.uk'), true);
  assert.equal(validateEmail('user+tag@example.com'), true);
  assert.equal(validateEmail('user_name@sub.example.com'), true);
  assert.equal(validateEmail('user%name@example.com'), true);
  assert.equal(validateEmail('123@example.com'), true);
});

test('trims surrounding whitespace before validating', () => {
  assert.equal(validateEmail('  user@example.com  '), true);
});

test('rejects invalid email addresses', () => {
  assert.equal(validateEmail(''), false);
  assert.equal(validateEmail('plainaddress'), false);
  assert.equal(validateEmail('@example.com'), false);
  assert.equal(validateEmail('user@'), false);
  assert.equal(validateEmail('user@@example.com'), false);
  assert.equal(validateEmail('user@example'), false);
  assert.equal(validateEmail('user @example.com'), false);
  assert.equal(validateEmail('user@ example.com'), false);
  assert.equal(validateEmail('user@-example.com'), false);
  assert.equal(validateEmail('user@example-.com'), false);
  assert.equal(validateEmail('user@example..com'), false);
  assert.equal(validateEmail('user@example.c'), false);
});

test('rejects non-string input', () => {
  assert.equal(validateEmail(null), false);
  assert.equal(validateEmail(undefined), false);
  assert.equal(validateEmail(12345), false);
  assert.equal(validateEmail({}), false);
});
