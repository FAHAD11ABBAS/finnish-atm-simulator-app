import React, { useState, useEffect } from 'react';
import { useBank, SUPPORTED_BANKS } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { NeonButton } from '../NeonButton';
import { audioEngine } from '../../utils/audioEngine';
import { Scan, ShieldCheck, Lock, Smartphone, Fingerprint, Sparkles, CheckCircle2 } from 'lucide-react';

export const BiometricLogin = () => {
  const { loginUser, language, userBank } = useBank();
  const [authMode, setAuthMode] = useState('biometric'); // 'biometric' | 'pin' | 'mobiili'
  const [selectedBank, setSelectedBank] = useState('op');
  
  // Biometric Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  // PIN Keypad State
  const [pin, setPin] = useState('');
  const [scrambledKeys, setScrambledKeys] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);

  useEffect(() => {
    // Scramble keypad numbers to simulate high-security 2030 PIN pad
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    setScrambledKeys(keys.sort(() => Math.random() - 0.5));
  }, []);

  // Trigger Neural Biometric Scan Simulation
  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    audioEngine.playScanSweep();

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setScanProgress(current);
      audioEngine.playBeep(400 + current * 8, 0.03);

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
        audioEngine.playSuccess();

        setTimeout(() => {
          loginUser(selectedBank);
        }, 800);
      }
    }, 180);
  };

  const handleKeyClick = (num) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      audioEngine.playBeep(700 + nextPin.length * 100, 0.04);

      if (nextPin.length === 4) {
        setTimeout(() => {
          loginUser(selectedBank);
        }, 500);
      }
    }
  };

  const handleClearPin = () => {
    setPin('');
    audioEngine.playBeep(300, 0.05);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl w-full">
        <GlassCard className="border-cyan-500/30 relative overflow-hidden">
          {/* Top Title Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono-tech mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TUPAS 2.0 NEURAL BIOMETRIC GATEWAY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-emerald-300">
              {language === 'fi' ? 'Suomi Tunnistautumispalvelu' : 'Finnish BankID Secure Auth'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {language === 'fi'
                ? 'Valitse tunnistautumistapa kela-varmennetusta 2030 neuraportaalista'
                : 'Select authentication method powered by Bank of Finland Security Mesh'}
            </p>
          </div>

          {/* Bank Selector Bar */}
          <div className="mb-8">
            <label className="block text-xs font-mono-tech uppercase text-slate-400 mb-2 text-center">
              {language === 'fi' ? 'Valitse Kotimainen Pankki' : 'Select Finnish Bank Partner'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {SUPPORTED_BANKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBank(b.id);
                    audioEngine.playBeep(900, 0.03);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    selectedBank === b.id
                      ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <span className="font-heading font-black text-sm sm:text-base">{b.logoText}</span>
                  <span className="text-[9px] font-mono-tech truncate max-w-full hidden sm:block mt-0.5">
                    {b.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-slate-800 mb-8">
            <button
              onClick={() => setAuthMode('biometric')}
              className={`flex-1 py-3 text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                authMode === 'biometric'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scan className="w-4 h-4" />
              {language === 'fi' ? '1. Neural Kasvojentunnistus' : '1. Neural Biometric'}
            </button>

            <button
              onClick={() => setAuthMode('pin')}
              className={`flex-1 py-3 text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                authMode === 'pin'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              {language === 'fi' ? '2. Pankki PIN' : '2. Bank PIN Keypad'}
            </button>

            <button
              onClick={() => setAuthMode('mobiili')}
              className={`flex-1 py-3 text-xs sm:text-sm font-mono-tech font-bold flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                authMode === 'mobiili'
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              {language === 'fi' ? '3. Mobiilivarmenne' : '3. Mobile ID'}
            </button>
          </div>

          {/* AUTH CONTENT BODY */}

          {/* 1. BIOMETRIC SCANNER */}
          {authMode === 'biometric' && (
            <div className="flex flex-col items-center py-4">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-cyan-500/40 p-2 flex items-center justify-center bg-slate-950/80 shadow-[0_0_30px_rgba(0,240,255,0.15)] mb-6">
                {/* Rotating HUD Rings */}
                <div className="absolute inset-0 rounded-full border border-cyan-400/30 border-dashed animate-spin" style={{ animationDuration: '12s' }} />
                <div className="absolute inset-2 rounded-full border border-emerald-400/20 border-dotted animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />

                {/* Laser scanline overlay */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
                    <div className="w-full h-1 bg-cyan-400 animate-laser shadow-[0_0_15px_#00F0FF]" />
                  </div>
                )}

                {/* Scan Visual Center */}
                <div className="flex flex-col items-center justify-center text-center p-4">
                  {scanComplete ? (
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                  ) : (
                    <Fingerprint className={`w-16 h-16 ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
                  )}

                  <span className="text-xs font-mono-tech mt-3 text-cyan-300">
                    {isScanning
                      ? `${language === 'fi' ? 'Skannataan Iristä & Neurafoliota...' : 'Scanning Iris Neural Map...'}`
                      : scanComplete
                      ? `${language === 'fi' ? 'Tunnistettu: Fahad Abbas' : 'Verified: Fahad Abbas'}`
                      : `${language === 'fi' ? 'Aseta Kasvot Kameraan' : 'Position Face in Matrix'}`}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {isScanning && (
                <div className="w-full max-w-md bg-slate-900 rounded-full h-2 overflow-hidden border border-cyan-500/30 mb-6">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              )}

              <NeonButton
                variant={scanComplete ? 'emerald' : 'cyan'}
                size="lg"
                onClick={handleStartScan}
                disabled={isScanning}
                className="w-full max-w-md"
              >
                <Sparkles className="w-5 h-5" />
                {isScanning
                  ? `${language === 'fi' ? 'Tunnistetaan...' : 'Verifying Matrix...'}`
                  : `${language === 'fi' ? 'KÄYNNISTÄ NEURAALISKANNAUS' : 'START NEURAL BIOMETRIC SCAN'}`}
              </NeonButton>
            </div>
          )}

          {/* 2. BANK PIN KEYPAD */}
          {authMode === 'pin' && (
            <div className="flex flex-col items-center py-4">
              {/* PIN Display Dots */}
              <div className="flex gap-4 mb-6">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-12 rounded-xl border flex items-center justify-center text-xl font-bold font-mono transition-all ${
                      pin.length > idx
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}
                  >
                    {pin.length > idx ? '●' : ''}
                  </div>
                ))}
              </div>

              {/* Scrambled Security Keypad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-6">
                {scrambledKeys.map((num) => (
                  <button
                    key={num}
                    onClick={() => handleKeyClick(num.toString())}
                    className="h-12 rounded-xl bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-500/20 text-slate-100 font-heading text-lg font-bold transition-all active:scale-95 cursor-pointer shadow-md"
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 w-full max-w-xs">
                <NeonButton variant="ghost" size="sm" onClick={handleClearPin} className="w-full">
                  {language === 'fi' ? 'Tyhjennä' : 'Clear PIN'}
                </NeonButton>
              </div>
            </div>
          )}

          {/* 3. MOBIILIVARMENNE */}
          {authMode === 'mobiili' && (
            <div className="flex flex-col items-center py-6 max-w-md mx-auto text-center">
              <Smartphone className="w-16 h-16 text-cyan-400 mb-4 animate-bounce" />
              <h3 className="text-lg font-bold text-white mb-2">
                {language === 'fi' ? 'Syötä Puhelinnumero & HETU' : 'Enter Finnish Mobile ID'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                {language === 'fi'
                  ? 'Lähetämme kuusinumeroisen turvakoodin Telia/Elisa 6G verkkoosi'
                  : 'Encrypted push notification will be sent to your Suomi SIM card'}
              </p>

              <div className="w-full space-y-4 mb-6">
                <input
                  type="text"
                  readOnly
                  value="+358 40 123 4567 (FAHAD ABBAS)"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono-tech text-center font-bold focus:outline-none"
                />
                <input
                  type="text"
                  readOnly
                  value="HETU: 110898-999X"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 font-mono-tech text-center font-bold focus:outline-none"
                />
              </div>

              <NeonButton variant="emerald" size="lg" onClick={() => loginUser(selectedBank)} className="w-full">
                <ShieldCheck className="w-5 h-5" />
                {language === 'fi' ? 'LÄHETÄ VAHVISTUSPYYNTÖ' : 'SEND MOBILE ID AUTH PUSH'}
              </NeonButton>
            </div>
          )}

          {/* Security Log Ticker at bottom */}
          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tech text-slate-500">
            <span>TLS 1.4 QUANTUM ENCRYPTED</span>
            <span className="text-cyan-500/80">SUOMI FINLAND NODE 09</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
