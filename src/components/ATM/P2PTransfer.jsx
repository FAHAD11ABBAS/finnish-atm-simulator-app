import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { NeonButton } from '../NeonButton';
import { validateFinnishIBAN, generateRandomFinnishIBAN } from '../../utils/ibanValidator';
import { formatEUR } from '../../utils/formatters';
import { Send, Smartphone, Landmark, CheckCircle2, AlertCircle, UserCheck } from 'lucide-react';

export const P2PTransfer = () => {
  const { transferP2P, balances, language } = useBank();
  const [transferMode, setTransferMode] = useState('iban'); // 'iban' | 'mobilepay'
  const [recipientIBAN, setRecipientIBAN] = useState('FI12 2020 4455 6677 88');
  const [recipientName, setRecipientName] = useState('Matti Virtanen');
  const [amount, setAmount] = useState('50');
  const [note, setNote] = useState('Lounas & Matka');
  const [isProcessing, setIsProcessing] = useState(false);

  const ibanValidation = validateFinnishIBAN(recipientIBAN);

  const contacts = [
    { name: 'Matti Virtanen', iban: 'FI12 2020 4455 6677 88', phone: '+358 40 987 6543' },
    { name: 'Kaisa Korhonen', iban: 'FI39 3900 1122 3344 55', phone: '+358 50 111 2233' },
    { name: 'S-Ryhmä Bonus Vault', iban: 'FI80 3939 0002 1122 33', phone: '+358 45 555 7788' },
  ];

  const handleSelectContact = (c) => {
    setRecipientName(c.name);
    setRecipientIBAN(c.iban);
  };

  const handleGenerateSampleIBAN = () => {
    const randomIBAN = generateRandomFinnishIBAN('500');
    setRecipientIBAN(randomIBAN);
    setRecipientName('Suomi Testi Vastaanottaja');
  };

  const handleSubmitTransfer = (e) => {
    e.preventDefault();
    const parsedAmt = parseFloat(amount);
    if (!parsedAmt || parsedAmt <= 0) return;

    if (transferMode === 'iban' && !ibanValidation.isValid) {
      alert(ibanValidation.message);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      transferP2P(recipientIBAN, recipientName, parsedAmt, note);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <GlassCard className="border-cyan-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'fi' ? 'Suomi Instant SEPA & MobilePay Siirto' : 'Finnish Instant SEPA & MobilePay P2P'}
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              {language === 'fi'
                ? 'Reaaliaikainen ilmainen siirto kotimaisiin tileihin'
                : 'Real-time zero-fee transfer via Mod-97 validated IBAN or phone number'}
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => setTransferMode('iban')}
            className={`flex-1 py-2 text-xs font-mono-tech font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              transferMode === 'iban'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Finnish IBAN (Mod 97)</span>
          </button>

          <button
            onClick={() => setTransferMode('mobilepay')}
            className={`flex-1 py-2 text-xs font-mono-tech font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              transferMode === 'mobilepay'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>MobilePay Suomi 2030</span>
          </button>
        </div>

        {/* Quick Contact Picker */}
        <div className="mb-6">
          <label className="block text-xs font-mono-tech text-slate-400 mb-2 uppercase">
            {language === 'fi' ? 'Pikavalinta Yhteystiedoista' : 'Quick Contact Preset'}:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {contacts.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectContact(c)}
                className={`p-2.5 rounded-xl border text-left text-xs font-mono-tech transition-all cursor-pointer ${
                  recipientName === c.name
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="font-bold truncate">{c.name}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">{c.iban.slice(0, 10)}...</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmitTransfer} className="space-y-4">
          <div>
            <label className="block text-xs font-mono-tech text-slate-400 mb-1 uppercase">
              {language === 'fi' ? 'Vastaanottajan Nimi' : 'Recipient Name'}:
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-slate-100 font-sans focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono-tech text-slate-400 uppercase">
                {transferMode === 'iban' ? 'Finnish IBAN (FIxx...)' : 'MobilePay Phone Number'}:
              </label>
              {transferMode === 'iban' && (
                <button
                  type="button"
                  onClick={handleGenerateSampleIBAN}
                  className="text-[10px] text-cyan-400 hover:underline font-mono-tech cursor-pointer"
                >
                  {language === 'fi' ? 'Luo Satunnainen IBAN' : 'Generate Valid IBAN'}
                </button>
              )}
            </div>

            <input
              type="text"
              required
              value={recipientIBAN}
              onChange={(e) => setRecipientIBAN(e.target.value)}
              className={`w-full bg-slate-950 border rounded-xl p-3 font-mono-tech font-bold focus:outline-none ${
                ibanValidation.isValid
                  ? 'border-emerald-500/50 text-emerald-300'
                  : 'border-rose-500/50 text-rose-300'
              }`}
            />

            {/* Validation Feedback */}
            {transferMode === 'iban' && (
              <div className="mt-2 text-xs font-mono-tech flex items-center gap-1.5">
                {ibanValidation.isValid ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valid IBAN • {ibanValidation.bankName}</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{ibanValidation.message}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-mono-tech text-slate-400 uppercase">
                {language === 'fi' ? 'Siirrettävä Summa (€)' : 'Transfer Amount (€)'}:
              </label>
              <span className="text-xs font-mono-tech text-slate-400">
                {language === 'fi' ? 'Saldo' : 'Available'}: {formatEUR(balances.checking)}
              </span>
            </div>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-cyan-300 font-heading font-bold text-xl focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-tech text-slate-400 mb-1 uppercase">
              {language === 'fi' ? 'Viesti / Selite' : 'Message / Reference'}:
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 font-sans focus:outline-none focus:border-cyan-400"
            />
          </div>

          <NeonButton
            type="submit"
            variant="cyan"
            size="lg"
            disabled={isProcessing || !ibanValidation.isValid}
            className="w-full mt-4"
          >
            <Send className="w-5 h-5" />
            <span>
              {isProcessing
                ? `${language === 'fi' ? 'Käsitellään SEPA Siirtoa...' : 'Processing Instant SEPA...'}`
                : `${language === 'fi' ? 'LÄHETÄ PIKASIIRTO NOW' : 'EXECUTE INSTANT SEPA TRANSFER'}`}
            </span>
          </NeonButton>
        </form>
      </GlassCard>
    </div>
  );
};
