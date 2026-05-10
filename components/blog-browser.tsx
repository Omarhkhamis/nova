"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import type { BlogPost } from "@/lib/content";

type BlogBrowserProps = {
  posts: BlogPost[];
};

export function BlogBrowser({ posts }: BlogBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category)))],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const haystack = [post.title, post.excerpt, post.category, ...post.tags].join(" ").toLowerCase();

      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [category, posts, query]);

  return (
    <section className="blog-browser">
      <div className="blog-browser__tools">
        <label className="blog-search" htmlFor="blog-search">
          <Search size={18} aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by topic, keyword, or tag"
          />
        </label>

        <label className="blog-filter" htmlFor="blog-category">
          <span>Category</span>
          <select
            id="blog-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="blog-results-count">{filteredPosts.length} articles matched</div>

      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <article className="blog-card" key={post.slug}>
            <div className="blog-card__meta">
              <span>{post.category}</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="inline-link" href={`/blog/${post.slug}`}>
              Read article
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
