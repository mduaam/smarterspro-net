'use client';

import React, { useState, useEffect } from 'react';
import { createClientSideClient } from '@/lib/supabase-client';

export default function AdminSubscriptionsPage() {
  const supabase = createClientSideClient();

  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Validation actions
  const [confirmingPay, setConfirmingPay] = useState<any | null>(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch payments list
  async function fetchPayments() {
    setLoading(true);
    try {
      let query = supabase
        .from('payments')
        .select(`
          *,
          subscription:subscriptions(*),
          user:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (filter === 'pending') {
        query = query.eq('status', 'pending_confirmation');
      } else if (filter === 'confirmed') {
        query = query.eq('status', 'confirmed');
      }

      const { data, error } = await query;
      if (error) throw error;
      setPayments(data || []);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmingPay) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/confirm-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: confirmingPay.id,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la validation.');
      }

      setMessage({ type: 'success', text: 'Paiement confirmé et abonnement activé avec succès.' });
      setConfirmingPay(null);
      setNotes('');
      fetchPayments();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Une erreur est survenue.' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">Confirmé</span>;
      case 'pending_confirmation':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded">À confirmer</span>;
      case 'pending_instruction':
        return <span className="bg-slate-100 text-slate-800 text-xs font-semibold px-2 py-0.5 rounded">Instruction</span>;
      default:
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-0.5 rounded">Échoué</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Abonnements & Virements</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez le statut de facturation et activez manuellement les formules des clients.</p>
        </div>

        {/* Filter Switcher */}
        <div className="flex bg-slate-200 p-1 rounded-md text-xs font-bold text-slate-600 gap-1 self-start sm:self-center">
          <button 
            onClick={() => setFilter('all')} 
            className={`px-3 py-1.5 rounded transition-all ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            Tous
          </button>
          <button 
            onClick={() => setFilter('pending')} 
            className={`px-3 py-1.5 rounded transition-all ${filter === 'pending' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            En attente ({payments.filter(p => p.status === 'pending_confirmation').length})
          </button>
          <button 
            onClick={() => setFilter('confirmed')} 
            className={`px-3 py-1.5 rounded transition-all ${filter === 'confirmed' ? 'bg-white text-slate-900 shadow-sm' : ''}`}
          >
            Validés
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 border rounded text-sm font-semibold ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmingPay && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-none z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full p-6 shadow-xl animate-in fade-in duration-100">
            <h3 className="font-extrabold text-slate-900 text-lg border-b border-slate-100 pb-3 mb-4">
              Valider le virement bancaire
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Vous êtes sur le point de confirmer la réception de <strong>{(confirmingPay.amount / 100).toFixed(2)} €</strong> pour la formule <strong>{confirmingPay.subscription?.plan_type}</strong> de <strong>{confirmingPay.user?.full_name}</strong>.
            </p>
            <form onSubmit={handleConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes internes d'activation (Facultatif)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Justificatif virement reçu par WhatsApp, référence SEPA ok"
                  rows={3}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setConfirmingPay(null); setNotes(''); }}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition-colors flex items-center justify-center"
                >
                  {actionLoading ? 'Validation...' : 'Confirmer et Activer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid Container */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-55 border-b border-slate-200">
                <tr className="text-left text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Client</th>
                  <th className="px-6 py-3.5">Contact (Téléphone)</th>
                  <th className="px-6 py-3.5">Plan</th>
                  <th className="px-6 py-3.5">Montant</th>
                  <th className="px-6 py-3.5">Méthode</th>
                  <th className="px-6 py-3.5">Statut</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                {payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(pay.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(pay as any).user?.full_name || 'Client'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">{(pay as any).user?.phone || 'Non renseigné'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(pay as any).subscription?.plan_type || 'Starter'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{(pay.amount / 100).toFixed(2)} €</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{pay.payment_method.replace('_', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(pay.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      {pay.status === 'pending_confirmation' ? (
                        <button
                          onClick={() => setConfirmingPay(pay)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded transition-colors"
                        >
                          Confirmer Réception
                        </button>
                      ) : pay.status === 'confirmed' ? (
                        <span className="text-slate-400 font-bold">Activé</span>
                      ) : (
                        <span className="text-slate-400 font-semibold">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            Aucun historique de paiement à afficher.
          </div>
        )}
      </div>
    </div>
  );
}
