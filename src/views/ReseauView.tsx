import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlumniMember, JobOffer } from '../data/mockData';
import { AlumniWorldMap } from '../components/AlumniWorldMap';
import {
  Search,
  Building,
  MapPin,
  UserCheck,
  Send,
  PlusCircle,
  Sparkles,
  Globe,
} from 'lucide-react';

export const ReseauView: React.FC = () => {
  const {
    members,
    jobOffers,
    postJobOffer,
    currentUser,
    addToast,
    setViewingCardMember,
    setEnrollmentModalOpen,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'ANNUAIRE' | 'OFFRES' | 'MENTORAT' | 'CARTE'>('ANNUAIRE');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  // Job Modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    type: 'CDI' as JobOffer['type'],
    company: currentUser?.company || '',
    sector: currentUser?.sector || 'Technologie & Numérique',
    location: 'Abidjan',
    description: '',
    requirements: '',
    contactEmail: currentUser?.email || 'recrutement@algb-alumni.ci',
  });

  // Mentorship Request Modal
  const [mentorshipModalOpen, setMentorshipModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<AlumniMember | null>(null);
  const [mentorshipGoal, setMentorshipGoal] = useState('');

  // Apply to job modal
  const [applyModalJob, setApplyModalJob] = useState<JobOffer | null>(null);
  const [coverNote, setCoverNote] = useState('');

  const sectors = ['ALL', ...Array.from(new Set(members.map((m) => m.sector)))];

  const filteredMembers = members.filter((member) => {
    const q = searchQuery.toLowerCase().trim();
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const nick = (member.nickname || '').toLowerCase();
    const matchesSearch =
      !q ||
      fullName.includes(q) ||
      nick.includes(q) ||
      member.profession.toLowerCase().includes(q) ||
      member.company.toLowerCase().includes(q) ||
      member.skills.some((s) => s.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (sectorFilter !== 'ALL' && member.sector !== sectorFilter) return false;
    if (activeSubTab === 'MENTORAT' && !member.isMentor) return false;
    return true;
  });

  const filteredJobs = jobOffers.filter((job) => {
    const matches =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.sector.toLowerCase().includes(searchQuery.toLowerCase());
    return matches;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description) return;

    postJobOffer({
      title: newJob.title,
      type: newJob.type,
      company: newJob.company || 'Entreprise Partenaire ALGB',
      sector: newJob.sector,
      location: newJob.location,
      postedBy: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Alumni ALGB',
      postedByPromo: currentUser?.promotionYear || 2002,
      deadline: '2026-12-31',
      description: newJob.description,
      requirements: newJob.requirements.split('\n').filter((r) => r.trim().length > 0),
      contactEmail: newJob.contactEmail,
    });

    setJobModalOpen(false);
    setNewJob({
      title: '',
      type: 'CDI',
      company: '',
      sector: 'Technologie & Numérique',
      location: 'Abidjan',
      description: '',
      requirements: '',
      contactEmail: '',
    });
  };

  const handleSendMentorshipRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;
    addToast(
      'success',
      'Demande de mentorat transmise avec honneur',
      `Votre sollicitation fraternelle a été adressée à ${selectedMentor.firstName} ${selectedMentor.lastName}. Il prendra contact avec vous prochainement.`
    );
    setMentorshipModalOpen(false);
    setSelectedMentor(null);
    setMentorshipGoal('');
  };

  const handleApplyToJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;
    addToast(
      'success',
      'Candidature fraternelle transmise !',
      `Votre profil et lettre d'intérêt ont été transmis à ${applyModalJob.postedBy} (${applyModalJob.company}).`
    );
    setApplyModalJob(null);
    setCoverNote('');
  };

  const inputClass =
    'w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-950 rounded-lg p-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none';

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Editorial Header */}
        <div className="border-b border-gray-200 dark:border-zinc-800 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
              Synergie & Opportunités
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold font-heading text-black dark:text-white mt-1">
              Réseau Professionnel & Solidarité
            </h1>
            <p className="text-sm text-gray-600 dark:text-zinc-400 font-editorial italic max-w-2xl mt-1">
              « Synergie intergénérationnelle, annuaire des compétences, opportunités d'affaires et mentorat. »
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setEnrollmentModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824]" />
              <span>S’enrôler dans la BDR</span>
            </button>

            <button
              onClick={() => setJobModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#E5B824] text-black hover:bg-[#dcae1f] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier une opportunité</span>
            </button>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveSubTab('ANNUAIRE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'ANNUAIRE'
                ? 'bg-[#E5B824] text-black shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Annuaire des Compétences ({filteredMembers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('OFFRES')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'OFFRES'
                ? 'bg-[#E5B824] text-black shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Offres & Stages ({jobOffers.length})
          </button>
          <button
            onClick={() => setActiveSubTab('MENTORAT')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === 'MENTORAT'
                ? 'bg-[#E5B824] text-black shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Programme de Mentorat
          </button>
          <button
            onClick={() => setActiveSubTab('CARTE')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              activeSubTab === 'CARTE'
                ? 'bg-[#E5B824] text-black shadow-sm'
                : 'text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Carte Mondiale (D3)</span>
          </button>
        </div>

        {/* Filters Strip */}
        {activeSubTab !== 'CARTE' && (
          <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-gray-400 dark:text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom, expertise (ex: Cloud), métier ou entreprise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl pl-10 pr-4 py-2 text-xs text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full sm:w-auto bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] rounded-xl px-3 py-2 text-xs text-black dark:text-white focus:outline-none cursor-pointer"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec === 'ALL' ? 'Tous les secteurs d’activité' : sec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tab 1: Annuaire des Compétences */}
        {activeSubTab === 'ANNUAIRE' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-gray-300 dark:hover:border-zinc-700 shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-[#B8860B] dark:text-[#E5B824] font-heading font-bold text-base shrink-0 overflow-hidden">
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <span>
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-gray-600 dark:text-zinc-400 font-semibold">
                        Promo {member.promotionYear}
                      </span>
                      {member.studyLevel && (
                        <span className="block text-[10px] font-mono text-gray-500 dark:text-zinc-500 mt-0.5">
                          {member.studyLevel}
                        </span>
                      )}
                      {member.isMentor && (
                        <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                          Mentor Disponible
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold font-heading text-black dark:text-white">
                    {member.firstName} {member.lastName}
                  </h3>
                  {member.nickname && (
                    <div className="text-xs text-[#B8860B] dark:text-[#E5B824] font-editorial italic font-semibold">
                      « {member.nickname} »
                    </div>
                  )}
                  <div className="text-xs text-gray-900 dark:text-zinc-100 font-semibold mt-1">
                    {member.currentRole}
                  </div>
                  <div className="text-xs text-gray-700 dark:text-zinc-300 flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                    <span className="truncate">{member.company}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-zinc-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                    <span>
                      {member.city} {member.commune ? `(${member.commune})` : ''}, {member.country} · {member.sector}
                    </span>
                  </div>

                  {((member.certifications && member.certifications.length > 0) ||
                    (member.availabilities && member.availabilities.length > 0)) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(member.certifications || []).slice(0, 2).map((c) => (
                        <span
                          key={c}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 truncate max-w-[180px]"
                        >
                          {c.split('–')[0].trim()}
                        </span>
                      ))}
                      {(member.availabilities || []).map((av) => (
                        <span
                          key={av}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        >
                          {av}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Clean typography skills */}
                  <div className="mt-3 pt-2.5 border-t border-gray-200 dark:border-zinc-800">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block mb-1">
                      Compétences BDR
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-gray-700 dark:text-zinc-300">
                      {member.skills.map((skill, i) => (
                        <React.Fragment key={skill}>
                          <span>{skill}</span>
                          {i < member.skills.length - 1 && <span className="text-gray-300 dark:text-zinc-600">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setViewingCardMember(member)}
                    className="text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white font-semibold text-[11px] cursor-pointer"
                  >
                    Carte officielle
                  </button>

                  {member.isMentor && (
                    <button
                      onClick={() => {
                        setSelectedMentor(member);
                        setMentorshipModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-500/15 hover:bg-[#E5B824] text-[#B8860B] dark:text-[#E5B824] hover:text-black border border-yellow-200 dark:border-yellow-500/30 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Solliciter mentorat</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Offres d'emploi & Stages */}
        {activeSubTab === 'OFFRES' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 hover:border-gray-300 dark:hover:border-zinc-700 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E5B824] text-black">
                        {job.type}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-mono">
                        Publiée le {job.postedDate}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-heading text-black dark:text-white">
                      {job.title}
                    </h3>
                    <div className="text-xs text-[#B8860B] dark:text-[#E5B824] font-semibold">
                      {job.company} · {job.location}
                    </div>
                    <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-400 font-semibold block mb-1">
                        Prérequis & Profil :
                      </span>
                      <ul className="text-xs text-gray-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
                        {job.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                      Déposée par : {job.postedBy} (Promo {job.postedByPromo})
                    </span>
                    <button
                      onClick={() => setApplyModalJob(job)}
                      className="px-4 py-2 rounded-lg bg-[#E5B824] text-black font-semibold hover:bg-[#dcae1f] cursor-pointer"
                    >
                      Postuler / Contacter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Mentorat */}
        {activeSubTab === 'MENTORAT' && (
          <div className="space-y-8">
            <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-[#B8860B] dark:text-[#E5B824]">
                Transmission de l'Excellence
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-black dark:text-white">
                Le Programme de Mentorat Intergénérationnel ALGB
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
                Chaque année, des dizaines de jeunes bacheliers et étudiants du Lycée de Garçons de Bingerville entrent dans les universités et grandes écoles. Ce programme met en relation directe ces jeunes talents avec des hauts dirigeants, magistrats, médecins et ingénieurs anciens du LGB pour les conseiller, les encourager et faciliter leur insertion professionnelle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {members
                .filter((m) => m.isMentor)
                .map((mentor) => (
                  <div
                    key={mentor.id}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 space-y-4 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-[#B8860B] dark:text-[#E5B824] font-heading font-bold text-base">
                          {mentor.firstName[0]}
                          {mentor.lastName[0]}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold font-heading text-black dark:text-white">
                            {mentor.firstName} {mentor.lastName}
                          </h4>
                          <div className="text-xs text-[#B8860B] dark:text-[#E5B824] font-semibold">
                            Promo {mentor.promotionYear}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-black dark:text-white font-semibold">{mentor.currentRole}</div>
                      <div className="text-xs text-gray-600 dark:text-zinc-400">{mentor.company}</div>
                      <p className="text-xs text-gray-600 dark:text-zinc-400 italic font-editorial mt-2">
                        « {mentor.bio} »
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setMentorshipModalOpen(true);
                      }}
                      className="w-full mt-4 py-2.5 rounded-xl bg-[#E5B824] text-black text-xs font-semibold hover:bg-[#dcae1f] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Demander un parrainage</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Tab 4: Carte Mondiale Interactive (D3) */}
        {activeSubTab === 'CARTE' && (
          <AlumniWorldMap
            members={members}
            onViewCard={(member) => setViewingCardMember(member)}
            onContact={(member) => {
              if (member.isMentor) {
                setSelectedMentor(member);
                setMentorshipModalOpen(true);
              } else if (member.email) {
                window.location.href = `mailto:${member.email}?subject=Contact Réseau ALGB`;
              } else {
                addToast('info', 'Profil sélectionné', `Consultez la carte officielle de ${member.firstName} ${member.lastName}.`);
              }
            }}
          />
        )}

        {/* Modal: Post Job Offer */}
        {jobModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Publier une opportunité professionnelle
              </h3>

              <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Intitulé du poste / offre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ingénieur Génie Civil Junior"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Type de contrat</label>
                    <select
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value as any })}
                      className={inputClass}
                    >
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="STAGE">Stage de fin d’études</option>
                      <option value="CONSULTANCE">Consultance / Mission</option>
                      <option value="PARTENARIAT">Partenariat d’affaires</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Entreprise / Institution</label>
                    <input
                      type="text"
                      required
                      placeholder="Nom de l’entreprise"
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Description de la mission</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Détails du poste, enjeux et responsabilités..."
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Profil recherché (1 ligne par prérequis)</label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Bac+5 Grande École d'Ingénieur&#10;Bonne maîtrise de Python"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setJobModalOpen(false)}
                    className="px-4 py-2 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Publier l’opportunité
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Demande de Mentorat */}
        {mentorshipModalOpen && selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Solliciter un mentorat fraternel auprès de {selectedMentor.firstName} {selectedMentor.lastName}
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400">
                {selectedMentor.currentRole} à {selectedMentor.company} (Promo {selectedMentor.promotionYear})
              </p>

              <form onSubmit={handleSendMentorshipRequest} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                    Présentez votre projet académique ou professionnel et vos attentes
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={mentorshipGoal}
                    onChange={(e) => setMentorshipGoal(e.target.value)}
                    placeholder="Ex: Diplômé de la promo 2023 en mathématiques appliquées, je souhaite bénéficier de vos conseils pour orienter ma carrière dans les systèmes financiers..."
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setMentorshipModalOpen(false)}
                    className="px-3 py-1.5 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Transmettre ma demande
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Apply to Job */}
        {applyModalJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-bold font-heading text-black dark:text-white">
                Postuler à l'offre : {applyModalJob.title}
              </h3>
              <p className="text-xs text-[#B8860B] dark:text-[#E5B824] font-semibold">
                {applyModalJob.company} — Contact recruteur : {applyModalJob.contactEmail}
              </p>

              <form onSubmit={handleApplyToJob} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                    Note de motivation / Parcours LGB
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Mentionnez votre promotion, vos compétences principales et votre motivation pour rejoindre cette équipe..."
                    className={inputClass}
                  />
                </div>

                <div className="p-3 bg-gray-50 dark:bg-zinc-950 rounded-lg border border-gray-200 dark:border-zinc-800 text-[11px] text-gray-600 dark:text-zinc-400">
                  Vos coordonnées d'adhérent ALGB seront automatiquement jointes à votre candidature.
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyModalJob(null)}
                    className="px-3 py-1.5 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E5B824] text-black font-semibold rounded-lg hover:bg-[#dcae1f] cursor-pointer"
                  >
                    Envoyer ma candidature
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
