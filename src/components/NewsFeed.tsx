import React, { useMemo, useState } from 'react';
import { NewsItem } from '../data/mockData';
import {
  Award,
  CalendarDays,
  Clock,
  Megaphone,
  Newspaper,
  Search,
  Share2,
  X,
} from 'lucide-react';

export type NewsFeedCategory = 'ALL' | 'EVENEMENTS' | 'ANNONCES' | 'REUSSITE';

interface NewsFeedProps {
  news: NewsItem[];
  onSelectNews: (item: NewsItem) => void;
  onShare: (title: string) => void;
}

export const resolveFeedCategory = (
  category: NewsItem['category']
): Exclude<NewsFeedCategory, 'ALL'> => {
  switch (category) {
    case 'EVENEMENTS':
    case 'VIE_AMICALE':
      return 'EVENEMENTS';
    case 'REUSSITE':
    case 'EXCELLENCE':
    case 'HISTOIRE':
      return 'REUSSITE';
    case 'ANNONCES':
    case 'COMMUNIQUE':
    case 'SOLIDARITE':
    default:
      return 'ANNONCES';
  }
};

export const getFeedCategoryLabel = (
  category: NewsItem['category']
): string => {
  const normalized = resolveFeedCategory(category);
  if (normalized === 'EVENEMENTS') return 'Événements';
  if (normalized === 'REUSSITE') return 'Réussite';
  return 'Annonces';
};

const formatFrenchDate = (isoDate: string): string => {
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const estimateReadMinutes = (content: string): number => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 180));
};

export const NewsFeed: React.FC<NewsFeedProps> = ({
  news,
  onSelectNews,
  onShare,
}) => {
  const [activeCategory, setActiveCategory] = useState<NewsFeedCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedNews = useMemo(
    () =>
      [...news].sort((a, b) =>
        b.date.localeCompare(a.date)
      ),
    [news]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<NewsFeedCategory, number> = {
      ALL: sortedNews.length,
      EVENEMENTS: 0,
      ANNONCES: 0,
      REUSSITE: 0,
    };

    sortedNews.forEach((item) => {
      const cat = resolveFeedCategory(item.category);
      counts[cat] += 1;
    });

    return counts;
  }, [sortedNews]);

  const filteredNews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedNews.filter((item) => {
      const matchesCategory =
        activeCategory === 'ALL' ||
        resolveFeedCategory(item.category) === activeCategory;

      if (!matchesCategory) return false;
      if (!query) return true;

      return (
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query)
      );
    });
  }, [sortedNews, activeCategory, searchQuery]);

  const filterOptions: {
    id: NewsFeedCategory;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'ALL',
      label: 'Toutes',
      icon: <Newspaper className="w-3.5 h-3.5" />,
    },
    {
      id: 'EVENEMENTS',
      label: 'Événements',
      icon: <CalendarDays className="w-3.5 h-3.5" />,
    },
    {
      id: 'ANNONCES',
      label: 'Annonces',
      icon: <Megaphone className="w-3.5 h-3.5" />,
    },
    {
      id: 'REUSSITE',
      label: 'Réussite',
      icon: <Award className="w-3.5 h-3.5" />,
    },
  ];

  const featuredArticle = filteredNews.length > 0 ? filteredNews[0] : null;
  const remainingArticles =
    filteredNews.length > 1 ? filteredNews.slice(1) : [];

  const getCategoryBadgeClasses = (category: NewsItem['category']) => {
    const normalized = resolveFeedCategory(category);
    if (normalized === 'EVENEMENTS') {
      return 'bg-[#FFF7ED] dark:bg-[#1a1310] text-[#C2410C] dark:text-[#FDBA74] border-[#C2410C]/25 dark:border-[#C2410C]/40';
    }
    if (normalized === 'REUSSITE') {
      return 'bg-[#141413] text-[#F2B705] border-[#141413] dark:border-white/15';
    }
    return 'bg-[#F8F8F6] dark:bg-[#141413] text-[#141413] dark:text-zinc-200 border-[#141413]/15 dark:border-white/15';
  };

  return (
    <section className="space-y-6 pt-4" aria-label="Flux d'actualités ALGB">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#141413]/10 dark:border-white/10 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#C2410C] dark:text-[#FDBA74]">
            Fil d’Information en Direct
          </span>
          <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
            Flux d’Actualités & Dernières Nouvelles
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#4A4A48] dark:text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une actualité..."
              aria-label="Rechercher dans le flux d'actualités"
              className="w-full pl-9 pr-8 py-2 text-xs bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 rounded-lg text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none focus:border-[#C2410C] dark:focus:border-[#F2B705] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Effacer la recherche"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4A4A48] hover:text-[#141413] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs text-[#4A4A48] dark:text-zinc-400 font-medium whitespace-nowrap tabular-nums">
            {filteredNews.length} publication{filteredNews.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div
        className="flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filtrer les actualités par catégorie"
      >
        {filterOptions.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#C2410C] text-white shadow-xs border border-[#C2410C]'
                  : 'bg-white dark:bg-[#1e1e1c] text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white hover:bg-[#FFF7ED] dark:hover:bg-white/10 border border-[#141413]/10 dark:border-white/10'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono tabular-nums ${
                  isActive
                    ? 'bg-white/20 text-white font-bold'
                    : 'bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-400 border border-[#141413]/10 dark:border-white/10'
                }`}
              >
                {categoryCounts[cat.id]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl shadow-editorial p-10 text-center space-y-3">
          <Newspaper className="w-8 h-8 text-[#4A4A48] dark:text-zinc-500 mx-auto" />
          <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white">
            Aucune actualité trouvée
          </h3>
          <p className="text-xs text-[#4A4A48] dark:text-zinc-400 max-w-md mx-auto">
            Aucune publication ne correspond à votre filtre actuel. Réinitialisez les critères pour afficher toutes les dernières nouvelles.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Afficher toutes les actualités
          </button>
        </div>
      )}

      {/* Featured Latest Story */}
      {featuredArticle && (
        <article
          onClick={() => onSelectNews(featuredArticle)}
          className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl overflow-hidden shadow-editorial hover:border-[#C2410C]/60 dark:hover:border-[#F2B705] transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-5 relative h-56 sm:h-64 lg:h-full min-h-[240px] bg-[#F8F8F6] dark:bg-[#141413] overflow-hidden">
            <img
              src={featuredArticle.imageUrl}
              alt={featuredArticle.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#F2B705] text-[#141413] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                À la une
              </span>
              {featuredArticle.isImportant && (
                <span className="px-2.5 py-1 rounded-md bg-[#C2410C] text-white text-[10px] font-bold uppercase shadow-sm">
                  Urgent / Officiel
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold uppercase tracking-wide ${getCategoryBadgeClasses(
                    featuredArticle.category
                  )}`}
                >
                  {getFeedCategoryLabel(featuredArticle.category)}
                </span>
                <span className="text-[#4A4A48] dark:text-zinc-400 font-medium">
                  {formatFrenchDate(featuredArticle.date)}
                </span>
                <span className="text-[#4A4A48]/40 dark:text-zinc-600">·</span>
                <span className="text-[#4A4A48] dark:text-zinc-400 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {estimateReadMinutes(featuredArticle.content)} min de lecture
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#141413] dark:text-white group-hover:text-[#C2410C] dark:group-hover:text-[#F2B705] transition-colors leading-snug">
                {featuredArticle.title}
              </h3>

              <p className="text-sm text-[#4A4A48] dark:text-zinc-400 leading-relaxed line-clamp-3">
                {featuredArticle.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-[#141413]/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#4A4A48] dark:text-zinc-400 font-medium">
                Publié par <strong className="text-[#141413] dark:text-white">{featuredArticle.author}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare(featuredArticle.title);
                  }}
                  aria-label={`Partager ${featuredArticle.title}`}
                  className="p-2 bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#FFF7ED] dark:hover:bg-white/10 border border-[#141413]/15 dark:border-white/15 rounded-lg text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 bg-[#F2B705] group-hover:bg-[#dfa704] text-[#141413] text-xs font-bold rounded-lg transition-colors">
                  Lire l’article →
                </span>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* Remaining Feed Cards */}
      {remainingArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingArticles.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectNews(item)}
              className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl overflow-hidden hover:border-[#C2410C]/60 dark:hover:border-[#F2B705] shadow-editorial transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#F8F8F6] dark:bg-[#141413]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.isImportant && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-[#C2410C] text-white text-[10px] font-bold uppercase shadow-sm">
                      Urgent / Officiel
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#4A4A48] dark:text-zinc-400">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getCategoryBadgeClasses(
                        item.category
                      )}`}
                    >
                      {getFeedCategoryLabel(item.category)}
                    </span>
                    <span>{formatFrenchDate(item.date)}</span>
                  </div>

                  <h3 className="text-base font-bold font-heading text-[#141413] dark:text-white group-hover:text-[#C2410C] dark:group-hover:text-[#F2B705] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#4A4A48] dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-[#141413]/10 dark:border-white/10 bg-[#F8F8F6] dark:bg-[#141413] flex items-center justify-between text-[11px] text-[#4A4A48] dark:text-zinc-400">
                <span className="truncate pr-2">{item.author}</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare(item.title);
                    }}
                    aria-label={`Partager ${item.title}`}
                    className="p-1.5 text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white hover:bg-white dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[#C2410C] dark:text-[#F2B705] font-semibold group-hover:translate-x-0.5 transition-transform">
                    Lire →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
