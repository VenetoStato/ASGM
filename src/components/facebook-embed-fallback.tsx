"use client";

import { useEffect, useState } from "react";

type Props = {
  pageUrl: string;
};

/**
 * Page Plugin ufficiale Facebook via iframe (stabile senza FB.init).
 * Larghezza adattiva: 280–500 px come da documentazione plugin.
 */
export function FacebookEmbedWithFallback({ pageUrl }: Props) {
  const [width, setWidth] = useState(500);

  useEffect(() => {
    function update() {
      if (typeof window === "undefined") return;
      setWidth(Math.min(500, Math.max(280, window.innerWidth - 32)));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const href = encodeURIComponent(pageUrl);
  const iframeSrc = `https://www.facebook.com/plugins/page.php?href=${href}&tabs=timeline&width=${width}&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false`;

  return (
    <div className="w-full min-w-0">
      <div className="mx-auto w-full max-w-full overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-sm">
        <iframe
          title="Pagina Facebook del gruppo — timeline"
          src={iframeSrc}
          width={width}
          height={600}
          style={{ border: "none", overflow: "hidden", maxWidth: "100%" }}
          scrolling="no"
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading="lazy"
          className="mx-auto block min-h-[400px] w-full max-w-full"
        />
      </div>
      <p className="mt-3 text-center text-xs text-stone-500">
        Se non vedi la timeline (blocco cookie, tracker o rete), usa «Apri su
        Facebook» sopra o sotto.
      </p>
    </div>
  );
}
