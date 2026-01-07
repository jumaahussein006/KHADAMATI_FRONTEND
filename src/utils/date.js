// src/utils/date.js
// Centralized date formatting utility (Gregorian calendar)

/**
 * Format a date string or Date object to a readable Gregorian date.
 * Uses the locale based on i18n language (en-US or ar-LB).
 * @param {string|Date} dateInput
 * @param {string} locale - e.g., 'en-US' or 'ar-LB'
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export const formatDate = (dateInput, locale = 'en-US', options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date)) return '';
    return new Intl.DateTimeFormat(locale, options).format(date);
};
