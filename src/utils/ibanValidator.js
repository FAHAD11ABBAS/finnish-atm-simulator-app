// Authentic Finnish IBAN (ISO 13616 Mod 97) Validator & Generator
export function validateFinnishIBAN(iban) {
  if (!iban) return { isValid: false, message: 'IBAN is required' };
  
  // Clean whitespace
  const clean = iban.replace(/\s+/g, '').toUpperCase();
  
  if (!clean.startsWith('FI')) {
    return { isValid: false, message: 'Finnish IBAN must start with "FI"' };
  }
  
  if (clean.length !== 18) {
    return { isValid: false, message: 'Finnish IBAN must be exactly 18 characters' };
  }
  
  if (!/^FI\d{16}$/.test(clean)) {
    return { isValid: false, message: 'IBAN contains invalid characters' };
  }
  
  // Modulo 97 check
  // Move first 4 characters to end: FIxx -> xx1518 (F=15, I=18)
  const rearranged = clean.slice(4) + '1518' + clean.slice(2, 4);
  
  // Calculate mod 97 on large numeric string
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    remainder = (remainder * 10 + parseInt(rearranged[i], 10)) % 97;
  }
  
  if (remainder !== 1) {
    return { isValid: false, message: 'Invalid IBAN checksum' };
  }

  // Detect Finnish Bank Name by prefix code
  const bankPrefix = clean.slice(4, 7);
  let bankName = 'Finnish Commercial Bank';
  if (bankPrefix.startsWith('1') || bankPrefix.startsWith('2')) bankName = 'Nordea Bank Suomi';
  else if (bankPrefix.startsWith('5')) bankName = 'OP Financial Group';
  else if (bankPrefix.startsWith('8')) bankName = 'Danske Bank Finland';
  else if (bankPrefix.startsWith('39')) bankName = 'S-Pankki';
  else if (bankPrefix.startsWith('4')) bankName = 'Aktia Bank / Savings Bank';

  return { isValid: true, bankName, formatted: formatIBAN(clean) };
}

export function formatIBAN(iban) {
  if (!iban) return '';
  const clean = iban.replace(/\s+/g, '').toUpperCase();
  return clean.replace(/(.{4})/g, '$1 ').trim();
}

// Generate random valid Finnish IBAN for testing
export function generateRandomFinnishIBAN(bankCode = '500') {
  const bankPart = bankCode + Math.floor(100000000 + Math.random() * 900000000).toString().slice(0, 11);
  // Temporary string without check digits
  const tempStr = bankPart + '151800';
  let remainder = 0;
  for (let i = 0; i < tempStr.length; i++) {
    remainder = (remainder * 10 + parseInt(tempStr[i], 10)) % 97;
  }
  const checkDigits = String(98 - remainder).padStart(2, '0');
  return formatIBAN(`FI${checkDigits}${bankPart}`);
}
