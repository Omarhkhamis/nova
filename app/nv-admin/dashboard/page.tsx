import Link from "next/link";
import { ChevronDown, Home, LogOut, Plus, Trash2 } from "lucide-react";
import { DashboardBlogs } from "@/components/dashboard-blogs";
import { DashboardEnhancer } from "@/components/dashboard-enhancer";
import { DashboardIcon, IconPicker } from "@/components/icon-picker";
import { MediaManager } from "@/components/media-manager";
import { MediaPicker } from "@/components/media-picker";
import { blogCategories, blogStatuses, getDashboardData } from "@/lib/cms";
import { listAdmins, requireAdmin } from "@/lib/auth";
import type { AdminListItem } from "@/lib/auth";
import { listPublicMedia } from "@/lib/media";
import { defaultSeoSettings } from "@/lib/site-settings";
import {
  addAdmin,
  addAboutCard,
  addBlog,
  addCertification,
  addFooterLink,
  addGalleryImage,
  addIndustry,
  addPartner,
  addProduct,
  addService,
  deleteAdmin,
  deleteAboutCard,
  deleteBlog,
  deleteCertification,
  deleteGalleryImage,
  deleteIndustry,
  deletePartner,
  deleteProduct,
  deleteService,
  updateAboutCard,
  updateAdmin,
  updateCertification,
  updateFooterLink,
  updateGalleryImage,
  updateHero,
  updateIndustry,
  updateBlog,
  updatePartner,
  updateProduct,
  updateSectionContent,
  updateService,
  updateSeoSettings,
  updateSettings,
} from "./actions";
import { logoutAdmin } from "../actions";

export const dynamic = "force-dynamic";

const sectionSidebarItems = [
  ["Hero", "#hero"],
  ["Partners", "#partners"],
  ["Certifications", "#certifications"],
  ["Gallery", "#gallery"],
  ["Blogs", "#blogs"],
  ["Admins", "#admins"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Catalog", "#catalog"],
  ["Industries", "#industries"],
  ["Footer", "#footer"],
];

function Field({ name, label, defaultValue = "", type = "text" }: { name: string; label: string; defaultValue?: string; type?: string }) {
  return (
    <label className="dashboard-field">
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} />
    </label>
  );
}

function TextArea({ name, label, defaultValue = "", rows = 3 }: { name: string; label: string; defaultValue?: string; rows?: number }) {
  return (
    <label className="dashboard-field dashboard-field--wide">
      <span>{label}</span>
      <textarea name={name} rows={rows} defaultValue={defaultValue} />
    </label>
  );
}

function DeleteButton({ action, id }: { action: (formData: FormData) => Promise<void>; id: string | number }) {
  return (
    <form action={action} data-dashboard-form data-confirm-delete="true">
      <input type="hidden" name="id" value={id} />
      <button className="icon-button" type="submit" aria-label="Delete">
        <Trash2 size={16} />
      </button>
    </form>
  );
}

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [data, media, admins] = await Promise.all([getDashboardData(), listPublicMedia(), listAdmins()]);
  const site = (data.settings.site ?? {}) as Record<string, string>;
  const seo = (data.settings.seo ?? {}) as Record<string, string | boolean | string[]>;
  const seoKeywords = Array.isArray(seo.keywords) ? seo.keywords.join("\n") : String(seo.keywords ?? "");

  return (
    <main className="dashboard-shell">
      <DashboardEnhancer />
      <aside className="dashboard-sidebar">
        <Link className="dashboard-sidebar__brand" href="/">
          <span>NAS</span>
          <strong>Dashboard</strong>
        </Link>
        <nav>
          <a href="#content">Content</a>
          <details className="dashboard-sidebar__group" open>
            <summary>
              <span>Sections</span>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <div>
              {sectionSidebarItems.map(([label, href]) => (
                <a href={href} key={href}>{label}</a>
              ))}
            </div>
          </details>
          <a href="#media">Media</a>
          <a href="#seo">SEO</a>
          <a href="#settings">Settings</a>
        </nav>
      </aside>

      <section className="dashboard-main">
        <div className="dashboard-top">
          <div>
            <p>PostgreSQL CMS</p>
            <h1>Site dashboard</h1>
          </div>
          <div className="dashboard-top__actions">
            <span className="dashboard-status">{admin.email}</span>
            <Link href="/" className="dashboard-button"><Home size={16} /> View site</Link>
            <form action={logoutAdmin}>
              <button className="dashboard-button" type="submit"><LogOut size={16} /> Logout</button>
            </form>
          </div>
        </div>

        <section className="dashboard-panel" id="content">
          <h2>Content</h2>
          <p>Section eyebrows, titles, and descriptions.</p>
          <div className="dashboard-stack">
            {data.sections.map((section) => (
              <details className="dashboard-content-card" key={section.section_key}>
                <summary>
                  <span>{section.section_key}</span>
                  <strong>{section.title || "Untitled section"}</strong>
                  <ChevronDown size={16} aria-hidden="true" />
                </summary>
                <form className="dashboard-form" action={updateSectionContent} data-dashboard-form>
                  <input type="hidden" name="section_key" value={section.section_key} />
                  <Field name="eyebrow" label="Eyebrow" defaultValue={section.eyebrow} />
                  <Field name="title" label="Title" defaultValue={section.title} />
                  <TextArea name="description" label="Description" defaultValue={section.description} />
                  <button className="dashboard-button" type="submit">Save</button>
                </form>
              </details>
            ))}
          </div>
        </section>

        <section className="dashboard-panel" id="hero">
          <h2>Hero</h2>
          <form className="dashboard-form" action={updateHero} data-dashboard-form>
            <Field name="eyebrow" label="Eyebrow" defaultValue={data.hero?.eyebrow} />
            <Field name="title" label="Title" defaultValue={data.hero?.title} />
            <Field name="headline" label="Headline" defaultValue={data.hero?.headline} />
            <TextArea name="description" label="Description" defaultValue={data.hero?.description} />
            <MediaPicker name="image" label="Image" defaultValue={data.hero?.image} initialMedia={media} />
            <Field name="primary_cta_label" label="Primary CTA label" defaultValue={data.hero?.primary_cta_label} />
            <Field name="primary_cta_href" label="Primary CTA href" defaultValue={data.hero?.primary_cta_href} />
            <Field name="secondary_cta_label" label="Secondary CTA label" defaultValue={data.hero?.secondary_cta_label} />
            <Field name="secondary_cta_href" label="Secondary CTA href" defaultValue={data.hero?.secondary_cta_href} />
            <button className="dashboard-button" type="submit">Save hero</button>
          </form>
        </section>

        <CrudPanel id="partners" title="Partners" action={addPartner} fields={[
          ["name", "Logo title"], ["sector", "Partner title"], ["logo", "Logo image", "media"], ["logo_alt", "Logo alt"],
        ]} items={data.partners.map((item) => ({ ...item, titleLabel: item.name, subtitle: item.sector }))} deleteAction={deletePartner} updateAction={updatePartner} media={media} />

        <CrudPanel id="certifications" title="Certifications" action={addCertification} fields={[
          ["image", "Certificate image", "media"], ["code", "Short code"], ["title", "Certificate title"], ["description", "Description"],
        ]} items={data.certifications.map((item) => ({ ...item, titleLabel: `${item.code} · ${item.title}`, subtitle: item.description }))} deleteAction={deleteCertification} updateAction={updateCertification} media={media} />

        <CrudPanel id="gallery" title="Gallery - max 6 images" action={addGalleryImage} fields={[
          ["image", "Image", "media"], ["alt", "Alt text"],
        ]} items={data.gallery.map((item) => ({ ...item, titleLabel: item.alt, subtitle: item.image }))} deleteAction={deleteGalleryImage} updateAction={updateGalleryImage} media={media} />

        <DashboardBlogs
          blogs={data.blogs}
          media={media}
          categories={blogCategories}
          statuses={blogStatuses}
          addAction={addBlog}
          updateAction={updateBlog}
          deleteAction={deleteBlog}
        />

        <AdminPanel admins={admins} currentAdminId={admin.id} />

        <CrudPanel id="about" title="About cards" action={addAboutCard} fields={[["title", "Title"], ["description", "Description"]]} items={data.aboutCards.map((item) => ({ ...item, titleLabel: item.title, subtitle: item.description }))} deleteAction={deleteAboutCard} updateAction={updateAboutCard} media={media} />
        <CrudPanel id="services" title="Our services" action={addService} fields={[["title", "Title"], ["lead", "Lead"], ["icon", "Icon", "icon"], ["points", "Requirements - one per line", "textarea"]]} items={data.services.map((item) => ({ ...item, titleLabel: item.title, subtitle: item.lead }))} deleteAction={deleteService} updateAction={updateService} media={media} />
        <CrudPanel id="catalog" title="Catalog products" action={addProduct} fields={[["id", "Product ID"], ["name", "Name"], ["category", "Category"], ["description", "Description"], ["image", "Image", "media"], ["alt", "Alt"], ["specs", "Specs - one per line", "textarea"]]} items={data.products.map((item) => ({ ...item, titleLabel: item.name, subtitle: item.category }))} deleteAction={deleteProduct} updateAction={updateProduct} media={media} />
        <CrudPanel id="industries" title="Industries We Serve" action={addIndustry} fields={[["name", "Name"], ["icon", "Icon", "icon"]]} items={data.industries.map((item) => ({ ...item, titleLabel: item.name, subtitle: item.icon }))} deleteAction={deleteIndustry} updateAction={updateIndustry} media={media} />

        <section className="dashboard-panel" id="footer">
          <h2>Footer</h2>
          <form className="dashboard-form" action={addFooterLink} data-dashboard-form>
            <Field name="label" label="Quick link label" />
            <Field name="href" label="Href" />
            <button className="dashboard-button" type="submit">Add link</button>
          </form>
          <div className="dashboard-list">
            {data.footerLinks.map((item) => (
              <form action={updateFooterLink} className="dashboard-list__item" key={item.id} data-dashboard-form>
                <input type="hidden" name="id" value={item.id} />
                <Field name="label" label="Label" defaultValue={item.label} />
                <Field name="href" label="Href" defaultValue={item.href} />
                <label><input type="checkbox" name="is_visible" defaultChecked={item.is_visible} /> Visible</label>
                <button className="dashboard-button" type="submit">Save</button>
              </form>
            ))}
          </div>
        </section>

        <MediaManager initialMedia={media} />

        <section className="dashboard-panel" id="seo">
          <h2>SEO</h2>
          <p>Basic metadata used by the website, search engines, and social sharing previews.</p>
          <form className="dashboard-form" action={updateSeoSettings} data-dashboard-form>
            <Field name="siteName" label="Site name" defaultValue={String(seo.siteName ?? defaultSeoSettings.siteName)} />
            <Field name="siteUrl" label="Site URL" defaultValue={String(seo.siteUrl ?? defaultSeoSettings.siteUrl)} />
            <Field name="defaultTitle" label="Default meta title" defaultValue={String(seo.defaultTitle ?? defaultSeoSettings.defaultTitle)} />
            <Field name="titleTemplate" label="Title template" defaultValue={String(seo.titleTemplate ?? defaultSeoSettings.titleTemplate)} />
            <TextArea name="description" label="Meta description" defaultValue={String(seo.description ?? defaultSeoSettings.description)} rows={4} />
            <TextArea name="keywords" label="Keywords - one per line" defaultValue={seoKeywords || defaultSeoSettings.keywords.join("\n")} rows={5} />
            <Field name="canonicalPath" label="Canonical path" defaultValue={String(seo.canonicalPath ?? defaultSeoSettings.canonicalPath)} />
            <Field name="locale" label="Open Graph locale" defaultValue={String(seo.locale ?? defaultSeoSettings.locale)} />
            <Field name="openGraphTitle" label="Open Graph title" defaultValue={String(seo.openGraphTitle ?? "")} />
            <TextArea name="openGraphDescription" label="Open Graph description" defaultValue={String(seo.openGraphDescription ?? "")} rows={3} />
            <MediaPicker name="openGraphImage" label="Open Graph image" defaultValue={String(seo.openGraphImage ?? "")} initialMedia={media} />
            <Field name="twitterTitle" label="Twitter title" defaultValue={String(seo.twitterTitle ?? "")} />
            <TextArea name="twitterDescription" label="Twitter description" defaultValue={String(seo.twitterDescription ?? "")} rows={3} />
            <MediaPicker name="twitterImage" label="Twitter image" defaultValue={String(seo.twitterImage ?? "")} initialMedia={media} />
            <Field name="googleSiteVerification" label="Google site verification" defaultValue={String(seo.googleSiteVerification ?? "")} />
            <label className="dashboard-checkbox">
              <input type="checkbox" name="robotsIndex" defaultChecked={seo.robotsIndex !== false} />
              <span>Allow indexing</span>
            </label>
            <label className="dashboard-checkbox">
              <input type="checkbox" name="robotsFollow" defaultChecked={seo.robotsFollow !== false} />
              <span>Allow following links</span>
            </label>
            <button className="dashboard-button" type="submit">Save SEO</button>
          </form>
        </section>

        <section className="dashboard-panel" id="settings">
          <h2>Settings</h2>
          <form className="dashboard-form" action={updateSettings} data-dashboard-form>
            <Field name="logoText" label="Main logo text" defaultValue={site.logoText} />
            <MediaPicker name="logoImage" label="Logo image" defaultValue={site.logoImage} initialMedia={media} />
            <Field name="logoAlt" label="Logo alt text" defaultValue={site.logoAlt} />
            <Field name="brandName" label="Brand name" defaultValue={site.brandName} />
            <Field name="brandSubtitle" label="Brand subtitle" defaultValue={site.brandSubtitle} />
            <MediaPicker name="favicon" label="Favicon" defaultValue={site.favicon} initialMedia={media} />
            <Field name="phone" label="Phone" defaultValue={site.phone} />
            <Field name="whatsapp" label="WhatsApp" defaultValue={site.whatsapp} />
            <Field name="email" label="Email" defaultValue={site.email} />
            <Field name="address" label="Address" defaultValue={site.address} />
            <Field name="socialLinkedin" label="LinkedIn URL" defaultValue={site.socialLinkedin} />
            <Field name="socialInstagram" label="Instagram URL" defaultValue={site.socialInstagram} />
            <Field name="socialFacebook" label="Facebook URL" defaultValue={site.socialFacebook} />
            <button className="dashboard-button" type="submit">Save settings</button>
          </form>
        </section>
      </section>
    </main>
  );
}

function AdminPanel({ admins, currentAdminId }: { admins: AdminListItem[]; currentAdminId: number }) {
  return (
    <section className="dashboard-panel" id="admins">
      <div className="dashboard-panel__head">
        <div>
          <h2>Admins</h2>
          <p>Manage dashboard users and passwords.</p>
        </div>
      </div>

      <form className="dashboard-form" action={addAdmin} data-dashboard-form data-toast-message="Admin added">
        <Field name="name" label="Name" />
        <Field name="email" label="Email" type="email" />
        <Field name="password" label="Password" type="password" />
        <button className="dashboard-button" type="submit"><Plus size={16} /> Add admin</button>
      </form>

      <div className="dashboard-list">
        {admins.map((item) => (
          <details className="dashboard-content-card" key={item.id}>
            <summary>
              <span>{String(item.id)}</span>
              <strong>{item.email}</strong>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <form className="dashboard-form" action={updateAdmin} data-dashboard-form data-toast-message="Admin saved">
              <input type="hidden" name="id" value={item.id} />
              <Field name="name" label="Name" defaultValue={item.name} />
              <Field name="email" label="Email" type="email" defaultValue={item.email} />
              <Field name="password" label="New password" type="password" />
              <div className="dashboard-form__actions">
                <button className="dashboard-button" type="submit">Save</button>
              </div>
            </form>
            {item.id !== currentAdminId ? (
              <div className="dashboard-delete-row">
                <DeleteButton action={deleteAdmin} id={item.id} />
              </div>
            ) : null}
          </details>
        ))}
      </div>
    </section>
  );
}

function CrudPanel({
  id,
  title,
  action,
  fields,
  items,
  deleteAction,
  updateAction,
  media,
}: {
  id: string;
  title: string;
  action: (formData: FormData) => Promise<void>;
  fields: Array<[string, string, ("textarea" | "media" | "icon")?]>;
  items: Array<Record<string, unknown> & { id: string | number; titleLabel?: string; title?: string; subtitle?: string }>;
  deleteAction: (formData: FormData) => Promise<void>;
  updateAction: (formData: FormData) => Promise<void>;
  media: string[];
}) {
  return (
    <section className="dashboard-panel" id={id}>
      <h2>{title}</h2>
      <form className="dashboard-form" action={action} data-dashboard-form>
        {fields.map(([name, label, type]) => type === "textarea"
          ? <TextArea key={name} name={name} label={label} />
          : type === "media"
            ? <MediaPicker key={name} name={name} label={label} initialMedia={media} />
          : type === "icon"
            ? <IconPicker key={name} name={name} label={label} />
          : <Field key={name} name={name} label={label} />)}
        <button className="dashboard-button" type="submit"><Plus size={16} /> Add</button>
      </form>
      <div className="dashboard-list">
        {items.map((item) => (
          <details className="dashboard-content-card" key={item.id}>
            <summary>
              <span>{String(item.id)}</span>
              {"icon" in item ? <DashboardIcon name={String(item.icon)} /> : null}
              <strong>{"titleLabel" in item ? String(item.titleLabel) : String(item.title)}</strong>
              <ChevronDown size={16} aria-hidden="true" />
            </summary>
            <form className="dashboard-form" action={updateAction} data-dashboard-form>
              <input type="hidden" name="id" value={item.id} />
              {"id" in item && typeof item.id === "string" ? <input type="hidden" name="original_id" value={item.id} /> : null}
              {fields.map(([name, label, type]) => {
                const rawValue = (item as Record<string, unknown>)[name];
                const value = Array.isArray(rawValue) ? rawValue.join("\n") : String(rawValue ?? "");

                if (type === "textarea") {
                  return <TextArea key={name} name={name} label={label} defaultValue={value} />;
                }

                if (type === "media") {
                  return <MediaPicker key={name} name={name} label={label} defaultValue={value} initialMedia={media} />;
                }

                if (type === "icon") {
                  return <IconPicker key={name} name={name} label={label} defaultValue={value} />;
                }

                return <Field key={name} name={name} label={label} defaultValue={value} />;
              })}
              <div className="dashboard-form__actions">
                <button className="dashboard-button" type="submit">Save</button>
                <DeleteButton action={deleteAction} id={item.id} />
              </div>
            </form>
          </details>
        ))}
      </div>
    </section>
  );
}
