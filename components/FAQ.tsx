import React from 'react';

const FAQS = [
  {
    q: 'Qu\'est-ce que l\'IPTV Smarters Pro ?',
    a: 'IPTV Smarters Pro est l\'application de lecture de flux vidéo la plus performante et populaire au monde. Elle permet aux abonnés de charger leur abonnement IPTV France via l\'API Xtream Codes ou un lien M3U pour regarder les chaînes de télévision en direct, les replays et la VOD (films et séries) avec une interface fluide et agréable.'
  },
  {
    q: 'Comment installer l\'abonnement sur Smart TV Samsung / LG ?',
    a: 'C\'est très simple : téléchargez l\'application officielle "IPTV Smarters Pro" ou "Smarters Player Lite" depuis le magasin d\'applications de votre Smart TV (Samsung App Store ou LG Content Store). Lancez l\'application, choisissez "Connexion avec l\'API Xtream Codes" et saisissez le nom d\'utilisateur, le mot de passe et l\'URL du serveur fournis par notre équipe après votre paiement.'
  },
  {
    q: 'Puis-je utiliser mon abonnement sur plusieurs écrans en même temps ?',
    a: 'Pour les abonnements classiques (Starter, Confort, Premium), vous pouvez installer les codes sur autant d\'appareils que vous le souhaitez, mais la diffusion est limitée à 1 connexion active à la fois. Si vous souhaitez utiliser 2 appareils en même temps dans votre foyer, nous vous recommandons l\'offre "Pack 2 Codes" qui inclut 2 lignes indépendantes.'
  },
  {
    q: 'Quel débit internet est recommandé pour regarder en 4K ?',
    a: 'Pour regarder vos programmes en HD 1080p, une connexion de 10 Mbps stable est suffisante. Pour profiter de la qualité IPTV 4K et 8K sans aucune coupure, nous vous recommandons un débit d\'au moins 25 Mbps. Pour une meilleure stabilité, privilégiez toujours une connexion par câble Ethernet RJ45 à votre box internet plutôt que le WiFi.'
  },
  {
    q: 'Le paiement est-il sécurisé et confidentiel ?',
    a: 'Oui, à 100%. Pour vous garantir une sécurité absolue et protéger votre anonymat, nous n\'utilisons pas de passerelle automatisée par carte bancaire. Vous passez votre commande sur le site, puis vous effectuez un virement bancaire manuel sécurisé. Aucune donnée sensible n\'est enregistrée.'
  },
  {
    q: 'Comment se passe la livraison des codes après l\'achat ?',
    a: 'Dès que vous effectuez le virement manuel, transmettez-nous le justificatif de virement par WhatsApp ou via un ticket support. Nos techniciens valident manuellement votre commande en 15 minutes. Vos identifiants de connexion vous sont envoyés immédiatement par e-mail et enregistrés dans votre espace client.'
  },
  {
    q: 'Proposez-vous une assistance technique en cas de problème ?',
    a: 'Absolument. Nous offrons un service client premium 7j/7 par WhatsApp et via notre système de tickets de support. Si vous rencontrez la moindre difficulté lors de l\'installation ou de l\'utilisation de vos codes, nos techniciens vous guideront pas à pas pour configurer votre appareil.'
  },
  {
    q: 'Quels sont les avantages de cet abonnement IPTV ?',
    a: 'Notre abonnement IPTV Smarters Pro Officiel intègre la technologie anti-freeze v4.2 et des serveurs haute performance redondés. Vous profitez de plus de 20 000 chaînes mondiales et 95 000 VOD mis à jour tous les jours en qualité 4K/HD, sans aucune restriction géographique, sans coupure et à un tarif imbattable.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-24 bg-slate-50 border-t border-slate-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4 uppercase tracking-wider">
            Des Questions ?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Foire Aux Questions (FAQ)
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-500">
            Retrouvez toutes les réponses aux questions les plus fréquentes sur notre service IPTV France.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <details 
              key={idx} 
              className="group border border-slate-200 rounded-2xl p-6 bg-white [&_summary::-webkit-details-marker]:hidden shadow-sm hover:shadow-md transition-all duration-200"
            >
              <summary className="flex justify-between items-center font-black text-slate-950 cursor-pointer select-none text-base sm:text-lg">
                <span>{faq.q}</span>
                <span className="transition group-open:rotate-180">
                  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 font-medium">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
