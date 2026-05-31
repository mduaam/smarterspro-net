import React from 'react';

const ADVANTAGES = [
  {
    title: 'Abonnement IPTV taillé pour la France',
    desc: 'TF1, M6, France TV, Canal+, beIN Sports et des milliers de chaînes régionales, européennes et internationales — tout votre IPTV France dans un seul abonnement IPTV Smarters Pro, sans frais cachés.'
  },
  {
    title: 'Qualité IPTV 4K & HD incomparable',
    desc: 'Profitez de vos chaînes IPTV en 4K Ultra HD, HD 1080p et 8K. Notre technologie anti-coupure garantit un flux ininterrompu même lors des grands événements sportifs — la raison pour laquelle nos clients nous considèrent comme le meilleur IPTV du marché.'
  },
  {
    title: 'Service IPTV France fiable à 99,9%',
    desc: 'Nos serveurs haute performance sont surveillés 24h/24 pour assurer une disponibilité de 99,9%. En cas de problème, notre équipe IPTV Smarters Pro intervient en moins de 30 minutes. Plus de 28 000 abonnés IPTV Smarters Pro en France nous font confiance chaque jour.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4 uppercase tracking-wider">
            Pourquoi IPTV Smarters Pro ?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-tight">
            Le meilleur abonnement IPTV pour les utilisateurs en France
          </h2>
          <p className="mt-6 text-base sm:text-lg text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
            IPTV Smarters Pro est reconnu comme le meilleur IPTV France grâce à son infrastructure dédiée, ses serveurs ultra-performants et son catalogue de plus de 115 000 chaînes en qualité IPTV 4K et HD. Notre abonnement IPTV Smarters Pro est pensé pour vous offrir une expérience télévisuelle sans compromis — fluide, stable et immédiatement disponible sur tous vos appareils.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ADVANTAGES.map((adv, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg mb-6 shadow-sm">
                ✓
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-3">{adv.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{adv.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
