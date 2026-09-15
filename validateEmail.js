/**
 * Validates whether a given string is a well-formed email address.
 *
 * The check enforces:
 *  - exactly one "@" separating a local part and a domain part
 *  - a non-empty local part containing only letters, digits and the
 *    special characters . _ % + -
 *  - a domain part made up of one or more labels separated by "." where
 *    each label contains only letters, digits and hyphens (and doesn't
 *    start/end with a hyphen)
 *  - a top level domain of at least two letters
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email address is valid, false otherwise.
 */
function validateEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }

  const trimmed = email.trim();

  if (trimmed.length === 0 || trimmed.length > 254) {
    return false;
  }

  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  return EMAIL_REGEX.test(trimmed);
}

module.exports = validateEmail;
