import React, { useEffect, useMemo, useState } from 'react';
import { ClimbingPlan } from '../types';
import { Plus, Trash2, Calendar, Users, CheckSquare, ArrowLeft } from 'lucide-react';

interface AdminPageProps {
  plans: ClimbingPlan[];
  onSavePlan: (plan: ClimbingPlan) => void;
  onDeletePlan: (id: string) => void;
  onBack: () => void;
}

const emptyPlan: ClimbingPlan = {
  id: '',
  date: '',
  hikerName: '',
  email: '',
  phone: '',
  hikersCount: 1,
  days: 1,
  porterNeeded: false,
  guideNeeded: false,
  gearRentalNeeded: false,
  totalPrice: 0,
  status: 'pending',
  createdAt: new Date().toISOString(),
};

export default function AdminPage({ plans, onSavePlan, onDeletePlan, onBack }: AdminPageProps) {
  const [form, setForm] = useState<ClimbingPlan>(emptyPlan);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!editMode) {
      setForm(emptyPlan);
    }
  }, [editMode]);

  const selectedPlan = useMemo(
    () => (form.id ? plans.find((plan) => plan.id === form.id) : undefined),
    [form.id, plans]
  );

  const handleChange = (field: keyof ClimbingPlan, value: string | number | boolean) => {
    setForm((current) => ({ ...current, [field]: value } as ClimbingPlan));
  };

  const handleEdit = (plan: ClimbingPlan) => {
    setForm(plan);
    setEditMode(true);
    window.location.hash = '#admin';
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const savedPlan: ClimbingPlan = {
      ...form,
      id: form.id || `plan-${Date.now()}`,
      createdAt: form.createdAt || new Date().toISOString(),
      status: form.status ?? 'pending',
    };
    onSavePlan(savedPlan);
    setMessage(editMode ? 'Data booking berhasil diperbarui.' : 'Booking baru berhasil disimpan.');
    setEditMode(false);
    setForm(emptyPlan);
    setTimeout(() => setMessage(''), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),_transparent_35%)] pointer-events-none"></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 text-slate-100 border border-white/10 hover:bg-white/15 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-3xl glass-panel p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-400 font-semibold">Admin CRUD</p>
                <h1 className="text-3xl font-extrabold text-white">Kelola Jadwal Booking</h1>
              </div>
              <div className="text-right text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Total data:
                  <span className="font-bold text-white">{plans.length}</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/50 p-3">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                    <th className="px-3 py-3">Tanggal</th>
                    <th className="px-3 py-3">Nama</th>
                    <th className="px-3 py-3">Hiker</th>
                    <th className="px-3 py-3">Durasi</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-slate-500 text-center">
                        Belum ada booking. Tambahkan data baru di form sebelah kanan.
                      </td>
                    </tr>
                  )}
                  {plans.map((plan) => (
                    <tr key={plan.id} className="border-t border-white/5 text-[13px]">
                      <td className="px-3 py-3 text-slate-100">{plan.date}</td>
                      <td className="px-3 py-3 text-slate-200">{plan.hikerName}</td>
                      <td className="px-3 py-3 text-slate-400">{plan.hikersCount} orang</td>
                      <td className="px-3 py-3 text-slate-400">{plan.days} hari</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] ${plan.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                          <CheckSquare className="w-3.5 h-3.5" /> {plan.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="rounded-xl bg-white/10 px-3 py-1 text-slate-100 hover:bg-white/15 transition"
                        >Edit</button>
                        <button
                          onClick={() => onDeletePlan(plan.id)}
                          className="rounded-xl bg-red-600/20 px-3 py-1 text-red-200 hover:bg-red-600/30 transition"
                        >Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl glass-panel p-6 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Form Booking</p>
                <h2 className="text-2xl font-bold text-white">{editMode ? 'Edit Booking' : 'Tambah Booking'}</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300 text-xs">
                <Plus className="w-4 h-4" /> {editMode ? 'Update' : 'Create'}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <label className="block text-slate-300 text-xs uppercase tracking-[0.18em]">Tanggal</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => handleChange('date', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="grid gap-4">
                <label className="block text-slate-300 text-xs uppercase tracking-[0.18em]">Nama Pendaki</label>
                <input
                  type="text"
                  value={form.hikerName}
                  onChange={(event) => handleChange('hikerName', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="grid gap-4">
                <label className="block text-slate-300 text-xs uppercase tracking-[0.18em]">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid gap-4">
                <label className="block text-slate-300 text-xs uppercase tracking-[0.18em]">Telepon</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-slate-300 text-xs uppercase tracking-[0.18em]">Jumlah Pendaki</label>
                  <input
                    type="number"
                    min={1}
                    value={form.hikersCount}
                    onChange={(event) => handleChange('hikersCount', Number(event.target.value))}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs uppercase tracking-[0.18em]">Durasi (hari)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.days}
                    onChange={(event) => handleChange('days', Number(event.target.value))}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.porterNeeded}
                    onChange={(event) => handleChange('porterNeeded', event.target.checked)}
                  />
                  <span className="text-slate-200 text-sm">Porter</span>
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.guideNeeded}
                    onChange={(event) => handleChange('guideNeeded', event.target.checked)}
                  />
                  <span className="text-slate-200 text-sm">Guide</span>
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.gearRentalNeeded}
                    onChange={(event) => handleChange('gearRentalNeeded', event.target.checked)}
                  />
                  <span className="text-slate-200 text-sm">Sewa Alat</span>
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.status === 'confirmed'}
                    onChange={(event) => handleChange('status', event.target.checked ? 'confirmed' : 'pending')}
                  />
                  <span className="text-slate-200 text-sm">Dikonfirmasi</span>
                </label>
              </div>

              <div className="grid gap-4">
                <label className="block text-slate-300 text-xs uppercase tracking-[0.18em]">Total Harga</label>
                <input
                  type="number"
                  min={0}
                  value={form.totalPrice}
                  onChange={(event) => handleChange('totalPrice', Number(event.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-400/20 hover:bg-emerald-300 transition"
              >
                <Plus className="w-4 h-4" /> Simpan Booking
              </button>

              {message && (
                <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 px-4 py-3 text-sm text-emerald-100">
                  {message}
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
