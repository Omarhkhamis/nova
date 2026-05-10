"use client";

import Image from "next/image";
import { useState } from "react";
import type { Descendant } from "slate";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { MediaPicker } from "@/components/media-picker";
import { SlateBlogEditor } from "@/components/slate-blog-editor";

type BlogItem = {
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
};

type BlogAction = (formData: FormData) => Promise<void>;

function normalizeContent(content: unknown): Descendant[] {
  if (Array.isArray(content) && content.length > 0) {
    if (typeof content[0] === "string") {
      return content.map((text) => ({
        type: "paragraph",
        children: [{ text: String(text) }],
      })) as Descendant[];
    }

    return content as Descendant[];
  }

  return [
    {
      type: "paragraph",
      children: [{ text: "Write the blog article content here." }],
    } as Descendant,
  ];
}

function dateOnly(value: string) {
  return value ? value.slice(0, 10) : "";
}

export function DashboardBlogs({
  blogs,
  media,
  categories,
  statuses,
  addAction,
  updateAction,
  deleteAction,
}: {
  blogs: BlogItem[];
  media: string[];
  categories: string[];
  statuses: string[];
  addAction: BlogAction;
  updateAction: BlogAction;
  deleteAction: BlogAction;
}) {
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editing, setEditing] = useState<BlogItem | null>(null);

  function openEdit(blog: BlogItem) {
    setEditing(blog);
    setMode("edit");
  }

  return (
    <section className="dashboard-panel" id="blogs">
      <div className="dashboard-panel__head">
        <div>
          <h2>Blogs</h2>
          <p>Manage articles, SEO data, thumbnails, and publishing status.</p>
        </div>
        <button className="dashboard-button" type="button" onClick={() => {
          setEditing(null);
          setMode("add");
        }}>
          <Plus size={16} /> Add new
        </button>
      </div>

      {mode === "list" ? (
        <div className="dashboard-blog-list">
          {blogs.map((blog) => (
            <article className="dashboard-blog-row" key={blog.id}>
              <Image src={blog.cover || "/certificates/certificate-badge.svg"} alt={blog.cover_alt || ""} width={96} height={64} />
              <div>
                <strong>{blog.title}</strong>
                <span>{blog.category} · {blog.status}</span>
              </div>
              <button className="dashboard-button dashboard-button--compact" type="button" onClick={() => openEdit(blog)}>
                <Edit3 size={15} /> Edit
              </button>
              <form action={deleteAction} data-dashboard-form data-confirm-delete="true">
                <input type="hidden" name="id" value={blog.id} />
                <button className="icon-button" type="submit" aria-label="Delete blog">
                  <Trash2 size={16} />
                </button>
              </form>
            </article>
          ))}
        </div>
      ) : (
        <BlogForm
          key={editing?.id ?? "new-blog"}
          blog={editing}
          media={media}
          categories={categories}
          statuses={statuses}
          action={mode === "edit" ? updateAction : addAction}
          onCancel={() => {
            setMode("list");
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function BlogForm({
  blog,
  media,
  categories,
  statuses,
  action,
  onCancel,
}: {
  blog: BlogItem | null;
  media: string[];
  categories: string[];
  statuses: string[];
  action: BlogAction;
  onCancel: () => void;
}) {
  return (
    <form className="dashboard-form" action={action} data-dashboard-form>
      {blog ? <input type="hidden" name="id" value={blog.id} /> : null}
      <label className="dashboard-field">
        <span>Slug</span>
        <input name="slug" defaultValue={blog?.slug} />
      </label>
      <label className="dashboard-field">
        <span>Title</span>
        <input name="title" defaultValue={blog?.title} />
      </label>
      <label className="dashboard-field dashboard-field--wide">
        <span>Excerpt</span>
        <textarea name="excerpt" rows={3} defaultValue={blog?.excerpt} />
      </label>
      <label className="dashboard-field">
        <span>Category</span>
        <select name="category" defaultValue={blog?.category}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      </label>
      <label className="dashboard-field">
        <span>Status</span>
        <select name="status" defaultValue={blog?.status}>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
      </label>
      <label className="dashboard-field">
        <span>Published at</span>
        <input name="published_at" type="date" defaultValue={dateOnly(blog?.published_at ?? "")} />
      </label>
      <label className="dashboard-field">
        <span>Reading minutes</span>
        <input name="reading_minutes" type="number" defaultValue={blog?.reading_minutes ?? 3} />
      </label>
      <label className="dashboard-field">
        <span>Author</span>
        <input name="author" defaultValue={blog?.author} />
      </label>
      <MediaPicker name="cover" label="Cover image" defaultValue={blog?.cover} initialMedia={media} />
      <label className="dashboard-field">
        <span>Cover alt</span>
        <input name="cover_alt" defaultValue={blog?.cover_alt} />
      </label>
      <label className="dashboard-field">
        <span>SEO title</span>
        <input name="seo_title" defaultValue={blog?.seo_title} />
      </label>
      <label className="dashboard-field dashboard-field--wide">
        <span>SEO description</span>
        <textarea name="seo_description" rows={3} defaultValue={blog?.seo_description} />
      </label>
      <label className="dashboard-field">
        <span>Canonical URL</span>
        <input name="canonical" defaultValue={blog?.canonical} />
      </label>
      <label className="dashboard-field dashboard-field--wide">
        <span>Tags - one per line</span>
        <textarea name="tags" rows={3} defaultValue={blog?.tags?.join("\n")} />
      </label>
      <label className="dashboard-field dashboard-field--wide">
        <span>SEO keywords - one per line</span>
        <textarea name="seo_keywords" rows={3} defaultValue={blog?.seo_keywords?.join("\n")} />
      </label>
      <div className="dashboard-field dashboard-field--wide">
        <span>Blog content</span>
        <SlateBlogEditor defaultValue={normalizeContent(blog?.content)} />
      </div>
      <div className="dashboard-form__actions">
        <button className="dashboard-button" type="submit">{blog ? "Save blog" : "Add blog"}</button>
        <button className="dashboard-button dashboard-button--ghost" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
