'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientSideClient } from '@/lib/supabase-client';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SupportPage() {
  const router = useRouter();
  const supabase = createClientSideClient();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate session on load
  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsLoggedIn(false);
        router.push('/login?redirect=support');
      } else {
        setIsLoggedIn(true);
        setUserId(session.user.id);
      }
    }
    checkSession();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError("Le sujet et le message ne peuvent pas être vides.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userId!,
          subject: subject.trim(),
          message: message.trim(),
          priority,
          status: 'open',
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess(true);
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de l'envoi du ticket.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Dynamic Header */}
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex-grow w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Créer un Ticket d'Assistance
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Notre équipe technique et commerciale vous répond sous 1 à 2 heures.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 shadow-sm">
          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 border border-green-200 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Ticket envoyé avec succès !</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                Un conseiller a été notifié de votre demande et l'étudie en priorité. Vous recevrez une réponse sous peu.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => setSuccess(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Envoyer un autre ticket
                </button>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors"
                >
                  Retour au tableau de bord
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded font-medium">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 mb-1">
                  Sujet / Objet de votre demande
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Confirmation de virement Starter Plan"
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label htmlFor="priority" className="block text-xs font-semibold text-slate-700 mb-1">
                  Niveau d'Urgence
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                >
                  <option value="low">Faible - Question générale</option>
                  <option value="medium">Moyenne - Problème technique</option>
                  <option value="high">Élevée - Urgence activation/virement</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                  Détail de votre message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Expliquez en détail votre demande (et ajoutez la référence de commande si nécessaire)..."
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 font-medium"
                />
              </div>

              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-3.5 rounded text-xs leading-relaxed">
                <strong>Conseil d'activation rapide:</strong> Si vous venez de procéder à un virement manuel bancaire, veuillez inscrire l'intitulé de votre compte, la référence de commande, et l'heure du virement dans ce message pour faciliter notre vérification.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="px-4 py-2.5 border border-slate-300 rounded text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    "Envoyer ma demande"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
