import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GEO_DATA,
  STUDY_LEVELS,
  SECTEURS_ACTIVITE,
  SITUATIONS_PRO,
  DOMAINES_FORMATION,
  DOMAINES_COMPETENCES,
  NIVEAUX_MAITRISE,
  ANNEES_EXPERIENCE,
  CERTIFICATIONS_LIST,
  DISPONIBILITES_LIST,
} from '../data/enrollmentData';
import {
  X,
  User,
  Briefcase,
  Award,
  Settings,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  ShieldCheck,
  Check,
  Camera,
} from 'lucide-react';

export const EnrollmentModal: React.FC = () => {
  const { enrollmentModalOpen, setEnrollmentModalOpen, submitEnrollment, addToast, setActiveTab } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Étape 1
  const [nom, setNom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [promo, setPromo] = useState('2015');
  const [niveau, setNiveau] = useState('Master');
  const [tel, setTel] = useState('+225 ');
  const [wa, setWa] = useState('+225 ');
  const [email, setEmail] = useState('');
  const [pays, setPays] = useState('ci');
  const [ville, setVille] = useState('Abidjan');
  const [villeAutre, setVilleAutre] = useState('');
  const [commune, setCommune] = useState('Cocody');
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const [photoFilename, setPhotoFilename] = useState<string>('');
  const [photoError, setPhotoError] = useState<string>('');

  // Étape 2
  const [secteur, setSecteur] = useState(SECTEURS_ACTIVITE[0]);
  const [structure, setStructure] = useState('');
  const [situation, setSituation] = useState(SITUATIONS_PRO[0]);
  const [fonction, setFonction] = useState('');

  // Étape 3
  const [formation, setFormation] = useState(DOMAINES_FORMATION[0]);
  const [formationAutre, setFormationAutre] = useState('');
  const [selectedCompetences, setSelectedCompetences] = useState<string[]>(['Gestion de projets', 'Informatique / IA']);
  const [compAutreActive, setCompAutreActive] = useState(false);
  const [compAutreText, setCompAutreText] = useState('');
  const [niveauCompetence, setNiveauCompetence] = useState('Confirmé');
  const [experience, setExperience] = useState('5 à 10 ans');
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [certAutreActive, setCertAutreActive] = useState(false);
  const [certAutreText, setCertAutreText] = useState('');

  // Étape 4
  const [services, setServices] = useState('');
  const [selectedDisponibilites, setSelectedDisponibilites] = useState<string[]>(['Mentorat', 'Consultances']);
  const [bdrAnnuaire, setBdrAnnuaire] = useState<'Oui' | 'Non'>('Oui');
  const [partageContacts, setPartageContacts] = useState<'Oui' | 'Non'>('Oui');
  const [observations, setObservations] = useState('');

  if (!enrollmentModalOpen) return null;

  const currentCountry = GEO_DATA[pays];
  const villesList = currentCountry ? Object.keys(currentCountry.villes) : [];
  const communesList =
    currentCountry && ville && currentCountry.villes[ville] ? currentCountry.villes[ville] : [];

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPays = e.target.value;
    setPays(newPays);
    if (newPays === 'autre') {
      setVille('');
      setCommune('');
    } else {
      const data = GEO_DATA[newPays];
      if (data) {
        const firstCity = Object.keys(data.villes)[0] || '';
        setVille(firstCity);
        const comms = data.villes[firstCity] || [];
        setCommune(comms[0] || '');
      }
    }
  };

  const handleVilleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVille = e.target.value;
    setVille(newVille);
    if (currentCountry && currentCountry.villes[newVille]) {
      setCommune(currentCountry.villes[newVille][0] || '');
    } else {
      setCommune('');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setPhotoError('Format non accepté. Utilisez JPG, PNG ou WEBP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setPhotoError('Fichier trop lourd. La taille maximum est de 2 Mo.');
      return;
    }

    setPhotoFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleCompetence = (item: string) => {
    setSelectedCompetences((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleCertification = (item: string) => {
    setSelectedCertifications((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleDisponibilite = (item: string) => {
    setSelectedDisponibilites((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const validateStep1 = () => {
    if (!nom.trim()) {
      addToast('warning', 'Champ requis', 'Veuillez saisir votre nom et prénom.');
      return false;
    }
    if (!promo || !promo.trim()) {
      addToast('warning', 'Champ requis', 'Veuillez renseigner votre année de promotion.');
      return false;
    }
    if (!tel.trim() || tel.trim() === '+225') {
      addToast('warning', 'Champ requis', 'Veuillez indiquer votre numéro de téléphone.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      addToast('warning', 'Champ requis', 'Veuillez saisir une adresse e-mail valide.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!structure.trim()) {
      addToast('warning', 'Champ requis', 'Veuillez préciser votre structure ou institution employeur.');
      return false;
    }
    if (!fonction.trim()) {
      addToast('warning', 'Champ requis', 'Veuillez préciser votre fonction ou poste occupé.');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (selectedCompetences.length === 0 && !compAutreText.trim()) {
      addToast('warning', 'Champ requis', 'Veuillez sélectionner au moins un domaine de compétence.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allCompetences = [...selectedCompetences];
    if (compAutreActive && compAutreText.trim()) {
      allCompetences.push(compAutreText.trim());
    }

    const allCertifications = [...selectedCertifications];
    if (certAutreActive && certAutreText.trim()) {
      allCertifications.push(certAutreText.trim());
    }

    const finalVille = pays === 'autre' ? (villeAutre.trim() || 'Ville internationale') : ville;
    const finalFormation = formation === 'autre_formation' ? (formationAutre.trim() || 'Formation spécialisée') : formation;

    const payload = {
      nom: nom.trim(),
      pseudo: pseudo.trim() || undefined,
      promo,
      niveau,
      tel: tel.trim(),
      wa: wa.trim() || tel.trim(),
      email: email.trim(),
      pays: currentCountry ? currentCountry.label : 'Autre pays',
      ville: finalVille,
      commune: commune.trim() || undefined,
      photoDataUrl: photoDataUrl || undefined,
      secteur,
      structure: structure.trim(),
      situation,
      fonction: fonction.trim(),
      formation: finalFormation,
      competences: allCompetences,
      niveau_competence: niveauCompetence,
      experience,
      certifications: allCertifications,
      services: services.trim() || 'Disponibilité pour le réseau des anciens et l’Amicale.',
      disponibilites: selectedDisponibilites,
      bdr_annuaire: bdrAnnuaire,
      partage_contacts: partageContacts,
      observations: observations.trim() || undefined,
    };

    try {
      const created = await submitEnrollment(payload);
      setSuccessData(created);
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur', 'Une anomalie est survenue lors de l’enrôlement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEnrollmentModalOpen(false);
    setStep(1);
    setSuccessData(null);
  };

  const inputClass =
    'w-full bg-gray-50 dark:bg-zinc-950 border border-gray-300 dark:border-zinc-700 focus:border-[#E5B824] focus:bg-white dark:focus:bg-zinc-900 rounded-xl p-2.5 text-black dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Sticky Header */}
        <div className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
              alt="Logo ALGB"
              className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-[#E5B824] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold font-heading text-black dark:text-white">
                  Enrôlement ALGB & Base de Compétences
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-yellow-50 dark:bg-yellow-500/15 text-[#B8860B] dark:text-[#E5B824] text-[10px] font-mono font-semibold border border-yellow-200 dark:border-yellow-500/30">
                  Étape {step}/4
                </span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-zinc-400 font-editorial italic hidden sm:block">
                « Intégrez l’Annuaire officiel et le Réseau des Compétences du Lycée de Garçons de Bingerville. »
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Fermer"
            className="p-1.5 text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Linear Stepper Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 shrink-0">
          <div
            className="bg-[#E5B824] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        {/* Stepper Tabs */}
        {!successData && (
          <div className="grid grid-cols-4 bg-gray-50 dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 text-xs shrink-0">
            {[
              { num: 1, label: 'Identité & Contact', icon: User },
              { num: 2, label: 'Parcours Pro', icon: Briefcase },
              { num: 3, label: 'Compétences BDR', icon: Award },
              { num: 4, label: 'Préférences & Fin', icon: Settings },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = step === t.num;
              const isPast = step > t.num;
              return (
                <button
                  key={t.num}
                  type="button"
                  onClick={() => {
                    if (t.num === 1) setStep(1);
                    if (t.num === 2 && validateStep1()) setStep(2);
                    if (t.num === 3 && validateStep1() && validateStep2()) setStep(3);
                    if (t.num === 4 && validateStep1() && validateStep2() && validateStep3()) setStep(4);
                  }}
                  className={`py-2.5 px-2 flex items-center justify-center gap-1.5 border-b-2 text-center transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#E5B824] text-black dark:text-white font-bold bg-yellow-50/70 dark:bg-yellow-500/10'
                      : isPast
                      ? 'border-transparent text-gray-700 dark:text-zinc-300 hover:text-black dark:hover:text-white font-medium'
                      : 'border-transparent text-gray-400 dark:text-zinc-500'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#B8860B] dark:text-[#E5B824]' : ''}`} />
                  <span className="truncate hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden font-mono">{t.num}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 text-xs text-gray-700 dark:text-zinc-300 space-y-6 bg-white dark:bg-zinc-900">
          {successData ? (
            <div className="text-center py-8 space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-black dark:text-white">
                  Dossier d’Enrôlement Soumis & Enregistré !
                </h3>
                <p className="text-xs text-gray-600 dark:text-zinc-400 font-editorial italic leading-relaxed">
                  Votre profil a bien été enregistré et transmis au système officiel de l’Amicale des Anciens Élèves du Lycée de Garçons de Bingerville.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-zinc-800">
                  <span className="text-gray-500 dark:text-zinc-400">Matricule Officiel</span>
                  <span className="font-mono font-bold text-[#B8860B] dark:text-[#E5B824] text-sm">
                    {successData.membershipCardId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-zinc-400">Nom & Prénom</span>
                  <span className="font-semibold text-black dark:text-white">
                    {successData.firstName} {successData.lastName}{' '}
                    {successData.nickname && <span className="text-[#B8860B] dark:text-[#E5B824] font-normal">« {successData.nickname} »</span>}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-zinc-400">Promotion</span>
                  <span className="font-mono text-gray-800 dark:text-zinc-200 font-semibold">{successData.promotionYear}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-zinc-400">Poste & Entreprise</span>
                  <span className="text-gray-800 dark:text-zinc-200 text-right truncate max-w-[200px]">
                    {successData.currentRole} — {successData.company}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-zinc-400">Localisation</span>
                  <span className="text-gray-800 dark:text-zinc-200">
                    {successData.city} {successData.commune ? `(${successData.commune})` : ''}, {successData.country}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-gray-500 dark:text-zinc-400">Base BDR & Compétences</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Référencé</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setActiveTab('anciens');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E5B824] hover:bg-[#dcae1f] text-black font-semibold text-xs transition-colors cursor-pointer"
                >
                  Voir mon profil dans l’Annuaire
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-zinc-200 font-medium text-xs transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ÉTAPE 1 : Identité & Contact */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-gray-200 dark:border-zinc-800">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold">
                      Étape 1 sur 4
                    </span>
                    <h4 className="text-base font-bold font-heading text-black dark:text-white mt-0.5">
                      Identité & Coordonnées de Contact
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 font-editorial italic">
                      Renseignez votre identité et vos souvenirs de promotion pour nous permettre de vous rattacher fidèlement à votre promotion.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Nom et prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="Ex: Alain Kouassi"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Pseudo du lycée{' '}
                        <span className="text-[#B8860B] dark:text-[#E5B824] font-normal">(Surnom LGB)</span>
                      </label>
                      <input
                        type="text"
                        value={pseudo}
                        onChange={(e) => setPseudo(e.target.value)}
                        placeholder="Ex: Le Sphinx, Major, Koro..."
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Promotion (Année de bac / sortie) *
                      </label>
                      <input
                        type="number"
                        min="1950"
                        max="2026"
                        required
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="Ex: 2012"
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Niveau d’étude le plus élevé *
                      </label>
                      <select
                        value={niveau}
                        onChange={(e) => setNiveau(e.target.value)}
                        className={inputClass}
                      >
                        {STUDY_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Téléphone mobile (avec indicatif) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                        placeholder="+225 07 XX XX XX XX"
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Numéro WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={wa}
                        onChange={(e) => setWa(e.target.value)}
                        placeholder="+225 07 XX XX XX XX"
                        className={`${inputClass} font-mono`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Adresse e-mail personnelle *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre.adresse@domaine.com"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Pays de résidence *
                      </label>
                      <select
                        value={pays}
                        onChange={handleCountryChange}
                        className={inputClass}
                      >
                        {Object.entries(GEO_DATA).map(([code, c]) => (
                          <option key={code} value={code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Ville de résidence *
                      </label>
                      {pays === 'autre' ? (
                        <input
                          type="text"
                          required
                          value={villeAutre}
                          onChange={(e) => setVilleAutre(e.target.value)}
                          placeholder="Saisissez votre ville..."
                          className={inputClass}
                        />
                      ) : (
                        <select
                          value={ville}
                          onChange={handleVilleChange}
                          className={inputClass}
                        >
                          {villesList.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {communesList.length > 0 && pays !== 'autre' && (
                      <div className="sm:col-span-2">
                        <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                          Commune / Quartier / Arrondissement
                        </label>
                        <select
                          value={commune}
                          onChange={(e) => setCommune(e.target.value)}
                          className={inputClass}
                        >
                          {communesList.map((com) => (
                            <option key={com} value={com}>
                              {com}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Photo d'identité Dropzone */}
                    <div className="sm:col-span-2 space-y-2 pt-2">
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold">
                        Photo d’identité ou portrait officiel
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-[#E5B824] rounded-2xl p-4 text-center bg-gray-50 dark:bg-zinc-950 transition-colors flex flex-col items-center justify-center gap-3">
                        {photoDataUrl ? (
                          <div className="flex items-center gap-4">
                            <img
                              src={photoDataUrl}
                              alt="Aperçu photo"
                              className="w-16 h-16 rounded-xl object-cover border-2 border-[#E5B824]"
                            />
                            <div className="text-left">
                              <p className="text-xs font-semibold text-black dark:text-white truncate max-w-xs">
                                {photoFilename || 'Photo sélectionnée'}
                              </p>
                              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Photo prête pour le dossier</p>
                              <label className="text-[11px] text-[#B8860B] dark:text-[#E5B824] font-semibold hover:underline cursor-pointer">
                                Remplacer la photo
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={handlePhotoUpload}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400">
                              <Camera className="w-6 h-6" />
                            </div>
                            <div>
                              <label className="inline-block px-3.5 py-1.5 rounded-lg bg-[#E5B824] text-black font-semibold text-xs cursor-pointer hover:bg-[#dcae1f] transition-colors">
                                Choisir une photo
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp"
                                  className="hidden"
                                  onChange={handlePhotoUpload}
                                />
                              </label>
                              <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1.5">
                                Formats JPG, PNG, WEBP (Max 2 Mo). Utilisée pour la carte officielle ALGB.
                              </p>
                            </div>
                          </>
                        )}
                        {photoError && (
                          <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">{photoError}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep1()) setStep(2);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#E5B824] text-black font-semibold text-xs hover:bg-[#dcae1f] flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Suivant — Parcours professionnel</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2 : Parcours Professionnel */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-gray-200 dark:border-zinc-800">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold">
                      Étape 2 sur 4
                    </span>
                    <h4 className="text-base font-bold font-heading text-black dark:text-white mt-0.5">
                      Parcours Professionnel & Structure Actuelle
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 font-editorial italic">
                      Ces données valorisent votre carrière au sein de l’Annuaire et aident les promotions à identifier des experts sectoriels.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Secteur d’activité principal *
                      </label>
                      <select
                        value={secteur}
                        onChange={(e) => setSecteur(e.target.value)}
                        className={inputClass}
                      >
                        {SECTEURS_ACTIVITE.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Structure / Entreprise / Institution employeur *
                      </label>
                      <input
                        type="text"
                        required
                        value={structure}
                        onChange={(e) => setStructure(e.target.value)}
                        placeholder="Ex: Ministère du Plan, Orange CI, Cabinet..."
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Situation professionnelle actuelle *
                      </label>
                      <select
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        className={inputClass}
                      >
                        {SITUATIONS_PRO.map((sit) => (
                          <option key={sit} value={sit}>
                            {sit}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Fonction / Intitulé de poste occupé *
                      </label>
                      <input
                        type="text"
                        required
                        value={fonction}
                        onChange={(e) => setFonction(e.target.value)}
                        placeholder="Ex: Chef de Projet Télécom, Directeur Général, Avocat, Médecin..."
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep2()) setStep(3);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#E5B824] text-black font-semibold text-xs hover:bg-[#dcae1f] flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Suivant — Compétences & Certifications</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3 : Compétences & BDR */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-gray-200 dark:border-zinc-800">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold">
                      Étape 3 sur 4
                    </span>
                    <h4 className="text-base font-bold font-heading text-black dark:text-white mt-0.5">
                      Base de Données des Ressources & Compétences (BDR)
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 font-editorial italic">
                      Alimentez la cartographie des talents de l’Amicale pour les missions de conseil, mentorat et opportunités professionnelles.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Domaine de formation principale *
                      </label>
                      <select
                        value={formation}
                        onChange={(e) => setFormation(e.target.value)}
                        className={inputClass}
                      >
                        {DOMAINES_FORMATION.map((f) => (
                          <option key={f} value={f}>
                            {f === 'autre_formation' ? 'Autre domaine de formation...' : f}
                          </option>
                        ))}
                      </select>
                    </div>

                    {formation === 'autre_formation' && (
                      <div>
                        <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                          Précisez votre domaine de formation
                        </label>
                        <input
                          type="text"
                          required
                          value={formationAutre}
                          onChange={(e) => setFormationAutre(e.target.value)}
                          placeholder="Ex: Biotechnologies marines, Ingénierie aérospatiale..."
                          className={inputClass}
                        />
                      </div>
                    )}

                    {/* Domaines de compétences */}
                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-2">
                        Domaines de compétences spécifiques * (Cochez tout ce qui s'applique)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DOMAINES_COMPETENCES.map((comp) => {
                          const isChecked = selectedCompetences.includes(comp);
                          return (
                            <label
                              key={comp}
                              onClick={() => toggleCompetence(comp)}
                              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-yellow-50 dark:bg-yellow-500/15 border-[#E5B824] text-black dark:text-[#E5B824] font-semibold'
                                  : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                                  isChecked ? 'bg-[#E5B824] text-black font-bold' : 'border border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                                }`}
                              >
                                {isChecked && '✓'}
                              </div>
                              <span className="truncate">{comp}</span>
                            </label>
                          );
                        })}

                        <label
                          onClick={() => setCompAutreActive(!compAutreActive)}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                            compAutreActive
                              ? 'bg-yellow-50 dark:bg-yellow-500/15 border-[#E5B824] text-black dark:text-[#E5B824] font-semibold'
                              : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                              compAutreActive ? 'bg-[#E5B824] text-black font-bold' : 'border border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                            }`}
                          >
                            {compAutreActive && '✓'}
                          </div>
                          <span>Autre domaine...</span>
                        </label>
                      </div>

                      {compAutreActive && (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={compAutreText}
                            onChange={(e) => setCompAutreText(e.target.value)}
                            placeholder="Saisissez une compétence personnalisée..."
                            className={inputClass}
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                          Niveau de maîtrise principal *
                        </label>
                        <select
                          value={niveauCompetence}
                          onChange={(e) => setNiveauCompetence(e.target.value)}
                          className={inputClass}
                        >
                          {NIVEAUX_MAITRISE.map((n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                          Années d’expérience cumulées *
                        </label>
                        <select
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          className={inputClass}
                        >
                          {ANNEES_EXPERIENCE.map((exp) => (
                            <option key={exp} value={exp}>
                              {exp}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Certifications professionnelles */}
                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-2">
                        Certifications / Diplômes professionnels obtenus
                      </label>
                      <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800 space-y-1.5">
                        {CERTIFICATIONS_LIST.map((cert) => {
                          const isChecked = selectedCertifications.includes(cert);
                          return (
                            <label
                              key={cert}
                              onClick={() => toggleCertification(cert)}
                              className={`p-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-yellow-50 dark:bg-yellow-500/15 text-black dark:text-[#E5B824] font-semibold border border-yellow-200 dark:border-yellow-500/30'
                                  : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900'
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 text-[9px] ${
                                  isChecked ? 'bg-[#E5B824] text-black font-bold' : 'border border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                                }`}
                              >
                                {isChecked && '✓'}
                              </div>
                              <span>{cert}</span>
                            </label>
                          );
                        })}

                        <label
                          onClick={() => setCertAutreActive(!certAutreActive)}
                          className={`p-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                            certAutreActive ? 'bg-yellow-50 dark:bg-yellow-500/15 text-black dark:text-[#E5B824] font-semibold' : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 text-[9px] ${
                              certAutreActive ? 'bg-[#E5B824] text-black font-bold' : 'border border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                            }`}
                          >
                            {certAutreActive && '✓'}
                          </div>
                          <span>Autre certification...</span>
                        </label>
                      </div>

                      {certAutreActive && (
                        <input
                          type="text"
                          value={certAutreText}
                          onChange={(e) => setCertAutreText(e.target.value)}
                          placeholder="Précisez votre certification..."
                          className={`${inputClass} mt-2`}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (validateStep3()) setStep(4);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#E5B824] text-black font-semibold text-xs hover:bg-[#dcae1f] flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Suivant — Préférences & Finalisation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ÉTAPE 4 : Préférences, Offre & Finalisation */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="pb-3 border-b border-gray-200 dark:border-zinc-800">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8860B] dark:text-[#E5B824] font-bold">
                      Étape 4 sur 4
                    </span>
                    <h4 className="text-base font-bold font-heading text-black dark:text-white mt-0.5">
                      Préférences, Offre de Services & Finalisation
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-zinc-400 font-editorial italic">
                      Définissez vos modalités d’intervention au service de l’Amicale et vos préférences de confidentialité.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Services et expertises que vous pouvez offrir *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={services}
                        onChange={(e) => setServices(e.target.value)}
                        placeholder="Ex: Conseils en stratégie, audit financier, ateliers d'orientation pour les élèves, parrainage de promotion..."
                        className={inputClass}
                      />
                    </div>

                    {/* Disponibilités */}
                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-2">
                        Vos disponibilités pour l'Amicale & les anciens
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DISPONIBILITES_LIST.map((d) => {
                          const isChecked = selectedDisponibilites.includes(d);
                          return (
                            <label
                              key={d}
                              onClick={() => toggleDisponibilite(d)}
                              className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-yellow-50 dark:bg-yellow-500/15 border-[#E5B824] text-black dark:text-[#E5B824] font-semibold'
                                  : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                                  isChecked ? 'bg-[#E5B824] text-black font-bold' : 'border border-gray-400 dark:border-zinc-600 bg-white dark:bg-zinc-900'
                                }`}
                              >
                                {isChecked && '✓'}
                              </div>
                              <span>{d}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Intégration BDR Oui/Non */}
                    <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-black dark:text-white">
                            Intégration à la Base de Données des Compétences (BDR)
                          </p>
                          <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                            Acceptez-vous d'être référencé(e) dans le répertoire des compétences pour sollicitations expertes ?
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setBdrAnnuaire('Oui')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              bdrAnnuaire === 'Oui'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            Oui
                          </button>
                          <button
                            type="button"
                            onClick={() => setBdrAnnuaire('Non')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              bdrAnnuaire === 'Non'
                                ? 'bg-red-600 text-white'
                                : 'bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            Non
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Partage Contacts Oui/Non */}
                    <div className="p-4 bg-gray-50 dark:bg-zinc-950 rounded-2xl border border-gray-200 dark:border-zinc-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold text-black dark:text-white">
                            Autorisation de partage de contact sécurisée (RGPD / ARTCI)
                          </p>
                          <p className="text-[11px] text-gray-600 dark:text-zinc-400 max-w-md">
                            Vos coordonnées seront visibles uniquement aux membres actifs à jour de leur cotisation et sous réserve de validation de votre part.
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setPartageContacts('Oui')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              partageContacts === 'Oui'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            Oui
                          </button>
                          <button
                            type="button"
                            onClick={() => setPartageContacts('Non')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              partageContacts === 'Non'
                                ? 'bg-red-600 text-white'
                                : 'bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            Non
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">
                        Observations ou suggestions pour l'Amicale (Facultatif)
                      </label>
                      <input
                        type="text"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Une idée de projet, une remarque pour le bureau exécutif..."
                        className={inputClass}
                      />
                    </div>

                    <div className="p-3 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30 rounded-xl text-[11px] text-yellow-900 dark:text-amber-200 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#B8860B] dark:text-[#E5B824] shrink-0 mt-0.5" />
                      <span>
                        En soumettant ce formulaire, vous rejoignez officiellement le réseau de l'ALGB. Vos informations sont protégées conformément aux statuts associatifs et synchronisées de façon sécurisée.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Précédent</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-[#E5B824] hover:bg-[#dcae1f] text-black font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>Enregistrement du dossier...</span>
                        </>
                      ) : (
                        <>
                          <span>Valider & Soumettre mon dossier</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
