import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioEngine';
import { generateRandomFinnishIBAN } from '../utils/ibanValidator';

const BankContext = createContext();

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-2030-001',
    date: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'deposit',
    category: 'Income',
    title: 'Kela / Suomi Valtio Stipendi',
    amount: 850.00,
    iban: 'FI50 0001 0000 9999 88',
    status: 'Completed',
    reference: 'REF-2030-9941',
  },
  {
    id: 'tx-2030-002',
    date: new Date(Date.now() - 3600000 * 18).toISOString(),
    type: 'card_payment',
    category: 'Shopping',
    title: 'K-Supermarket Kamppi',
    amount: -42.80,
    iban: 'FI80 3939 0002 1122 33',
    status: 'Completed',
    reference: 'REF-2030-8812',
  },
  {
    id: 'tx-2030-003',
    date: new Date(Date.now() - 3600000 * 36).toISOString(),
    type: 'transfer',
    category: 'MobilePay',
    title: 'MobilePay Suomi: Matti Virtanen',
    amount: -25.00,
    iban: 'FI12 2020 4455 6677 88',
    status: 'Completed',
    reference: 'MP-994021',
  },
  {
    id: 'tx-2030-004',
    date: new Date(Date.now() - 3600000 * 52).toISOString(),
    type: 'deposit',
    category: 'Yield',
    title: 'e-EUR Quantum Yield Interest (4.2% APY)',
    amount: 143.50,
    iban: 'FI00 0000 e-EUR VAULT',
    status: 'Completed',
    reference: 'YIELD-2030-AUTOPAY',
  },
  {
    id: 'tx-2030-005',
    date: new Date(Date.now() - 3600000 * 74).toISOString(),
    type: 'withdrawal',
    category: 'ATM',
    title: 'Otto. ATM Kamppi Helsinki',
    amount: -100.00,
    iban: 'FI50 5000 1234 5678 90',
    status: 'Completed',
    reference: 'OTTO-2030-771',
  },
  {
    id: 'tx-2030-006',
    date: new Date(Date.now() - 3600000 * 96).toISOString(),
    type: 'card_payment',
    category: 'Transport',
    title: 'VR Junat Express HKI-TRE',
    amount: -18.90,
    iban: 'FI39 3900 1122 3344 55',
    status: 'Completed',
    reference: 'VR-2030-TICKET',
  }
];

export const SUPPORTED_BANKS = [
  { id: 'op', name: 'OP Osuuspankki', code: '500', color: 'from-orange-500 to-amber-600', logoText: 'OP' },
  { id: 'nordea', name: 'Nordea Suomi', code: '120', color: 'from-blue-600 to-indigo-700', logoText: 'N' },
  { id: 'danske', name: 'Danske Bank', code: '800', color: 'from-sky-700 to-cyan-800', logoText: 'DB' },
  { id: 'spankki', name: 'S-Pankki', code: '390', color: 'from-emerald-600 to-teal-700', logoText: 'S' },
  { id: 'omasp', name: 'Oma Säästöpankki', code: '400', color: 'from-cyan-600 to-blue-700', logoText: 'Oma' },
];

export const BankProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userBank, setUserBank] = useState(SUPPORTED_BANKS[0]);
  const [user, setUser] = useState({
    name: 'Fahad Abbas',
    hetu: '110898-999X',
    iban: 'FI50 5000 1234 5678 90',
    mobilePayPhone: '+358 40 123 4567',
  });

  const [balances, setBalances] = useState({
    checking: 4850.50,
    savings: 12400.00,
    eEUR: 1450.00,
  });

  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [language, setLanguage] = useState('fi'); // 'fi' or 'en'
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'fi' ? 'en' : 'fi'));
    audioEngine.playBeep(900, 0.04);
  };

  const toggleAudio = () => {
    const muted = audioEngine.toggleMute();
    setIsAudioMuted(muted);
    if (!muted) audioEngine.playBeep(1200, 0.05);
  };

  const loginUser = (bankId = 'op') => {
    const selected = SUPPORTED_BANKS.find((b) => b.id === bankId) || SUPPORTED_BANKS[0];
    setUserBank(selected);
    setIsAuthenticated(true);
    audioEngine.playSuccess();
    addToast(
      language === 'fi'
        ? `Tupas Neural Biometrinen Tunnistautuminen Hyväksytty (${selected.name})`
        : `Tupas Neural Biometric Authentication Verified (${selected.name})`,
      'success'
    );
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    audioEngine.playBeep(440, 0.1);
    addToast(
      language === 'fi' ? 'Kirjauduttu ulos turvallisesti' : 'Logged out securely',
      'info'
    );
  };

  // Deposit Cash
  const deposit = (amount, noteBreakdown = null) => {
    if (amount <= 0) return false;
    setBalances((prev) => ({
      ...prev,
      checking: prev.checking + amount,
    }));

    const newTx = {
      id: `tx-2030-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      type: 'deposit',
      category: 'ATM Deposit',
      title: language === 'fi' ? 'Otto. 2030 Käteistalletus' : 'Otto. 2030 Cash Deposit',
      amount: amount,
      iban: user.iban,
      status: 'Completed',
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      noteBreakdown,
    };

    setTransactions((prev) => [newTx, ...prev]);
    audioEngine.playSuccess();
    setActiveReceipt(newTx);
    addToast(
      language === 'fi'
        ? `Talletus onnistui: +${amount.toFixed(2)} €`
        : `Deposit successful: +${amount.toFixed(2)} €`,
      'success'
    );
    return true;
  };

  // Withdraw Cash
  const withdraw = (amount) => {
    if (amount <= 0) return { success: false, error: 'Invalid amount' };
    if (amount > balances.checking) {
      audioEngine.playError();
      addToast(
        language === 'fi' ? 'Virhe: Riittämätön saldo' : 'Error: Insufficient funds',
        'error'
      );
      return { success: false, error: 'Insufficient funds' };
    }

    setBalances((prev) => ({
      ...prev,
      checking: prev.checking - amount,
    }));

    const newTx = {
      id: `tx-2030-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      type: 'withdrawal',
      category: 'ATM Withdrawal',
      title: language === 'fi' ? 'Otto. 2030 Käteisnosto' : 'Otto. 2030 Cash Withdrawal',
      amount: -amount,
      iban: user.iban,
      status: 'Completed',
      reference: `WTH-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    audioEngine.playDispenseSound(Math.min(8, Math.ceil(amount / 20)));
    setActiveReceipt(newTx);
    addToast(
      language === 'fi'
        ? `Nosto onnistui: -${amount.toFixed(2)} €`
        : `Withdrawal successful: -${amount.toFixed(2)} €`,
      'success'
    );
    return { success: true, tx: newTx };
  };

  // P2P Transfer
  const transferP2P = (recipientIBAN, recipientName, amount, note = '') => {
    if (amount <= 0) return { success: false, error: 'Invalid amount' };
    if (amount > balances.checking) {
      audioEngine.playError();
      addToast(
        language === 'fi' ? 'Virhe: Riittämätön saldo' : 'Error: Insufficient funds',
        'error'
      );
      return { success: false, error: 'Insufficient funds' };
    }

    setBalances((prev) => ({
      ...prev,
      checking: prev.checking - amount,
    }));

    const newTx = {
      id: `tx-2030-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      type: 'transfer',
      category: 'P2P Transfer',
      title: `${language === 'fi' ? 'Siirto' : 'Transfer'}: ${recipientName || recipientIBAN}`,
      amount: -amount,
      iban: recipientIBAN,
      status: 'Completed',
      reference: `SEPA-${Math.floor(100000 + Math.random() * 900000)}`,
      note,
    };

    setTransactions((prev) => [newTx, ...prev]);
    audioEngine.playSuccess();
    setActiveReceipt(newTx);
    addToast(
      language === 'fi'
        ? `Pikasiirto lähetetty: -${amount.toFixed(2)} €`
        : `Instant SEPA Transfer Sent: -${amount.toFixed(2)} €`,
      'success'
    );
    return { success: true, tx: newTx };
  };

  // Currency Exchange to e-EUR
  const exchangeToEUR = (amountInEUR, fromCurrency, receivedAmount) => {
    setBalances((prev) => ({
      ...prev,
      checking: prev.checking + amountInEUR,
    }));

    const newTx = {
      id: `tx-2030-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      type: 'deposit',
      category: 'FX Exchange',
      title: `FX Exchange ${receivedAmount} ${fromCurrency} → €${amountInEUR.toFixed(2)}`,
      amount: amountInEUR,
      iban: user.iban,
      status: 'Completed',
      reference: `FX-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setTransactions((prev) => [newTx, ...prev]);
    audioEngine.playSuccess();
    addToast(
      language === 'fi' ? `Valuutanvaihto suoritettu!` : `Currency Exchange Complete!`,
      'success'
    );
  };

  return (
    <BankContext.Provider
      value={{
        isAuthenticated,
        userBank,
        user,
        balances,
        transactions,
        language,
        isAudioMuted,
        toasts,
        activeReceipt,
        setActiveReceipt,
        loginUser,
        logoutUser,
        deposit,
        withdraw,
        transferP2P,
        exchangeToEUR,
        toggleLanguage,
        toggleAudio,
        addToast,
      }}
    >
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => useContext(BankContext);
