import { z } from "zod";

export const ingestBodySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("event"),
    title: z.string().min(1).max(500),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime().optional(),
    location: z.string().max(500).optional(),
    description: z.string().max(20000).optional(),
    sourceMessageId: z.string().max(200).optional(),
    publish: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("draft"),
    title: z.string().max(500).optional(),
    body: z.string().min(1).max(50000),
    idempotencyKey: z.string().max(200).optional(),
    autoPublish: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("species"),
    name: z.string().min(1).max(300),
    scientificName: z.string().max(300).optional(),
    synonyms: z.string().max(1000).optional(),
    habitat: z.string().max(1000).optional(),
    edibility: z.string().max(500).optional(),
    notes: z.string().max(20000).optional(),
    source: z.string().max(500).optional(),
  }),
  z.object({
    type: z.literal("announcement"),
    title: z.string().min(1).max(500),
    body: z.string().min(1).max(50000),
    images: z.array(z.string().max(2000)).max(20).optional(),
    publish: z.boolean().optional(),
    sourceMessageId: z.string().max(200).optional(),
  }),
]);

export type IngestBody = z.infer<typeof ingestBodySchema>;
