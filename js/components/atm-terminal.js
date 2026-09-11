/**
 * Finnish ATM Terminal (Otto. Physical Simulator) Controller
 * Handles screen transitions, tactile keypad audio, cash dispensation, and card management
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';
import { Formatters } from '../utils/formatters.js';
import { showToast, $, $$ } from '../utils/dom.js';
import { receiptPrinter } from './receipt-printer.js';

export class AtmTerminalController {
  constructor() {
    this.currentScreen = 'welcome'; // welcome, pin, menu, fast-cash, custom-cash, deposit, balance, topup, processing, dispensing
    this.enteredPin = '';
    this.customAmount = '';
    this.isCardInserted = false;
    this.clockInterval = null;
  }

  init() {
    this.bindEvents();
    this.startClock();
    this.renderSidebarCards();
    this.updateScreenDisplay();

    store.subscribe('profileChanged', () => {
      this.renderSidebarCards();
      if (this.isCardInserted) {
        this.ejectCard();
      }
    });

    store.subscribe('balanceChanged', () => {
      if (this.currentScreen === 'balance') {
        this.renderBalanceScreen();
      }
    });
  }

  startClock() {
    const update = () => {
      const clockEl = $('#atm-clock-display');
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    };
    update();
    this.clockInterval = setInterval(update, 1000);
  }

  bindEvents() {
    // Card Slot Click
    const cardSlot = $('#atm-card-slot');
    if (cardSlot) {
      cardSlot.addEventListener('click', () => {
        if (!this.isCardInserted) {
          this.insertCard();
        } else {
          this.ejectCard();
        }
      });
    }

    // Insert Card Button (from welcome screen)
    const insertBtn = $('#btn-insert-card-cta');
    if (insertBtn) {
      insertBtn.addEventListener('click', () => this.insertCard());
    }

    // Keypad Digit & Functional Keys
    $$('.atm-key').forEach(key => {
      key.addEventListener('click', (e) => {
        const val = key.getAttribute('data-key');
        sounds.playKeypadBeep();
        this.handleKeypadInput(val);
      });
    });

    // Cash Stacks Click to Collect
    const cashStack = $('#banknotes-stack');
    if (cashStack) {
      cashStack.addEventListener('click', () => {
        cashStack.style.display = 'none';
        $('#cash-dispenser-bezel')?.classList.remove('dispensing');
        showToast('Käteinen otettu', 'Kiitos asioinnista Otto-automaatilla!', 'success');
        sounds.playSuccessChime();
        this.setScreen('menu');
      });
    }
  }

  renderSidebarCards() {
    const container = $('#atm-cards-list');
    if (!container) return;

    const profiles = store.getAllProfiles();
    const active = store.getActiveProfile();

    container.innerHTML = profiles.map(profile => {
      const card = profile.cards[0];
      const isSelected = profile.id === active.id;
      return `
        <div class="quick-card-item ${isSelected ? 'selected' : ''}" data-profile-id="${profile.id}">
          <div class="quick-card-chip"></div>
          <div class="quick-card-info">
            <span class="quick-card-name">${profile.name}</span>
            <span class="quick-card-number">${card.number}</span>
          </div>
          <div class="quick-card-pin">PIN: ${card.pin}</div>
        </div>
      `;
    }).join('');

    $$('.quick-card-item').forEach(item => {
      item.addEventListener('click', () => {
        const pId = item.getAttribute('data-profile-id');
        store.switchProfile(pId);
        showToast('Kortti valittu', `Kortinhaltija: ${store.getActiveProfile().name}`, 'info');
      });
    });
  }

  insertCard() {
    const card = store.getPrimaryCard();
    if (card.isBlocked) {
      showToast('Kortti lukittu', 'Kortti on suljettu turvallisuussyistä.', 'error');
      sounds.playErrorBuzz();
      return;
    }

    this.isCardInserted = true;
    sounds.playCardInsert();
    $('#atm-card-slot')?.classList.add('has-card');
    this.enteredPin = '';
    this.setScreen('pin');
    showToast('Kortti tunnistettu', 'Syötä 4-numeroinen PIN-koodisi', 'otto');
  }

  ejectCard() {
    this.isCardInserted = false;
    sounds.playCardEject();
    $('#atm-card-slot')?.classList.remove('has-card');
    this.enteredPin = '';
    this.setScreen('welcome');
    showToast('Kortti palautettu', 'Muista ottaa korttisi mukaan!', 'info');
  }

  setScreen(screenName) {
    this.currentScreen = screenName;
    $$('.screen-state').forEach(el => el.classList.remove('active'));
    const target = $(`#screen-${screenName}`);
    if (target) {
      target.classList.add('active');
    }
    this.updateScreenDisplay();
  }

  handleKeypadInput(key) {
    if (key === 'cancel') {
      if (this.currentScreen === 'pin' || this.currentScreen === 'welcome') {
        this.ejectCard();
      } else {
        this.setScreen('menu');
      }
      return;
    }

    if (key === 'clear') {
      if (this.currentScreen === 'pin') {
        this.enteredPin = '';
        this.updatePinDots();
      } else if (this.currentScreen === 'custom-cash') {
        this.customAmount = '';
        $('#custom-amount-display').textContent = '0 €';
      }
      return;
    }

    if (key === 'enter') {
      if (this.currentScreen === 'pin') {
        this.verifyPin();
      } else if (this.currentScreen === 'custom-cash') {
        this.executeCustomWithdrawal();
      }
      return;
    }

    // Number keys (0-9)
    if (/^\d$/.test(key)) {
      if (this.currentScreen === 'pin') {
        if (this.enteredPin.length < 4) {
          this.enteredPin += key;
          this.updatePinDots();
          if (this.enteredPin.length === 4) {
            setTimeout(() => this.verifyPin(), 250);
          }
        }
      } else if (this.currentScreen === 'custom-cash') {
        if (this.customAmount.length < 4) {
          this.customAmount += key;
          const display = $('#custom-amount-display');
          if (display) display.textContent = `${this.customAmount} €`;
        }
      }
    }
  }

  updatePinDots() {
    const dots = $$('.pin-dot');
    dots.forEach((dot, index) => {
      if (index < this.enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  verifyPin() {
    const card = store.getPrimaryCard();
    if (this.enteredPin === card.pin) {
      sounds.playSuccessChime();
      this.enteredPin = '';
      this.setScreen('menu');
      showToast('PIN hyväksytty', `Tervetuloa, ${store.getActiveProfile().name}`, 'success');
    } else {
      sounds.playErrorBuzz();
      this.enteredPin = '';
      this.updatePinDots();
      showToast('Virheellinen PIN', 'Tarkista PIN-koodisi ja yritä uudelleen', 'error');
    }
  }

  executeWithdrawal(amount) {
    const num = Number(amount);
    const account = store.getPrimaryAccount();

    if (account.balance < num) {
      sounds.playErrorBuzz();
      showToast('Ei katetta', 'Tilisi saldo ei riitä valittuun nostoon.', 'error');
      return;
    }

    this.setScreen('processing');

    setTimeout(() => {
      const res = store.withdrawCash(num);
      if (res.success) {
        this.triggerDispenserAnimation(num, res.newBalance);
      }
    }, 1200);
  }

  executeCustomWithdrawal() {
    const num = Number(this.customAmount);
    if (!num || num < 10 || num % 10 !== 0) {
      sounds.playErrorBuzz();
      showToast('Virheellinen summa', 'Syötä summa 10 euron kerrannaisena (vähintään 10 €)', 'error');
      return;
    }
    this.customAmount = '';
    this.executeWithdrawal(num);
  }

  triggerDispenserAnimation(amount, remainingBalance) {
    sounds.playCashDispenser();
    this.setScreen('dispensing');

    const bezel = $('#cash-dispenser-bezel');
    const stack = $('#banknotes-stack');

    if (bezel) bezel.classList.add('dispensing');
    if (stack) {
      stack.style.display = 'flex';
      stack.textContent = `${amount} €`;
    }

    // Trigger printed receipt peek
    const receiptPeek = $('#receipt-peek-tab');
    if (receiptPeek) {
      receiptPeek.style.display = 'block';
      receiptPeek.onclick = () => {
        receiptPrinter.printReceipt({
          cardNumber: store.getPrimaryCard().number,
          iban: store.getPrimaryAccount().iban,
          amount: amount,
          balance: remainingBalance,
          type: 'OTTO-NOSTO / KÄTEINEN'
        });
      };
    }
  }

  executeDeposit(amount) {
    this.setScreen('processing');
    sounds.playCashDispenser();

    setTimeout(() => {
      const res = store.depositCash(amount);
      sounds.playSuccessChime();
      showToast('Talletus onnistui', `${Formatters.formatEUR(amount)} lisätty tilillesi!`, 'success');
      this.setScreen('balance');
    }, 1400);
  }

  renderBalanceScreen() {
    const account = store.getPrimaryAccount();
    const balanceVal = $('#atm-balance-display-val');
    const ibanVal = $('#atm-balance-iban-val');

    if (balanceVal) balanceVal.textContent = Formatters.formatEUR(account.balance);
    if (ibanVal) ibanVal.textContent = Formatters.formatIBAN(account.iban);
  }

  updateScreenDisplay() {
    if (this.currentScreen === 'balance') {
      this.renderBalanceScreen();
    }
  }
}

export const atmTerminal = new AtmTerminalController();
