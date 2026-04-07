"use client";

import Script from "next/script";
import { useCallback } from "react";

declare global {
  interface Window {
    FB?: { XFBML: { parse: (el?: Element | HTMLElement) => void } };
  }
}

type Props = {
  pageUrl: string;
};

export function FacebookPageEmbed({ pageUrl }: Props) {
  const onLoad = useCallback(() => {
    if (typeof window !== "undefined" && window.FB) {
      window.FB.XFBML.parse();
    }
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div id="fb-root" />
      <Script
        src="https://connect.facebook.net/it_IT/sdk.js#xfbml=1&version=v21.0"
        strategy="lazyOnload"
        onLoad={onLoad}
      />
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
  );
}
