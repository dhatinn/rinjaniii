/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ClimbingPlan {
  id: string;
  date: string; // YYYY-MM-DD
  hikerName: string;
  email: string;
  phone: string;
  hikersCount: number;
  days: number;
  porterNeeded: boolean;
  guideNeeded: boolean;
  gearRentalNeeded: boolean;
  totalPrice: number;
  status: 'confirmed' | 'pending';
  createdAt: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  category: 'gear' | 'admin';
  checked: boolean;
  description: string;
}

export interface Checkpoint {
  id: string;
  name: string;
  elevation: string;
  duration: string; // Time to reach from previous point
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan' | 'Ekstrim';
  description: string;
  x: number; // Percent position on SVG map x-axis
  y: number; // Percent position on SVG map y-axis
  photoUrl: string;
  waterSource: boolean;
  campSite: boolean;
}

export interface PorterPackage {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  maxWeightKg: number;
}

export interface GearRentalItem {
  id: string;
  name: string;
  pricePerDay: number;
  iconName: string;
}
