"""
Tests for email_validator.py
"""

import pytest
from email_validator import validate_email, is_valid_email, validate_emails


# ---------------------------------------------------------------------------
# Valid addresses
# ---------------------------------------------------------------------------

VALID_EMAILS = [
    "user@example.com",
    "User.Name+tag@sub.domain.org",
    "user123@domain.co.uk",
    "a@b.io",
    "first.last@company.museum",
    "user_name@example-domain.com",
    "1234567890@numbers.com",
    "user!#$%&'*+/=?^_`{|}~@example.com",
    "very.long.local.part.1234@very-long-domain-name.example.com",
]

@pytest.mark.parametrize("email", VALID_EMAILS)
def test_valid_emails(email):
    result = validate_email(email)
    assert result.is_valid, f"Expected '{email}' to be valid, got errors: {result.errors}"
    assert result.errors == []


# ---------------------------------------------------------------------------
# Invalid addresses
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("email, expected_fragment", [
    ("plainaddress",         "must contain an '@'"),
    ("@@double.com",         "exactly one '@'"),
    ("a@b@c.com",            "exactly one '@'"),
    ("@nodomain.com",        "Local part"),
    ("noatsign.com",         "must contain an '@'"),
    ("user@",               "Domain part"),
    ("user@.com",            "empty label"),
    ("user@domain..com",     "consecutive dots"),
    (".user@domain.com",     "must not start with a dot"),
    ("user.@domain.com",     "must not end with a dot"),
    ("user..name@domain.com","consecutive dots"),
    ("user@domain.c",        "invalid"),          # TLD too short
    ("user@-domain.com",     "invalid"),
    ("user@domain-.com",     "invalid"),
    ("user@domain",          "at least one dot"),
    ("user@[192.168.1.1]",   "invalid"),           # IP literals not supported
    ("",                     "must contain an '@'"),
])
def test_invalid_emails(email, expected_fragment):
    result = validate_email(email)
    assert not result.is_valid, f"Expected '{email}' to be invalid"
    assert any(expected_fragment.lower() in err.lower() for err in result.errors), (
        f"Expected fragment '{expected_fragment}' in errors: {result.errors}"
    )


# ---------------------------------------------------------------------------
# Length boundary tests
# ---------------------------------------------------------------------------

def test_local_part_too_long():
    local = "a" * 65
    result = validate_email(f"{local}@example.com")
    assert not result.is_valid
    assert any("64" in e for e in result.errors)


def test_local_part_max_length_valid():
    local = "a" * 64
    result = validate_email(f"{local}@example.com")
    assert result.is_valid


def test_email_total_too_long():
    local = "a" * 64
    # Build a domain that exceeds 253 characters
    domain = "b" * 63 + "." + "c" * 63 + "." + "d" * 63 + "." + "e" * 63 + ".com"
    assert len(domain) > 253
    result = validate_email(f"{local}@{domain}")
    assert not result.is_valid


# ---------------------------------------------------------------------------
# is_valid_email helper
# ---------------------------------------------------------------------------

def test_is_valid_email_true():
    assert is_valid_email("hello@world.com") is True


def test_is_valid_email_false():
    assert is_valid_email("bad-email") is False


# ---------------------------------------------------------------------------
# validate_emails (batch)
# ---------------------------------------------------------------------------

def test_validate_emails_batch():
    results = validate_emails(["good@example.com", "bad", "also@good.org"])
    assert results[0].is_valid is True
    assert results[1].is_valid is False
    assert results[2].is_valid is True


# ---------------------------------------------------------------------------
# Non-string input
# ---------------------------------------------------------------------------

def test_non_string_input():
    result = validate_email(12345)   # type: ignore[arg-type]
    assert not result.is_valid
    assert any("string" in e.lower() for e in result.errors)


# ---------------------------------------------------------------------------
# ValidationResult truthiness
# ---------------------------------------------------------------------------

def test_result_truthy():
    assert bool(validate_email("ok@example.com")) is True
    assert bool(validate_email("notvalid")) is False
