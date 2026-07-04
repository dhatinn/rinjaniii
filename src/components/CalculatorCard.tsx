/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  ShieldAlert, 
  Check, 
  HelpCircle, 
  Sparkles, 
  HardHat, 
  Tent, 
  DollarSign, 
  Navigation,
  CheckCircle2,
  Info
} from 'lucide-react';
import { PORTER_PACKAGES, GEAR_RENTAL_ITEMS } from '../data';

interface CalculatorCardProps {
  onInitiateBooking: (bookingDetails: {
    hikersCount: number;
    days: number;
    porterNeeded: boolean;
    guideNeeded: boolean;
    gearRentalNeeded: boolean;
    totalPrice: number;
    selectedGearIds: string[];
  }) => void;
}

export default function CalculatorCard({ onInitiateBooking }: CalculatorCardProps) {
  // Calculator States
  const [hikers, setHikers] = useState<number>(2);
  const [days, setDays] = useState<number>(3);
  
  // Toggles
  const [porterType, setPorterType] = useState<'none' | 'standard' | 'private'>('standard');
  const [guideNeeded, setGuideNeeded] = useState<boolean>(true);
  const [rentGearNeeded, setRentGearNeeded] = useState<boolean>(true);
  const [selectedGear, setSelectedGear] = useState<string[]>(['tent', 'sleeping_bag', 'mattress']);

  // Base Costs
  const BASE_TICKET_PRICE = 150000; // e-Rinjani ticket per person per day
  const LOCAL_TRANSPORT_COST = 200000; // local pickup shuttle cost per group
  const GUIDE_COST_PER_DAY = 350000; // local guide per day

  const [totalCost, setTotalCost] = useState<number>(0);

  // Recalculate price in real-time
  useEffect(() => {
    let price = 0;

    // 1. National Park Entrance Tickets
    price += BASE_TICKET_PRICE * hikers * days;

    // 2. Porter Cost
    if (porterType === 'standard') {
      const activePorter = PORTER_PACKAGES.find(p => p.id === 'porter_standard');
      if (activePorter) {
        // Assume 1 standard porter per 2-3 hikers
        const porterCount = Math.max(1, Math.ceil(hikers / 3));
        price += activePorter.pricePerDay * porterCount * days;
      }
    } else if (porterType === 'private') {
      const activePorter = PORTER_PACKAGES.find(p => p.id === 'porter_private');
      if (activePorter) {
        // 1 private porter per hiker
        price += activePorter.pricePerDay * hikers * days;
      }
    }

    // 3. Local Guide Cost
    if (guideNeeded) {
      // 1 guide is sufficient for up to 5 climbers
      const guideCount = Math.max(1, Math.ceil(hikers / 5));
      price += GUIDE_COST_PER_DAY * guideCount * days;
    }

    // 4. Gear Rentals Cost
    if (rentGearNeeded) {
      selectedGear.forEach(gearId => {
        const item = GEAR_RENTAL_ITEMS.find(g => g.id === gearId);
        if (item) {
          // Some items are shared, like tents. Others are personal, like sleeping bags.
          let multiplier = hikers;
          if (gearId === 'tent' || gearId === 'cooking_set') {
            multiplier = Math.max(1, Math.ceil(hikers / 4)); // 1 tent per 4 people
          }
          price += item.pricePerDay * multiplier * days;
        }
      });
    }

    // 5. Local Transport
    price += LOCAL_TRANSPORT_COST * Math.max(1, Math.ceil(hikers / 6)); // 1 transport shuttle per 6 people

    setTotalCost(price);
  }, [hikers, days, porterType, guideNeeded, rentGearNeeded, selectedGear]);

  const toggleGear = (gearId: string) => {
    if (selectedGear.includes(gearId)) {
      setSelectedGear(selectedGear.filter(id => id !== gearId));
    } else {
      setSelectedGear([...selectedGear, gearId]);
    }
  };

  const handleCheckout = () => {
    onInitiateBooking({
      hikersCount: hikers,
      days: days,
      porterNeeded: porterType !== 'none',
      guideNeeded: guideNeeded,
      gearRentalNeeded: rentGearNeeded,
      totalPrice: totalCost,
      selectedGearIds: selectedGear
    });
  };

  return (
    <div id="calculator" className="w-full flex flex-col gap-6 py-6 scroll-mt-24">
      {/* Promo Banner mirroring the middle card of the screen: "Nikmati Pendakian Tanpa Beban!" */}
      <div className="w-full rounded-3xl p-6 relative overflow-hidden glass-panel flex flex-col items-center text-center justify-center border border-yellow-500/20 shadow-xl">
        {/* Glow backdrop filter */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-yellow-500/10 to-emerald-500/10 mix-blend-color-dodge"></div>
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-slow"></div>

        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-black uppercase tracking-widest border border-yellow-500/20">
            PROMO MINGGU INI
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Nikmati Pendakian Tanpa Beban!
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Semua logistik makanan, tenda hangat, dan jalur perjalanan diatur langsung oleh porter berpengalaman kami. Dapatkan diskon 15% untuk pemesanan minggu ini!
          </p>
          <div className="mt-4">
            <button
              onClick={handleCheckout}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans tracking-tight hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Configurator on Left, Price Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Configurator Side */}
        <div className="lg:col-span-2 rounded-3xl glass-panel p-6 flex flex-col gap-5 text-white">
          <div className="border-b border-white/5 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
              LAYANAN KUSTOMISASI
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white mt-1">
              Atur Rencana Perjalanan Anda
            </h3>
          </div>

          {/* Slider 1: Hikers */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" /> Jumlah Pendaki
              </span>
              <span className="font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                {hikers} Orang
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={hikers}
              onChange={(e) => setHikers(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 px-1">
              <span>1 Orang</span>
              <span>6 Orang</span>
              <span>12 Orang</span>
            </div>
          </div>

          {/* Slider 2: Trekking Days */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-400" /> Durasi Pendakian
              </span>
              <span className="font-mono bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                {days} Hari
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="5"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 rounded-lg bg-white/10 appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 px-1">
              <span>2 Hari (Expres / Rim)</span>
              <span>3 Hari (Standard Summit)</span>
              <span>4+ Hari (Explorer Lake)</span>
            </div>
          </div>

          {/* Service selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4">
            
            {/* 1. Porter Selection */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Layanan Porter
              </span>
              <div className="flex flex-col gap-2">
                <label className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                  porterType === 'standard' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="porterType"
                    checked={porterType === 'standard'}
                    onChange={() => setPorterType('standard')}
                    className="mt-1 accent-emerald-400"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Porter Standar</span>
                    <span className="text-[10px] text-slate-400">Bawa tenda & makan</span>
                  </div>
                </label>

                <label className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                  porterType === 'private' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="porterType"
                    checked={porterType === 'private'}
                    onChange={() => setPorterType('private')}
                    className="mt-1 accent-emerald-400"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Porter Pribadi</span>
                    <span className="text-[10px] text-slate-400">Bawa ransel Anda</span>
                  </div>
                </label>

                <label className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer transition-all ${
                  porterType === 'none' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="porterType"
                    checked={porterType === 'none'}
                    onChange={() => setPorterType('none')}
                    className="mt-1 accent-emerald-400"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Tanpa Porter</span>
                    <span className="text-[10px] text-slate-400">Pikul mandiri</span>
                  </div>
                </label>
              </div>
            </div>

            {/* 2. Guide Selection */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Private Guide
              </span>
              <button
                type="button"
                onClick={() => setGuideNeeded(!guideNeeded)}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer transition-all h-full ${
                  guideNeeded ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <div className={`p-1 rounded-md shrink-0 ${guideNeeded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                  <HardHat className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold">Pemandu Lokal</span>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    Pemandu resmi berlisensi penjelajahan Rinjani demi keamanan.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1.5 font-mono">
                    {guideNeeded ? '✓ Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </button>
            </div>

            {/* 3. Rental Bundle Option */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                Sewa Alat Pendakian
              </span>
              <button
                type="button"
                onClick={() => setRentGearNeeded(!rentGearNeeded)}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 cursor-pointer transition-all h-full ${
                  rentGearNeeded ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <div className={`p-1 rounded-md shrink-0 ${rentGearNeeded ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                  <Tent className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold">Paket Alat Kemah</span>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    Sewa alat kemah premium lengkap (tenda, matras, nesting, sb).
                  </p>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1.5 font-mono">
                    {rentGearNeeded ? '✓ Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Sub Gear Inventory checklist (Visible only if rent gear is enabled) */}
          {rentGearNeeded && (
            <div className="mt-2 p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs font-bold border-b border-white/5 pb-1 text-slate-300">
                <span>Pilih Item Alat yang Disewa:</span>
                <span className="text-[10px] text-slate-400 font-normal">Sewa per malam, otomatis disesuaikan jumlah orang</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {GEAR_RENTAL_ITEMS.map((item) => {
                  const isSelected = selectedGear.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleGear(item.id)}
                      className={`p-2 rounded-xl text-left border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white' 
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className="text-xs font-bold truncate">{item.name}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold shrink-0 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Rp {item.pricePerDay / 1000}k
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pricing Summary Side */}
        <div className="rounded-3xl glass-panel p-6 flex flex-col justify-between text-white border border-emerald-500/10 relative overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>

          <div className="flex flex-col gap-4">
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-extrabold block">
                RINGKASAN BIAYA (ESTIMASI)
              </span>
              <h4 className="text-lg font-black text-white mt-1">Rincian Layanan</h4>
            </div>

            {/* Price Line Items */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Tiket e-Rinjani TNGR</span>
                <span className="font-mono text-slate-100">
                  Rp {(BASE_TICKET_PRICE * hikers * days).toLocaleString('id-ID')}
                </span>
              </div>

              {porterType !== 'none' && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Porter ({porterType === 'standard' ? 'Standar' : 'Pribadi'})</span>
                  <span className="font-mono text-slate-100">
                    Rp {(porterType === 'standard' 
                      ? PORTER_PACKAGES[0].pricePerDay * Math.max(1, Math.ceil(hikers / 3)) * days 
                      : PORTER_PACKAGES[1].pricePerDay * hikers * days
                    ).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {guideNeeded && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Private Guide ({Math.max(1, Math.ceil(hikers / 5))} Pemandu)</span>
                  <span className="font-mono text-slate-100">
                    Rp {(GUIDE_COST_PER_DAY * Math.max(1, Math.ceil(hikers / 5)) * days).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              {rentGearNeeded && selectedGear.length > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span>Sewa Alat Kemah ({selectedGear.length} Item)</span>
                  <span className="font-mono text-slate-100">
                    Rp {(selectedGear.reduce((acc, gearId) => {
                      const item = GEAR_RENTAL_ITEMS.find(g => g.id === gearId);
                      if (item) {
                        let mult = hikers;
                        if (gearId === 'tent' || gearId === 'cooking_set') {
                          mult = Math.max(1, Math.ceil(hikers / 4));
                        }
                        return acc + item.pricePerDay * mult * days;
                      }
                      return acc;
                    }, 0)).toLocaleString('id-ID')}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-300">
                <span>Shuttle Shuttle Transport</span>
                <span className="font-mono text-slate-100">
                  Rp {(LOCAL_TRANSPORT_COST * Math.max(1, Math.ceil(hikers / 6))).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="border-t border-white/5 my-2 pt-2 flex justify-between items-center font-bold text-sm text-yellow-400">
                <span>Diskon Promo 15%</span>
                <span className="font-mono">
                  - Rp {Math.round(totalCost * 0.15).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {/* Total Display */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center flex flex-col gap-1">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-sans">
                TOTAL AKHIR SETELAH DISKON
              </span>
              <div className="text-3xl font-black text-white font-mono flex items-center justify-center gap-1">
                <span className="text-lg font-bold text-emerald-400">Rp</span>
                <span>{Math.round(totalCost * 0.85).toLocaleString('id-ID')}</span>
              </div>
              <span className="text-[9px] text-emerald-400 font-semibold leading-none">
                *Sudah termasuk asuransi pendakian TNGR & asisten darurat
              </span>
            </div>

            {/* Action Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl text-center text-sm font-extrabold bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 transition-all duration-300 cursor-pointer shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Daftar Pendakian Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
