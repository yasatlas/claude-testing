const { test } = require("node:test");
const assert = require("node:assert/strict");
const { validateEmail } = require("./validateEmail");

test("accepts standard email addresses", () => {
  assert.equal(validateEmail("user@example.com"), true);
  assert.equal(validateEmail("first.last@example.co.uk"), true);
  assert.equal(validateEmail("user+tag@example.com"), true);
  assert.equal(validateEmail("user_name-123@example-domain.com"), true);
  assert.equal(validateEmail("USER@EXAMPLE.COM"), true);
});

test("rejects strings without an @ symbol", () => {
  assert.equal(validateEmail("invalid-email"), false);
});

test("rejects strings with a missing local part", () => {
  assert.equal(validateEmail("@example.com"), false);
});

test("rejects strings with a missing domain", () => {
  assert.equal(validateEmail("user@"), false);
});

test("rejects strings with multiple @ symbols", () => {
  assert.equal(validateEmail("user@@example.com"), false);
  assert.equal(validateEmail("user@example@com"), false);
});

test("rejects domains without a dot or TLD", () => {
  assert.equal(validateEmail("user@example"), false);
  assert.equal(validateEmail("user@example.c"), false);
});

test("rejects strings with spaces", () => {
  assert.equal(validateEmail("user name@example.com"), false);
  assert.equal(validateEmail("user@ example.com"), false);
});

test("rejects domain labels starting or ending with a hyphen", () => {
  assert.equal(validateEmail("user@-example.com"), false);
  assert.equal(validateEmail("user@example-.com"), false);
});

test("rejects empty strings and non-string input", () => {
  assert.equal(validateEmail(""), false);
  assert.equal(validateEmail(null), false);
  assert.equal(validateEmail(undefined), false);
  assert.equal(validateEmail(12345), false);
});
