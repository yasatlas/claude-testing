/**
 * Returns true if the given string is a valid email address, false otherwise.
 *
 * Validation rules:
 *  - Must have exactly one "@" separating a non-empty local part and domain.
 *  - Local part may contain letters, digits, and: . _ % + -
 *  - Domain must have at least one "." with non-empty labels on both sides.
 *  - Top-level domain must be at least 2 characters long.
 *
 * validateEmail("user@example.com")       => true
 * validateEmail("user.name+tag@sub.io")   => true
 * validateEmail("bad@")                   => false
 * validateEmail("nodomain")               => false
 * validateEmail("")                        => false
 */
function validateEmail(email) {
  if (typeof email !== "string" || email.length === 0) return false;

  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

module.exports = { validateEmail };
