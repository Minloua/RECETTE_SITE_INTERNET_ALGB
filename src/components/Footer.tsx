import React, { useState } from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ChevronRight,
  Send,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, subscribeNewsletter, settings } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNav = (tab: NavigationTab) => {
    setActiveTab(tab);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = subscribeNewsletter(newsletterEmail);
    if (ok) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#141413] text-zinc-300 border-t border-white/10 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Rappels Institutionnels (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
                alt="Blason ALGB"
                className="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-[#F2B705]/60 shrink-0"
              />
              <div>
                <h3 className="text-base font-heading font-bold text-white leading-snug">
                  ALGB · Lycée de Garçons de Bingerville
                </h3>
                <p className="text-xs text-[#F2B705] font-editorial italic">
                  « Une histoire, des générations, un même engagement. »
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-zinc-400">
              L’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville fédère les promotions
              en Côte d’Ivoire et dans la diaspora autour de la solidarité, du mentorat exécutif et du
              mécénat éducatif.
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>Statut associatif & Conformité ARTCI</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Association régie par la loi n° 60-315 du 21 septembre 1960 · Traitement des données conforme
                à la loi n° 2013-450 (Côte d’Ivoire).
              </p>
            </div>
          </div>

          {/* Column 2: Univers & Pages (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 border-b border-white/10 pb-2">
              Architecture du Réseau
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { tab: 'accueil' as NavigationTab, label: 'Accueil & Synthèse' },
                { tab: 'anciens' as NavigationTab, label: 'Annuaire des Membres' },
                { tab: 'reseau' as NavigationTab, label: 'Carrières & Recrutement' },
                { tab: 'mentorat' as NavigationTab, label: 'Programme de Mentorat' },
                { tab: 'actualites' as NavigationTab, label: 'Événements & Magazine' },
                { tab: 'projets' as NavigationTab, label: 'Mécénat & Bourses' },
                { tab: 'espace-membre' as NavigationTab, label: 'Espace Membre' },
              ].map((link) => (
                <li key={link.tab}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.tab)}
                    className="text-zinc-300 hover:text-[#F2B705] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-[#F2B705]" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Siège & Coordonnées (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 border-b border-white/10 pb-2">
              Secrétariat Général
            </h4>
            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
                <span>BP 24 Bingerville, District Autonome d’Abidjan, Côte d’Ivoire</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span className="truncate">{settings.officialEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F2B705] shrink-0" />
                <span>+225 27 22 40 12 00</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleNav('contact')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F2B705] hover:underline cursor-pointer pt-1"
            >
              <span>Écrire au secrétariat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column 4: Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-zinc-400 border-b border-white/10 pb-2">
              Lettre d’Information Alumni
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Recevez chaque mois les appels à projets de bourses, les offres exécutives et le calendrier des galas.
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-xl bg-white/10 border border-[#F2B705]/40 text-xs text-white flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#F2B705] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">Abonnement enregistré</div>
                  <p className="text-[11px] text-zinc-300 mt-0.5">
                    Vous êtes inscrit à la lettre mensuelle de l’ALGB.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2.5">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Adresse e-mail pour la newsletter
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="votre.email@exemple.ci"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#F2B705]"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-[#141413]" />
                  <span>S’abonner à la newsletter</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/10 bg-[#0d0d0c] py-4 px-4 sm:px-6 lg:px-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              type="button"
              onClick={() => handleNav('mentions-legales')}
              className="hover:text-[#F2B705] transition-colors cursor-pointer"
            >
              Mentions légales (Loi 60-315)
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <button
              type="button"
              onClick={() => handleNav('confidentialite')}
              className="hover:text-[#F2B705] transition-colors cursor-pointer"
            >
              Confidentialité & ARTCI
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <button
              type="button"
              onClick={() => handleNav('cgu')}
              className="hover:text-[#F2B705] transition-colors cursor-pointer"
            >
              CGU & Mécénat
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <button
              type="button"
              onClick={() => handleNav('amicale')}
              className="hover:text-[#F2B705] transition-colors cursor-pointer"
            >
              Statuts & Gouvernance
            </button>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <button
              type="button"
              onClick={() => handleNav('histoire')}
              className="hover:text-[#F2B705] transition-colors cursor-pointer"
            >
              Patrimoine 1903
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
