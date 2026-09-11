/**
 * Finnish ATM & Smart Banking Simulator - Reactive State Store
 * Handles persistent state, reactive event pub/sub, and bank balance mutations
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

import { initialProfiles } from './accounts-data.js';

class BankingStore {
  constructor() {
    this.STORAGE_KEY = 'FINNISH_ATM_BANKING_STATE_V1';
    this.LANG_KEY = 'FINNISH_ATM_LANG';
    this.listeners = new Map();
    this.state = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profiles && parsed.activeProfileId) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read state from localStorage, falling back to defaults.');
    }

    return {
      profiles: initialProfiles,
      activeProfileId: initialProfiles[0].id,
      language: localStorage.getItem(this.LANG_KEY) || 'fi'
    };
  }

  saveState() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist banking state', e);
    }
  }

  // Pub/Sub Event System
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const list = this.listeners.get(event);
      if (list) {
        this.listeners.set(event, list.filter(cb => cb !== callback));
      }
    };
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
    this.saveState();
  }

  // Getters
  getActiveProfile() {
    return this.state.profiles.find(p => p.id === this.state.activeProfileId) || this.state.profiles[0];
  }

  getAllProfiles() {
    return this.state.profiles;
  }

  getPrimaryAccount() {
    const profile = this.getActiveProfile();
    return profile.accounts[0];
  }

  getPrimaryCard() {
    const profile = this.getActiveProfile();
    return profile.cards[0];
  }

  getLanguage() {
    return this.state.language || 'fi';
  }

  setLanguage(lang) {
    this.state.language = lang;
    localStorage.setItem(this.LANG_KEY, lang);
    this.emit('languageChanged', lang);
  }

  switchProfile(profileId) {
    const found = this.state.profiles.find(p => p.id === profileId);
    if (found) {
      this.state.activeProfileId = profileId;
      this.emit('profileChanged', found);
      this.emit('stateUpdated', this.state);
    }
  }

  // Mutations
  withdrawCash(amount) {
    const profile = this.getActiveProfile();
    const account = profile.accounts[0];
    const withdrawNum = Number(amount);

    if (account.balance < withdrawNum) {
      return { success: false, message: 'Insufficient funds on account' };
    }

    account.balance -= withdrawNum;

    const newTx = {
      id: `tx-atm-${Date.now()}`,
      title: 'Otto-automaattinosto (HKI-042)',
      category: 'lifestyle',
      type: 'expense',
      amount: withdrawNum,
      date: new Date().toISOString(),
      reference: String(Math.floor(100000 + Math.random() * 900000))
    };

    profile.transactions.unshift(newTx);

    this.emit('transactionAdded', newTx);
    this.emit('balanceChanged', account);
    this.emit('stateUpdated', this.state);

    return { success: true, newBalance: account.balance, transaction: newTx };
  }

  depositCash(amount) {
    const profile = this.getActiveProfile();
    const account = profile.accounts[0];
    const depositNum = Number(amount);

    account.balance += depositNum;

    const newTx = {
      id: `tx-dep-${Date.now()}`,
      title: 'Otto-talletusautomaatti (HKI-042)',
      category: 'income',
      type: 'income',
      amount: depositNum,
      date: new Date().toISOString(),
      reference: String(Math.floor(100000 + Math.random() * 900000))
    };

    profile.transactions.unshift(newTx);

    this.emit('transactionAdded', newTx);
    this.emit('balanceChanged', account);
    this.emit('stateUpdated', this.state);

    return { success: true, newBalance: account.balance, transaction: newTx };
  }

  makeTransfer(recipientIban, recipientName, amount, reference, message) {
    const profile = this.getActiveProfile();
    const account = profile.accounts[0];
    const transferNum = Number(amount);

    if (account.balance < transferNum) {
      return { success: false, message: 'Insufficient funds' };
    }

    account.balance -= transferNum;

    const newTx = {
      id: `tx-tr-${Date.now()}`,
      title: recipientName || 'Tilisiirto saajalle',
      category: 'transfer',
      type: 'expense',
      amount: transferNum,
      date: new Date().toISOString(),
      reference: reference || '00000',
      message: message || '',
      recipientIban
    };

    profile.transactions.unshift(newTx);

    this.emit('transactionAdded', newTx);
    this.emit('balanceChanged', account);
    this.emit('stateUpdated', this.state);

    return { success: true, newBalance: account.balance, transaction: newTx };
  }

  payEInvoice(invoiceId) {
    const profile = this.getActiveProfile();
    const invIndex = profile.eInvoices.findIndex(inv => inv.id === invoiceId);
    if (invIndex === -1) return { success: false };

    const inv = profile.eInvoices[invIndex];
    const res = this.makeTransfer(inv.iban, inv.sender, inv.amount, inv.reference, `E-lasku: ${inv.sender}`);
    if (res.success) {
      profile.eInvoices.splice(invIndex, 1);
      this.emit('eInvoicesUpdated', profile.eInvoices);
      this.emit('stateUpdated', this.state);
      return { success: true };
    }
    return res;
  }

  approveAllEInvoices() {
    const profile = this.getActiveProfile();
    const count = profile.eInvoices.length;
    let paidCount = 0;

    const invoicesToPay = [...profile.eInvoices];
    for (const inv of invoicesToPay) {
      const res = this.payEInvoice(inv.id);
      if (res.success) paidCount++;
    }

    return { total: count, paid: paidCount };
  }

  toggleCardBlock(cardId) {
    const card = this.getPrimaryCard();
    card.isBlocked = !card.isBlocked;
    this.emit('cardUpdated', card);
    this.emit('stateUpdated', this.state);
    return card.isBlocked;
  }

  toggleContactless(cardId) {
    const card = this.getPrimaryCard();
    card.contactlessEnabled = !card.contactlessEnabled;
    this.emit('cardUpdated', card);
    this.emit('stateUpdated', this.state);
    return card.contactlessEnabled;
  }

  toggleOnlinePurchases(cardId) {
    const card = this.getPrimaryCard();
    card.onlinePurchasesEnabled = !card.onlinePurchasesEnabled;
    this.emit('cardUpdated', card);
    this.emit('stateUpdated', this.state);
    return card.onlinePurchasesEnabled;
  }

  setCardRegion(region) {
    const card = this.getPrimaryCard();
    card.region = region;
    this.emit('cardUpdated', card);
    this.emit('stateUpdated', this.state);
  }

  resetAllData() {
    this.state = {
      profiles: JSON.parse(JSON.stringify(initialProfiles)),
      activeProfileId: initialProfiles[0].id,
      language: this.getLanguage()
    };
    this.saveState();
    this.emit('stateUpdated', this.state);
  }
}

export const store = new BankingStore();
