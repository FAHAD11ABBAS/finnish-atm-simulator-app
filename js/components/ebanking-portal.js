/**
 * Finnish Smart e-Banking Portal Controller
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

import { store } from '../state/store.js';
import { Formatters } from '../utils/formatters.js';
import { BankValidator } from '../services/bank-validator.js';
import { sounds } from '../audio/sound-effects.js';
import { showToast, $, $$ } from '../utils/dom.js';

export class EbankingPortalController {
  constructor() {
    this.activeFilter = 'all';
    this.searchQuery = '';
  }

  init() {
    this.render();
    this.bindEvents();

    store.subscribe('stateUpdated', () => this.render());
    store.subscribe('profileChanged', () => this.render());
    store.subscribe('balanceChanged', () => this.render());
    store.subscribe('cardUpdated', () => this.renderCardSection());
  }

  bindEvents() {
    // Transaction Category Filter Buttons
    $$('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.getAttribute('data-filter');
        this.renderTransactions();
      });
    });

    // Transaction Search Input
    const searchInput = $('#tx-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTransactions();
      });
    }

    // New Transfer Form Submission
    const transferForm = $('#transfer-form');
    if (transferForm) {
      transferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleTransferSubmit();
      });
    }

    // Reference Number Autofill / Generator Helper
    const generateRefBtn = $('#btn-gen-reference');
    if (generateRefBtn) {
      generateRefBtn.addEventListener('click', () => {
        const randBase = Math.floor(10000 + Math.random() * 90000);
        const validRef = BankValidator.generateReference(randBase);
        const refInput = $('#transfer-ref');
        if (refInput) {
          refInput.value = validRef;
          showToast('Viitenumero luotu', `Validi 7-3-1 viite: ${validRef}`, 'info');
        }
      });
    }

    // Approve All E-invoices
    const approveAllBtn = $('#btn-approve-all-einv');
    if (approveAllBtn) {
      approveAllBtn.addEventListener('click', () => {
        const res = store.approveAllEInvoices();
        if (res.paid > 0) {
          sounds.playSuccessChime();
          showToast('E-laskut hyväksytty', `${res.paid} kpl e-laskuja maksettu onnistuneesti!`, 'success');
        } else {
          showToast('Ei odottavia laskuja', 'Kaikki e-laskut on jo käsitelty.', 'info');
        }
      });
    }

    // Download Statement CSV
    const exportCsvBtn = $('#btn-export-statement-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this.exportStatementCsv());
    }

    // Card Control Toggles
    const toggleFreeze = $('#toggle-card-freeze');
    if (toggleFreeze) {
      toggleFreeze.addEventListener('change', () => {
        const isBlocked = store.toggleCardBlock();
        showToast('Kortin tila päivitetty', isBlocked ? 'Kortti on nyt suljettu!' : 'Kortin lukitus avattu.', isBlocked ? 'error' : 'success');
      });
    }

    const toggleContactless = $('#toggle-card-contactless');
    if (toggleContactless) {
      toggleContactless.addEventListener('change', () => {
        const enabled = store.toggleContactless();
        showToast('Lähimaksu (NFC)', enabled ? 'Lähimaksu aktivoitu' : 'Lähimaksu estetty', 'info');
      });
    }

    const toggleOnline = $('#toggle-card-online');
    if (toggleOnline) {
      toggleOnline.addEventListener('change', () => {
        const enabled = store.toggleOnlinePurchases();
        showToast('Verkkomaksut', enabled ? 'Verkkomaksut sallittu' : 'Verkkomaksut estetty', 'info');
      });
    }
  }

  handleTransferSubmit() {
    const ibanInput = $('#transfer-iban');
    const nameInput = $('#transfer-name');
    const amountInput = $('#transfer-amount');
    const refInput = $('#transfer-ref');
    const msgInput = $('#transfer-message');

    const iban = ibanInput?.value.trim() || '';
    const name = nameInput?.value.trim() || '';
    const amount = Number(amountInput?.value);
    const ref = refInput?.value.trim() || '';
    const msg = msgInput?.value.trim() || '';

    // Validate Finnish IBAN
    if (!BankValidator.validateFinnishIBAN(iban)) {
      sounds.playErrorBuzz();
      showToast('Virheellinen IBAN', 'Tarkista vastaanottajan suomalainen IBAN-tilinumero (esim. FI21 5000 9820 0123 45)', 'error');
      return;
    }

    // Validate Reference number if provided
    if (ref && !BankValidator.validateFinnishReference(ref)) {
      sounds.playErrorBuzz();
      showToast('Virheellinen viitenumero', 'Viitenumeron 7-3-1 tarkiste ei täsmää. Korjaa tai luo automaattinen viite.', 'error');
      return;
    }

    if (!amount || amount <= 0) {
      sounds.playErrorBuzz();
      showToast('Virheellinen summa', 'Anna kelvollinen siirrettävä euromäärä.', 'error');
      return;
    }

    const res = store.makeTransfer(iban, name, amount, ref, msg);
    if (res.success) {
      sounds.playSuccessChime();
      showToast('Maksu suoritettu!', `${Formatters.formatEUR(amount)} siirretty saajalle ${name}`, 'success');
      
      // Reset form
      if (transferForm) {
        ibanInput.value = '';
        nameInput.value = '';
        amountInput.value = '';
        if (refInput) refInput.value = '';
        if (msgInput) msgInput.value = '';
      }
    } else {
      sounds.playErrorBuzz();
      showToast('Maksu epäonnistui', res.message || 'Tilin kate ei riitä siirtoon.', 'error');
    }
  }

  render() {
    this.renderHeaderAndBalances();
    this.renderTransactions();
    this.renderEInvoices();
    this.renderCardSection();
    this.renderAnalytics();
  }

  renderHeaderAndBalances() {
    const profile = store.getActiveProfile();
    const primaryAccount = profile.accounts[0];
    const savingsAccount = profile.accounts[1] || { balance: 0, iban: 'FI-- ---- ---- ---- --' };

    const totalWealth = profile.accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Update user header
    const userNameEl = $('#ebanking-user-name');
    const userBankTag = $('#ebanking-bank-provider');
    const userAvatar = $('#user-avatar-initials');

    if (userNameEl) userNameEl.textContent = profile.name;
    if (userBankTag) userBankTag.textContent = profile.bank;
    if (userAvatar) {
      const initials = profile.name.split(' ').map(n => n[0]).join('');
      userAvatar.textContent = initials;
    }

    // Total balance display
    const totalBalanceEl = $('#total-wealth-amount');
    if (totalBalanceEl) {
      totalBalanceEl.textContent = Formatters.formatEUR(totalWealth);
    }

    // Primary checking
    const chkBalance = $('#chk-account-balance');
    const chkIban = $('#chk-account-iban');
    if (chkBalance) chkBalance.textContent = Formatters.formatEUR(primaryAccount.balance);
    if (chkIban) chkIban.textContent = Formatters.formatIBAN(primaryAccount.iban);

    // Savings
    const savBalance = $('#sav-account-balance');
    const savIban = $('#sav-account-iban');
    if (savBalance) savBalance.textContent = Formatters.formatEUR(savingsAccount.balance);
    if (savIban) savIban.textContent = Formatters.formatIBAN(savingsAccount.iban);
  }

  renderTransactions() {
    const container = $('#transactions-list-container');
    if (!container) return;

    const profile = store.getActiveProfile();
    let txs = profile.transactions || [];

    // Filter by category
    if (this.activeFilter !== 'all') {
      if (this.activeFilter === 'income') {
        txs = txs.filter(t => t.type === 'income');
      } else if (this.activeFilter === 'expense') {
        txs = txs.filter(t => t.type === 'expense');
      } else if (this.activeFilter === 'transfer') {
        txs = txs.filter(t => t.category === 'transfer');
      }
    }

    // Search query
    if (this.searchQuery) {
      txs = txs.filter(t => 
        t.title.toLowerCase().includes(this.searchQuery) ||
        (t.reference && t.reference.toLowerCase().includes(this.searchQuery))
      );
    }

    if (txs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 30px 0; color: var(--color-text-muted);">
          Ei löytynyt tapahtumia valituilla ehdoilla.
        </div>
      `;
      return;
    }

    container.innerHTML = txs.map(tx => {
      const isIncome = tx.type === 'income';
      const iconSign = isIncome ? '↓' : '↑';
      const amountPrefix = isIncome ? '+' : '-';
      const dateStr = Formatters.formatDate(tx.date);

      return `
        <div class="transaction-row">
          <div class="trans-left">
            <div class="trans-icon-box ${tx.type}">
              ${iconSign}
            </div>
            <div class="trans-details">
              <span class="trans-title">${tx.title}</span>
              <span class="trans-sub">
                <span>${tx.category.toUpperCase()}</span>
                ${tx.reference ? `• Viite: ${tx.reference}` : ''}
              </span>
            </div>
          </div>
          <div class="trans-right">
            <div class="trans-amount ${tx.type}">
              ${amountPrefix} ${Formatters.formatEUR(tx.amount)}
            </div>
            <div class="trans-date">${dateStr}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderEInvoices() {
    const container = $('#einvoices-list-container');
    const countBadge = $('#einv-count-badge');
    if (!container) return;

    const profile = store.getActiveProfile();
    const einvs = profile.eInvoices || [];

    if (countBadge) countBadge.textContent = einvs.length;

    if (einvs.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 20px 0; color: var(--color-text-muted); font-size: 0.85rem;">
          Ei odottavia e-laskuja. Kaikki laskut on maksettu!
        </div>
      `;
      return;
    }

    container.innerHTML = einvs.map(inv => `
      <div class="transaction-row" style="margin-bottom: 8px;">
        <div class="trans-left">
          <div class="trans-icon-box expense">📄</div>
          <div class="trans-details">
            <span class="trans-title">${inv.sender}</span>
            <span class="trans-sub">Eräpäivä: ${inv.dueDate} • Viite: ${inv.reference}</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span style="font-family: var(--font-mono); font-weight: 700; color: #ffffff;">${Formatters.formatEUR(inv.amount)}</span>
          <button class="btn btn-primary btn-sm btn-pay-einv" data-einv-id="${inv.id}">Maksa</button>
        </div>
      </div>
    `).join('');

    $$('.btn-pay-einv').forEach(btn => {
      btn.addEventListener('click', () => {
        const invId = btn.getAttribute('data-einv-id');
        const res = store.payEInvoice(invId);
        if (res.success) {
          sounds.playSuccessChime();
          showToast('E-lasku maksettu', 'Lasku suoritettu onnistuneesti.', 'success');
        } else {
          sounds.playErrorBuzz();
          showToast('Maksu epäonnistui', 'Tilin kate ei riitä laskun maksuun.', 'error');
        }
      });
    });
  }

  renderCardSection() {
    const profile = store.getActiveProfile();
    const card = profile.cards[0];
    const cardEl = $('#interactive-bank-card');

    if (cardEl) {
      cardEl.className = `bank-card-3d ${profile.bankTheme || 'card-nordea-theme'}`;
      
      const numberEl = $('#card-display-number');
      const nameEl = $('#card-display-name');
      const expiryEl = $('#card-display-expiry');
      const bankNameEl = $('#card-display-bank');

      if (numberEl) numberEl.textContent = card.number;
      if (nameEl) nameEl.textContent = profile.name;
      if (expiryEl) expiryEl.textContent = card.expiry;
      if (bankNameEl) bankNameEl.textContent = profile.bank;
    }

    // Update toggles
    const toggleFreeze = $('#toggle-card-freeze');
    const toggleContactless = $('#toggle-card-contactless');
    const toggleOnline = $('#toggle-card-online');

    if (toggleFreeze) toggleFreeze.checked = card.isBlocked;
    if (toggleContactless) toggleContactless.checked = card.contactlessEnabled;
    if (toggleOnline) toggleOnline.checked = card.onlinePurchasesEnabled;
  }

  renderAnalytics() {
    const profile = store.getActiveProfile();
    const expenses = (profile.transactions || []).filter(t => t.type === 'expense');

    const totals = {
      housing: 0,
      groceries: 0,
      transport: 0,
      lifestyle: 0,
      other: 0
    };

    expenses.forEach(t => {
      const cat = totals[t.category] !== undefined ? t.category : 'other';
      totals[cat] += t.amount;
    });

    const sumExpenses = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

    // Update segment widths
    $('#seg-housing')?.setAttribute('style', `width: ${(totals.housing / sumExpenses * 100).toFixed(1)}%`);
    $('#seg-groceries')?.setAttribute('style', `width: ${(totals.groceries / sumExpenses * 100).toFixed(1)}%`);
    $('#seg-transport')?.setAttribute('style', `width: ${(totals.transport / sumExpenses * 100).toFixed(1)}%`);
    $('#seg-lifestyle')?.setAttribute('style', `width: ${(totals.lifestyle / sumExpenses * 100).toFixed(1)}%`);
    $('#seg-other')?.setAttribute('style', `width: ${(totals.other / sumExpenses * 100).toFixed(1)}%`);

    // Update labels
    $('#legend-val-housing')?.textContent = Formatters.formatEUR(totals.housing);
    $('#legend-val-groceries')?.textContent = Formatters.formatEUR(totals.groceries);
    $('#legend-val-transport')?.textContent = Formatters.formatEUR(totals.transport);
    $('#legend-val-lifestyle')?.textContent = Formatters.formatEUR(totals.lifestyle);
  }

  exportStatementCsv() {
    const profile = store.getActiveProfile();
    const rows = [
      ['Date', 'Title', 'Category', 'Type', 'Amount (EUR)', 'Reference']
    ];

    profile.transactions.forEach(t => {
      rows.push([
        t.date,
        `"${t.title.replace(/"/g, '""')}"`,
        t.category,
        t.type,
        t.amount.toFixed(2),
        t.reference || ''
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Tiliote_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Tiliote ladattu', 'CSV-tilitapahtumat tallennettu tiedostoon.', 'success');
  }
}

export const ebankingPortal = new EbankingPortalController();
