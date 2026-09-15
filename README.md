# Email Validator

A small utility function to validate email addresses.

## Usage

```js
const validateEmail = require('./validateEmail');

validateEmail('user@example.com'); // true
validateEmail('not-an-email');     // false
```

## Validation rules

An email address is considered valid when it:

- Contains exactly one `@` separating a local part and a domain part.
- Has a non-empty local part containing only letters, digits, and the
  special characters `. ! # $ % & ' * + / = ? ^ _ \` { | } ~ -`.
- Has a domain made up of one or more dot-separated labels, where each
  label contains only letters, digits, and hyphens (and doesn't start or
  end with a hyphen).
- Ends with a top-level domain of at least two letters.
- Is no longer than 254 characters (after trimming surrounding
  whitespace).

## Running tests

```bash
npm install
npm test
```
