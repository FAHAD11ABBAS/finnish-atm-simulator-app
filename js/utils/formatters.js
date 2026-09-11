/**
 * Finnish Banking & Financial Formatters
 * Formats according to Finnish standards (EUR space grouping, comma decimals, Finnish dates)
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

export class Formatters {
  /**
   * Format EUR currency in Finnish style: 1 250,50 €
   */
  static formatEUR(amount) {
    const num = Number(amount) || 0;
    const parts = num.toFixed(2).split('.');
    // Add space as thousands separator
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${parts.join(',')} €`;
  }

  /**
   * Format IBAN into standard 4-character blocks: FI21 1234 5600 0007 89
   */
  static formatIBAN(iban) {
    if (!iban) return '';
    const clean = iban.replace(/\s+/g, '').toUpperCase();
    return clean.replace(/(.{4})/g, '$1 ').trim();
  }

  /**
   * Format Finnish Date (dd.mm.yyyy)
   */
  static formatDate(dateStr) {
    const d = dateStr ? new Date(dateStr) : new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${mins}`;
  }

  /**
   * Mask Card Number: **** **** **** 4892
   */
  static maskCardNumber(cardNum) {
    if (!cardNum) return '**** **** **** 0000';
    const clean = cardNum.replace(/\s+/g, '');
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }

  /**
   * Mask Finnish IBAN for security: FI21 •••• •••• ••07 89
   */
  static maskIBAN(iban) {
    if (!iban) return '';
    const formatted = this.formatIBAN(iban);
    const parts = formatted.split(' ');
    if (parts.length >= 4) {
      return `${parts[0]} •••• •••• ${parts[parts.length - 1]}`;
    }
    return formatted;
  }
}
