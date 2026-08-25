"""
email_validator.py — A Python utility for validating email addresses.

Validation checks performed:
  1. Basic structure: exactly one '@' symbol
  2. Local part: allowed characters, no leading/trailing dots, no consecutive dots
  3. Domain part: valid labels separated by dots, no leading/trailing hyphens
  4. TLD: at least two characters, letters only
  5. Length limits: local ≤ 64 chars, domain ≤ 253 chars, total ≤ 320 chars
"""

import re
from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# Result type
# ---------------------------------------------------------------------------

@dataclass
class ValidationResult:
    is_valid: bool
    email: str
    errors: list[str] = field(default_factory=list)

    def __bool__(self) -> bool:
        return self.is_valid


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

MAX_EMAIL_LENGTH = 320
MAX_LOCAL_LENGTH = 64
MAX_DOMAIN_LENGTH = 253
MAX_LABEL_LENGTH = 63

# Allowed characters in the local part (unquoted)
_LOCAL_CHARS_RE = re.compile(r"^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$")

# A single DNS label: starts and ends with alphanumeric, hyphens allowed in the middle
_LABEL_RE = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$")

# TLD must be all letters
_TLD_RE = re.compile(r"^[a-zA-Z]{2,}$")


# ---------------------------------------------------------------------------
# Core validator
# ---------------------------------------------------------------------------

def validate_email(email: str) -> ValidationResult:
    """
    Validate *email* and return a :class:`ValidationResult`.

    Examples::

        >>> validate_email("user@example.com").is_valid
        True
        >>> validate_email("bad@").is_valid
        False
    """
    errors: list[str] = []

    if not isinstance(email, str):
        return ValidationResult(is_valid=False, email=str(email),
                                errors=["Email must be a string."])

    email = email.strip()

    # -- Overall length -------------------------------------------------
    if len(email) > MAX_EMAIL_LENGTH:
        errors.append(f"Email exceeds maximum length of {MAX_EMAIL_LENGTH} characters.")

    # -- Single '@' -----------------------------------------------------
    at_count = email.count("@")
    if at_count == 0:
        errors.append("Email must contain an '@' symbol.")
        return ValidationResult(is_valid=False, email=email, errors=errors)
    if at_count > 1:
        errors.append("Email must contain exactly one '@' symbol.")
        return ValidationResult(is_valid=False, email=email, errors=errors)

    local, domain = email.split("@", 1)

    # -- Local part -----------------------------------------------------
    errors.extend(_validate_local(local))

    # -- Domain part ----------------------------------------------------
    errors.extend(_validate_domain(domain))

    return ValidationResult(is_valid=len(errors) == 0, email=email, errors=errors)


def _validate_local(local: str) -> list[str]:
    errors: list[str] = []

    if not local:
        errors.append("Local part (before '@') must not be empty.")
        return errors

    if len(local) > MAX_LOCAL_LENGTH:
        errors.append(
            f"Local part exceeds maximum length of {MAX_LOCAL_LENGTH} characters."
        )

    if local.startswith("."):
        errors.append("Local part must not start with a dot.")
    if local.endswith("."):
        errors.append("Local part must not end with a dot.")
    if ".." in local:
        errors.append("Local part must not contain consecutive dots.")

    if not _LOCAL_CHARS_RE.match(local):
        errors.append(
            "Local part contains invalid characters. "
            "Allowed: letters, digits, and !#$%&'*+/=?^_`{|}~.-"
        )

    return errors


def _validate_domain(domain: str) -> list[str]:
    errors: list[str] = []

    if not domain:
        errors.append("Domain part (after '@') must not be empty.")
        return errors

    if len(domain) > MAX_DOMAIN_LENGTH:
        errors.append(
            f"Domain exceeds maximum length of {MAX_DOMAIN_LENGTH} characters."
        )

    if "." not in domain:
        errors.append("Domain must contain at least one dot.")
        return errors

    labels = domain.split(".")

    # Validate TLD (last label)
    tld = labels[-1]
    if not _TLD_RE.match(tld):
        errors.append(
            f"Top-level domain '{tld}' is invalid. "
            "It must contain only letters and be at least 2 characters long."
        )

    # Validate every label
    for label in labels:
        if not label:
            errors.append(
                "Domain contains an invalid empty label "
                "(leading dot, trailing dot, or consecutive dots)."
            )
            break
        if len(label) > MAX_LABEL_LENGTH:
            errors.append(
                f"Domain label '{label}' exceeds maximum length of {MAX_LABEL_LENGTH} characters."
            )
        if not _LABEL_RE.match(label):
            errors.append(
                f"Domain label '{label}' is invalid. "
                "Labels must start and end with a letter or digit and may contain hyphens."
            )

    return errors


# ---------------------------------------------------------------------------
# Convenience helpers
# ---------------------------------------------------------------------------

def is_valid_email(email: str) -> bool:
    """Return ``True`` if *email* passes all validation checks."""
    return validate_email(email).is_valid


def validate_emails(emails: list[str]) -> list[ValidationResult]:
    """Validate a list of email addresses and return a result for each."""
    return [validate_email(e) for e in emails]


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    args = sys.argv[1:]
    if not args:
        print("Usage: python email_validator.py <email> [email2 ...]")
        sys.exit(1)

    exit_code = 0
    for addr in args:
        result = validate_email(addr)
        status = "✓ VALID" if result.is_valid else "✗ INVALID"
        print(f"{status}  {addr}")
        for err in result.errors:
            print(f"         └─ {err}")
        if not result.is_valid:
            exit_code = 1

    sys.exit(exit_code)
