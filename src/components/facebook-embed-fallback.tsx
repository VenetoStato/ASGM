"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { FACEBOOK_PAGE_URL } from "@/lib/public-site";
import { FacebookPageLink } from "./facebook-brand";

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: Element | HTMLElement) => void } };
  }
}

/** Su mobile l’iframe spunta in ritardo: non mostrare subito il fallback. */
const BLOCK_CHECK_MS = 14000;
const MIN_IFRAME_HEIGHT = 48;
const RECHECK_EVERY_MS = 2000;

type Props = {
  pageUrl: string;
};

function parseFb(root: HTMLElement | null) {
  if (typeof window === "undefined" || !window.FB?.XFBML || !root) return;
  try {
    window.FB.XFBML.parse(root);
  } catch {
    /* ignore */
  }
}

function findFbIframe(root: HTMLElement | null): HTMLIFrameElement | null {
  const iframes = root?.querySelectorAll("iframe");
  if (!iframes?.length) return null;
  for (const el of iframes) {
    const src = el.getAttribute("src") ?? "";
    if (
      src.includes("facebook") ||
      src.includes("fbcdn") ||
      src.includes("fb.com")
    ) {
      return el;
    }
  }
  return iframes[0] as HTMLIFrameElement;
}

export function FacebookEmbedWithFallback({ pageUrl }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pluginLikelyBlocked, setPluginLikelyBlocked] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  /** Larghezza plugin: fondamentale su mobile (data-width fissa 500 spesso fallisce). */
  const [pluginWidth, setPluginWidth] = useState(500);

  useEffect(() => {
    function updateWidth() {
      if (typeof window === "undefined") return;
      const vw = window.innerWidth;
      setPluginWidth(Math.min(500, Math.max(280, vw - 24)));
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    if (!sdkLoaded) return;
    const id = window.requestAnimationFrame(() => {
      parseFb(wrapRef.current);
    });
    return () => window.cancelAnimationFrame(id);
  }, [sdkLoaded, pluginWidth]);

  useEffect(() => {
    if (!sdkLoaded) return;
    const root = wrapRef.current;
    if (!root) return;

    let cancelled = false;
    let blockTimer: number | undefined;

    const maybeUnblock = () => {
      const iframe = findFbIframe(root);
      const h = iframe?.offsetHeight ?? 0;
      if (iframe && h >= MIN_IFRAME_HEIGHT) {
        setPluginLikelyBlocked(false);
        return true;
      }
      return false;
    };

    const interval = window.setInterval(() => {
      if (cancelled) return;
      if (maybeUnblock()) {
        window.clearInterval(interval);
        if (blockTimer) window.clearTimeout(blockTimer);
      }
    }, RECHECK_EVERY_MS);

    blockTimer = window.setTimeout(() => {
      if (cancelled) return;
      if (!maybeUnblock()) {
        const iframe = findFbIframe(root);
        const h = iframe?.offsetHeight ?? 0;
        if (!iframe || h < MIN_IFRAME_HEIGHT) {
          setPluginLikelyBlocked(true);
        }
      }
      window.clearInterval(interval);
    }, BLOCK_CHECK_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      if (blockTimer) window.clearTimeout(blockTimer);
    };
  }, [sdkLoaded, pluginWidth]);

  const onSdkLoad = () => {
    setSdkLoaded(true);
    window.setTimeout(() => parseFb(wrapRef.current), 0);
  };

  return (
    <div className="w-full min-w-0">
      <div id="fb-root" />
      <Script
        src="https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v21.0"
        strategy="afterInteractive"
        onLoad={onSdkLoad}
      />
      {!pluginLikelyBlocked && (
        <div
          ref={wrapRef}
          className="min-h-[140px] w-full min-w-0 max-w-full overflow-x-auto overflow-y-visible py-1"
        >
          <div
            key={pluginWidth}
            className="fb-page mx-auto"
            data-href={pageUrl}
            data-tabs="timeline"
            data-width={String(pluginWidth)}
            data-height="520"
            data-small-header="true"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="false"
          />
        </div>
      )}
      {pluginLikelyBlocked && (
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-6 text-center sm:px-5 sm:py-8">
          <p className="text-sm font-medium text-stone-800">
            Il riquadro incorporato di Facebook non è disponibile su questo
            dispositivo o è bloccato (privacy, cookie, app in-app). Apri la
            pagina ufficiale del gruppo con il pulsante qui sotto.
          </p>
          <div className="mt-4 flex justify-center">
            <FacebookPageLink href={FACEBOOK_PAGE_URL} variant="solid">
              Apri la pagina Facebook del gruppo
            </FacebookPageLink>
          </div>
        </div>
      )}
    </div>
  );
}
