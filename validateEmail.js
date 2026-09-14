/**
 * Validates whether a given string is a well-formed email address.
 *
 * The check covers the common structural rules for email addresses:
 *  - a local part and a domain part separated by a single "@"
 *  - no leading/trailing/consecutive dots in the local part
 *  - a domain made up of one or more labels separated by dots, with a
 *    top-level label of at least two alphabetic characters
 *
 * This is a pragmatic, syntax-level check (not a full RFC 5322 parser)
 * and does not perform any DNS or mailbox verification.
 *
 * validateEmail("user@example.com") => true
 * validateEmail("invalid-email")    => false
 *
 * @param {string} email - The string to validate.
 * @returns {boolean} true if the string is a valid email address, false otherwise.
 */
function validateEmail(email) {
  if (typeof email !== "string") return false;

  const EMAIL_REGEX =
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  return EMAIL_REGEX.test(email);
}

module.exports = { validateEmail };
