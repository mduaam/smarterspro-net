import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">Smarters Pro</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Le portail officiel de souscription pour l'application IPTV Smarters Pro. Profitez d'une diffusion haute définition stable et fluide sur tous vos appareils.
            </p>
          </div>

          {/* Navigation Directory */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Tarifs & Offres</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Notre Blog</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support Technique</Link></li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="hover:text-white transition-colors">Conditions Générales</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Données Personnelles</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Assistance</h4>
            <p className="text-sm">
              Des questions ? Notre équipe d'assistance est à votre service par WhatsApp ou directement via ticket support.
            </p>
            <div className="pt-2 text-sm font-medium text-slate-200">
              WhatsApp: +33 6 12 34 56 78
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs">
          <p>&copy; {new Date().getFullYear()} Smarters Pro Clone Officiel. Tous droits réservés.</p>
          <p className="mt-2 sm:mt-0">Portail Jamstack optimisé pour les performances et le SEO.</p>
        </div>
      </div>
    </footer>
  );
}
