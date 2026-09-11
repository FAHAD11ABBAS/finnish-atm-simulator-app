/**
 * Multi-Currency Exchange Engine with Real-Time Simulated Fluctuations
 * Base Currency: EUR (€)
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

export class CurrencyEngine {
  constructor() {
    // Standard European Central Bank / Nordic FX Benchmark Rates against 1 EUR
    this.rates = {
      EUR: 1.0000,
      USD: 1.0850,
      SEK: 11.4520, // Swedish Krona
      NOK: 11.6840, // Norwegian Krone
      GBP: 0.8540,  // British Pound
      CHF: 0.9620,  // Swiss Franc
      JPY: 168.45,  // Japanese Yen
      DKK: 7.4580   // Danish Krone
    };

    // 7-day historical rate sparkline points
    this.history = {
      USD: [1.082, 1.084, 1.081, 1.087, 1.083, 1.086, 1.085],
      SEK: [11.42, 11.48, 11.45, 11.40, 11.44, 11.47, 11.45],
      NOK: [11.65, 11.62, 11.69, 11.72, 11.66, 11.70, 11.68],
      GBP: [0.851, 0.853, 0.856, 0.852, 0.855, 0.853, 0.854],
      CHF: [0.958, 0.960, 0.963, 0.961, 0.959, 0.964, 0.962],
      JPY: [167.2, 167.8, 168.1, 168.9, 168.2, 168.6, 168.45]
    };
  }

  /**
   * Convert amount between two currencies
   */
  convert(amount, fromCur, toCur) {
    if (!this.rates[fromCur] || !this.rates[toCur]) {
      return amount;
    }
    // Convert to EUR base, then to target
    const inEur = amount / this.rates[fromCur];
    const converted = inEur * this.rates[toCur];
    return converted;
  }

  /**
   * Get direct exchange rate from -> to
   */
  getRate(fromCur, toCur) {
    if (!this.rates[fromCur] || !this.rates[toCur]) return 1.0;
    return this.rates[toCur] / this.rates[fromCur];
  }

  /**
   * Get sparkline points for currency
   */
  getSparklineData(currency) {
    return this.history[currency] || [1, 1.02, 0.98, 1.01, 1.03, 1.0];
  }

  /**
   * Generate SVG sparkline path string
   */
  generateSparklineSvg(currency, width = 280, height = 44) {
    const data = this.getSparklineData(currency);
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 10) + 5;
      const y = height - 6 - ((val - min) / range) * (height - 12);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return `
      <svg viewBox="0 0 ${width} ${height}" class="sparkline-svg" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sparkGrad-${currency}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#00d2ff" stop-opacity="0.0"/>
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="#00d2ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${points}" />
      </svg>
    `;
  }
}

export const fxEngine = new CurrencyEngine();
