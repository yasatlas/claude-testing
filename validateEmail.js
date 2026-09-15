/**
 * Validates whether a given string is a well-formed email address.
 *
 * The check covers the common structural rules for email addresses:
 * - A single "@" separating a local part and a domain part.
 * - A non-empty local part containing only letters, digits and the
 *   special characters . _ % + -
 * - A domain part made up of one or more dot-separated labels, each
 *   containing only letters, digits and hyphens (not starting or
 *   ending with a hyphen).
 * - A top-level domain of at least two alphabetic characters.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email address is valid, false otherwise.
 */
function validateEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0 || trimmedEmail.length > 254) {
    return false;
  }

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  return emailRegex.test(trimmedEmail);
}

module.exports = validateEmail;
