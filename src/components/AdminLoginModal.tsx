import React, { FormEvent } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
  error?: string;
}

export default function AdminLoginModal({ isOpen, onClose, onLogin, error }: AdminLoginModalProps) {
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(password);
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300 text-xs uppercase tracking-[0.2em]">
              <ShieldCheck className="w-4 h-4" /> Admin Login
            </div>
            <h2 className="mt-3 text-2xl font-bold text-white">Masuk sebagai Admin</h2>
            <p className="text-sm text-slate-400 mt-2">Masukkan kata sandi admin untuk melihat panel CRUD khusus.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-white/10 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-semibold text-slate-200">Kata Sandi Admin</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
            placeholder="Masukkan kata sandi"
            required
          />

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button type="submit" className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 transition">
            Login Admin
          </button>
        </form>
      </div>
    </div>
  );
}
