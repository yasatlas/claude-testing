"""
Tests for email_validator.py
"""

import pytest
from email_validator import (
    EmailValidator,
    ValidationResult,
    is_valid_email,
    validate_email,
    validate_many,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def errors(email: str) -> list[str]:
    return validate_email(email).errors


# ---------------------------------------------------------------------------
# Valid addresses
# ---------------------------------------------------------------------------

VALID_EMAILS = [
    "user@example.com",
    "user.name@example.com",
    "user+tag@example.co.uk",
    "user123@sub.domain.org",
    "USER@EXAMPLE.COM",
    "a@b.io",
    "user_name@example-domain.com",
    "first.last@subdomain.example.com",
    "user!#$%&'*+/=?^_`{|}~@example.com",
    '"john doe"@example.com',       # quoted local part
    '"very.unusual.@.unusual.com"@example.com',
]

@pytest.mark.parametrize("email", VALID_EMAILS)
def test_valid_emails(email):
    assert is_valid_email(email), f"Expected valid: {email!r}, errors: {errors(email)}"


# ---------------------------------------------------------------------------
# Invalid — structural problems
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("email, expected_fragment", [
    ("",                          "empty"),
    ("notanemail",                "'@'"),
    ("two@@example.com",          "exactly one '@'"),
    ("@example.com",              "Local part"),
    ("user@",                     "Domain"),
    (".user@example.com",         "start or end with a dot"),
    ("user.@example.com",         "start or end with a dot"),
    ("us..er@example.com",        "consecutive dots"),
    ("user@.example.com",         "start or end with a dot"),
    ("user@example..com",         "consecutive dots"),
    ("user@example.com.",         "start or end with a dot"),
    ("user@ example.com",         "invalid characters"),
    ("user @example.com",         "invalid characters"),
    ("user@example",              "at least one dot"),
    ("user@exam_ple.com",         "invalid characters"),
    ("user@-example.com",         "hyphens at the boundary"),
    ("user@example-.com",         "hyphens at the boundary"),
    ("user@example.123",          "only letters"),
    ("a" * 65 + "@example.com",   "Local part exceeds"),
    ("user@" + "a" * 64 + ".com", "label"),
])
def test_invalid_emails(email, expected_fragment):
    result = validate_email(email)
    assert not result.is_valid, f"Expected invalid: {email!r}"
    combined = " ".join(result.errors)
    assert expected_fragment.lower() in combined.lower(), (
        f"Expected fragment {expected_fragment!r} in errors for {email!r}.\n"
        f"Got: {result.errors}"
    )


# ---------------------------------------------------------------------------
# Length limits
# ---------------------------------------------------------------------------

def test_email_max_length():
    long_local = "a" * 64
    domain = "b" * 186 + ".com"   # total > 254
    email = f"{long_local}@{domain}"
    assert len(email) > 254
    result = validate_email(email)
    assert not result.is_valid
    assert any("maximum length" in e for e in result.errors)


def test_local_max_length_exactly_64_is_valid():
    email = "a" * 64 + "@example.com"
    assert is_valid_email(email)


def test_local_65_chars_is_invalid():
    email = "a" * 65 + "@example.com"
    assert not is_valid_email(email)


# ---------------------------------------------------------------------------
# Normalization
# ---------------------------------------------------------------------------

def test_normalization():
    result = validate_email("User.Name@Example.COM")
    assert result.is_valid
    assert result.normalized == "user.name@example.com"


def test_no_normalization_when_invalid():
    result = validate_email("bad-email")
    assert result.normalized == ""


# ---------------------------------------------------------------------------
# Disposable domain detection
# ---------------------------------------------------------------------------

def test_disposable_domain_warning():
    validator = EmailValidator(check_disposable=True)
    result = validator.validate("user@mailinator.com")
    assert result.is_valid          # still valid structurally
    assert any("disposable" in w for w in result.warnings)


def test_non_disposable_no_warning():
    validator = EmailValidator(check_disposable=True)
    result = validator.validate("user@gmail.com")
    assert not any("disposable" in w for w in result.warnings)


def test_disposable_check_disabled():
    validator = EmailValidator(check_disposable=False)
    result = validator.validate("user@mailinator.com")
    assert not result.warnings


# ---------------------------------------------------------------------------
# Quoted local parts
# ---------------------------------------------------------------------------

def test_valid_quoted_local():
    assert is_valid_email('"john doe"@example.com')


def test_malformed_quoted_local():
    result = validate_email('"unmatched@example.com')
    assert not result.is_valid


def test_quoted_local_disallowed_when_configured():
    import email_validator as ev
    original = ev.ALLOW_QUOTED_LOCAL
    ev.ALLOW_QUOTED_LOCAL = False
    try:
        validator = EmailValidator()
        result = validator.validate('"john doe"@example.com')
        assert not result.is_valid
    finally:
        ev.ALLOW_QUOTED_LOCAL = original


# ---------------------------------------------------------------------------
# Convenience functions
# ---------------------------------------------------------------------------

def test_validate_many():
    emails = ["user@example.com", "bad-email", "other@test.org"]
    results = validate_many(emails)
    assert isinstance(results, dict)
    assert len(results) == 3
    assert results["user@example.com"].is_valid
    assert not results["bad-email"].is_valid
    assert results["other@test.org"].is_valid


def test_is_valid_email_shortcut():
    assert is_valid_email("hello@world.io")
    assert not is_valid_email("hello@")


def test_validation_result_bool():
    good = validate_email("a@b.com")
    bad = validate_email("nope")
    assert bool(good) is True
    assert bool(bad) is False


# ---------------------------------------------------------------------------
# Non-string input
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("value", [None, 42, [], {}])
def test_non_string_input(value):
    result = validate_email(value)
    assert not result.is_valid
    assert any("string" in e.lower() for e in result.errors)
