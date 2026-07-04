/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChecklistItem, Checkpoint, PorterPackage, GearRentalItem } from './types';

// Let's reference the exact generated assets
export const IMAGES = {
  background: '/src/assets/images/background.jpg',
  basecamp: '/src/assets/images/basecamp.jpg',
  pos1: '/src/assets/images/pos1.jpg',
  pos2: '/src/assets/images/pos2.jpg',
  pos3: '/src/assets/images/pos3.jpg',
  summit: '/src/assets/images/rinjani%20puncak.jpg',
};

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // Gear category (Left Column in UI matching image)
  {
    id: 'carrier',
    name: 'Carrier (Tas Gunung)',
    category: 'gear',
    checked: false,
    description: 'Tas gunung berukuran 50L - 70L untuk membawa logistik pribadi dan pakaian.',
  },
  {
    id: 'jaket',
    name: 'Jaket Gunung (Windproof & Warm)',
    category: 'gear',
    checked: false,
    description: 'Sangat penting untuk menahan suhu dingin ekstrim (hingga 5°C) di Plawangan & Puncak.',
  },
  {
    id: 'paket_gunung',
    name: 'Paket Alat Makan & Memasak',
    category: 'gear',
    checked: false,
    description: 'Nestel, kompor portable, gas kaleng, sendok garpu, dan kantong sampah (Trash Bag).',
  },
  {
    id: 'porter_kama',
    name: 'Layanan Porter / Porter Kama',
    category: 'gear',
    checked: false,
    description: 'Porter profesional untuk mengangkut tenda, air, bahan makanan, dan perlengkapan berat.',
  },

  // Admin category (Right Column in UI matching image)
  {
    id: 'ktp',
    name: 'Fotokopi KTP / Paspor',
    category: 'admin',
    checked: false,
    description: 'Kartu identitas resmi yang masih berlaku untuk keperluan pendaftaran di pintu masuk.',
  },
  {
    id: 'signup',
    name: 'Registrasi Online (e-Rinjani)',
    category: 'admin',
    checked: false,
    description: 'Telah terdaftar secara daring di platform resmi e-Rinjani TNGR NTB.',
  },
  {
    id: 'surat_sehat',
    name: 'Surat Keterangan Sehat',
    category: 'admin',
    checked: false,
    description: 'Surat resmi dari dokter/puskesmas yang menyatakan kondisi fisik sehat untuk mendaki.',
  },
  {
    id: 'kpg',
    name: 'Permit Pemiar KPG (Kartu Pendaki)',
    category: 'admin',
    checked: false,
    description: 'Kartu identitas pendaki gunung atau izin ranger lokal untuk kelayakan naik gunung.',
  }
];

export const CHECKPOINTS: Checkpoint[] = [
  {
    id: 'basecamp',
    name: 'Basecamp Sembalun (Bawak Nao)',
    elevation: '1,300m',
    duration: '± 2 jam',
    difficulty: 'Mudah',
    description: 'Mulai dari Basecamp Sembalun menyusuri padang savana terbuka. Trek relatif datar dan landai cocok sebagai pemanasan.',
    x: 14,
    y: 82,
    photoUrl: IMAGES.basecamp,
    waterSource: true,
    campSite: true
  },
  {
    id: 'pos1',
    name: 'Pos 1 (Pemantauan)',
    elevation: '1,300m',
    duration: '± 30 menit – 1 jam',
    difficulty: 'Mudah',
    description: 'Perjalanan masih didominasi savana. Trek mulai sedikit menanjak namun tetap ringan dan cocok untuk transisi setelah Basecamp.',
    x: 20,
    y: 72,
    photoUrl: IMAGES.pos1,
    waterSource: true,
    campSite: false
  },
  {
    id: 'pos2',
    name: 'Pos 2 (Tengengean)',
    elevation: '1,500m',
    duration: '± 30 menit – 1 jam',
    difficulty: 'Sedang',
    description: 'Masih didominasi savana, namun kini jalur mulai terasa lebih menanjak. Pos 2 cocok untuk istirahat panjang atau makan siang.',
    x: 44,
    y: 64,
    photoUrl: IMAGES.pos2,
    waterSource: true,
    campSite: true
  },
  {
    id: 'pos3',
    name: 'Pos 3 (Pada Balong)',
    elevation: '1,800m',
    duration: '± 1 – 1,5 jam',
    difficulty: 'Tantangan',
    description: 'Elevasi meningkat dan tanjakan menjadi konsisten. Trek mulai memasuki batas hutan dan dikenal sebagai Bukit Penyesalan.',
    x: 62,
    y: 42,
    photoUrl: IMAGES.pos3,
    waterSource: false,
    campSite: true
  },
  {
    id: 'summit',
    name: 'Pelawangan Sembalun – Puncak Rinjani',
    elevation: '3,726m',
    duration: '± 4 – 5 jam',
    difficulty: 'Ekstrim',
    description: 'Serangan puncak dini hari melintasi punggungan sempit, angin kencang, dan pasir vulkanik curam di area Letter E.',
    x: 84,
    y: 18,
    photoUrl: IMAGES.summit,
    waterSource: false,
    campSite: false
  }
];

export const PORTER_PACKAGES: PorterPackage[] = [
  {
    id: 'porter_standard',
    name: 'Porter Standar',
    description: 'Membawa perlengkapan berkemah tim (tenda, alat masak, logistik makan).',
    pricePerDay: 250000,
    maxWeightKg: 20
  },
  {
    id: 'porter_private',
    name: 'Porter Pribadi (Private)',
    description: 'Khusus membawa barang bawaan pribadi Anda (tas ransel, kamera, pakaian ekstra).',
    pricePerDay: 300000,
    maxWeightKg: 15
  }
];

export const GEAR_RENTAL_ITEMS: GearRentalItem[] = [
  { id: 'tent', name: 'Tenda Kapasitas 4 Orang', pricePerDay: 50000, iconName: 'Tent' },
  { id: 'sleeping_bag', name: 'Sleeping Bag Hangat', pricePerDay: 15000, iconName: 'Compass' },
  { id: 'mattress', name: 'Matras Angin / Busa', pricePerDay: 10000, iconName: 'Layers' },
  { id: 'cooking_set', name: 'Cooking Set (Nesting & Kompor)', pricePerDay: 25000, iconName: 'Flame' },
  { id: 'trekking_pole', name: 'Trekking Pole (Tongkat)', pricePerDay: 10000, iconName: 'Activity' },
  { id: 'headlamp', name: 'Headlamp / Senter Kepala', pricePerDay: 10000, iconName: 'Lightbulb' }
];
