"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { FACEBOOK_PAGE_URL } from "@/lib/public-site";

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: Element | HTMLElement) => void } };
  }
}

const CHECK_MS = 4500;
const MIN_IFRAME_HEIGHT = 80;

type Props = {
  pageUrl: string;
};

/**
 * Livello 2: plugin Facebook. Se dopo CHECK_MS non compare un iframe alto abbastanza,
 * mostra livello 3 (CTA — utile con ad blocker / privacy).
 */
export function FacebookEmbedWithFallback({ pageUrl }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pluginLikelyBlocked, setPluginLikelyBlocked] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    if (!sdkLoaded) return;
    const t = window.setTimeout(() => {
      const root = wrapRef.current;
      if (!root) return;
      const iframe = root.querySelector("iframe");
      const h = iframe?.offsetHeight ?? 0;
      if (!iframe || h < MIN_IFRAME_HEIGHT) {
        setPluginLikelyBlocked(true);
      }
    }, CHECK_MS);
    return () => window.clearTimeout(t);
  }, [sdkLoaded]);

  const onSdkLoad = () => {
    setSdkLoaded(true);
    if (typeof window !== "undefined" && window.FB) {
      window.FB.XFBML.parse();
    }
  };

  return (
    <div className="w-full">
      <div id="fb-root" />
      <Script
        src="https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v21.0"
        strategy="lazyOnload"
        onLoad={onSdkLoad}
      />
      {!pluginLikelyBlocked && (
        <div ref={wrapRef} className="min-h-[120px] w-full overflow-hidden">
          <div
            className="fb-page mx-auto max-w-[500px]"
            data-href={pageUrl}
            data-tabs="timeline"
            data-width="500"
            data-height="520"
            data-small-header="true"
            data-adapt-container-width="true"
            data-hide-cover="false"
            data-show-facepile="true"
          />
        </div>
      )}
      {pluginLikelyBlocked && (
        <div className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-5 py-8 text-center">
          <p className="text-sm font-medium text-stone-800">
            Il riquadro Facebook non è visibile (blocco annunci o privacy del
            browser).
          </p>
          <Link
            href={FACEBOOK_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full bg-[#1877F2] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#166fe5]"
          >
            Apri la pagina su Facebook
          </Link>
        </div>
      )}
    </div>
  );
}
