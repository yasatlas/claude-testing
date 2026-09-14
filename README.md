# claude-testing

## Email validation

`email_validator.py` provides `validate_email(email: str) -> bool`, which checks
whether a string is a syntactically valid email address (RFC 5322-style
local part, dot-separated domain labels, a top-level domain of at least
two letters, and RFC 5321 length limits).

### Usage

```python
from email_validator import validate_email

validate_email("user@example.com")  # True
validate_email("not-an-email")      # False
```

### Running tests

```bash
pip install -e ".[dev]"
pytest
```
