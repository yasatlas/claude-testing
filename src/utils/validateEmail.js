/**
 * Validates an email address against RFC 5322-inspired rules.
 *
 * Checks performed:
 * - Non-empty string input
 * - Exactly one "@" symbol
 * - Non-empty local part (before "@")
 * - Non-empty domain with at least one dot
 * - No whitespace anywhere in the address
 * - Valid characters in local and domain parts
 * - Domain labels are non-empty and don't start/end with a hyphen
 * - Top-level domain is at least 2 characters long
 *
 * @param {string} email - The email address to validate.
 * @returns {{ valid: boolean, error?: string }} Result object.
 */
function validateEmail(email) {
  if (typeof email !== "string" || email.trim() === "") {
    return { valid: false, error: "Email must be a non-empty string." };
  }

  if (/\s/.test(email)) {
    return { valid: false, error: "Email must not contain whitespace." };
  }

  const atIndex = email.indexOf("@");
  if (atIndex === -1) {
    return { valid: false, error: 'Email must contain an "@" symbol.' };
  }
  if (email.indexOf("@", atIndex + 1) !== -1) {
    return { valid: false, error: 'Email must contain exactly one "@" symbol.' };
  }

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (local.length === 0) {
    return { valid: false, error: "Local part (before \"@\") must not be empty." };
  }

  // Validate local part: allow letters, digits, and: . _ % + -
  if (!/^[a-zA-Z0-9._%+\-]+$/.test(local)) {
    return { valid: false, error: "Local part contains invalid characters." };
  }

  if (local.startsWith(".") || local.endsWith(".")) {
    return { valid: false, error: "Local part must not start or end with a dot." };
  }

  if (/\.{2,}/.test(local)) {
    return { valid: false, error: "Local part must not contain consecutive dots." };
  }

  if (domain.length === 0) {
    return { valid: false, error: "Domain (after \"@\") must not be empty." };
  }

  const labels = domain.split(".");
  if (labels.length < 2) {
    return { valid: false, error: "Domain must contain at least one dot." };
  }

  for (const label of labels) {
    if (label.length === 0) {
      return { valid: false, error: "Domain must not contain consecutive dots or a trailing dot." };
    }
    if (!/^[a-zA-Z0-9\-]+$/.test(label)) {
      return { valid: false, error: `Domain label "${label}" contains invalid characters.` };
    }
    if (label.startsWith("-") || label.endsWith("-")) {
      return { valid: false, error: `Domain label "${label}" must not start or end with a hyphen.` };
    }
  }

  const tld = labels[labels.length - 1];
  if (tld.length < 2) {
    return { valid: false, error: "Top-level domain must be at least 2 characters long." };
  }

  return { valid: true };
}

module.exports = { validateEmail };
