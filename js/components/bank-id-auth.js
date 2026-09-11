/**
 * Finnish Bank ID (Pankkitunnukset / Tupas / Suomi.fi) Auth Modal Controller
 * Simulates real Finnish e-Identification multi-factor authentication
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

import { store } from '../state/store.js';
import { sounds } from '../audio/sound-effects.js';
import { showToast, openModal, closeModal, $, $$ } from '../utils/dom.js';

export class BankIdAuthController {
  constructor() {
    this.modalId = '#bank-id-modal';
    this.selectedBank = 'op';
    this.selectedProfileId = 'user-matti';
    this.challengeCode = '7492';
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Open Bank ID Modal from header
    const openBtn = $('#btn-open-bank-id');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        this.generateChallengeCode();
        this.renderPresetUsers();
        openModal(this.modalId);
      });
    }

    // Close Modal Button
    const closeBtn = $('#btn-close-bank-id');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(this.modalId));
    }

    // Bank Selector Buttons
    $$('.bank-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.bank-option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedBank = btn.getAttribute('data-bank');
      });
    });

    // Bank ID Form Submission
    const authForm = $('#bank-id-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAuthenticate();
      });
    }
  }

  generateChallengeCode() {
    this.challengeCode = String(Math.floor(1000 + Math.random() * 9000));
    const challengeEl = $('#bank-id-challenge-num');
    if (challengeEl) challengeEl.textContent = this.challengeCode;
  }

  renderPresetUsers() {
    const container = $('#bank-id-preset-users');
    if (!container) return;

    const profiles = store.getAllProfiles();
    const active = store.getActiveProfile();

    container.innerHTML = profiles.map(p => `
      <div class="preset-user-pill ${p.id === active.id ? 'selected' : ''}" data-profile-id="${p.id}">
        <div>
          <span class="preset-user-name">${p.name}</span>
          <span class="preset-user-role"> • ${p.bank}</span>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-accent-blue);">PIN: ${p.pin}</span>
      </div>
    `).join('');

    $$('.preset-user-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        $$('.preset-user-pill').forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        this.selectedProfileId = pill.getAttribute('data-profile-id');
      });
    });
  }

  handleAuthenticate() {
    sounds.playSuccessChime();
    store.switchProfile(this.selectedProfileId);
    closeModal(this.modalId);
    showToast('Tunnistautuminen hyväksytty', `Kirjauduttu sisään käyttäjänä: ${store.getActiveProfile().name}`, 'success');

    // Switch to e-Banking view
    const ebankingTab = $('#tab-btn-ebanking');
    if (ebankingTab) ebankingTab.click();
  }
}

export const bankIdAuth = new BankIdAuthController();
