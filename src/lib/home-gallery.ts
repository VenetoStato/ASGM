/**
 * Immagini da Wikimedia Commons (licenze libere) per la home pubblica.
 * Ogni voce include attribuzione testuale per il footer della figura.
 */
export type HomeGalleryItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Didascalia breve sotto l’immagine */
  caption: string;
  /** Riga crediti / licenza (testo piano) */
  credit: string;
};

export const HOME_GALLERY_ITEMS: HomeGalleryItem[] = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Boletus_edulis_EtgHolgeroe.jpg/1024px-Boletus_edulis_EtgHolgeroe.jpg",
    width: 1024,
    height: 683,
    alt: "Esemplari di Boletus edulis al suolo nel bosco",
    caption: "Porcino (Boletus edulis)",
    credit:
      "Holger Krisp / CC BY 3.0 — Wikimedia Commons",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/2006-10-25_Amanita_muscaria_crop.jpg/900px-2006-10-25_Amanita_muscaria_crop.jpg",
    width: 900,
    height: 675,
    alt: "Funghi Amanita muscaria su terreno forestale",
    caption: "Amanita muscaria",
    credit: "Archenzo / CC BY-SA 3.0 — Wikimedia Commons",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Chanterelle_Cantharellus_cibarius.jpg/1024px-Chanterelle_Cantharellus_cibarius.jpg",
    width: 1024,
    height: 768,
    alt: "Cantharellus cibarius tra muschio e foglie",
    caption: "Galletto (Cantharellus cibarius)",
    credit: "Jason Hollinger / CC BY 2.0 — Wikimedia Commons",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Morchella_esculenta%2C_Morels_2010_G1.jpg/1024px-Morchella_esculenta%2C_Morels_2010_G1.jpg",
    width: 1024,
    height: 768,
    alt: "Spugnola (Morchella esculenta) in ambiente naturale",
    caption: "Spugnola (Morchella esculenta)",
    credit: "George Chernilevsky / Public domain — Wikimedia Commons",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Macrolepiota_procera_050817w.jpg/900px-Macrolepiota_procera_050817w.jpg",
    width: 900,
    height: 1200,
    alt: "Esemplare di Macrolepiota procera eretto nel prato",
    caption: "Prugnolo (Macrolepiota procera)",
    credit: "Strobilomyces / CC BY-SA 3.0 — Wikimedia Commons",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Hericium_erinaceus_47598.jpg/1024px-Hericium_erinaceus_47598.jpg",
    width: 1024,
    height: 768,
    alt: "Hericium erinaceus su tronco",
    caption: "Hericium erinaceus",
    credit: "Dan Molter / CC BY-SA 3.0 — Wikimedia Commons",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Armillaria_mellea_G1.jpg/1024px-Armillaria_mellea_G1.jpg",
    width: 1024,
    height: 768,
    alt: "Armillaria mellea su legno in decomposizione",
    caption: "Chiodino (Armillaria mellea)",
    credit: "George Chernilevsky / Public domain — Wikimedia Commons",
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Fungi_in_Beskid_S%C4%85decki.jpg/1280px-Fungi_in_Beskid_S%C4%85decki.jpg",
    width: 1280,
    height: 853,
    alt: "Vari funghi nel sottobosco tra foglie e muschio",
    caption: "Biodiversità fungina nel sottobosco",
    credit: "Piotr VaGra / CC BY-SA 4.0 — Wikimedia Commons",
  },
];

/** Immagine hero (stesso dominio, ottimizzata da next/image) */
export const HOME_HERO_IMAGE = {
  src: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Boletus_edulis_%28Tottoli%29_01.jpg/1920px-Boletus_edulis_%28Tottoli%29_01.jpg",
  width: 1920,
  height: 1280,
  alt: "Esemplari di porcini in ambiente forestale",
} as const;
