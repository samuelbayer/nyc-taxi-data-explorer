export const LANGUAGES = ["en", "es", "fr", "de", "pt"] as const;
export type Lang = (typeof LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
};

export const LOCALES: Record<Lang, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-BR",
};

export type ColumnKey =
  | "distance"
  | "fare"
  | "tip"
  | "duration"
  | "pickup"
  | "dropoff"
  | "passengers"
  | "payment";

export type Messages = {
  subtitle: string;
  metaDescription: string;
  language: string;
  theme: { toDark: string; toLight: string };
  filters: {
    hideNegative: string;
    minFare: string;
    paymentType: string;
    noFilter: string;
    minPassengers: string;
    any: string;
    distance: string;
    distanceRange: (min: number, max: string) => string;
    minDistanceHandle: string;
    maxDistanceHandle: string;
  };
  payment: string[];
  paymentUnknown: string;
  columns: Record<ColumnKey, string>;
  status: {
    engine: string;
    query: string;
    ready: string;
    tripsMatch: string;
    showingRows: string;
    rowsRange: (from: string, to: string) => string;
    queryTime: string;
    noMatch: string;
    noMatchHint: string;
    errorEngine: string;
    errorParquet: string;
  };
};

const en: Messages = {
  subtitle: "Every taxi trip from January 2026. Filters run in your browser.",
  metaDescription:
    "Explore 3.7 million NYC taxi trips instantly in your browser — filter and scroll massive datasets with DuckDB-WASM, Web Workers and virtualized rendering.",
  language: "Language",
  theme: { toDark: "Dark mode", toLight: "Light mode" },
  filters: {
    hideNegative: "Hide negative fares",
    minFare: "Min. fare",
    paymentType: "Payment type",
    noFilter: "No filter",
    minPassengers: "Min. passengers",
    any: "Any",
    distance: "Distance",
    distanceRange: (min, max) => `${min} to ${max} mi`,
    minDistanceHandle: "Minimum distance",
    maxDistanceHandle: "Maximum distance",
  },
  payment: [
    "Flex Fare trip",
    "Credit card",
    "Cash",
    "No charge",
    "Dispute",
    "Unknown",
    "Voided trip",
  ],
  paymentUnknown: "N/A",
  columns: {
    distance: "Distance",
    fare: "Fare",
    tip: "Tip",
    duration: "Duration",
    pickup: "Pickup",
    dropoff: "Dropoff",
    passengers: "Passengers",
    payment: "Payment",
  },
  status: {
    engine: "Starting database engine...",
    query: "Loading 3.7M trips...",
    ready: "System ready",
    tripsMatch: "trips match these filters",
    showingRows: "Showing rows",
    rowsRange: (from, to) => `${from} to ${to}`,
    queryTime: "Query time",
    noMatch: "No trips match these filters",
    noMatchHint:
      "Lower the minimum fare or widen the distance to see trips again.",
    errorEngine: "Could not start the database engine",
    errorParquet: "The Parquet file could not be loaded",
  },
};

const es: Messages = {
  subtitle:
    "Todos los viajes en taxi de enero de 2026. Los filtros se ejecutan en tu navegador.",
  metaDescription:
    "Explora al instante 3,7 millones de viajes en taxi de Nueva York en tu navegador: filtra y desplázate por datos masivos con DuckDB-WASM, Web Workers y renderizado virtualizado.",
  language: "Idioma",
  theme: { toDark: "Modo oscuro", toLight: "Modo claro" },
  filters: {
    hideNegative: "Ocultar tarifas negativas",
    minFare: "Tarifa mín.",
    paymentType: "Tipo de pago",
    noFilter: "Sin filtro",
    minPassengers: "Pasajeros mín.",
    any: "Cualquiera",
    distance: "Distancia",
    distanceRange: (min, max) => `${min} a ${max} mi`,
    minDistanceHandle: "Distancia mínima",
    maxDistanceHandle: "Distancia máxima",
  },
  payment: [
    "Tarifa flexible",
    "Tarjeta de crédito",
    "Efectivo",
    "Sin cargo",
    "Disputa",
    "Desconocido",
    "Viaje anulado",
  ],
  paymentUnknown: "N/D",
  columns: {
    distance: "Distancia",
    fare: "Tarifa",
    tip: "Propina",
    duration: "Duración",
    pickup: "Recogida",
    dropoff: "Llegada",
    passengers: "Pasajeros",
    payment: "Pago",
  },
  status: {
    engine: "Iniciando el motor de base de datos...",
    query: "Cargando 3,7 M de viajes...",
    ready: "Sistema listo",
    tripsMatch: "viajes coinciden con los filtros",
    showingRows: "Mostrando filas",
    rowsRange: (from, to) => `${from} a ${to}`,
    queryTime: "Tiempo de consulta",
    noMatch: "Ningún viaje coincide con los filtros",
    noMatchHint:
      "Baja la tarifa mínima o amplía la distancia para volver a ver viajes.",
    errorEngine: "No se pudo iniciar el motor de base de datos",
    errorParquet: "No se pudo cargar el archivo Parquet",
  },
};

const fr: Messages = {
  subtitle:
    "Tous les trajets en taxi de janvier 2026. Les filtres s'exécutent dans votre navigateur.",
  metaDescription:
    "Explorez instantanément 3,7 millions de trajets en taxi à New York dans votre navigateur : filtrez et faites défiler d'énormes jeux de données avec DuckDB-WASM, les Web Workers et un rendu virtualisé.",
  language: "Langue",
  theme: { toDark: "Mode sombre", toLight: "Mode clair" },
  filters: {
    hideNegative: "Masquer les tarifs négatifs",
    minFare: "Tarif min.",
    paymentType: "Mode de paiement",
    noFilter: "Aucun filtre",
    minPassengers: "Passagers min.",
    any: "Tous",
    distance: "Distance",
    distanceRange: (min, max) => `${min} à ${max} mi`,
    minDistanceHandle: "Distance minimale",
    maxDistanceHandle: "Distance maximale",
  },
  payment: [
    "Tarif flexible",
    "Carte bancaire",
    "Espèces",
    "Gratuit",
    "Litige",
    "Inconnu",
    "Course annulée",
  ],
  paymentUnknown: "N/D",
  columns: {
    distance: "Distance",
    fare: "Tarif",
    tip: "Pourboire",
    duration: "Durée",
    pickup: "Départ",
    dropoff: "Arrivée",
    passengers: "Passagers",
    payment: "Paiement",
  },
  status: {
    engine: "Démarrage du moteur de base de données...",
    query: "Chargement de 3,7 M de trajets...",
    ready: "Système prêt",
    tripsMatch: "trajets correspondent aux filtres",
    showingRows: "Lignes affichées",
    rowsRange: (from, to) => `${from} à ${to}`,
    queryTime: "Durée de la requête",
    noMatch: "Aucun trajet ne correspond aux filtres",
    noMatchHint:
      "Baissez le tarif minimum ou élargissez la distance pour revoir des trajets.",
    errorEngine: "Impossible de démarrer le moteur de base de données",
    errorParquet: "Impossible de charger le fichier Parquet",
  },
};

const de: Messages = {
  subtitle:
    "Alle Taxifahrten vom Januar 2026. Die Filter laufen in Ihrem Browser.",
  metaDescription:
    "Erkunden Sie 3,7 Millionen New Yorker Taxifahrten sofort in Ihrem Browser: Filtern und Scrollen durch riesige Datenmengen mit DuckDB-WASM, Web Workern und virtualisiertem Rendering.",
  language: "Sprache",
  theme: { toDark: "Dunkler Modus", toLight: "Heller Modus" },
  filters: {
    hideNegative: "Negative Fahrpreise ausblenden",
    minFare: "Mindestpreis",
    paymentType: "Zahlungsart",
    noFilter: "Kein Filter",
    minPassengers: "Mind. Fahrgäste",
    any: "Beliebig",
    distance: "Entfernung",
    distanceRange: (min, max) => `${min} bis ${max} mi`,
    minDistanceHandle: "Mindestentfernung",
    maxDistanceHandle: "Höchstentfernung",
  },
  payment: [
    "Flex-Fare-Fahrt",
    "Kreditkarte",
    "Bargeld",
    "Kein Fahrpreis",
    "Streitfall",
    "Unbekannt",
    "Stornierte Fahrt",
  ],
  paymentUnknown: "k. A.",
  columns: {
    distance: "Entfernung",
    fare: "Fahrpreis",
    tip: "Trinkgeld",
    duration: "Dauer",
    pickup: "Abholung",
    dropoff: "Ankunft",
    passengers: "Fahrgäste",
    payment: "Zahlung",
  },
  status: {
    engine: "Datenbank-Engine wird gestartet...",
    query: "3,7 Mio. Fahrten werden geladen...",
    ready: "System bereit",
    tripsMatch: "Fahrten entsprechen den Filtern",
    showingRows: "Angezeigte Zeilen",
    rowsRange: (from, to) => `${from} bis ${to}`,
    queryTime: "Abfragezeit",
    noMatch: "Keine Fahrten entsprechen den Filtern",
    noMatchHint:
      "Senken Sie den Mindestpreis oder erweitern Sie die Entfernung, um wieder Fahrten zu sehen.",
    errorEngine: "Die Datenbank-Engine konnte nicht gestartet werden",
    errorParquet: "Die Parquet-Datei konnte nicht geladen werden",
  },
};

const pt: Messages = {
  subtitle:
    "Todas as corridas de táxi de janeiro de 2026. Os filtros rodam no seu navegador.",
  metaDescription:
    "Explore 3,7 milhões de corridas de táxi de Nova York no seu navegador: filtre e role por dados enormes com DuckDB-WASM, Web Workers e renderização virtualizada.",
  language: "Idioma",
  theme: { toDark: "Modo escuro", toLight: "Modo claro" },
  filters: {
    hideNegative: "Ocultar tarifas negativas",
    minFare: "Tarifa mín.",
    paymentType: "Forma de pagamento",
    noFilter: "Sem filtro",
    minPassengers: "Passageiros mín.",
    any: "Qualquer",
    distance: "Distância",
    distanceRange: (min, max) => `${min} a ${max} mi`,
    minDistanceHandle: "Distância mínima",
    maxDistanceHandle: "Distância máxima",
  },
  payment: [
    "Tarifa flexível",
    "Cartão de crédito",
    "Dinheiro",
    "Sem cobrança",
    "Disputa",
    "Desconhecido",
    "Corrida cancelada",
  ],
  paymentUnknown: "N/D",
  columns: {
    distance: "Distância",
    fare: "Tarifa",
    tip: "Gorjeta",
    duration: "Duração",
    pickup: "Embarque",
    dropoff: "Desembarque",
    passengers: "Passageiros",
    payment: "Pagamento",
  },
  status: {
    engine: "Iniciando o mecanismo de banco de dados...",
    query: "Carregando 3,7 mi de corridas...",
    ready: "Sistema pronto",
    tripsMatch: "corridas correspondem aos filtros",
    showingRows: "Linhas exibidas",
    rowsRange: (from, to) => `${from} a ${to}`,
    queryTime: "Tempo da consulta",
    noMatch: "Nenhuma corrida corresponde aos filtros",
    noMatchHint:
      "Reduza a tarifa mínima ou amplie a distância para ver corridas novamente.",
    errorEngine: "Não foi possível iniciar o mecanismo de banco de dados",
    errorParquet: "Não foi possível carregar o arquivo Parquet",
  },
};

export const MESSAGES: Record<Lang, Messages> = { en, es, fr, de, pt };

export function isLang(value: unknown): value is Lang {
  return (LANGUAGES as readonly unknown[]).includes(value);
}

/** Picks the first supported language from the browser's preference list. */
export function detectLanguage(candidates: readonly string[]): Lang {
  for (const candidate of candidates) {
    const base = candidate.toLowerCase().split("-")[0];
    if (isLang(base)) return base;
  }
  return "en";
}
