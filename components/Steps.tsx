import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Choisissez votre Formule',
    desc: 'Sélectionnez l\'abonnement (1 mois, 3 mois ou 12 mois) qui correspond le mieux à votre nombre d\'écrans et à vos besoins.'
  },
  {
    num: '02',
    title: 'Validez votre Commande',
    desc: 'Remplissez le formulaire de commande sans entrer de coordonnées bancaires. Nous fonctionnons par validation manuelle sécurisée.'
  },
  {
    num: '03',
    title: 'Effectuez le Virement Manuel',
    desc: 'Transmettez le justificatif ou reçu de votre virement bancaire par WhatsApp ou par ticket d\'assistance.'
  },
  {
    num: '04',
    title: 'Activation en 15 Minutes',
    desc: 'Dès réception de votre justificatif, nos techniciens configurent vos accès et vous envoient vos identifiants immédiatement.'
  }
];

export function Steps() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Fonctionnement
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3 sm:text-4xl">
            Comment s'inscrire et s'abonner ?
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl mx-auto text-base">
            Notre processus de paiement manuel par virement est conçu pour sécuriser vos données et accélérer la mise en service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {STEPS.map((step, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-lg relative shadow-sm">
              <span className="absolute -top-4 left-6 text-4xl font-black text-blue-500/20 tracking-tighter">
                {step.num}
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-2 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
