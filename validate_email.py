"""Simple email address validation utility."""

import re

# Matches a typical email address: local-part@domain
# local-part: letters, digits, and ._%+- characters
# domain: labels separated by dots, ending in a TLD of at least 2 letters
_EMAIL_PATTERN = re.compile(
    r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
)


def is_valid_email(email: str) -> bool:
    """Return True if `email` looks like a valid email address, False otherwise."""
    if not isinstance(email, str):
        return False
    return bool(_EMAIL_PATTERN.match(email))
