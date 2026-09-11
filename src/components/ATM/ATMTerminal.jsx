import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { CashWithdraw } from './CashWithdraw';
import { CashDeposit } from './CashDeposit';
import { P2PTransfer } from './P2PTransfer';
import { Banknote, ArrowDownLeft, Send, ShieldCheck, Cpu } from 'lucide-react';

export const ATMTerminal = () => {
  const { language } = useBank();
  const [activeTab, setActiveTab] = useState('withdraw'); // 'withdraw' | 'deposit' | 'transfer'

  return (
    <div className="space-y-6">
      {/* Otto. 2030 Smart ATM Header Banner */}
      <GlassCard className="border-cyan-500/40 text-center py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-mono-tech text-xs text-cyan-400/60 flex items-center gap-1">
          <Cpu className="w-4 h-4 animate-spin" />
          <span>OTTO. 2030 TERMINAL #7742</span>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-tech mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>FINNISH BANKING INFRASTRUCTURE 2030</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-emerald-300">
          {language === 'fi' ? 'Otto. Älykäs Pankkiautomaatti' : 'Otto. Futuristic ATM Terminal'}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-lg mx-auto">
          {language === 'fi'
            ? 'Käteisnostot, automaattiset talletukset ja P2P pikasiirrot Suomen verkossa'
            : 'Core banking operations: Cash withdrawal, note feeder deposit, and instant P2P transfers'}
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mt-8 max-w-lg mx-auto bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'withdraw'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>{language === 'fi' ? 'Käteisnosto' : 'Withdraw'}</span>
          </button>

          <button
            onClick={() => setActiveTab('deposit')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'deposit'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{language === 'fi' ? 'Talletus' : 'Deposit'}</span>
          </button>

          <button
            onClick={() => setActiveTab('transfer')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'transfer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{language === 'fi' ? 'Pikasiirto' : 'Transfer'}</span>
          </button>
        </div>
      </GlassCard>

      {/* Render Active Operation Module */}
      {activeTab === 'withdraw' && <CashWithdraw />}
      {activeTab === 'deposit' && <CashDeposit />}
      {activeTab === 'transfer' && <P2PTransfer />}
    </div>
  );
};
