/**
 * Finnish ATM & Smart Banking Simulator
 * Main Application Orchestrator & Bootstrapper
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

import { store } from './state/store.js';
import { sounds } from './audio/sound-effects.js';
import { translations } from './i18n/translations.js';
import { atmTerminal } from './components/atm-terminal.js';
import { ebankingPortal } from './components/ebanking-portal.js';
import { bankIdAuth } from './components/bank-id-auth.js';
import { toolsController } from './components/tools-controller.js';
import { closeModal, $, $$ } from './utils/dom.js';

class App {
  constructor() {
    this.currentMode = 'atm'; // 'atm', 'ebanking', 'calculators'
  }

  init() {
    // Initialize components
    atmTerminal.init();
    ebankingPortal.init();
    bankIdAuth.init();
    toolsController.init();

    this.bindGlobalNavigation();
    this.bindLanguageSwitcher();
    this.bindAudioToggle();
    this.bindModalBackdrops();
    this.bindAtmQuickButtons();

    // Apply initial language
    this.applyTranslations(store.getLanguage());

    console.log('🇫🇮 Finnish ATM & Smart Banking Simulator initialized successfully.');
  }

  bindGlobalNavigation() {
    const tabs = $$('.mode-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active', 'atm-mode-active'));
        tab.classList.add('active');

        const mode = tab.getAttribute('data-mode');
        this.currentMode = mode;

        if (mode === 'atm') {
          tab.classList.add('atm-mode-active');
        }

        // Switch visible view
        $$('.view-container').forEach(view => view.classList.remove('active-view'));
        const targetView = $(`#view-${mode}`);
        if (targetView) {
          targetView.classList.add('active-view');
        }
      });
    });
  }

  bindLanguageSwitcher() {
    const langSelect = $('#lang-selector');
    if (langSelect) {
      langSelect.value = store.getLanguage();
      langSelect.addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        store.setLanguage(selectedLang);
        this.applyTranslations(selectedLang);
      });
    }

    store.subscribe('languageChanged', (lang) => {
      this.applyTranslations(lang);
    });
  }

  applyTranslations(lang) {
    const dict = translations[lang] || translations.en;
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  bindAudioToggle() {
    const audioBtn = $('#btn-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = sounds.toggleMute();
        audioBtn.classList.toggle('muted', isMuted);
        const iconSpan = audioBtn.querySelector('.audio-icon');
        const textSpan = audioBtn.querySelector('.audio-text');
        if (iconSpan) iconSpan.textContent = isMuted ? '🔇' : '🔊';
        if (textSpan) textSpan.textContent = isMuted ? 'Muted' : 'Audio';
      });
    }
  }

  bindModalBackdrops() {
    $$('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    });

    $('#btn-close-receipt')?.addEventListener('click', () => {
      closeModal('#receipt-modal');
    });
  }

  bindAtmQuickButtons() {
    // Fast Cash Buttons
    $$('.fast-cash-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const amount = btn.getAttribute('data-amount');
        atmTerminal.executeWithdrawal(amount);
      });
    });

    // ATM Menu Buttons (Nosto, Talletus, Saldo, Lopeta)
    $('#btn-menu-pikanosto')?.addEventListener('click', () => atmTerminal.setScreen('fast-cash'));
    $('#btn-menu-nosto')?.addEventListener('click', () => atmTerminal.setScreen('custom-cash'));
    $('#btn-menu-talletus')?.addEventListener('click', () => atmTerminal.setScreen('deposit'));
    $('#btn-menu-saldo')?.addEventListener('click', () => {
      atmTerminal.setScreen('balance');
      atmTerminal.renderBalanceScreen();
    });
    $('#btn-menu-exit')?.addEventListener('click', () => atmTerminal.ejectCard());

    // Back to ATM Menu buttons
    $$('.btn-atm-back').forEach(btn => {
      btn.addEventListener('click', () => atmTerminal.setScreen('menu'));
    });

    // Deposit denomination buttons
    $$('.btn-deposit-note').forEach(btn => {
      btn.addEventListener('click', () => {
        const noteVal = Number(btn.getAttribute('data-denom'));
        atmTerminal.executeDeposit(noteVal);
      });
    });
  }
}

// Bootstrap once DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
