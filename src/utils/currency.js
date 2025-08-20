// Centralized currency formatting utility (default: Tunisian Dinar, fr-TN)
// Default behavior keeps 2 fraction digits to preserve existing UI expectations.
// Customize via options if needed.

/**
 * Format a numeric value as currency.
 *
 * @param {number|string} value - The numeric value to format
 * @param {Object} [opts]
 * @param {string} [opts.locale='fr-TN'] - BCP 47 locale for formatting
 * @param {string} [opts.currency='TND'] - Currency code
 * @param {number} [opts.minimumFractionDigits=2]
 * @param {number} [opts.maximumFractionDigits=2]
 * @param {('symbol'|'narrowSymbol'|'code'|'name')} [opts.currencyDisplay='symbol']
 * @returns {string} A formatted currency string
 */
export function formatPrice(value, opts = {}) {
  if (value === null || value === undefined || value === '') return '';
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return '';

  const {
    locale = 'fr-TN',
    currency = 'TND',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    currencyDisplay = 'symbol',
  } = opts;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numberValue);
  } catch (err) {
    // Fallback: basic formatting with thousands separator and currency symbol/code
    try {
      const fixed = numberValue.toFixed(maximumFractionDigits);
      const [intPart, decPart] = fixed.split('.');
      const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      const decimalSep = locale && locale.startsWith('fr') ? ',' : '.';
      const joined = decPart ? `${withSpaces}${decimalSep}${decPart}` : withSpaces;
      const symbol = currency === 'EUR' ? '€' : currency; // For TND, use code (TND)
      const suffix = currencyDisplay === 'code' ? ` ${currency}` : ` ${symbol}`;
      return `${joined}${suffix}`;
    } catch (_) {
      return `${numberValue} ${currency}`;
    }
  }
}
