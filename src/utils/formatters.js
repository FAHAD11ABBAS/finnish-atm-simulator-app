// Currency and Financial Formatters for Suomi 2030 ATM
export function formatEUR(amount) {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(date = new Date(), lang = 'en') {
  const d = new Date(date);
  const locale = lang === 'fi' ? 'fi-FI' : 'en-GB';
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Simulated dynamic 2030 live FX conversion rates against EUR
export const CURRENCY_RATES = {
  EUR: { rate: 1.0, symbol: '€', name: 'Euro (Suomi)' },
  USD: { rate: 1.085, symbol: '$', name: 'US Dollar' },
  GBP: { rate: 0.852, symbol: '£', name: 'British Pound' },
  JPY: { rate: 164.20, symbol: '¥', name: 'Japanese Yen' },
  SEK: { rate: 11.35, symbol: 'kr', name: 'Swedish Krona' },
  NOK: { rate: 11.60, symbol: 'kr', name: 'Norwegian Krone' },
  CHF: { rate: 0.955, symbol: 'CHF', name: 'Swiss Franc' },
  BTC: { rate: 0.000012, symbol: '₿', name: 'Bitcoin (e-EUR Staked)' },
  ETH: { rate: 0.00038, symbol: 'Ξ', name: 'Ethereum Euro' },
};

export function convertCurrency(amountInEUR, targetCurrency) {
  const rateObj = CURRENCY_RATES[targetCurrency] || CURRENCY_RATES.USD;
  const converted = amountInEUR * rateObj.rate;
  if (targetCurrency === 'BTC') return `${rateObj.symbol} ${converted.toFixed(6)}`;
  if (targetCurrency === 'ETH') return `${rateObj.symbol} ${converted.toFixed(4)}`;
  return `${rateObj.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// AI Loan Calculation Engine
export function calculateLoanDetails(principal, months, annualRatePercent) {
  const monthlyRate = annualRatePercent / 100 / 12;
  let monthlyPayment = 0;
  
  if (monthlyRate === 0) {
    monthlyPayment = principal / months;
  } else {
    monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;

  // AI Risk Assessment Rating
  let riskScore = 'A+ (Optimal Suomi Rating)';
  let riskColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  let riskDescription = 'Excellent repayment feasibility. Instant Neural Pre-Approval Granted.';

  const debtRatio = (monthlyPayment / 3500) * 100; // Assuming median 2030 Finnish net income €3500
  if (debtRatio > 45) {
    riskScore = 'C- (High Debt Ratio)';
    riskColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    riskDescription = 'Monthly commitment exceeds 45% of median salary. Collateral required.';
  } else if (debtRatio > 25) {
    riskScore = 'B (Moderate Risk)';
    riskColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    riskDescription = 'Requires automated income verification via Suomi Tulorekisteri.';
  }

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
    riskScore,
    riskColor,
    riskDescription,
  };
}
