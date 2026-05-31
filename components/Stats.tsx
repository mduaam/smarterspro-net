import React from 'react';

export function Stats() {
  return (
    <section className="bg-white border-b border-slate-200 py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="block text-3xl font-black text-slate-950">115 000+</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Chaînes IPTV</span>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <span className="block text-3xl font-black text-slate-950">120 000+</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Films & Séries</span>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <span className="block text-3xl font-black text-slate-950">28k+</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Abonnés Actifs</span>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <span className="block text-3xl font-black text-slate-950">4.9 ★</span>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Note Clients</span>
          </div>
        </div>
      </div>
    </section>
  );
}
