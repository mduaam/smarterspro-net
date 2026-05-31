import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSideClient } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createServerSideClient();

  // 1. Authenticate user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    redirect('/login');
  }

  const userId = session.user.id;

  // 2. Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profile?.is_blocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white border border-red-200 rounded p-6 text-center">
          <h1 className="text-xl font-bold text-red-700">Compte Bloqué</h1>
          <p className="text-slate-500 text-sm mt-2">Votre compte a été bloqué par un administrateur. Veuillez contacter le support pour en savoir plus.</p>
        </div>
      </div>
    );
  }

  // 3. Fetch user subscriptions
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // 4. Fetch user payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // 5. Fetch user support tickets
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const activeSub = subscriptions?.find(sub => sub.status === 'active');
  const pendingSub = subscriptions?.find(sub => sub.status === 'pending_payment');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">Actif</span>;
      case 'pending_payment':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-amber-200">En attente de paiement</span>;
      case 'expired':
        return <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-slate-200">Expiré</span>;
      default:
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-red-200">Annulé</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">Confirmé</span>;
      case 'pending_confirmation':
        return <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded">Vérification en cours</span>;
      case 'pending_instruction':
        return <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">Instructions envoyées</span>;
      default:
        return <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">Échoué</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
        {/* Welcome Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bonjour, {profile?.full_name || 'Client'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gérez vos abonnements IPTV Smarters Pro et consultez votre historique de facturation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/support"
              className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-sm"
            >
              Assistance Technique
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        {/* Pending Activation Banner */}
        {pendingSub && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-amber-800 text-base">⚠️ Commande en attente de paiement manuel</h3>
                <p className="text-sm text-amber-700 mt-1">
                  Votre abonnement <span className="font-bold">{pendingSub.plan_type}</span> est enregistré. Veuillez finaliser votre transfert bancaire et nous envoyer le reçu par WhatsApp pour activer votre compte.
                </p>
              </div>
              <a
                href="https://wa.me/33612345678?text=Bonjour!%20Je%20souhaite%20activer%20mon%20abonnement%20en%20attente."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-colors"
              >
                Envoyer le reçu sur WhatsApp
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Subscriptions & Payments */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Subscription Summary */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Mon Abonnement IPTV Actif
              </h2>

              {activeSub ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Formule active</span>
                    <span className="text-lg font-extrabold text-slate-900">{activeSub.plan_type}</span>
                    <div className="mt-1">{getStatusBadge(activeSub.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Période de validité</span>
                    <span className="text-sm text-slate-700 block">
                      <strong>Début :</strong> {new Date(activeSub.current_period_start!).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="text-sm text-slate-700 block">
                      <strong>Fin / Expiration :</strong> {new Date(activeSub.current_period_end!).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500 text-sm">Vous n'avez aucun abonnement actif en cours.</p>
                  <Link
                    href="/#pricing"
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Souscrire maintenant
                  </Link>
                </div>
              )}
            </div>

            {/* Historical Payments Grid */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Historique des transactions
              </h2>

              {payments && payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 text-xs font-semibold uppercase">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Mode</th>
                        <th className="py-2.5">Montant</th>
                        <th className="py-2.5">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="py-3">{new Date(payment.created_at).toLocaleDateString('fr-FR')}</td>
                          <td className="py-3 capitalize">{payment.payment_method.replace('_', ' ')}</td>
                          <td className="py-3">{(payment.amount / 100).toFixed(2)} €</td>
                          <td className="py-3">{getPaymentStatusBadge(payment.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-sm text-center py-4">Aucune transaction enregistrée.</p>
              )}
            </div>
          </div>

          {/* Right Column: Support Ticket List */}
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <h2 className="text-lg font-extrabold text-slate-900">Mes tickets d'assistance</h2>
                <Link
                  href="/support"
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Nouveau
                </Link>
              </div>

              {tickets && tickets.length > 0 ? (
                <div className="space-y-3.5">
                  {tickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className="border border-slate-100 hover:border-slate-200 rounded p-4 flex flex-col bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-slate-500">
                          {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          ticket.status === 'open' 
                            ? 'bg-blue-100 text-blue-700' 
                            : ticket.status === 'in_progress' 
                            ? 'bg-amber-100 text-amber-700' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {ticket.status === 'in_progress' ? 'En cours' : ticket.status === 'open' ? 'Ouvert' : 'Résolu'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{ticket.subject}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{ticket.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm">
                  <p>Aucun ticket ouvert.</p>
                  <Link
                    href="/support"
                    className="mt-3 inline-flex text-xs font-bold bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded transition-colors"
                  >
                    Créer mon premier ticket
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
