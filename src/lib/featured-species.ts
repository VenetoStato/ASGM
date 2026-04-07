/** Schede di esempio sulla home se il database non ha ancora specie. */
export const FEATURED_SPECIES_FALLBACK = [
  {
    name: "Porcino",
    scientificName: "Boletus edulis",
    note: "Commestibile, tra i boleti più noti.",
  },
  {
    name: "Ovolo buono",
    scientificName: "Amanita caesarea",
    note: "Commestibile; attenzione a non confonderlo con altre amanite.",
  },
  {
    name: "Chiodino",
    scientificName: "Armillaria mellea",
    note: "Commestibile se ben cotta; verificare sempre con una guida.",
  },
  {
    name: "Prugnolo",
    scientificName: "Macrolepiota procera",
    note: "Commestibile molto apprezzato; riconoscimento attento.",
  },
] as const;
