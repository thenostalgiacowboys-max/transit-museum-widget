
import React from 'react';
import PhotoWidget from './components/PhotoWidget';

const App: React.FC = () => {
  return (
    /* 
      Removed min-h-screen and bg-slate-100. 
      The widget now expands to fill the width of its WordPress container.
    */
    <div className="w-full">
      <PhotoWidget />
      
      {/* Subtle attribution that works on any theme background */}
      <div className="mt-6 text-center opacity-50 hover:opacity-100 transition-opacity">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
          Transit Museum Society • Member Archive
        </p>
      </div>
    </div>
  );
};

export default App;
