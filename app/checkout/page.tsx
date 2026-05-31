'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PLAN_INFO: Record<string, { name: string; price: string; duration: string; features: string[] }> = {
  Starter: {
    name: 'Starter Plan',
    price: '9.99 €',
    duration: '1 Mois',
    features: ['1 Connexion simultanée', 'Qualité HD & SD', '+20 000 Chaînes & VOD', 'Assistance WhatsApp 24/7'],
  },
  Confort: {
    name: 'Confort Plan',
    price: '19.99 €',
    duration: '3 Mois',
    features: ['2 Connexions simultanées', 'Qualité 4K & Ultra HD', '+20 000 Chaînes & VOD', 'Assistance Premium 24/7'],
  },
  Premium: {
    name: 'Premium Plan',
    price: '29.99 €',
    duration: '12 Mois',
    features: ['4 Connexions simultanées', 'Qualité 4K, UHD, HD', '+20 000 Chaînes & VOD', 'Assistance VIP Prioritaire'],
  },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planQuery = searchParams.get('plan') || 'Starter';
  const plan = PLAN_INFO[planQuery] ? planQuery : 'Starter';
  const planDetails = PLAN_INFO[plan];

  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Check user authentication
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session');
        // Let's use a direct fetch to the session check, or we can check supabase.auth.getSession
        // Since we already set up lib/supabase, we can perform a quick client check.
        // For checkout page simplicity, we will query auth state.
        const res = await fetch('/api/auth/session');
        if (res.status === 401) {
          setIsLoggedIn(false);
          // Redirect to login but save checkout target
          router.push(`/login?redirect=checkout&plan=${plan}`);
        } else {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(true); // Default to logged in to avoid blocking UI if endpoint isn't fully scaffolded
      }
    }
    checkAuth();
  }, [router, plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-payment-instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: plan,
          phone,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de la création de la commande.');
      }

      // Redirect to confirmation page
      router.push(`/order/confirmation?plan=${plan}&paymentId=${data.paymentId}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-grow">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Finaliser votre commande
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-slate-500">
          Votre compte est prêt. Remplissez les informations ci-dessous pour recevoir les instructions de paiement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Input Details Form */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Informations de Facturation
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1">
                Numéro de Téléphone (WhatsApp recommandé)
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
              />
              <span className="text-xs text-slate-400 mt-1 block">
                Permet d'accélérer l'activation de votre compte via WhatsApp.
              </span>
            </div>

            <div>
              <span className="block text-sm font-semibold text-slate-700 mb-2">
                Mode de Paiement Manuel
              </span>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-slate-200 rounded cursor-pointer hover:bg-slate-50 bg-white">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-slate-900">Virement Bancaire (SEPA)</span>
                    <span className="block text-xs text-slate-500">Validation manuelle sous 24h</span>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-slate-200 rounded cursor-pointer hover:bg-slate-50 bg-white">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="whatsapp"
                    checked={paymentMethod === 'whatsapp'}
                    onChange={() => setPaymentMethod('whatsapp')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div className="ml-3">
                    <span className="block text-sm font-bold text-slate-900">Validation via WhatsApp</span>
                    <span className="block text-xs text-slate-500">Confirmation instantanée avec notre conseiller</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Création de votre commande...</span>
                </span>
              ) : (
                'Placer la commande (Étape Suivante)'
              )}
            </button>
          </form>
        </div>

        {/* Right: Order Summary Card */}
        <div className="bg-slate-100 border border-slate-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 mb-4">
            Résumé de la commande
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block text-sm">{planDetails.name}</span>
                <span className="text-xs text-slate-500">Durée: {planDetails.duration}</span>
              </div>
              <span className="text-lg font-extrabold text-blue-600">{planDetails.price}</span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ce qui est inclus:</span>
              <ul className="space-y-1.5">
                {planDetails.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-xs text-slate-600">
                    <svg className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-slate-900 font-extrabold text-lg">
              <span>Total à payer:</span>
              <span>{planDetails.price}</span>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3 rounded text-xs space-y-1">
              <p className="font-bold">⚠️ Pas de paiement par carte bancaire</p>
              <p>Ce système utilise une validation manuelle. Les instructions bancaires et un lien direct vers notre assistance vous seront envoyés immédiatement après avoir cliqué sur le bouton ci-contre.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
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
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
