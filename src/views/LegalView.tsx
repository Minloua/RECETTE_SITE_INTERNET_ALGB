import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import {
  ShieldCheck,
  Scale,
  FileText,
  Lock,
  Mail,
  MapPin,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const LegalView: React.FC = () => {
  const { activeTab, setActiveTab, settings, currentRole } = useApp();

  const currentDoc: 'mentions-legales' | 'confidentialite' | 'cgu' =
    activeTab === 'confidentialite'
      ? 'confidentialite'
      : activeTab === 'cgu'
      ? 'cgu'
      : 'mentions-legales';

  const navItems: { tab: NavigationTab; id: typeof currentDoc; label: string; icon: React.ReactNode }[] = [
    {
      tab: 'mentions-legales',
      id: 'mentions-legales',
      label: 'Mentions légales (Loi 60-315)',
      icon: <Scale className="w-4 h-4" />,
    },
    {
      tab: 'confidentialite',
      id: 'confidentialite',
      label: 'Confidentialité & ARTCI (Loi 2013-450)',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      tab: 'cgu',
      id: 'cgu',
      label: 'CGU, Cotisations & Mécénat (FCFA)',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen text-[#141413] dark:text-[#F8F8F6] transition-colors">
      {/* Header institutionnel Noir Carbone / Bleu Outremer */}
      <section className="bg-[#16324F] text-white border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705]">
            <ShieldCheck className="w-4 h-4" />
            <span>Conformité Juridique & Protection des Données</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-heading font-bold text-white leading-tight">
            {currentDoc === 'mentions-legales' && 'Mentions Légales & Statut Associatif'}
            {currentDoc === 'confidentialite' &&
              'Politique de Confidentialité & Conformité ARTCI'}
            {currentDoc === 'cgu' &&
              'Conditions Générales d’Utilisation, Cotisations & Mécénat'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-200 max-w-2xl leading-relaxed">
            Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB) · Association
            régie par la loi ivoirienne n° 60-315 du 21 septembre 1960 et conforme à la loi
            n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel.
          </p>

          {/* Switcher */}
          <div className="flex flex-wrap gap-2 pt-2">
            {navItems.map((item) => {
              const active = currentDoc === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.tab)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#F2B705] text-[#141413]'
                      : 'bg-white/10 text-zinc-100 hover:bg-white/20'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <article className="bg-white dark:bg-[#1e1e1c] rounded-xl border border-[#141413]/10 dark:border-white/10 p-6 sm:p-10 shadow-editorial space-y-6 text-xs sm:text-sm leading-relaxed text-[#4A4A48] dark:text-zinc-300">
          {currentDoc === 'mentions-legales' && (
            <>
              <div className="space-y-2 pb-4 border-b border-black/10 dark:border-white/10">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  1. Éditeur du Portail Officiel
                </h2>
                <p>
                  Le présent portail est édité par l’<strong>Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB)</strong>,
                  association apolitique et à but non lucratif régie par la{' '}
                  <strong>loi n° 60-315 du 21 septembre 1960</strong> relative aux associations en
                  République de Côte d’Ivoire.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8F8F6] dark:bg-[#141413] p-5 rounded-xl border border-black/10 dark:border-white/10">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#16324F] dark:text-[#F2B705] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Siège social</span>
                  </div>
                  <p className="font-semibold text-[#141413] dark:text-white">
                    Lycée Classique & Moderne de Garçons de Bingerville
                  </p>
                  <p className="text-xs">BP 24 Bingerville, District Autonome d’Abidjan, Côte d’Ivoire</p>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-[#16324F] dark:text-[#F2B705] flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Direction de la publication & DPO</span>
                  </div>
                  <p className="font-semibold text-[#141413] dark:text-white">
                    Le Bureau Exécutif National de l’ALGB
                  </p>
                  <p className="text-xs font-mono">{settings.officialEmail} · +225 27 22 40 12 00</p>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  2. Propriété intellectuelle & Emblèmes
                </h2>
                <p>
                  L’appellation « ALGB », le blason historique du Lycée de Garçons de Bingerville (fondé en 1903),
                  les archives photographiques, les cartes numériques et les contenus éditoriaux sont la
                  propriété exclusive de l’ALGB. Toute reproduction non autorisée à des fins commerciales est
                  strictement prohibée.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  3. Hébergement & Sécurité des Sessions
                </h2>
                <p>
                  Les échanges applicatifs sont protégés par chiffrement TLS, hachage scrypt des secrets
                  d’authentification, cookies de session <code className="font-mono">HttpOnly</code> et
                  signatures cryptographiques HMAC-SHA256 pour les cartes d’adhérent et quittances QR.
                </p>
              </div>
            </>
          )}

          {currentDoc === 'confidentialite' && (
            <>
              <div className="p-4 rounded-xl bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/40 text-[#141413] dark:text-[#FEF8E6] flex items-start gap-3">
                <Lock className="w-5 h-5 text-[#16324F] dark:text-[#F2B705] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="block font-semibold">
                    Conformité ARTCI — Loi n° 2013-450 du 19 juin 2013 (Côte d’Ivoire)
                  </strong>
                  <span>
                    En vertu de la réglementation de l’Autorité de Régulation des Télécommunications/TIC
                    de Côte d’Ivoire (ARTCI), chaque ancien élève dispose d’un contrôle total sur la
                    visibilité de ses coordonnées et de droits d’accès, de portabilité et d’anonymisation.
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  1. Finalités du traitement des données
                </h2>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Gestion administrative des adhésions, des promotions et de la carte officielle ALGB.</li>
                  <li>Animation de l’Annuaire des Anciens Élèves et de la Base de Données des Compétences (BDR).</li>
                  <li>Mise en relation professionnelle (Carrières) et programme de Mentorat intergénérationnel.</li>
                  <li>Suivi comptable des cotisations statutaires, dons de mécénat et délivrance de quitus en FCFA.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  2. Minimisation des données & Visibilité publique
                </h2>
                <p>
                  Les visiteurs non authentifiés n’ont jamais accès aux coordonnées personnelles (adresses
                  e-mail et numéros de téléphone) des anciens élèves. Seuls les membres connectés peuvent
                  consulter les coordonnées des pairs ayant expressément activé le partage dans leurs
                  préférences de confidentialité.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  3. Vos droits (Accès, Portabilité JSON & Anonymisation)
                </h2>
                <p>
                  À tout moment depuis votre Espace Membre (onglet « Édition du profil & Confidentialité ARTCI »)
                  ou sur demande écrite au Secrétariat Général ({settings.officialEmail}), vous pouvez :
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Modifier vos consentements d’affichage (e-mail, téléphone, disponibilité mentorat, BDR).</li>
                  <li>Télécharger l’intégralité de votre dossier personnel au format structuré JSON.</li>
                  <li>Demander l’anonymisation de vos données personnelles tout en préservant l’intégrité des écritures comptables légales.</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab(currentRole !== 'VISITEUR' ? 'espace-membre' : 'adhesion')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {currentRole !== 'VISITEUR'
                      ? 'Gérer mes droits ARTCI dans mon Espace Membre'
                      : 'Accéder à l’enrôlement ALGB'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {currentDoc === 'cgu' && (
            <>
              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  1. Devise officielle & Règles financières (FCFA)
                </h2>
                <p>
                  L’ensemble des droits d’adhésion ({settings.droitAdhesionAmount.toLocaleString('fr-FR')} FCFA),
                  cotisations mensuelles ({settings.cotisationMensuelleAmount.toLocaleString('fr-FR')} FCFA/mois)
                  et contributions de mécénat sont libellés et encaissés exclusivement en{' '}
                  <strong>Franc CFA (XOF / FCFA)</strong> via les opérateurs agréés de la zone UEMOA
                  (Wave CI, Orange Money, MTN MoMo, Moov Money), carte bancaire ou virement bancaire.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  2. Accès aux services privilégiés (Mentorat & Carrières)
                </h2>
                <p>
                  Conformément au Règlement Intérieur adopté en Assemblée Générale, la consultation
                  intégrale et le dépôt de candidatures dans les rubriques{' '}
                  <strong>Carrières au cœur du réseau</strong>, <strong>Trouver un Mentor</strong> et{' '}
                  <strong>Collège des Parrains</strong> sont réservés aux membres connectés et à jour de
                  leur cotisation annuelle {settings.fiscalYear}.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white">
                  3. Authenticité des Cartes & Quitus QR
                </h2>
                <p>
                  Chaque carte numérique d’adhérent et quittance officielle comporte un QR code signé
                  cryptographiquement (HMAC-SHA256). Le contrôle de validité lors des Assemblées Générales
                  et Galas s’effectue par vérification de la signature côté serveur.
                </p>
              </div>
            </>
          )}
        </article>
      </div>
    </div>
  );
};
