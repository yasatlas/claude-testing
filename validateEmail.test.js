const validateEmail = require('./validateEmail');

describe('validateEmail', () => {
  test.each([
    'user@example.com',
    'first.last@example.co.uk',
    'user+tag@example.com',
    'user_name@example.io',
    'user-name@sub.example.com',
    "user'name@example.com",
    'a@b.co',
    '123@example.com',
  ])('returns true for valid email "%s"', (email) => {
    expect(validateEmail(email)).toBe(true);
  });

  test.each([
    '',
    '   ',
    'plainaddress',
    '@example.com',
    'user@',
    'user@@example.com',
    'user@example',
    'user@.com',
    'user@example..com',
    'user@-example.com',
    'user@example.c',
    'user name@example.com',
    null,
    undefined,
    42,
    {},
  ])('returns false for invalid email %p', (value) => {
    expect(validateEmail(value)).toBe(false);
  });

  test('returns true for an email with surrounding whitespace after trimming', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true);
  });

  test('returns false for an email longer than 254 characters', () => {
    const longLocalPart = 'a'.repeat(250);
    expect(validateEmail(`${longLocalPart}@example.com`)).toBe(false);
  });
});
