import React from 'react';
import { useBank } from '../context/BankContext';
import { GlassCard } from './GlassCard';
import { NeonButton } from './NeonButton';
import { Printer, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { formatEUR, formatDateTime } from '../utils/formatters';

export const ReceiptModal = () => {
  const { activeReceipt, setActiveReceipt, userBank, user, language } = useBank();
  const [copied, setCopied] = React.useState(false);

  if (!activeReceipt) return null;

  const receiptText = `
========================================
    OTTO. 2030 SMART BANKING RECEIPT
========================================
Bank: ${userBank.name}
Reference: ${activeReceipt.reference}
Date: ${formatDateTime(activeReceipt.date, language)}
Account Holder: ${user.name}
IBAN: ${user.iban}
Type: ${activeReceipt.category}
Description: ${activeReceipt.title}
Amount: ${formatEUR(activeReceipt.amount)}
Status: ${activeReceipt.status}
Neural Hash: 0x9f4a...2030
========================================
  Thank you for using Suomi 2030 ATM
========================================
  `;

  const handleCopy = () => {
    navigator.clipboard.writeText(receiptText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="max-w-md w-full relative">
        <GlassCard className="border-cyan-500/40 relative">
          <button
            onClick={() => setActiveReceipt(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-heading font-black text-slate-950 text-xl shadow-lg shadow-cyan-500/20">
              {userBank.logoText}
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-cyan-400 font-mono-tech flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'fi' ? 'Suojattu Digitaalinen Kuitti' : 'Verified Cyber Receipt'}
              </div>
              <h3 className="text-lg font-bold text-white">{userBank.name}</h3>
            </div>
          </div>

          {/* Body Details */}
          <div className="space-y-4 font-mono-tech text-sm">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{language === 'fi' ? 'Viitenumero' : 'Reference'}:</span>
              <span className="text-cyan-300 font-semibold">{activeReceipt.reference}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{language === 'fi' ? 'Päivämäärä' : 'Timestamp'}:</span>
              <span className="text-slate-200">{formatDateTime(activeReceipt.date, language)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{language === 'fi' ? 'Maksaja / Omistaja' : 'Account Holder'}:</span>
              <span className="text-slate-200">{user.name}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{language === 'fi' ? 'Tapahtumatyyppi' : 'Category'}:</span>
              <span className="text-slate-200">{activeReceipt.category}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">{language === 'fi' ? 'Kuvaus' : 'Description'}:</span>
              <span className="text-slate-200 font-sans text-xs max-w-[200px] text-right truncate">
                {activeReceipt.title}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex justify-between items-center my-4">
              <span className="text-slate-300 font-bold uppercase">{language === 'fi' ? 'Summa' : 'Total Amount'}:</span>
              <span
                className={`text-xl font-bold font-heading ${
                  activeReceipt.amount >= 0 ? 'text-emerald-400 neon-text-emerald' : 'text-slate-100'
                }`}
              >
                {activeReceipt.amount >= 0 ? '+' : ''}
                {formatEUR(activeReceipt.amount)}
              </span>
            </div>

            <div className="bg-cyan-500/5 p-3 rounded-lg border border-cyan-500/20 text-xs text-slate-400 flex items-center justify-between">
              <span>{language === 'fi' ? 'Kela & Suomi Pankki Varmennettu' : 'Bank of Finland Neural Hash'}</span>
              <span className="text-cyan-400 font-mono">0x9F...2030</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <NeonButton variant="ghost" size="sm" onClick={handleCopy} className="flex-1">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? (language === 'fi' ? 'Kopioitu!' : 'Copied!') : (language === 'fi' ? 'Kopioi Teksti' : 'Copy Text')}
            </NeonButton>
            <NeonButton variant="cyan" size="sm" onClick={handlePrint} className="flex-1">
              <Printer className="w-4 h-4" />
              {language === 'fi' ? 'Tulosta Kuitti' : 'Print Receipt'}
            </NeonButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
