/**
 * Scalable and future-proof email validation system.
 * Allows only trusted public providers and educational domains.
 */

export const ALLOWED_EMAIL_DOMAINS = [
    "gmail.com",
    "icloud.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "proton.me",
    "protonmail.com",
    "khadamati.com"
];

/**
 * Checks if a domain is an educational domain.
 * Supports .edu, .edu.lb, .ac.uk, and any .edu.* pattern.
 */
const isEducationalEmail = (domain) => {
    return (
        domain.endsWith(".edu") ||
        domain.includes(".edu.") ||
        domain.endsWith(".ac.uk")
    );
};

/**
 * Main validator function.
 * @param {string} email - The email to check.
 * @param {boolean} isAdmin - Whether the user is an admin (bypasses restriction).
 * @returns {boolean} - Whether the email is from a valid provider.
 */
export const isValidEmailProvider = (email, isAdmin = false) => {
    // Admin login must NOT be restricted.
    if (isAdmin) return true;

    if (!email || !email.includes("@")) return false;

    const parts = email.split("@");
    if (parts.length !== 2) return false;

    const domain = parts[1].toLowerCase();

    return (
        ALLOWED_EMAIL_DOMAINS.includes(domain) ||
        isEducationalEmail(domain)
    );
};
