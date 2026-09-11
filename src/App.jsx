import React, { useState } from 'react';
import { BankProvider, useBank } from './context/BankContext';
import { NeuralBackground } from './components/NeuralBackground';
import { Navbar } from './components/Navbar';
import { ToastFeed } from './components/Toast';
import { ReceiptModal } from './components/ReceiptModal';
import { BiometricLogin } from './components/Auth/BiometricLogin';
import { LiveVault } from './components/Dashboard/LiveVault';
import { LedgerTable } from './components/Dashboard/LedgerTable';
import { ATMTerminal } from './components/ATM/ATMTerminal';
import { LoanEstimator } from './components/Calculators/LoanEstimator';
import { CurrencyEngine } from './components/Calculators/CurrencyEngine';
import { Wallet, Landmark, Calculator, Cpu, ShieldCheck } from 'lucide-react';

const MainAppContent = () => {
  const { isAuthenticated, language } = useBank();
  const [activeModule, setActiveModule] = useState('dashboard'); // 'dashboard' | 'atm' | 'calculators'

  return (
    <div className="relative min-h-screen flex flex-col z-10 selection:bg-cyan-500 selection:text-black pb-16">
      <NeuralBackground />
      <Navbar />
      <ToastFeed />
      <ReceiptModal />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!isAuthenticated ? (
          <BiometricLogin />
        ) : (
          <div className="space-y-6">
            {/* Navigation Module Hub Bar */}
            <div className="flex justify-center">
              <div className="bg-slate-950/90 p-1.5 rounded-2xl border border-cyan-500/30 backdrop-blur-xl flex flex-wrap gap-2 max-w-2xl w-full shadow-2xl">
                <button
                  onClick={() => setActiveModule('dashboard')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeModule === 'dashboard'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span>{language === 'fi' ? 'Holvi & Kirjanpito' : 'Live Vault & Ledger'}</span>
                </button>

                <button
                  onClick={() => setActiveModule('atm')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeModule === 'atm'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Landmark className="w-4 h-4" />
                  <span>{language === 'fi' ? 'Otto. 2030 Automaatti' : 'Otto. ATM Terminal'}</span>
                </button>

                <button
                  onClick={() => setActiveModule('calculators')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeModule === 'calculators'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>{language === 'fi' ? 'AI Laskurit & FX' : 'AI Calculators & FX'}</span>
                </button>
              </div>
            </div>

            {/* Active Module View Render */}
            {activeModule === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                <LiveVault />
                <LedgerTable />
              </div>
            )}

            {activeModule === 'atm' && (
              <div className="animate-fade-in">
                <ATMTerminal />
              </div>
            )}

            {activeModule === 'calculators' && (
              <div className="space-y-6 animate-fade-in">
                <LoanEstimator />
                <CurrencyEngine />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Futuristic Portfolio Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs font-mono-tech text-slate-500 relative z-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>WP25K Vocational Graduation Portfolio</span>
          </div>
          <div>
            <span>Finnish ATM & Smart Banking Simulator (2030 Futuristic Edition)</span>
          </div>
          <div>
            <span className="text-slate-400">Developer: </span>
            <a
              href="https://github.com/FAHAD11ABBAS"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              FAHAD11ABBAS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <BankProvider>
      <MainAppContent />
    </BankProvider>
  );
}
