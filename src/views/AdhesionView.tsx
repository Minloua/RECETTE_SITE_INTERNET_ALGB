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
  CheckCircle2,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  Camera,
  Briefcase,
  Award,
  Settings,
  Send,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const AdhesionView: React.FC = () => {
  const { submitEnrollment, setActiveTab, setViewingCardMember, addToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdMember, setCreatedMember] = useState<any>(null);

  // Étape 1
  const [nom, setNom] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [promo, setPromo] = useState('2014');
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
  const [selectedCompetences, setSelectedCompetences] = useState<string[]>([
    'Gestion de projets',
    'Informatique / IA',
  ]);
  const [compAutreActive, setCompAutreActive] = useState(false);
  const [compAutreText, setCompAutreText] = useState('');
  const [niveauCompetence, setNiveauCompetence] = useState('Confirmé');
  const [experience, setExperience] = useState('5 à 10 ans');
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [certAutreActive, setCertAutreActive] = useState(false);
  const [certAutreText, setCertAutreText] = useState('');

  // Étape 4
  const [services, setServices] = useState('');
  const [selectedDisponibilites, setSelectedDisponibilites] = useState<string[]>([
    'Mentorat',
    'Consultances',
  ]);
  const [bdrAnnuaire, setBdrAnnuaire] = useState<'Oui' | 'Non'>('Oui');
  const [partageContacts, setPartageContacts] = useState<'Oui' | 'Non'>('Oui');
  const [observations, setObservations] = useState('');
  const [artciConsent, setArtciConsent] = useState(false);

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
      addToast('warning', 'Champ requis', 'Veuillez renseigner votre promotion.');
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
    if (!artciConsent) {
      addToast(
        'warning',
        'Consentement ARTCI requis',
        'Veuillez accepter la politique de confidentialité conforme à la loi n° 2013-450 avant de finaliser votre enrôlement.'
      );
      return;
    }
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
    const finalFormation =
      formation === 'autre_formation' ? (formationAutre.trim() || 'Formation spécialisée') : formation;

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
      setCreatedMember(created);
      setStep(5);
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur', 'Une anomalie est survenue lors de l’enrôlement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 focus:border-[#16324F] dark:focus:border-[#F2B705] rounded-lg p-2.5 text-[#141413] dark:text-white placeholder-[#4A4A48]/60 dark:placeholder-zinc-500 focus:outline-none transition-colors';

  return (
    <div className="bg-[#F8F8F6] dark:bg-[#141413] min-h-screen text-[#141413] dark:text-[#F8F8F6] transition-colors">
      {/* Deep Ultramarine Editorial Hero */}
      <section className="bg-[#16324F] text-white border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 text-center space-y-3">
          <div className="inline-flex items-center gap-3 p-1.5 pr-4 rounded-xl bg-white/10 border border-white/15">
            <img
              src="/assets/aistudio/IMG-20180925-WA0019_301d84a7.jpg"
              alt="Logo officiel ALGB"
              className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 border border-[#F2B705]/70"
            />
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F2B705]">
              Enrôlement Officiel & Base des Compétences
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-heading text-white">
            S’enrôler dans l’ALGB & Rejoindre l’Annuaire
          </h1>
          <p className="text-xs sm:text-sm text-zinc-200 font-editorial italic max-w-2xl mx-auto leading-relaxed">
            « En vous enrôlant, vous intégrez officiellement l’Annuaire des Anciens Élèves du Lycée de Garçons de Bingerville, la Base de Données des Compétences (BDR) et obtenez votre carte d’adhérent. »
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Progress Steps Indicators */}
        {step < 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-medium">
            {[
              { num: 1, label: 'Identité & Contact', icon: User },
              { num: 2, label: 'Parcours Pro', icon: Briefcase },
              { num: 3, label: 'Compétences BDR', icon: Award },
              { num: 4, label: 'Préférences & Fin', icon: Settings },
            ].map((t) => {
              const isActive = step === t.num;
              const isPast = step > t.num;
              return (
                <div
                  key={t.num}
                  className={`p-3 rounded-xl border text-center transition-all flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705] text-[#141413] dark:text-white font-semibold shadow-editorial'
                      : isPast
                      ? 'bg-white dark:bg-[#1e1e1c] border-[#16324F]/30 dark:border-white/20 text-[#141413] dark:text-zinc-200'
                      : 'bg-white/60 dark:bg-[#1e1e1c]/60 border-[#141413]/10 dark:border-white/10 text-[#4A4A48] dark:text-zinc-500'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 font-mono ${
                      isActive
                        ? 'bg-[#F2B705] text-[#141413] font-bold'
                        : isPast
                        ? 'bg-[#16324F] dark:bg-[#F2B705] text-white dark:text-[#141413] font-bold'
                        : 'bg-[#F8F8F6] dark:bg-[#141413] text-[#4A4A48] dark:text-zinc-400 border border-[#141413]/10 dark:border-white/10'
                    }`}
                  >
                    {isPast ? '✓' : t.num}
                  </div>
                  <span className="truncate text-[11px] sm:text-xs">{t.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Registration Container */}
        <div className="bg-white dark:bg-[#1e1e1c] border border-[#141413]/10 dark:border-white/10 rounded-xl p-6 sm:p-10 shadow-editorial">
          {/* Step 1 : Identite & Contact */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#141413]/10 dark:border-white/10">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#16324F] dark:text-[#F2B705] font-semibold">
                  Étape 1 sur 4
                </span>
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                  Identité Personnelle, Pseudo du Lycée & Contact
                </h2>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
                  Ces informations authentifient vos années d’internat ou d’externat à Bingerville et alimentent votre fiche d’annuaire.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1">Nom et prénom *</label>
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
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1">
                    Pseudo du lycée <span className="text-[#16324F] dark:text-[#F2B705] font-normal">(Le surnom à Bingerville)</span>
                  </label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    placeholder="Ex: Le Sphinx, Major, Koro, Capitaine..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Promotion (Année) *</label>
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
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Niveau d’étude *</label>
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
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Téléphone mobile *</label>
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
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Numéro WhatsApp *</label>
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
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Adresse e-mail personnelle *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@domaine.ci"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Pays de résidence *</label>
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
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Ville de résidence *</label>
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
                      Commune / Quartier de résidence
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

                {/* Photo Upload */}
                <div className="sm:col-span-2 pt-2">
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-2">Photo d’identité ou portrait</label>
                  <div className="border-2 border-dashed border-[#141413]/20 dark:border-white/20 rounded-xl p-5 text-center bg-[#F8F8F6] dark:bg-[#141413] hover:border-[#F2B705] transition-colors">
                    {photoDataUrl ? (
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={photoDataUrl}
                          alt="Aperçu"
                          className="w-16 h-16 rounded-xl object-cover border-2 border-[#F2B705]"
                        />
                        <div className="text-left">
                          <p className="text-xs font-semibold text-[#141413] dark:text-white">{photoFilename}</p>
                          <p className="text-[11px] text-[#134E4A] dark:text-emerald-400 font-medium">Photo prête pour la carte ALGB</p>
                          <label className="text-xs text-[#16324F] dark:text-[#F2B705] font-semibold hover:underline cursor-pointer">
                            Changer la photo
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
                      <div>
                        <Camera className="w-8 h-8 text-[#4A4A48] dark:text-zinc-400 mx-auto mb-2" />
                        <label className="inline-block px-4 py-2 bg-[#F2B705] text-[#141413] font-semibold rounded-lg text-xs cursor-pointer hover:bg-[#dfa704] transition-colors">
                          Sélectionner une photo
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </label>
                        <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400 mt-1.5">
                          Format JPG, PNG ou WEBP (Max 2 Mo)
                        </p>
                      </div>
                    )}
                    {photoError && <p className="text-xs text-red-600 dark:text-red-400 mt-2">{photoError}</p>}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#141413]/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#F2B705] text-[#141413] font-semibold text-xs hover:bg-[#dfa704] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continuer vers le parcours professionnel</span>
                  <ArrowRight className="w-4 h-4 text-[#141413]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 : Parcours Pro */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#141413]/10 dark:border-white/10">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#16324F] dark:text-[#F2B705] font-semibold">
                  Étape 2 sur 4
                </span>
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                  Parcours Professionnel & Secteur d’Activité
                </h2>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
                  Identifiez votre secteur et votre institution pour valoriser le réseau d’anciens dans le monde du travail.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Secteur d’activité principal *</label>
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
                    Structure / Institution / Entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={structure}
                    onChange={(e) => setStructure(e.target.value)}
                    placeholder="Ex: Ministère du Plan, Cabinet d'Audit, TotalEnergies..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Situation professionnelle *</label>
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
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-1">Fonction / Poste occupé *</label>
                  <input
                    type="text"
                    required
                    value={fonction}
                    onChange={(e) => setFonction(e.target.value)}
                    placeholder="Ex: Directeur Général, Médecin Chef, Ingénieur Réseaux, Consultant..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#141413]/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 hover:border-[#141413] text-[#141413] dark:text-zinc-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#F2B705] text-[#141413] font-semibold text-xs hover:bg-[#dfa704] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continuer vers les compétences & certifications</span>
                  <ArrowRight className="w-4 h-4 text-[#141413]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 : Competences & BDR */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-[#141413]/10 dark:border-white/10">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#16324F] dark:text-[#F2B705] font-semibold">
                  Étape 3 sur 4
                </span>
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                  Compétences, Formation & Certifications (BDR)
                </h2>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
                  Alimentez la Base de Données des Compétences de l’ALGB pour faciliter les synergies et le mentorat.
                </p>
              </div>

              <div className="space-y-4 text-xs">
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
                      Précisez votre formation
                    </label>
                    <input
                      type="text"
                      required
                      value={formationAutre}
                      onChange={(e) => setFormationAutre(e.target.value)}
                      placeholder="Ex: Énergie solaire, Agro-écologie..."
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-800 dark:text-zinc-200 font-semibold mb-2">
                    Domaines de compétences spécifiques *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DOMAINES_COMPETENCES.map((comp) => {
                      const isChecked = selectedCompetences.includes(comp);
                      return (
                        <label
                          key={comp}
                          onClick={() => toggleCompetence(comp)}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705] text-[#141413] dark:text-white font-semibold'
                              : 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                              isChecked ? 'bg-[#F2B705] text-[#141413] font-bold' : 'border border-[#141413]/30 dark:border-white/30 bg-white dark:bg-[#1e1e1c]'
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
                      className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                        compAutreActive
                          ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705] text-[#141413] dark:text-white font-semibold'
                          : 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                          compAutreActive ? 'bg-[#F2B705] text-[#141413] font-bold' : 'border border-[#141413]/30 dark:border-white/30 bg-white dark:bg-[#1e1e1c]'
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
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-2">
                    Certifications & Diplômes professionnels obtenus
                  </label>
                  <div className="max-h-48 overflow-y-auto p-3 bg-[#F8F8F6] dark:bg-[#141413] rounded-xl border border-[#141413]/10 dark:border-white/10 space-y-1.5">
                    {CERTIFICATIONS_LIST.map((cert) => {
                      const isChecked = selectedCertifications.includes(cert);
                      return (
                        <label
                          key={cert}
                          onClick={() => toggleCertification(cert)}
                          className={`p-2 rounded-lg text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-white font-semibold border border-[#F2B705]/40'
                              : 'text-[#4A4A48] dark:text-zinc-300 hover:bg-white dark:hover:bg-[#1e1e1c]'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 text-[9px] ${
                              isChecked ? 'bg-[#F2B705] text-[#141413] font-bold' : 'border border-[#141413]/30 dark:border-white/30 bg-white dark:bg-[#1e1e1c]'
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
                        certAutreActive ? 'bg-[#FEF8E6] dark:bg-[#2a2719] text-[#141413] dark:text-white font-semibold' : 'text-[#4A4A48] dark:text-zinc-300 hover:bg-white dark:hover:bg-[#1e1e1c]'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 text-[9px] ${
                          certAutreActive ? 'bg-[#F2B705] text-[#141413] font-bold' : 'border border-[#141413]/30 dark:border-white/30 bg-white dark:bg-[#1e1e1c]'
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

              <div className="flex items-center justify-between pt-4 border-t border-[#141413]/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 hover:border-[#141413] text-[#141413] dark:text-zinc-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep3()) setStep(4);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#F2B705] text-[#141413] font-semibold text-xs hover:bg-[#dfa704] flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Continuer vers les préférences & finalisation</span>
                  <ArrowRight className="w-4 h-4 text-[#141413]" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4 : Preferences, Offre de Services & Finalisation */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="pb-4 border-b border-[#141413]/10 dark:border-white/10">
                <span className="text-[11px] uppercase tracking-[0.14em] text-[#16324F] dark:text-[#F2B705] font-semibold">
                  Étape 4 sur 4
                </span>
                <h2 className="text-xl font-heading font-bold text-[#141413] dark:text-white mt-0.5">
                  Offre de Services, Disponibilités & Déclaration
                </h2>
                <p className="text-xs text-[#4A4A48] dark:text-zinc-400 mt-1">
                  Précisez comment vous souhaitez contribuer à l’essor de la communauté des anciens et vos préférences de contact.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1">
                    Services que vous pouvez offrir au réseau *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    placeholder="Ex: Animation d'ateliers d'orientation, consultances en cybersécurité, mentorat pour candidats aux grandes écoles, accueil d'élèves en stage..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-2">
                    Vos disponibilités pour l’Amicale & les camarades
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DISPONIBILITES_LIST.map((d) => {
                      const isChecked = selectedDisponibilites.includes(d);
                      return (
                        <label
                          key={d}
                          onClick={() => toggleDisponibilite(d)}
                          className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[#FEF8E6] dark:bg-[#2a2719] border-[#F2B705] text-[#141413] dark:text-white font-semibold'
                              : 'bg-[#F8F8F6] dark:bg-[#141413] border-[#141413]/10 dark:border-white/10 text-[#4A4A48] dark:text-zinc-300 hover:border-[#141413]/30 dark:hover:border-white/30'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${
                              isChecked ? 'bg-[#F2B705] text-[#141413] font-bold' : 'border border-[#141413]/30 dark:border-white/30 bg-white dark:bg-[#1e1e1c]'
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

                {/* BDR consent */}
                <div className="p-4 bg-[#F8F8F6] dark:bg-[#141413] rounded-xl border border-[#141413]/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#141413] dark:text-white">
                      Intégration à la Base de Données des Compétences (BDR)
                    </p>
                    <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                      Acceptez-vous d’être référencé(e) dans l’annuaire des compétences de l’ALGB ?
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setBdrAnnuaire('Oui')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        bdrAnnuaire === 'Oui' ? 'bg-[#134E4A] text-white' : 'bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-300'
                      }`}
                    >
                      Oui
                    </button>
                    <button
                      type="button"
                      onClick={() => setBdrAnnuaire('Non')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        bdrAnnuaire === 'Non' ? 'bg-red-700 text-white' : 'bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-300'
                      }`}
                    >
                      Non
                    </button>
                  </div>
                </div>

                {/* Partage contacts */}
                <div className="p-4 bg-[#F8F8F6] dark:bg-[#141413] rounded-xl border border-[#141413]/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-[#141413] dark:text-white">
                      Autoriser le partage de contacts (RGPD / ARTCI)
                    </p>
                    <p className="text-[11px] text-[#4A4A48] dark:text-zinc-400">
                      Vos coordonnées seront visibles uniquement aux membres actifs à jour de cotisation qui en font la demande.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPartageContacts('Oui')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        partageContacts === 'Oui' ? 'bg-[#134E4A] text-white' : 'bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-300'
                      }`}
                    >
                      Oui
                    </button>
                    <button
                      type="button"
                      onClick={() => setPartageContacts('Non')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                        partageContacts === 'Non' ? 'bg-red-700 text-white' : 'bg-white dark:bg-[#1e1e1c] border border-[#141413]/15 dark:border-white/15 text-[#4A4A48] dark:text-zinc-300'
                      }`}
                    >
                      Non
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#141413] dark:text-zinc-200 font-semibold mb-1">
                    Observations / Suggestions pour le Bureau Exécutif (Facultatif)
                  </label>
                  <input
                    type="text"
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Propositions d'actions pour le lycée, souhaits pour votre promotion..."
                    className={inputClass}
                  />
                </div>

                <label className="p-4 bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/50 rounded-xl text-xs text-[#141413] dark:text-[#FEF8E6] flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={artciConsent}
                    onChange={(e) => setArtciConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#16324F] rounded shrink-0 cursor-pointer"
                  />
                  <span className="leading-relaxed">
                    <strong>Consentement explicite ARTCI (Loi n° 2013-450) * :</strong> J’autorise l’ALGB
                    à traiter mes données personnelles aux fins de gestion de mon adhésion, de l’Annuaire et
                    de ma carte officielle, conformément à la{' '}
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        setActiveTab('confidentialite');
                      }}
                      className="underline font-bold text-[#16324F] dark:text-[#F2B705] cursor-pointer"
                    >
                      Politique de confidentialité ARTCI
                    </button>
                    . Je peux exercer mes droits d’accès, d’export JSON et d’anonymisation à tout moment depuis mon Espace Membre.
                  </span>
                </label>

                <div className="p-3.5 bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 rounded-xl text-[11px] text-[#4A4A48] dark:text-zinc-300 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16324F] dark:text-[#F2B705] shrink-0 mt-0.5" />
                  <span>
                    En validant ce formulaire, vos données sont synchronisées de façon sécurisée avec l’infrastructure officielle de l’ALGB et vous recevez votre carte d’adhérent certifiée.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#141413]/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/15 dark:border-white/15 hover:border-[#141413] text-[#141413] dark:text-zinc-200 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#141413] border-t-transparent rounded-full animate-spin"></div>
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Finaliser & Valider mon Adhésion</span>
                      <Send className="w-4 h-4 text-[#141413]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 5 : Success Confirmation */}
          {step === 5 && createdMember && (
            <div className="text-center py-8 space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-xl bg-[#FEF8E6] dark:bg-[#2a2719] border border-[#F2B705]/50 flex items-center justify-center text-[#134E4A] dark:text-emerald-400 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-heading text-[#141413] dark:text-white">
                  Enrôlement Officiel Réussi !
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4A48] dark:text-zinc-400 font-editorial italic leading-relaxed">
                  Votre fiche de membre a été intégrée dans l’Annuaire des Anciens Élèves et la Base de Données des Compétences (BDR) de l’ALGB.
                </p>
              </div>

              <div className="bg-[#F8F8F6] dark:bg-[#141413] border border-[#141413]/10 dark:border-white/10 rounded-xl p-5 text-left space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#141413]/10 dark:border-white/10">
                  <span className="text-[#4A4A48] dark:text-zinc-400 text-xs">Matricule Officiel</span>
                  <span className="font-mono font-bold text-[#16324F] dark:text-[#F2B705] text-sm">
                    {createdMember.membershipCardId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A4A48] dark:text-zinc-400">Membre</span>
                  <span className="font-semibold text-[#141413] dark:text-white">
                    {createdMember.firstName} {createdMember.lastName}{' '}
                    {createdMember.nickname && (
                      <span className="text-[#16324F] dark:text-[#F2B705] font-normal">« {createdMember.nickname} »</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A4A48] dark:text-zinc-400">Promotion</span>
                  <span className="font-mono text-[#141413] dark:text-zinc-200 font-semibold">{createdMember.promotionYear}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A4A48] dark:text-zinc-400">Poste & Structure</span>
                  <span className="text-[#141413] dark:text-zinc-200">
                    {createdMember.currentRole} — {createdMember.company}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4A4A48] dark:text-zinc-400">Statut BDR</span>
                  <span className="text-[#134E4A] dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Enrôlé & Actif</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewingCardMember(createdMember)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#F2B705] hover:bg-[#dfa704] text-[#141413] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#141413]" />
                  <span>Afficher ma Carte Biométrique</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('anciens')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#F8F8F6] dark:bg-[#141413] hover:border-[#141413] border border-[#141413]/15 dark:border-white/15 text-[#141413] dark:text-zinc-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Explorer l’Annuaire
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
