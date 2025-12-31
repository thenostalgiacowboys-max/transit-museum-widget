
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Loader2, User } from 'lucide-react';
import { TransitPhoto } from '../types';
import { fetchPhotoOfTheMonth } from '../services/geminiService';

const PhotoWidget: React.FC = () => {
  const [photo, setPhoto] = useState<TransitPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchPhotoOfTheMonth();
        setPhoto(data);
      } catch (err) {
        console.error(err);
        setError("Archive currently unavailable.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[500px] text-white shadow-xl">
        <Loader2 className="w-10 h-10 animate-spin text-transit-yellow mb-4" />
        <p className="brand-font tracking-widest text-sm opacity-60">Developing Film...</p>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-slate-100">
        <p className="text-slate-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-transit-blue font-bold brand-font text-sm uppercase tracking-widest">Retry</button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black rounded-3xl shadow-2xl group group-hover:shadow-transit-blue/20 transition-all duration-700">
      {/* Label */}
      <div className="absolute top-8 left-8 z-20">
        <span className="bg-transit-red text-white px-5 py-2 rounded-full text-[11px] font-black brand-font tracking-[0.2em] uppercase shadow-lg">
          Member's Photo of the Month
        </span>
      </div>

      {/* Increased Height Container: aspect-[3/4] on mobile (portrait) and aspect-[16/10] on desktop (taller landscape) */}
      <div className="relative aspect-[3/4] md:aspect-[16/10] overflow-hidden">
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          className="w-full h-full object-cover transition-transform duration-[2s] scale-100 group-hover:scale-105"
        />
        
        {/* Elegant Gradient Overlay - slightly stronger at the bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-95 group-hover:opacity-80 transition-opacity duration-500"></div>
        
        {/* Minimal Bottom Metadata */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-4xl">
            <h2 className="brand-font text-4xl md:text-7xl text-white leading-tight mb-6 tracking-tight drop-shadow-2xl">
              {photo.title}
            </h2>
            <div className="flex flex-wrap items-center gap-8 text-white/90 font-bold text-sm uppercase tracking-widest">
              <span className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-transit-yellow" /> {photo.year}
              </span>
              <span className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-transit-red" /> {photo.location}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5 bg-white/10 backdrop-blur-xl px-8 py-5 rounded-3xl border border-white/20 whitespace-nowrap shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-transit-yellow flex items-center justify-center text-transit-blue shrink-0 shadow-inner">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest leading-none mb-1.5">Photographer</p>
              <p className="text-white font-bold brand-font text-xl leading-none tracking-wide">{photo.member}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoWidget;
