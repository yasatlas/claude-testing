"""
Email Validator Utility
-----------------------
Validates email addresses using structural rules and optional DNS MX record checks.
"""

import re
import socket
from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

MAX_EMAIL_LENGTH = 254          # RFC 5321
MAX_LOCAL_LENGTH = 64           # RFC 5321
MAX_DOMAIN_LENGTH = 253         # RFC 1035
MAX_LABEL_LENGTH = 63           # RFC 1035

# Quoted-string local parts are supported but rare; disable if you want stricter checks
ALLOW_QUOTED_LOCAL = True

_UNQUOTED_LOCAL_RE = re.compile(
    r"^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]"
    r"(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]|\.(?![.@]))*$"
)

_QUOTED_LOCAL_RE = re.compile(r'^"[^"\\]*(?:\\.[^"\\]*)*"$')

_LABEL_RE = re.compile(r"^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$")

DISPOSABLE_DOMAINS: set[str] = {
    "mailinator.com",
    "guerrillamail.com",
    "trashmail.com",
    "tempmail.com",
    "10minutemail.com",
    "yopmail.com",
    "throwam.com",
    "sharklasers.com",
    "dispostable.com",
}


# ---------------------------------------------------------------------------
# Result type
# ---------------------------------------------------------------------------

@dataclass
class ValidationResult:
    email: str
    is_valid: bool
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    normalized: str = ""

    def __bool__(self) -> bool:
        return self.is_valid


# ---------------------------------------------------------------------------
# Core validator
# ---------------------------------------------------------------------------

class EmailValidator:
    """
    Validates email addresses at multiple levels:

    * Structural / RFC-compliance checks (always performed)
    * Disposable-domain detection (optional)
    * DNS MX record lookup     (optional, requires network access)
    """

    def __init__(
        self,
        check_disposable: bool = True,
        check_dns: bool = False,
        dns_timeout: float = 5.0,
    ) -> None:
        self.check_disposable = check_disposable
        self.check_dns = check_dns
        self.dns_timeout = dns_timeout

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def validate(self, email: str) -> ValidationResult:
        """Return a :class:`ValidationResult` for *email*."""
        result = ValidationResult(email=email, is_valid=True)

        if not isinstance(email, str):
            result.is_valid = False
            result.errors.append("Email must be a string.")
            return result

        stripped = email.strip()

        # Length guard
        if len(stripped) > MAX_EMAIL_LENGTH:
            result.is_valid = False
            result.errors.append(
                f"Email exceeds maximum length of {MAX_EMAIL_LENGTH} characters."
            )
            return result

        if not stripped:
            result.is_valid = False
            result.errors.append("Email must not be empty.")
            return result

        # Split on the last '@' — quoted local parts may contain '@' internally
        at_count = stripped.count("@")
        if at_count == 0:
            result.is_valid = False
            result.errors.append("Email must contain an '@' symbol.")
            return result

        local, domain = stripped.rsplit("@", 1)

        # Multiple '@' is only valid when they are enclosed in a quoted local part
        if at_count > 1 and not (local.startswith('"') and local.endswith('"')):
            result.is_valid = False
            result.errors.append("Email must contain exactly one '@' symbol.")
            return result

        self._validate_local(local, result)
        self._validate_domain(domain, result)

        if result.is_valid:
            result.normalized = f"{local.lower()}@{domain.lower()}"

            if self.check_disposable:
                self._check_disposable(domain.lower(), result)

            if self.check_dns:
                self._check_mx(domain.lower(), result)

        return result

    def is_valid(self, email: str) -> bool:
        """Convenience method — returns *True* if the email is valid."""
        return self.validate(email).is_valid

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _validate_local(self, local: str, result: ValidationResult) -> None:
        if not local:
            result.is_valid = False
            result.errors.append("Local part (before '@') must not be empty.")
            return

        if len(local) > MAX_LOCAL_LENGTH:
            result.is_valid = False
            result.errors.append(
                f"Local part exceeds maximum length of {MAX_LOCAL_LENGTH} characters."
            )
            return

        if local.startswith(".") or local.endswith("."):
            result.is_valid = False
            result.errors.append("Local part must not start or end with a dot.")
            return

        if ".." in local:
            result.is_valid = False
            result.errors.append("Local part must not contain consecutive dots.")
            return

        # Quoted local parts  e.g.  "john doe"@example.com
        if local.startswith('"'):
            if not ALLOW_QUOTED_LOCAL:
                result.is_valid = False
                result.errors.append("Quoted local parts are not allowed.")
            elif not _QUOTED_LOCAL_RE.match(local):
                result.is_valid = False
                result.errors.append("Quoted local part is malformed.")
            return

        if not _UNQUOTED_LOCAL_RE.match(local):
            result.is_valid = False
            result.errors.append(
                f"Local part '{local}' contains invalid characters."
            )

    def _validate_domain(self, domain: str, result: ValidationResult) -> None:
        if not domain:
            result.is_valid = False
            result.errors.append("Domain (after '@') must not be empty.")
            return

        if len(domain) > MAX_DOMAIN_LENGTH:
            result.is_valid = False
            result.errors.append(
                f"Domain exceeds maximum length of {MAX_DOMAIN_LENGTH} characters."
            )
            return

        if domain.startswith(".") or domain.endswith("."):
            result.is_valid = False
            result.errors.append("Domain must not start or end with a dot.")
            return

        labels = domain.split(".")

        if len(labels) < 2:
            result.is_valid = False
            result.errors.append("Domain must have at least one dot.")
            return

        for label in labels:
            if not label:
                result.is_valid = False
                result.errors.append("Domain contains an empty label (consecutive dots).")
                return

            if len(label) > MAX_LABEL_LENGTH:
                result.is_valid = False
                result.errors.append(
                    f"Domain label '{label}' exceeds {MAX_LABEL_LENGTH} characters."
                )
                return

            if not _LABEL_RE.match(label):
                result.is_valid = False
                result.errors.append(
                    f"Domain label '{label}' contains invalid characters or hyphens at the boundary."
                )
                return

        tld = labels[-1]
        if not tld.isalpha():
            result.is_valid = False
            result.errors.append(
                f"Top-level domain '{tld}' must contain only letters."
            )

    def _check_disposable(self, domain: str, result: ValidationResult) -> None:
        if domain in DISPOSABLE_DOMAINS:
            result.warnings.append(
                f"'{domain}' is a known disposable email provider."
            )

    def _check_mx(self, domain: str, result: ValidationResult) -> None:
        try:
            socket.setdefaulttimeout(self.dns_timeout)
            socket.getaddrinfo(domain, None)
        except socket.gaierror:
            result.is_valid = False
            result.errors.append(
                f"Domain '{domain}' could not be resolved. It may not exist."
            )
        except Exception as exc:  # noqa: BLE001
            result.warnings.append(f"DNS check skipped due to error: {exc}")
        finally:
            socket.setdefaulttimeout(None)


# ---------------------------------------------------------------------------
# Module-level convenience functions
# ---------------------------------------------------------------------------

_default_validator = EmailValidator()


def validate_email(email: str) -> ValidationResult:
    """Validate *email* using the default validator (no DNS check)."""
    return _default_validator.validate(email)


def is_valid_email(email: str) -> bool:
    """Return *True* if *email* passes structural validation."""
    return _default_validator.is_valid(email)


def validate_many(emails: list[str]) -> dict[str, ValidationResult]:
    """Validate a list of emails and return a mapping of email → result."""
    return {email: _default_validator.validate(email) for email in emails}


# ---------------------------------------------------------------------------
# CLI entry-point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import sys

    args = sys.argv[1:]
    if not args:
        print("Usage: python email_validator.py <email> [<email> ...]")
        sys.exit(1)

    validator = EmailValidator(check_disposable=True, check_dns=False)
    exit_code = 0

    for addr in args:
        res = validator.validate(addr)
        status = "✓ valid" if res.is_valid else "✗ invalid"
        print(f"{addr!r:50s}  {status}")
        for err in res.errors:
            print(f"    ERROR   : {err}")
        for warn in res.warnings:
            print(f"    WARNING : {warn}")
        if res.normalized:
            print(f"    normalized → {res.normalized}")
        if not res.is_valid:
            exit_code = 1

    sys.exit(exit_code)
