import type { NavigationTab } from '../context/AppContext';

export const TAB_TO_PATH: Record<NavigationTab, string> = {
  accueil: '/',
  amicale: '/institution',
  histoire: '/histoire',
  anciens: '/annuaire',
  reseau: '/carrieres',
  mentorat: '/mentorat',
  actualites: '/evenements',
  projets: '/mecenat',
  mediatheque: '/mediatheque',
  galerie: '/mediatheque',
  adhesion: '/adhesion',
  contact: '/contact',
  'espace-membre': '/espace-membre',
  admin: '/admin',
  'mentions-legales': '/mentions-legales',
  confidentialite: '/confidentialite',
  cgu: '/cgu',
};

const PATH_TO_TAB: Record<string, NavigationTab> = {
  '/': 'accueil',
  '/accueil': 'accueil',
  '/institution': 'amicale',
  '/amicale': 'amicale',
  '/histoire': 'histoire',
  '/annuaire': 'anciens',
  '/promotions': 'anciens',
  '/carrieres': 'reseau',
  '/reseau': 'reseau',
  '/mentorat': 'mentorat',
  '/evenements': 'actualites',
  '/actualites': 'actualites',
  '/mecenat': 'projets',
  '/projets': 'projets',
  '/mediatheque': 'mediatheque',
  '/galerie': 'mediatheque',
  '/adhesion': 'adhesion',
  '/contact': 'contact',
  '/espace-membre': 'espace-membre',
  '/admin': 'admin',
  '/mentions-legales': 'mentions-legales',
  '/confidentialite': 'confidentialite',
  '/cgu': 'cgu',
};

export function resolveTabFromPath(pathname: string): NavigationTab {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return PATH_TO_TAB[normalized.toLowerCase()] || 'accueil';
}
