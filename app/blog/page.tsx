import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogBrowser } from "@/components/blog-browser";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, field notes, and technical articles on maintenance, automation, industrial supply, and marine operations.",
};

export default function BlogPage() {
  const publishedPosts = blogPosts.filter((post) => post.status !== "Draft");

  return (
    <main className="page-shell">
      <div className="container page-shell__topbar">
        <Link className="inline-link" href="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>
      </div>

      <section className="container page-intro">
        <p className="eyebrow">Blog</p>
        <h1>Technical content with category filters, search, and SEO-ready article pages.</h1>
        <p>
          The blog listing now supports better discoverability, while each article has its own
          metadata model and route.
        </p>
      </section>

      <section className="container seo-strip">
        <article>
          <strong>{publishedPosts.length}</strong>
          <span>Visible articles</span>
        </article>
        <article>
          <strong>SEO metadata</strong>
          <span>Title, description, canonical, and keywords per post</span>
        </article>
        <article>
          <strong>Structured routing</strong>
          <span>Dedicated listing and single-article pages</span>
        </article>
      </section>

      <div className="container">
        <BlogBrowser posts={publishedPosts} />
      </div>
    </main>
  );
}
