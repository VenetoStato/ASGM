-- Rimuove le vecchie schede “esempio” e inserisce/aggiorna 10 schede con riferimento esplicito a Wikipedia (IT) e Wikimedia Commons.
DELETE FROM "Species" WHERE "id" IN ('seed_demo_porcino', 'seed_demo_chiodino');

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
  "wikipediaTitle",
  "imageUrl",
  "imageAttribution",
  "autoImported",
  "gbifTaxonKey",
  "lastSyncedAt",
  "createdAt",
  "updatedAt"
) VALUES
(
  'gmc_ref_boletus_edulis',
  'Porcino',
  'Boletus edulis',
  'Boletus edulis Bull.',
  'Querceti, faggeti e miste fresche, su suoli acidi o neutri; estate-autunno.',
  'Commestibile molto apprezzata a livello europeo, purché la specie sia determinata con certezza.',
  $n1$Basidiomicete boletoidi: cappello carnoso, tubuli (non lamelle) gialli che invecchiando virano al verde-oliva; gambo spesso con reticolo bianco sul vertice. Micorrizico con latifoglie e conifere.

Fonte enciclopedica di riferimento: voce italiana «Boletus edulis» su Wikipedia (licenza CC BY-SA), URL sotto. Testo qui riassunto e adattato per uso divulgativo dal Gruppo micologico culturale Sandonatese. Non sostituisce corsi, guide sul campo o parere micologico. Attenzione a specie velenose simili (es. generi confusi da non esperti).$n1$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Boletus_edulis',
  'Boletus edulis',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Boletus_edulis_EtgHolger.jpg/640px-Boletus_edulis_EtgHolger.jpg',
  'Foto: Holger Krisp / Wikimedia Commons (CC BY 3.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_cantharellus_cibarius',
  'Gallinaccio (finferlo giallo)',
  'Cantharellus cibarius',
  'Cantharellus cibarius Fr.',
  'Boschi di latifoglie e conifere, muschi, sotto piante ericacee; primavera-autunno.',
  'Commestibile; attenzione a non confondere con specie di aspetto somigliante.',
  $n2$Fungo a forma di “imbuto” con pseudolamelle rugose che decorrono sul gambo. Colore giallo paglierino–giallo zolfo. Cresce spesso in gruppi.

Fonte enciclopedica: voce «Cantharellus cibarius» su Wikipedia in italiano (CC BY-SA), link in scheda. Sintesi per il pubblico a cura del Gruppo micologico culturale Sandonatese. Verificare sempre con atlanti aggiornati.$n2$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Cantharellus_cibarius',
  'Cantharellus cibarius',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cantharellus_cibarius_2010_G5.jpg/640px-Cantharellus_cibarius_2010_G5.jpg',
  'Foto: George Chernilevsky / Wikimedia Commons (pubblico dominio)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_macrolepiota_procera',
  'Mazza di tamburo',
  'Macrolepiota procera',
  'Macrolepiota procera (Scop.) Singer',
  'Prati, pascoli, margini bosco, suoli ricchi; tarda estate-autunno.',
  'Commestibile se ben cotta e dopo identificazione sicura; alcune Lepiota sono mortali.',
  $n3$Agaricale di grandi dimensioni: cappello con squame, anello mobile sul gambo, lamelle bianche. Habitat tipicamente prativo.

Fonte enciclopedica: voce «Macrolepiota procera» su Wikipedia (italiano, CC BY-SA). Riassunto divulgativo GMC Sandonatese. Non raccogliere “piccole lepiote” senza competenza: rischio grave.$n3$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Macrolepiota_procera',
  'Macrolepiota procera',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Macrolepiota_procera_2011_G1.jpg/640px-Macrolepiota_procera_2011_G1.jpg',
  'Foto: Strobilomyces / Wikimedia Commons (CC BY-SA 3.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_pleurotus_ostreatus',
  'Cardoncello (fungo ostrica)',
  'Pleurotus ostreatus',
  'Pleurotus ostreatus (Jacq.) P. Kumm.',
  'Legno vivo o morto di latifoglie, ceppi, tronchi; tutto l’anno in condizioni favorevoli.',
  'Commestibile coltivato e spontaneo; consumare ben cotto.',
  $n4$Laminicoltura comune: carpoforo a forma di conchiglia, lamelle che decorrono sul gambo laterale, crescita a gruppi sovrapposti su legno.

Fonte enciclopedica: voce «Pleurotus ostreatus» su Wikipedia in italiano (CC BY-SA). Nota GMC: la coltivazione non esclude la necessità di determinazione sul materiale raccolto in natura.$n4$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Pleurotus_ostreatus',
  'Pleurotus ostreatus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Pleurotus_ostreatus_2.jpg/640px-Pleurotus_ostreatus_2.jpg',
  'Foto: Strobilomyces / Wikimedia Commons (CC BY-SA 3.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_agaricus_campestris',
  'Prataiolo dei prati',
  'Agaricus campestris',
  'Agaricus campestris L.',
  'Prati, pascoli, parchi, spesso in anelli; primavera-autunno.',
  'Commestibile; confondersi con specie tossiche dello stesso genere è pericoloso.',
  $n5$Agarico con lamelle che virano dal rosa al bruno-mattone, anello sul gambo, odore gradevole. Tipico dei prati falciati.

Fonte enciclopedica: voce «Agaricus campestris» su Wikipedia (italiano, CC BY-SA). Sintesi GMC. Attenzione: altre specie di Agaricus possono essere tossiche o allergeniche.$n5$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Agaricus_campestris',
  'Agaricus campestris',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Agaricus_campestris_20080712_188_filtered.jpg/640px-Agaricus_campestris_20080712_188_filtered.jpg',
  'Foto: Andrea Pavanello / Wikimedia Commons (CC BY-SA 3.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_armillaria_mellea',
  'Chiodino (armillaria)',
  'Armillaria mellea',
  'Armillaria mellea (Vahl) P. Kumm.',
  'Legno morto, ceppaie, talvolta radici di alberi vivi; autunno.',
  'Commestibile solo dopo cottura prolungata; attenzione a reazioni individuali e a confusioni.',
  $n6$Specie che forma cespi sul legno, anello sul gambo, lamelle bianche. Bioluminescenza documentata in letteratura per il micelio.

Fonte enciclopedica: voce «Armillaria mellea» su Wikipedia in italiano (CC BY-SA). Il gruppo ricorda che testi enciclopedici non sostituiscono norme igieniche locali o pareri medici in caso di intolleranze.$n6$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Armillaria_mellea',
  'Armillaria mellea',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Armillaria_mellea_54387.jpg/640px-Armillaria_mellea_54387.jpg',
  'Foto: Jason Hollinger / Wikimedia Commons (CC BY 2.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_morchella_esculenta',
  'Spugnola (morchela)',
  'Morchella esculenta',
  'Morchella esculenta (L.) Pers.',
  'Boschi aperti, prati, margini sentieri, spesso su terreni calcarei; primavera.',
  'Commestibile dopo cottura; cruda è considerata problematica; attenzione a confusioni con Morchella false.',
  $n7$Ascomicete con ascocarpo alveolato (cappello a spugna). Genere oggetto di revisioni tassonomiche in letteratura.

Fonte enciclopedica: voce «Morchella esculenta» su Wikipedia (italiano, CC BY-SA). Per aggiornamenti tassonomici consultare anche fonti scientifiche recenti oltre alla voce Wikipedia.$n7$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Morchella_esculenta',
  'Morchella esculenta',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Morchella_esculenta%2C_Germany.jpg/640px-Morchella_esculenta%2C_Germany.jpg',
  'Foto: Holger Krisp / Wikimedia Commons (CC BY 3.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_craterellus_cornucopioides',
  'Trombetta dei morti',
  'Craterellus cornucopioides',
  'Craterellus cornucopioides (L.) Pers.',
  'Fogliame umido, muschi, boschi di latifoglie; autunno.',
  'Commestibile se determinata con certezza; non confondere con specie nere non commestibili.',
  $n8$Fungo a forma di imbuto/tromba, superficie esterna nero-bruna, pseudolamelle rugose. Habitat spesso umido.

Fonte enciclopedica: voce «Craterellus cornucopioides» su Wikipedia in italiano (CC BY-SA). Riassunto GMC. Il nome volgare è folkloristico; l’identificazione micro-macroscopica resta essenziale.$n8$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Craterellus_cornucopioides',
  'Craterellus cornucopioides',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Craterellus_cornucopioides_122607.jpg/640px-Craterellus_cornucopioides_122607.jpg',
  'Foto: Jason Hollinger / Wikimedia Commons (CC BY 2.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_lactarius_deliciosus',
  'Lactarius deliciosus (rossula da latte)',
  'Lactarius deliciosus',
  'Lactarius deliciosus (L.) Gray',
  'Sotto pini, suoli sabbiosi o sabbioso-silicei; autunno.',
  'Commestibile dopo cottura; latte arancio-carota distintivo (ma non unico).',
  $n9$Russulale che produce lattice (latte) al taglio delle lamelle. Cappello spesso zonato arancio-verde. Micorrizico principalmente con pineta.

Fonte enciclopedica: voce «Lactarius deliciosus» su Wikipedia in italiano (CC BY-SA). Nota GMC: il complesso tassonomico del gruppo è stato oggetto di studi; per determinazioni certe usare chiavi aggiornate.$n9$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Lactarius_deliciosus',
  'Lactarius deliciosus',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lactarius_deliciosus_100816w.JPG/640px-Lactarius_deliciosus_100816w.JPG',
  'Foto: Strobilomyces / Wikimedia Commons (CC BY-SA 3.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'gmc_ref_hydnum_repandum',
  'Steccherino (lingua di cane)',
  'Hydnum repandum',
  'Hydnum repandum L.',
  'Boschi di latifoglie e conifere, su suolo umifero; estate-autunno.',
  'Commestibile apprezzato; spinule sotto il cappello al posto delle lamelle.',
  $n10$Basidiomicete idnoidi: imenoforo a aculei (spinule) decurrenti. Cappello irregolare, spesso asimmetrico.

Fonte enciclopedica: voce «Hydnum repandum» su Wikipedia in italiano (CC BY-SA). Sintesi divulgativa GMC Sandonatese. Confrontare con altre specie idnoidi solo con guide affidabili.$n10$,
  'Wikipedia (IT) + redazione GMC Sandonatese',
  'https://it.wikipedia.org/wiki/Hydnum_repandum',
  'Hydnum repandum',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Hydnum_repandum_%28xndr%29.jpg/640px-Hydnum_repandum_%28xndr%29.jpg',
  'Foto: xndr / Wikimedia Commons (CC BY-SA 3.0)',
  false,
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO UPDATE SET
  "name" = EXCLUDED."name",
  "scientificName" = EXCLUDED."scientificName",
  "synonyms" = EXCLUDED."synonyms",
  "habitat" = EXCLUDED."habitat",
  "edibility" = EXCLUDED."edibility",
  "notes" = EXCLUDED."notes",
  "sourceName" = EXCLUDED."sourceName",
  "sourceUrl" = EXCLUDED."sourceUrl",
  "wikipediaTitle" = EXCLUDED."wikipediaTitle",
  "imageUrl" = EXCLUDED."imageUrl",
  "imageAttribution" = EXCLUDED."imageAttribution",
  "autoImported" = EXCLUDED."autoImported",
  "gbifTaxonKey" = EXCLUDED."gbifTaxonKey",
  "lastSyncedAt" = EXCLUDED."lastSyncedAt",
  "updatedAt" = CURRENT_TIMESTAMP;
