
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Loader2, User, RefreshCcw } from 'lucide-react';
import { TransitPhoto } from '../types';
import { fetchPhotoOfTheMonth } from '../services/geminiService';

const PhotoWidget: React.FC = () => {
  const [photo, setPhoto] = useState<TransitPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPhotoOfTheMonth();
      setPhoto(data);
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        // This is handled at the App.tsx level now
        return;
      }
      console.error(err);
      setError("Archive connectivity issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#003366] rounded-[2.5rem] p-20 flex flex-col items-center justify-center min-h-[500px] text-white shadow-2xl border-4 border-white/10">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-[#ffcc00]" />
          <div className="absolute inset-0 blur-xl bg-[#ffcc00]/20 animate-pulse"></div>
        </div>
        <p className="brand-font mt-8 tracking-[0.4em] text-xl text-[#ffcc00]">Developing Film...</p>
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mt-2">Accessing Member Archive</p>
      </div>
    );
  }

  if (error || !photo) {
    return (
      <div className="bg-white rounded-[2.5rem] p-16 text-center border-4 border-slate-100 shadow-xl max-w-xl mx-auto">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCcw className="text-slate-400 w-8 h-8" />
        </div>
        <p className="text-slate-800 font-bold brand-font text-2xl mb-2">Temporary Archive Outage</p>
        <p className="text-slate-500 mb-8 text-sm">{error || "Could not retrieve photo."}</p>
        <button 
          onClick={loadData} 
          className="bg-[#003366] text-white font-bold brand-font px-10 py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-[#004d99] transition-all shadow-lg"
        >
          Re-connect
        </button>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group transition-all duration-700">
      {/* Brand Header Label */}
      <div className="absolute top-10 left-10 z-20">
        <span className="bg-[#c41230] text-white px-8 py-3 rounded-full text-xs font-black brand-font tracking-[0.3em] uppercase shadow-2xl border border-white/20">
          Member's Photo of the Month
        </span>
      </div>

      <div className="relative aspect-[3/4] md:aspect-[16/10] lg:aspect-[21/9] overflow-hidden">
        <img 
          src={photo.imageUrl} 
          alt={photo.title} 
          className="w-full h-full object-cover transition-transform duration-[5s] scale-100 group-hover:scale-110 ease-out"
        />
        
        {/* Deep Cinematic Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-700"></div>
        
        {/* Main Content Area */}
        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-20 z-10 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h2 className="brand-font text-6xl md:text-9xl text-white leading-[0.85] mb-10 tracking-tighter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              {photo.title}
            </h2>
            <div className="flex flex-wrap items-center gap-10 text-white/90 font-bold text-base uppercase tracking-[0.25em]">
              <span className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <Clock className="w-6 h-6 text-[#ffcc00]" /> {photo.year}
              </span>
              <span className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <MapPin className="w-6 h-6 text-[#c41230]" /> {photo.location}
              </span>
            </div>
          </div>

          {/* Member Badge */}
          <div className="flex items-center gap-8 bg-white/10 backdrop-blur-3xl px-12 py-8 rounded-[3rem] border border-white/20 shadow-2xl shrink-0 hover:bg-white/15 transition-colors cursor-default">
            <div className="w-16 h-16 rounded-full bg-[#ffcc00] flex items-center justify-center text-[#003366] shrink-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]">
              <User className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white/40 text-[12px] font-black uppercase tracking-[0.3em] mb-2 leading-none">Photographer</p>
              <p className="text-white font-bold brand-font text-3xl tracking-wider leading-none drop-shadow-lg">{photo.member}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoWidget;
