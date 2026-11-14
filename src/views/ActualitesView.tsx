import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { EventItem, NewsItem } from '../data/mockData';
import { AgendaCalendar } from '../components/AgendaCalendar';
import { getFeedCategoryLabel } from '../components/NewsFeed';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Download,
  Share2,
  PlusCircle,
  Send,
  X,
  BookOpen,
} from 'lucide-react';

type EventFilterTab = 'A_VENIR' | 'CONFERENCES' | 'NETWORKING' | 'RETOURS';

export const ActualitesView: React.FC = () => {
  const {
    events,
    news,
    photos,
    promotions,
    registerForEvent,
    addToast,
    addNewsItem,
    currentRole,
    currentUser,
  } = useApp();

  const [activeEventTab, setActiveEventTab] = useState<EventFilterTab>('A_VENIR');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const [pubTitle, setPubTitle] = useState('');
  const [pubCategory, setPubCategory] = useState<'ANNONCES' | 'EVENEMENTS' | 'REUSSITE'>('EVENEMENTS');
  const [pubSummary, setPubSummary] = useState('');
  const [pubContent, setPubContent] = useState('');

  const canPublishNews =
    currentRole === 'ADMIN' ||
    currentRole === 'SUPER_ADMIN' ||
    currentRole === 'RESPONSABLE_COMM' ||
    currentRole === 'DELEGUE';

  const heroEvent = events[0];

  const filteredEvents = useMemo(() => {
    if (activeEventTab === 'A_VENIR') return events;
    if (activeEventTab === 'CONFERENCES') return events.filter((e) => e.type === 'CONFERENCE');
    if (activeEventTab === 'NETWORKING') {
      return events.filter((e) => e.type === 'NETWORKING' || e.type === 'GALA' || e.type === 'RETROUVAILLES');
    }
    return [];
  }, [events, activeEventTab]);

  const handleDownloadCalendar = (ev: EventItem) => {
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ALGB//Bingerville//FR\nBEGIN:VEVENT\nSUMMARY:${ev.title}\nDESCRIPTION:${ev.summary}\nLOCATION:${ev.location}, ${ev.city}\nSTATUS:CONFIRMED\nEND:VEVENT\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'Calendrier mis à jour', 'Le fichier .ics a été téléchargé.');
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('info', 'Lien copié', 'Le lien de l’article a été copié dans le presse-papier.');
    }
  };

  const handlePublishQuickNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pubTitle.trim() || !pubSummary.trim()) return;
    addNewsItem({
      title: pubTitle.trim(),
      category: pubCategory,
      author: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Rédaction ALGB',
      summary: pubSummary.trim(),
      content: pubContent.trim() || pubSummary.trim(),
      imageUrl: '/assets/images/alumni_gala_networking_1794580776213.jpg',
      isImportant: false,
    });
    setPubTitle('');
    setPubSummary('');
    setPubContent('');
    setPublishModalOpen(false);
  };

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen transition-colors">
      {/* En-tête Événements & Magazine — Terracotta & Blanc Albâtre */}
      <section className="bg-[#FFF7ED] dark:bg-[#221712] border-b border-[#C2410C]/15 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#C2410C] dark:text-orange-400 inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Vie du Réseau & Magazine Alumni</span>
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#141413] dark:text-white">
                Événements, Galas & Portraits
              </h1>
              <p className="text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                Retrouvez le calendrier des grands rendez-vous de l’ALGB, inscrivez-vous aux
                conférences et explorez nos dossiers rédactionnels sur les parcours d’anciens.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="px-4 py-2.5 rounded-lg bg-white dark:bg-[#1e1e1c] border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-semibold cursor-pointer hover:border-[#C2410C]"
              >
                {showCalendar ? 'Masquer le calendrier' : 'Vue calendrier mensuel'}
              </button>
              {canPublishNews && (
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(true)}
                  className="px-4 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publier un article</span>
                </button>
              )}
            </div>
          </div>

          {/* Carte Héroïque du prochain événement majeur avec badge date en Terracotta Intense (#C2410C) */}
          {heroEvent && (
            <div className="bg-white dark:bg-[#1e1e1c] rounded-xl overflow-hidden shadow-editorial border border-black/5 dark:border-white/10 grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-full min-h-[300px]">
                <img
                  src={heroEvent.imageUrl}
                  alt={heroEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 px-3.5 py-2 rounded-lg bg-[#C2410C] text-white text-xs font-semibold shadow-md">
                  {heroEvent.date}
                </div>
              </div>

              <div className="lg:col-span-6 p-7 sm:p-10 flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#C2410C] dark:text-orange-400">
                    Événement Majeur à la Une
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#141413] dark:text-white leading-snug">
                    {heroEvent.title}
                  </h2>
                  <p className="text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                    {heroEvent.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#4A4A48] dark:text-zinc-400 pt-1">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#C2410C] dark:text-orange-400" />
                      <span>{heroEvent.time}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#C2410C] dark:text-orange-400" />
                      <span>
                        {heroEvent.location}, {heroEvent.city}
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#C2410C] dark:text-orange-400" />
                      <span>{heroEvent.attendeesCount} inscrits</span>
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => registerForEvent(heroEvent.id)}
                    className="px-6 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                  >
                    S’inscrire ({heroEvent.attendeesCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadCalendar(heroEvent)}
                    className="px-4 py-3 rounded-lg border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-medium inline-flex items-center gap-1.5 hover:bg-[#F8F8F6] dark:hover:bg-white/5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ajouter à mon agenda (.ics)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {showCalendar && (
          <AgendaCalendar
            events={events}
            promotions={promotions}
            onRegisterEvent={registerForEvent}
            onDownloadIcs={handleDownloadCalendar}
          />
        )}

        {/* Onglets de filtrage (À venir, Conférences, Networking, Retours en images) */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-4">
            <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white">
              Agenda & Retours en Images
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'A_VENIR', label: 'À venir' },
                { id: 'CONFERENCES', label: 'Conférences' },
                { id: 'NETWORKING', label: 'Networking' },
                { id: 'RETOURS', label: 'Retours en images' },
              ].map((tab) => {
                const active = activeEventTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveEventTab(tab.id as EventFilterTab)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#C2410C] text-white'
                        : 'bg-white dark:bg-[#1e1e1c] text-[#141413] dark:text-zinc-200 border border-black/10 dark:border-white/10 hover:border-[#C2410C]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {activeEventTab === 'RETOURS' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <figure
                  key={photo.id}
                  className="bg-white dark:bg-[#1e1e1c] rounded-xl overflow-hidden shadow-editorial border border-black/5 dark:border-white/10 flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#C2410C] text-white text-[10px] font-semibold uppercase">
                      {photo.year}
                    </span>
                  </div>
                  <figcaption className="p-5 space-y-1.5">
                    <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white">
                      {photo.title}
                    </h3>
                    <p className="text-xs text-[#4A4A48] dark:text-zinc-400 leading-relaxed">
                      {photo.caption}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((ev) => (
                <article
                  key={ev.id}
                  className="bg-white dark:bg-[#1e1e1c] rounded-xl overflow-hidden shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={ev.imageUrl}
                        alt={ev.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#C2410C] text-white text-[10px] font-semibold">
                        {ev.date}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-[#C2410C] dark:text-orange-400">
                        {ev.type.replace('_', ' ')}
                      </div>
                      <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white leading-snug">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                        {ev.summary}
                      </p>
                      <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400 space-y-1 pt-1">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
                          <span>{ev.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
                          <span className="truncate">
                            {ev.location} · {ev.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                      {ev.attendeesCount} participants
                    </span>
                    <button
                      type="button"
                      onClick={() => registerForEvent(ev.id)}
                      className="px-4 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      S’inscrire
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Section Articles & Portraits d'Anciens Élèves au style Magazine */}
        <section className="space-y-8">
          <div className="border-b border-black/10 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#C2410C] dark:text-orange-400 inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Le Magazine ALGB</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                Articles & Portraits d’Anciens Élèves
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item) => (
              <article
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-white dark:bg-[#1e1e1c] rounded-xl overflow-hidden shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold uppercase tracking-wider text-[#C2410C] dark:text-orange-400">
                        {getFeedCategoryLabel(item.category)}
                      </span>
                      <span className="text-[#4A4A48] dark:text-zinc-400">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white group-hover:text-[#C2410C] dark:group-hover:text-[#F2B705] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#4A4A48] dark:text-zinc-300 leading-relaxed line-clamp-3 font-editorial">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#4A4A48] dark:text-zinc-400 truncate pr-2">{item.author}</span>
                  <span className="font-semibold text-[#141413] dark:text-[#F2B705] shrink-0">
                    Lire le dossier →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Modal Lecture Article Magazine */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1e1e1c] rounded-xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 my-8">
            <div className="relative h-64">
              <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                aria-label="Fermer"
                className="absolute top-4 right-4 p-2 rounded-full bg-white text-[#141413] shadow cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs text-[#4A4A48] dark:text-zinc-400 border-b border-black/10 dark:border-white/10 pb-3">
                <span className="font-semibold uppercase tracking-wider text-[#C2410C] dark:text-orange-400">
                  {getFeedCategoryLabel(selectedNews.category)}
                </span>
                <span>
                  {selectedNews.date} · {selectedNews.author}
                </span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white">
                {selectedNews.title}
              </h2>
              <p className="text-sm font-editorial italic text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                {selectedNews.summary}
              </p>
              <div className="text-sm text-[#141413] dark:text-zinc-200 leading-relaxed pt-2 border-t border-black/10 dark:border-white/10">
                {selectedNews.content}
              </div>
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleShare(selectedNews.title)}
                  className="px-3.5 py-2 rounded-lg border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedNews(null)}
                  className="px-5 py-2 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Publication Article */}
      {publishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
                Publier un article / portrait
              </h3>
              <button
                type="button"
                onClick={() => setPublishModalOpen(false)}
                className="p-1 text-[#4A4A48] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handlePublishQuickNews} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Titre de l'article *"
                value={pubTitle}
                onChange={(e) => setPubTitle(e.target.value)}
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 rounded-lg p-2.5 text-[#141413] dark:text-white"
              />
              <select
                value={pubCategory}
                onChange={(e) => setPubCategory(e.target.value as 'ANNONCES' | 'EVENEMENTS' | 'REUSSITE')}
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 rounded-lg p-2.5 text-[#141413] dark:text-white"
              >
                <option value="EVENEMENTS">Événements</option>
                <option value="REUSSITE">Portrait & Réussite</option>
                <option value="ANNONCES">Annonces</option>
              </select>
              <textarea
                rows={2}
                required
                placeholder="Chapô de présentation *"
                value={pubSummary}
                onChange={(e) => setPubSummary(e.target.value)}
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 rounded-lg p-2.5 text-[#141413] dark:text-white"
              />
              <textarea
                rows={4}
                placeholder="Corps de l'article..."
                value={pubContent}
                onChange={(e) => setPubContent(e.target.value)}
                className="w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 rounded-lg p-2.5 text-[#141413] dark:text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="px-4 py-2 text-[#4A4A48] cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#F2B705] text-[#141413] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
