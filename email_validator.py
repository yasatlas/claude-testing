"""Email address validation utilities.

This module provides a single public function, :func:`validate_email`,
which checks whether a given string is a syntactically valid email
address according to a pragmatic subset of RFC 5322.
"""

import re

# Pragmatic RFC 5322-like pattern:
# - local part: letters, digits and the common special characters,
#   allowing dot-separated segments (no leading/trailing/double dots)
# - domain: dot-separated labels made of letters, digits and hyphens
#   (no leading/trailing hyphens per label), with a final label
#   (the TLD) of at least two alphabetic characters.
_LOCAL_PART = r"[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*"
_DOMAIN_LABEL = r"[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?"
_DOMAIN = rf"(?:{_DOMAIN_LABEL}\.)+[A-Za-z]{{2,}}"

_EMAIL_RE = re.compile(rf"\A{_LOCAL_PART}@{_DOMAIN}\Z")

_MAX_LENGTH = 254
_MAX_LOCAL_LENGTH = 64


def validate_email(email: str) -> bool:
    """Return ``True`` if ``email`` is a syntactically valid email address.

    The check covers the most common rules for email addresses:

    - exactly one ``@`` separating a local part and a domain
    - the local part may contain letters, digits and the special
      characters ``!#$%&'*+/=?^_`{|}~-``, with dot-separated segments
      (no leading, trailing or consecutive dots)
    - the domain consists of dot-separated labels of letters, digits
      and hyphens (no leading/trailing hyphens) and must end with a
      top-level domain of at least two letters
    - overall length must not exceed 254 characters, and the local
      part must not exceed 64 characters (per RFC 5321 limits)

    Args:
        email: The string to validate.

    Returns:
        ``True`` if ``email`` looks like a valid email address,
        ``False`` otherwise.
    """
    if not isinstance(email, str) or not email:
        return False

    if len(email) > _MAX_LENGTH:
        return False

    local_part = email.rsplit("@", 1)[0] if "@" in email else email
    if len(local_part) > _MAX_LOCAL_LENGTH:
        return False

    return _EMAIL_RE.match(email) is not None
