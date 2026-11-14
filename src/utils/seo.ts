import type { NavigationTab } from '../context/AppContext';

interface SeoMetaEntry {
  title: string;
  description: string;
}

const SEO_BY_TAB: Record<NavigationTab, SeoMetaEntry> = {
  accueil: {
    title: 'ALGB Alumni — Réseau Officiel du Lycée de Garçons de Bingerville',
    description:
      'Portail officiel de l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (Côte d’Ivoire). Annuaire, mentorat, carrières et mécénat depuis 1903.',
  },
  amicale: {
    title: 'L’Amicale & Gouvernance | ALGB Alumni Bingerville',
    description:
      'Découvrez les missions, le bureau exécutif, les statuts officiels et les rapports annuels de l’Amicale des Anciens Élèves du LGB.',
  },
  histoire: {
    title: 'Histoire & Patrimoine depuis 1903 | ALGB Alumni',
    description:
      'Explorez plus d’un siècle d’excellence académique, d’archives photographiques et de mémoire du Lycée de Garçons de Bingerville.',
  },
  anciens: {
    title: 'Annuaire des Membres & Promotions | ALGB Alumni',
    description:
      'Recherchez les anciens élèves par promotion, secteur ou pays et parcourez la carte mondiale de la diaspora ALGB.',
  },
  reseau: {
    title: 'Carrières au Cœur du Réseau | ALGB Alumni',
    description:
      'Consultez les offres de stages, d’alternance, de CDI et de direction partagées exclusivement par les membres à jour du réseau ALGB.',
  },
  mentorat: {
    title: 'Mentorat & Collège des Parrains | ALGB Alumni',
    description:
      'Connectez-vous avec les cadres dirigeants et parrains du Lycée de Garçons de Bingerville pour accélérer votre parcours professionnel.',
  },
  actualites: {
    title: 'Événements, Galas & Actualités | ALGB Alumni',
    description:
      'Suivez le calendrier des retrouvailles, galas annuels, conférences et l’actualité officielle de l’Amicale.',
  },
  projets: {
    title: 'Mécénat, Bourses & Projets en FCFA | ALGB Alumni',
    description:
      'Soutenez en franc CFA les bourses d’excellence, la bibliothèque numérique et les chantiers du Lycée de Garçons de Bingerville.',
  },
  mediatheque: {
    title: 'Médiathèque & Archives ALGB TV | ALGB Alumni',
    description:
      'Revivez en images et vidéos les cérémonies, remises de prix, retrouvailles et grands moments de l’ALGB.',
  },
  galerie: {
    title: 'Médiathèque & Archives ALGB TV | ALGB Alumni',
    description:
      'Revivez en images et vidéos les cérémonies, remises de prix, retrouvailles et grands moments de l’ALGB.',
  },
  adhesion: {
    title: 'Adhésion & Enrôlement en Ligne | ALGB Alumni',
    description:
      'Rejoignez officiellement l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville et obtenez votre carte QR.',
  },
  contact: {
    title: 'Contact & Secrétariat Général | ALGB Alumni',
    description:
      'Contactez le secrétariat général de l’ALGB à Bingerville pour vos questions d’adhésion, partenariats et mécénat.',
  },
  'espace-membre': {
    title: 'Espace Membre, Cotisations & Carte QR | ALGB Alumni',
    description:
      'Suivez vos cotisations en FCFA, téléchargez votre quitus annuel et affichez votre carte officielle avec QR Code certifié.',
  },
  admin: {
    title: 'Console d’Administration & Trésorerie | ALGB Alumni',
    description:
      'Gestion des membres, trésorerie en FCFA, projets solidaires, communication et habilitations du portail ALGB.',
  },
  'mentions-legales': {
    title: 'Mentions Légales | ALGB Alumni Bingerville',
    description:
      'Informations légales, statut associatif (Loi n° 60-315) et coordonnées officielles de l’Amicale du LGB.',
  },
  confidentialite: {
    title: 'Politique de Confidentialité & Conformité ARTCI | ALGB Alumni',
    description:
      'Protection des données personnelles conforme à la loi n° 2013-450 (ARTCI Côte d’Ivoire) et droits des adhérents ALGB.',
  },
  cgu: {
    title: 'Conditions Générales d’Utilisation & Mécénat | ALGB Alumni',
    description:
      'Règles d’utilisation du portail, modalités des cotisations statutaires en FCFA et transparence des dons de mécénat.',
  },
};

function upsertMeta(attrName: 'name' | 'property', key: string, content: string): void {
  if (typeof document === 'undefined') return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attrName}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applySeoForTab(tab: NavigationTab): void {
  if (typeof document === 'undefined') return;
  const meta = SEO_BY_TAB[tab] || SEO_BY_TAB.accueil;

  document.title = meta.title;
  upsertMeta('name', 'description', meta.description);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:site_name', 'ALGB Alumni');
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);

  const canonicalUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}`
      : 'https://algb-bingerville.ci/';

  upsertMeta('property', 'og:url', canonicalUrl);

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', canonicalUrl);

  const ldScriptId = 'algb-schema-jsonld';
  let ldScript = document.getElementById(ldScriptId) as HTMLScriptElement | null;
  if (!ldScript) {
    ldScript = document.createElement('script');
    ldScript.id = ldScriptId;
    ldScript.type = 'application/ld+json';
    document.head.appendChild(ldScript);
  }

  ldScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB)',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://algb-bingerville.ci',
        foundingDate: '1903',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'BP 24 Bingerville',
          addressLocality: 'Bingerville',
          addressRegion: 'Abidjan',
          addressCountry: 'CI',
        },
        email: 'contact@algb-bingerville.ci',
      },
      {
        '@type': 'WebPage',
        name: meta.title,
        description: meta.description,
        url: canonicalUrl,
        inLanguage: 'fr-CI',
      },
    ],
  });
}
