export type PaymentType =
  | 'DROIT_ADHESION'
  | 'COTISATION_MENSUELLE'
  | 'DON_PROJET'
  | 'AUTRE';

export type PaymentStatus =
  | 'PAYE'
  | 'EN_ATTENTE'
  | 'EN_RETARD'
  | 'ANNULE';

export type PaymentMethod =
  | 'ORANGE_MONEY'
  | 'MTN_MOMO'
  | 'MOOV_MONEY'
  | 'CARTE_BANCAIRE'
  | 'VIREMENT'
  | 'ESPECES';

export interface MemberTransaction {
  id: string;
  reference: string;
  memberId: string;
  memberName: string;
  promotionYear: number;
  type: PaymentType;
  title: string;
  description?: string;
  monthYears?: string[]; // e.g. ["2026-10", "2026-11"]
  amount: number;
  currency: string;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber: string;
  validatedBy?: string;
  notes?: string;
}

export interface MonthlyDueSlot {
  monthKey: string; // e.g. "2026-01"
  label: string; // "Janvier 2026"
  amount: number; // 5000 FCFA
  status: PaymentStatus;
  transactionId?: string;
  paidDate?: string;
}

export interface AlumniMember {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string; // Pseudo du lycée (ex: "Le Sphinx", "Major", "Koro", "Le Doyen")
  promotionYear: number;
  promotionName: string;
  bacSeries: string;
  studyLevel?: string; // Niveau d'étude (Doctorat / Ph.D, Master, Licence / Bachelor, BTS / DUT, etc.)
  profession: string;
  currentRole: string;
  company: string; // Structure / Institution
  sector: string; // Secteur d'activité
  situation?: string; // Situation professionnelle (Fonction publique, Secteur privé, Freelance, Entrepreneur, etc.)
  city: string;
  commune?: string; // Commune de résidence (Cocody, Plateau, Marcory, etc.)
  country: string;
  email: string;
  phone?: string;
  whatsapp?: string; // Numéro WhatsApp
  linkedin?: string;
  isMentor: boolean;
  isRegistered: boolean;
  membershipStatus: 'A_JOUR' | 'EN_ATTENTE' | 'EXPIRE';
  membershipCardId: string;
  avatarUrl?: string;
  bio: string;

  // Compétences & Certifications (BDR - Base de Données des Compétences)
  mainFormation?: string; // Domaine de formation principale
  skills: string[]; // Domaines de compétences spécifiques
  skillLevel?: string; // Niveau de maîtrise (Débutant, Intermédiaire, Confirmé, Expert)
  experienceYears?: string; // Années d'expérience
  certifications?: string[]; // Certificats / Diplômes professionnels obtenus

  // Préférences, Disponibilités & Offre de Services
  services?: string; // Services que le membre peut offrir au réseau
  availabilities?: string[]; // Disponibilités (Consultances, Formations, Coaching, Télétravail, Mentorat, Animation)

  // Paramètres BDR & Confidentialité
  bdrRegistered?: boolean; // Référencé dans la base de données ressources ALGB
  shareContactsConsent?: boolean; // Autorisation de partage de contacts conditionnée
  observations?: string;
  enrollmentDate?: string;
  enrollmentStatus?: 'VALIDE' | 'EN_ATTENTE_VALIDATION' | 'REJETE';

  isRep: boolean; // Délégué de promotion
  privacy: {
    showEmail: boolean;
    showPhone: boolean;
    allowMentorshipRequests: boolean;
  };
}

export interface Promotion {
  year: number;
  name: string;
  motto: string;
  delegateName: string;
  delegateContact: string;
  totalMembers: number;
  registeredMembers: number;
  nextReunionDate?: string;
  photoUrl?: string;
  announcementsCount: number;
  description: string;
}

export interface ProjectContribution {
  id: string;
  contributorName: string;
  promotionYear?: number;
  amount: number;
  currency: string;
  date: string;
  method: 'ORANGE_MONEY' | 'MTN_MOMO' | 'MOOV_MONEY' | 'CARTE_BANCAIRE' | 'VIREMENT';
  isAnonymous: boolean;
  message?: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'EDUCATION' | 'SOLIDARITE' | 'INFRASTRUCTURE' | 'SANTE' | 'NUMERIQUE';
  summary: string;
  context: string;
  objectives: string[];
  beneficiaries: string;
  budgetGoal: number; // in FCFA
  budgetRaised: number; // in FCFA
  contributorsCount: number;
  status: 'EN_COURS' | 'PLANIFIE' | 'FINALISE';
  progressPercentage: number;
  deadline: string;
  imageUrl: string;
  materialNeeds: string[];
  contributions: ProjectContribution[];
  executionReports: {
    date: string;
    title: string;
    summary: string;
  }[];
}

export interface JobOffer {
  id: string;
  title: string;
  type: 'CDI' | 'CDD' | 'STAGE' | 'CONSULTANCE' | 'PARTENARIAT';
  company: string;
  sector: string;
  location: string;
  postedBy: string;
  postedByPromo: number;
  postedDate: string;
  deadline: string;
  description: string;
  requirements: string[];
  contactEmail: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category:
    | 'EVENEMENTS'
    | 'ANNONCES'
    | 'REUSSITE'
    | 'COMMUNIQUE'
    | 'VIE_AMICALE'
    | 'SOLIDARITE'
    | 'EXCELLENCE'
    | 'HISTOIRE';
  date: string;
  author: string;
  summary: string;
  content: string;
  imageUrl: string;
  isImportant?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  city: string;
  type: 'GALA' | 'ASSEMBLEE_GENERALE' | 'SPORT' | 'CONFERENCE' | 'RETROUVAILLES';
  summary: string;
  description: string;
  attendeesCount: number;
  maxCapacity?: number;
  imageUrl: string;
  isRegistrationOpen: boolean;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'HISTOIRE' | 'PROMOTIONS' | 'RETROUVAILLES' | 'ACTIONS' | 'CEREMONIES';
  year: string;
  imageUrl: string;
  caption: string;
}

export interface YouTubeVideo {
  id: string;
  youtubeId: string;
  title: string;
  category: 'DOCUMENTAIRE' | 'RETROUVAILLES' | 'PROJETS' | 'TEMOIGNAGES' | 'EXCELLENCE';
  duration: string;
  viewsCount: string;
  publishedDate: string;
  thumbnailUrl: string;
  description: string;
  isFeatured?: boolean;
}

export const INITIAL_PHOTOS: GalleryPhoto[] = [
  {
    id: 'gal-01',
    title: 'Promotion Historique des Années 1960 sur le Peristyle d’Honneur',
    category: 'HISTOIRE',
    year: 'Archives 1962',
    imageUrl: '/assets/images/algb_vintage_students_archive_1794388532357.jpg',
    caption: 'Photographie d’archives d’époque : groupe d’élèves en uniforme kaki officiel et leurs professeurs devant les arcades coloniales du Lycée de Garçons de Bingerville.',
  },
  {
    id: 'gal-02',
    title: 'L’Allée des Palmiers Royaux et le Pavillon Colonial d’Époque',
    category: 'HISTOIRE',
    year: 'Circa 1950',
    imageUrl: '/assets/images/bingerville_historic_heritage_1794382830908.jpg',
    caption: 'L’allée historique bordée de palmiers royaux centenaires menant à l’entrée d’honneur du Lycée de Garçons de Bingerville.',
  },
  {
    id: 'gal-03',
    title: 'Soirée de Fraternité & Dîner de Gala des Anciens au Sofitel',
    category: 'RETROUVAILLES',
    year: 'Octobre 2026',
    imageUrl: '/assets/images/alumni_reunion_ceremony_1794382829849.jpg',
    caption: 'Retrouvailles solennelles réunissant les promotions 1974 à 2024 au Sofitel Ivoire à Abidjan pour célébrer la fraternité intergénérationnelle.',
  },
  {
    id: 'gal-04',
    title: 'Nouveaux Laboratoires Scientifiques & Salle Multimédia Connectée',
    category: 'ACTIONS',
    year: 'Rentrée 2026',
    imageUrl: '/assets/images/school_library_excellence_1794382830305.jpg',
    caption: 'Élèves du second cycle manipulant les équipements scientifiques et postes informatiques financés par la souscription de l’ALGB.',
  },
  {
    id: 'gal-05',
    title: 'Cour d’Honneur et Bâtiments Historiques sous les Tropiques',
    category: 'HISTOIRE',
    year: 'Patrimoine 2026',
    imageUrl: '/assets/images/bingerville_lycee_campus_1794382827777.jpg',
    caption: 'Vue aérienne de l’arcade coloniale et des espaces verts du lycée au coucher du soleil.',
  },
  {
    id: 'gal-06',
    title: 'Allocution Solennelle du Grand Gala de Bienfaisance',
    category: 'CEREMONIES',
    year: 'Édition 2026',
    imageUrl: '/assets/images/algb_youtube_gala_ceremony_1794388517940.jpg',
    caption: 'Discours d’ouverture devant l’assemblée générale des anciens réunis pour financer le fonds de bourses d’excellence.',
  },
];

export const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-01',
    youtubeId: '2b9x_bC8oQE',
    title: 'Documentaire Officiel : 120 Ans d’Excellence et d’Histoire du Lycée de Garçons de Bingerville',
    category: 'DOCUMENTAIRE',
    duration: '26:40',
    viewsCount: '12,5 k vues',
    publishedDate: '15 Octobre 2026',
    thumbnailUrl: '/assets/images/algb_youtube_doc_cover_1794388504553.jpg',
    description: 'Immersion rétrospective au cœur du patrimoine du premier pôle d’excellence secondaire de Côte d’Ivoire. Témoignages poignants d’anciens élèves devenus bâtisseurs de la République, souvenirs inoubliables de l’internat et vision d’avenir portée par l’ALGB.',
    isFeatured: true,
  },
  {
    id: 'yt-02',
    youtubeId: 'L_LUpnjgPso',
    title: 'Grand Dîner de Gala des Anciens au Sofitel Ivoire & Cérémonie de Fraternité',
    category: 'RETROUVAILLES',
    duration: '18:15',
    viewsCount: '8,9 k vues',
    publishedDate: '28 Octobre 2026',
    thumbnailUrl: '/assets/images/algb_youtube_gala_ceremony_1794388517940.jpg',
    description: 'Revivez les temps forts de la Nuit de l’Excellence ALGB : hymne du lycée entonné par plus de 600 anciens, discours d’orientation du Président et remise solennelle des distinctions d’honneur.',
  },
  {
    id: 'yt-03',
    youtubeId: 'kJQP7kiw5Fk',
    title: 'Inauguration des Nouveaux Laboratoires de Physique-Chimie & Bibliothèque Numérique',
    category: 'PROJETS',
    duration: '09:45',
    viewsCount: '4,2 k vues',
    publishedDate: '05 Novembre 2026',
    thumbnailUrl: '/assets/images/school_library_excellence_1794382830305.jpg',
    description: 'Visite guidée des infrastructures modernisées grâce aux contributions et dons des promotions d’anciens élèves du LGB. Démonstration des 30 postes multimédias connectés et équipements scientifiques.',
  },
  {
    id: 'yt-04',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'Mémoire Vivante : Entretiens Croisés des Doyens des Promotions 1974 & 1982',
    category: 'TEMOIGNAGES',
    duration: '22:30',
    viewsCount: '6,1 k vues',
    publishedDate: '20 Septembre 2026',
    thumbnailUrl: '/assets/images/bingerville_historic_heritage_1794382830908.jpg',
    description: 'Dr. Konan Kouamé et Maître Moussa Diomandé racontent les années d’internat, la rigueur des études, la fraternité indéfectible et l’impact déterminant du lycée sur leurs prestigieuses carrières.',
  },
  {
    id: 'yt-05',
    youtubeId: 'ysz5S6PUM-U',
    title: 'Prix d’Excellence ALGB 2026 : Récompense des Majors de Promotion et Bourses d’Études',
    category: 'EXCELLENCE',
    duration: '12:10',
    viewsCount: '3,8 k vues',
    publishedDate: '02 Juillet 2026',
    thumbnailUrl: '/assets/images/alumni_reunion_ceremony_1794382829849.jpg',
    description: 'Célébration du mérite académique sur la place d’armes du lycée. Remise des bourses d’excellence et ordinateurs portables offerts par l’Amicale aux bacheliers avec mention Très Bien.',
  },
  {
    id: 'yt-06',
    youtubeId: 'JGwWNGJdvx8',
    title: 'Défilé Traditionnel des Générations & Hymne du Lycée sur la Cour d’Honneur',
    category: 'RETROUVAILLES',
    duration: '07:50',
    viewsCount: '9,4 k vues',
    publishedDate: '12 Avril 2026',
    thumbnailUrl: '/assets/images/algb_vintage_students_archive_1794388532357.jpg',
    description: 'Moments d’émotion intense lors du rassemblement annuel sur la cour d’honneur. Toutes les promotions réunies chantent l’hymne sacré du Lycée de Garçons de Bingerville.',
  },
  {
    id: 'yt-07',
    youtubeId: 'aqz-KE-bpKQ',
    title: 'Masterclass Mentorat : Les Alumni Cadres Dirigeants Conseillent les Jeunes Diplômés',
    category: 'EXCELLENCE',
    duration: '31:15',
    viewsCount: '5,3 k vues',
    publishedDate: '18 Août 2026',
    thumbnailUrl: '/assets/images/bingerville_lycee_campus_1794382827777.jpg',
    description: 'Partage d’expérience sur les concours d’ingénieurs, les métiers de la finance, la haute magistrature et l’entrepreneuriat par les anciens élèves en poste en Côte d’Ivoire et à l’international.',
  },
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    year: 1974,
    name: 'Promotion Pionniers',
    motto: 'Savoir, Honneur et Devoir',
    delegateName: 'Dr. Konan Kouamé',
    delegateContact: 'contact@algb-bingerville.ci',
    totalMembers: 84,
    registeredMembers: 42,
    nextReunionDate: '2026-11-28',
    announcementsCount: 3,
    description: 'La promotion des premiers bâtisseurs du lycée républicain après les grandes réformes éducatives.',
  },
  {
    year: 1982,
    name: 'Promotion Fraternité',
    motto: 'Unis pour Servir',
    delegateName: 'Maître Diomandé Moussa',
    delegateContact: 'promo1982@algb-bingerville.ci',
    totalMembers: 110,
    registeredMembers: 68,
    nextReunionDate: '2026-12-15',
    announcementsCount: 5,
    description: 'Une génération de hauts cadres de la magistrature, de la banque et de la haute administration publique.',
  },
  {
    year: 1988,
    name: 'Promotion Émergence',
    motto: 'L’Audace d’Entreprendre',
    delegateName: 'Ing. Jean-Luc Bamba',
    delegateContact: 'promo1988@algb-bingerville.ci',
    totalMembers: 135,
    registeredMembers: 92,
    nextReunionDate: '2026-12-20',
    announcementsCount: 4,
    description: 'Promoteurs du développement industriel, de l’agro-industrie et de l’ingénierie ivoirienne.',
  },
  {
    year: 1995,
    name: 'Promotion Excellence',
    motto: 'La Rigueur comme boussole',
    delegateName: 'Prof. Yapi Sébastien',
    delegateContact: 'promo1995@algb-bingerville.ci',
    totalMembers: 148,
    registeredMembers: 112,
    nextReunionDate: '2027-01-16',
    announcementsCount: 7,
    description: 'Génération active fortement engagée dans l’enseignement supérieur, la recherche et la médecine.',
  },
  {
    year: 2002,
    name: 'Promotion Millénaire',
    motto: 'L’Avenir entre nos mains',
    delegateName: 'M. Touré Amadou',
    delegateContact: 'promo2002@algb-bingerville.ci',
    totalMembers: 160,
    registeredMembers: 128,
    nextReunionDate: '2026-12-05',
    announcementsCount: 8,
    description: 'Pionniers des télécoms et du numérique en Côte d’Ivoire et à l’international.',
  },
  {
    year: 2010,
    name: 'Promotion Bâtisseurs',
    motto: 'Agir pour Impacter',
    delegateName: 'M. Coulibaly Idriss',
    delegateContact: 'promo2010@algb-bingerville.ci',
    totalMembers: 175,
    registeredMembers: 145,
    nextReunionDate: '2027-02-14',
    announcementsCount: 6,
    description: 'Entrepreneurs, consultants financiers et leaders d’organisations non gouvernementales.',
  },
  {
    year: 2018,
    name: 'Promotion Renaissance',
    motto: 'Innovation et Solidarité',
    delegateName: 'M. Kassi Stéphane',
    delegateContact: 'promo2018@algb-bingerville.ci',
    totalMembers: 190,
    registeredMembers: 158,
    nextReunionDate: '2026-11-21',
    announcementsCount: 9,
    description: 'Une promotion dynamique très connectée, actrice de la transition numérique et de l’écosystème tech.',
  },
  {
    year: 2024,
    name: 'Promotion Rayonnement',
    motto: 'Flambeau vers le futur',
    delegateName: 'M. N’Goran Franck',
    delegateContact: 'promo2024@algb-bingerville.ci',
    totalMembers: 210,
    registeredMembers: 178,
    nextReunionDate: '2026-12-12',
    announcementsCount: 11,
    description: 'La plus jeune promotion diplômée, porteuse des espoirs académiques dans les grandes écoles d’ingénieurs.',
  },
];

export const INITIAL_MEMBERS: AlumniMember[] = [
  {
    id: 'mem-001',
    firstName: 'Amadou',
    lastName: 'Touré',
    nickname: 'Le Sphinx',
    promotionYear: 2002,
    promotionName: 'Promotion Millénaire',
    bacSeries: 'Série C (Mathématiques & Physiques)',
    studyLevel: 'Master',
    profession: 'Directeur des Systèmes d’Information',
    currentRole: 'Chief Technology Officer (CTO)',
    company: 'Fintech West Africa Group',
    sector: 'Informatique / Numérique / IA',
    situation: 'Employé dans le secteur privé',
    city: 'Abidjan',
    commune: 'Cocody',
    country: 'Côte d’Ivoire',
    email: 'amadou.toure@algb-alumni.ci',
    phone: '+225 07 08 09 10 11',
    whatsapp: '+225 07 08 09 10 11',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2002-0042',
    bio: 'Ancien interne du Lycée de Garçons de Bingerville (1995-2002). Passionné par l’inclusion financière numérique et mentor actif pour les jeunes diplômés en ingénierie.',
    mainFormation: 'Informatique / Génie logiciel',
    skills: ['Informatique / IA', 'Gestion de projets', 'Recherche / Données'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 10 ans',
    certifications: ['PMP – Project Management Professional', 'Microsoft Azure / AWS / GCP', 'Cisco CCNA / CCNP'],
    services: 'Audit d’architecture logicielle, sécurisation de plateformes cloud et mentorat des jeunes ingénieurs.',
    availabilities: ['Mentorat', 'Consultances', 'Télétravail'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '12/10/2026, 09:14:22',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-002',
    firstName: 'Dr. Sébastien',
    lastName: 'Yapi',
    nickname: 'Major Yapi',
    promotionYear: 1995,
    promotionName: 'Promotion Excellence',
    bacSeries: 'Série D (Sciences de la Nature)',
    studyLevel: 'Doctorat / Ph.D',
    profession: 'Médecin Chirurgien & Universitaire',
    currentRole: 'Chef de Service Adjoint',
    company: 'Centre Hospitalier Universitaire (CHU) de Treichville',
    sector: 'Santé / Médecine / Pharmacie',
    situation: 'Employé à la fonction publique',
    city: 'Abidjan',
    commune: 'Treichville',
    country: 'Côte d’Ivoire',
    email: 'sebastien.yapi@algb-alumni.ci',
    phone: '+225 05 06 07 08 09',
    whatsapp: '+225 05 06 07 08 09',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-1995-0018',
    bio: 'Diplômé du LGB en 1995. Engagé dans les missions médicales humanitaires de l’Amicale et la rénovation de l’infirmerie du lycée.',
    mainFormation: 'Médecine générale',
    skills: ['Santé / Médecine', 'Recherche / Données', 'Éducation / Formation'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 20 ans',
    certifications: ['First Aid / Secourisme', 'PHAST / WASH', 'SPHERE Standards'],
    services: 'Conférences de prévention sanitaire, parrainage d’étudiants en médecine et consultations bénévoles lors des caravanes ALGB.',
    availabilities: ['Mentorat', 'Formations', 'Animation'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '08/09/2026, 16:45:10',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-003',
    firstName: 'Jean-Luc',
    lastName: 'Bamba',
    nickname: 'Koro Bamba',
    promotionYear: 1988,
    promotionName: 'Promotion Émergence',
    bacSeries: 'Série C',
    studyLevel: 'Master',
    profession: 'Ingénieur des Ponts et Chaussées',
    currentRole: 'Directeur des Grands Travaux',
    company: 'Cabinet d’Ingénierie & BTP Côte d’Ivoire',
    sector: 'BTP / Génie civil',
    situation: 'Employé dans le secteur privé',
    city: 'Yamoussoukro',
    commune: 'Habitat',
    country: 'Côte d’Ivoire',
    email: 'jl.bamba@btp-ci.com',
    phone: '+225 01 02 03 04 05',
    whatsapp: '+225 01 02 03 04 05',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-1988-0007',
    bio: '30 ans d’expérience dans les infrastructures de transport en Afrique de l’Ouest. Parrain technique du projet de réhabilitation des bâtiments coloniaux du lycée.',
    mainFormation: 'Génie civil / BTP',
    skills: ['BTP / Génie civil', 'Gestion de projets', 'Agriculture / Agro'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 20 ans',
    certifications: ['PMP – Project Management Professional', 'PRINCE2 Foundation / Practitioner'],
    services: 'Études de faisabilité technique pour les chantiers de l’Amicale, assistance à maîtrise d’ouvrage et mentorat BTP.',
    availabilities: ['Consultances', 'Mentorat'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '15/08/2026, 11:20:30',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: false,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-004',
    firstName: 'Maître Moussa',
    lastName: 'Diomandé',
    nickname: 'Le Doyen Juriste',
    promotionYear: 1982,
    promotionName: 'Promotion Fraternité',
    bacSeries: 'Série A1 (Lettres & Philosophie)',
    studyLevel: 'Doctorat / Ph.D',
    profession: 'Avocat au Barreau',
    currentRole: 'Associé Gérant',
    company: 'Cabinet Diomandé & Associés',
    sector: 'Juridique / Droit',
    situation: 'Travailleur indépendant / Freelance',
    city: 'Abidjan',
    commune: 'Plateau',
    country: 'Côte d’Ivoire',
    email: 'm.diomande@barreau.ci',
    phone: '+225 07 11 22 33 44',
    whatsapp: '+225 07 11 22 33 44',
    isMentor: false,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-1982-0003',
    bio: 'Conseiller juridique de l’Amicale, veille au respect des statuts et à la bonne gouvernance institutionnelle.',
    mainFormation: 'Droit / Sciences juridiques',
    skills: ['Droit / Juridique', 'Gestion de projets', 'Communication'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 20 ans',
    certifications: ['Permis de conduire (A/B/C/D)'],
    services: 'Conseil juridique statutaire, rédaction de conventions de partenariats et assistance fiscale associative.',
    availabilities: ['Consultances', 'Animation'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '01/07/2026, 10:00:00',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: false,
      allowMentorshipRequests: false,
    },
  },
  {
    id: 'mem-005',
    firstName: 'Stéphane',
    lastName: 'Kassi',
    nickname: 'Data Boy',
    promotionYear: 2018,
    promotionName: 'Promotion Renaissance',
    bacSeries: 'Série E (Mathématiques & Technique)',
    studyLevel: 'Master',
    profession: 'Ingénieur Intelligence Artificielle & Data',
    currentRole: 'Senior Data Scientist',
    company: 'Banque Atlantique / Groupe BCP',
    sector: 'Banque / Finance / Assurance',
    situation: 'Employé dans le secteur privé',
    city: 'Abidjan',
    commune: 'Marcory',
    country: 'Côte d’Ivoire',
    email: 'stephane.kassi@algb-alumni.ci',
    phone: '+225 05 44 33 22 11',
    whatsapp: '+225 05 44 33 22 11',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2018-0078',
    bio: 'Lauréat du Prix d’Excellence LGB 2018. Animateur bénévole des ateliers de code et d’orientation numérique pour les lycéens.',
    mainFormation: 'Intelligence artificielle / Data science',
    skills: ['Informatique / IA', 'Recherche / Données', 'Finance / Compta'],
    skillLevel: 'Confirmé',
    experienceYears: '5 à 10 ans',
    certifications: ['IBM Data Science Professional', 'Google Data Analytics', 'Scrum Master (CSM / PSM)'],
    services: 'Formations Python & IA, modélisation prédictive de scoring financier et accompagnement des mémoires d’ingénieurs.',
    availabilities: ['Formations', 'Coaching', 'Mentorat', 'Télétravail'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '20/10/2026, 18:25:00',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-006',
    firstName: 'Idriss',
    lastName: 'Coulibaly',
    nickname: 'L’Argentier',
    promotionYear: 2010,
    promotionName: 'Promotion Bâtisseurs',
    bacSeries: 'Série D',
    studyLevel: 'Master',
    profession: 'Directeur Financier & Auditeur',
    currentRole: 'Directeur Administratif et Financier',
    company: 'SITAB Côte d’Ivoire',
    sector: 'Commerce / Distribution',
    situation: 'Employé dans le secteur privé',
    city: 'Abidjan',
    commune: 'Yopougon',
    country: 'Côte d’Ivoire',
    email: 'idriss.coulibaly@algb-alumni.ci',
    phone: '+225 07 99 88 77 66',
    whatsapp: '+225 07 99 88 77 66',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2010-0033',
    bio: 'Spécialiste de la conformité financière et de la levée de fonds pour projets associatifs et éducatifs.',
    mainFormation: 'Finance / Comptabilité / Audit',
    skills: ['Finance / Compta', 'Gestion de projets', 'Entrepreneuriat'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 10 ans',
    certifications: ['CPA – Certified Public Accountant', 'CFA – Chartered Financial Analyst'],
    services: 'Audit financier d’entreprises, structuration de plans de trésorerie et modélisation de levées de fonds.',
    availabilities: ['Consultances', 'Coaching', 'Mentorat'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '05/09/2026, 13:10:45',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: false,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-007',
    firstName: 'Franck',
    lastName: 'N’Goran',
    nickname: 'Le Virtuose',
    promotionYear: 2024,
    promotionName: 'Promotion Rayonnement',
    bacSeries: 'Série C',
    studyLevel: 'Licence / Bachelor',
    profession: 'Élève Ingénieur en Classes Préparatoires',
    currentRole: 'Étudiant Math Sup / Spé',
    company: 'INP-HB Yamoussoukro',
    sector: 'Éducation / Formation',
    situation: 'Étudiant(e)',
    city: 'Yamoussoukro',
    commune: 'Assabou',
    country: 'Côte d’Ivoire',
    email: 'franck.ngoran@algb-alumni.ci',
    phone: '+225 01 90 80 70 60',
    whatsapp: '+225 01 90 80 70 60',
    isMentor: false,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2024-0012',
    bio: 'Major de promotion LGB 2024. Porte-voix de la dernière promotion et coordinateur de l’intégration des jeunes bacheliers.',
    mainFormation: 'Mathématiques / Statistiques',
    skills: ['Recherche / Données', 'Éducation / Formation'],
    skillLevel: 'Intermédiaire',
    experienceYears: 'Moins de 2 ans',
    certifications: ['Permis de conduire (A/B/C/D)'],
    services: 'Soutien scolaire en mathématiques et physique pour les lycéens de terminale à Bingerville.',
    availabilities: ['Mentorat', 'Animation'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '30/09/2026, 21:05:00',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: false,
    },
  },
  {
    id: 'mem-008',
    firstName: 'Alain',
    lastName: 'Kouassi',
    nickname: 'Capitaine',
    promotionYear: 2005,
    promotionName: 'Promotion Renaissance',
    bacSeries: 'Série C',
    studyLevel: 'Master',
    profession: 'Directeur Logistique & Supply Chain',
    currentRole: 'Directeur des Opérations Portuaires',
    company: 'Bolloré Transport & Logistics / AGL',
    sector: 'Logistique / Transport',
    situation: 'Employé dans le secteur privé',
    city: 'San-Pédro',
    commune: 'Cité',
    country: 'Côte d’Ivoire',
    email: 'alain.kouassi@agl-alumni.ci',
    phone: '+225 07 45 67 89 01',
    whatsapp: '+225 07 45 67 89 01',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2005-0089',
    bio: 'Ancien pensionnaire du dortoir D. 18 ans d’expérience dans l’optimisation des chaînes logistiques maritimes en Afrique de l’Ouest.',
    mainFormation: 'Logistique / Supply chain',
    skills: ['Gestion de projets', 'Commerce / Distribution'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 10 ans',
    certifications: ['PMP – Project Management Professional', 'Permis de conduire (A/B/C/D)'],
    services: 'Optimisation de fret international, dédouanement et accompagnement de jeunes bacheliers vers les carrières maritimes.',
    availabilities: ['Mentorat', 'Consultances'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '18/10/2026, 15:40:12',
    enrollmentStatus: 'VALIDE',
    isRep: false,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-009',
    firstName: 'Patrick',
    lastName: 'Drogba',
    nickname: 'Le Doyen Parisien',
    promotionYear: 1999,
    promotionName: 'Promotion Pionniers Tech',
    bacSeries: 'Série C',
    studyLevel: 'Doctorat / Ph.D',
    profession: 'Consultant Stratégie & Cloud Architect',
    currentRole: 'Principal Cloud Solution Architect',
    company: 'Cabinet Conseil International Paris',
    sector: 'Informatique / Numérique / IA',
    situation: 'Travailleur indépendant / Freelance',
    city: 'Paris',
    commune: '16e arr.',
    country: 'France',
    email: 'p.drogba@cloud-paris.fr',
    phone: '+33 6 12 34 56 78',
    whatsapp: '+33 6 12 34 56 78',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-1999-0015',
    bio: 'Président de la section ALGB Diaspora France & Europe. Passionné par l’orientation des étudiants ivoiriens dans les grandes écoles européennes.',
    mainFormation: 'Informatique / Génie logiciel',
    skills: ['Informatique / IA', 'Gestion de projets', 'Recherche / Données'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 20 ans',
    certifications: ['Microsoft Azure / AWS / GCP', 'CompTIA Security+ / Network+', 'Scrum Master (CSM / PSM)'],
    services: 'Architecture cloud pour startups et gouvernements, coaching pour l’obtention de visas étudiants et stages à l’international.',
    availabilities: ['Consultances', 'Mentorat', 'Télétravail', 'Coaching'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '02/11/2026, 17:30:00',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-010',
    firstName: 'Cheikh Tidiane',
    lastName: 'Bâ',
    nickname: 'Le Stratège',
    promotionYear: 2004,
    promotionName: 'Promotion Horizon',
    bacSeries: 'Série C',
    studyLevel: 'Master',
    profession: 'Économiste & Banquier d’Investissement',
    currentRole: 'Directeur Régional Financements Structurés',
    company: 'Banque Ouest-Africaine de Développement (Dakar)',
    sector: 'Banque / Finance / Assurance',
    situation: 'Employé dans le secteur privé',
    city: 'Dakar',
    commune: 'Almadies',
    country: 'Sénégal',
    email: 'ct.ba@algb-diaspora.sn',
    phone: '+221 77 123 45 67',
    whatsapp: '+221 77 123 45 67',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2004-0051',
    bio: 'Ancien pensionnaire du LGB, coordonnateur des anciens élèves résidant au Sénégal et en Afrique de l’Ouest.',
    mainFormation: 'Finance / Économie appliquée',
    skills: ['Finance / Compta', 'Gestion de projets', 'Entrepreneuriat'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 10 ans',
    certifications: ['CFA – Chartered Financial Analyst'],
    services: 'Montage de financements de PME, mentorat carrière bancaire en zone UEMOA.',
    availabilities: ['Mentorat', 'Consultances'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '04/11/2026, 10:15:00',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-011',
    firstName: 'Olivier',
    lastName: 'Koffi',
    nickname: 'Québecois',
    promotionYear: 2012,
    promotionName: 'Promotion Avenir',
    bacSeries: 'Série D',
    studyLevel: 'Doctorat / Ph.D',
    profession: 'Chercheur en Énergies Renouvelables',
    currentRole: 'Ingénieur Principal Réseaux Électriques',
    company: 'Hydro-Québec Innovation',
    sector: 'Énergie / Environnement',
    situation: 'Employé dans le secteur privé',
    city: 'Montréal',
    commune: 'Ville-Marie',
    country: 'Canada',
    email: 'olivier.koffi@algb-canada.ca',
    phone: '+1 514 555 0198',
    whatsapp: '+1 514 555 0198',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2012-0064',
    bio: 'Délégué de la section ALGB Amérique du Nord. Accompagne les étudiants et jeunes diplômés dans leur installation au Canada.',
    mainFormation: 'Génie électrique / Énergies renouvelables',
    skills: ['Énergie / Environnement', 'Recherche / Données', 'Gestion de projets'],
    skillLevel: 'Expert',
    experienceYears: '5 à 10 ans',
    certifications: ['PMP – Project Management Professional'],
    services: 'Conseils d’orientation universitaire au Canada et ingénierie de micro-réseaux solaires.',
    availabilities: ['Mentorat', 'Télétravail', 'Formations'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '06/11/2026, 14:20:00',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: false,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-012',
    firstName: 'Hervé',
    lastName: 'Aka',
    nickname: 'Le Diplomate',
    promotionYear: 1997,
    promotionName: 'Promotion Unité',
    bacSeries: 'Série A2',
    studyLevel: 'Master',
    profession: 'Conseiller Coopération Internationale',
    currentRole: 'Expert Senior Politiques Publiques ACP-UE',
    company: 'Mission Économique Bruxelles',
    sector: 'Administration publique / ONG',
    situation: 'Employé à la fonction publique',
    city: 'Bruxelles',
    commune: 'Ixelles',
    country: 'Belgique',
    email: 'herve.aka@algb-europe.be',
    phone: '+32 470 12 34 56',
    whatsapp: '+32 470 12 34 56',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-1997-0029',
    bio: 'Facilite les partenariats éducatifs et mécénats européens en faveur des lycées d’excellence de Côte d’Ivoire.',
    mainFormation: 'Relations internationales / Droit public',
    skills: ['Gestion de projets', 'Communication', 'Droit / Juridique'],
    skillLevel: 'Expert',
    experienceYears: 'Plus de 20 ans',
    certifications: ['PRINCE2 Foundation / Practitioner'],
    services: 'Montage de dossiers de subventions internationales et coopération institutionnelle.',
    availabilities: ['Consultances', 'Mentorat'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '07/11/2026, 09:40:00',
    enrollmentStatus: 'VALIDE',
    isRep: false,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
  {
    id: 'mem-013',
    firstName: 'Yannick',
    lastName: 'Gnahoré',
    nickname: 'Atlas',
    promotionYear: 2016,
    promotionName: 'Promotion Conquérants',
    bacSeries: 'Série C',
    studyLevel: 'Master',
    profession: 'Architecte Cybersécurité',
    currentRole: 'Lead Security Engineer',
    company: 'OCP Digital Solutions Casablanca',
    sector: 'Informatique / Numérique / IA',
    situation: 'Employé dans le secteur privé',
    city: 'Casablanca',
    commune: 'Maârif',
    country: 'Maroc',
    email: 'yannick.gnahore@algb-maghreb.ma',
    phone: '+212 6 12 34 56 78',
    whatsapp: '+212 6 12 34 56 78',
    isMentor: true,
    isRegistered: true,
    membershipStatus: 'A_JOUR',
    membershipCardId: 'ALGB-2016-0091',
    bio: 'Ancien boursier d’excellence au Maroc, coordonne l’accueil des nouveaux bacheliers du LGB inscrits dans les écoles marocaines.',
    mainFormation: 'Cybersécurité / Réseaux',
    skills: ['Informatique / IA', 'Éducation / Formation'],
    skillLevel: 'Confirmé',
    experienceYears: '5 à 10 ans',
    certifications: ['CompTIA Security+ / Network+', 'Cisco CCNA / CCNP'],
    services: 'Audit de sécurité applicative et parrainage des étudiants ivoiriens au Maghreb.',
    availabilities: ['Mentorat', 'Coaching', 'Télétravail'],
    bdrRegistered: true,
    shareContactsConsent: true,
    enrollmentDate: '09/11/2026, 11:05:00',
    enrollmentStatus: 'VALIDE',
    isRep: true,
    privacy: {
      showEmail: true,
      showPhone: true,
      allowMentorshipRequests: true,
    },
  },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'Rénovation & Numérisation de la Grande Bibliothèque du Lycée',
    category: 'EDUCATION',
    summary: 'Rénover l’espace historique de lecture, doter la bibliothèque de 5 000 ouvrages récents et déployer 30 postes multimédias connectés.',
    context: 'La bibliothèque centrale du Lycée de Garçons de Bingerville, inaugurée dans les années 1960, nécessite une rénovation thermique, l’installation d’un réseau fibre optique et le renouvellement de son fonds documentaire scientifique et littéraire.',
    objectives: [
      'Réhabilitation complète des rayonnages et mobilier en bois noble ivoirien',
      'Installation de 30 ordinateurs portables avec accès aux ressources scientifiques numériques',
      'Acquisition de manuels scolaires et classiques de la littérature africaine et mondiale',
      'Climatisation solaire et sécurisation des ouvrages rares',
    ],
    beneficiaries: 'Plus de 2 400 élèves inscrits et 120 enseignants du Lycée',
    budgetGoal: 35000000,
    budgetRaised: 24850000,
    contributorsCount: 74,
    status: 'EN_COURS',
    progressPercentage: 71,
    deadline: '31 Mars 2027',
    imageUrl: '/assets/images/school_library_excellence_1794382830305.jpg',
    materialNeeds: [
      '30 Ordinateurs portables ou stations bureautiques',
      '1 Serveur local pour la bibliothèque numérique hors-ligne',
      'Mobilier de bibliothèque : tables de travail de 6 places et chaises ergonomiques',
      'Fonds de livres : mathématiques, physique-chimie, histoire de la Côte d’Ivoire',
    ],
    contributions: [
      {
        id: 'cnt-01',
        contributorName: 'Promotion 1988 Émergence',
        promotionYear: 1988,
        amount: 5000000,
        currency: 'FCFA',
        date: '2026-10-15',
        method: 'VIREMENT',
        isAnonymous: false,
        message: 'Pour que nos jeunes frères aient les mêmes chances de réussite académique.',
      },
      {
        id: 'cnt-02',
        contributorName: 'Amadou Touré',
        promotionYear: 2002,
        amount: 1500000,
        currency: 'FCFA',
        date: '2026-10-22',
        method: 'ORANGE_MONEY',
        isAnonymous: false,
        message: 'Don personnel pour la connectivité réseau et les licences informatiques.',
      },
      {
        id: 'cnt-03',
        contributorName: 'Un ancien de la Promo 1974',
        promotionYear: 1974,
        amount: 2000000,
        currency: 'FCFA',
        date: '2026-11-01',
        method: 'CARTE_BANCAIRE',
        isAnonymous: true,
      },
    ],
    executionReports: [
      {
        date: '2026-09-30',
        title: 'Validation de l’appel d’offres de réfection des boiseries',
        summary: 'Attribution du marché de réfection des tables historiques à un artisan menuisier d’art de Bingerville.',
      },
      {
        date: '2026-10-18',
        title: 'Réception du premier lot d’équipements réseaux',
        summary: 'Installation des baies de brassage et câblage blindé de l’aile Sud de la bibliothèque.',
      },
    ],
  },
  {
    id: 'proj-002',
    title: 'Fonds des Bourses d’Excellence & Mérite ALGB 2026-2027',
    category: 'SOLIDARITE',
    summary: 'Financer l’internat, les fournitures et les bourses d’études des 25 meilleurs élèves défavorisés du lycée.',
    context: 'L’internat a toujours été le ciment de l’égalité des chances au Lycée de Garçons de Bingerville. Ce fonds garantit la prise en charge intégrale des élèves méritants issus de familles aux revenus modestes.',
    objectives: [
      'Octroi de 25 bourses complètes annuelles (frais de cantine, internat, santé, fournitures)',
      'Attribution de prix spéciaux pour les majors de chaque niveau (de la 6ème à la Terminale)',
      'Parrainage nominatif par un ancien élève tuteur',
    ],
    beneficiaries: '25 élèves boursiers méritants et leurs familles',
    budgetGoal: 15000000,
    budgetRaised: 11400000,
    contributorsCount: 52,
    status: 'EN_COURS',
    progressPercentage: 76,
    deadline: '15 Décembre 2026',
    imageUrl: '/assets/images/alumni_reunion_ceremony_1794382829849.jpg',
    materialNeeds: [
      'Packs complets de calculatrices scientifiques programmables',
      'Kits de fournitures scolaires pour la rentrée',
    ],
    contributions: [
      {
        id: 'cnt-10',
        contributorName: 'Collectif des Anciens de la Diaspora Europe',
        amount: 4500000,
        currency: 'FCFA',
        date: '2026-09-12',
        method: 'VIREMENT',
        isAnonymous: false,
        message: 'L’ascenseur républicain ne doit jamais s’arrêter.',
      },
      {
        id: 'cnt-11',
        contributorName: 'Dr. Sébastien Yapi',
        promotionYear: 1995,
        amount: 500000,
        currency: 'FCFA',
        date: '2026-10-05',
        method: 'MTN_MOMO',
        isAnonymous: false,
      },
    ],
    executionReports: [
      {
        date: '2026-09-01',
        title: 'Sélection rigoureuse des lauréats avec la Direction des Études',
        summary: 'Examen de 68 dossiers sociaux et académiques. 25 élèves retenus avec une moyenne supérieure à 14,5/20.',
      },
    ],
  },
  {
    id: 'proj-003',
    title: 'Modernisation de l’Infirmerie et Dotation en Médicaments',
    category: 'SANTE',
    summary: 'Rénovation complète du pavillon médical scolaire et approvisionnement continu en trousses de premiers secours et médicaments de base.',
    context: 'Assurer une prise en charge médicale d’urgence optimale pour les élèves internes et demi-pensionnaires, avec la création d’une salle d’isolement et de repos digne.',
    objectives: [
      'Acquisition de 6 lits médicalisés avec matelas étanches',
      'Dotation d’un défibrillateur automatisé externe (DAE) et matériel d’oxygénothérapie',
      'Stock tampon permanent de médicaments d’urgence et antipaludiques',
    ],
    beneficiaries: 'L’ensemble de la communauté scolaire de Bingerville',
    budgetGoal: 12000000,
    budgetRaised: 8200000,
    contributorsCount: 38,
    status: 'EN_COURS',
    progressPercentage: 68,
    deadline: '28 Février 2027',
    imageUrl: '/assets/images/bingerville_lycee_campus_1794382827777.jpg',
    materialNeeds: [
      '6 Lits médicalisés complets',
      'Tensiomètres électroniques et thermomètres infrarouges',
      'Médicaments de première urgence certifiés',
    ],
    contributions: [
      {
        id: 'cnt-20',
        contributorName: 'Amicale Médicale des Anciens du LGB',
        amount: 3000000,
        currency: 'FCFA',
        date: '2026-10-29',
        method: 'VIREMENT',
        isAnonymous: false,
      },
    ],
    executionReports: [
      {
        date: '2026-10-15',
        title: 'Visite de conformité sanitaire effectuée',
        summary: 'Audit technique par une équipe conjointe ALGB et médecin scolaire.',
      },
    ],
  },
];

export const INITIAL_JOB_OFFERS: JobOffer[] = [
  {
    id: 'job-001',
    title: 'Ingénieur DevOps & Cloud Azure / AWS',
    type: 'CDI',
    company: 'Fintech West Africa',
    sector: 'Technologie & Numérique',
    location: 'Abidjan (Plateau / Télétravail hybride)',
    postedBy: 'Amadou Touré (CTO)',
    postedByPromo: 2002,
    postedDate: '2026-11-02',
    deadline: '2026-12-15',
    description: 'Nous recrutons un ingénieur DevOps pour accompagner la mise à l’échelle de notre plateforme de paiement interbancaire en zone UEMOA.',
    requirements: [
      'Formation ingénieur bac+5 (INP-HB, ESATIC ou équivalent)',
      '3+ années d’expérience avec Kubernetes, Terraform et CI/CD GitLab',
      'Sens aigu de la rigueur et de l’esprit d’équipe LGB',
    ],
    contactEmail: 'recrutement@fintech-westafrica.ci',
  },
  {
    id: 'job-002',
    title: 'Auditeur Financier Junior & Gestion de Risques',
    type: 'CDI',
    company: 'Cabinet BDO Côte d’Ivoire',
    sector: 'Finance & Audit',
    location: 'Abidjan (Cocody)',
    postedBy: 'Idriss Coulibaly',
    postedByPromo: 2010,
    postedDate: '2026-10-28',
    deadline: '2026-12-01',
    description: 'Intégrez le pôle Banque & Institutions Financières pour réaliser des missions d’audit légal et d’évaluation des contrôles internes.',
    requirements: [
      'Master en Finance, Comptabilité, Contrôle de Gestion ou DSCG',
      'Bonne maîtrise des normes IFRS et SYSCOHADA révisé',
    ],
    contactEmail: 'carrieres@bdo-ci.com',
  },
  {
    id: 'job-003',
    title: 'Conducteur de Travaux BTP & Ouvrages d’Art',
    type: 'CDD',
    company: 'Consortium BTP Grands Travaux',
    sector: 'BTP & Ingénierie Civile',
    location: 'Yamoussoukro / Bouaké',
    postedBy: 'Jean-Luc Bamba',
    postedByPromo: 1988,
    postedDate: '2026-11-05',
    deadline: '2026-12-20',
    description: 'Supervision de chantiers de voirie et de réhabilitation d’établissements scolaires publics.',
    requirements: [
      'Diplôme d’Ingénieur ou Technicien Supérieur en Génie Civil',
      'Rigueur sur la sécurité et le respect des plannings',
    ],
    contactEmail: 'rh@btp-ci.com',
  },
  {
    id: 'job-004',
    title: 'Stage de fin d’études - Data Science & Modélisation IA',
    type: 'STAGE',
    company: 'Lab Innovation BCP / Banque Atlantique',
    sector: 'Banque & Finance',
    location: 'Abidjan (Marcory)',
    postedBy: 'Stéphane Kassi',
    postedByPromo: 2018,
    postedDate: '2026-11-08',
    deadline: '2026-12-30',
    description: 'Opportunité de pré-embauche réservée en priorité aux élèves ingénieurs ou masters issus du LGB.',
    requirements: [
      'Dernière année d’école d’ingénieur ou université scientifique',
      'Compétences démontrées en Python (pandas, scikit-learn, PyTorch)',
    ],
    contactEmail: 'innovation@banque-atlantique.ci',
  },
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Assemblée Générale Élective de l’ALGB : Convocation Officielle',
    category: 'COMMUNIQUE',
    date: '2026-11-05',
    author: 'Secrétariat Général de l’ALGB',
    summary: 'Le Bureau Exécutif informe l’ensemble des membres adhérents de la tenue de l’Assemblée Générale Ordinaire et Élective le samedi 19 décembre 2026 à l’Amphithéâtre du Lycée.',
    content: 'Conformément aux dispositions statutaires de notre Amicale, l’Assemblée Générale Ordinaire se réunira pour faire le bilan moral et financier du mandat écoulé et procéder au renouvellement des instances dirigeantes. L’ordre du jour portera sur : 1. Rapport d’activité du Président ; 2. Rapport financier et quitus du Commissariat aux Comptes ; 3. Présentation du plan stratégique Bingerville 2030 ; 4. Élection du nouveau Bureau Exécutif.',
    imageUrl: '/assets/images/bingerville_lycee_campus_1794382827777.jpg',
    isImportant: true,
  },
  {
    id: 'news-002',
    title: 'Grande Nuit de Fraternité ALGB : Célébration des Générations au Sofitel Ivoire',
    category: 'VIE_AMICALE',
    date: '2026-10-24',
    author: 'Commission Événements & Mobilisation',
    summary: 'Plus de 450 anciens élèves de 1970 à 2024 se sont retrouvés pour une soirée inoubliable scellant la fraternité intergénérationnelle.',
    content: 'Dans une atmosphère empreinte d’émotion, de respect et de fierté, la communauté des anciens a réaffirmé son serment de solidarité. Les hommages rendus aux doyens et aux anciens proviseurs ont constitué les temps forts de cette rencontre historique.',
    imageUrl: '/assets/images/alumni_reunion_ceremony_1794382829849.jpg',
  },
  {
    id: 'news-003',
    title: 'Résultats Exceptionnels au Baccalauréat 2026 : Le Lycée de Garçons au Sommet National',
    category: 'EXCELLENCE',
    date: '2026-09-18',
    author: 'Cellule Communication ALGB',
    summary: 'Avec un taux de réussite de 94,8% toutes séries confondues, nos jeunes cadets honorent la longue tradition d’excellence de notre alma mater.',
    content: 'L’Amicale félicite chaleureusement les bacheliers et le corps professoral. Une cérémonie spéciale de parrainage et de remise des bourses d’excellence est programmée au lycée pour accompagner leur entrée dans les filières d’élite.',
    imageUrl: '/assets/images/school_library_excellence_1794382830305.jpg',
  },
  {
    id: 'news-004',
    title: 'Histoire & Mémoire : Bingerville, berceau intellectuel de la Côte d’Ivoire moderne',
    category: 'HISTOIRE',
    date: '2026-08-30',
    author: 'Commission Archives & Patrimoine',
    summary: 'Retour sur plus d’un siècle d’histoire : comment une école coloniale est devenue le foyer des bâtisseurs de la nation indépendante.',
    content: 'Fondée à l’aube du XXe siècle dans l’ancienne capitale coloniale, l’institution a vu passer des générations de pionniers, d’hommes d’État, d’ingénieurs et de savants qui ont façonné le destin économique et social de la Côte d’Ivoire.',
    imageUrl: '/assets/images/bingerville_historic_heritage_1794382830908.jpg',
  },
  {
    id: 'news-005',
    title: 'Forum des Métiers & de l’Orientation 2027 : Appel aux Intervenants Alumni',
    category: 'EVENEMENTS',
    date: '2026-11-10',
    author: 'Commission Mentorat & Carrières',
    summary: 'Soixante anciens élèves cadres, ingénieurs et entrepreneurs sont attendus sur le campus de Bingerville pour orienter nos lycéens de 2nde, 1ère et Terminale.',
    content: 'Dans le cadre du programme d’accompagnement scolaire de l’ALGB, la prochaine édition du Forum des Métiers réunira des anciens issus des filières scientifiques, juridiques, médicales et numériques. Les membres inscrits au répertoire des compétences BDR souhaitant animer un atelier thématique peuvent confirmer leur participation auprès du Secrétariat Général.',
    imageUrl: '/assets/images/school_library_excellence_1794382830305.jpg',
  },
  {
    id: 'news-006',
    title: 'Deux Anciens du LGB Lauréats des Prix Nationaux d’Excellence & Innovation',
    category: 'REUSSITE',
    date: '2026-11-08',
    author: 'Cellule Communication ALGB',
    summary: 'Nos confrères Amadou Touré (Promo 2002) et Stéphane Kassi (Promo 2018) ont été distingués pour leurs solutions d’inclusion financière et d’intelligence artificielle.',
    content: 'C’est avec une immense fierté que l’Amicale salue la consécration de deux de ses membres actifs lors de la cérémonie nationale de l’innovation technologique à Abidjan. Leur parcours illustre la vitalité de la formation reçue au Lycée de Garçons de Bingerville et l’esprit de transmission qui anime notre réseau intergénérationnel.',
    imageUrl: '/assets/images/alumni_reunion_ceremony_1794382829849.jpg',
  },
  {
    id: 'news-007',
    title: 'Campagne d’Enrôlement BDR & Régularisation des Cotisations 2026',
    category: 'ANNONCES',
    date: '2026-11-02',
    author: 'Trésorerie Générale & Secrétariat ALGB',
    summary: 'Mise à jour de l’annuaire des compétences et clôture de l’exercice financier 2026 avant l’Assemblée Générale Élective de décembre.',
    content: 'Les délégués de promotion invitent chaque ancien élève à compléter sa fiche BDR (compétences, certifications et disponibilités) via le module d’enrôlement officiel et à vérifier sa situation de cotisation depuis son Espace Membre afin de recevoir son quitus statutaire pour l’Assemblée Générale du 19 décembre.',
    imageUrl: '/assets/images/algb_vintage_students_archive_1794388532357.jpg',
    isImportant: true,
  },
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev-001',
    title: 'Assemblée Générale Ordinaire et Élective 2026',
    date: '19 Décembre 2026',
    time: '09h00 - 14h00',
    location: 'Grand Amphithéâtre, Lycée de Garçons de Bingerville',
    city: 'Bingerville',
    type: 'ASSEMBLEE_GENERALE',
    summary: 'Bilan de mandat, quitus financier, vote du plan d’action et élection du Bureau.',
    description: 'Moment statutaire majeur de notre Amicale. La participation physique ou par procuration est réservée aux membres à jour de cotisation.',
    attendeesCount: 215,
    maxCapacity: 350,
    imageUrl: '/assets/images/bingerville_lycee_campus_1794382827777.jpg',
    isRegistrationOpen: true,
  },
  {
    id: 'ev-002',
    title: 'Journée Sportive & Tournoi Inter-Promotions « Coupe du Proviseur »',
    date: '16 Janvier 2027',
    time: '08h30 - 18h00',
    location: 'Complexe Sportif du Lycée',
    city: 'Bingerville',
    type: 'SPORT',
    summary: 'Tournoi de football, basketball et athlétisme réunissant 16 promotions dans un esprit fraternel.',
    description: 'Une journée de détente et de compétition saine suivie d’un grand barbecue de communion sous les arbres centenaires du lycée.',
    attendeesCount: 380,
    maxCapacity: 500,
    imageUrl: '/assets/images/alumni_reunion_ceremony_1794382829849.jpg',
    isRegistrationOpen: true,
  },
  {
    id: 'ev-003',
    title: 'Forum des Métiers & de l’Orientation des Élèves du LGB',
    date: '06 Février 2027',
    time: '09h00 - 16h00',
    location: 'Salles polyvalentes du Lycée',
    city: 'Bingerville',
    type: 'CONFERENCE',
    summary: '60 professionnels anciens élèves viennent guider et inspirer les élèves de 2nde, 1ère et Tle.',
    description: 'Ateliers thématiques : filières scientifiques, carrières juridiques, métiers du numérique, entrepreneuriat et études à l’étranger.',
    attendeesCount: 160,
    maxCapacity: 200,
    imageUrl: '/assets/images/school_library_excellence_1794382830305.jpg',
    isRegistrationOpen: true,
  },
];

export const HISTORIC_TIMELINE = [
  {
    year: '1903 - 1905',
    title: 'Fondation de l’École Primaire Supérieure à Bingerville',
    location: 'Bingerville, Capitale de la Côte d’Ivoire',
    description: 'Alors que Bingerville succède à Grand-Bassam comme capitale de la colonie, l’administration implante sur les hauteurs boisées surplombant la lagune Ébrié un établissement scolaire de référence destiné à former les premiers commis et cadres d’Afrique de l’Ouest.',
  },
  {
    year: '1939',
    title: 'Érection en Collège Moderne Classique',
    location: 'Plateau scolaire de Bingerville',
    description: 'L’établissement s’agrandit avec des pavillons coloniaux ventilés, des dortoirs pour les internes et des laboratoires de sciences naturelles, attirant les meilleurs esprits venus de toutes les régions du pays.',
  },
  {
    year: '1957',
    title: 'Transformation en Lycée de Garçons de Bingerville',
    location: 'Bingerville',
    description: 'À la veille de l’indépendance, l’institution prend son statut de Lycée de Garçons, sanctuaire de l’excellence académique, de la discipline républicaine et du brassage culturel national.',
  },
  {
    year: '1960 - 1980',
    title: 'L’Âge d’Or et le Creuset des Cadres de la Nation',
    location: 'Côte d’Ivoire indépendante',
    description: 'Sous l’impulsion des premiers gouvernements, le lycée forme les ingénieurs des grands travaux, les médecins des hôpitaux régionaux, les magistrats et les économistes qui conduiront le miracle ivoirien.',
  },
  {
    year: '1978',
    title: 'Constitution de la Première Amicale des Anciens (ALGB)',
    location: 'Abidjan / Bingerville',
    description: 'Face au besoin de maintenir la fraternité des anciens internes et de soutenir leur établissement d’origine, les premières promotions formalisent l’Amicale.',
  },
  {
    year: '2000 - 2020',
    title: 'Résilience, Solidarité et Modernisation',
    location: 'Bingerville & Diaspora',
    description: 'À travers les épreuves traversées par le pays, l’Amicale joue un rôle protecteur pour le lycée, finançant réfections de toitures, bourses de secours et fournitures pédagogiques.',
  },
  {
    year: '2025 - 2030',
    title: 'Cap vers le Centenaire et le Lycée du Futur',
    location: 'Plateforme Globale ALGB',
    description: 'Lancement du grand programme de rénovation patrimoniale, numérisation des apprentissages et fondation du réseau professionnel mondial des anciens du LGB.',
  },
];

export const EXECUTIVE_BOARD = [
  {
    role: 'Président du Bureau Exécutif',
    name: 'Dr. Konan Kouamé',
    promotion: 'Promotion 1974',
    profession: 'Économiste & Ancien Conseiller Spécial',
    mandate: '2024 - 2027',
    status: 'Mandat officiel en cours (Élu en Assemblée Générale)',
  },
  {
    role: 'Secrétaire Général',
    name: 'Maître Moussa Diomandé',
    promotion: 'Promotion 1982',
    profession: 'Avocat au Barreau',
    mandate: '2024 - 2027',
    status: 'Mandat officiel en cours',
  },
  {
    role: 'Trésorier Général',
    name: 'Idriss Coulibaly',
    promotion: 'Promotion 2010',
    profession: 'Directeur Administratif & Financier',
    mandate: '2024 - 2027',
    status: 'Mandat officiel en cours',
  },
  {
    role: 'Vice-Président chargé des Projets & du Patrimoine',
    name: 'Jean-Luc Bamba',
    promotion: 'Promotion 1988',
    profession: 'Ingénieur BTP & Grands Travaux',
    mandate: '2024 - 2027',
    status: 'Mandat officiel en cours',
  },
  {
    role: 'Vice-Président chargé du Réseau Professionnel & de la Diaspora',
    name: 'Amadou Touré',
    promotion: 'Promotion 2002',
    profession: 'CTO Fintech & Stratégie Digitale',
    mandate: '2024 - 2027',
    status: 'Mandat officiel en cours',
  },
  {
    role: 'Secrétaire chargée des Affaires Sociales & de la Santé',
    name: 'Dr. Sébastien Yapi',
    promotion: 'Promotion 1995',
    profession: 'Chirurgien CHU',
    mandate: '2024 - 2027',
    status: 'Mandat officiel en cours',
  },
];

export interface AssociationSettings {
  // Paramètres financiers (gérés par le Profil Finance / Trésorier, Admin & Super Admin)
  droitAdhesionAmount: number;
  cotisationMensuelleAmount: number;
  currency: string;
  fiscalYear: number;
  orangeMoneyMerchantNumber: string;
  mtnMoMoMerchantNumber: string;
  moovMoneyMerchantNumber: string;
  bankName: string;
  bankRib: string;
  bankIban: string;
  overdueGraceMonths: number;
  // Paramètres institutionnels & gouvernance (gérés par Admin & Super Admin)
  associationName: string;
  associationSignature: string;
  associationMessage: string;
  presidentName: string;
  treasurerName: string;
  secretaryGeneralName: string;
  headquartersAddress: string;
  officialEmail: string;
  officialPhone: string;
  // Intégration Google Sheets pour l'enrôlement (algbannuaire.netlify.app)
  googleScriptUrl: string;
}

export const INITIAL_SETTINGS: AssociationSettings = {
  droitAdhesionAmount: 10000,
  cotisationMensuelleAmount: 5000,
  currency: 'FCFA',
  fiscalYear: 2026,
  orangeMoneyMerchantNumber: '+225 07 08 09 10 11',
  mtnMoMoMerchantNumber: '+225 05 06 07 08 09',
  moovMoneyMerchantNumber: '+225 01 02 03 04 05',
  bankName: 'Société Générale Côte d’Ivoire (SGBCI)',
  bankRib: '00101-01234567890-12',
  bankIban: 'CI01 CI00 1012 3456 7890 1234 56',
  overdueGraceMonths: 2,
  associationName: 'Amicale des Anciens Élèves du Lycée de Garçons de Bingerville',
  associationSignature: '« Une histoire, des générations, un même engagement. »',
  associationMessage: '« Notre histoire nous rassemble. Notre engagement construit l\'avenir. »',
  presidentName: 'Dr. Konan Kouamé',
  treasurerName: 'Idriss Coulibaly',
  secretaryGeneralName: 'Maître Moussa Diomandé',
  headquartersAddress: 'Lycée de Garçons de Bingerville, Boulevard Principal, BP 24 Bingerville, Abidjan, Côte d’Ivoire',
  officialEmail: 'contact@algb-bingerville.ci',
  officialPhone: '+225 27 22 40 12 00 / 07 08 09 10 11',
  googleScriptUrl: 'https://script.google.com/macros/s/AKfycbxEz1vPwz0OpYHa8wnZNMp6Et_VME4PuM5xkh-AInkguU0dppLALI3QHNQ2eyQSs4vn_g/exec',
};

export const FINANCIAL_CONSTANTS = {
  DROIT_ADHESION_AMOUNT: 10000, // 10 000 FCFA
  COTISATION_MENSUELLE_AMOUNT: 5000, // 5 000 FCFA / mois
  CURRENCY: 'FCFA',
  FISCAL_YEAR: 2026,
};

export const MONTHS_2026 = [
  { key: '2026-01', label: 'Janvier 2026', short: 'Jan' },
  { key: '2026-02', label: 'Février 2026', short: 'Fév' },
  { key: '2026-03', label: 'Mars 2026', short: 'Mar' },
  { key: '2026-04', label: 'Avril 2026', short: 'Avr' },
  { key: '2026-05', label: 'Mai 2026', short: 'Mai' },
  { key: '2026-06', label: 'Juin 2026', short: 'Juin' },
  { key: '2026-07', label: 'Juillet 2026', short: 'Juil' },
  { key: '2026-08', label: 'Août 2026', short: 'Août' },
  { key: '2026-09', label: 'Septembre 2026', short: 'Sept' },
  { key: '2026-10', label: 'Octobre 2026', short: 'Oct' },
  { key: '2026-11', label: 'Novembre 2026', short: 'Nov' },
  { key: '2026-12', label: 'Décembre 2026', short: 'Déc' },
];

export const INITIAL_TRANSACTIONS: MemberTransaction[] = [
  // Transactions for Amadou Touré (mem-001)
  {
    id: 'tx-001',
    reference: 'ALGB-REC-2026-0018',
    memberId: 'mem-001',
    memberName: 'Amadou Touré',
    promotionYear: 2002,
    type: 'DROIT_ADHESION',
    title: 'Droits d’Adhésion Initiale Statutaire',
    description: 'Inscription officielle et délivrance de la carte biométrique d’adhérent',
    amount: 10000,
    currency: 'FCFA',
    date: '2026-01-10',
    method: 'ORANGE_MONEY',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0018',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },
  {
    id: 'tx-002',
    reference: 'ALGB-REC-2026-0142',
    memberId: 'mem-001',
    memberName: 'Amadou Touré',
    promotionYear: 2002,
    type: 'COTISATION_MENSUELLE',
    title: 'Cotisations Mensuelles (T1 & T2 2026)',
    description: 'Règlement semestriel : Janvier, Février, Mars, Avril, Mai, Juin 2026 (6 x 5 000 FCFA)',
    monthYears: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'],
    amount: 30000,
    currency: 'FCFA',
    date: '2026-01-15',
    method: 'ORANGE_MONEY',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0142',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },
  {
    id: 'tx-003',
    reference: 'ALGB-REC-2026-0489',
    memberId: 'mem-001',
    memberName: 'Amadou Touré',
    promotionYear: 2002,
    type: 'COTISATION_MENSUELLE',
    title: 'Cotisations Mensuelles (T3 2026)',
    description: 'Règlement trimestriel : Juillet, Août, Septembre 2026 (3 x 5 000 FCFA)',
    monthYears: ['2026-07', '2026-08', '2026-09'],
    amount: 15000,
    currency: 'FCFA',
    date: '2026-07-02',
    method: 'CARTE_BANCAIRE',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0489',
    validatedBy: 'Système Passerelle Bancaire',
  },
  {
    id: 'tx-004',
    reference: 'ALGB-REC-2026-0720',
    memberId: 'mem-001',
    memberName: 'Amadou Touré',
    promotionYear: 2002,
    type: 'COTISATION_MENSUELLE',
    title: 'Cotisation Mensuelle : Octobre 2026',
    description: 'Cotisation ordinaire du mois d’octobre 2026',
    monthYears: ['2026-10'],
    amount: 5000,
    currency: 'FCFA',
    date: '2026-10-05',
    method: 'MTN_MOMO',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0720',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },
  {
    id: 'tx-005',
    reference: 'ALGB-ATT-2026-0912',
    memberId: 'mem-001',
    memberName: 'Amadou Touré',
    promotionYear: 2002,
    type: 'COTISATION_MENSUELLE',
    title: 'Cotisation Mensuelle : Novembre 2026',
    description: 'Déclaration de virement en cours de confirmation bancaire',
    monthYears: ['2026-11'],
    amount: 5000,
    currency: 'FCFA',
    date: '2026-11-08',
    method: 'VIREMENT',
    status: 'EN_ATTENTE',
    receiptNumber: 'ATT-2026-0912',
    notes: 'Bordereau de virement SGBCI transmis, en attente de pointage relevé bancaire.',
  },
  {
    id: 'tx-006',
    reference: 'ALGB-DON-2026-0042',
    memberId: 'mem-001',
    memberName: 'Amadou Touré',
    promotionYear: 2002,
    type: 'DON_PROJET',
    title: 'Mécénat Projet Bibliothèque Scientifique',
    description: 'Contribution nominative au projet de modernisation et numérisation',
    amount: 1500000,
    currency: 'FCFA',
    date: '2026-10-22',
    method: 'ORANGE_MONEY',
    status: 'PAYE',
    receiptNumber: 'REC-DON-0042',
    validatedBy: 'Commission Grands Projets ALGB',
  },

  // Transactions for Dr. Sébastien Yapi (mem-002)
  {
    id: 'tx-010',
    reference: 'ALGB-REC-2026-0033',
    memberId: 'mem-002',
    memberName: 'Dr. Sébastien Yapi',
    promotionYear: 1995,
    type: 'DROIT_ADHESION',
    title: 'Droits d’Adhésion Initiale Statutaire',
    amount: 10000,
    currency: 'FCFA',
    date: '2026-01-12',
    method: 'VIREMENT',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0033',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },
  {
    id: 'tx-011',
    reference: 'ALGB-REC-2026-0188',
    memberId: 'mem-002',
    memberName: 'Dr. Sébastien Yapi',
    promotionYear: 1995,
    type: 'COTISATION_MENSUELLE',
    title: 'Cotisations Annuelles Intégrales 2026',
    description: 'Paiement forfaitaire des 12 mois de cotisations (12 x 5 000 FCFA)',
    monthYears: [
      '2026-01', '2026-02', '2026-03', '2026-04',
      '2026-05', '2026-06', '2026-07', '2026-08',
      '2026-09', '2026-10', '2026-11', '2026-12'
    ],
    amount: 60000,
    currency: 'FCFA',
    date: '2026-01-18',
    method: 'VIREMENT',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0188',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },
  {
    id: 'tx-012',
    reference: 'ALGB-DON-2026-0105',
    memberId: 'mem-002',
    memberName: 'Dr. Sébastien Yapi',
    promotionYear: 1995,
    type: 'DON_PROJET',
    title: 'Don au Fonds des Bourses d’Excellence',
    amount: 500000,
    currency: 'FCFA',
    date: '2026-10-05',
    method: 'MTN_MOMO',
    status: 'PAYE',
    receiptNumber: 'REC-DON-0105',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },

  // Transactions for Jean-Luc Bamba (mem-003)
  {
    id: 'tx-020',
    reference: 'ALGB-REC-2026-0025',
    memberId: 'mem-003',
    memberName: 'Jean-Luc Bamba',
    promotionYear: 1988,
    type: 'DROIT_ADHESION',
    title: 'Droits d’Adhésion Initiale Statutaire',
    amount: 10000,
    currency: 'FCFA',
    date: '2026-02-01',
    method: 'VIREMENT',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0025',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },
  {
    id: 'tx-021',
    reference: 'ALGB-REC-2026-0512',
    memberId: 'mem-003',
    memberName: 'Jean-Luc Bamba',
    promotionYear: 1988,
    type: 'COTISATION_MENSUELLE',
    title: 'Cotisations Mensuelles (T1 & T2 2026)',
    monthYears: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'],
    amount: 30000,
    currency: 'FCFA',
    date: '2026-03-10',
    method: 'VIREMENT',
    status: 'PAYE',
    receiptNumber: 'REC-2026-0512',
    validatedBy: 'Idriss Coulibaly (Trésorier)',
  },

  // Transactions for Franck N’Goran (mem-007) - young graduate
  {
    id: 'tx-030',
    reference: 'ALGB-ATT-2026-0988',
    memberId: 'mem-007',
    memberName: 'Franck N’Goran',
    promotionYear: 2024,
    type: 'DROIT_ADHESION',
    title: 'Droits d’Adhésion Nouveau Diplômé (Tarif Jeune)',
    description: 'Adhésion avec déclaration Mobile Money en attente',
    amount: 5000,
    currency: 'FCFA',
    date: '2026-11-09',
    method: 'MOOV_MONEY',
    status: 'EN_ATTENTE',
    receiptNumber: 'ATT-2026-0988',
    notes: 'Notification Moov reçue, validation Trésorerie requise.',
  },

  // Other contributions
  {
    id: 'tx-040',
    reference: 'ALGB-REC-2026-0810',
    memberId: 'mem-001',
    memberName: 'Amadou Touré',
    promotionYear: 2002,
    type: 'AUTRE',
    title: 'Souscription Soirée de Gala ALGB (2 Couverts VIP)',
    description: 'Participation au grand dîner de gala des anciens au Sofitel Ivoire',
    amount: 100000,
    currency: 'FCFA',
    date: '2026-10-12',
    method: 'CARTE_BANCAIRE',
    status: 'PAYE',
    receiptNumber: 'REC-GALA-0810',
    validatedBy: 'Commission Événements & Gala',
  },
];

