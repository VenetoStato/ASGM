-- Due schede di esempio (testo + immagini Wikimedia con attribuzione) solo se il DB non ha ancora specie.
INSERT INTO "Species" (
  "id",
  "name",
  "scientificName",
  "synonyms",
  "habitat",
  "edibility",
  "notes",
  "sourceName",
  "sourceUrl",
  "imageUrl",
  "imageAttribution",
  "autoImported",
  "createdAt",
  "updatedAt"
)
SELECT * FROM (
  VALUES
  (
    'seed_demo_porcino',
    'Porcino (scheda di esempio)',
    'Boletus edulis',
    'Boletus edulis Bull.',
    'Boschi di latifoglie, spesso sotto querce, castagni e faggi.',
    'Commestibile se identificato con certezza.',
    $txt$Fungo dal cappello marrone e tubuli (non lamelle) sotto il cappello. Piede spesso robusto e reticolato in alto. Esistono specie simili pericolose: non raccogliere senza competenza.

Questa scheda è un esempio: modificala o eliminala da Organizzatori → Schede funghi.$txt$,
    'Gruppo micologico (esempio)',
    NULL::text,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Boletus_edulis_EtgHolger.jpg/640px-Boletus_edulis_EtgHolger.jpg',
    'Foto: Holger Krisp / Wikimedia Commons (CC BY 3.0)',
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'seed_demo_chiodino',
    'Chiodino (scheda di esempio)',
    'Armillaria mellea',
    'Armillaria mellea (Vahl) P. Kumm.',
    'Legno morto, ceppaie, talvolta alla base di alberi vivi.',
    'Commestibile solo dopo cottura prolungata.',
    $txt$Gruppo di funghi con cappello bruno-giallastro e anello sul gambo. La determinazione può richiedere esperienza.

Esempio da personalizzare in Organizzatori → Schede funghi.$txt$,
    'Gruppo micologico (esempio)',
    NULL::text,
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Armillaria_mellea_54387.jpg/640px-Armillaria_mellea_54387.jpg',
    'Foto: Jason Hollinger / Wikimedia Commons (CC BY 2.0)',
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  )
) AS v(
  "id", "name", "scientificName", "synonyms", "habitat", "edibility", "notes",
  "sourceName", "sourceUrl", "imageUrl", "imageAttribution", "autoImported", "createdAt", "updatedAt"
)
WHERE NOT EXISTS (SELECT 1 FROM "Species" LIMIT 1);
