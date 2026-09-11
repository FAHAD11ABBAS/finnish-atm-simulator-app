import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { calculateLoanDetails, formatEUR } from '../../utils/formatters';
import { Calculator, Sparkles, ShieldCheck, AlertCircle, TrendingUp, DollarSign } from 'lucide-react';

export const LoanEstimator = () => {
  const { language } = useBank();
  const [principal, setPrincipal] = useState(25000);
  const [months, setMonths] = useState(36);
  const [interestRate, setInterestRate] = useState(4.8); // Euribor 3.5% + 1.3% margin

  const loanDetails = calculateLoanDetails(principal, months, interestRate);

  return (
    <div className="space-y-6">
      <GlassCard className="border-cyan-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'fi' ? 'AI Laina-Laskuri & Euribor Arvio' : 'AI Loan Interest & Euribor Estimator'}
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              {language === 'fi'
                ? 'Laske kuukausierät, Euribor-marginaali ja tekoälyn luottoluokitus'
                : 'Interactive loan amortization estimator with real-time AI risk evaluation'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Principal Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 font-mono-tech">
                <span className="text-xs text-slate-300 uppercase">
                  {language === 'fi' ? 'Lainasumma (€)' : 'Loan Principal (€)'}:
                </span>
                <span className="text-xl font-bold text-cyan-400 font-heading">
                  {formatEUR(principal)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 mt-1">
                <span>€1,000</span>
                <span>€50,000</span>
                <span>€100,000</span>
              </div>
            </div>

            {/* 2. Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 font-mono-tech">
                <span className="text-xs text-slate-300 uppercase">
                  {language === 'fi' ? 'Laina-aika (Kuukautta)' : 'Loan Duration (Months)'}:
                </span>
                <span className="text-xl font-bold text-cyan-400 font-heading">
                  {months} {language === 'fi' ? 'kk' : 'months'} ({ (months/12).toFixed(1) } yrs)
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="120"
                step="6"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 mt-1">
                <span>6 {language === 'fi' ? 'kk' : 'mos'}</span>
                <span>60 {language === 'fi' ? 'kk' : 'mos'} (5y)</span>
                <span>120 {language === 'fi' ? 'kk' : 'mos'} (10y)</span>
              </div>
            </div>

            {/* 3. Interest Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-2 font-mono-tech">
                <span className="text-xs text-slate-300 uppercase">
                  {language === 'fi' ? 'Korkoprosentti (Euribor 3M + Marginaali)' : 'Interest Rate (Euribor 3M + Margin)'}:
                </span>
                <span className="text-xl font-bold text-cyan-400 font-heading">
                  {interestRate.toFixed(2)} %
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400 border border-slate-800"
              />
              <div className="flex justify-between text-[10px] font-mono-tech text-slate-500 mt-1">
                <span>1.0%</span>
                <span>6.0%</span>
                <span>12.0%</span>
              </div>
            </div>
          </div>

          {/* Right Summary & AI Risk Rating */}
          <div className="lg:col-span-5 space-y-4">
            {/* Monthly Repayment Big Box */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-center shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <span className="text-xs font-mono-tech uppercase text-slate-400 block mb-1">
                {language === 'fi' ? 'Arvioitu Kuukausierä' : 'Estimated Monthly Payment'}
              </span>
              <h4 className="text-3xl font-black font-heading text-cyan-300 neon-text-cyan">
                {formatEUR(loanDetails.monthlyPayment)}
                <span className="text-sm font-sans text-slate-400">/{language === 'fi' ? 'kk' : 'mo'}</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono-tech text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {language === 'fi' ? 'Korkokulut Yhteensä' : 'Total Interest'}
                </span>
                <span className="text-base font-bold text-amber-400">
                  {formatEUR(loanDetails.totalInterest)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {language === 'fi' ? 'Takaisinmaksu' : 'Total Repayment'}
                </span>
                <span className="text-base font-bold text-slate-200">
                  {formatEUR(loanDetails.totalPayment)}
                </span>
              </div>
            </div>

            {/* AI Risk Score Gauge */}
            <div className={`p-4 rounded-xl border font-mono-tech text-xs ${loanDetails.riskColor}`}>
              <div className="flex items-center gap-2 mb-1.5 font-bold uppercase">
                <Sparkles className="w-4 h-4" />
                <span>AI SUOMI RISK RATING: {loanDetails.riskScore}</span>
              </div>
              <p className="text-[11px] leading-snug opacity-90">{loanDetails.riskDescription}</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
