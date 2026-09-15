/**
 * Validates Australian phone numbers.
 *
 * Accepts mobile numbers, landline (geographic) numbers, and common
 * special-service numbers (13xxxx, 1300, 1800, 1900), each either in
 * domestic (0...) or international (+61... / 61...) format. Whitespace,
 * hyphens, dots, and parentheses are ignored.
 *
 * Examples of valid input:
 *   "0412 345 678"      (mobile, domestic)
 *   "+61 412 345 678"   (mobile, international)
 *   "(02) 1234 5678"    (landline, domestic)
 *   "+61 2 1234 5678"   (landline, international)
 *   "13 11 14"          (13 number)
 *   "1300 123 456"      (1300 number)
 *   "1800 123 456"      (1800 number)
 *
 * isValidAustralianPhoneNumber("0412345678") => true
 * isValidAustralianPhoneNumber("123")        => false
 */
function isValidAustralianPhoneNumber(phone) {
  if (typeof phone !== "string") return false;

  const trimmed = phone.trim();
  if (trimmed === "") return false;

  const cleaned = trimmed.replace(/[\s\-().]/g, "");
  if (!/^\+?\d+$/.test(cleaned)) return false;

  const patterns = [
    /^(?:\+?61|0)4\d{8}$/, // mobile, e.g. 0412345678 / +61412345678
    /^(?:\+?61|0)[2378]\d{8}$/, // landline, e.g. 0212345678 / +61212345678
    /^13\d{4}$/, // 13xxxx numbers, e.g. 131114
    /^1(?:300|800|900)\d{6}$/, // 1300/1800/1900 numbers
  ];

  return patterns.some((pattern) => pattern.test(cleaned));
}

module.exports = { isValidAustralianPhoneNumber };
