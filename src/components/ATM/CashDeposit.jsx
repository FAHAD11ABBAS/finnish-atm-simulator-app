import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { NeonButton } from '../NeonButton';
import { formatEUR } from '../../utils/formatters';
import { audioEngine } from '../../utils/audioEngine';
import { ArrowDownLeft, ShieldCheck, RefreshCw, Plus, Trash2 } from 'lucide-react';

export const CashDeposit = () => {
  const { deposit, language } = useBank();
  const [trayNotes, setTrayNotes] = useState({ 10: 0, 20: 0, 50: 0, 100: 0 });
  const [isScanning, setIsScanning] = useState(false);

  const addNote = (val) => {
    setTrayNotes((prev) => ({ ...prev, [val]: prev[val] + 1 }));
    audioEngine.playBeep(800 + val * 2, 0.04);
  };

  const clearTray = () => {
    setTrayNotes({ 10: 0, 20: 0, 50: 0, 100: 0 });
    audioEngine.playBeep(300, 0.05);
  };

  const totalDepositAmount =
    trayNotes[10] * 10 + trayNotes[20] * 20 + trayNotes[50] * 50 + trayNotes[100] * 100;

  const totalNoteCount =
    trayNotes[10] + trayNotes[20] + trayNotes[50] + trayNotes[100];

  const handleExecuteDeposit = () => {
    if (totalDepositAmount <= 0) return;

    setIsScanning(true);
    audioEngine.playScanSweep();

    setTimeout(() => {
      deposit(totalDepositAmount, trayNotes);
      setIsScanning(false);
      setTrayNotes({ 10: 0, 20: 0, 50: 0, 100: 0 });
    }, 2200);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <GlassCard className="border-emerald-500/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === 'fi' ? 'Otto. Käteisen Älykäs Talletus' : 'Otto. Smart Cash Feeder & Deposit'}
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              {language === 'fi'
                ? 'Syötä eurosetelit automatisoituun optiseen lukijaan'
                : 'Feed EUR banknotes into automated optical & UV authenticity scanner'}
            </p>
          </div>
        </div>

        {/* Note Feeder Simulator Tray */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/20 mb-6 text-center relative overflow-hidden">
          {isScanning && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <div className="w-full h-1 bg-emerald-400 animate-laser shadow-[0_0_15px_#10B981]" />
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-3" />
              <span className="text-xs font-mono-tech text-emerald-300 font-bold uppercase">
                {language === 'fi' ? 'Optinen & UV Setelitarkistus Käynnissä...' : 'Scanning UV Security Features...'}
              </span>
            </div>
          )}

          <span className="text-xs font-mono-tech text-slate-400 block mb-3 uppercase">
            {language === 'fi' ? 'Syötetyt Setelit Alustalla' : 'Banknotes in Feeder Tray'}
          </span>

          <div className="flex flex-wrap justify-center gap-3 mb-4 min-h-[60px]">
            {totalNoteCount === 0 ? (
              <span className="text-xs text-slate-600 font-mono-tech self-center">
                {language === 'fi' ? 'Syöttöaukko tyhjä. Klikkaa seteleitä alta.' : 'Tray empty. Click note buttons below to feed cash.'}
              </span>
            ) : (
              Object.entries(trayNotes).map(([val, count]) =>
                count > 0 ? (
                  <div
                    key={val}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-heading font-bold text-sm flex items-center gap-1.5 shadow-md"
                  >
                    <span>{count}x</span>
                    <span>€{val}</span>
                  </div>
                ) : null
              )
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs font-mono-tech">
            <span className="text-slate-400">{language === 'fi' ? 'Yhteensä' : 'Total Deposit'}:</span>
            <span className="text-xl font-bold font-heading text-emerald-400 neon-text-emerald">
              {formatEUR(totalDepositAmount)}
            </span>
          </div>
        </div>

        {/* Add Note Interactive Buttons */}
        <div className="mb-6">
          <label className="block text-xs font-mono-tech text-slate-400 mb-2 uppercase">
            {language === 'fi' ? 'Lisää Seteli Syöttöön' : 'Feed Banknote to Scanner'}:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 50, 100].map((val) => (
              <button
                key={val}
                onClick={() => addNote(val)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-emerald-400 hover:bg-emerald-500/20 text-slate-200 font-heading font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>€{val}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <NeonButton
            variant="ghost"
            size="md"
            onClick={clearTray}
            disabled={isScanning || totalNoteCount === 0}
            className="w-1/3"
          >
            <Trash2 className="w-4 h-4" />
            <span>{language === 'fi' ? 'Tyhjennä' : 'Clear'}</span>
          </NeonButton>

          <NeonButton
            variant="emerald"
            size="lg"
            onClick={handleExecuteDeposit}
            disabled={isScanning || totalDepositAmount <= 0}
            className="w-2/3"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{language === 'fi' ? 'TALLETUS HOLVIIN' : 'DEPOSIT TO VAULT'}</span>
          </NeonButton>
        </div>
      </GlassCard>
    </div>
  );
};
