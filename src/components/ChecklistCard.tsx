/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Briefcase, 
  Layers, 
  Mountain, 
  Users, 
  FileText, 
  UserCheck, 
  HeartPulse, 
  Award, 
  CheckCircle, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { ChecklistItem } from '../types';

interface ChecklistCardProps {
  items: ChecklistItem[];
  onToggleItem: (itemId: string) => void;
}

export default function ChecklistCard({ items, onToggleItem }: ChecklistCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Filter into the two columns mimicking the screenshot layout
  const leftColumnItems = items.filter(item => item.category === 'gear');
  const rightColumnItems = items.filter(item => item.category === 'admin');

  const totalItems = items.length;
  const completedItems = items.filter(i => i.checked).length;
  const progressPercent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Map icon strings to Lucide components
  const getIcon = (id: string) => {
    switch (id) {
      case 'carrier':
        return <Briefcase className="w-5 h-5 text-sky-400" />;
      case 'jaket':
        return <Layers className="w-5 h-5 text-orange-400" />;
      case 'paket_gunung':
        return <Mountain className="w-5 h-5 text-emerald-400" />;
      case 'porter_kama':
        return <Users className="w-5 h-5 text-pink-400" />;
      case 'ktp':
        return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'signup':
        return <UserCheck className="w-5 h-5 text-teal-400" />;
      case 'surat_sehat':
        return <HeartPulse className="w-5 h-5 text-red-400" />;
      case 'kpg':
        return <Award className="w-5 h-5 text-amber-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const cleanLabel = (name: string) => {
    // Simplify for screenshot visual closeness
    if (name.includes('Carrier')) return 'Carrier';
    if (name.includes('Jaket')) return 'Jaket Gunung';
    if (name.includes('Paket')) return 'Paket Gunung';
    if (name.includes('Layanan Porter')) return 'Porter kama';
    if (name.includes('Fotokopi KTP')) return 'Fotokopi KTP';
    if (name.includes('Registrasi Online')) return 'Signup';
    if (name.includes('Surat Keterangan Sehat')) return 'Surat Kesehatan';
    if (name.includes('Permit Pemiar')) return 'Pemiar KPG';
    return name;
  };

  return (
    <div id="checklist" className="w-full flex flex-col gap-5 py-6">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="w-full rounded-3xl glass-panel p-5 flex items-center justify-between gap-4 transition hover:bg-slate-900/90"
      >
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Info Barang Penting & Syarat Wajib
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Persiapan dokumen administrasi dan perlengkapan mendaki Rinjani yang aman.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Persiapan Mendaki</span>
            <div className="text-xs font-black text-white font-mono">{completedItems} dari {totalItems} Selesai</div>
          </div>
          <div className={`rounded-full border-4 border-slate-700 relative flex items-center justify-center w-12 h-12 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column (Equipment / Gear) */}
        <div className="rounded-3xl glass-panel p-5 text-white flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors"></div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400/90 font-mono border-b border-white/5 pb-2">
            Perlengkapan Utama (Gear)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {leftColumnItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`p-3 rounded-2xl text-left border transition-all duration-300 flex items-center gap-3 cursor-pointer select-none group/btn ${
                  item.checked 
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-white' 
                    : 'bg-white/5 border-white/5 hover:border-white/15 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  item.checked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-300'
                }`}>
                  {getIcon(item.id)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate">{cleanLabel(item.name)}</span>
                  <span className="text-[10px] text-slate-400 truncate group-hover/btn:text-slate-300">
                    {item.checked ? '✓ Siap' : 'Belum'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column (Administrative requirements) */}
        <div className="rounded-3xl glass-panel p-5 text-white flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl group-hover:bg-teal-500/10 transition-colors"></div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400/90 font-mono border-b border-white/5 pb-2">
            Persyaratan Wajib (Administrasi)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {rightColumnItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggleItem(item.id)}
                className={`p-3 rounded-2xl text-left border transition-all duration-300 flex items-center gap-3 cursor-pointer select-none group/btn ${
                  item.checked 
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-white' 
                    : 'bg-white/5 border-white/5 hover:border-white/15 text-slate-300 hover:text-white'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  item.checked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-300'
                }`}>
                  {getIcon(item.id)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate">{cleanLabel(item.name)}</span>
                  <span className="text-[10px] text-slate-400 truncate group-hover/btn:text-slate-300">
                    {item.checked ? '✓ Lengkap' : 'Belum Ada'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Checklist Hint/Tip box */}
      <div className="flex items-start gap-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 text-xs text-slate-300">
        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="font-bold text-white">Tips Pendakian Aman:</span> Pastikan semua persyaratan administrasi lengkap sebelum memulai pendakian di gerbang TNGR (Taman Nasional Gunung Rinjani) Sembalun atau Senaru. Surat Keterangan Sehat dan tiket e-Rinjani wajib dicocokkan dengan identitas asli pendaki!
        </div>
      </div>
    </div>
  );
}
