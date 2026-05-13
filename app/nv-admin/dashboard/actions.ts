"use server";

import { revalidatePath } from "next/cache";
import { hashPassword, requireAdmin } from "@/lib/auth";
import { listFromText, mutate } from "@/lib/cms";
import { query } from "@/lib/db";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateSectionContent(formData: FormData) {
  await mutate(
    `UPDATE section_content SET eyebrow=$2, title=$3, description=$4 WHERE section_key=$1`,
    [str(formData, "section_key"), str(formData, "eyebrow"), str(formData, "title"), str(formData, "description")],
  );
}

export async function updateHero(formData: FormData) {
  await mutate(
    `UPDATE hero SET eyebrow=$1, title=$2, headline=$3, description=$4, image=$5, primary_cta_label=$6, primary_cta_href=$7, secondary_cta_label=$8, secondary_cta_href=$9 WHERE id=1`,
    ["eyebrow", "title", "headline", "description", "image", "primary_cta_label", "primary_cta_href", "secondary_cta_label", "secondary_cta_href"].map((key) => str(formData, key)),
  );
}

export async function addPartner(formData: FormData) {
  await mutate(
    `INSERT INTO partners (name, sector, logo, logo_alt, sort_order) VALUES ($1,$2,$3,$4,999)`,
    [str(formData, "name"), str(formData, "sector"), str(formData, "logo"), str(formData, "logo_alt")],
  );
}

export async function deletePartner(formData: FormData) {
  await mutate(`DELETE FROM partners WHERE id=$1`, [str(formData, "id")]);
}

export async function updatePartner(formData: FormData) {
  await mutate(`UPDATE partners SET name=$2, sector=$3, logo=$4, logo_alt=$5 WHERE id=$1`, [str(formData, "id"), str(formData, "name"), str(formData, "sector"), str(formData, "logo"), str(formData, "logo_alt")]);
}

export async function addCertification(formData: FormData) {
  await mutate(
    `INSERT INTO certifications (image, code, title, description, sort_order) VALUES ($1,$2,$3,$4,999)`,
    [str(formData, "image"), str(formData, "code"), str(formData, "title"), str(formData, "description")],
  );
}

export async function deleteCertification(formData: FormData) {
  await mutate(`DELETE FROM certifications WHERE id=$1`, [str(formData, "id")]);
}

export async function updateCertification(formData: FormData) {
  await mutate(`UPDATE certifications SET image=$2, code=$3, title=$4, description=$5 WHERE id=$1`, [str(formData, "id"), str(formData, "image"), str(formData, "code"), str(formData, "title"), str(formData, "description")]);
}

export async function addGalleryImage(formData: FormData) {
  await mutate(
    `INSERT INTO gallery_images (image, alt, sort_order)
     SELECT $1,$2,999 WHERE (SELECT COUNT(*) FROM gallery_images) < 6`,
    [str(formData, "image"), str(formData, "alt")],
  );
}

export async function deleteGalleryImage(formData: FormData) {
  await mutate(`DELETE FROM gallery_images WHERE id=$1`, [str(formData, "id")]);
}

export async function updateGalleryImage(formData: FormData) {
  await mutate(`UPDATE gallery_images SET image=$2, alt=$3 WHERE id=$1`, [str(formData, "id"), str(formData, "image"), str(formData, "alt")]);
}

export async function addBlog(formData: FormData) {
  const slug = str(formData, "slug");
  const content = str(formData, "content_json") || JSON.stringify([str(formData, "plain_content")]);

  await mutate(
    `INSERT INTO blogs (slug, title, excerpt, category, tags, published_at, reading_minutes, author, cover, cover_alt, status, seo_title, seo_description, canonical, seo_keywords, content)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
    [
      slug,
      str(formData, "title"),
      str(formData, "excerpt"),
      str(formData, "category"),
      JSON.stringify(listFromText(formData.get("tags"))),
      str(formData, "published_at"),
      Number(str(formData, "reading_minutes") || 3),
      str(formData, "author"),
      str(formData, "cover"),
      str(formData, "cover_alt"),
      str(formData, "status"),
      str(formData, "seo_title"),
      str(formData, "seo_description"),
      str(formData, "canonical") || `https://novatech-nas.ae/blog/${slug}`,
      JSON.stringify(listFromText(formData.get("seo_keywords"))),
      content,
    ],
  );
}

export async function updateBlog(formData: FormData) {
  const slug = str(formData, "slug");
  const content = str(formData, "content_json") || JSON.stringify([str(formData, "plain_content")]);

  await mutate(
    `UPDATE blogs
     SET slug=$2, title=$3, excerpt=$4, category=$5, tags=$6, published_at=$7, reading_minutes=$8, author=$9,
         cover=$10, cover_alt=$11, status=$12, seo_title=$13, seo_description=$14, canonical=$15, seo_keywords=$16, content=$17
     WHERE id=$1`,
    [
      str(formData, "id"),
      slug,
      str(formData, "title"),
      str(formData, "excerpt"),
      str(formData, "category"),
      JSON.stringify(listFromText(formData.get("tags"))),
      str(formData, "published_at"),
      Number(str(formData, "reading_minutes") || 3),
      str(formData, "author"),
      str(formData, "cover"),
      str(formData, "cover_alt"),
      str(formData, "status"),
      str(formData, "seo_title"),
      str(formData, "seo_description"),
      str(formData, "canonical") || `https://novatech-nas.ae/blog/${slug}`,
      JSON.stringify(listFromText(formData.get("seo_keywords"))),
      content,
    ],
  );
}

export async function deleteBlog(formData: FormData) {
  await mutate(`DELETE FROM blogs WHERE id=$1`, [str(formData, "id")]);
}

export async function addAboutCard(formData: FormData) {
  await mutate(`INSERT INTO about_cards (title, description, sort_order) VALUES ($1,$2,999)`, [str(formData, "title"), str(formData, "description")]);
}

export async function deleteAboutCard(formData: FormData) {
  await mutate(`DELETE FROM about_cards WHERE id=$1`, [str(formData, "id")]);
}

export async function updateAboutCard(formData: FormData) {
  await mutate(`UPDATE about_cards SET title=$2, description=$3 WHERE id=$1`, [str(formData, "id"), str(formData, "title"), str(formData, "description")]);
}

export async function addService(formData: FormData) {
  await mutate(
    `INSERT INTO services (title, lead, icon, points, sort_order) VALUES ($1,$2,$3,$4,999)`,
    [str(formData, "title"), str(formData, "lead"), str(formData, "icon"), JSON.stringify(listFromText(formData.get("points")))],
  );
}

export async function deleteService(formData: FormData) {
  await mutate(`DELETE FROM services WHERE id=$1`, [str(formData, "id")]);
}

export async function updateService(formData: FormData) {
  await mutate(`UPDATE services SET title=$2, lead=$3, icon=$4, points=$5 WHERE id=$1`, [str(formData, "id"), str(formData, "title"), str(formData, "lead"), str(formData, "icon"), JSON.stringify(listFromText(formData.get("points")))]);
}

export async function addProduct(formData: FormData) {
  await mutate(
    `INSERT INTO catalog_products (id, name, category, description, image, alt, specs, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,999)`,
    [str(formData, "id"), str(formData, "name"), str(formData, "category"), str(formData, "description"), str(formData, "image"), str(formData, "alt"), JSON.stringify(listFromText(formData.get("specs")))],
  );
}

export async function deleteProduct(formData: FormData) {
  await mutate(`DELETE FROM catalog_products WHERE id=$1`, [str(formData, "id")]);
}

export async function updateProduct(formData: FormData) {
  await mutate(`UPDATE catalog_products SET id=$2, name=$3, category=$4, description=$5, image=$6, alt=$7, specs=$8 WHERE id=$1`, [str(formData, "original_id"), str(formData, "id"), str(formData, "name"), str(formData, "category"), str(formData, "description"), str(formData, "image"), str(formData, "alt"), JSON.stringify(listFromText(formData.get("specs")))]);
}

export async function addIndustry(formData: FormData) {
  await mutate(`INSERT INTO industries (name, icon, sort_order) VALUES ($1,$2,999)`, [str(formData, "name"), str(formData, "icon")]);
}

export async function deleteIndustry(formData: FormData) {
  await mutate(`DELETE FROM industries WHERE id=$1`, [str(formData, "id")]);
}

export async function updateIndustry(formData: FormData) {
  await mutate(`UPDATE industries SET name=$2, icon=$3 WHERE id=$1`, [str(formData, "id"), str(formData, "name"), str(formData, "icon")]);
}

export async function updateFooterLink(formData: FormData) {
  await mutate(`UPDATE footer_links SET label=$2, href=$3, is_visible=$4 WHERE id=$1`, [str(formData, "id"), str(formData, "label"), str(formData, "href"), formData.get("is_visible") === "on"]);
}

export async function addFooterLink(formData: FormData) {
  await mutate(`INSERT INTO footer_links (label, href, is_visible, sort_order) VALUES ($1,$2,TRUE,999)`, [str(formData, "label"), str(formData, "href")]);
}

export async function updateSettings(formData: FormData) {
  await mutate(
    `INSERT INTO settings (key, value) VALUES ('site', $1)
     ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`,
    [JSON.stringify({
      logoText: str(formData, "logoText"),
      brandName: str(formData, "brandName"),
      brandSubtitle: str(formData, "brandSubtitle"),
      favicon: str(formData, "favicon"),
      phone: str(formData, "phone"),
      whatsapp: str(formData, "whatsapp"),
      email: str(formData, "email"),
      address: str(formData, "address"),
      socialLinkedin: str(formData, "socialLinkedin"),
      socialInstagram: str(formData, "socialInstagram"),
      socialFacebook: str(formData, "socialFacebook"),
    })],
  );
}

export async function addAdmin(formData: FormData) {
  await requireAdmin();

  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");

  if (!email || !password) {
    return;
  }

  await query(
    `INSERT INTO admins (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    [str(formData, "name"), email, await hashPassword(password)],
  );
  revalidatePath("/nv-admin/dashboard");
}

export async function updateAdmin(formData: FormData) {
  await requireAdmin();

  const id = Number(str(formData, "id"));
  const email = str(formData, "email").toLowerCase();
  const password = str(formData, "password");

  if (!Number.isInteger(id) || !email) {
    return;
  }

  if (password) {
    await query(
      `UPDATE admins
       SET name=$2, email=$3, password_hash=$4, updated_at=NOW()
       WHERE id=$1
         AND NOT EXISTS (SELECT 1 FROM admins WHERE email=$3 AND id <> $1)`,
      [id, str(formData, "name"), email, await hashPassword(password)],
    );
  } else {
    await query(
      `UPDATE admins
       SET name=$2, email=$3, updated_at=NOW()
       WHERE id=$1
         AND NOT EXISTS (SELECT 1 FROM admins WHERE email=$3 AND id <> $1)`,
      [id, str(formData, "name"), email],
    );
  }

  revalidatePath("/nv-admin/dashboard");
}

export async function deleteAdmin(formData: FormData) {
  const currentAdmin = await requireAdmin();
  const id = Number(str(formData, "id"));

  if (!Number.isInteger(id) || id === currentAdmin.id) {
    return;
  }

  await query(
    `DELETE FROM admins
     WHERE id=$1 AND (SELECT COUNT(*) FROM admins) > 1`,
    [id],
  );
  revalidatePath("/nv-admin/dashboard");
}
