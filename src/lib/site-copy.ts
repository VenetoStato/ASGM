export type SiteCopyResolved = {
  heroTitle: string;
  heroSubtitle: string;
  heroLead: string;
  chiSiamo: string;
  pubblicazioni: string;
  calendarioAttivita: string;
  sostegno: string;
};

/** Testi homepage: default usati se il DB non ha ancora righe o un campo è vuoto. */
export const SITE_COPY_DEFAULTS: SiteCopyResolved = {
  heroTitle: "Gruppo Micologico Culturale Sandonatese",
  heroSubtitle: "San Donà di Piave",
  heroLead:
    "Annunci, uscite sul territorio e schede funghi. Ottimizzato per il telefono: scorri e usa il menu in alto.",
  chiSiamo: `Il Gruppo Micologico Culturale Sandonatese riunisce appassionati di micologia del territorio. Promuoviamo la conoscenza responsabile dei funghi, uscite sul campo, incontri e materiali divulgativi, nel rispetto della normativa e dell'ambiente.`,
  pubblicazioni: `Per informazioni su pubblicazioni, riviste o materiali del gruppo, rivolgersi alla segreteria (email e recapiti comunicati agli iscritti) o ai canali indicati in sede.`,
  calendarioAttivita: `Calendario uscite, incontri e appuntamenti: le date aggiornate sono qui sotto e nella sezione Eventi.`,
  sostegno: `Se desideri sostenere le attività del gruppo, chiedi informazioni in sede per la destinazione del 5×1000 o altre forme di contributo (codice fiscale e istruzioni aggiornate dalla segreteria).`,
};

type SiteSettingsRow = {
  heroTitle: string | null;
  heroSubtitle: string | null;
  heroLead: string | null;
  chiSiamo: string | null;
  pubblicazioni: string | null;
  calendarioAttivita: string | null;
  sostegno: string | null;
};

export function mergeSiteCopy(row: SiteSettingsRow | null): SiteCopyResolved {
  const d = SITE_COPY_DEFAULTS;
  if (!row) return { ...d };
  return {
    heroTitle: row.heroTitle?.trim() || d.heroTitle,
    heroSubtitle: row.heroSubtitle?.trim() || d.heroSubtitle,
    heroLead: row.heroLead?.trim() || d.heroLead,
    chiSiamo: row.chiSiamo?.trim() || d.chiSiamo,
    pubblicazioni: row.pubblicazioni?.trim() || d.pubblicazioni,
    calendarioAttivita: row.calendarioAttivita?.trim() || d.calendarioAttivita,
    sostegno: row.sostegno?.trim() || d.sostegno,
  };
}
