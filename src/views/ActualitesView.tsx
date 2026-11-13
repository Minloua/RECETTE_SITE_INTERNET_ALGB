import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewsItem, EventItem } from '../data/mockData';
import { NewsFeed, getFeedCategoryLabel } from '../components/NewsFeed';
import { AgendaCalendar } from '../components/AgendaCalendar';
import {
  Bell,
  BellOff,
  BellRing,
  Calendar,
  MapPin,
  PlusCircle,
  Send,
  Share2,
  Download,
  X,
} from 'lucide-react';

export const ActualitesView: React.FC = () => {
  const {
    news,
    events,
    promotions,
    registerForEvent,
    addToast,
    addNewsItem,
    currentRole,
    currentUser,
    newsAlertsEnabled,
    toggleNewsAlerts,
    browserPushPermission,
    requestBrowserPushPermission,
    focusedNewsId,
    setFocusedNewsId,
    triggerNewsNotification,
  } = useApp();

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [pubTitle, setPubTitle] = useState('');
  const [pubCategory, setPubCategory] = useState<'ANNONCES' | 'EVENEMENTS' | 'REUSSITE'>('ANNONCES');
  const [pubAuthor, setPubAuthor] = useState(
    currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Cellule Communication ALGB'
  );
  const [pubSummary, setPubSummary] = useState('');
  const [pubContent, setPubContent] = useState('');
  const [pubIsImportant, setPubIsImportant] = useState(true);

  const canPublishNews =
    currentRole === 'ADMIN' ||
    currentRole === 'SUPER_ADMIN' ||
    currentRole === 'RESPONSABLE_COMM' ||
    currentRole === 'DELEGUE';

  // Auto-open article when user clicks "Lire l'actualité" from ToastContainer or browser push
  useEffect(() => {
    if (!focusedNewsId) return;
    const match = news.find((item) => item.id === focusedNewsId);
    if (match) {
      setSelectedNews(match);
    }
    setFocusedNewsId(null);
  }, [focusedNewsId, news, setFocusedNewsId]);

  const handlePublishQuickNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubSummary.trim()) return;

    const imageByCategory: Record<'ANNONCES' | 'EVENEMENTS' | 'REUSSITE', string> = {
      ANNONCES: '/assets/images/bingerville_lycee_campus_1794382827777.jpg',
      EVENEMENTS: '/assets/images/alumni_reunion_ceremony_1794382829849.jpg',
      REUSSITE: '/assets/images/school_library_excellence_1794382830305.jpg',
    };

    addNewsItem({
      title: pubTitle.trim(),
      category: pubCategory,
      author: pubAuthor.trim() || 'Cellule Communication ALGB',
      summary: pubSummary.trim(),
      content: pubContent.trim() || pubSummary.trim(),
      imageUrl: imageByCategory[pubCategory],
      isImportant: pubIsImportant,
    });

    setPubTitle('');
    setPubSummary('');
    setPubContent('');
    setPublishModalOpen(false);
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('info', 'Lien copié dans le presse-papier', 'Vous pouvez le partager sur vos groupes WhatsApp de promotion.');
    }
  };

  const handleDownloadCalendar = (ev: EventItem) => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ALGB//Lycée de Garçons de Bingerville//FR
BEGIN:VEVENT
SUMMARY:${ev.title}
DESCRIPTION:${ev.summary}
LOCATION:${ev.location}, ${ev.city}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Événement ajouté', 'Fichier .ics téléchargé pour votre calendrier.');
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
              Information & Rayonnement
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white mt-1">
              Actualités & Agenda Officiel
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl mt-1">
              « Communiqués du Bureau Exécutif, vie des promotions, cérémonies et événements du lycée. »
            </p>
          </div>

          {canPublishNews && (
            <button
              type="button"
              onClick={() => setPublishModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E5B824] hover:bg-[#dcae1f] text-black text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier une actualité</span>
            </button>
          )}
        </div>

        {/* Live Push / ToastContainer Alerts Bar */}
        <section
          aria-label="Système d'alertes et notifications d'actualités"
          className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                newsAlertsEnabled
                  ? 'bg-black dark:bg-[#E5B824] text-[#E5B824] dark:text-black border-black dark:border-[#E5B824]'
                  : 'bg-white dark:bg-zinc-950 text-gray-400 dark:text-zinc-500 border-gray-300 dark:border-zinc-700'
              }`}
            >
              {newsAlertsEnabled ? (
                <BellRing className="w-5 h-5" />
              ) : (
                <BellOff className="w-5 h-5" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-heading font-bold text-black dark:text-white">
                  Alertes & Notifications d’Actualités en Temps Réel
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    newsAlertsEnabled
                      ? 'bg-yellow-50 dark:bg-yellow-500/15 text-[#B8860B] dark:text-[#E5B824] border border-yellow-200 dark:border-yellow-500/30'
                      : 'bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400'
                  }`}
                >
                  {newsAlertsEnabled ? 'Alertes ToastContainer actives' : 'Alertes en pause'}
                </span>
                {browserPushPermission === 'granted' && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Push navigateur actif
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                Recevez automatiquement une alerte interactive dès qu’une nouvelle actualité ALGB est publiée.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleNewsAlerts}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                newsAlertsEnabled
                  ? 'bg-white dark:bg-zinc-950 text-black dark:text-white border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  : 'bg-[#E5B824] text-black border-[#E5B824] hover:bg-[#dcae1f]'
              }`}
            >
              {newsAlertsEnabled ? (
                <>
                  <BellOff className="w-3.5 h-3.5" />
                  <span>Mettre en pause</span>
                </>
              ) : (
                <>
                  <Bell className="w-3.5 h-3.5" />
                  <span>Activer les alertes</span>
                </>
              )}
            </button>

            {browserPushPermission !== 'granted' && (
              <button
                type="button"
                onClick={requestBrowserPushPermission}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-950 text-black dark:text-white border border-gray-300 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
                <span>Activer Push Navigateur</span>
              </button>
            )}

            {news.length > 0 && (
              <button
                type="button"
                onClick={() => triggerNewsNotification(news[0])}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-black dark:bg-zinc-800 hover:bg-gray-800 dark:hover:bg-zinc-700 text-[#E5B824] border border-transparent dark:border-zinc-700 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Tester l’alerte</span>
              </button>
            )}
          </div>
        </section>

        {/* Featured Agenda Ribbon */}
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#B8860B] dark:text-[#E5B824]" />
              <h2 className="text-lg font-heading font-bold text-black dark:text-white">
                Événements à Venir & Inscriptions
              </h2>
            </div>
            <span className="text-xs text-gray-500 dark:text-zinc-400">{events.length} événements programmés</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-zinc-700 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/85 text-[10px] font-bold text-[#E5B824] uppercase">
                      {ev.type.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="text-xs text-[#B8860B] dark:text-[#E5B824] font-semibold flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{ev.date} · {ev.time}</span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-black dark:text-white leading-snug">
                      {ev.title}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed">
                      {ev.summary}
                    </p>

                    <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleDownloadCalendar(ev)}
                    className="text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Calendrier (.ics)</span>
                  </button>

                  <button
                    onClick={() => registerForEvent(ev.id)}
                    className="px-3.5 py-1.5 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] transition-all cursor-pointer shadow-xs text-xs"
                  >
                    Confirmer ({ev.attendeesCount})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Calendar Component */}
        <AgendaCalendar
          events={events}
          promotions={promotions}
          onRegisterEvent={registerForEvent}
          onDownloadIcs={handleDownloadCalendar}
        />

        {/* News Feed Component */}
        <NewsFeed
          news={news}
          onSelectNews={setSelectedNews}
          onShare={handleShare}
        />

        {/* Quick Publish News Modal inside ActualitesView */}
        {publishModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
              <div className="px-6 py-4 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
                  <h3 className="text-base font-heading font-bold text-black dark:text-white">
                    Publier une Nouvelle Actualité ALGB
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  aria-label="Fermer"
                  className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handlePublishQuickNews} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-black dark:text-white mb-1">
                    Titre de l’actualité *
                  </label>
                  <input
                    type="text"
                    required
                    value={pubTitle}
                    onChange={(e) => setPubTitle(e.target.value)}
                    placeholder="Ex : Ouverture des inscriptions au Dîner de Gala 2026"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-black dark:text-white mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={pubCategory}
                      onChange={(e) =>
                        setPubCategory(e.target.value as 'ANNONCES' | 'EVENEMENTS' | 'REUSSITE')
                      }
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950"
                    >
                      <option value="ANNONCES">Annonces</option>
                      <option value="EVENEMENTS">Événements</option>
                      <option value="REUSSITE">Réussite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-black dark:text-white mb-1">
                      Organe / Auteur
                    </label>
                    <input
                      type="text"
                      value={pubAuthor}
                      onChange={(e) => setPubAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-black dark:text-white focus:outline-none focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-black dark:text-white mb-1">
                    Résumé (affiché dans l’alerte et le flux) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={pubSummary}
                    onChange={(e) => setPubSummary(e.target.value)}
                    placeholder="Synthèse claire de la nouvelle..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950"
                  />
                </div>

                <div>
                  <label className="block font-bold text-black dark:text-white mb-1">
                    Contenu détaillé
                  </label>
                  <textarea
                    rows={4}
                    value={pubContent}
                    onChange={(e) => setPubContent(e.target.value)}
                    placeholder="Détails complets de la publication..."
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 font-editorial focus:outline-none focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pubIsImportant}
                    onChange={(e) => setPubIsImportant(e.target.checked)}
                    className="rounded border-gray-300 dark:border-zinc-700 text-[#E5B824] focus:ring-[#E5B824]"
                  />
                  <span>Marquer comme publication urgente / officielle</span>
                </label>

                <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPublishModalOpen(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-black dark:text-white font-semibold rounded-lg cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#E5B824] hover:bg-[#dcae1f] text-black font-bold rounded-lg cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publier et notifier</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Selected News Article Modal */}
        {selectedNews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8">
              <div className="relative h-64 sm:h-72 bg-gray-100 dark:bg-zinc-800">
                <img
                  src={selectedNews.imageUrl}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <button
                  onClick={() => setSelectedNews(null)}
                  aria-label="Fermer"
                  className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-zinc-900/90 hover:bg-white dark:hover:bg-zinc-800 rounded-full text-black dark:text-white shadow-md cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800 pb-3">
                  <span className="text-[#B8860B] dark:text-[#E5B824] font-bold uppercase tracking-wide">
                    {getFeedCategoryLabel(selectedNews.category)}
                  </span>
                  <span>{selectedNews.date} · Source : {selectedNews.author}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-heading text-black dark:text-white">
                  {selectedNews.title}
                </h2>

                <p className="text-sm text-gray-800 dark:text-zinc-200 font-editorial leading-relaxed">
                  {selectedNews.summary}
                </p>

                <div className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 font-editorial leading-relaxed pt-2 border-t border-gray-200 dark:border-zinc-800">
                  {selectedNews.content}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleShare(selectedNews.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#B8860B] dark:text-[#E5B824]" />
                    <span>Partager sur les réseaux</span>
                  </button>

                  <button
                    onClick={() => setSelectedNews(null)}
                    className="px-4 py-1.5 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
