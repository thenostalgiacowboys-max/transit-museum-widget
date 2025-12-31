
import React, { useState, useEffect } from 'react';
import PhotoWidget from './components/PhotoWidget';
import { AlertCircle, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [keyMissing, setKeyMissing] = useState(false);

  useEffect(() => {
    // Check if API key is actually present
    if (!process.env.API_KEY || process.env.API_KEY === "undefined" || process.env.API_KEY.length < 5) {
      setKeyMissing(true);
    }
  }, []);

  if (keyMissing) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-10">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-10 shadow-xl">
          <div className="flex items-center gap-4 mb-6 text-amber-700">
            <AlertCircle className="w-10 h-10" />
            <h1 className="brand-font text-3xl">Configuration Required</h1>
          </div>
          <p className="text-amber-900 mb-6 leading-relaxed font-medium">
            The widget is almost ready! To display AI-powered photos on your WordPress site, you need to provide a Google Gemini API Key.
          </p>
          <div className="bg-amber-900/10 rounded-2xl p-6 font-mono text-sm text-amber-900 mb-8 border border-amber-900/10">
            <div className="flex items-center gap-2 mb-2 opacity-50"><Terminal size={14}/> <span>Instructions:</span></div>
            1. Go to <a href="https://aistudio.google.com/" target="_blank" className="underline font-bold">Google AI Studio</a><br/>
            2. Get your free API Key<br/>
            3. If hosting on GitHub: Add it to your build settings<br/>
            4. If hosting manually: Replace "process.env.API_KEY" in the code with your key string.
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-amber-700 text-white brand-font py-4 rounded-xl hover:bg-amber-800 transition-colors tracking-widest"
          >
            I've added the key, Refresh now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-8">
      <PhotoWidget />
      <div className="mt-8 text-center opacity-30 hover:opacity-100 transition-opacity duration-500">
        <p className="text-[10px] font-black brand-font tracking-[0.5em] text-slate-900 uppercase">
          Transit Museum Society • Official Member Archive
        </p>
      </div>
    </div>
  );
};

export default App;
