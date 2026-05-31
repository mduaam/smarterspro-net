import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const POSTS = [
  {
    slug: 'configurer-smarters-pro-smart-tv',
    title: 'Comment configurer IPTV Smarters Pro sur Smart TV Samsung & LG',
    desc: 'Découvrez notre guide complet étape par étape pour installer et activer l\'application IPTV Smarters Pro directement sur votre téléviseur connecté sans aucun boîtier externe.',
    date: '28 Mai 2026',
    category: 'Tutoriels',
    readTime: '4 min de lecture'
  },
  {
    slug: 'eviter-coupures-iptv-conseils',
    title: '5 Astuces pour éviter les micro-coupures et le buffering en 4K',
    desc: 'Des saccades régulières sur vos flux sportifs ? Appliquez ces configurations réseau simples (DNS, filaire, bande passante) pour retrouver une stabilité de diffusion optimale.',
    date: '15 Mai 2026',
    category: 'Optimisation',
    readTime: '6 min de lecture'
  },
  {
    slug: 'comparatif-meilleures-applications-iptv',
    title: 'Comparatif : Les meilleures applications IPTV en 2026',
    desc: 'Smarters Pro, IBO Player, IPTV Stream Player ou XCIPTV ? Découvrez notre analyse détaillée des meilleures applications de lecture Xtream et M3U du marché.',
    date: '02 Mai 2026',
    category: 'Guides',
    readTime: '5 min de lecture'
  }
];

export const metadata = {
  title: 'Blog Officiel — IPTV Smarters Pro Conseils & Astuces',
  description: 'Retrouvez nos guides d\'installation, tutoriels de configuration et conseils réseau pour profiter au mieux de votre abonnement IPTV 4K stable.',
};

export default function BlogFeedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      {/* Universal Navigation */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full">
        {/* Page Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4 uppercase tracking-wider">
            Guides & Tutoriels
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight leading-none">
            Notre Blog IPTV
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed">
            Consultez nos articles et astuces rédigés par nos techniciens pour configurer, optimiser et savourer vos flux de streaming en ultra haute définition.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {POSTS.map((post, idx) => (
            <article 
              key={idx} 
              className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {post.category}
                </span>
                <span>&bull;</span>
                <span>{post.date}</span>
              </div>
              
              <h2 className="text-xl font-black text-slate-900 leading-snug mb-3 hover:text-blue-600 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 flex-grow font-medium">
                {post.desc}
              </p>

              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-400">
                  {post.readTime}
                </span>
                <Link 
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center"
                >
                  Lire l'article &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Universal Footer */}
      <Footer />
    </div>
  );
}
