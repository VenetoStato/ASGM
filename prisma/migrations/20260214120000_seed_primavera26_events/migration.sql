-- Calendario "Primavera 26" (volantino gruppo) — idempotente: non sovrascrive se già inseriti.
-- Orari serali: 20:30 (Europe/Rome, CEST) → 18:30 UTC.
-- Uscita/mostra senza orario: 09:30 CEST → 07:30 UTC (indicativo).

INSERT INTO "Event" ("id", "title", "startsAt", "endsAt", "location", "description", "status", "publishedAt", "createdAt", "updatedAt")
VALUES
  (
    'gmc_primavera26_boletaceae',
    'Le boletaceae',
    '2026-04-14 18:30:00+00',
    NULL,
    'Motta',
    'Relatore: Alberto Moretto.',
    'PUBLISHED',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'gmc_primavera26_uscita_litorale',
    'Uscita didattica in ambiente litoraneo',
    '2026-04-24 07:30:00+00',
    NULL,
    NULL,
    'Calendario Primavera 26 — gruppo micologico culturale sandonatese.',
    'PUBLISHED',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'gmc_primavera26_mostra',
    'Mostra micologica di primavera',
    '2026-04-25 07:30:00+00',
    NULL,
    NULL,
    'Calendario Primavera 26 — gruppo micologico culturale sandonatese.',
    'PUBLISHED',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'gmc_primavera26_etnomicologia',
    'Etnomicologia in Italia',
    '2026-05-04 18:30:00+00',
    NULL,
    NULL,
    'Relatore: Nicola Sitta.',
    'PUBLISHED',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'gmc_primavera26_scandinavia',
    'Funghi della Scandinavia',
    '2026-05-18 18:30:00+00',
    NULL,
    NULL,
    'Relatore: Livio Lorenzon.',
    'PUBLISHED',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'gmc_primavera26_microscopia',
    'Pillole di microscopia',
    '2026-06-08 18:30:00+00',
    NULL,
    NULL,
    'Relatore: Antonio Camani.',
    'PUBLISHED',
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT ("id") DO NOTHING;
