import unittest

from validate_email import is_valid_email


class TestIsValidEmail(unittest.TestCase):
    def test_valid_emails(self):
        valid_emails = [
            "user@example.com",
            "first.last@example.co.uk",
            "user+tag@example.com",
            "user_name@example-domain.com",
            "user123@sub.example.com",
        ]
        for email in valid_emails:
            with self.subTest(email=email):
                self.assertTrue(is_valid_email(email))

    def test_invalid_emails(self):
        invalid_emails = [
            "",
            "plainaddress",
            "@example.com",
            "user@",
            "user@example",
            "user@.com",
            "user example.com",
            "user@exa mple.com",
            "user@@example.com",
            None,
            123,
        ]
        for email in invalid_emails:
            with self.subTest(email=email):
                self.assertFalse(is_valid_email(email))


if __name__ == "__main__":
    unittest.main()
