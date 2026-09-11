import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { NeonButton } from '../NeonButton';
import { formatEUR } from '../../utils/formatters';
import { Banknote, ArrowUpRight, CheckCircle2, RefreshCw } from 'lucide-react';

export const CashWithdraw = () => {
  const { withdraw, balances, language } = useBank();
  const [selectedAmount, setSelectedAmount] = useState(40);
  const [customAmount, setCustomAmount] = useState('');
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispensedNotes, setDispensedNotes] = useState(null);

  const presets = [20, 40, 50, 100, 200, 500];

  // Calculate bill denomination breakdown (€50 and €20 notes typical for Finnish Otto. ATMs)
  const calculateNotes = (amount) => {
    let fifties = Math.floor(amount / 50);
    let remainder = amount % 50;

    if (remainder % 20 !== 0 && fifties > 0) {
      fifties -= 1;
      remainder += 50;
    }

    let twenties = Math.floor(remainder / 20);
    let leftOver = remainder % 20;

    return { fifties, twenties, isValid: leftOver === 0 };
  };

  const handleWithdraw = () => {
    const finalAmount = customAmount ? parseInt(customAmount, 10) : selectedAmount;

    if (!finalAmount || finalAmount <= 0) return;

    const breakdown = calculateNotes(finalAmount);
    if (!breakdown.isValid) {
      alert(
        language === 'fi'
          ? 'Otto. ATM voi jakautua vain €20 ja €50 seteleinä'
          : 'Otto. ATM can only dispense in €20 and €50 note denominations'
      );
      return;
    }

    setIsDispensing(true);
    setDispensedNotes(breakdown);

    setTimeout(() => {
      const res = withdraw(finalAmount);
      setIsDispensing(false);
    }, 2000);
  };

  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const currentBreakdown = calculateNotes(currentAmount);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <GlassCard className="border-cyan-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'fi' ? 'Otto. 2030 Käteisnosto Automaatti' : 'Otto. Smart Cash Dispenser'}
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              {language === 'fi'
                ? 'Valitse eurosetelien määrä ja jakelu'
                : 'Select EUR cash preset or custom note distribution'}
            </p>
          </div>
        </div>

        {/* Balance Notice */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center mb-6 font-mono-tech text-xs">
          <span className="text-slate-400">{language === 'fi' ? 'Käyttötilin Saldo' : 'Available Balance'}:</span>
          <span className="text-emerald-400 font-bold font-heading text-sm">
            {formatEUR(balances.checking)}
          </span>
        </div>

        {/* Preset Amounts Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {presets.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                setSelectedAmount(amt);
                setCustomAmount('');
              }}
              className={`p-4 rounded-xl border font-heading text-lg font-bold transition-all cursor-pointer ${
                selectedAmount === amt && !customAmount
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              €{amt}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="mb-6">
          <label className="block text-xs font-mono-tech text-slate-400 mb-2 uppercase">
            {language === 'fi' ? 'Muu Summa (€20 / €50 Jaollinen)' : 'Custom Amount (Multiples of €20 or €50)'}:
          </label>
          <input
            type="number"
            step="10"
            placeholder="e.g. 160"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(0);
            }}
            className="w-full bg-slate-950 border border-cyan-500/30 rounded-xl p-3 text-cyan-300 font-heading font-bold text-xl focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Bill Denomination Preview */}
        {currentAmount > 0 && currentBreakdown.isValid && (
          <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/20 mb-6 font-mono-tech text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>{language === 'fi' ? 'Setelijakautuma' : 'Note Breakdown'}:</span>
              <span className="text-cyan-400 font-bold">
                {currentBreakdown.fifties}x €50 + {currentBreakdown.twenties}x €20
              </span>
            </div>
          </div>
        )}

        {/* Dispenser Physical Slot Animation */}
        {isScanningDispenseAnimation(isDispensing, currentBreakdown, language)}

        {/* Withdraw Action Button */}
        <NeonButton
          variant="cyan"
          size="lg"
          onClick={handleWithdraw}
          disabled={isDispensing || currentAmount <= 0}
          className="w-full"
        >
          {isDispensing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{language === 'fi' ? 'Lasketaan & Luovutetaan Seteleitä...' : 'Dispensing Cash Notes...'}</span>
            </>
          ) : (
            <>
              <ArrowUpRight className="w-5 h-5" />
              <span>{language === 'fi' ? 'NOSTA KÄTEISTÄ' : 'WITHDRAW CASH'}</span>
            </>
          )}
        </NeonButton>
      </GlassCard>
    </div>
  );
};

function isScanningDispenseAnimation(isDispensing, breakdown, language) {
  if (!isDispensing) return null;
  return (
    <div className="mb-6 p-6 rounded-2xl bg-slate-950 border-2 border-cyan-400/60 shadow-[0_0_30px_rgba(0,240,255,0.2)] text-center relative overflow-hidden animate-pulse">
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 animate-laser" />
      <span className="text-xs font-mono-tech text-cyan-300 block mb-2">
        {language === 'fi' ? 'OTTO. AUKKO AUKEMAASSA — NOSTA SETELIT' : 'DISPENSER SLOT OPENING — TAKE CASH'}
      </span>
      <div className="flex justify-center gap-4 text-2xl font-bold font-heading text-emerald-400">
        <span>{breakdown.fifties}x €50 BILLS</span>
        <span>•</span>
        <span>{breakdown.twenties}x €20 BILLS</span>
      </div>
    </div>
  );
}
