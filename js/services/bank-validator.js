/**
 * Finnish Banking Standard Validation & Checksum Engines
 * Implements real Finnish IBAN (mod-97) and Finnish 7-3-1 Viitenumero algorithms
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

export class BankValidator {
  /**
   * Validate Finnish IBAN
   * Format: FIkk bbbbbb cccccccd (18 characters total)
   */
  static validateFinnishIBAN(iban) {
    if (!iban) return false;
    const clean = iban.replace(/\s+/g, '').toUpperCase();
    if (!/^FI\d{16}$/.test(clean)) {
      return false;
    }

    // MOD-97 check
    // Move first 4 chars to end: FIkk -> xx...FIkk
    const rearranged = clean.slice(4) + clean.slice(0, 4);
    
    // Replace letters with numbers (F=15, I=18)
    let numericStr = '';
    for (let i = 0; i < rearranged.length; i++) {
      const code = rearranged.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        numericStr += (code - 55).toString();
      } else {
        numericStr += rearranged[i];
      }
    }

    // Large number mod 97 using chunking
    let remainder = 0;
    for (let i = 0; i < numericStr.length; i++) {
      remainder = (remainder * 10 + parseInt(numericStr[i], 10)) % 97;
    }

    return remainder === 1;
  }

  /**
   * Calculate exact Finnish IBAN from 14-digit BBAN
   */
  static calculateFinnishIBAN(bban14Digits) {
    const cleanBban = bban14Digits.replace(/\D/g, '').padStart(14, '0');
    const rearranged = cleanBban + "151800";
    let remainder = 0;
    for (let i = 0; i < rearranged.length; i++) {
      remainder = (remainder * 10 + parseInt(rearranged[i], 10)) % 97;
    }
    const check = 98 - remainder;
    const checkStr = check < 10 ? "0" + check : "" + check;
    return `FI${checkStr}${cleanBban}`;
  }

  /**
   * Validate Finnish Reference Number (Viitenumero)
   * Using 7-3-1 weight multiplier algorithm (Suomalainen viitenumeron tarkistus)
   */
  static validateFinnishReference(ref) {
    if (!ref) return false;
    let clean = ref.replace(/\s+/g, '').toUpperCase();

    // Check for International RF prefix (ISO 11649)
    if (clean.startsWith('RF')) {
      return this.validateRfReference(clean);
    }

    // Standard Finnish reference: 4-20 digits
    if (!/^\d{4,20}$/.test(clean)) {
      return false;
    }

    const baseDigits = clean.slice(0, -1);
    const checkDigit = parseInt(clean.slice(-1), 10);
    const calculatedCheck = this.calculateFinnishCheckDigit(baseDigits);

    return checkDigit === calculatedCheck;
  }

  /**
   * Calculate Finnish 7-3-1 Check Digit
   */
  static calculateFinnishCheckDigit(baseStr) {
    const weights = [7, 3, 1];
    let sum = 0;
    let weightIndex = 0;

    // Process from right to left
    for (let i = baseStr.length - 1; i >= 0; i--) {
      const digit = parseInt(baseStr[i], 10);
      sum += digit * weights[weightIndex % 3];
      weightIndex++;
    }

    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
  }

  /**
   * Generate valid Finnish reference number from any numeric base
   */
  static generateReference(baseNumber) {
    const cleanBase = baseNumber.toString().replace(/\D/g, '');
    if (!cleanBase) return '12345';
    const checkDigit = this.calculateFinnishCheckDigit(cleanBase);
    return `${cleanBase}${checkDigit}`;
  }

  /**
   * Validate International RF Creditor Reference
   */
  static validateRfReference(rfRef) {
    const clean = rfRef.replace(/\s+/g, '').toUpperCase();
    if (!/^RF\d{2}[A-Z0-9]{1,21}$/.test(clean)) return false;

    // Move RFxx to end
    const rearranged = clean.slice(4) + clean.slice(0, 4);
    let numericStr = '';
    for (let i = 0; i < rearranged.length; i++) {
      const code = rearranged.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        numericStr += (code - 55).toString();
      } else {
        numericStr += rearranged[i];
      }
    }

    let remainder = 0;
    for (let i = 0; i < numericStr.length; i++) {
      remainder = (remainder * 10 + parseInt(numericStr[i], 10)) % 97;
    }

    return remainder === 1;
  }

  /**
   * Identify Finnish Bank Name from IBAN Bank Identifier
   */
  static getBankNameFromIBAN(iban) {
    if (!iban) return 'Suomalainen Pankki';
    const clean = iban.replace(/\s+/g, '').toUpperCase();
    if (clean.length < 6) return 'Suomalainen Pankki';

    const bankCode = clean.slice(4, 7); // First 3 digits of BBAN
    const firstDigit = bankCode[0];

    switch (firstDigit) {
      case '1':
      case '2':
        return 'Nordea Bank';
      case '4':
        return 'Säästöpankki / Aktia / OmaSp';
      case '5':
        return 'OP Osuuspankki';
      case '8':
        return 'Danske Bank';
      case '3':
        if (bankCode.startsWith('39')) return 'S-Pankki';
        if (bankCode.startsWith('31')) return 'Handelsbanken';
        return 'S-Pankki';
      default:
        return 'Nordic Bank Finland';
    }
  }
}
