import React, { useMemo, useState } from 'react';
import { EventItem, Promotion } from '../data/mockData';
import {
  Calendar as CalendarIcon,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  MapPin,
  Users,
} from 'lucide-react';

export type CalendarEntryKind = 'EVENT' | 'PROMO' | 'MILESTONE';
export type CalendarFilterKind = 'ALL' | CalendarEntryKind;

export interface CalendarEntry {
  id: string;
  isoDate: string; // YYYY-MM-DD
  kind: CalendarEntryKind;
  title: string;
  subtitle?: string;
  time?: string;
  location?: string;
  description: string;
  badgeLabel: string;
  eventRef?: EventItem;
  promotionRef?: Promotion;
}

interface AgendaCalendarProps {
  events: EventItem[];
  promotions: Promotion[];
  onRegisterEvent: (eventId: string) => void;
  onDownloadIcs: (ev: EventItem) => void;
}

const FRENCH_MONTHS: Record<string, number> = {
  janvier: 0,
  fevrier: 1,
  février: 1,
  mars: 2,
  avril: 3,
  mai: 4,
  juin: 5,
  juillet: 6,
  aout: 7,
  août: 7,
  septembre: 8,
  octobre: 9,
  novembre: 10,
  decembre: 11,
  décembre: 11,
};

const MONTH_NAMES_FR = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const WEEKDAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

const pad2 = (n: number) => String(n).padStart(2, '0');

export const toIsoDate = (year: number, monthIndex: number, day: number): string =>
  `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;

export const parseFrenchDateToIso = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})$/);
  if (!match) return null;

  const day = Number(match[1]);
  const monthKey = match[2].toLowerCase();
  const year = Number(match[3]);
  const monthIndex = FRENCH_MONTHS[monthKey];

  if (monthIndex === undefined || Number.isNaN(day) || Number.isNaN(year)) {
    return null;
  }

  return toIsoDate(year, monthIndex, day);
};

const formatFullFrenchDate = (isoDate: string): string => {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const formatted = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

const STATIC_ALGB_MILESTONES: CalendarEntry[] = [
  {
    id: 'mile-cotisations-2026',
    isoDate: '2026-11-30',
    kind: 'MILESTONE',
    title: 'Clôture de régularisation des cotisations 2026',
    subtitle: 'Trésorerie Générale ALGB',
    time: 'Toute la journée',
    location: 'Espace Membre en ligne & Trésorerie',
    description:
      'Date limite recommandée pour apurer les cotisations mensuelles 2026 et obtenir le quitus électoral avant l’Assemblée Générale.',
    badgeLabel: 'Échéance Statutaire',
  },
  {
    id: 'mile-candidatures-ag',
    isoDate: '2026-12-10',
    kind: 'MILESTONE',
    title: 'Clôture du dépôt des candidatures — Bureau Exécutif',
    subtitle: 'Commission Électorale Indépendante',
    time: '18h00',
    location: 'Secrétariat Général ALGB / En ligne',
    description:
      'Fin de réception des listes et dossiers de candidature pour le renouvellement du Bureau Exécutif lors de l’AG Élective.',
    badgeLabel: 'Gouvernance',
  },
  {
    id: 'mile-bourses-2026',
    isoDate: '2026-12-15',
    kind: 'MILESTONE',
    title: 'Clôture de la campagne Fonds des Bourses d’Excellence',
    subtitle: 'Commission Solidarité & Mérite',
    time: '23h59',
    location: 'Lycée de Garçons de Bingerville',
    description:
      'Clôture de la collecte annuelle destinée aux 25 élèves boursiers internes méritants du Lycée.',
    badgeLabel: 'Solidarité',
  },
  {
    id: 'mile-voeux-2027',
    isoDate: '2027-01-09',
    kind: 'MILESTONE',
    title: 'Cérémonie des Vœux & Rentrée Solennelle de l’Amicale',
    subtitle: 'Présidence & Conseil des Doyens',
    time: '10h00 - 13h00',
    location: 'Maison des Anciens / Abidjan-Cocody',
    description:
      'Présentation de la feuille de route 2027 du Lycée du Futur et accueil officiel des nouveaux membres enrôlés au BDR.',
    badgeLabel: 'Date Clé ALGB',
  },
];

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({
  events,
  promotions,
  onRegisterEvent,
  onDownloadIcs,
}) => {
  const todayIso = useMemo(() => {
    const now = new Date();
    return toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [viewYear, setViewYear] = useState<number>(2026);
  const [viewMonth, setViewMonth] = useState<number>(10); // Novembre 2026 (0-indexed)
  const [selectedIso, setSelectedIso] = useState<string>('2026-12-19');
  const [filterKind, setFilterKind] = useState<CalendarFilterKind>('ALL');

  const allEntries = useMemo<CalendarEntry[]>(() => {
    const eventEntries: CalendarEntry[] = events
      .map((ev) => {
        const isoDate = parseFrenchDateToIso(ev.date);
        if (!isoDate) return null;
        return {
          id: `cal-${ev.id}`,
          isoDate,
          kind: 'EVENT' as const,
          title: ev.title,
          subtitle: `${ev.attendeesCount} participant(s) inscrit(s)`,
          time: ev.time,
          location: `${ev.location}, ${ev.city}`,
          description: ev.description || ev.summary,
          badgeLabel: ev.type.replace(/_/g, ' '),
          eventRef: ev,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    const promoEntries: CalendarEntry[] = promotions
      .filter((p) => Boolean(p.nextReunionDate))
      .map((p) => ({
        id: `cal-promo-${p.year}`,
        isoDate: p.nextReunionDate as string,
        kind: 'PROMO' as const,
        title: `Retrouvailles Promotion ${p.year} — ${p.name}`,
        subtitle: `Délégué : ${p.delegateName}`,
        time: '15h00 - 19h00',
        location: 'Bingerville / Coordination de Promotion',
        description: `${p.motto}. ${p.description}`,
        badgeLabel: `Promo ${p.year}`,
        promotionRef: p,
      }));

    return [...eventEntries, ...promoEntries, ...STATIC_ALGB_MILESTONES].sort(
      (a, b) => a.isoDate.localeCompare(b.isoDate)
    );
  }, [events, promotions]);

  const filteredEntries = useMemo(() => {
    if (filterKind === 'ALL') return allEntries;
    return allEntries.filter((entry) => entry.kind === filterKind);
  }, [allEntries, filterKind]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    filteredEntries.forEach((entry) => {
      const existing = map.get(entry.isoDate) || [];
      existing.push(entry);
      map.set(entry.isoDate, existing);
    });
    return map;
  }, [filteredEntries]);

  const monthPrefix = `${viewYear}-${pad2(viewMonth + 1)}`;

  const monthEntries = useMemo(
    () => filteredEntries.filter((e) => e.isoDate.startsWith(monthPrefix)),
    [filteredEntries, monthPrefix]
  );

  const selectedDayEntries = useMemo(
    () => entriesByDate.get(selectedIso) || [],
    [entriesByDate, selectedIso]
  );

  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    // Convert JS Sunday=0..Saturday=6 into Monday=0..Sunday=6
    const startWeekday = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: {
      isoDate: string;
      dayNumber: number;
      inCurrentMonth: boolean;
    }[] = [];

    // Leading days from previous month
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({
        isoDate: toIsoDate(prevYear, prevMonth, d),
        dayNumber: d,
        inCurrentMonth: false,
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({
        isoDate: toIsoDate(viewYear, viewMonth, d),
        dayNumber: d,
        inCurrentMonth: true,
      });
    }

    // Trailing days to complete 6 rows or full weeks (35 or 42 cells)
    const totalCells = cells.length <= 35 ? 35 : 42;
    let nextDay = 1;
    while (cells.length < totalCells) {
      const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({
        isoDate: toIsoDate(nextYear, nextMonth, nextDay),
        dayNumber: nextDay,
        inCurrentMonth: false,
      });
      nextDay += 1;
    }

    return cells;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const jumpToDate = (isoDate: string) => {
    const [yStr, mStr] = isoDate.split('-');
    const y = Number(yStr);
    const m = Number(mStr) - 1;
    if (!Number.isNaN(y) && !Number.isNaN(m)) {
      setViewYear(y);
      setViewMonth(m);
      setSelectedIso(isoDate);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedIso(todayIso);
  };

  const quickMonthShortcuts = [
    { label: 'Nov 2026', year: 2026, month: 10 },
    { label: 'Déc 2026', year: 2026, month: 11 },
    { label: 'Jan 2027', year: 2027, month: 0 },
    { label: 'Fév 2027', year: 2027, month: 1 },
  ];

  const getChipClass = (kind: CalendarEntryKind) => {
    if (kind === 'EVENT') {
      return 'bg-[#F2B705] text-[#141413] font-bold';
    }
    if (kind === 'PROMO') {
      return 'bg-[#141413] dark:bg-[#1e1e1c] text-[#F2B705] border border-transparent dark:border-[#F2B705]/40 font-semibold';
    }
    return 'bg-[#FFF7ED] dark:bg-[#2a1d17] text-[#C2410C] dark:text-[#fb923c] border border-[#C2410C]/20 font-medium';
  };

  const getDotClass = (kind: CalendarEntryKind) => {
    if (kind === 'EVENT') return 'bg-[#F2B705] border border-[#141413]/20 dark:border-white/20';
    if (kind === 'PROMO') return 'bg-[#141413] dark:bg-white';
    return 'bg-[#C2410C]';
  };

  return (
    <section
      className="space-y-6"
      aria-label="Calendrier interactif de l'Amicale ALGB"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-4 border-b border-[#141413]/10 dark:border-white/10 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#C2410C] dark:text-[#fb923c]">
            Agenda Interactif
          </span>
          <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-0.5 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#C2410C] dark:text-[#fb923c]" />
            <span>Calendrier des Dates Clés & Événements ALGB</span>
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'ALL', label: 'Tout afficher' },
            { id: 'EVENT', label: 'Événements officiels' },
            { id: 'PROMO', label: 'Réunions de promo' },
            { id: 'MILESTONE', label: 'Dates clés statutaires' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilterKind(opt.id as CalendarFilterKind)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterKind === opt.id
                  ? 'bg-[#C2410C] text-white'
                  : 'bg-white dark:bg-[#1e1e1c] text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white border border-[#141413]/15 dark:border-white/15'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calendar + Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Month Calendar Grid */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 sm:p-6 shadow-editorial space-y-5">
          {/* Calendar Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#141413]/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Mois précédent"
                className="p-2 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#FFF7ED] dark:hover:bg-white/5 text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-base sm:text-lg font-heading font-bold text-[#141413] dark:text-white min-w-[165px] text-center">
                {MONTH_NAMES_FR[viewMonth]} {viewYear}
              </h3>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Mois suivant"
                className="p-2 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#FFF7ED] dark:hover:bg-white/5 text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="ml-1 px-3 py-1.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:bg-[#FFF7ED] dark:hover:bg-white/5 text-xs font-semibold text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 transition-colors cursor-pointer"
              >
                Aujourd’hui
              </button>
            </div>

            {/* Quick Month Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5">
              {quickMonthShortcuts.map((shortcut) => {
                const isCurrent =
                  viewYear === shortcut.year && viewMonth === shortcut.month;
                return (
                  <button
                    key={shortcut.label}
                    type="button"
                    onClick={() => {
                      setViewYear(shortcut.year);
                      setViewMonth(shortcut.month);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-[#141413] dark:bg-[#F2B705] text-[#F2B705] dark:text-[#141413]'
                        : 'bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-300 hover:text-[#141413] dark:hover:text-white border border-[#141413]/10 dark:border-white/10'
                    }`}
                  >
                    {shortcut.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {WEEKDAYS_FR.map((day) => (
              <div
                key={day}
                className="text-[11px] font-bold uppercase tracking-wider text-[#4A4A48] dark:text-zinc-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell) => {
              const dayEntries = entriesByDate.get(cell.isoDate) || [];
              const isSelected = cell.isoDate === selectedIso;
              const isToday = cell.isoDate === todayIso;
              const hasEntries = dayEntries.length > 0;

              return (
                <button
                  key={cell.isoDate}
                  type="button"
                  onClick={() => {
                    setSelectedIso(cell.isoDate);
                    if (!cell.inCurrentMonth) {
                      const [yStr, mStr] = cell.isoDate.split('-');
                      setViewYear(Number(yStr));
                      setViewMonth(Number(mStr) - 1);
                    }
                  }}
                  aria-label={`${formatFullFrenchDate(cell.isoDate)}${
                    hasEntries ? ` (${dayEntries.length} rendez-vous)` : ''
                  }`}
                  className={`min-h-[68px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-2 border-[#F2B705]'
                      : cell.inCurrentMonth
                      ? 'bg-white dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 hover:border-[#C2410C]/40 dark:hover:border-[#F2B705]/40 hover:bg-[#FFF7ED]/50 dark:hover:bg-[#1e1e1c]'
                      : 'bg-[#F8F8F6] dark:bg-[#141413]/40 border-[#141413]/5 dark:border-white/5 text-[#4A4A48]/50 dark:text-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-mono tabular-nums inline-flex items-center justify-center w-6 h-6 rounded-lg ${
                        isToday
                          ? 'bg-[#141413] dark:bg-[#F2B705] text-[#F2B705] dark:text-[#141413] font-bold'
                          : isSelected
                          ? 'text-[#141413] dark:text-[#F2B705] font-bold'
                          : cell.inCurrentMonth
                          ? 'text-[#141413] dark:text-zinc-200 font-semibold'
                          : 'text-[#4A4A48]/50 dark:text-zinc-600'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {hasEntries && (
                      <span className="text-[10px] font-mono font-bold text-[#C2410C] dark:text-[#F2B705] sm:hidden">
                        +{dayEntries.length}
                      </span>
                    )}
                  </div>

                  {/* Indicators */}
                  {hasEntries && (
                    <div className="space-y-1 w-full mt-1">
                      {/* Mobile indicators */}
                      <div className="flex items-center gap-1 sm:hidden">
                        {dayEntries.slice(0, 3).map((e) => (
                          <span
                            key={e.id}
                            className={`w-2 h-2 rounded-sm ${getDotClass(e.kind)}`}
                          />
                        ))}
                      </div>

                      {/* Desktop compact pills */}
                      <div className="hidden sm:flex flex-col gap-1">
                        {dayEntries.slice(0, 2).map((e) => (
                          <span
                            key={e.id}
                            className={`block truncate px-1.5 py-0.5 rounded text-[9px] leading-tight ${getChipClass(
                              e.kind
                            )}`}
                          >
                            {e.kind === 'PROMO'
                              ? e.badgeLabel
                              : e.title}
                          </span>
                        ))}
                        {dayEntries.length > 2 && (
                          <span className="text-[9px] font-semibold text-[#4A4A48] dark:text-zinc-400 pl-1">
                            +{dayEntries.length - 2} autre(s)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-[#141413]/10 dark:border-white/10 flex flex-wrap items-center gap-4 text-[11px] text-[#4A4A48] dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#F2B705] inline-block" />
              <span>Événement officiel ALGB</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#141413] dark:bg-[#1e1e1c] dark:border dark:border-[#F2B705]/50 inline-block" />
              <span>Retrouvailles de promotion</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#C2410C] inline-block" />
              <span>Date clé statutaire</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="w-5 h-5 rounded-lg bg-[#141413] dark:bg-[#F2B705] text-[#F2B705] dark:text-[#141413] text-[9px] font-bold inline-flex items-center justify-center">
                J
              </span>
              <span>Aujourd’hui</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Day Panel + Month Key Dates */}
        <div className="lg:col-span-4 space-y-5">
          {/* Selected Date Card */}
          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-5 shadow-editorial space-y-4">
            <div className="pb-3 border-b border-[#141413]/10 dark:border-white/10">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C2410C] dark:text-[#fb923c]">
                Date Sélectionnée
              </span>
              <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                {formatFullFrenchDate(selectedIso)}
              </h3>
            </div>

            {selectedDayEntries.length === 0 ? (
              <div className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 rounded-xl p-4 text-center space-y-2">
                <CalendarIcon className="w-6 h-6 text-[#4A4A48] dark:text-zinc-500 mx-auto" />
                <p className="text-xs font-semibold text-[#141413] dark:text-white">
                  Aucun événement prévu à cette date
                </p>
                <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                  Sélectionnez une date marquée en jaune ou noir sur le calendrier, ou choisissez une échéance ci-dessous.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-xl bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] uppercase ${getChipClass(
                          entry.kind
                        )}`}
                      >
                        {entry.badgeLabel}
                      </span>
                      {entry.time && (
                        <span className="text-[11px] text-[#4A4A48] dark:text-zinc-400 font-medium inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#C2410C] dark:text-[#F2B705]" />
                          {entry.time}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-heading font-bold text-[#141413] dark:text-white leading-snug">
                      {entry.title}
                    </h4>

                    {entry.subtitle && (
                      <p className="text-[11px] font-semibold text-[#C2410C] dark:text-[#fb923c] flex items-center gap-1">
                        {entry.kind === 'PROMO' ? (
                          <Users className="w-3.5 h-3.5" />
                        ) : (
                          <Flag className="w-3.5 h-3.5" />
                        )}
                        <span>{entry.subtitle}</span>
                      </p>
                    )}

                    <p className="text-xs text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                      {entry.description}
                    </p>

                    {entry.location && (
                      <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400 flex items-center gap-1.5 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#fb923c] shrink-0" />
                        <span>{entry.location}</span>
                      </div>
                    )}

                    {entry.eventRef && (
                      <div className="pt-2.5 border-t border-[#141413]/10 dark:border-white/10 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onRegisterEvent(entry.eventRef!.id)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirmer ({entry.eventRef.attendeesCount})</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDownloadIcs(entry.eventRef!)}
                          className="inline-flex items-center gap-1 px-3 py-2 bg-white dark:bg-[#1e1e1c] hover:bg-[#FFF7ED] dark:hover:bg-white/5 text-[#141413] dark:text-white border border-[#141413]/15 dark:border-white/15 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-[#C2410C] dark:text-[#fb923c]" />
                          <span>.ics</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Key Dates in Current Viewed Month or Next Upcoming */}
          <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-5 shadow-editorial space-y-3">
            <div className="flex items-center justify-between border-b border-[#141413]/10 dark:border-white/10 pb-2.5">
              <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#141413] dark:text-white">
                {monthEntries.length > 0
                  ? `Rendez-vous de ${MONTH_NAMES_FR[viewMonth]}`
                  : 'Prochaines dates clés ALGB'}
              </h4>
              <span className="text-[11px] font-mono text-[#4A4A48] dark:text-zinc-400">
                {monthEntries.length > 0
                  ? `${monthEntries.length} date(s)`
                  : `${Math.min(filteredEntries.length, 4)} à suivre`}
              </span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {(monthEntries.length > 0
                ? monthEntries
                : filteredEntries.slice(0, 4)
              ).map((entry) => {
                const isActive = entry.isoDate === selectedIso;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => jumpToDate(entry.isoDate)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705]'
                        : 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 hover:border-[#C2410C]/40 dark:hover:border-[#F2B705]/40 hover:bg-white dark:hover:bg-[#1e1e1c]'
                    }`}
                  >
                    <div className="shrink-0 w-11 rounded-lg bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 text-center py-1">
                      <span className="block text-[9px] font-bold uppercase text-[#C2410C] dark:text-[#F2B705]">
                        {MONTH_NAMES_FR[Number(entry.isoDate.split('-')[1]) - 1]?.slice(0, 3)}
                      </span>
                      <span className="block text-sm font-mono font-bold text-[#141413] dark:text-white tabular-nums">
                        {entry.isoDate.split('-')[2]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-[#4A4A48] dark:text-zinc-400">
                        {entry.badgeLabel}
                      </span>
                      <p className="text-xs font-bold text-[#141413] dark:text-white line-clamp-2 leading-snug">
                        {entry.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
