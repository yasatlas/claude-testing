private val EMAIL_REGEX = Regex(
    "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$"
)

fun isValidEmail(email: String): Boolean {
    if (email.isBlank()) return false
    if (email.length > 254) return false
    return EMAIL_REGEX.matches(email)
}
