import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlumniMember } from '../data/mockData';
import { AlumniWorldMap } from '../components/AlumniWorldMap';
import {
  Search,
  Users,
  GraduationCap,
  MapPin,
  MessageCircle,
  Eye,
  UserPlus,
  Globe,
  SlidersHorizontal,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const PromotionsView: React.FC = () => {
  const {
    promotions,
    members,
    selectedPromotionYear,
    setSelectedPromotionYear,
    setViewingCardMember,
    currentRole,
    addToast,
    setEnrollmentModalOpen,
    submitMentorshipRequest,
  } = useApp();

  const [viewMode, setViewMode] = useState<'ANNUAIRE' | 'PROMOTIONS' | 'CARTE'>('ANNUAIRE');
  const [searchQuery, setSearchQuery] = useState('');
  const [promoFilter, setPromoFilter] = useState<string>(
    selectedPromotionYear ? String(selectedPromotionYear) : 'ALL'
  );
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [mentorsOnly, setMentorsOnly] = useState(false);

  // Contact / Mentorship quick drawer modal
  const [contactTarget, setContactTarget] = useState<AlumniMember | null>(null);
  const [contactMessage, setContactMessage] = useState('');

  const availablePromos = useMemo(
    () =>
      Array.from(new Set([...promotions.map((p) => p.year), ...members.map((m) => m.promotionYear)])).sort(
        (a, b) => b - a
      ),
    [promotions, members]
  );

  const availableSectors = useMemo(
    () => Array.from(new Set(members.map((m) => m.sector).filter(Boolean))).sort(),
    [members]
  );

  const availableCountries = useMemo(
    () => Array.from(new Set(members.map((m) => m.country).filter(Boolean))).sort(),
    [members]
  );

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return members.filter((m) => {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const matchesQuery =
        !q ||
        fullName.includes(q) ||
        (m.nickname || '').toLowerCase().includes(q) ||
        m.promotionYear.toString().includes(q) ||
        m.sector.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.currentRole.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q);

      if (!matchesQuery) return false;
      if (promoFilter !== 'ALL' && m.promotionYear !== Number(promoFilter)) return false;
      if (sectorFilter !== 'ALL' && m.sector !== sectorFilter) return false;
      if (countryFilter !== 'ALL' && m.country !== countryFilter) return false;
      if (mentorsOnly && !m.isMentor) return false;
      return true;
    });
  }, [members, searchQuery, promoFilter, sectorFilter, countryFilter, mentorsOnly]);

  const currentPromo =
    promotions.find((p) => p.year === (selectedPromotionYear || Number(promoFilter) || promotions[0]?.year)) ||
    promotions[0];

  const handleOpenContact = (member: AlumniMember) => {
    setContactTarget(member);
    setContactMessage('');
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTarget) return;

    if (contactTarget.isMentor && contactMessage.trim()) {
      submitMentorshipRequest({
        mentorId: contactTarget.id,
        objective: contactMessage.trim(),
      });
    } else if (currentRole === 'VISITEUR') {
      addToast(
        'info',
        'Message transmis au secrétariat',
        `Votre demande de mise en relation avec ${contactTarget.firstName} ${contactTarget.lastName} a été relayée conformément à la politique ARTCI.`
      );
    } else {
      addToast(
        'success',
        'Message fraternel envoyé',
        `${contactTarget.firstName} ${contactTarget.lastName} recevra votre notification de contact.`
      );
    }
    setContactTarget(null);
    setContactMessage('');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPromoFilter('ALL');
    setSectorFilter('ALL');
    setCountryFilter('ALL');
    setMentorsOnly(false);
    setSelectedPromotionYear(null);
  };

  const inputClass =
    'w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 focus:border-[#16324F] dark:focus:border-[#F2B705] rounded-lg px-3 py-2 text-xs text-[#141413] dark:text-white focus:outline-none';

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen transition-colors">
      {/* Univers Bleu Outremer Profond (#16324F) Header */}
      <section className="bg-[#16324F] text-white py-12 sm:py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705] inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>Annuaire Officiel & Cadres Dirigeants</span>
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-white">
                Annuaire des Anciens Élèves
              </h1>
              <p className="text-sm text-slate-200 leading-relaxed">
                Explorez les profils de nos membres en Côte d’Ivoire et dans la diaspora, identifiez les
                mentors disponibles et connectez-vous entre promotions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEnrollmentModalOpen(true)}
                className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
              >
                <UserPlus className="w-4 h-4 text-[#141413]" />
                <span>Rejoindre l’annuaire</span>
              </button>
            </div>
          </div>

          {/* Barre de recherche multicritères (Nom, Promotion, Secteur, Pays/Ville) */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-editorial text-[#141413]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A4A48] mb-1">
                  Nom, poste ou pseudo
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#4A4A48] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex : Touré, CTO, Paris, Cloud..."
                    className="w-full bg-[#F8F8F6] border border-black/15 focus:border-[#16324F] rounded-lg pl-9 pr-3 py-2 text-xs text-[#141413] placeholder-[#4A4A48]/70 focus:outline-none"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A4A48] mb-1">
                  Promotion
                </label>
                <select
                  value={promoFilter}
                  onChange={(e) => setPromoFilter(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-black/15 focus:border-[#16324F] rounded-lg px-3 py-2 text-xs text-[#141413] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Toutes</option>
                  {availablePromos.map((y) => (
                    <option key={y} value={String(y)}>
                      Promo {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A4A48] mb-1">
                  Secteur
                </label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-black/15 focus:border-[#16324F] rounded-lg px-3 py-2 text-xs text-[#141413] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Tous les secteurs</option>
                  {availableSectors.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A4A48] mb-1">
                  Pays / Ville
                </label>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-black/15 focus:border-[#16324F] rounded-lg px-3 py-2 text-xs text-[#141413] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Tous les pays</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sub-navigation between Annuaire / Promotions / Carte */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('ANNUAIRE')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 ${
                viewMode === 'ANNUAIRE'
                  ? 'bg-[#F2B705] text-[#141413]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Fiches Membres ({filteredMembers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('PROMOTIONS')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 ${
                viewMode === 'PROMOTIONS'
                  ? 'bg-[#F2B705] text-[#141413]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Promotions & Délégués ({promotions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('CARTE')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-2 ${
                viewMode === 'CARTE'
                  ? 'bg-[#F2B705] text-[#141413]'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Carte Mondiale</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {viewMode === 'ANNUAIRE' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Barre latérale de filtres épurée sur fond Blanc Pur (#FFFFFF) */}
            <aside className="lg:col-span-3 bg-[#FFFFFF] dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16324F] dark:text-[#F2B705]">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filtres</span>
                </div>
                {(searchQuery ||
                  promoFilter !== 'ALL' ||
                  sectorFilter !== 'ALL' ||
                  countryFilter !== 'ALL' ||
                  mentorsOnly) && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-medium text-[#16324F] dark:text-[#F2B705] hover:underline cursor-pointer"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="space-y-4 text-xs">
                <label className="flex items-center gap-2.5 p-3 rounded-lg bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-[#FEF8E6] cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={mentorsOnly}
                    onChange={(e) => setMentorsOnly(e.target.checked)}
                    className="rounded border-black/20 text-[#16324F] focus:ring-[#F2B705]"
                  />
                  <span>Disponibles pour mentorat uniquement</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A4A48] dark:text-zinc-400 mb-1.5">
                    Année de promotion
                  </label>
                  <select
                    value={promoFilter}
                    onChange={(e) => setPromoFilter(e.target.value)}
                    className={inputClass}
                  >
                    <option value="ALL">Toutes les promotions</option>
                    {availablePromos.map((y) => (
                      <option key={y} value={String(y)}>
                        Promotion {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A4A48] dark:text-zinc-400 mb-1.5">
                    Secteur d’activité
                  </label>
                  <select
                    value={sectorFilter}
                    onChange={(e) => setSectorFilter(e.target.value)}
                    className={inputClass}
                  >
                    <option value="ALL">Tous secteurs</option>
                    {availableSectors.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#4A4A48] dark:text-zinc-400 mb-1.5">
                    Pays de résidence
                  </label>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className={inputClass}
                  >
                    <option value="ALL">Tous pays</option>
                    {availableCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-black/10 dark:border-white/10 text-xs text-[#4A4A48] dark:text-zinc-400 flex items-center justify-between">
                <span>Résultats affichés</span>
                <span className="font-heading font-bold text-base text-[#141413] dark:text-white tabular-nums">
                  {filteredMembers.length}
                </span>
              </div>
            </aside>

            {/* Grille de fiches membres (cartes blanches 12px) */}
            <div className="lg:col-span-9">
              {filteredMembers.length === 0 ? (
                <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-12 text-center shadow-editorial border border-black/5 dark:border-white/10 space-y-3">
                  <Users className="w-10 h-10 text-[#16324F] dark:text-[#F2B705] mx-auto" />
                  <h2 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
                    Aucun membre trouvé
                  </h2>
                  <p className="text-xs text-[#4A4A48] dark:text-zinc-400 max-w-md mx-auto">
                    Élargissez vos filtres géographiques ou sectoriels pour afficher plus de profils.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMembers.map((member) => (
                    <article
                      key={member.id}
                      className="bg-[#FFFFFF] dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between gap-5"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          {/* Portrait circulaire avec liseré Jaune Solaire pour les mentors */}
                          <div
                            className={`w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-heading font-bold text-lg bg-[#16324F] text-white ${
                              member.isMentor
                                ? 'border-2 border-[#F2B705] ring-2 ring-[#FEF8E6] dark:ring-[#F2B705]/25'
                                : 'border border-black/15 dark:border-white/20'
                            }`}
                          >
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={`${member.firstName} ${member.lastName}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>
                                {member.firstName[0]}
                                {member.lastName[0]}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-semibold text-[#16324F] dark:text-[#F2B705]">
                              Promotion {member.promotionYear}
                            </span>
                            <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white leading-snug truncate">
                              {member.firstName} {member.lastName}
                            </h3>
                            <p className="text-xs font-medium text-[#4A4A48] dark:text-zinc-300 line-clamp-1 mt-0.5">
                              {member.currentRole}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs text-[#4A4A48] dark:text-zinc-400">
                          <div className="font-medium text-[#141413] dark:text-zinc-200 truncate">
                            {member.company}
                          </div>
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#16324F] dark:text-[#F2B705] shrink-0" />
                            <span className="truncate">
                              {member.city}, {member.country} · {member.sector}
                            </span>
                          </div>
                        </div>

                        {member.isMentor && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FEF8E6] text-[#141413] text-[11px] font-semibold">
                            <Sparkles className="w-3 h-3 text-[#141413]" />
                            <span>Disponible pour mentorat</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setViewingCardMember(member)}
                          className="text-xs font-medium text-[#16324F] dark:text-zinc-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Fiche</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenContact(member)}
                          className="px-3.5 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#141413]" />
                          <span>Contacter</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === 'PROMOTIONS' && currentPromo && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {promotions.map((promo) => {
                const active = promo.year === currentPromo.year;
                return (
                  <button
                    key={promo.year}
                    type="button"
                    onClick={() => setSelectedPromotionYear(promo.year)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#16324F] text-white border-[#16324F]'
                        : 'bg-white dark:bg-[#1e1e1c] text-[#141413] dark:text-white border-black/10 dark:border-white/10 hover:border-[#16324F]'
                    }`}
                  >
                    <div className="text-lg font-heading font-bold">{promo.year}</div>
                    <div className={`text-[11px] truncate ${active ? 'text-[#F2B705]' : 'text-[#4A4A48] dark:text-zinc-400'}`}>
                      {promo.registeredMembers} inscrits
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 sm:p-8 shadow-editorial border border-black/5 dark:border-white/10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#16324F] dark:text-[#F2B705]">
                    Promotion {currentPromo.year} · « {currentPromo.motto} »
                  </span>
                  <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                    {currentPromo.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 mt-1 max-w-2xl">
                    {currentPromo.description}
                  </p>
                </div>

                <div className="bg-[#F8F8F6] dark:bg-[#141413] rounded-xl p-4 text-xs space-y-1 shrink-0">
                  <div className="text-[#4A4A48] dark:text-zinc-400">Délégué de promotion</div>
                  <div className="font-semibold text-[#141413] dark:text-white">{currentPromo.delegateName}</div>
                  {currentPromo.nextReunionDate && (
                    <div className="text-[11px] text-[#16324F] dark:text-[#F2B705] flex items-center gap-1 pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Retrouvailles : {currentPromo.nextReunionDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {members
                  .filter((m) => m.promotionYear === currentPromo.year)
                  .map((member) => (
                    <div
                      key={member.id}
                      className="bg-[#F8F8F6] dark:bg-[#141413] rounded-xl p-5 flex items-center justify-between gap-3 border border-black/5 dark:border-white/10"
                    >
                      <div className="min-w-0">
                        <h4 className="text-sm font-heading font-bold text-[#141413] dark:text-white truncate">
                          {member.firstName} {member.lastName}
                        </h4>
                        <p className="text-xs text-[#4A4A48] dark:text-zinc-400 truncate">
                          {member.currentRole}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenContact(member)}
                        className="px-3 py-1.5 rounded-lg bg-[#F2B705] text-[#141413] text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        Contacter
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'CARTE' && (
          <AlumniWorldMap
            members={members}
            onViewCard={(member) => setViewingCardMember(member)}
            onContact={handleOpenContact}
          />
        )}
      </div>

      {/* Contact / Mentorship Modal */}
      {contactTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#16324F] dark:text-[#F2B705]">
                Mise en relation · Promotion {contactTarget.promotionYear}
              </span>
              <h3 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                Contacter {contactTarget.firstName} {contactTarget.lastName}
              </h3>
              <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-0.5">
                {contactTarget.currentRole} · {contactTarget.company}
              </p>
            </div>

            <form onSubmit={handleSendContact} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Votre message ou objet de mentorat
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Présentez brièvement votre promotion, votre parcours et l'objet de votre prise de contact..."
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setContactTarget(null)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#4A4A48] dark:text-zinc-400 hover:text-[#141413] dark:hover:text-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs cursor-pointer transition-colors"
                >
                  Envoyer le message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
