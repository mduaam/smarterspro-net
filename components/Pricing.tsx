import React from 'react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'Starter',
    name: 'Abonnement IPTV 3 Mois',
    price: '19.99',
    originalPrice: '34.99',
    duration: '3 Mois',
    popular: false,
    color: 'border-slate-200 bg-white hover:border-slate-300',
    btnBg: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm',
    badge: 'Formule Découverte',
    savings: 'Économisez 42%',
    features: [
      '1 Connexion active simultanée',
      'Qualité IPTV 4K & HD',
      '+20 000 Chaînes TV en Direct',
      '+60 000 Films & Séries (VOD)',
      'Replay 48h sur toutes les chaînes',
      'Mises à jour quotidiennes de la VOD',
      'Technologie anti-freeze intégrée',
      'Assistance client par WhatsApp 7j/7'
    ]
  },
  {
    id: 'Confort',
    name: 'Abonnement IPTV 6 Mois',
    price: '29.99',
    originalPrice: '49.99',
    duration: '6 Mois',
    popular: false,
    color: 'border-slate-200 bg-white hover:border-slate-300',
    btnBg: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm',
    badge: 'Formule Avantageux',
    savings: 'Économisez 40%',
    features: [
      '1 Connexion active simultanée',
      'Qualité IPTV 4K & HD',
      '+20 000 Chaînes TV en Direct',
      '+75 000 Films & Séries (VOD)',
      'Replay 48h sur toutes les chaînes',
      'Mises à jour quotidiennes de la VOD',
      'Technologie anti-freeze intégrée',
      'Assistance client par WhatsApp 7j/7'
    ]
  },
  {
    id: 'Premium',
    name: 'Abonnement IPTV 12 Mois',
    price: '39.99',
    originalPrice: '59.99',
    duration: '12 Mois',
    popular: true,
    color: 'border-blue-600 bg-white ring-4 ring-blue-500/5',
    btnBg: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md',
    badge: 'MEILLEURE VENTE',
    savings: 'Économisez 33% — Recommandé',
    features: [
      '1 Connexion active simultanée',
      'Qualité IPTV 4K & HD',
      '+20 000 Chaînes TV en Direct',
      '+95 000 Films & Séries (VOD) 4K',
      'Replay 72h sur toutes les chaînes',
      'Mises à jour quotidiennes de la VOD',
      'Technologie anti-freeze v4.2',
      'Assistance technique VIP 7j/7'
    ]
  },
  {
    id: 'Pack2',
    name: 'Abonnement Pack 2 Codes',
    price: '59.99',
    originalPrice: '79.99',
    duration: '12 Mois (2 Appareils)',
    popular: false,
    color: 'border-slate-200 bg-white hover:border-slate-300',
    btnBg: 'bg-slate-800 hover:bg-slate-900 text-white shadow-sm',
    badge: 'Offre Duo & Foyer',
    savings: 'Économisez 25%',
    features: [
      '2 Connexions actives indépendantes',
      'Qualité IPTV 4K & HD',
      '+20 000 Chaînes TV en Direct',
      '+95 000 Films & Séries (VOD) 4K',
      'Replay 72h sur toutes les chaînes',
      'Mises à jour quotidiennes de la VOD',
      'Technologie anti-freeze v4.2',
      'Assistance technique VIP 7j/7'
    ]
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4 uppercase tracking-wider">
            ABONNEMENT IPTV FLEXIBLE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none">
            Nos Tarifs Smarters Pro
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Profitez de nos abonnements IPTV Smarters Pro en France. Pas d'engagement, pas de prélèvement automatique, paiement manuel 100% sécurisé et confidentiel.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
          {PLANS.map((plan) => (
            <div 
              key={plan.id} 
              className={`border rounded-2xl p-6 flex flex-col relative transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md ${plan.color}`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  MEILLEURE VENTE
                </span>
              )}
              
              {/* Card Header */}
              <div className="mb-6 border-b border-slate-100 pb-6">
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block mb-1">
                  {plan.badge}
                </span>
                <h3 className="text-lg font-black text-slate-950 min-h-[3.5rem] flex items-center">{plan.name}</h3>
                
                {/* Price Display */}
                <div className="flex items-baseline mt-4 mb-2">
                  <span className="text-slate-400 text-sm font-semibold line-through mr-2">
                    {plan.originalPrice} €
                  </span>
                  <span className="text-4xl font-black text-slate-950 tracking-tight">{plan.price}</span>
                  <span className="text-xl font-bold text-slate-950 ml-1">€</span>
                  <span className="text-slate-400 text-[11px] font-semibold ml-2">/ {plan.duration}</span>
                </div>
                
                {/* Savings tag */}
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 border border-green-200 text-green-700">
                  {plan.savings}
                </span>
              </div>

              {/* Card Features List */}
              <ul className="space-y-3.5 mb-8 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs text-slate-600 font-semibold leading-normal">
                    <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Link */}
              <div className="mt-auto">
                <Link
                  href={`/checkout?plan=${plan.id}`}
                  className={`w-full inline-flex items-center justify-center font-bold py-3.5 px-4 rounded-lg text-xs transition-all duration-200 uppercase tracking-wider text-center ${plan.btnBg}`}
                >
                  Choisir cette formule
                </Link>
                <span className="text-[9px] text-slate-400 text-center block mt-3 font-medium">
                  🔒 Activation manuelle sécurisée &middot; Garantie 7 jours
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
