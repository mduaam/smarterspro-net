import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const POSTS_DATA: Record<string, {
  title: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}> = {
  'configurer-smarters-pro-smart-tv': {
    title: 'Comment configurer IPTV Smarters Pro sur Smart TV Samsung & LG',
    category: 'Tutoriels',
    date: '28 Mai 2026',
    readTime: '4 min de lecture',
    content: [
      'L\'application IPTV Smarters Pro est sans conteste le lecteur de flux Xtream le plus populaire et le plus convivial du marché. Si vous possédez un téléviseur connecté Samsung (Tizen OS) ou LG (webOS), l\'installation ne prend que quelques minutes.',
      'Étape 1 : Téléchargement de l\'application. Allumez votre Smart TV et rendez-vous sur le magasin d\'applications officiel (Samsung App Store ou LG Content Store). Recherchez "IPTV Smarters Pro" ou "Smarters Player Lite" et installez l\'application gratuite.',
      'Étape 2 : Lancement et choix de l\'API. Ouvrez l\'application sur votre téléviseur. Vous serez invité à accepter les conditions d\'utilisation, puis vous arriverez sur l\'écran d\'accueil de connexion. Sélectionnez l\'option "Connexion avec l\'API Xtream Codes". C\'est la méthode la plus rapide et la plus stable.',
      'Étape 3 : Saisie de vos identifiants. Saisissez les quatre champs requis de votre abonnement Smarters Pro Officiel : \n1. Nom de la playlist (mettez ce que vous voulez, ex: "Smarters Pro")\n2. Nom d\'utilisateur (envoyé dans vos accès)\n3. Mot de passe (envoyé dans vos accès)\n4. URL du serveur (ex: http://serveur-officiel.com:8080)',
      'Étape 4 : Chargement des listes. Cliquez sur "Add User". L\'application va télécharger les chaînes de télévision en direct, les films et les séries en quelques secondes. Une fois le téléchargement terminé, vous accédez à l\'interface officielle et pouvez commencer à regarder en HD/4K !'
    ]
  },
  'eviter-coupures-iptv-conseils': {
    title: '5 Astuces pour éviter les micro-coupures et le buffering en 4K',
    category: 'Optimisation',
    date: '15 Mai 2026',
    readTime: '6 min de lecture',
    content: [
      'Rien n\'est plus frustrant qu\'une coupure d\'image ou un chargement infini (buffering) en plein milieu d\'un match en direct ou d\'une scène d\'action en haute définition. Voici les recommandations de nos techniciens pour éliminer ces désagréments.',
      'Astuce 1 : Privilégiez une connexion filaire Ethernet. Le WiFi est sujet aux perturbations électromagnétiques de votre environnement. En reliant directement votre Smart TV ou votre box Android à votre routeur internet avec un câble RJ45, vous divisez par 10 les pertes de paquets de données.',
      'Astuce 2 : Modifiez vos DNS pour ceux de Google ou Cloudflare. Les serveurs DNS de votre fournisseur d\'accès internet (Orange, SFR, Free, Bouygues) sont parfois lents ou censurent certains flux de diffusion. Configurez les serveurs DNS suivants sur votre appareil : \n- Google : 8.8.8.8 et 8.8.4.4\n- Cloudflare : 1.1.1.1 et 1.0.0.1',
      'Astuce 3 : Vérifiez votre bande passante réelle. Assurez-vous d\'avoir au moins 15 Mbps de débit stable pour de la Full HD, et 25 Mbps pour de la 4K. Vous pouvez tester votre débit sur fast.com directement depuis le navigateur de votre appareil.',
      'Astuce 4 : Videz le cache de l\'application. Les applications accumulent des données de playlist temporaires qui ralentissent le décodeur vidéo. Allez dans les paramètres de votre appareil, section Applications, choisissez IPTV Smarters Pro, et cliquez sur "Vider le cache".'
    ]
  },
  'comparatif-meilleures-applications-iptv': {
    title: 'Comparatif : Les meilleures applications IPTV en 2026',
    category: 'Guides',
    date: '02 Mai 2026',
    readTime: '5 min de lecture',
    content: [
      'Le choix du lecteur de flux est déterminant pour la fluidité, l\'organisation des catégories et le rendu visuel de votre abonnement. Comparatif détaillé des quatre applications les plus utilisées en 2026.',
      '1. IPTV Smarters Pro (Note: 9.5/10) : C\'est la référence universelle. Elle offre une interface extrêmement intuitive divisée en trois blocs (Live, Movies, Series), supporte le multi-écrans, le replay et permet de télécharger des guides de programmes électroniques (EPG). Elle est gratuite et disponible partout.',
      '2. IBO Player (Note: 9/10) : Une excellente application payante (environ 8€ pour une licence à vie) réputée pour sa vitesse de chargement instantanée et sa compatibilité optimale avec les Smart TV de dernière génération.',
      '3. XCIPTV (Note: 8.5/10) : Un lecteur minimaliste très apprécié pour son interface sombre ressemblant à un décodeur câble classique. Très stable mais possède moins d\'options de personnalisation que Smarters Pro.',
      'Conclusion : Pour la majorité des utilisateurs, l\'application officielle IPTV Smarters Pro reste le choix numéro un pour allier simplicité, gratuité et richesse fonctionnelle.'
    ]
  }
};

export async function generateStaticParams() {
  return Object.keys(POSTS_DATA).map((slug) => ({ slug }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS_DATA[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans antialiased text-slate-800">
      {/* Navbar Header */}
      <Header />

      {/* Main post display */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex-grow w-full">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center mb-8"
        >
          &larr; Retour au blog
        </Link>

        {/* Metadata Header */}
        <div className="flex items-center space-x-3 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
          <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            {post.category}
          </span>
          <span>&bull;</span>
          <span>{post.date}</span>
          <span>&bull;</span>
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight mb-8">
          {post.title}
        </h1>

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none text-slate-600 font-medium text-sm sm:text-base leading-relaxed space-y-6">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA Conversion Box inside Article */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <h3 className="text-lg font-black text-blue-900 mb-2">Prêt à tester l'IPTV Smarters Pro Officiel ?</h3>
          <p className="text-xs sm:text-sm text-blue-700 leading-relaxed mb-6 max-w-md mx-auto">
            Profitez de plus de 20 000 chaînes de télévision et 95 000 VOD en 4K avec notre serveur européen ultra stable et sans coupure.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/#pricing" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-sm text-xs uppercase tracking-wider transition-colors"
            >
              Découvrir nos offres
            </Link>
            <Link 
              href="/support" 
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded shadow-sm text-xs uppercase tracking-wider transition-colors"
            >
              Essai de 24 heures
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
