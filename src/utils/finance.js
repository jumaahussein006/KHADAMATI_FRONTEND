// src/utils/finance.js
// Utility functions for handling currency conversion and formatting.

/**
 * Simple static conversion rate from LBP to USD.
 * In a real app this would be fetched from an API.
 */
export const LBP_TO_USD_RATE = 1500; // 1 USD = 1500 LBP (example rate)

/**
 * Convert an amount in LBP to USD.
 * @param {number} amountLbp Amount in Lebanese Pounds.
 * @returns {number} Amount in USD rounded to 2 decimals.
 */
export const convertLbpToUsd = (amountLbp) => {
    if (typeof amountLbp !== 'number') return 0;
    return Number((amountLbp / LBP_TO_USD_RATE).toFixed(2));
};

/**
 * Convert an amount in USD to LBP.
 * @param {number} amountUsd Amount in US Dollars.
 * @returns {number} Amount in LBP.
 */
export const convertUsdToLbp = (amountUsd) => {
    if (typeof amountUsd !== 'number') return 0;
    return Math.round(amountUsd * LBP_TO_USD_RATE);
};

/**
 * Format a number as a currency string based on the selected currency.
 * @param {number} amount The numeric amount.
 * @param {'USD'|'LBP'} currencyCode The currency code.
 * @param {string} locale Locale string, e.g., 'en-US' or 'ar-LB'.
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount, currencyCode = 'USD', locale = 'en-US') => {
    const options = {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currencyCode === 'USD' ? 2 : 0,
    };
    return new Intl.NumberFormat(locale, options).format(amount);
};
