import React, { useState, useEffect } from 'react';
import { useBank, SUPPORTED_BANKS } from '../context/BankContext';
import { ShieldCheck, Volume2, VolumeX, Globe, LogOut, Cpu, Building2 } from 'lucide-react';
import { NeonButton } from './NeonButton';

export const Navbar = () => {
  const {
    isAuthenticated,
    userBank,
    loginUser,
    logoutUser,
    language,
    toggleLanguage,
    isAudioMuted,
    toggleAudio,
    user,
  } = useBank();

  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('fi-FI', {
          timeZone: 'Europe/Helsinki',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' EEST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-40 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-blue-600 p-[2px] shadow-lg shadow-cyan-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-slate-100 to-emerald-400 tracking-wider">
                OTTO. 2030
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono-tech font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-md uppercase">
                Suomi Neural Bank
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono-tech flex items-center gap-1.5">
              <span>Helsinki Node:</span>
              <span className="text-cyan-400 font-semibold">{timeStr}</span>
            </p>
          </div>
        </div>

        {/* Center / Bank Selector & Auth Status */}
        {isAuthenticated && (
          <div className="flex items-center gap-3 bg-slate-900/60 p-1.5 px-3 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono-tech">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-400">{language === 'fi' ? 'Pankki' : 'Bank'}:</span>
              <select
                value={userBank.id}
                onChange={(e) => loginUser(e.target.value)}
                className="bg-slate-950 text-cyan-300 font-bold border border-cyan-500/30 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {SUPPORTED_BANKS.map((b) => (
                  <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono-tech text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TUPAS NEURAL: VERIFIED</span>
            </div>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 font-mono-tech text-xs transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{language === 'fi' ? 'FI 🇫🇮' : 'EN 🇬🇧'}</span>
          </button>

          {/* Logout if authenticated */}
          {isAuthenticated && (
            <NeonButton variant="rose" size="sm" onClick={logoutUser}>
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'fi' ? 'Kirjaudu Ulos' : 'Logout'}</span>
            </NeonButton>
          )}
        </div>
      </div>
    </header>
  );
};
