"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Search, SlidersHorizontal } from "lucide-react";
import { catalogCategories, catalogProducts } from "./products";

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return catalogProducts.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchableText = [
        product.name,
        product.category,
        product.description,
        ...product.specs,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, query]);

  return (
    <main className="catalog-page">
      <header className="container catalog-topbar">
        <Link className="brand" href="/" aria-label="Novatech Advanced Solutions">
          <span className="brand__mark">NAS</span>
          <span>
            <strong>Novatech</strong>
            <small>Advanced Solutions</small>
          </span>
        </Link>
        <Link className="catalog-back" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Home
        </Link>
      </header>

      <section className="container catalog-hero">
        <p className="eyebrow">Product Catalog</p>
        <h1>Industrial products, parts, and supply options.</h1>
        <p>
          Search and filter the catalog to find automation, marine, cooling, CNC, equipment,
          and spare parts suitable for your project requirements.
        </p>
      </section>

      <section className="container catalog-browser" aria-label="Product catalog browser">
        <div className="catalog-tools">
          <label className="catalog-search" htmlFor="catalog-search">
            <Search size={18} aria-hidden="true" />
            <input
              id="catalog-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
            />
          </label>

          <label className="catalog-filter" htmlFor="catalog-category">
            <SlidersHorizontal size={18} aria-hidden="true" />
            <select
              id="catalog-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {catalogCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="catalog-results-count">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </div>

        <div className="catalog-list">
          {filteredProducts.map((product) => (
            <article className="catalog-list-card" key={product.id}>
              <div className="catalog-list-card__media">
                <Image src={product.image} alt={product.alt} fill sizes="(max-width: 820px) 100vw, 330px" />
              </div>
              <div className="catalog-list-card__body">
                <span>{product.category}</span>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <ul>
                  {product.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
                <Link className="catalog-list-card__link" href="/#contact">
                  Request Details
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="catalog-empty">
            <h2>No products found</h2>
            <p>Try a different search term or category filter.</p>
          </div>
        )}
      </section>
    </main>
  );
}
