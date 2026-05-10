import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3 } from "lucide-react";
import { blogPosts } from "@/lib/content";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: post.seoKeywords,
    alternates: {
      canonical: post.canonical,
    },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      images: [{ url: post.cover }],
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription,
    image: post.cover,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
  };

  return (
    <main className="article-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container page-shell__topbar">
        <Link className="inline-link" href="/blog">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to blog
        </Link>
      </div>

      <article className="container article-card">
        <div className="article-card__hero">
          <div className="article-card__copy">
            <div className="meta-row">
              <span>{post.category}</span>
              <span>{post.status}</span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div className="article-meta">
              <span>{post.author}</span>
              <span>
                <Clock3 size={15} aria-hidden="true" />
                {post.readingMinutes} min read
              </span>
              <span>{post.publishedAt}</span>
            </div>
          </div>

          <div className="article-card__media">
            <Image
              src={post.cover}
              alt={post.coverAlt}
              fill
              sizes="(max-width: 900px) 100vw, 42vw"
              className="article-card__image"
            />
          </div>
        </div>

        <div className="article-body">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="article-footer">
          <div className="tag-row">
            {post.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="seo-card">
            <strong>SEO snapshot</strong>
            <p>{post.seoDescription}</p>
            <small>{post.canonical}</small>
          </div>
        </div>
      </article>
    </main>
  );
}
