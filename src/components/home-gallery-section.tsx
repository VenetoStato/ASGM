import Image from "next/image";
import Link from "next/link";
import {
  HOME_GALLERY_ITEMS,
  type HomeGalleryItem,
} from "@/lib/home-gallery";
import { CompactDisclosure } from "@/components/ui/disclosure";

function GalleryFigure({ item }: { item: HomeGalleryItem }) {
  return (
    <figure className="group overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm ring-1 ring-stone-900/[0.04] transition hover:border-emerald-300/60 hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-200/80">
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <figcaption className="space-y-1 p-3 sm:p-3.5">
        <p className="text-sm font-semibold text-emerald-950">{item.caption}</p>
        <p className="text-[11px] leading-snug text-stone-500">{item.credit}</p>
      </figcaption>
    </figure>
  );
}

export function HomeGallerySection() {
  return (
    <section
      id="galleria"
      className="scroll-mt-[4.5rem] border-b border-stone-200/50 bg-[var(--surface-muted)] py-6 sm:scroll-mt-24 sm:py-10"
    >
      <div className="mx-auto w-full max-w-6xl px-4">
        <CompactDisclosure
          title="Galleria"
          subtitle="Immagini divulgative su specie e habitat — non sostituiscono il riconoscimento sul campo"
          defaultOpen
        >
          <p className="mb-5 text-sm leading-relaxed text-stone-600 sm:text-[15px]">
            Foto da{" "}
            <a
              href="https://commons.wikimedia.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-800 underline decoration-emerald-800/30"
            >
              Wikimedia Commons
            </a>{" "}
            (licenze libere). Per approfondire le schede del gruppo, visita{" "}
            <Link
              href="/funghi"
              className="font-semibold text-emerald-800 underline decoration-emerald-800/30"
            >
              Schede funghi
            </Link>
            .
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HOME_GALLERY_ITEMS.map((item) => (
              <li key={item.src}>
                <GalleryFigure item={item} />
              </li>
            ))}
          </ul>
        </CompactDisclosure>
      </div>
    </section>
  );
}
