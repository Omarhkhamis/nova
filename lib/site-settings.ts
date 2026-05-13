import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { tryQuery } from "@/lib/db";
import { siteName, siteUrl } from "@/lib/content";

export type SiteSettings = {
  logoText?: string;
  logoImage?: string;
  logoAlt?: string;
  brandName?: string;
  brandSubtitle?: string;
  favicon?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  socialLinkedin?: string;
  socialInstagram?: string;
  socialFacebook?: string;
};

export type SeoSettings = {
  siteName?: string;
  siteUrl?: string;
  defaultTitle?: string;
  titleTemplate?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  googleSiteVerification?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  locale?: string;
};

export const defaultSeoSettings: Required<
  Pick<SeoSettings, "siteName" | "siteUrl" | "defaultTitle" | "titleTemplate" | "description" | "canonicalPath" | "locale">
> & {
  keywords: string[];
  robotsIndex: boolean;
  robotsFollow: boolean;
} = {
  siteName,
  siteUrl,
  defaultTitle: `${siteName} | Industrial & Engineering Services`,
  titleTemplate: `%s | ${siteName}`,
  description:
    "Industrial engineering, automation, marine service, sourcing, and operational support for modern facilities.",
  keywords: ["industrial engineering", "automation", "marine service", "industrial supply", "Dubai"],
  canonicalPath: "/",
  locale: "en_AE",
  robotsIndex: true,
  robotsFollow: true,
};

export async function getSiteAndSeoSettings() {
  noStore();

  const rows = await tryQuery<{ key: string; value: Record<string, unknown> }>(
    "SELECT key, value FROM settings WHERE key IN ('site', 'seo')",
  );
  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    site: (settings.site ?? {}) as SiteSettings,
    seo: (settings.seo ?? {}) as SeoSettings,
  };
}

export function absoluteUrl(baseUrl: string, pathOrUrl = "/") {
  try {
    return new URL(pathOrUrl, baseUrl).toString();
  } catch {
    return baseUrl;
  }
}
