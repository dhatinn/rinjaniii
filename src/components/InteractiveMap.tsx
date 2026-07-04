/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CHECKPOINTS } from '../data';
import { Checkpoint } from '../types';
import { MapPin, ArrowRight, Eye, Droplet, Tent, Info, Compass, HelpCircle } from 'lucide-react';

interface InteractiveMapProps {
  onAddPlanWithStartPoint: (posName: string) => void;
}

export default function InteractiveMap({ onAddPlanWithStartPoint }: InteractiveMapProps) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<Checkpoint>(CHECKPOINTS[0]); // Default to Basecamp Sembalun
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectCheckpoint = (cp: Checkpoint) => {
    setSelectedCheckpoint(cp);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Mudah':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Sedang':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'Tantangan':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Ekstrim':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div id="map-section" className="w-full flex flex-col gap-5 py-6 scroll-mt-24">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          Map Pendakian Interaktif
        </h2>
        <p className="text-sm text-slate-300 mt-1">
          Klik checkpoint atau foto pos di bawah untuk melihat detail ketinggian, medan, dan ketersediaan air.
        </p>
      </div>

      {/* Main Grid: Interactive Map Frame on Left, Active Checkpoint Info on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Topographical Map Frame */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden glass-panel border border-white/10 relative min-h-[380px] md:min-h-[440px] flex flex-col justify-between p-4 pb-24 group/map">
          
          {/* Subtle Topo Grid Background Line Effects */}
          <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
                </pattern>
                <radialGradient id="mountainGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(16, 185, 129, 0.3)" />
                  <stop offset="50%" stopColor="rgba(14, 116, 144, 0.15)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {/* Radial mountain circles representing topography lines */}
              <circle cx="85%" cy="20%" r="180" fill="url(#mountainGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="85%" cy="20%" r="140" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <circle cx="85%" cy="20%" r="105" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="85%" cy="20%" r="70" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle cx="85%" cy="20%" r="35" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </svg>
          </div>

          {/* Map Overlay Badge */}
          <div className="relative z-10 self-start px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-slate-300 font-mono flex items-center gap-1.5 uppercase">
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>PETA KETINGGIAN TOPO RINJANI</span>
          </div>

          {/* SVG Trails & Checkpoint Pins Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              
              {/* Hiking Trails (Polyline) linking Pos 1 -> Pos 2 -> Pos 3 -> Summit */}
              {/* Draw animated gradient path */}
              <defs>
                <linearGradient id="trailGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Main Trail Path */}
              <path
                d="M 18 72 C 30 70, 38 68, 48 64 C 55 60, 58 50, 62 42 C 72 32, 78 24, 84 18"
                fill="none"
                stroke="url(#trailGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="stroke-emerald-400/80 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              />

              {/* Dynamic glowing dash running on path */}
              <path
                d="M 18 72 C 30 70, 38 68, 48 64 C 55 60, 58 50, 62 42 C 72 32, 78 24, 84 18"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray="4, 20"
                className="animate-[dash_4s_linear_infinite]"
                style={{
                  strokeDashoffset: 100,
                  animation: 'dash 15s linear infinite'
                }}
              />
            </svg>

            {/* Checkpoint Pins mapped dynamically */}
            {CHECKPOINTS.map((cp) => {
              const isSelected = selectedCheckpoint.id === cp.id;
              return (
                <button
                  key={cp.id}
                  onClick={() => selectCheckpoint(cp)}
                  style={{ left: `${cp.x}%`, top: `${cp.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin transition-all duration-300 cursor-pointer focus:outline-none"
                >
                  {/* Outer Pulsing Aura */}
                  <span className={`absolute -inset-2.5 rounded-full transition-all duration-300 ${
                    isSelected ? 'bg-emerald-400/30 scale-125 animate-ping' : 'bg-transparent group-hover/pin:bg-white/10'
                  }`}></span>

                  {/* Pin Circle */}
                  <div className={`h-8 px-2 rounded-full border flex items-center justify-center gap-1 shadow-lg transition-all duration-300 ${
                    isSelected 
                      ? 'bg-emerald-500 border-white text-slate-900 scale-110 font-bold' 
                      : 'bg-slate-950/80 border-emerald-500/50 text-slate-200 hover:border-white'
                  }`}>
                    <MapPin className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-900' : 'text-emerald-400'}`} />
                    <span className="text-[9px] whitespace-nowrap font-sans font-black tracking-tight uppercase pr-0.5">
                      {cp.id === 'summit' ? 'Puncak' : cp.name.split(' (')[0]}
                    </span>
                  </div>

                  {/* Coordinate Marker Line */}
                  <span className={`absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gradient-to-b ${
                    isSelected ? 'from-emerald-400 to-transparent' : 'from-transparent'
                  }`}></span>
                </button>
              );
            })}
          </div>

          {/* Space filler / Flex spacer */}
          <div className="flex-1"></div>
        </div>

        {/* Bottom Viewpoint Photo Thumbnails matching screenshot exactly */}
        <div className="relative z-10 w-full mt-6">
            <div className="glass-panel p-2.5 rounded-2xl flex gap-3 overflow-x-auto border border-white/5 scrollbar-thin">
              {CHECKPOINTS.slice(0, 4).map((cp) => {
                const isSelected = selectedCheckpoint.id === cp.id;
                return (
                  <button
                    key={cp.id}
                    onClick={() => selectCheckpoint(cp)}
                    className={`flex-1 min-w-[95px] relative rounded-xl overflow-hidden aspect-[4/3] border transition-all duration-300 group/thumb cursor-pointer ${
                      isSelected 
                        ? 'border-emerald-400 scale-[1.03] shadow-lg shadow-emerald-500/15 z-10' 
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <img 
                      src={cp.photoUrl} 
                      alt={cp.name} 
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1.5">
                      <span className="text-[10px] font-black text-white font-sans uppercase tracking-tight truncate w-full block text-left">
                        {cp.id === 'basecamp'
                          ? 'Basecamp'
                          : cp.id === 'pos1'
                          ? 'Pos 1'
                          : cp.id === 'pos2'
                          ? 'Pos 2'
                          : cp.id === 'pos3'
                          ? 'Pos 3'
                          : cp.name}
                      </span>
                    </div>

                    {/* Check badge overlay */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 p-0.5 rounded-md bg-emerald-500 text-slate-900">
                        <Eye className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Extra Thumbnail for Summit just to offer high value interaction */}
              <button
                onClick={() => selectCheckpoint(CHECKPOINTS[4])}
                className={`flex-1 min-w-[95px] relative rounded-xl overflow-hidden aspect-[4/3] border transition-all duration-300 group/thumb cursor-pointer ${
                  selectedCheckpoint.id === 'summit' 
                    ? 'border-emerald-400 scale-[1.03] shadow-lg shadow-emerald-500/15 z-10' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <img 
                  src={CHECKPOINTS[4].photoUrl} 
                  alt={CHECKPOINTS[4].name} 
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] font-black text-white font-sans uppercase tracking-tight truncate w-full block text-left">
                    Puncak 3726m
                  </span>
                </div>
                {selectedCheckpoint.id === 'summit' && (
                  <div className="absolute top-1 right-1 p-0.5 rounded-md bg-emerald-500 text-slate-900">
                    <Eye className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Checkpoint Detail Pane */}
        <div className="rounded-3xl glass-panel p-6 flex flex-col justify-between text-white border border-white/5 relative overflow-hidden animate-in fade-in duration-300">
          
          <div className="flex flex-col gap-4">
            
            {/* Image Preview of Current Checkpoint */}
            <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden relative border border-white/5">
              <img 
                src={selectedCheckpoint.photoUrl} 
                alt={selectedCheckpoint.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              
              {/* Floating attributes */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono font-bold">POS ELEVASI</span>
                  <span className="text-xl font-black font-mono tracking-tight text-white">{selectedCheckpoint.elevation}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-mono font-bold">ESTIMASI JALUR</span>
                  <span className="text-xs font-bold bg-slate-900/60 border border-white/10 px-2 py-0.5 rounded-lg text-white font-mono">
                    {selectedCheckpoint.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkpoint Main Title & Difficulty */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight text-white truncate max-w-[170px]">
                  {selectedCheckpoint.name}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border font-sans ${getDifficultyColor(selectedCheckpoint.difficulty)}`}>
                  Medan: {selectedCheckpoint.difficulty}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedCheckpoint.description}
              </p>
            </div>

            {/* Map Facilities Metrics */}
            <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedCheckpoint.waterSource ? 'bg-sky-500/15 text-sky-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Droplet className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Sumber Air</span>
                  <span className="text-xs font-black">{selectedCheckpoint.waterSource ? 'Tersedia' : 'Tidak Ada'}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedCheckpoint.campSite ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Tent className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Area Camp</span>
                  <span className="text-xs font-black">{selectedCheckpoint.campSite ? 'Cocok' : 'Area Istirahat'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {/* Fast book plan with this checkpoint as core goal */}
            <button
              onClick={() => onAddPlanWithStartPoint(selectedCheckpoint.name)}
              className="w-full py-3 rounded-xl text-center text-xs font-bold bg-white/5 border border-white/10 text-slate-200 hover:bg-emerald-500 hover:text-slate-900 hover:border-emerald-500 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Jadwalkan Target Ke {selectedCheckpoint.id === 'summit' ? 'Puncak' : selectedCheckpoint.name.split(' (')[0]}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Styled inline keyframe definition using Tailwind arbitrary content */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
