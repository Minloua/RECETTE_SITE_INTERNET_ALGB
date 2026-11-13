import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlumniMember } from '../data/mockData';
import { AlumniWorldMap } from '../components/AlumniWorldMap';
import {
  SECTEURS_ACTIVITE,
  SITUATIONS_PRO,
  DOMAINES_COMPETENCES,
  DISPONIBILITES_LIST,
} from '../data/enrollmentData';
import {
  Search,
  Users,
  GraduationCap,
  Calendar,
  Sparkles,
  Eye,
  PlusCircle,
  Sliders,
  Save,
  MapPin,
  MessageCircle,
  UserPlus,
  Globe,
} from 'lucide-react';

export const PromotionsView: React.FC = () => {
  const {
    promotions,
    members,
    selectedPromotionYear,
    setSelectedPromotionYear,
    setViewingCardMember,
    currentRole,
    currentUser,
    addToast,
    updatePromotion,
    setEnrollmentModalOpen,
  } = useApp();

  const [viewMode, setViewMode] = useState<'PROMOTIONS' | 'ANNUAIRE_GLOBAL' | 'CARTE_MONDIALE'>('PROMOTIONS');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState<string>('ALL');
  const [promotionFilter, setPromotionFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [situationFilter, setSituationFilter] = useState('ALL');
  const [skillFilter, setSkillFilter] = useState('ALL');
  const [dispoFilter, setDispoFilter] = useState('ALL');
  const [promoTab, setPromoTab] = useState<'MEMBRES' | 'RETROUVAILLES' | 'ANNONCES'>('MEMBRES');

  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);

  const currentPromo = selectedPromotionYear
    ? promotions.find((p) => p.year === selectedPromotionYear) || promotions[0]
    : promotions[0];

  const [promoSettingsOpen, setPromoSettingsOpen] = useState(false);
  const [promoFormData, setPromoFormData] = useState({
    motto: '',
    delegateContact: '',
    nextReunionDate: '',
    description: '',
  });

  const handleOpenPromoSettings = () => {
    setPromoFormData({
      motto: currentPromo.motto,
      delegateContact: currentPromo.delegateContact,
      nextReunionDate: currentPromo.nextReunionDate || '',
      description: currentPromo.description,
    });
    setPromoSettingsOpen(true);
  };

  const handleSavePromoSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updatePromotion(currentPromo.year, {
      motto: promoFormData.motto,
      delegateContact: promoFormData.delegateContact,
      nextReunionDate: promoFormData.nextReunionDate,
      description: promoFormData.description,
    });
    setPromoSettingsOpen(false);
  };

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.year.toString().includes(searchQuery) ||
      promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.delegateName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedDecade === '1970') return promo.year >= 1970 && promo.year < 1980;
    if (selectedDecade === '1980') return promo.year >= 1980 && promo.year < 1990;
    if (selectedDecade === '1990') return promo.year >= 1990 && promo.year < 2000;
    if (selectedDecade === '2000') return promo.year >= 2000 && promo.year < 2010;
    if (selectedDecade === '2010') return promo.year >= 2010 && promo.year < 2020;
    if (selectedDecade === '2020') return promo.year >= 2020;
    return true;
  });

  const promoMembers = members.filter((m) => {
    if (m.promotionYear !== currentPromo.year) return false;
    if (sectorFilter !== 'ALL' && m.sector !== sectorFilter) return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
      (m.nickname || '').toLowerCase().includes(q) ||
      (m.sector || '').toLowerCase().includes(q) ||
      (m.currentRole || '').toLowerCase().includes(q) ||
      (m.company || '').toLowerCase().includes(q) ||
      m.promotionYear.toString().includes(q)
    );
  });

  const availableSectors = Array.from(
    new Set([...SECTEURS_ACTIVITE, ...members.map((m) => m.sector).filter(Boolean)])
  );

  const availablePromotionYears = Array.from(
    new Set([...promotions.map((p) => p.year), ...members.map((m) => m.promotionYear)])
  ).sort((a, b) => b - a);

  const globalFilteredMembers = members.filter((member) => {
    const q = searchQuery.toLowerCase().trim();
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const nickname = (member.nickname || '').toLowerCase();
    const role = (member.currentRole || '').toLowerCase();
    const company = (member.company || '').toLowerCase();
    const sector = (member.sector || '').toLowerCase();
    const promoYear = member.promotionYear.toString();
    const promoName = (member.promotionName || '').toLowerCase();
    const city = (member.city || '').toLowerCase();
    const commune = (member.commune || '').toLowerCase();
    const skillsJoined = (member.skills || []).join(' ').toLowerCase();
    const certsJoined = (member.certifications || []).join(' ').toLowerCase();

    const matchesSearch =
      !q ||
      fullName.includes(q) ||
      nickname.includes(q) ||
      role.includes(q) ||
      company.includes(q) ||
      sector.includes(q) ||
      promoYear.includes(q) ||
      promoName.includes(q) ||
      city.includes(q) ||
      commune.includes(q) ||
      skillsJoined.includes(q) ||
      certsJoined.includes(q);

    if (!matchesSearch) return false;

    if (promotionFilter !== 'ALL' && member.promotionYear !== Number(promotionFilter)) return false;
    if (sectorFilter !== 'ALL' && member.sector !== sectorFilter) return false;
    if (situationFilter !== 'ALL' && member.situation !== situationFilter) return false;
    if (skillFilter !== 'ALL' && !(member.skills || []).includes(skillFilter)) return false;
    if (dispoFilter !== 'ALL' && !(member.availabilities || []).includes(dispoFilter)) return false;

    return true;
  });

  const hasQuickMemberFilter =
    searchQuery.trim() !== '' || promotionFilter !== 'ALL' || sectorFilter !== 'ALL';

  const canManagePromo =
    currentRole === 'ADMIN' ||
    currentRole === 'SUPER_ADMIN' ||
    (currentRole === 'DELEGUE' && currentUser?.promotionYear === currentPromo.year);

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    addToast(
      'success',
      'Annonce diffusée à la promotion',
      `Votre message a été envoyé à tous les membres de la Promotion ${currentPromo.year}.`
    );
    setNewAnnouncementText('');
    setAnnouncementModalOpen(false);
  };

  const handleContactMember = (targetMember: AlumniMember) => {
    if (currentRole === 'VISITEUR') {
      addToast(
        'info',
        'Coordonnées réservées aux membres',
        'Conformément aux statuts de l’ALGB et à la politique de confidentialité (RGPD), les coordonnées directes sont réservées aux membres inscrits et à jour.'
      );
      return;
    }

    if (targetMember.whatsapp) {
      const cleanWa = targetMember.whatsapp.replace(/[^0-9]/g, '');
      const message = encodeURIComponent(
        `Bonjour cher camarade ${targetMember.firstName} ${targetMember.lastName} (${targetMember.nickname ? `« ${targetMember.nickname} » ` : ''}Promo ${targetMember.promotionYear}), je vous contacte depuis la plateforme officielle de l'Amicale des Anciens Élèves du Lycée de Garçons de Bingerville (ALGB).`
      );
      window.open(`https://wa.me/${cleanWa}?text=${message}`, '_blank');
    } else if (targetMember.email) {
      window.location.href = `mailto:${targetMember.email}?subject=Contact Réseau ALGB Bingerville`;
    } else {
      addToast('info', 'Demande transmise', 'Une notification de mise en relation a été transmise.');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Annuaire Officiel & Base de Compétences (BDR)</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white mt-1">
              L’Annuaire des Anciens Élèves
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl mt-1">
              « Retrouvez vos promotions, vos camarades par leur pseudo du lycée, leurs compétences et activez la solidarité intergénérationnelle de Bingerville. »
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEnrollmentModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#E5B824] text-black hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>S’enrôler dans l’Annuaire & BDR</span>
            </button>
          </div>
        </div>

        {/* Main View Mode Selector */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-fit">
          <button
            onClick={() => setViewMode('PROMOTIONS')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'PROMOTIONS'
                ? 'bg-[#E5B824] text-black shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Parcourir par Promotions</span>
          </button>

          <button
            onClick={() => setViewMode('ANNUAIRE_GLOBAL')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'ANNUAIRE_GLOBAL'
                ? 'bg-[#E5B824] text-black shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Annuaire Global & Compétences BDR ({members.length})</span>
          </button>

          <button
            onClick={() => setViewMode('CARTE_MONDIALE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              viewMode === 'CARTE_MONDIALE'
                ? 'bg-[#E5B824] text-black shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Carte Mondiale & Diaspora</span>
          </button>
        </div>

        {/* Barre de Recherche Rapide des Membres (Nom, Promotion, Secteur d'activité) */}
        {viewMode !== 'CARTE_MONDIALE' && (
          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xs font-heading font-bold uppercase tracking-wider text-black dark:text-white">
                  Recherche rapide de membres ALGB
                </h2>
                <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                  Naviguez instantanément parmi les anciens élèves par nom, année de promotion ou secteur d’activité.
                </p>
              </div>
              {hasQuickMemberFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPromotionFilter('ALL');
                    setSectorFilter('ALL');
                    setSituationFilter('ALL');
                    setSkillFilter('ALL');
                    setDispoFilter('ALL');
                  }}
                  className="text-xs font-semibold text-[#B8860B] dark:text-[#E5B824] hover:underline cursor-pointer self-start sm:self-center"
                >
                  Réinitialiser la recherche
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
              <div className="md:col-span-6">
                <label
                  htmlFor="promotions-member-search"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1"
                >
                  Nom, prénom ou pseudo
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="promotions-member-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Touré, Camara, Le Sphinx, 2002, Finance..."
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl pl-10 pr-4 py-2.5 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="promotions-year-filter"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1"
                >
                  Promotion
                </label>
                <select
                  id="promotions-year-filter"
                  value={promotionFilter}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setPromotionFilter(nextVal);
                    if (nextVal !== 'ALL') {
                      setSelectedPromotionYear(Number(nextVal));
                    }
                  }}
                  className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl px-3 py-2.5 text-xs text-black dark:text-white focus:outline-none"
                >
                  <option value="ALL">Toutes les promotions ({availablePromotionYears.length})</option>
                  {availablePromotionYears.map((yr) => (
                    <option key={yr} value={String(yr)}>
                      Promotion {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label
                  htmlFor="promotions-sector-filter"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1"
                >
                  Secteur d’activité
                </label>
                <select
                  id="promotions-sector-filter"
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl px-3 py-2.5 text-xs text-black dark:text-white focus:outline-none"
                >
                  <option value="ALL">Tous les secteurs ({members.length})</option>
                  {availableSectors.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Instant Cross-Promotion Member Results in PROMOTIONS mode */}
            {viewMode === 'PROMOTIONS' && hasQuickMemberFilter && (
              <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-black dark:text-white">
                    <span className="font-mono text-[#B8860B] dark:text-[#E5B824] tabular-nums">
                      {globalFilteredMembers.length}
                    </span>{' '}
                    membre{globalFilteredMembers.length > 1 ? 's' : ''} correspondant
                    {globalFilteredMembers.length > 1 ? 's' : ''}
                  </span>
                  {globalFilteredMembers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setViewMode('ANNUAIRE_GLOBAL')}
                      className="text-xs font-bold text-[#B8860B] dark:text-[#E5B824] hover:underline cursor-pointer"
                    >
                      Ouvrir dans l’Annuaire Global →
                    </button>
                  )}
                </div>

                {globalFilteredMembers.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs text-gray-600 dark:text-zinc-400 text-center">
                    Aucun membre trouvé pour cette combinaison de nom, promotion et secteur d’activité.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-1">
                    {globalFilteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 hover:border-[#E5B824] transition-all flex flex-col justify-between gap-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-black dark:text-white truncate">
                              {member.firstName} {member.lastName}
                              {member.nickname ? ` « ${member.nickname} »` : ''}
                            </div>
                            <div className="text-[11px] text-gray-600 dark:text-zinc-400 truncate">
                              {member.currentRole} · {member.company}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-zinc-500 mt-0.5 truncate">
                              {member.sector}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPromotionYear(member.promotionYear);
                              setPromoTab('MEMBRES');
                            }}
                            className="px-2 py-0.5 rounded bg-yellow-50 dark:bg-yellow-500/15 border border-[#E5B824] text-[10px] font-mono font-bold text-black dark:text-[#E5B824] hover:bg-[#E5B824] hover:text-black shrink-0 cursor-pointer"
                            title={`Accéder à la Promotion ${member.promotionYear}`}
                          >
                            Promo {member.promotionYear}
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setViewingCardMember(member)}
                            className="text-[#B8860B] dark:text-[#E5B824] hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Carte Adhérent</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleContactMember(member)}
                            className="px-2.5 py-1 rounded-lg bg-black dark:bg-zinc-800 hover:bg-[#E5B824] text-white hover:text-black font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>Contacter</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 1: PARCOURIR PAR PROMOTION */}
        {viewMode === 'PROMOTIONS' && (
          <div className="space-y-8">
            {/* Decade & Promotion Selector */}
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-heading font-bold text-black dark:text-white uppercase tracking-wider">
                  Filtrer les promotions par décennie
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
                  {['ALL', '1970', '1980', '1990', '2000', '2010', '2020'].map((decade) => (
                    <button
                      key={decade}
                      onClick={() => setSelectedDecade(decade)}
                      className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        selectedDecade === decade
                          ? 'bg-black dark:bg-[#E5B824] text-white dark:text-black font-semibold'
                          : 'bg-white dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-gray-200 dark:border-zinc-700'
                      }`}
                    >
                      {decade === 'ALL' ? 'Toutes décennies' : `Années ${decade}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promotions Selector Strip */}
              <div className="flex items-center gap-2.5 overflow-x-auto pt-2 pb-2 scrollbar-none">
                {filteredPromotions.map((promo) => {
                  const isSelected = currentPromo.year === promo.year;
                  return (
                    <button
                      key={promo.year}
                      onClick={() => setSelectedPromotionYear(promo.year)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#E5B824] text-black border-[#E5B824] shadow-sm'
                          : 'bg-white dark:bg-zinc-950 text-gray-800 dark:text-zinc-200 border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600'
                      }`}
                    >
                      <span className="font-heading font-bold">{promo.year}</span>
                      <span className="text-[10px] opacity-80">({promo.registeredMembers} inscrits)</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dedicated Promotion Hub Page */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              {/* Promo Hero Bar */}
              <div className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 p-6 sm:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold font-heading text-[#B8860B] dark:text-[#E5B824] tracking-tight">
                        {currentPromo.year}
                      </span>
                      <span className="text-xl font-bold font-heading text-black dark:text-white">
                        {currentPromo.name}
                      </span>
                    </div>
                    <p className="text-sm text-[#B8860B] dark:text-[#E5B824] font-editorial italic font-semibold">
                      « {currentPromo.motto} »
                    </p>
                    <p className="text-xs text-gray-700 dark:text-zinc-300 max-w-2xl leading-relaxed">
                      {currentPromo.description}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                    <div className="text-left sm:text-right text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-2.5">
                      <div className="text-gray-500 dark:text-zinc-400">Délégué officiel :</div>
                      <div className="font-semibold text-black dark:text-white">{currentPromo.delegateName}</div>
                      <div className="text-gray-600 dark:text-zinc-400 font-mono text-[11px]">{currentPromo.delegateContact}</div>
                    </div>

                    {canManagePromo && (
                      <button
                        onClick={handleOpenPromoSettings}
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-800 dark:text-zinc-200 hover:border-[#E5B824] hover:text-black dark:hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Paramètres Promo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-zinc-800 text-xs">
                  <button
                    onClick={() => setPromoTab('MEMBRES')}
                    className={`pb-2 font-semibold transition-colors cursor-pointer relative ${
                      promoTab === 'MEMBRES' ? 'text-black dark:text-white font-bold' : 'text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Anciens Élèves Enrôlés ({promoMembers.length})
                    {promoTab === 'MEMBRES' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5B824]"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setPromoTab('RETROUVAILLES')}
                    className={`pb-2 font-semibold transition-colors cursor-pointer relative ${
                      promoTab === 'RETROUVAILLES' ? 'text-black dark:text-white font-bold' : 'text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Prochaines Retrouvailles
                    {promoTab === 'RETROUVAILLES' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5B824]"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setPromoTab('ANNONCES')}
                    className={`pb-2 font-semibold transition-colors cursor-pointer relative ${
                      promoTab === 'ANNONCES' ? 'text-black dark:text-white font-bold' : 'text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    Annonces de Promotion ({currentPromo.announcementsCount})
                    {promoTab === 'ANNONCES' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E5B824]"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 sm:p-8 bg-white dark:bg-zinc-900">
                {promoTab === 'MEMBRES' && (
                  <div className="space-y-6">
                    {promoMembers.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 dark:text-zinc-400 space-y-3">
                        <Users className="w-10 h-10 mx-auto text-gray-400 dark:text-zinc-500" />
                        <p className="text-sm">
                          Aucun membre n'a encore finalisé son enrôlement pour la Promotion {currentPromo.year}.
                        </p>
                        <button
                          onClick={() => setEnrollmentModalOpen(true)}
                          className="px-4 py-2 bg-[#E5B824] hover:bg-[#dcae1f] text-black text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Soyez le premier à rejoindre cette promotion
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promoMembers.map((member) => (
                          <AlumniCard
                            key={member.id}
                            member={member}
                            onViewCard={() => setViewingCardMember(member)}
                            onContact={() => handleContactMember(member)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {promoTab === 'RETROUVAILLES' && (
                  <div className="max-w-2xl bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-[#B8860B] dark:text-[#E5B824]" />
                      <div>
                        <h4 className="text-sm font-bold text-black dark:text-white font-heading">
                          Prochaine Réunion & Dîner de la Promotion {currentPromo.year}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-zinc-400">
                          Date prévue : {currentPromo.nextReunionDate || 'Décembre 2026'} à Abidjan
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
                      Les retrouvailles de la promotion sont l'occasion de resserrer les liens fraternels, de passer en revue la situation des camarades et de convenir d’une action d'intérêt pour le lycée.
                    </p>
                    <button
                      onClick={() => {
                        addToast(
                          'success',
                          'Intention notifiée',
                          'Le délégué de promotion a été informé de votre souhait de participer.'
                        );
                      }}
                      className="px-4 py-2 bg-[#E5B824] text-black text-xs font-semibold rounded-lg hover:bg-[#dcae1f] transition-all cursor-pointer"
                    >
                      Confirmer ma présence
                    </button>
                  </div>
                )}

                {promoTab === 'ANNONCES' && (
                  <div className="space-y-4 max-w-2xl">
                    {canManagePromo && (
                      <button
                        onClick={() => setAnnouncementModalOpen(true)}
                        className="px-4 py-2 rounded-lg bg-[#E5B824] text-black text-xs font-semibold hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Publier une annonce pour la promotion</span>
                      </button>
                    )}

                    <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                        <span className="font-semibold text-[#B8860B] dark:text-[#E5B824]">Message du Délégué</span>
                        <span className="font-mono">Il y a 3 jours</span>
                      </div>
                      <p className="text-xs text-gray-800 dark:text-zinc-200">
                        Chers camarades de la Promotion {currentPromo.year}, n'oubliez pas de mettre à jour vos coordonnées et compétences dans l'annuaire pour la confection du trombinoscope de gala.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: ANNUAIRE GLOBAL & BASE DE COMPETENCES (BDR) */}
        {viewMode === 'ANNUAIRE_GLOBAL' && (
          <div className="space-y-6">
            {/* Complementary BDR Filters */}
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-gray-600 dark:text-zinc-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Situation professionnelle
                  </label>
                  <select
                    value={situationFilter}
                    onChange={(e) => setSituationFilter(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-black dark:text-white focus:outline-none focus:border-[#E5B824]"
                  >
                    <option value="ALL">Toutes situations</option>
                    {SITUATIONS_PRO.map((sit) => (
                      <option key={sit} value={sit}>
                        {sit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-zinc-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Compétence spécifique (BDR)
                  </label>
                  <select
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-black dark:text-white focus:outline-none focus:border-[#E5B824]"
                  >
                    <option value="ALL">Toutes compétences</option>
                    {DOMAINES_COMPETENCES.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-zinc-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Disponibilité offerte
                  </label>
                  <select
                    value={dispoFilter}
                    onChange={(e) => setDispoFilter(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 rounded-lg p-2 text-black dark:text-white focus:outline-none focus:border-[#E5B824]"
                  >
                    <option value="ALL">Toutes disponibilités</option>
                    {DISPONIBILITES_LIST.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 dark:text-zinc-400 pt-2 border-t border-gray-200 dark:border-zinc-800">
                <span>
                  <strong className="text-black dark:text-white font-mono tabular-nums">{globalFilteredMembers.length}</strong> anciens élèves trouvés dans la base
                </span>
                {(promotionFilter !== 'ALL' ||
                  sectorFilter !== 'ALL' ||
                  situationFilter !== 'ALL' ||
                  skillFilter !== 'ALL' ||
                  dispoFilter !== 'ALL' ||
                  searchQuery) ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setPromotionFilter('ALL');
                      setSectorFilter('ALL');
                      setSituationFilter('ALL');
                      setSkillFilter('ALL');
                      setDispoFilter('ALL');
                    }}
                    className="text-xs text-[#B8860B] dark:text-[#E5B824] font-semibold hover:underline whitespace-nowrap cursor-pointer"
                  >
                    Réinitialiser tous les filtres
                  </button>
                ) : (
                  <span className="text-[11px] text-gray-500 dark:text-zinc-500">
                    Données synchronisées avec l’enrôlement officiel ALGB
                  </span>
                )}
              </div>
            </div>

            {/* Members Grid */}
            {globalFilteredMembers.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4">
                <Users className="w-12 h-12 text-gray-400 dark:text-zinc-500 mx-auto" />
                <h3 className="text-base font-bold text-black dark:text-white">Aucun ancien élève ne correspond aux critères</h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 max-w-md mx-auto">
                  Modifiez vos termes de recherche ou réinitialisez les filtres pour afficher l'ensemble des camarades.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {globalFilteredMembers.map((member) => (
                  <AlumniCard
                    key={member.id}
                    member={member}
                    onViewCard={() => setViewingCardMember(member)}
                    onContact={() => handleContactMember(member)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODE 3: CARTE MONDIALE INTERACTIVE D3 */}
        {viewMode === 'CARTE_MONDIALE' && (
          <AlumniWorldMap
            members={members}
            onViewCard={(member) => setViewingCardMember(member)}
            onContact={handleContactMember}
          />
        )}

        {/* Modal Settings Promo */}
        {promoSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Paramètres de la Promotion {currentPromo.year}
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                Mettez à jour la devise, le contact du délégué et la date des prochaines retrouvailles.
              </p>

              <form onSubmit={handleSavePromoSettings} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Devise de la promotion</label>
                  <input
                    type="text"
                    required
                    value={promoFormData.motto}
                    onChange={(e) => setPromoFormData({ ...promoFormData, motto: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Contact / E-mail du délégué</label>
                  <input
                    type="text"
                    required
                    value={promoFormData.delegateContact}
                    onChange={(e) => setPromoFormData({ ...promoFormData, delegateContact: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Date des retrouvailles</label>
                  <input
                    type="date"
                    value={promoFormData.nextReunionDate}
                    onChange={(e) => setPromoFormData({ ...promoFormData, nextReunionDate: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Présentation historique</label>
                  <textarea
                    rows={3}
                    value={promoFormData.description}
                    onChange={(e) => setPromoFormData({ ...promoFormData, description: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-2.5 text-black dark:text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPromoSettingsOpen(false)}
                    className="px-3 py-1.5 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Enregistrer les modifications</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Publish Announcement */}
        {announcementModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Diffuser une annonce à la Promotion {currentPromo.year}
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                Cette communication sera notifiée à l'ensemble des membres inscrits de cette promotion.
              </p>

              <form onSubmit={handlePostAnnouncement} className="space-y-4 text-xs">
                <textarea
                  rows={4}
                  required
                  placeholder="Rédigez votre annonce officielle de promotion..."
                  value={newAnnouncementText}
                  onChange={(e) => setNewAnnouncementText(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-lg p-3 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
                />

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setAnnouncementModalOpen(false)}
                    className="px-3 py-1.5 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Diffuser l'annonce
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface AlumniCardProps {
  member: AlumniMember;
  onViewCard: () => void;
  onContact: () => void;
}

const AlumniCard: React.FC<AlumniCardProps> = ({ member, onViewCard, onContact }) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 rounded-2xl p-5 space-y-4 transition-all shadow-sm flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Top Header: Avatar + Nickname & Matricule */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-xl bg-gray-100 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 group-hover:border-[#E5B824] transition-colors flex items-center justify-center text-[#B8860B] dark:text-[#E5B824] font-heading font-bold text-base shrink-0 overflow-hidden">
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {member.firstName[0]}
                  {member.lastName[0]}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono">
                <span className="font-bold text-[#B8860B] dark:text-[#E5B824]">Promo {member.promotionYear}</span>
                {member.studyLevel && (
                  <>
                    <span className="text-gray-300 dark:text-zinc-600">·</span>
                    <span className="text-gray-600 dark:text-zinc-400">{member.studyLevel}</span>
                  </>
                )}
              </div>
              <h4 className="text-sm font-bold font-heading text-black dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-[#E5B824] transition-colors leading-tight mt-0.5">
                {member.firstName} {member.lastName}
              </h4>
              {member.nickname && (
                <div className="text-xs text-[#B8860B] dark:text-[#E5B824] font-editorial italic font-semibold">
                  « {member.nickname} »
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 dark:text-zinc-400 block">
              {member.membershipCardId}
            </span>
            {member.isRep && (
              <span className="inline-block text-[9px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold mt-1">
                Délégué
              </span>
            )}
          </div>
        </div>

        {/* Professional Profile */}
        <div className="space-y-1 bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-gray-200 dark:border-zinc-800">
          <div className="text-xs font-semibold text-black dark:text-white leading-snug">
            {member.currentRole}
          </div>
          <div className="text-xs text-[#B8860B] dark:text-[#E5B824] font-semibold truncate">{member.company}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-zinc-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500 shrink-0" />
            <span className="truncate">
              {member.city} {member.commune ? `(${member.commune})` : ''}, {member.country}
            </span>
          </div>
        </div>

        {/* Secteur & Situation */}
        <div className="text-[11px] text-gray-600 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-gray-800 dark:text-zinc-200">{member.sector}</span>
          {member.situation && (
            <>
              <span className="text-gray-300 dark:text-zinc-600">·</span>
              <span>{member.situation}</span>
            </>
          )}
        </div>

        {/* BDR Competences */}
        {member.skills && member.skills.length > 0 && (
          <div className="space-y-1 pt-1">
            <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold">
              Compétences BDR
            </div>
            <div className="flex flex-wrap gap-1.5">
              {member.skills.slice(0, 3).map((sk) => (
                <span
                  key={sk}
                  className="px-2 py-0.5 rounded-md bg-yellow-50 dark:bg-yellow-500/15 text-[#B8860B] dark:text-[#E5B824] text-[10px] font-semibold border border-yellow-200 dark:border-yellow-500/30"
                >
                  {sk}
                </span>
              ))}
              {member.skills.length > 3 && (
                <span className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono">
                  +{member.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Certifications */}
        {member.certifications && member.certifications.length > 0 && (
          <div className="text-[10px] text-gray-600 dark:text-zinc-400 font-mono truncate">
            {member.certifications.slice(0, 2).map((cert) => cert.split('–')[0].trim()).join(' · ')}
          </div>
        )}

        {/* Availabilities */}
        {member.availabilities && member.availabilities.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
            {member.availabilities.map((av, idx) => (
              <React.Fragment key={av}>
                <span>{av}</span>
                {idx < member.availabilities!.length - 1 && <span className="text-gray-300 dark:text-zinc-600">·</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Services offerts snippet */}
        {member.services && (
          <p className="text-[11px] text-gray-600 dark:text-zinc-400 italic line-clamp-2 pt-2 border-t border-gray-200 dark:border-zinc-800 font-editorial">
            « {member.services} »
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs">
        <button
          onClick={onViewCard}
          className="text-[#B8860B] dark:text-[#E5B824] hover:underline flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Carte Adhérent</span>
        </button>

        <button
          onClick={onContact}
          className="px-3 py-1.5 rounded-lg bg-black dark:bg-zinc-800 hover:bg-[#E5B824] hover:text-black text-white transition-colors flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Contacter</span>
        </button>
      </div>
    </div>
  );
};
