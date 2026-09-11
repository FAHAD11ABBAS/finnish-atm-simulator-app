import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { NeonButton } from '../NeonButton';
import { formatEUR } from '../../utils/formatters';
import { Wallet, TrendingUp, PiggyBank, Cpu, ArrowUpRight, Zap, Shield, ChevronRight } from 'lucide-react';

export const LiveVault = () => {
  const { balances, user, userBank, language } = useBank();
  const [activeAccount, setActiveAccount] = useState('checking'); // 'checking' | 'savings' | 'eEUR'
  const [stakeAmount, setStakeAmount] = useState(2500);

  // Predictive yield calculation: Compound Interest A = P(1 + r/n)^(nt)
  const calculateYield = (principal, years, rate = 0.042) => {
    return principal * Math.pow(1 + rate, years);
  };

  const yield1Year = calculateYield(stakeAmount, 1);
  const yield5Year = calculateYield(stakeAmount, 5);
  const yield10Year = calculateYield(stakeAmount, 10);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header & Bank Details */}
      <GlassCard className="border-cyan-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-heading font-black text-2xl text-cyan-300">
                {userBank.logoText}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-tech text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{userBank.name} • LIVE VAULT</span>
              </div>
              <h2 className="text-2xl font-black text-white mt-0.5">{user.name}</h2>
              <p className="text-xs font-mono-tech text-slate-400">{user.iban}</p>
            </div>
          </div>

          {/* Quick Account Switcher & Total Net Worth */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30 text-right min-w-[200px]">
              <span className="text-[11px] font-mono-tech uppercase text-slate-400 block">
                {language === 'fi' ? 'Kokinaisvarallisuus' : 'Net Liquidity'}
              </span>
              <span className="text-2xl font-black font-heading text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300 neon-text-cyan">
                {formatEUR(balances.checking + balances.savings + balances.eEUR)}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Account Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Checking Account */}
        <GlassCard
          hoverable
          glowColor={activeAccount === 'checking' ? 'cyan' : 'ghost'}
          className={`cursor-pointer transition-all ${
            activeAccount === 'checking' ? 'border-cyan-400 bg-cyan-500/10' : ''
          }`}
          onClick={() => setActiveAccount('checking')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono-tech uppercase px-2 py-1 rounded bg-slate-800 text-cyan-400">
              {language === 'fi' ? 'Käyttötili' : 'Checking Account'}
            </span>
          </div>
          <span className="text-xs font-mono-tech text-slate-400 block">
            {language === 'fi' ? 'Vapaa Saldo' : 'Available Balance'}
          </span>
          <h3 className="text-3xl font-black font-heading text-white mt-1">
            {formatEUR(balances.checking)}
          </h3>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-tech text-emerald-400">
            <span>SEPA Instant Ready</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </GlassCard>

        {/* 2. Savings Vault */}
        <GlassCard
          hoverable
          glowColor={activeAccount === 'savings' ? 'emerald' : 'ghost'}
          className={`cursor-pointer transition-all ${
            activeAccount === 'savings' ? 'border-emerald-400 bg-emerald-500/10' : ''
          }`}
          onClick={() => setActiveAccount('savings')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <PiggyBank className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono-tech uppercase px-2 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              4.2% APY YIELD
            </span>
          </div>
          <span className="text-xs font-mono-tech text-slate-400 block">
            {language === 'fi' ? 'Säästöholvi (Korkotili)' : 'Savings Vault'}
          </span>
          <h3 className="text-3xl font-black font-heading text-emerald-400 neon-text-emerald mt-1">
            {formatEUR(balances.savings)}
          </h3>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>{language === 'fi' ? 'Kuukausikorko' : 'Monthly Dividend'}: +43.40 €</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
        </GlassCard>

        {/* 3. e-EUR Staking Vault */}
        <GlassCard
          hoverable
          glowColor={activeAccount === 'eEUR' ? 'cyan' : 'ghost'}
          className={`cursor-pointer transition-all ${
            activeAccount === 'eEUR' ? 'border-blue-400 bg-blue-500/10' : ''
          }`}
          onClick={() => setActiveAccount('eEUR')}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono-tech uppercase px-2 py-1 rounded bg-blue-950 text-blue-300 border border-blue-500/30">
              QUANTUM STAKE
            </span>
          </div>
          <span className="text-xs font-mono-tech text-slate-400 block">
            {language === 'fi' ? 'Digitaalinen e-EUR Holvi' : 'e-EUR Quantum Staking'}
          </span>
          <h3 className="text-3xl font-black font-heading text-cyan-300 mt-1">
            {balances.eEUR.toFixed(2)} <span className="text-sm font-sans text-slate-400">e-EUR</span>
          </h3>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono-tech text-cyan-400">
            <span>ECB CBDC Verified</span>
            <Zap className="w-4 h-4" />
          </div>
        </GlassCard>
      </div>

      {/* SVG Interactive Financial Growth & Yield Chart */}
      <GlassCard className="border-cyan-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              {language === 'fi' ? 'Reaaliaikainen Varallisuuden Kehitys 2030' : 'Real-Time Wealth & Yield Forecast'}
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
              {language === 'fi'
                ? 'Tulot vs Menot vs e-EUR Korkokertymä (Suomi Bank Node Analytics)'
                : 'Income vs Expenditure vs e-EUR Interest Dividend (ECB Node Analytics)'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono-tech">
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Saldo
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Yield
            </span>
          </div>
        </div>

        {/* Custom SVG Area Chart */}
        <div className="w-full h-48 sm:h-64 relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

            {/* Cyan Path & Area */}
            <path
              d="M 0,110 Q 75,90 150,105 T 300,55 T 420,40 T 500,20 L 500,150 L 0,150 Z"
              fill="url(#cyanGrad)"
            />
            <path
              d="M 0,110 Q 75,90 150,105 T 300,55 T 420,40 T 500,20"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="3"
            />

            {/* Emerald Path & Area (Yield Forecast) */}
            <path
              d="M 0,130 Q 100,120 200,100 T 350,70 T 500,35 L 500,150 L 0,150 Z"
              fill="url(#emeraldGrad)"
            />
            <path
              d="M 0,130 Q 100,120 200,100 T 350,70 T 500,35"
              fill="none"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />

            {/* Animated Data Points */}
            <circle cx="150" cy="105" r="4" fill="#00F0FF" className="animate-ping" />
            <circle cx="300" cy="55" r="5" fill="#00F0FF" />
            <circle cx="500" cy="20" r="6" fill="#10B981" />
          </svg>
        </div>

        <div className="flex justify-between items-center text-xs font-mono-tech text-slate-500 mt-2">
          <span>Tammi (Jan)</span>
          <span>Maalis (Mar)</span>
          <span>Toukokuu (May)</span>
          <span>Heinä (Jul)</span>
          <span>Syys (Sep)</span>
          <span>Marraskuu (Nov)</span>
        </div>
      </GlassCard>

      {/* 2030 Predictive Yield Estimator Tool */}
      <GlassCard className="border-emerald-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'fi' ? 'e-EUR Älykäs Korkoarvioija (2030 APY)' : 'e-EUR Smart Predictive Yield Calculator'}
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              {language === 'fi'
                ? 'Laske Suomen pankin e-EUR korkokertymä 4.2% APY korolla'
                : 'Project compound interest yield on e-EUR vault holdings'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2 font-mono-tech">
              <span className="text-sm text-slate-300">
                {language === 'fi' ? 'Sijoitettava Pääoma (€)' : 'Deposit Capital (€)'}:
              </span>
              <span className="text-lg font-bold text-emerald-400 font-heading">
                {formatEUR(stakeAmount)}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-center">
              <span className="text-xs font-mono-tech text-slate-400 block mb-1">
                {language === 'fi' ? '1 Vuoden Tuotto' : '1 Year Projected'}
              </span>
              <span className="text-xl font-bold font-heading text-emerald-400">
                {formatEUR(yield1Year)}
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-500/80 block mt-1">
                +{(yield1Year - stakeAmount).toFixed(2)} € (4.2%)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-center bg-emerald-500/5">
              <span className="text-xs font-mono-tech text-slate-400 block mb-1">
                {language === 'fi' ? '5 Vuoden Tuotto' : '5 Years Projected'}
              </span>
              <span className="text-xl font-bold font-heading text-emerald-300">
                {formatEUR(yield5Year)}
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-500/80 block mt-1">
                +{(yield5Year - stakeAmount).toFixed(2)} €
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="text-xs font-mono-tech text-slate-400 block mb-1">
                {language === 'fi' ? '10 Vuoden Tuotto' : '10 Years Projected'}
              </span>
              <span className="text-xl font-bold font-heading text-emerald-400 neon-text-emerald">
                {formatEUR(yield10Year)}
              </span>
              <span className="text-[10px] font-mono-tech text-emerald-400 block mt-1">
                +{(yield10Year - stakeAmount).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
