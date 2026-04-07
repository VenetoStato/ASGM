import { SiteHeaderNav } from "@/components/site-header-nav";

type Props = {
  logoUrl?: string | null;
};

export function SiteHeader({ logoUrl }: Props) {
  return <SiteHeaderNav logoUrl={logoUrl} />;
}
