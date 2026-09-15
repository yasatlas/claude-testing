const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidAustralianPhoneNumber } = require("./auPhoneValidator");

test("accepts domestic mobile numbers", () => {
  assert.equal(isValidAustralianPhoneNumber("0412345678"), true);
  assert.equal(isValidAustralianPhoneNumber("0412 345 678"), true);
  assert.equal(isValidAustralianPhoneNumber("0412-345-678"), true);
});

test("accepts international mobile numbers", () => {
  assert.equal(isValidAustralianPhoneNumber("+61412345678"), true);
  assert.equal(isValidAustralianPhoneNumber("+61 412 345 678"), true);
  assert.equal(isValidAustralianPhoneNumber("61412345678"), true);
});

test("accepts domestic landline numbers", () => {
  assert.equal(isValidAustralianPhoneNumber("0212345678"), true); // NSW/ACT
  assert.equal(isValidAustralianPhoneNumber("0312345678"), true); // VIC/TAS
  assert.equal(isValidAustralianPhoneNumber("0712345678"), true); // QLD
  assert.equal(isValidAustralianPhoneNumber("0812345678"), true); // WA/SA/NT
  assert.equal(isValidAustralianPhoneNumber("(02) 1234 5678"), true);
});

test("accepts international landline numbers", () => {
  assert.equal(isValidAustralianPhoneNumber("+61212345678"), true);
  assert.equal(isValidAustralianPhoneNumber("+61 2 1234 5678"), true);
});

test("accepts special service numbers", () => {
  assert.equal(isValidAustralianPhoneNumber("131114"), true);
  assert.equal(isValidAustralianPhoneNumber("13 11 14"), true);
  assert.equal(isValidAustralianPhoneNumber("1300123456"), true);
  assert.equal(isValidAustralianPhoneNumber("1300 123 456"), true);
  assert.equal(isValidAustralianPhoneNumber("1800123456"), true);
  assert.equal(isValidAustralianPhoneNumber("1900123456"), true);
});

test("rejects invalid numbers", () => {
  assert.equal(isValidAustralianPhoneNumber(""), false);
  assert.equal(isValidAustralianPhoneNumber("123"), false);
  assert.equal(isValidAustralianPhoneNumber("04123456789"), false); // too long
  assert.equal(isValidAustralianPhoneNumber("041234567"), false); // too short
  assert.equal(isValidAustralianPhoneNumber("0612345678"), false); // unassigned prefix
  assert.equal(isValidAustralianPhoneNumber("+1 412 345 678"), false); // wrong country code
  assert.equal(isValidAustralianPhoneNumber("phone number"), false);
  assert.equal(isValidAustralianPhoneNumber(null), false);
  assert.equal(isValidAustralianPhoneNumber(undefined), false);
  assert.equal(isValidAustralianPhoneNumber(412345678), false);
});
