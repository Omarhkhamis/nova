import "server-only";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { query, tryQuery } from "@/lib/db";

export const blogCategories = ["Planning", "Maintenance", "Automation", "Supply Chain", "Marine", "Cooling"];
export const blogStatuses = ["Published", "Scheduled", "Draft"];
export const iconOptions = ["Cpu", "Settings2", "Ship", "Snowflake", "Gauge", "PlugZap", "Factory", "Zap", "Droplets", "Utensils", "FlaskConical", "Car", "Building2"];

export type DashboardData = {
  settings: Record<string, unknown>;
  hero: {
    eyebrow: string;
    title: string;
    headline: string;
    description: string;
    image: string;
    primary_cta_label: string;
    primary_cta_href: string;
    secondary_cta_label: string;
    secondary_cta_href: string;
  } | null;
  sections: Array<{ section_key: string; eyebrow: string; title: string; description: string }>;
  partners: Array<{ id: number; name: string; sector: string; logo: string; logo_alt: string }>;
  certifications: Array<{ id: number; image: string; code: string; title: string; description: string }>;
  gallery: Array<{ id: number; image: string; alt: string }>;
  blogs: Array<{
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    status: string;
    cover: string;
    cover_alt: string;
    published_at: string;
    reading_minutes: number;
    author: string;
    seo_title: string;
    seo_description: string;
    canonical: string;
    seo_keywords: string[];
    content: unknown;
  }>;
  aboutCards: Array<{ id: number; title: string; description: string }>;
  services: Array<{ id: number; title: string; lead: string; icon: string; points: string[] }>;
  products: Array<{ id: string; name: string; category: string; description: string; image: string; alt: string; specs: string[] }>;
  industries: Array<{ id: number; name: string; icon: string }>;
  footerLinks: Array<{ id: number; label: string; href: string; is_visible: boolean }>;
};

export async function getDashboardData(): Promise<DashboardData> {
  noStore();

  const [
    settingsRows,
    heroRows,
    sections,
    partners,
    certifications,
    gallery,
    blogs,
    aboutCards,
    services,
    products,
    industries,
    footerLinks,
  ] = await Promise.all([
    tryQuery<{ key: string; value: Record<string, unknown> }>("SELECT key, value FROM settings ORDER BY key"),
    tryQuery<NonNullable<DashboardData["hero"]>>("SELECT eyebrow, title, headline, description, image, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href FROM hero WHERE id=1"),
    tryQuery<DashboardData["sections"][number]>("SELECT * FROM section_content ORDER BY section_key"),
    tryQuery<DashboardData["partners"][number]>("SELECT id, name, sector, logo, logo_alt FROM partners ORDER BY sort_order, id"),
    tryQuery<DashboardData["certifications"][number]>("SELECT id, image, code, title, description FROM certifications ORDER BY sort_order, id"),
    tryQuery<DashboardData["gallery"][number]>("SELECT id, image, alt FROM gallery_images ORDER BY sort_order, id"),
    tryQuery<DashboardData["blogs"][number]>("SELECT id, slug, title, excerpt, category, tags, status, cover, cover_alt, published_at::text, reading_minutes, author, seo_title, seo_description, canonical, seo_keywords, content FROM blogs ORDER BY published_at DESC, id DESC"),
    tryQuery<DashboardData["aboutCards"][number]>("SELECT id, title, description FROM about_cards ORDER BY sort_order, id"),
    tryQuery<DashboardData["services"][number]>("SELECT id, title, lead, icon, points FROM services ORDER BY sort_order, id"),
    tryQuery<DashboardData["products"][number]>("SELECT id, name, category, description, image, alt, specs FROM catalog_products ORDER BY sort_order, name"),
    tryQuery<DashboardData["industries"][number]>("SELECT id, name, icon FROM industries ORDER BY sort_order, id"),
    tryQuery<DashboardData["footerLinks"][number]>("SELECT id, label, href, is_visible FROM footer_links ORDER BY sort_order, id"),
  ]);

  return {
    settings: Object.fromEntries(settingsRows.map((row) => [row.key, row.value])),
    hero: heroRows[0] ?? null,
    sections,
    partners,
    certifications,
    gallery,
    blogs,
    aboutCards,
    services,
    products,
    industries,
    footerLinks,
  };
}

export async function mutate(sql: string, params: unknown[] = []) {
  await query(sql, params);
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/blog");
  revalidatePath("/dashboard");
}

export function listFromText(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
