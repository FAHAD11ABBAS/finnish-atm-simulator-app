/**
 * Finnish Mortgage & Loan Calculator (Asuntolainalaskuri)
 * Calculates annuity monthly payments, total interest, and Euribor stress-tests
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

export class LoanCalculator {
  /**
   * Calculate Annuity Loan (Tasalyhennys / Annuiteettilaina)
   * @param {number} principal - Loan amount in EUR
   * @param {number} years - Term in years
   * @param {number} annualRatePercent - Total interest rate (Euribor + Margin %)
   * @param {number} stressShockPercent - Additional stress shock (e.g. +3%)
   */
  static calculate(principal, years, annualRatePercent, stressShockPercent = 0) {
    const loanAmount = Math.max(1000, Number(principal) || 0);
    const totalYears = Math.max(1, Math.min(35, Number(years) || 25));
    const totalMonths = totalYears * 12;

    const baseRate = Math.max(0.1, Number(annualRatePercent) || 3.5);
    const stressedRate = baseRate + (Number(stressShockPercent) || 0);

    // Monthly payment calculation for base rate
    const baseMonthlyPayment = this.getMonthlyAnnuity(loanAmount, totalMonths, baseRate);
    const totalBasePayment = baseMonthlyPayment * totalMonths;
    const totalBaseInterest = totalBasePayment - loanAmount;

    // Monthly payment calculation for stressed rate
    const stressedMonthlyPayment = this.getMonthlyAnnuity(loanAmount, totalMonths, stressedRate);
    const stressedTotalPayment = stressedMonthlyPayment * totalMonths;
    const stressedTotalInterest = stressedTotalPayment - loanAmount;

    return {
      principal: loanAmount,
      years: totalYears,
      totalMonths,
      baseRate,
      stressedRate,
      baseMonthlyPayment: Math.round(baseMonthlyPayment * 100) / 100,
      totalBaseInterest: Math.round(totalBaseInterest * 100) / 100,
      totalBasePayment: Math.round(totalBasePayment * 100) / 100,
      stressedMonthlyPayment: Math.round(stressedMonthlyPayment * 100) / 100,
      stressedTotalInterest: Math.round(stressedTotalInterest * 100) / 100,
      stressedTotalPayment: Math.round(stressedTotalPayment * 100) / 100,
      monthlyDifference: Math.round((stressedMonthlyPayment - baseMonthlyPayment) * 100) / 100
    };
  }

  /**
   * Standard Annuity formula: P * (r(1+r)^n) / ((1+r)^n - 1)
   */
  static getMonthlyAnnuity(principal, totalMonths, annualRatePercent) {
    const monthlyRate = (annualRatePercent / 100) / 12;
    if (monthlyRate === 0) return principal / totalMonths;

    const factor = Math.pow(1 + monthlyRate, totalMonths);
    const monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
    return monthlyPayment;
  }
}
