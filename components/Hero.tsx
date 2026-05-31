import React from 'react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="bg-slate-900 text-white py-20 lg:py-28 relative overflow-hidden border-b border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Promo Badge */}
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-6 uppercase tracking-wider">
            ⚡ Meilleur IPTV France 2026 – Noté 4.9/5
          </span>
          
          {/* Brand Tag */}
          <span className="block text-sm font-extrabold text-blue-500 uppercase tracking-widest mb-3">
            IPTV Smarters Pro
          </span>

          {/* Main Title (H2 target representation) */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
            Le Meilleur IPTV France <br />
            <span className="text-blue-500">Abonnement IPTV 4K & HD</span>
          </h1>

          {/* Sub-copy (H2 target representation paragraph) */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            L'abonnement <span className="font-bold text-white">IPTV Smarters Pro</span> vous donne accès à des milliers de chaînes IPTV françaises, européennes et mondiales en qualité 4K et HD — activé en quelques minutes sur tous vos écrans. Le service IPTV France le plus fiable du marché.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link 
              href="#pricing" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-md text-base transition-colors transform hover:-translate-y-0.5 tracking-wide"
            >
              Voir les Abonnements IPTV
            </Link>
            <Link 
              href="/support" 
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded shadow-md text-base transition-colors"
            >
              Obtenir un Essai 24H
            </Link>
          </div>

          {/* Value Pill Indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-slate-400 text-xs font-semibold">
            <span className="flex items-center text-yellow-400">
              ★★★★★ <span className="text-white ml-2">4.9 / 5.0</span>
            </span>
            <span className="hidden sm:inline border-l border-slate-800 h-4"></span>
            <span>🟢 Diffusion Stable: <span className="text-white">Disponibilité 99.9%</span></span>
            <span className="hidden sm:inline border-l border-slate-800 h-4"></span>
            <span>🖥️ IPTV 4K & HD: <span className="text-white">Image cristalline</span></span>
            <span className="hidden sm:inline border-l border-slate-800 h-4"></span>
            <span>📞 Assistance 7j/7: <span className="text-white">Réponse en 30 min</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
