/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, HelpCircle, HardHat, Tent, FileText, Check, AlertCircle } from 'lucide-react';
import { ClimbingPlan } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: Omit<ClimbingPlan, 'id' | 'createdAt' | 'status'>) => void;
  initialDate?: string;
  initialDetails?: {
    hikersCount: number;
    days: number;
    porterNeeded: boolean;
    guideNeeded: boolean;
    gearRentalNeeded: boolean;
    totalPrice: number;
  };
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onSubmit,
  initialDate = '',
  initialDetails
}: RegistrationModalProps) {
  // Form Fields
  const [hikerName, setHikerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [hikersCount, setHikersCount] = useState(2);
  const [days, setDays] = useState(3);
  
  // Services
  const [porterNeeded, setPorterNeeded] = useState(true);
  const [guideNeeded, setGuideNeeded] = useState(true);
  const [gearRentalNeeded, setGearRentalNeeded] = useState(true);

  // Price Calculation constants
  const BASE_TICKET_PRICE = 150000;
  const LOCAL_TRANSPORT_COST = 200000;
  const GUIDE_COST_PER_DAY = 350000;
  const STANDARD_PORTER_PER_DAY = 250000;
  const ESTIMATED_GEAR_RENTAL_PER_DAY = 75000; // estimated pack bundle

  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync inputs with incoming props when modal opens or updates
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      if (initialDate) {
        setDate(initialDate);
      } else {
        // Default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setDate(tomorrow.toISOString().split('T')[0]);
      }

      if (initialDetails) {
        setHikersCount(initialDetails.hikersCount);
        setDays(initialDetails.days);
        setPorterNeeded(initialDetails.porterNeeded);
        setGuideNeeded(initialDetails.guideNeeded);
        setGearRentalNeeded(initialDetails.gearRentalNeeded);
      }
    }
  }, [isOpen, initialDate, initialDetails]);

  // Recalculate price in modal form dynamically
  useEffect(() => {
    let price = 0;
    // Tickets
    price += BASE_TICKET_PRICE * hikersCount * days;
    // Porter
    if (porterNeeded) {
      const porterCount = Math.max(1, Math.ceil(hikersCount / 3));
      price += STANDARD_PORTER_PER_DAY * porterCount * days;
    }
    // Guide
    if (guideNeeded) {
      const guideCount = Math.max(1, Math.ceil(hikersCount / 5));
      price += GUIDE_COST_PER_DAY * guideCount * days;
    }
    // Gear rental
    if (gearRentalNeeded) {
      price += ESTIMATED_GEAR_RENTAL_PER_DAY * hikersCount * days;
    }
    // Transport
    price += LOCAL_TRANSPORT_COST * Math.max(1, Math.ceil(hikersCount / 6));

    // Promo Discount 15%
    setTotalPrice(Math.round(price * 0.85));
  }, [hikersCount, days, porterNeeded, guideNeeded, gearRentalNeeded]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!hikerName.trim()) {
      setErrorMsg('Nama pendaki wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Alamat email tidak valid.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Nomor telepon/WhatsApp wajib diisi.');
      return;
    }
    if (!date) {
      setErrorMsg('Pilih tanggal pendakian.');
      return;
    }

    onSubmit({
      date,
      hikerName,
      email,
      phone,
      hikersCount,
      days,
      porterNeeded,
      guideNeeded,
      gearRentalNeeded,
      totalPrice
    });

    // Reset Form
    setHikerName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-3xl glass-panel p-6 text-white max-h-[90vh] overflow-y-auto border border-emerald-500/20 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white">Formulir Booking Pendakian</h3>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gunung Rinjani, Lombok</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Section 1: Hiker Profile */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest border-b border-white/5 pb-1">
              Data Kontak Utama
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-bold">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={hikerName}
                  onChange={(e) => setHikerName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-sm glass-input font-medium"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-bold">WhatsApp / Telp</label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="px-3.5 py-2 rounded-xl text-sm glass-input font-mono"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-300 font-bold">Alamat Email</label>
              <input
                type="email"
                placeholder="Contoh: budi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-sm glass-input font-medium"
                required
              />
            </div>
          </div>

          {/* Section 2: Hiking Schedule parameters */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-widest border-b border-white/5 pb-1">
              Jadwal & Konfigurasi Tim
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-bold">Tanggal Mulai</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs glass-input font-mono font-bold"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-bold">Jumlah Anggota</label>
                <select
                  value={hikersCount}
                  onChange={(e) => setHikersCount(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl text-xs glass-input font-bold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n} className="bg-slate-900 text-white">{n} Orang</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-slate-300 font-bold">Durasi Pendakian</label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl text-xs glass-input font-bold"
                >
                  {[2, 3, 4, 5].map(n => (
                    <option key={n} value={n} className="bg-slate-900 text-white">{n} Hari</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Extra Services */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest border-b border-white/5 pb-1">
              Tambahan Layanan Pendukung
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPorterNeeded(!porterNeeded)}
                className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  porterNeeded ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-bold">Porter</span>
              </button>

              <button
                type="button"
                onClick={() => setGuideNeeded(!guideNeeded)}
                className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  guideNeeded ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <HardHat className="w-4 h-4" />
                <span className="text-[10px] font-bold">Private Guide</span>
              </button>

              <button
                type="button"
                onClick={() => setGearRentalNeeded(!gearRentalNeeded)}
                className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  gearRentalNeeded ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <Tent className="w-4 h-4" />
                <span className="text-[10px] font-bold">Alat Kemah</span>
              </button>
            </div>
          </div>

          {/* Checkout pricing sum */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between mt-1">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Estimasi Total Biaya</span>
              <span className="text-xs text-slate-300">Termasuk Diskon 15%</span>
            </div>
            <div className="text-xl font-black font-mono text-emerald-400 flex items-baseline gap-0.5">
              <span className="text-xs font-bold">Rp</span>
              <span>{totalPrice.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 border-t border-white/10 pt-4 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-center text-xs font-bold border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-center text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3px]" />
              <span>Konfirmasi Booking</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
