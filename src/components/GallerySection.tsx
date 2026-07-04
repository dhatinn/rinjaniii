/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, MapPin, Sparkles, ZoomIn, X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  location: string;
  description: string;
  imgUrl: string;
}

export default function GallerySection() {
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'lake',
      title: 'Danau Segara Anak',
      location: 'Kawah Rinjani (2,008 mdpl)',
      description: 'Danau vulkanik biru luas di tengah kawah Rinjani dengan anak gunung aktif Gunung Baru Jari di tengahnya.',
      imgUrl: 'https://jelajah.kompas.id/wp-content/uploads/2018/10/20111208SET10.jpg',
    },
    {
      id: 'crater',
      title: 'Plawangan Sembalun',
      location: 'Campsite Crater Rim (2,639 mdpl)',
      description: 'Tempat berkemah paling populer dengan pemandangan lautan awan menakjubkan dan Danau Segara Anak di satu sisi.',
      imgUrl: 'https://trekkingrinjanilombok.com/wp-content/uploads/2020/07/Pelawangan-Sembalun.jpg',
    },
    {
      id: 'summit',
      title: 'Rinjani Summit Attack',
      location: 'Puncak Tertinggi (3,726 mdpl)',
      description: 'Tantangan puncak tertinggi Lombok. Menawarkan pemandangan tak terlupakan ke arah Gunung Agung Bali & Gunung Tambora Sumbawa.',
      imgUrl: 'https://senarutrekking.com/wp-content/uploads/2025/09/Puncak-Gunung-Rinjani_lombok.jpg',
    },
    {
      id: 'waterfall',
      title: 'Air Terjun Sindang Gila',
      location: 'Kaki Gunung (Senaru Village)',
      description: 'Air terjun megah bertingkat dua di kaki gunung Rinjani, dikelilingi hutan hujan tropis yang rimbun dan asri.',
      imgUrl: 'https://pariwisataindonesia.id/wp-content/uploads/2020/07/sendang-gile-lombok-foto-yuotube.jpg',
    }
  ];

  return (
    <div id="gallery" className="w-full flex flex-col gap-5 py-6 scroll-mt-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Galeri Keindahan Rinjani
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Visual keindahan alam tropis, kawah vulkanik, dan lautan awan Gunung Rinjani Lombok.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
          <Camera className="w-3.5 h-3.5" />
          <span>4 Destinasi Utama</span>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {galleryItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] glass-panel border border-white/5 hover:border-emerald-500/30 transition-all duration-300 cursor-zoom-in shadow-xl"
          >
            {/* Background Image */}
            <img 
              src={item.imgUrl} 
              alt={item.title} 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.85] group-hover:brightness-95"
            />
            
            {/* Shadow gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

            {/* Hover visual cue */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-emerald-950/20 backdrop-blur-[2px]">
              <div className="p-3 rounded-full bg-emerald-500/80 text-slate-950 shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300">
                <ZoomIn className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

            {/* Content text */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-left">
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                <MapPin className="w-3 h-3 shrink-0" />
                {item.location}
              </span>
              <h3 className="text-base font-black text-white leading-tight">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-1 font-sans leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Immersive Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={() => setActivePhoto(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            onClick={() => setActivePhoto(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative max-w-3xl w-full rounded-3xl overflow-hidden glass-panel border border-white/10 flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Image Column */}
            <div className="w-full md:w-3/5 aspect-[4/3] md:aspect-auto md:h-[450px]">
              <img 
                src={activePhoto.imgUrl} 
                alt={activePhoto.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Right Information Column */}
            <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col justify-between text-white bg-slate-950/60 backdrop-blur-xl">
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{activePhoto.location}</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight text-white leading-tight">
                  {activePhoto.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  {activePhoto.description}
                </p>
              </div>

              {/* Action */}
              <div className="mt-8 border-t border-white/5 pt-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Ingin melihat pemandangan ini secara langsung? Daftarkan rencana pendakian Anda bersama kami!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
