import type { Metadata } from "next";
import "./globals.css";
import { absoluteUrl, defaultSeoSettings, getSiteAndSeoSettings } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { site, seo } = await getSiteAndSeoSettings();
  const configuredBaseUrl = seo.siteUrl || defaultSeoSettings.siteUrl;
  const baseUrl = /^https?:\/\//i.test(configuredBaseUrl)
    ? configuredBaseUrl
    : defaultSeoSettings.siteUrl;
  const defaultTitle = seo.defaultTitle || defaultSeoSettings.defaultTitle;
  const titleTemplate = seo.titleTemplate || `%s | ${seo.siteName || defaultSeoSettings.siteName}`;
  const description = seo.description || defaultSeoSettings.description;
  const canonical = absoluteUrl(baseUrl, seo.canonicalPath || defaultSeoSettings.canonicalPath);
  const openGraphTitle = seo.openGraphTitle || defaultTitle;
  const openGraphDescription = seo.openGraphDescription || description;
  const openGraphImage = seo.openGraphImage || site.logoImage;
  const twitterTitle = seo.twitterTitle || openGraphTitle;
  const twitterDescription = seo.twitterDescription || openGraphDescription;
  const twitterImage = seo.twitterImage || openGraphImage;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description,
    keywords: seo.keywords?.length ? seo.keywords : defaultSeoSettings.keywords,
    alternates: {
      canonical,
    },
    icons: site.favicon ? { icon: site.favicon } : undefined,
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: canonical,
      siteName: seo.siteName || defaultSeoSettings.siteName,
      locale: seo.locale || defaultSeoSettings.locale,
      type: "website",
      images: openGraphImage ? [{ url: openGraphImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
    robots: {
      index: seo.robotsIndex ?? defaultSeoSettings.robotsIndex,
      follow: seo.robotsFollow ?? defaultSeoSettings.robotsFollow,
    },
    verification: seo.googleSiteVerification
      ? {
          google: seo.googleSiteVerification,
        }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-theme="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
