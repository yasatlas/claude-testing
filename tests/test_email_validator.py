import pytest

from email_validator import validate_email


@pytest.mark.parametrize(
    "email",
    [
        "user@example.com",
        "USER@EXAMPLE.COM",
        "user.name@example.com",
        "user+tag@example.co.uk",
        "user_name@example-domain.com",
        "u@example.io",
        "user.name+tag123@sub.example.com",
        "user'name@example.com",
        "1234567890@example.com",
        "user@ex-ample.com",
    ],
)
def test_valid_emails(email):
    assert validate_email(email) is True


@pytest.mark.parametrize(
    "email",
    [
        "",
        "plainaddress",
        "@example.com",
        "user@",
        "user@@example.com",
        "user@example",
        "user@.com",
        "user@example..com",
        ".user@example.com",
        "user.@example.com",
        "user..name@example.com",
        "user@-example.com",
        "user@example-.com",
        "user@example.c",
        "user name@example.com",
        "user@exam ple.com",
        "user@example.com ",
        " user@example.com",
        "user@example.com\n",
        None,
        123,
    ],
)
def test_invalid_emails(email):
    assert validate_email(email) is False


def test_local_part_length_limit():
    long_local = "a" * 65
    assert validate_email(f"{long_local}@example.com") is False

    ok_local = "a" * 64
    assert validate_email(f"{ok_local}@example.com") is True


def test_overall_length_limit():
    long_domain_label = "a" * 250
    email = f"user@{long_domain_label}.com"
    assert len(email) > 254
    assert validate_email(email) is False
