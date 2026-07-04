/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CalendarCard from './components/CalendarCard';
import ChecklistCard from './components/ChecklistCard';
import InteractiveMap from './components/InteractiveMap';
import CalculatorCard from './components/CalculatorCard';
import GallerySection from './components/GallerySection';
import RegistrationModal from './components/RegistrationModal';
import AdminPage from './components/AdminPage';
import AdminLoginModal from './components/AdminLoginModal';

import { IMAGES, INITIAL_CHECKLIST } from './data';
import { ClimbingPlan, ChecklistItem } from './types';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  Users, 
  CheckCircle, 
  Trash2, 
  Check, 
  Clock, 
  ChevronDown 
} from 'lucide-react';

export default function App() {
  // Application Core States
  const [plans, setPlans] = useState<ClimbingPlan[]>([]);
  const [bookedDates, setBookedDates] = useState<Record<string, boolean>>({});
  const [bookedDatesLoaded, setBookedDatesLoaded] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Booking Modal States
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState('');
  const [modalInitialDetails, setModalInitialDetails] = useState<any>(undefined);
  const [isAdminPage, setIsAdminPage] = useState(window.location.hash === '#admin');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');

  // Load Initial Data from LocalStorage
  useEffect(() => {
    // 1. Load Climbing Plans
    const savedPlans = localStorage.getItem('rinjani_plans');
    if (savedPlans) {
      try {
        setPlans(JSON.parse(savedPlans));
      } catch (e) {
        console.error('Error parsing plans from local storage', e);
        setPlans([]);
      }
    } else {
      // Seed a default demo plan so calendar has an active item out of the box
      const today = new Date();
      const formattedMonth = String(today.getMonth() + 1).padStart(2, '0');
      // Set to 21st of current month or April to match screenshot visual
      const dummyDate = `${today.getFullYear()}-${formattedMonth}-21`;
      
      const seedPlans: ClimbingPlan[] = [
        {
          id: 'demo-plan-1',
          date: dummyDate,
          hikerName: 'Dhatin',
          email: 'dhatinsandy0@gmail.com',
          phone: '08123456789',
          hikersCount: 3,
          days: 3,
          porterNeeded: true,
          guideNeeded: true,
          gearRentalNeeded: true,
          totalPrice: 1950000,
          status: 'confirmed',
          createdAt: new Date().toISOString()
        }
      ];
      setPlans(seedPlans);
      localStorage.setItem('rinjani_plans', JSON.stringify(seedPlans));
    }

    // 2. Load Checklist
    const savedChecklist = localStorage.getItem('rinjani_checklist');
    if (savedChecklist) {
      try {
        setChecklistItems(JSON.parse(savedChecklist));
      } catch (e) {
        setChecklistItems(INITIAL_CHECKLIST);
      }
    } else {
      setChecklistItems(INITIAL_CHECKLIST);
    }
  }, []);

  useEffect(() => {
    fetch('/api/bookings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Booking list API error');
        }
        return response.json();
      })
      .then((data: ClimbingPlan[]) => {
        setPlans(data);
        localStorage.setItem('rinjani_plans', JSON.stringify(data));
      })
      .catch(error => {
        console.warn('Booking API not available, using local storage', error);
      });
  }, []);

  // Load booking dates from backend database, fallback to local schedules if API is unavailable
  useEffect(() => {
    fetch('/api/bookings/dates')
      .then(response => {
        if (!response.ok) {
          throw new Error('Booking dates API error');
        }
        return response.json();
      })
      .then((data: Array<{ date: string; full: boolean }>) => {
        const statusMap: Record<string, boolean> = {};
        data.forEach(item => {
          statusMap[item.date] = item.full;
        });
        setBookedDates(statusMap);
      })
      .catch(error => {
        console.warn('Booking dates API not available, falling back to local plans', error);
        const fallbackMap: Record<string, boolean> = {};
        plans.forEach(plan => {
          fallbackMap[plan.date] = true;
        });
        setBookedDates(fallbackMap);
      })
      .finally(() => {
        setBookedDatesLoaded(true);
      });
  }, [plans]);

  useEffect(() => {
    const onHashChange = () => {
      setIsAdminPage(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSavePlan = async (plan: ClimbingPlan) => {
    const isExisting = plans.some((item) => item.id === plan.id);
    const method = isExisting ? 'PUT' : 'POST';
    const url = isExisting ? `/api/bookings/${encodeURIComponent(plan.id)}` : '/api/bookings';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan booking ke server');
      }

      const savedPlan: ClimbingPlan = await response.json();
      const updatedPlans = isExisting
        ? plans.map((item) => (item.id === savedPlan.id ? savedPlan : item))
        : [...plans, savedPlan];

      setPlans(updatedPlans);
      localStorage.setItem('rinjani_plans', JSON.stringify(updatedPlans));
    } catch (error) {
      console.warn('Backend tidak tersedia, menyimpan lokal saja', error);
      const updatedPlans = isExisting
        ? plans.map((item) => (item.id === plan.id ? plan : item))
        : [...plans, plan];

      setPlans(updatedPlans);
      localStorage.setItem('rinjani_plans', JSON.stringify(updatedPlans));
    }
  };

  const handleDeletePlanAdmin = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus booking di server');
      }
    } catch (error) {
      console.warn('Backend tidak tersedia, menghapus lokal saja', error);
    }

    const updated = plans.filter((p) => p.id !== id);
    setPlans(updated);
    localStorage.setItem('rinjani_plans', JSON.stringify(updated));
  };

  const handleAdminLogin = (password: string) => {
    const adminPassword = 'dhatinadmin';
    if (password === adminPassword) {
      setAdminLoginError('');
      setIsAdminLoginOpen(false);
      setIsAdminPage(true);
      window.location.hash = '#admin';
    } else {
      setAdminLoginError('Kata sandi salah. Silakan coba lagi.');
    }
  };

  const handleBackFromAdmin = () => {
    setIsAdminPage(false);
    setIsAdminLoginOpen(false);
    window.location.hash = '';
  };

  // Sync Checklist to LocalStorage
  const handleToggleChecklistItem = (id: string) => {
    const updated = checklistItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklistItems(updated);
    localStorage.setItem('rinjani_checklist', JSON.stringify(updated));
  };

  // Add a new plan (Book climb)
  const handleAddClimbingPlan = (newPlanDetails: Omit<ClimbingPlan, 'id' | 'createdAt' | 'status'>) => {
    const newPlan: ClimbingPlan = {
      ...newPlanDetails,
      id: `plan-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedPlans = [...plans, newPlan];
    setPlans(updatedPlans);
    localStorage.setItem('rinjani_plans', JSON.stringify(updatedPlans));

    // Show a alert-like modal/success message (highly refined toast style)
    setSelectedDate(newPlan.date);
    
    // Auto-scroll to saving section
    setTimeout(() => {
      const el = document.getElementById('my-plans');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  // Delete a saved plan
  const handleDeletePlan = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan rencana pendakian ini?')) {
      const updated = plans.filter(p => p.id !== id);
      setPlans(updated);
      localStorage.setItem('rinjani_plans', JSON.stringify(updated));
    }
  };

  // Smooth scroll handler
  const handleScrollToSection = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Quick Action: Book from Calendar "+ New Event"
  const handleAddEventFromCalendar = (date: string) => {
    setModalInitialDate(date);
    setModalInitialDetails(undefined);
    setIsBookingOpen(true);
  };

  // Quick Action: Book from Calculator Checkout
  const handleInitiateBookingFromCalculator = (details: any) => {
    setModalInitialDate('');
    setModalInitialDetails(details);
    setIsBookingOpen(true);
  };

  // Quick Action: Book with a Target Pos from Map
  const handleBookFromMapTarget = (posName: string) => {
    setModalInitialDate('');
    setModalInitialDetails({
      hikersCount: 2,
      days: 3,
      porterNeeded: true,
      guideNeeded: true,
      gearRentalNeeded: true,
      totalPrice: 1750000
    });
    setIsBookingOpen(true);
  };

  if (isAdminPage) {
    return (
      <AdminPage
        plans={plans}
        onSavePlan={handleSavePlan}
        onDeletePlan={handleDeletePlanAdmin}
        onBack={handleBackFromAdmin}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-slate-900 pb-16">
      
      {/* 1. Immersive Fixed Mount Rinjani Background Photo with Gradient Mask Overlay */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={IMAGES.background} 
          alt="Gunung Rinjani" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-[0.45] scale-105 transition-all duration-1000"
        />
        {/* Dynamic color layers to create depths and contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/20 to-slate-950"></div>
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/60"></div>
      </div>

      {/* 2. Glassmorphic Navigation Menu */}
      <Navbar 
        onScrollToSection={handleScrollToSection} 
        onOpenBooking={() => {
          setModalInitialDate('');
          setModalInitialDetails(undefined);
          setIsBookingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminLoginOpen(true)}
      />

      {/* 3. Main Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-32 flex flex-col gap-10">
        
        {/* HERO SECTION mirroring screenshot exactly */}
        <section className="flex flex-col items-center text-center justify-center pt-8 pb-4 gap-6 animate-in fade-in slide-in-from-top-6 duration-700">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white bg-clip-text drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
              Welcome to Rinjani Mount
            </h1>
            <p className="text-xl md:text-2xl font-medium text-slate-200 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              Taman Nasional Gunung Rinjani , Indonersia
            </p>
          </div>

          <button
            onClick={() => {
              setModalInitialDate('');
              setModalInitialDetails(undefined);
              setIsBookingOpen(true);
            }}
            className="px-8 py-3.5 rounded-2xl text-base font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl hover:shadow-emerald-500/20 active:scale-95 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
          >
            Daftar Pendakian Sekarang
          </button>
        </section>

        {/* 4. CALENDAR CARD SECTION (Centered visually exactly like the screenshot design) */}
        <section className="w-full flex justify-center py-4 animate-in fade-in duration-700 delay-100">
          <CalendarCard 
            plans={plans} 
            bookedDates={bookedDates}
            onSelectDate={setSelectedDate} 
            onAddEventClick={handleAddEventFromCalendar} 
          />
        </section>

        {/* 5. CHECKLIST SECTION (Info Barang Penting & Syarat Wajib) */}
        <section className="w-full animate-in fade-in duration-700 delay-200">
          <ChecklistCard 
            items={checklistItems} 
            onToggleItem={handleToggleChecklistItem} 
          />
        </section>

        {/* 6. INTERACTIVE MAP SECTION */}
        <section className="w-full animate-in fade-in duration-700 delay-300">
          <InteractiveMap onAddPlanWithStartPoint={handleBookFromMapTarget} />
        </section>

        {/* 7. COST ESTIMATOR & CALCULATION SECTION (Also holds the bottom three info cards: Porter, Sewa Alat, Info Harga) */}
        <section className="w-full animate-in fade-in duration-700 delay-400">
          <CalculatorCard onInitiateBooking={handleInitiateBookingFromCalculator} />
        </section>

        {/* 8. GALLERY SHOWCASE SECTION */}
        <section className="w-full">
          <GallerySection />
        </section>

        {/* 9. BOOKING HISTORY moved to AdminPage for privacy */}
        <section className="w-full py-6 scroll-mt-24">
          <div className="rounded-3xl glass-panel p-6 border border-white/5 flex flex-col gap-5 items-center text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">PANEL PENGGUNA</span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">Jadwal & Rencana Tersimpan</h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">Untuk menjaga privasi data pendaftar, daftar rencana hanya dapat dilihat oleh administrator. Jika Anda admin, silakan masuk untuk mengelola booking dan melihat nama pendaftar.</p>
            </div>
            <div className="pt-3">
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="px-5 py-2 rounded-2xl bg-emerald-400 text-slate-900 font-bold hover:bg-emerald-300 transition"
              >Masuk sebagai Admin</button>
            </div>
          </div>
        </section>

        {/* 10. REALISTIC FAQ & FOOTER */}
        <footer className="w-full border-t border-white/5 pt-8 text-center text-xs text-slate-500 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Taman Nasional Gunung Rinjani, Lombok, Indonesia</span>
          </div>
          <p className="max-w-xl leading-relaxed font-sans text-[11px] text-slate-400">
            Aplikasi Rinjani Explorer dikembangkan sebagai panduan pendakian interaktif, kalkulator porter/peralatan, dan pendaftaran online. Selalu periksa kondisi cuaca (BMKG) dan status aktivitas vulkanik (PVMBG) sebelum melakukan pendakian.
          </p>
          <span className="font-mono mt-1 text-[10px]">
            &copy; 2026 Rinjani Explorer &bull; Menuju Pendakian Bersih & Lestari.
          </span>
        </footer>

      </main>

      {/* 11. REGISTRATION & BOOKING MODAL */}
      <RegistrationModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        onSubmit={handleAddClimbingPlan}
        initialDate={modalInitialDate}
        initialDetails={modalInitialDetails}
      />
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => {
          setIsAdminLoginOpen(false);
          setAdminLoginError('');
        }}
        onLogin={handleAdminLogin}
        error={adminLoginError}
      />

    </div>
  );
}
