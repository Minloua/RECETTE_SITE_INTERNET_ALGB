import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlumniMember, INITIAL_MENTORSHIP_TESTIMONIALS } from '../data/mockData';
import { UNRESTRICTED_ACCESS_OVERRIDE } from '../utils/accessMatrix';
import {
  Users,
  Award,
  CheckCircle2,
  Send,
  Sparkles,
  ArrowRight,
  Compass,
  Lock,
  CreditCard,
  KeyRound,
  X,
} from 'lucide-react';

export const MentoratView: React.FC = () => {
  const {
    members,
    currentUser,
    currentRole,
    activeCredential,
    isCurrentMemberUpToDate,
    currentMemberFinancialSummary,
    becomeMentor,
    submitMentorshipRequest,
    setActiveTab,
    openAuthModal,
    openPaymentModal,
  } = useApp();

  const [activeTrack, setActiveTrack] = useState<'ALL' | 'TECH' | 'FINANCE' | 'SANTE' | 'BTP'>('ALL');
  const [selectedMentor, setSelectedMentor] = useState<AlumniMember | null>(null);
  const [requestObjective, setRequestObjective] = useState('');

  const [mentorFormOpen, setMentorFormOpen] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    currentRole: currentUser?.currentRole || '',
    company: currentUser?.company || '',
    bio: currentUser?.bio || '',
    availabilities: currentUser?.availabilities || ['Mentorat', 'Coaching'],
  });

  useEffect(() => {
    if (!currentUser) return;
    setMentorForm({
      currentRole: currentUser.currentRole || '',
      company: currentUser.company || '',
      bio: currentUser.bio || '',
      availabilities: currentUser.availabilities || ['Mentorat', 'Coaching'],
    });
  }, [currentUser]);

  const mentors = useMemo(() => {
    const base = members.filter((m) => m.isMentor);
    if (activeTrack === 'ALL') return base;
    return base.filter((m) => {
      const sec = m.sector.toLowerCase();
      if (activeTrack === 'TECH') return sec.includes('informatique') || sec.includes('numérique') || sec.includes('ia');
      if (activeTrack === 'FINANCE') return sec.includes('banque') || sec.includes('finance') || sec.includes('commerce');
      if (activeTrack === 'SANTE') return sec.includes('santé') || sec.includes('médecine');
      if (activeTrack === 'BTP') return sec.includes('btp') || sec.includes('génie') || sec.includes('énergie');
      return true;
    });
  }, [members, activeTrack]);

  const handleBecomeMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    becomeMentor(mentorForm);
    setMentorFormOpen(false);
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !requestObjective.trim()) return;
    submitMentorshipRequest({
      mentorId: selectedMentor.id,
      objective: requestObjective.trim(),
    });
    setSelectedMentor(null);
    setRequestObjective('');
  };

  const inputClass =
    'w-full bg-[#F8F8F6] dark:bg-[#141413] border border-black/15 dark:border-white/15 focus:border-[#16324F] dark:focus:border-[#F2B705] rounded-lg px-3.5 py-2.5 text-xs text-[#141413] dark:text-white focus:outline-none';

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen transition-colors">
      {/* Bannière éditoriale en Bleu Outremer (#16324F) */}
      <section className="bg-[#16324F] text-white py-14 sm:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-semibold text-[#F2B705]">
                <Compass className="w-4 h-4" />
                <span>Parrainage Intergénérationnel ALGB</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-heading font-bold text-white leading-[1.12]">
                Transmettre l’exigence et ouvrir les plus hautes trajectoires.
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
                Notre programme de mentorat unit les cadres dirigeants, chercheurs et entrepreneurs
                anciens élèves du Lycée de Garçons de Bingerville aux jeunes diplômés pour un
                accompagnement stratégique sur 6 mois.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#parcours-mentorat"
                  className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-colors"
                >
                  <span>Choisir mon parcours</span>
                  <ArrowRight className="w-4 h-4 text-[#141413]" />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveTab('anciens')}
                  className="px-5 py-3 rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#16324F] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                >
                  Explorer l’annuaire des dirigeants
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/10 border border-white/15 rounded-xl p-5 space-y-1">
                <div className="text-3xl font-heading font-bold text-[#F2B705] tabular-nums">
                  {members.filter((m) => m.isMentor).length}
                </div>
                <div className="text-xs text-slate-200">Mentors actifs certifiés</div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-5 space-y-1">
                <div className="text-3xl font-heading font-bold text-white tabular-nums">6 mois</div>
                <div className="text-xs text-slate-200">Cycle de parrainage guidé</div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-5 space-y-1">
                <div className="text-3xl font-heading font-bold text-white tabular-nums">92%</div>
                <div className="text-xs text-slate-200">Insertion sous 4 mois</div>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-xl p-5 space-y-1">
                <div className="text-3xl font-heading font-bold text-[#F2B705] tabular-nums">12 pays</div>
                <div className="text-xs text-slate-200">Réseaux d’accueil diaspora</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Double parcours interactif : Devenir Mentor & Trouver un Mentor */}
      <section id="parcours-mentorat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bloc Devenir Mentor */}
          <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-8 shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#16324F] text-[#F2B705] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#16324F] dark:text-[#F2B705] block">
                Cadres Dirigeants & Experts
              </span>
              <h2 className="text-2xl font-heading font-bold text-[#141413] dark:text-white">
                Devenir Mentor ALGB
              </h2>
              <p className="text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                Consacrez deux heures par mois à guider un jeune bachelier ou jeune cadre dans son
                orientation académique, sa stratégie de carrière et son réseau international.
              </p>

              <ul className="space-y-2 text-xs text-[#4A4A48] dark:text-zinc-300 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0" />
                  <span>Badge « Mentor Disponible » encadré Or sur votre fiche Annuaire</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0" />
                  <span>Réception et gestion des demandes dans votre Espace Membre</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0" />
                  <span>Invitation aux cercles exécutifs et forums métiers du lycée</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-3">
              {currentUser || UNRESTRICTED_ACCESS_OVERRIDE ? (
                <button
                  type="button"
                  onClick={() => {
                    setMentorForm({
                      currentRole: currentUser?.currentRole || '',
                      company: currentUser?.company || '',
                      bio: currentUser?.bio || '',
                      availabilities: currentUser?.availabilities || ['Mentorat', 'Coaching'],
                    });
                    setMentorFormOpen(true);
                  }}
                  className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer transition-colors"
                >
                  {currentUser?.isMentor ? 'Mettre à jour mon profil Mentor' : 'Activer mon profil Mentor'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('mentorat')}
                  className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Me connecter pour devenir Mentor
                </button>
              )}
            </div>
          </div>

          {/* Bloc Trouver un Mentor (réservé aux membres à jour de cotisation) */}
          <div className="bg-[#16324F] text-white rounded-xl p-8 shadow-editorial flex flex-col justify-between gap-6">
            {isCurrentMemberUpToDate ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-[#F2B705] flex items-center justify-center border border-[#F2B705]/40">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#FEF8E6] text-[#141413] text-[10px] font-semibold uppercase tracking-wider">
                      Cotisation à jour · Accès actif
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#F2B705] block">
                    Jeunes Diplômés & Étudiants
                  </span>
                  <h2 className="text-2xl font-heading font-bold text-white">
                    Trouver un Mentor
                  </h2>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Filtrez nos dirigeants par pôle d’expertise, sélectionnez un parrain dont le parcours
                    correspond à votre ambition et formulez votre objectif de mentorat en un clic.
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold block mb-2">
                      Filtrer les pôles d’expertise :
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'ALL', label: 'Tous les mentors' },
                        { id: 'TECH', label: 'Tech & IA' },
                        { id: 'FINANCE', label: 'Finance & Direction' },
                        { id: 'SANTE', label: 'Santé & Recherche' },
                        { id: 'BTP', label: 'BTP & Énergie' },
                      ].map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => setActiveTrack(track.id as typeof activeTrack)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            activeTrack === track.id
                              ? 'bg-[#F2B705] text-[#141413]'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {track.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/15 flex items-center justify-between text-xs text-slate-200">
                  <span>{mentors.length} mentors disponibles dans cette sélection</span>
                  <a href="#liste-mentors" className="text-[#F2B705] font-semibold hover:underline">
                    Voir la sélection ↓
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/10 text-[#F2B705] flex items-center justify-center border border-[#F2B705]/40">
                      <Lock className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded bg-[#FEF8E6] text-[#141413] text-[10px] font-semibold uppercase tracking-wider">
                      Membres à jour uniquement
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.14em] font-semibold text-[#F2B705] block">
                    Accès Réservé ALGB
                  </span>
                  <h2 className="text-2xl font-heading font-bold text-white">
                    Trouver un Mentor
                  </h2>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    L’accès à la recherche filtrée de mentors et à la mise en relation directe est
                    exclusivement réservé aux membres ALGB à jour de leur cotisation annuelle.
                  </p>

                  {currentRole !== 'VISITEUR' && activeCredential && currentUser && currentMemberFinancialSummary && (
                    <div className="p-3.5 rounded-lg bg-white/10 border border-white/15 text-xs space-y-1">
                      <div className="font-semibold text-[#F2B705]">
                        Statut de votre dossier ({currentUser.firstName} {currentUser.lastName}) :
                      </div>
                      <div className="text-slate-200">
                        {currentMemberFinancialSummary.paidMonths.length} / 12 mois acquittés
                        {currentMemberFinancialSummary.overdueMonths.length > 0 &&
                          ` · ${currentMemberFinancialSummary.overdueMonths.length} mois à régulariser`}
                        {currentMemberFinancialSummary.pendingMonths.length > 0 &&
                          ` · ${currentMemberFinancialSummary.pendingMonths.length} en attente de pointage`}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-3">
                  {currentRole === 'VISITEUR' || !activeCredential ? (
                    <>
                      <button
                        type="button"
                        onClick={() => openAuthModal('mentorat')}
                        className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <KeyRound className="w-4 h-4 text-[#141413]" />
                        <span>Me connecter avec mon credential</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('adhesion')}
                        className="px-4 py-3 rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#16324F] text-xs font-medium cursor-pointer transition-colors"
                      >
                        Adhérer à l’ALGB
                      </button>
                    </>
                  ) : currentUser ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          openPaymentModal({
                            type: 'COTISATION_MENSUELLE',
                            selectedMonths: currentMemberFinancialSummary?.overdueMonths,
                          })
                        }
                        className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-[#141413]" />
                        <span>Régulariser ma cotisation</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('espace-membre')}
                        className="px-4 py-3 rounded-lg border border-white/40 text-white hover:bg-white hover:text-[#16324F] text-xs font-medium cursor-pointer transition-colors"
                      >
                        Mon Espace Cotisations
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveTab('espace-membre')}
                      className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Consulter mon profil membre
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Catalogue interactif : Collège des Parrains (réservé aux membres à jour de cotisation) */}
        <div id="liste-mentors" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#16324F] dark:text-[#F2B705]">
                Collège des Parrains
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                {isCurrentMemberUpToDate
                  ? `Mentors disponibles (${mentors.length})`
                  : 'Collège des Parrains — Accès Réservé'}
              </h2>
            </div>
            {!isCurrentMemberUpToDate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF8E6] text-[#141413] text-xs font-semibold w-fit">
                <Lock className="w-3.5 h-3.5 text-[#141413]" />
                <span>Réservé aux membres à jour de cotisation</span>
              </span>
            )}
          </div>

          {isCurrentMemberUpToDate ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <article
                  key={mentor.id}
                  className="bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-editorial border border-black/5 dark:border-white/10 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F2B705] bg-[#16324F] text-white flex items-center justify-center font-heading font-bold text-lg shrink-0">
                        {mentor.avatarUrl ? (
                          <img
                            src={mentor.avatarUrl}
                            alt={`${mentor.firstName} ${mentor.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {mentor.firstName[0]}
                            {mentor.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-semibold text-[#16324F] dark:text-[#F2B705]">
                          Promo {mentor.promotionYear} · {mentor.city}
                        </span>
                        <h3 className="text-base font-heading font-bold text-[#141413] dark:text-white truncate">
                          {mentor.firstName} {mentor.lastName}
                        </h3>
                        <p className="text-xs text-[#4A4A48] dark:text-zinc-300 truncate">
                          {mentor.currentRole}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-[#4A4A48] dark:text-zinc-300 leading-relaxed line-clamp-3">
                      {mentor.bio}
                    </p>

                    <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                      <strong className="text-[#141413] dark:text-white">Expertise :</strong>{' '}
                      {mentor.skills.slice(0, 3).join(' · ')}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#FEF8E6] text-[#141413] text-[11px] font-semibold">
                      <Sparkles className="w-3 h-3" />
                      <span>Disponible</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(mentor)}
                      className="px-4 py-2 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 text-[#141413]" />
                      <span>Solliciter ce mentor</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1e1e1c] rounded-xl p-8 sm:p-10 shadow-editorial border border-[#16324F]/20 dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16324F] dark:text-[#F2B705]">
                  <Lock className="w-4 h-4" />
                  <span>{members.filter((m) => m.isMentor).length} mentors dirigeants actifs dans le Collège</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[#141413] dark:text-white">
                  Débloquez le Collège des Parrains avec un statut de cotisation à jour
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-300 leading-relaxed">
                  Conformément à la matrice des profils ALGB, la consultation détaillée des parrains
                  et l’envoi de sollicitations de mentorat sont exclusivement ouverts aux membres
                  connectés dont la cotisation annuelle est à jour.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {currentRole === 'VISITEUR' || !activeCredential ? (
                  <>
                    <button
                      type="button"
                      onClick={() => openAuthModal('mentorat')}
                      className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-[#141413]" />
                      <span>Connexion Membre</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('adhesion')}
                      className="px-4 py-3 rounded-lg border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-medium cursor-pointer"
                    >
                      Rejoindre l’ALGB
                    </button>
                  </>
                ) : currentUser ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        openPaymentModal({
                          type: 'COTISATION_MENSUELLE',
                          selectedMonths: currentMemberFinancialSummary?.overdueMonths,
                        })
                      }
                      className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <CreditCard className="w-4 h-4 text-[#141413]" />
                      <span>Régler ma cotisation maintenant</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('espace-membre')}
                      className="px-4 py-3 rounded-lg border border-black/15 dark:border-white/15 text-[#141413] dark:text-white text-xs font-medium cursor-pointer"
                    >
                      Voir mon échéancier
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('espace-membre')}
                    className="px-5 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Ouvrir mon Espace Membre
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Témoignages de binômes mentor / mentoré en Playfair Display italique et filets Jaune Solaire */}
        <section className="bg-white dark:bg-[#1e1e1c] rounded-xl p-8 sm:p-10 shadow-editorial border border-black/5 dark:border-white/10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#F2B705]/60">
            <div>
              <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#16324F] dark:text-[#F2B705]">
                Paroles de Binômes
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#141413] dark:text-white mt-1">
                Témoignages Mentor & Mentoré
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {INITIAL_MENTORSHIP_TESTIMONIALS.map((pair) => (
              <blockquote
                key={pair.id}
                className="flex flex-col justify-between gap-6 pt-5 pb-5 border-t-2 border-b border-[#F2B705]"
              >
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#16324F] dark:text-[#F2B705]">
                    {pair.programTrack}
                  </span>
                  <p className="font-editorial italic text-base text-[#141413] dark:text-zinc-100 leading-relaxed">
                    « {pair.quote} »
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <img
                    src={pair.mentorAvatar}
                    alt={pair.mentorName}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#F2B705] shrink-0"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-[#141413] dark:text-white">
                      {pair.mentorName} <span className="font-normal text-[#4A4A48] dark:text-zinc-400">({pair.mentorPromo})</span>
                    </div>
                    <div className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                      Mentor de <strong>{pair.menteeName}</strong> (Promo {pair.menteePromo})
                    </div>
                  </div>
                </div>
              </blockquote>
            ))}
          </div>
        </section>
      </section>

      {/* Modal: Demande de mentorat */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#16324F] dark:text-[#F2B705]">
                  Parrainage ALGB · Promo {selectedMentor.promotionYear}
                </span>
                <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                  Solliciter {selectedMentor.firstName} {selectedMentor.lastName}
                </h3>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400">
                  {selectedMentor.currentRole} · {selectedMentor.company}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                aria-label="Fermer"
                className="p-1 text-[#4A4A48] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Votre objectif et vos attentes pour ce mentorat *
                </label>
                <textarea
                  rows={4}
                  required
                  value={requestObjective}
                  onChange={(e) => setRequestObjective(e.target.value)}
                  placeholder="Ex : Je prépare mon entrée en cabinet de conseil à Abidjan et je souhaite bénéficier de votre retour d'expérience..."
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 text-[#4A4A48] dark:text-zinc-400 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold cursor-pointer"
                >
                  Envoyer la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Devenir Mentor */}
      {mentorFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-[#1e1e1c] rounded-xl p-6 shadow-2xl border border-black/10 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-bold text-[#141413] dark:text-white">
                Activer mon profil Mentor Dirigeant
              </h3>
              <button
                type="button"
                onClick={() => setMentorFormOpen(false)}
                aria-label="Fermer"
                className="p-1 text-[#4A4A48] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBecomeMentorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Poste actuel
                </label>
                <input
                  type="text"
                  required
                  value={mentorForm.currentRole}
                  onChange={(e) => setMentorForm({ ...mentorForm, currentRole: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Entreprise / Organisation
                </label>
                <input
                  type="text"
                  required
                  value={mentorForm.company}
                  onChange={(e) => setMentorForm({ ...mentorForm, company: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block font-semibold text-[#141413] dark:text-white mb-1">
                  Présentation pour les mentorés
                </label>
                <textarea
                  rows={3}
                  required
                  value={mentorForm.bio}
                  onChange={(e) => setMentorForm({ ...mentorForm, bio: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setMentorFormOpen(false)}
                  className="px-4 py-2 text-[#4A4A48] dark:text-zinc-400 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold cursor-pointer"
                >
                  Valider mon engagement Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
