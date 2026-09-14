const assert = require("assert");
const { validateEmail } = require("./validateEmail");

const validEmails = [
  "user@example.com",
  "user.name@example.com",
  "user+tag@example.co.uk",
  "user_name@example-domain.com",
  "u@e.io",
  "first.last@sub.example.com",
];

const invalidEmails = [
  "",
  "plainaddress",
  "@example.com",
  "user@",
  "user@@example.com",
  "user@example",
  "user@.com",
  "user@example..com",
  ".user@example.com",
  "user.@example.com",
  "user@ example.com",
  "user@example.c",
  null,
  undefined,
  42,
];

for (const email of validEmails) {
  assert.strictEqual(
    validateEmail(email),
    true,
    `expected "${email}" to be valid`
  );
}

for (const email of invalidEmails) {
  assert.strictEqual(
    validateEmail(email),
    false,
    `expected "${email}" to be invalid`
  );
}

console.log("All validateEmail tests passed.");
