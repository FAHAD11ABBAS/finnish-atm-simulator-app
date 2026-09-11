/**
 * Finnish ATM Thermal Receipt Generator & Modal
 * Generates authentic Finnish Otto ATM thermal printed receipts
 * Author: Abbas Fahad (FAHAD11ABBAS)
 */

import { Formatters } from '../utils/formatters.js';
import { sounds } from '../audio/sound-effects.js';
import { openModal, closeModal } from '../utils/dom.js';

export class ReceiptPrinter {
  constructor() {
    this.modalId = '#receipt-modal';
  }

  /**
   * Print and display ATM receipt
   */
  printReceipt(data) {
    const paperContainer = document.querySelector('#thermal-receipt-paper');
    if (!paperContainer) return;

    sounds.playReceiptPrint();

    const timestamp = Formatters.formatDate(new Date());
    const maskedCard = Formatters.maskCardNumber(data.cardNumber || '4921840012345678');
    const maskedIban = Formatters.maskIBAN(data.iban || 'FI2150009820012345');
    const amountStr = Formatters.formatEUR(data.amount || 0);
    const balanceStr = Formatters.formatEUR(data.balance || 0);
    const refNum = data.reference || `${Math.floor(10000000 + Math.random() * 90000000)}`;

    paperContainer.innerHTML = `
      <div class="receipt-header">
        <div class="receipt-otto-logo">Otto.</div>
        <div class="receipt-subhead">AUTOMATIA PANKKIAUTOMAATIT OY</div>
        <div class="receipt-subhead">HKI KESKUSTA / TERMINAL #042</div>
      </div>

      <div class="receipt-body">
        <div class="receipt-row">
          <span>AIKA / TID:</span>
          <span>${timestamp}</span>
        </div>
        <div class="receipt-row">
          <span>KORTTI / KORT:</span>
          <span>${maskedCard}</span>
        </div>
        <div class="receipt-row">
          <span>TILI / KONTO:</span>
          <span>${maskedIban}</span>
        </div>
        <div class="receipt-row">
          <span>TAPAHTUMA:</span>
          <span>${data.type || 'KÄTEISNOSTO (NOSTO)'}</span>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-row emphasis">
          <span>MÄÄRÄ / BELOPP:</span>
          <span>${amountStr}</span>
        </div>

        <div class="receipt-row">
          <span>KÄYTETTÄVISSÄ:</span>
          <span>${balanceStr}</span>
        </div>
        <div class="receipt-row">
          <span>ARKISTOVIITE:</span>
          <span>${refNum}</span>
        </div>
      </div>

      <div class="receipt-barcode">
        <svg class="barcode-svg" viewBox="0 0 200 40" preserveAspectRatio="none">
          <line x1="10" y1="0" x2="10" y2="40" stroke="#000" stroke-width="3"/>
          <line x1="18" y1="0" x2="18" y2="40" stroke="#000" stroke-width="1.5"/>
          <line x1="24" y1="0" x2="24" y2="40" stroke="#000" stroke-width="4"/>
          <line x1="34" y1="0" x2="34" y2="40" stroke="#000" stroke-width="2"/>
          <line x1="42" y1="0" x2="42" y2="40" stroke="#000" stroke-width="3"/>
          <line x1="50" y1="0" x2="50" y2="40" stroke="#000" stroke-width="1"/>
          <line x1="58" y1="0" x2="58" y2="40" stroke="#000" stroke-width="5"/>
          <line x1="70" y1="0" x2="70" y2="40" stroke="#000" stroke-width="2"/>
          <line x1="78" y1="0" x2="78" y2="40" stroke="#000" stroke-width="3"/>
          <line x1="88" y1="0" x2="88" y2="40" stroke="#000" stroke-width="4"/>
          <line x1="98" y1="0" x2="98" y2="40" stroke="#000" stroke-width="1.5"/>
          <line x1="106" y1="0" x2="106" y2="40" stroke="#000" stroke-width="3"/>
          <line x1="116" y1="0" x2="116" y2="40" stroke="#000" stroke-width="4"/>
          <line x1="128" y1="0" x2="128" y2="40" stroke="#000" stroke-width="2"/>
          <line x1="136" y1="0" x2="136" y2="40" stroke="#000" stroke-width="4"/>
          <line x1="148" y1="0" x2="148" y2="40" stroke="#000" stroke-width="2"/>
          <line x1="156" y1="0" x2="156" y2="40" stroke="#000" stroke-width="5"/>
          <line x1="168" y1="0" x2="168" y2="40" stroke="#000" stroke-width="2"/>
          <line x1="176" y1="0" x2="176" y2="40" stroke="#000" stroke-width="3"/>
          <line x1="186" y1="0" x2="186" y2="40" stroke="#000" stroke-width="4"/>
        </svg>
        <span style="font-size: 0.65rem; color: #4b5563;">* ${refNum} *</span>
      </div>
    `;

    openModal(this.modalId);
  }
}

export const receiptPrinter = new ReceiptPrinter();
