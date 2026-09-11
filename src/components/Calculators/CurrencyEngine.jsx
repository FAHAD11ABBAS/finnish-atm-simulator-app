import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { NeonButton } from '../NeonButton';
import { CURRENCY_RATES, formatEUR } from '../../utils/formatters';
import { RefreshCw, ArrowRightLeft, ShieldCheck, Globe, DollarSign, TrendingUp } from 'lucide-react';

export const CurrencyEngine = () => {
  const { exchangeToEUR, language } = useBank();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState('100');

  const selectedObj = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES.USD;
  const eurEquivalent = parseFloat(foreignAmount || 0) / selectedObj.rate;

  const handleExecuteFx = () => {
    const amt = parseFloat(foreignAmount);
    if (!amt || amt <= 0) return;
    exchangeToEUR(eurEquivalent, selectedCurrency, amt);
  };

  return (
    <div className="space-y-6">
      <GlassCard className="border-cyan-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'fi' ? 'Valuuttamuunnin & e-EUR Vaihtomoottori' : 'Multi-Currency & e-EUR Exchange Engine'}
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              {language === 'fi'
                ? 'Reaaliaikaiset valuuttakurssit USD, GBP, JPY, SEK, NOK, BTC & ETH'
                : 'Real-time 2030 dynamic FX rate feed and instant conversion to e-EUR Vault'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Rates Feed Table */}
          <div className="lg:col-span-7">
            <h4 className="text-xs font-mono-tech uppercase text-slate-400 mb-3 flex items-center justify-between">
              <span>{language === 'fi' ? 'Suomen Pankin Kurssilista (1 EUR =)' : 'Live ECB FX Rate Matrix (1 EUR =)'}</span>
              <span className="text-cyan-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> LIVE
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-tech">
              {Object.entries(CURRENCY_RATES).map(([curr, data]) => {
                if (curr === 'EUR') return null;
                const isSelected = selectedCurrency === curr;
                return (
                  <div
                    key={curr}
                    onClick={() => setSelectedCurrency(curr)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold font-heading">{curr}</span>
                      <span className="text-xs font-bold text-cyan-400">{data.symbol}</span>
                    </div>
                    <span className="text-sm font-bold block">
                      {data.rate < 0.01 ? data.rate.toFixed(6) : data.rate.toFixed(3)}
                    </span>
                    <span className="text-[9px] text-slate-500 block truncate mt-0.5">{data.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Instant Conversion Box */}
          <div className="lg:col-span-5">
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/30 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
                {language === 'fi' ? 'Vaihda Valuuttaa e-EUR Holviin' : 'Instant Exchange to e-EUR'}
              </h4>

              <div>
                <label className="block text-xs font-mono-tech text-slate-400 mb-1 uppercase">
                  {language === 'fi' ? 'Syötä Valuuttasumma' : 'Foreign Amount'}:
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="any"
                    value={foreignAmount}
                    onChange={(e) => setForeignAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl p-3 text-cyan-300 font-heading font-bold text-lg focus:outline-none"
                  />
                  <div className="px-4 py-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-heading font-bold flex items-center shrink-0">
                    {selectedCurrency}
                  </div>
                </div>
              </div>

              {/* Converted Result Notice */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center font-mono-tech">
                <span className="text-[11px] text-slate-400 block uppercase">
                  {language === 'fi' ? 'Saatu Saldo Euroina (€)' : 'Resulting Balance in EUR (€)'}:
                </span>
                <span className="text-2xl font-black font-heading text-emerald-400 neon-text-emerald">
                  {formatEUR(eurEquivalent)}
                </span>
              </div>

              <NeonButton
                variant="emerald"
                size="lg"
                onClick={handleExecuteFx}
                disabled={!eurEquivalent || eurEquivalent <= 0}
                className="w-full"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>{language === 'fi' ? 'VAIHDA EUROIKSI NOW' : 'EXECUTE FX TO VAULT'}</span>
              </NeonButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
