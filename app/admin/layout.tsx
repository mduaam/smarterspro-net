import React from 'react';
import { redirect } from 'next/navigation';
import { createServerSideClient } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSideClient();

  // 1. Authenticate user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    redirect('/login');
  }

  // 2. Enforce admin role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md bg-white border border-red-200 rounded p-6 text-center">
          <h1 className="text-xl font-bold text-red-700">Accès Refusé</h1>
          <p className="text-slate-500 text-sm mt-2">
            Vous ne possédez pas les autorisations nécessaires pour accéder à l'interface d'administration.
          </p>
          <div className="mt-4">
            <Link
              href="/dashboard"
              className="inline-flex text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded transition-colors"
            >
              Retour à mon espace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800">
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
            <span>Smarters Admin</span>
            <span className="text-[9px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase">V2</span>
          </Link>
        </div>

        <nav className="flex-grow p-4 space-y-1.5 text-sm font-semibold">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Tableau de bord</span>
          </Link>
          <Link 
            href="/admin/subscriptions" 
            className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Abonnements & Virement</span>
          </Link>
          <Link 
            href="/admin/customers" 
            className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Portail CRM Clients</span>
          </Link>
          <Link 
            href="/admin/chat" 
            className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Live Support Chat</span>
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
          >
            <span>Paramètres Banque</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs flex flex-col gap-2">
          <Link 
            href="/dashboard" 
            className="text-slate-400 hover:text-white flex items-center justify-between"
          >
            <span>Mon Espace Client</span>
            <span>&rarr;</span>
          </Link>
          <Link 
            href="/" 
            className="text-slate-400 hover:text-white flex items-center justify-between"
          >
            <span>Retourner au site</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700">Administration Système</h2>
          <div className="text-xs text-slate-500 font-semibold">
            Rôle: Super Administrateur
          </div>
        </header>

        <div className="flex-grow p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
