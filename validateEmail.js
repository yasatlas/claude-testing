/**
 * Validates whether a given string is a well-formed email address.
 *
 * The check covers the common structural rules for email addresses:
 * - A single "@" separating the local part and the domain.
 * - A non-empty local part containing only letters, digits, and the
 *   special characters ., _, %, +, -.
 * - A domain made up of one or more labels separated by dots, where each
 *   label contains only letters, digits, and hyphens (not starting or
 *   ending with a hyphen), and the final label (TLD) is at least two
 *   letters long.
 *
 * validateEmail("user@example.com") => true
 * validateEmail("invalid-email") => false
 *
 * @param {string} email - The string to validate.
 * @returns {boolean} true if the string is a valid email address, false otherwise.
 */
function validateEmail(email) {
  if (typeof email !== "string") return false;

  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

  return EMAIL_REGEX.test(email);
}

module.exports = { validateEmail };
