"use client";

import { useEffect, useState } from "react";

type Props = {
  pageUrl: string;
};

/** Altezza iframe Page Plugin: troppo bassa taglia la timeline; troppo alta su mobile pesa. */
const IFRAME_HEIGHT_DESKTOP = 820;
const IFRAME_HEIGHT_MOBILE = 680;

/**
 * Page Plugin Facebook via iframe ufficiale.
 * Container con overflow visibile e iframe alto + scroll interno per evitare il “taglio” della timeline.
 */
export function FacebookEmbedWithFallback({ pageUrl }: Props) {
  const [width, setWidth] = useState(500);
  const [iframeHeight, setIframeHeight] = useState(IFRAME_HEIGHT_DESKTOP);

  useEffect(() => {
    function update() {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      setWidth(Math.min(500, Math.max(280, vw - 32)));
      setIframeHeight(vw < 640 ? IFRAME_HEIGHT_MOBILE : IFRAME_HEIGHT_DESKTOP);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const href = encodeURIComponent(pageUrl);
  const iframeSrc = `https://www.facebook.com/plugins/page.php?href=${href}&tabs=timeline&width=${width}&height=${iframeHeight}&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&lazy=false`;

  return (
    <div className="w-full min-w-0">
      <div
        className="mx-auto w-full max-w-full rounded-xl border border-stone-200/90 bg-stone-50/50 shadow-sm sm:bg-white"
        style={{ minHeight: Math.min(iframeHeight + 24, 900) }}
      >
        <iframe
          title="Pagina Facebook del gruppo — timeline"
          src={iframeSrc}
          width={width}
          height={iframeHeight}
          style={{
            border: "none",
            overflow: "auto",
            display: "block",
            maxWidth: "100%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          scrolling="yes"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          loading="lazy"
          className="min-h-[min(70vh,680px)] w-full max-w-full"
        />
      </div>
      <p className="mt-3 text-center text-xs text-stone-500">
        Scorri dentro il riquadro per vedere altri post. Se non compare nulla (blocco
        cookie o tracker), usa «Apri su Facebook» sopra o sotto.
      </p>
    </div>
  );
}
