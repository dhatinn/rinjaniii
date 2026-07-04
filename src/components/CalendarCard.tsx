/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { ClimbingPlan } from '../types';

interface CalendarCardProps {
  plans: ClimbingPlan[];
  bookedDates: Record<string, boolean>;
  onSelectDate: (date: string) => void;
  onAddEventClick: (date: string) => void;
}

export default function CalendarCard({ plans, bookedDates, onSelectDate, onAddEventClick }: CalendarCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date()); // Year-Month-Day
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('monthly');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sunday to Saturday (Aksara/Singkatan)

  // Get total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const DAILY_QUOTA = 15;

  const getFormattedDateStr = (dayNum: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const getDayStats = (dayNum: number) => {
    const dateStr = getFormattedDateStr(dayNum);
    const plansForDay = plans.filter(p => p.date === dateStr);
    const totalHikers = plansForDay.reduce((sum, plan) => sum + plan.hikersCount, 0);
    const available = Math.max(0, DAILY_QUOTA - totalHikers);
    const isFull = bookedDates[dateStr] === true || available === 0;
    return { dateStr, plansForDay, totalHikers, available, isFull };
  };

  // Render Days
  const renderDays = () => {
    const dayCells = [];

    // Empty cells for padding before the 1st of the month
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(
        <div key={`empty-${i}`} className="h-9 w-9 flex items-center justify-center text-slate-600 text-xs"></div>
      );
    }

    // Actual calendar days
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const { dateStr, isFull } = getDayStats(dayNum);
      const isSelected = selectedDay === dayNum;

      let dayBgStyle = 'h-9 w-9 rounded-full flex items-center justify-center text-xs bg-emerald-500/25 text-emerald-100 font-semibold border border-emerald-500/40 hover:bg-emerald-500/40';
      if (isFull) {
        dayBgStyle = 'h-9 w-9 rounded-full flex items-center justify-center text-xs bg-red-600 text-white font-semibold border border-red-500/40 hover:bg-red-500/70';
      }
      if (isSelected) {
        dayBgStyle = isFull
          ? 'h-9 w-9 rounded-full flex items-center justify-center text-xs bg-red-700 text-white font-bold ring-2 ring-red-400 shadow-lg'
          : 'h-9 w-9 rounded-full flex items-center justify-center text-xs bg-emerald-500 text-slate-900 font-bold ring-2 ring-emerald-300 shadow-lg';
      }

      dayCells.push(
        <button
          key={`day-${dayNum}`}
          onClick={() => {
            setSelectedDay(dayNum);
            onSelectDate(dateStr);
          }}
          className={`h-9 w-9 rounded-full flex items-center justify-center text-xs relative transition-all duration-200 cursor-pointer ${dayBgStyle}`}
        >
          <span>{dayNum}</span>
        </button>
      );
    }

    return dayCells;
  };

  const activeDateFormattedStr = selectedDay ? getFormattedDateStr(selectedDay) : null;

  return (
    <div className="w-full max-w-sm rounded-3xl glass-panel p-5 text-white shadow-xl flex flex-col gap-4">
      {/* Header Month / Tab Selector */}
      <div className="flex items-center justify-between">
        {/* Toggle Weekly/Monthly mimicking the image exactly */}
        <div className="bg-white/5 p-1 rounded-xl flex gap-1 border border-white/5">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'weekly' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              viewMode === 'monthly' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold font-mono tracking-wider min-w-[75px] text-center">
            {monthNames[month].toUpperCase()}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Calendar View */}
      {viewMode === 'monthly' ? (
        <div>
          {/* Calendar Year Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-black font-mono tracking-tight text-white/90">
              {year}
            </span>
            <button
              onClick={() => {
                const todayStr = getFormattedDateStr(selectedDay || new Date().getDate());
                onAddEventClick(todayStr);
              }}
              className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Event</span>
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1 text-slate-400 font-bold text-xs border-b border-white/10 pb-1">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="h-6 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 justify-items-center">
            {renderDays()}
          </div>
        </div>
      ) : (
        /* Simple simulated Weekly view focusing on the current week */
        <div className="py-2 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs text-slate-400 border-b border-white/5 pb-2">
            <span>Minggu Berjalan ({monthNames[month]} {year})</span>
            <button
              onClick={() => {
                const todayStr = getFormattedDateStr(new Date().getDate());
                onAddEventClick(todayStr);
              }}
              className="text-emerald-400 font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Event
            </button>
          </div>
          <div className="flex justify-between gap-1">
            {daysOfWeek.map((day, idx) => {
              const dummyDayNum = ((new Date().getDate() - new Date().getDay() + idx + totalDays) % totalDays) || 1;
              const { dateStr, isFull } = getDayStats(dummyDayNum);
              const isSelected = selectedDay === dummyDayNum;

              let dayStyle = 'bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30';
              if (isFull) dayStyle = 'bg-red-600 text-white';
              if (isSelected) {
                dayStyle = isFull
                  ? 'bg-red-700 text-white font-bold ring-2 ring-red-400'
                  : 'bg-emerald-500 text-slate-900 font-bold ring-2 ring-emerald-300';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDay(dummyDayNum);
                    onSelectDate(dateStr);
                  }}
                  className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 transition-all text-xs cursor-pointer ${dayStyle}`}
                >
                  <span className="text-[10px] text-slate-400 font-bold">{day}</span>
                  <span className="font-mono text-sm">{dummyDayNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Day Status Box */}
      {selectedDay && (
        <div className="mt-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-300 font-mono">
              Status: {selectedDay} {monthNames[month]} {year}
            </span>
          </div>
          <div className="rounded-2xl p-4 bg-slate-950/40 border border-white/5">
            {(() => {
              const { available, isFull } = getDayStats(selectedDay);
              if (isFull) {
                return (
                  <div className="text-sm font-bold text-red-300">
                    Tanggal ini penuh.
                  </div>
                );
              }
              return (
                <div className="text-sm text-slate-100">
                  <div className="font-bold text-emerald-300">Tersisa kuota {available} pendaki</div>
                  <div className="mt-1 text-xs text-slate-400">
                    Dari total kapasitas {DAILY_QUOTA} pendaki untuk tanggal ini.
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
