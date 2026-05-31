import React from 'react';

const COMPATIBLE_DEVICES = [
  { 
    name: 'Smart TV (Samsung, LG, Sony)', 
    desc: 'Compatible avec les applications Smart IPTV, IBO Player, IPTV Smarters Pro, SET IPTV et Net IPTV.' 
  },
  { 
    name: 'Smartphones & Tablettes', 
    desc: 'Profitez de vos chaînes sur vos appareils iOS (iPhone, iPad) et Android. Idéal pour vos déplacements.' 
  },
  { 
    name: 'Amazon Fire TV / Stick', 
    desc: 'Fonctionne parfaitement sur Fire Stick Lite, 4K, Max et Fire TV Cube via downloader.' 
  },
  { 
    name: 'PC & Mac (Ordinateurs)', 
    desc: 'Regardez vos programmes favoris sur Windows, macOS ou Linux via l\'application officielle Smarters Pro ou VLC.' 
  },
  { 
    name: 'Application IPTV Smarters Pro', 
    desc: 'Bénéficiez de la meilleure interface utilisateur avec la fameuse application officielle recommandée par notre équipe.' 
  },
  { 
    name: 'Boîtiers MAG & Formuler', 
    desc: 'Compatibilité totale avec les boîtiers MAG 250, 254, 322 et les modèles Formuler Z7+, Z8, Z10 via portail portal.' 
  }
];

export function Compatibility() {
  return (
    <section id="compatibility" className="py-24 bg-white border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4 uppercase tracking-wider">
            Compatibilités
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none">
            Appareils & Applications Supportés
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Notre abonnement IPTV Smarters Pro fonctionne à la perfection sur 100% des systèmes d'exploitation modernes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPATIBLE_DEVICES.map((device, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col hover:shadow-md transition-all duration-200">
              <span className="font-black text-slate-950 text-lg mb-2">{device.name}</span>
              <span className="text-sm text-slate-500 leading-relaxed font-medium">{device.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
