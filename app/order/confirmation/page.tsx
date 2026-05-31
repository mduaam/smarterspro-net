'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'Starter';
  const paymentId = searchParams.get('paymentId') || '';

  const getPlanPrice = (p: string) => {
    if (p === 'Premium') return '29.99 €';
    if (p === 'Confort') return '19.99 €';
    return '9.99 €';
  };

  // Mocked details matching our seed database configuration
  const bankDetails = 'Bank: EuroBank | IBAN: FR76 3000 1234 5678 9012 345 | SWIFT: EURBFR2X';
  const whatsappNumber = '+33612345678';

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-grow">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center mb-8">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 border border-green-200 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Commande Enregistrée !
        </h1>
        <p className="mt-3 text-lg text-slate-500 max-w-xl mx-auto">
          Votre demande de souscription pour la formule <span className="font-bold text-slate-900">{plan}</span> ({getPlanPrice(plan)}) est en attente de paiement manuel.
        </p>

        {paymentId && (
          <p className="mt-2 text-xs text-slate-400 font-mono">
            Réf Commande: {paymentId}
          </p>
        )}
      </div>

      {/* Step by Step Guide */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-6 mb-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
          Comment activer votre abonnement en 3 étapes :
        </h2>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-extrabold text-sm mr-4">
              1
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Effectuez le transfert</h3>
              <p className="text-sm text-slate-600 mt-1">
                Faites un virement bancaire de <span className="font-bold text-slate-950">{getPlanPrice(plan)}</span> sur le compte suivant :
              </p>
              <div className="mt-2 bg-white border border-slate-200 p-4 rounded font-mono text-xs select-all">
                {bankDetails}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-extrabold text-sm mr-4">
              2
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Prenez une capture d'écran du reçu</h3>
              <p className="text-sm text-slate-600 mt-1">
                Une fois le virement bancaire validé, enregistrez le justificatif de transfert (format PDF ou image).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-extrabold text-sm mr-4">
              3
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Transmettez votre justificatif</h3>
              <p className="text-sm text-slate-600 mt-1">
                Pour une activation express en moins de 15 minutes, cliquez sur le bouton vert ci-dessous pour nous envoyer votre reçu sur WhatsApp, ou ouvrez un ticket d'assistance depuis votre espace client.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Bonjour!%20Je%20viens%20d'effectuer%20le%20paiement%20de%20mon%20abonnement%20${plan}.%20Voici%20mon%20reçu%20(Réf:%20${paymentId})`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-lg text-base font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm"
        >
          <svg className="h-6 w-6 mr-2 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.022-.08-.124-.22-.364-.34-.24-.12-1.418-.7-1.638-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-.992-.367-1.89-1.167-.701-.626-1.175-1.4-1.316-1.64-.14-.24-.015-.37.107-.49.11-.107.242-.28.363-.42.122-.14.162-.24.243-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.476-.39-.413-.54-.42-.14-.007-.3-.007-.46-.007s-.42.06-.64.28c-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.581 4.1 3.624.572.247 1.02.395 1.37.504.573.18 1.095.155 1.507.094.46-.067 1.418-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.2-.16-.44-.28zM12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.88 5.83L2.43 22l4.35-1.42C8.32 21.41 10.1 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.72 0-3.32-.47-4.71-1.3l-.34-.2-2.58.85.86-2.51-.22-.35C4.22 15.17 3.75 13.63 3.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z" />
          </svg>
          Envoyer le reçu sur WhatsApp
        </a>

        <Link
          href="/dashboard"
          className="w-full flex items-center justify-center px-6 py-4 border border-slate-300 rounded-lg text-base font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
        >
          Accéder à mon Espace Client
        </Link>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center py-24">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
