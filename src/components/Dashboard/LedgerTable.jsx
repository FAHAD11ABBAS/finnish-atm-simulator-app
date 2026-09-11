import React, { useState } from 'react';
import { useBank } from '../../context/BankContext';
import { GlassCard } from '../GlassCard';
import { NeonButton } from '../NeonButton';
import { formatEUR, formatDateTime } from '../../utils/formatters';
import { Search, Filter, FileText, ArrowDownLeft, ArrowUpRight, ShoppingBag, Landmark, Smartphone, Zap } from 'lucide-react';

export const LedgerTable = () => {
  const { transactions, setActiveReceipt, language } = useBank();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.iban && tx.iban.toLowerCase().includes(searchQuery.toLowerCase()));

    if (categoryFilter === 'all') return matchesSearch;
    if (categoryFilter === 'deposit') return matchesSearch && tx.type === 'deposit';
    if (categoryFilter === 'withdrawal') return matchesSearch && tx.type === 'withdrawal';
    if (categoryFilter === 'transfer') return matchesSearch && tx.type === 'transfer';
    return matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Income':
      case 'Yield':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'Shopping':
      case 'Transport':
        return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'MobilePay':
        return <Smartphone className="w-4 h-4 text-cyan-400" />;
      case 'ATM Deposit':
      case 'ATM Withdrawal':
        return <Landmark className="w-4 h-4 text-cyan-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <GlassCard className="border-cyan-500/30">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            {language === 'fi' ? 'Tapahtumahistoria & Kirjanpito' : 'Transaction Ledger & Digital Records'}
          </h3>
          <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
            {language === 'fi'
              ? 'Suomi 2030 Tupas Varmennetut Tilitapahtumat'
              : 'Quantum Encrypted Account Ledger & Exportable Cyber Receipts'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={language === 'fi' ? 'Etsi tapahtumaa...' : 'Search ledger...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono-tech"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            {['all', 'deposit', 'withdrawal', 'transfer'].map((type) => (
              <button
                key={type}
                onClick={() => setCategoryFilter(type)}
                className={`px-2.5 py-1 text-[11px] font-mono-tech rounded-lg uppercase font-semibold transition-all cursor-pointer ${
                  categoryFilter === type
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono-tech uppercase text-slate-400">
              <th className="pb-3 px-3">{language === 'fi' ? 'Pvm & Aika' : 'Date'}</th>
              <th className="pb-3 px-3">{language === 'fi' ? 'Tapahtuma / Saaja' : 'Transaction / Recipient'}</th>
              <th className="pb-3 px-3">{language === 'fi' ? 'Viite & Tyyppi' : 'Ref & Category'}</th>
              <th className="pb-3 px-3 text-right">{language === 'fi' ? 'Summa' : 'Amount'}</th>
              <th className="pb-3 px-3 text-center">{language === 'fi' ? 'Kuitti' : 'Receipt'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs font-mono-tech">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">
                  {language === 'fi' ? 'Ei tapahtumia hakuehdoilla' : 'No transactions matching query'}
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isPositive = tx.amount >= 0;
                return (
                  <tr key={tx.id} className="hover:bg-slate-900/60 transition-colors group">
                    <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                      {formatDateTime(tx.date, language)}
                    </td>

                    <td className="py-3.5 px-3 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                          {getCategoryIcon(tx.category)}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-100">{tx.title}</span>
                          <span className="text-[11px] text-slate-500 font-mono-tech truncate block max-w-[180px]">
                            {tx.iban}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-400">
                      <span className="block text-cyan-400 font-semibold">{tx.reference}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{tx.category}</span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-heading font-bold text-sm whitespace-nowrap">
                      <span className={isPositive ? 'text-emerald-400 neon-text-emerald' : 'text-slate-200'}>
                        {isPositive ? '+' : ''}
                        {formatEUR(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setActiveReceipt(tx)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 text-[11px] transition-all cursor-pointer flex items-center gap-1 mx-auto"
                      >
                        <FileText className="w-3 h-3 text-cyan-400" />
                        <span>{language === 'fi' ? 'Kuitti' : 'Receipt'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
