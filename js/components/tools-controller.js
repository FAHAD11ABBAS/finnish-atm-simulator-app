/**
 * Financial Calculators & Smart Tools Controller
 * Handles Finnish Mortgage (Asuntolaina) math & Multi-Currency FX Engine UI
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

import { LoanCalculator } from '../services/loan-calculator.js';
import { fxEngine } from '../services/currency-engine.js';
import { Formatters } from '../utils/formatters.js';
import { $, $$ } from '../utils/dom.js';

export class ToolsController {
  constructor() {
    this.stressShock = 0;
  }

  init() {
    this.bindMortgageEvents();
    this.bindCurrencyEvents();
    this.calculateMortgage();
    this.calculateFx();
  }

  bindMortgageEvents() {
    const loanAmountInput = $('#loan-amount-input');
    const loanTermInput = $('#loan-term-input');
    const loanRateInput = $('#loan-rate-input');
    const stressSlider = $('#stress-test-slider');

    const updateCalc = () => this.calculateMortgage();

    if (loanAmountInput) loanAmountInput.addEventListener('input', updateCalc);
    if (loanTermInput) loanTermInput.addEventListener('input', updateCalc);
    if (loanRateInput) loanRateInput.addEventListener('input', updateCalc);

    if (stressSlider) {
      stressSlider.addEventListener('input', (e) => {
        this.stressShock = Number(e.target.value);
        const shockEl = $('#stress-shock-val');
        if (shockEl) shockEl.textContent = `+${this.stressShock.toFixed(1)} %`;
        this.calculateMortgage();
      });
    }
  }

  calculateMortgage() {
    const amount = Number($('#loan-amount-input')?.value) || 200000;
    const years = Number($('#loan-term-input')?.value) || 25;
    const rate = Number($('#loan-rate-input')?.value) || 3.85;

    const result = LoanCalculator.calculate(amount, years, rate, this.stressShock);

    // Update UI elements
    const monthlyPaymentEl = $('#calc-monthly-payment');
    const totalInterestEl = $('#calc-total-interest');
    const totalRepayEl = $('#calc-total-repayment');
    const stressedDiffBox = $('#stressed-diff-display');

    if (monthlyPaymentEl) monthlyPaymentEl.textContent = Formatters.formatEUR(result.baseMonthlyPayment);
    if (totalInterestEl) totalInterestEl.textContent = Formatters.formatEUR(result.totalBaseInterest);
    if (totalRepayEl) totalRepayEl.textContent = Formatters.formatEUR(result.totalBasePayment);

    if (stressedDiffBox) {
      if (this.stressShock > 0) {
        stressedDiffBox.style.display = 'block';
        $('#calc-stressed-payment').textContent = Formatters.formatEUR(result.stressedMonthlyPayment);
        $('#calc-monthly-diff').textContent = `+${Formatters.formatEUR(result.monthlyDifference)} / kk`;
      } else {
        stressedDiffBox.style.display = 'none';
      }
    }
  }

  bindCurrencyEvents() {
    const amountInput = $('#fx-amount-input');
    const fromSelect = $('#fx-from-select');
    const toSelect = $('#fx-to-select');
    const swapBtn = $('#btn-swap-fx');

    const updateFx = () => this.calculateFx();

    if (amountInput) amountInput.addEventListener('input', updateFx);
    if (fromSelect) fromSelect.addEventListener('change', updateFx);
    if (toSelect) toSelect.addEventListener('change', updateFx);

    if (swapBtn) {
      swapBtn.addEventListener('click', () => {
        const fromVal = fromSelect.value;
        const toVal = toSelect.value;
        fromSelect.value = toVal;
        toSelect.value = fromVal;
        this.calculateFx();
      });
    }
  }

  calculateFx() {
    const amount = Number($('#fx-amount-input')?.value) || 100;
    const from = $('#fx-from-select')?.value || 'EUR';
    const to = $('#fx-to-select')?.value || 'USD';

    const converted = fxEngine.convert(amount, from, to);
    const rate = fxEngine.getRate(from, to);

    const resultEl = $('#fx-converted-result');
    const rateEl = $('#fx-live-rate-badge');
    const sparklineEl = $('#fx-sparkline-container');

    if (resultEl) resultEl.textContent = `${converted.toFixed(2)} ${to}`;
    if (rateEl) rateEl.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;

    if (sparklineEl) {
      sparklineEl.innerHTML = fxEngine.generateSparklineSvg(to === 'EUR' ? from : to);
    }
  }
}

export const toolsController = new ToolsController();
