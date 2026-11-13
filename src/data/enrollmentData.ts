export interface GeoCity {
  [city: string]: string[];
}

export interface GeoCountry {
  label: string;
  villes: GeoCity;
}

export interface GeoDataMap {
  [countryCode: string]: GeoCountry;
}

export const GEO_DATA: GeoDataMap = {
  ci: {
    label: "Côte d'Ivoire",
    villes: {
      "Abidjan": ["Abobo", "Adjamé", "Attécoubé", "Cocody", "Koumassi", "Marcory", "Plateau", "Port-Bouët", "Treichville", "Yopougon", "Bingerville", "Songon"],
      "Bouaké": ["Bouaké Nord", "Bouaké Sud", "Bouaké Centre", "Kennedy", "Nimbo", "Air France"],
      "Yamoussoukro": ["Assabou", "Dioulakro", "Habitat", "Millionnaire", "220 Logements", "Morofé"],
      "Daloa": ["Lobia", "Orly", "Résidentiel", "Tazibouo", "Gbeuliville"],
      "San-Pédro": ["Bardot", "Cité", "Grand-Béréby", "Balmer", "Seweke"],
      "Gagnoa": ["Dioulabougou", "Gagnoa Centre", "Gnazébo", "Babré"],
      "Abengourou": ["Abengourou Centre", "Bettié", "Niable", "Agnikro"],
      "Korhogo": ["Korhogo Centre", "Sinématiali", "Napié", "Koko", "Soba"],
      "Man": ["Man Centre", "Danané", "Zouan-Hounien", "Grand-Gbapleu"],
      "Divo": ["Divo Centre", "Guitry", "Lakota", "Bada"]
    }
  },
  fr: {
    label: "France",
    villes: {
      "Paris": ["1er arr.", "2e arr.", "3e arr.", "4e arr.", "5e arr.", "6e arr.", "7e arr.", "8e arr.", "9e arr.", "10e arr.", "11e arr.", "12e arr.", "13e arr.", "14e arr.", "15e arr.", "16e arr.", "17e arr.", "18e arr.", "19e arr.", "20e arr."],
      "Lyon": ["Lyon 1", "Lyon 2", "Lyon 3", "Lyon 4", "Lyon 5", "Lyon 6", "Lyon 7", "Lyon 8", "Lyon 9"],
      "Marseille": ["1er arr.", "2e arr.", "3e arr.", "4e arr.", "5e arr.", "6e arr.", "7e arr.", "8e arr.", "13e arr.", "14e arr."],
      "Toulouse": ["Capitole", "Minimes", "Rangueil", "Saint-Cyprien"],
      "Bordeaux": ["Centre", "Chartrons", "Mériadeck", "Caudéran"],
      "Lille": ["Fives", "Hellemmes", "Centre", "Wazemmes"],
      "Strasbourg": ["Centre", "Cronenbourg", "Neudorf", "Koenigshoffen"],
      "Montpellier": ["Antigone", "Boutonnet", "Mosson", "Celleneuve"]
    }
  },
  sn: {
    label: "Sénégal",
    villes: {
      "Dakar": ["Almadies", "Dakar-Plateau", "Fann-Point E", "Grand Dakar", "Médina", "Ouakam", "Parcelles Assainies", "Yoff", "Mermoz-Sacré-Cœur"],
      "Thiès": ["Thiès Est", "Thiès Nord", "Thiès Ouest"],
      "Saint-Louis": ["Sor", "Saint-Louis Commune", "Dagana"],
      "Ziguinchor": ["Centre", "Bignona", "Oussouye"],
      "Kaolack": ["Centre", "Guinguinéo", "Nioro du Rip"]
    }
  },
  ml: {
    label: "Mali",
    villes: {
      "Bamako": ["Commune I", "Commune II", "Commune III", "Commune IV", "Commune V", "Commune VI"],
      "Sikasso": ["Centre", "Bougouni", "Kolondièba"],
      "Ségou": ["Centre", "Bla", "Macina"],
      "Mopti": ["Centre", "Bandiagara", "Djenné"],
      "Gao": ["Centre", "Ansongo", "Bourem"]
    }
  },
  bf: {
    label: "Burkina Faso",
    villes: {
      "Ouagadougou": ["Baskuy", "Bogodogo", "Boulmiougou", "Nongr-Massom", "Sig-Noghin"],
      "Bobo-Dioulasso": ["Dô", "Dafra", "Konsa", "Kuinima"],
      "Koudougou": ["Centre", "Nanoro", "Réo"],
      "Banfora": ["Centre", "Mangodara", "Tiéfora"],
      "Ouahigouya": ["Centre", "Titao", "Séguénéga"]
    }
  },
  ca: {
    label: "Canada",
    villes: {
      "Montréal": ["Ahuntsic-Cartierville", "Côte-des-Neiges", "Mont-Royal", "Outremont", "Plateau-Mont-Royal", "Rosemont", "Verdun", "Ville-Marie"],
      "Toronto": ["Downtown", "Etobicoke", "North York", "Scarborough", "York"],
      "Vancouver": ["Downtown", "East Vancouver", "North Vancouver", "Burnaby", "Richmond"],
      "Ottawa": ["Centre", "Gloucester", "Kanata", "Orleans", "Vanier"],
      "Calgary": ["Beltline", "Forest Lawn", "Inglewood", "Kensington"]
    }
  },
  be: {
    label: "Belgique",
    villes: {
      "Bruxelles": ["Anderlecht", "Etterbeek", "Ixelles", "Laeken", "Molenbeek", "Schaerbeek", "Uccle"],
      "Liège": ["Centre", "Angleur", "Grivegnée", "Herstal"],
      "Gand": ["Centre", "Ledeberg", "Sint-Amandsberg"],
      "Anvers": ["Centre", "Berchem", "Hoboken", "Merksem"],
      "Charleroi": ["Centre", "Gilly", "Marchienne-au-Pont"]
    }
  },
  ma: {
    label: "Maroc",
    villes: {
      "Casablanca": ["Ain Chock", "Ain Sebaâ", "Ben M'Sick", "Hay Hassani", "Maârif", "Sidi Bernoussi"],
      "Rabat": ["Agdal", "Hassan", "Hay Riad", "Souissi"],
      "Fès": ["Fès El Bali", "Fès El Jadid", "Saïss"],
      "Marrakech": ["Guéliz", "Hivernage", "Médina", "Palmeraie"],
      "Tanger": ["Boukhalef", "Cap Spartel", "Centre", "Tétouan"]
    }
  },
  autre: {
    label: "Autre pays",
    villes: {}
  }
};

export const STUDY_LEVELS = [
  "Secondaire / Baccalauréat",
  "BTS / DUT",
  "Licence / Bachelor",
  "Master",
  "Doctorat / Ph.D",
  "Autre"
];

export const SECTEURS_ACTIVITE = [
  "Agriculture / Agro-industrie",
  "Banque / Finance / Assurance",
  "BTP / Génie civil",
  "Commerce / Distribution",
  "Communication / Médias",
  "Éducation / Formation",
  "Énergie / Mines",
  "Environnement / Développement durable",
  "Industrie / Production",
  "Informatique / Numérique / IA",
  "Juridique / Droit",
  "Logistique / Transport",
  "Organisations internationales / ONG",
  "Santé / Médecine / Pharmacie",
  "Secteur public / Fonction publique",
  "Tourisme / Hôtellerie",
  "Autre"
];

export const SITUATIONS_PRO = [
  "Employé à la fonction publique",
  "Employé dans le secteur privé",
  "Travailleur indépendant / Freelance",
  "Chef d'entreprise / Entrepreneur",
  "Étudiant(e)",
  "En recherche d'emploi",
  "Retraité(e)",
  "Autre"
];

export const DOMAINES_FORMATION = [
  "Droit / Sciences juridiques",
  "Économie / Gestion",
  "Sciences politiques / Relations internationales",
  "Sociologie / Anthropologie",
  "Psychologie",
  "Histoire / Géographie",
  "Philosophie / Lettres",
  "Langues / Linguistique",
  "Informatique / Génie logiciel",
  "Intelligence artificielle / Data science",
  "Réseaux / Télécommunications",
  "Génie civil / BTP",
  "Génie mécanique / Industriel",
  "Génie électrique / Électronique",
  "Mathématiques / Statistiques",
  "Physique / Chimie",
  "Biologie / Sciences naturelles",
  "Médecine générale",
  "Pharmacie",
  "Soins infirmiers / Sage-femme",
  "Santé publique / Épidémiologie",
  "Nutrition / Diététique",
  "Commerce / Marketing",
  "Finance / Comptabilité / Audit",
  "Management / Administration des affaires (MBA)",
  "Ressources humaines",
  "Entrepreneuriat / Innovation",
  "Logistique / Supply chain",
  "Communication / Journalisme",
  "Arts visuels / Design graphique",
  "Cinéma / Audiovisuel",
  "Architecture / Urbanisme",
  "Agronomie / Agro-industrie",
  "autre_formation"
];

export const DOMAINES_COMPETENCES = [
  "Gestion de projets",
  "Informatique / IA",
  "Communication",
  "Finance / Compta",
  "Recherche / Données",
  "Santé / Médecine",
  "Éducation / Formation",
  "Entrepreneuriat",
  "Droit / Juridique",
  "Agriculture / Agro",
  "BTP / Génie civil"
];

export const NIVEAUX_MAITRISE = [
  "Débutant",
  "Intermédiaire",
  "Confirmé",
  "Expert"
];

export const ANNEES_EXPERIENCE = [
  "Moins de 2 ans",
  "2 à 5 ans",
  "5 à 10 ans",
  "Plus de 10 ans",
  "Plus de 20 ans"
];

export const CERTIFICATIONS_LIST = [
  "PMP – Project Management Professional",
  "PRINCE2 Foundation / Practitioner",
  "Scrum Master (CSM / PSM)",
  "PMI-ACP (Agile)",
  "CAPM – Certified Associate in PM",
  "Google Data Analytics",
  "IBM Data Science Professional",
  "Microsoft Azure / AWS / GCP",
  "Cisco CCNA / CCNP",
  "CompTIA Security+ / Network+",
  "Google UX Design",
  "CPA – Certified Public Accountant",
  "CFA – Chartered Financial Analyst",
  "ACCA – Chartered Certified Accountants",
  "CIA – Certified Internal Auditor",
  "Google Digital Marketing",
  "HubSpot Content Marketing",
  "Meta Blueprint (Facebook Ads)",
  "First Aid / Secourisme",
  "SPHERE Standards",
  "PHAST / WASH",
  "Suivi-évaluation (USAID / Devex)",
  "TOEFL / TOEIC / IELTS",
  "DELF / DALF (Français)",
  "Permis de conduire (A/B/C/D)"
];

export const DISPONIBILITES_LIST = [
  "Consultances",
  "Formations",
  "Coaching",
  "Télétravail",
  "Mentorat",
  "Animation"
];

export const DEFAULT_GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxEz1vPwz0OpYHa8wnZNMp6Et_VME4PuM5xkh-AInkguU0dppLALI3QHNQ2eyQSs4vn_g/exec';
