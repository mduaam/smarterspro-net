'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientSideClient } from '@/lib/supabase-client';

export function Header() {
  const supabase = createClientSideClient();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function getSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
          
          setIsAdmin(profile?.is_admin || false);
        }
      } catch (error) {
        // Safe fallback
      }
    }
    getSession();
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-blue-600">
            <span>Smarters Pro</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2 py-0.5 rounded">Officiel</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
          <Link href="/#pricing" className="hover:text-blue-600 transition-colors">Abonnements</Link>
          <Link href="/#features" className="hover:text-blue-600 transition-colors">Fonctionnalités</Link>
          <Link href="/#compatibility" className="hover:text-blue-600 transition-colors">Compatibilité</Link>
          <Link href="/#faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          {user && (
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Mon Espace</Link>
          )}
        </nav>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {isAdmin && (
                <Link 
                  href="/admin/dashboard" 
                  className="hidden sm:inline-flex text-xs bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold px-3 py-1.5 rounded transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
              >
                Espace Client
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                S'abonner
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
