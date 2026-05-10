"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Car,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Droplets,
  Factory,
  FlaskConical,
  Gauge,
  Mail,
  MapPin,
  Phone,
  PlugZap,
  Send,
  Settings2,
  ShieldCheck,
  Ship,
  Snowflake,
  Utensils,
  Zap,
} from "lucide-react";
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { blogPosts, certifications, partners } from "@/lib/content";
import { catalogProducts } from "./catalog/products";

type PublicSiteData = {
  settings: {
    site?: {
      logoText?: string;
      brandName?: string;
      brandSubtitle?: string;
      phone?: string;
      whatsapp?: string;
      email?: string;
      address?: string;
    };
  };
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
  partners: Array<{ name: string; sector: string; logo: string; logo_alt: string }>;
  certifications: Array<{ image: string; code: string; title: string; description: string }>;
  gallery: Array<{ image: string; alt: string }>;
  blogs: Array<{
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    status: string;
    cover: string;
    cover_alt: string;
    reading_minutes: number;
  }>;
  aboutCards: Array<{ title: string; description: string }>;
  services: Array<{ title: string; lead: string; icon: string; points: string[] }>;
  products: Array<{ id: string; name: string; category: string; description: string; image: string; specs: string[] }>;
  industries: Array<{ name: string; icon: string }>;
  footerLinks: Array<{ label: string; href: string; is_visible: boolean }>;
};

const heroImage =
  "https://images.unsplash.com/photo-1748002757537-00ab5114135b?auto=format&fit=crop&fm=jpg&q=75&w=2400";

const imageStrip = [
  {
    src: "https://images.unsplash.com/photo-1738918937796-743064feefa1?auto=format&fit=crop&fm=jpg&q=70&w=1200",
    alt: "Industrial control room with monitoring panels",
  },
  {
    src: "https://images.unsplash.com/photo-1764115424737-25aca6f47835?auto=format&fit=crop&fm=jpg&q=70&w=1200",
    alt: "CNC workshop and metal fabrication equipment",
  },
  {
    src: "https://images.unsplash.com/photo-1761426112156-21305e806344?auto=format&fit=crop&fm=jpg&q=70&w=1200",
    alt: "Cargo vessel at sea",
  },
];

const galleryRows = [imageStrip, imageStrip];

type Service = {
  title: string;
  icon: LucideIcon;
  lead: string;
  points: string[];
};

const services: Service[] = [
  {
    title: "Automation & Control",
    icon: Cpu,
    lead: "Scalable control systems for production lines and mission-critical facilities.",
    points: ["PLC programming", "SCADA design", "IoT integration", "Industrial cybersecurity"],
  },
  {
    title: "Industrial Services",
    icon: Settings2,
    lead: "Field execution and maintenance that reduce downtime and protect asset availability.",
    points: ["Equipment installation", "Predictive maintenance", "Preventive maintenance", "Air compressor service"],
  },
  {
    title: "Marine Services",
    icon: Ship,
    lead: "Technical support for electrical and mechanical systems onboard marine vessels.",
    points: ["Generator maintenance", "Electrical panels", "Propulsion systems", "Navigation and communication"],
  },
  {
    title: "Industrial Cooling",
    icon: Snowflake,
    lead: "Cooling solutions for factories, vessels, and high-load data center environments.",
    points: ["Industrial cooling", "Marine cooling", "Data center cooling", "Chillers"],
  },
  {
    title: "CNC Repair & Refurbishment",
    icon: Gauge,
    lead: "Restoring machine performance and extending operating life through precise upgrades.",
    points: ["Mechanical repair", "Electrical repair", "Legacy system upgrades"],
  },
  {
    title: "Equipment & Spare Parts Supply",
    icon: PlugZap,
    lead: "Reliable sourcing aligned with operational requirements and project timelines.",
    points: ["Pumps", "Valves", "Motors", "Generators", "Control panels"],
  },
];

const values = [
  {
    title: "Reliability",
    text: "Clear processes, responsive field support, and dependable outcomes for sensitive operating environments.",
  },
  {
    title: "Engineering Expertise",
    text: "Qualified technicians and engineers capable of handling complex industrial and marine systems.",
  },
  {
    title: "Customer Commitment",
    text: "Practical delivery focused on reducing downtime, controlling cost, and meeting each facility's requirements.",
  },
];

const strengths = [
  "Highly skilled technical team",
  "Broad services across operations, maintenance, and supply",
  "Competitive pricing",
  "Flexible payment options for companies",
];

const industries = [
  { name: "Manufacturing", icon: Factory },
  { name: "Energy, Oil & Gas", icon: Zap },
  { name: "Water Pumping Stations", icon: Droplets },
  { name: "Food & Beverage", icon: Utensils },
  { name: "Pharmaceuticals", icon: FlaskConical },
  { name: "Automotive", icon: Car },
  { name: "Building Automation", icon: Building2 },
];

const contact = {
  phones: ["+971556271982", "+971556290934"],
  email: "novatech.ae@gmail.com",
  address: "Al Raffa, Dubai, United Arab Emirates",
};

const quickLinks = [
  { label: "Home", href: "#top" },
  { label: "Partners", href: "#partners" },
  { label: "Certifications", href: "#certifications" },
  { label: "Gallery", href: "#gallery" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Catalog", href: "/catalog" },
  { label: "Industries", href: "#industries" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "/blog" },
];

const iconRegistry: Record<string, LucideIcon> = {
  Building2,
  Car,
  Cpu,
  Droplets,
  Factory,
  FlaskConical,
  Gauge,
  PlugZap,
  Settings2,
  Ship,
  Snowflake,
  Utensils,
  Zap,
};

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const catalogTrackRef = useRef<HTMLDivElement>(null);
  const [siteData, setSiteData] = useState<PublicSiteData | null>(null);
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 1.08]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, 60]);
  const hero = siteData?.hero;
  const sections = Object.fromEntries((siteData?.sections ?? []).map((section) => [section.section_key, section]));
  const site = siteData?.settings.site;
  const partnerItems = siteData?.partners.length
    ? siteData.partners.map((partner) => ({
        name: partner.name,
        sector: partner.sector,
        logo: partner.logo,
        logoAlt: partner.logo_alt,
      }))
    : partners;
  const certificationItems = siteData?.certifications.length
    ? siteData.certifications.map((item) => ({
        code: item.code,
        title: item.title,
        note: item.description,
        image: item.image,
      }))
    : certifications.map((item) => ({ ...item, image: "/certificates/certificate-badge.svg" }));
  const galleryItems = siteData?.gallery.length ? siteData.gallery.map((item) => ({ src: item.image, alt: item.alt })) : imageStrip;
  const galleryDisplayRows = siteData?.gallery.length
    ? [galleryItems.slice(0, 3), galleryItems.slice(3, 6)].filter((row) => row.length)
    : galleryRows;
  const serviceItems = siteData?.services.length
    ? siteData.services.map((service) => ({
        ...service,
        icon: iconRegistry[service.icon] ?? Settings2,
      }))
    : services;
  const valueItems = siteData?.aboutCards.length
    ? siteData.aboutCards.map((card) => ({ title: card.title, text: card.description }))
    : values;
  const industryItems = siteData?.industries.length
    ? siteData.industries.map((industry) => ({
        name: industry.name,
        icon: iconRegistry[industry.icon] ?? Factory,
      }))
    : industries;
  const productItems = siteData?.products.length
    ? siteData.products.map((product) => ({ ...product, alt: product.name }))
    : catalogProducts;
  const featuredProducts = productItems.slice(0, 6);
  const featuredPosts = (siteData?.blogs.length
    ? siteData.blogs.map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        status: post.status,
        cover: post.cover,
        coverAlt: post.cover_alt,
        readingMinutes: post.reading_minutes,
      }))
    : blogPosts
  )
    .filter((post) => post.status !== "Draft")
    .slice(0, 3);
  const footerLinks = siteData?.footerLinks.length
    ? siteData.footerLinks.filter((link) => link.is_visible)
    : quickLinks;
  const contactData = {
    phones: ([site?.phone, site?.whatsapp].filter(Boolean) as string[]) || contact.phones,
    email: site?.email ?? contact.email,
    address: site?.address ?? contact.address,
  };

  if (!contactData.phones.length) {
    contactData.phones = contact.phones;
  }

  useEffect(() => {
    let isMounted = true;

    fetch("/api/site-data", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: PublicSiteData | null) => {
        if (isMounted && data) {
          setSiteData(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSiteData(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function scrollCatalog(direction: "prev" | "next") {
    const track = catalogTrackRef.current;

    if (!track) {
      return;
    }

    track.scrollBy({
      left: direction === "next" ? track.clientWidth * 0.82 : -track.clientWidth * 0.82,
      behavior: "smooth",
    });
  }

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: shouldReduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      <main>
        <Header site={site} />
        <section className="hero" id="top" aria-label="Novatech Advanced Solutions">
            <motion.div
              className="hero__media"
              style={{ scale: shouldReduceMotion ? 1 : heroScale, y: shouldReduceMotion ? 0 : heroY }}
            >
              <Image
                src={hero?.image ?? heroImage}
                alt="Modern industrial facility with engineering equipment"
                fill
                priority
                sizes="100vw"
                className="hero__image"
              />
            </motion.div>
            <div className="hero__overlay" />
            <div className="container hero__content">
              <motion.div
                className="hero__copy"
                initial="hidden"
                animate="visible"
                variants={reveal}
              >
                <p className="eyebrow">{hero?.eyebrow ?? ""}</p>
                <h1>
                  <span>{hero?.title ?? ""}</span>
                </h1>
                <p className="hero__headline">{hero?.headline ?? ""}</p>
                <p className="hero__text">{hero?.description ?? ""}</p>
                <div className="hero__actions">
                  <a className="button button--primary" href={hero?.primary_cta_href ?? "#contact"}>
                    {hero?.primary_cta_label ?? ""}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                  <a className="button button--ghost" href={hero?.secondary_cta_href ?? "#services"}>
                    {hero?.secondary_cta_label ?? ""}
                    <ChevronRight size={18} aria-hidden="true" />
                  </a>
                </div>
              </motion.div>

              <motion.div
                className="hero__signal"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 }}
                aria-label="Service scope"
              >
                <div>
                  <span>01</span>
                  <strong>Marine Repair</strong>
                </div>
                <div>
                  <span>02</span>
                  <strong>Automation & SCADA</strong>
                </div>
                <div>
                  <span>03</span>
                  <strong>Industrial Supply</strong>
                </div>
              </motion.div>
            </div>
        </section>

        <section className="partners section" id="partners">
          <div className="container section__header section__header--full">
            <MotionBlock>
              <p className="eyebrow">{sections.partners?.eyebrow ?? "Our Partners"}</p>
              <h2>{sections.partners?.title ?? "Partner network and delivery ecosystem."}</h2>
            </MotionBlock>
          </div>

          <div className="container partners-slider" aria-label="Partner logos">
            <div className="partners-slider__track">
              {[...partnerItems, ...partnerItems].map((partner, index) => (
                <article className="partner-logo-card" key={`${partner.name}-${index}`}>
                  <Image
                    src={partner.logo}
                    alt={partner.logoAlt}
                    width={220}
                    height={92}
                    className="partner-logo-card__image"
                  />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="certifications section" id="certifications">
            <div className="container section__header section__header--full">
              <MotionBlock>
                <p className="eyebrow">{sections.certifications?.eyebrow ?? "Certifications"}</p>
                <h2>{sections.certifications?.title ?? "Certified standards that strengthen every project we deliver."}</h2>
              </MotionBlock>
            </div>

            <div className="container certifications__viewport" aria-label="Certification slider">
              <div className="certifications__track">
                {[...certificationItems, ...certificationItems].map((item, index) => (
                  <article className="certification-card" key={`${item.code}-${index}`}>
                    <div className="certification-card__image">
                      <Image
                        src={item.image}
                        alt=""
                        width={180}
                        height={124}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="certification-card__copy">
                      <span>{item.code}</span>
                      <h3>{item.title}</h3>
                      <p>{item.note}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
        </section>

        <section className="gallery-showcase section" id="gallery">
            <div className="container section__header section__header--full">
              <MotionBlock>
                <p className="eyebrow">{sections.gallery?.eyebrow ?? "Gallery"}</p>
                <h2>{sections.gallery?.title ?? "Field visuals from control rooms, workshops, and marine operations."}</h2>
              </MotionBlock>
            </div>

            <div className="container gallery-showcase__grid">
              {galleryDisplayRows.map((row, rowIndex) => (
                <div
                  className={`gallery-showcase__cluster ${
                    rowIndex % 2 === 1 ? "gallery-showcase__cluster--reversed" : ""
                  }`}
                  key={`gallery-row-${rowIndex}`}
                >
                  {row.map((image, imageIndex) => (
                    <MotionBlock
                      className={`gallery-showcase__item ${
                        imageIndex === 0 ? "gallery-showcase__item--large" : "gallery-showcase__item--small"
                      }`}
                      key={`${image.src}-${rowIndex}-${imageIndex}`}
                      delay={imageIndex * 0.08}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes={
                          imageIndex === 0
                            ? "(max-width: 720px) 100vw, 760px"
                            : "(max-width: 720px) 100vw, 380px"
                        }
                      />
                    </MotionBlock>
                  ))}
                </div>
              ))}
            </div>
        </section>

        <section className="insights section" id="blog">
          <div className="container section__header section__header--full section__header--compact">
            <MotionBlock>
              <p className="eyebrow">{sections.blogs?.eyebrow ?? "Our blogs"}</p>
            </MotionBlock>
          </div>

          <div className="container insights__grid">
            {featuredPosts.map((post, index) => (
              <MotionBlock className="insight-card" key={post.slug} delay={index * 0.08}>
                <div className="insight-card__media">
                  <Image
                    src={post.cover}
                    alt={post.coverAlt}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                  />
                </div>
                <div className="insight-card__meta">
                  <span>{post.category}</span>
                  <span>{post.readingMinutes} min read</span>
                </div>
                <div className="insight-card__body">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="insight-card__tags">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <Link className="insight-card__link" href={`/blog/${post.slug}`}>
                  Read article
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </MotionBlock>
            ))}
          </div>

          <div className="container insights__footer">
            <Link className="button button--ghost" href="/blog">
              Visit Blog
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="container about__grid">
            <MotionBlock className="section__intro">
              <p className="eyebrow">{sections.about?.eyebrow ?? "About & Why Choose Us"}</p>
              <h2>{sections.about?.title ?? "A practical engineering partner for facilities that need precision, speed, and uptime."}</h2>
              <p>
                {sections.about?.description ??
                  "Novatech Advanced Solutions combines technical expertise, engineering discipline, and a clear understanding of B2B requirements across manufacturing, energy, marine, and industrial cooling sectors."}
              </p>
            </MotionBlock>

            <MotionBlock className="about__panel" delay={0.1}>
              <div className="about__mark">
                <ShieldCheck size={28} aria-hidden="true" />
                <span>NAS</span>
              </div>
              <p>
                Based in Dubai, NAS supports industrial projects and operating facilities with
                maintenance, automation, supply, and modernization services built around clear
                diagnostics and organized field execution.
              </p>
              <ul className="strengths">
                {strengths.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </MotionBlock>
          </div>

          <div className="container values">
            {valueItems.map((value, index) => (
              <MotionBlock className="value-card" key={value.title} delay={index * 0.08}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </MotionBlock>
            ))}
          </div>
        </section>

        <section className="services section" id="services">
          <div className="container section__header">
            <MotionBlock>
              <p className="eyebrow">{sections.services?.eyebrow ?? "Our Services"}</p>
              <h2>{sections.services?.title ?? "Wide engineering coverage from controls to critical spare parts."}</h2>
            </MotionBlock>
            <MotionBlock delay={0.1}>
              <p>
                {sections.services?.description ??
                  "A service network designed for companies that need one partner who understands operations, maintenance, automation, and supply without unnecessary complexity."}
              </p>
            </MotionBlock>
          </div>

          <div className="container services__grid">
            {serviceItems.map((service, index) => (
              <MotionBlock className="service-card" key={service.title} delay={(index % 3) * 0.08}>
                <div className="service-card__icon">
                  <service.icon size={26} aria-hidden="true" />
                </div>
                <h3>{service.title}</h3>
                <p>{service.lead}</p>
                <ul>
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </MotionBlock>
            ))}
          </div>
        </section>

        <section className="catalog-preview section" id="catalog">
          <div className="container section__header catalog-preview__header">
            <MotionBlock>
              <p className="eyebrow">{sections.catalog?.eyebrow ?? "Catalog"}</p>
              <h2>{sections.catalog?.title ?? "Featured products and supply options ready for industrial requirements."}</h2>
            </MotionBlock>
            <MotionBlock className="catalog-preview__aside" delay={0.1}>
              <p>
                {sections.catalog?.description ??
                  "Browse selected automation, marine, cooling, CNC, and spare parts products, then open the full catalog for filtering and search."}
              </p>
              <div className="catalog-preview__actions">
                <div className="catalog-slider__buttons" aria-label="Catalog slider controls">
                  <button type="button" aria-label="Previous products" onClick={() => scrollCatalog("prev")}>
                    <ArrowLeft size={20} aria-hidden="true" />
                  </button>
                  <button type="button" aria-label="Next products" onClick={() => scrollCatalog("next")}>
                    <ArrowRight size={20} aria-hidden="true" />
                  </button>
                </div>
                <Link className="button button--primary" href="/catalog">
                  Browse Catalog
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </MotionBlock>
          </div>

          <div className="container catalog-slider" ref={catalogTrackRef} aria-label="Featured catalog products">
            {featuredProducts.map((product) => (
              <article className="catalog-card" key={product.id}>
                <div className="catalog-card__media">
                  <Image src={product.image} alt={product.alt} fill sizes="(max-width: 680px) 86vw, 360px" />
                </div>
                <div className="catalog-card__body">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="industries section" id="industries">
          <div className="container industries__inner">
            <MotionBlock className="section__intro">
              <p className="eyebrow">{sections.industries?.eyebrow ?? "Industries We Serve"}</p>
              <h2>{sections.industries?.title ?? "Applicable expertise across demanding operating environments."}</h2>
            </MotionBlock>
            <div className="industries__grid">
              {industryItems.map((industry, index) => (
                <MotionBlock
                  className="industry-item"
                  key={industry.name}
                  delay={(index % 4) * 0.06}
                >
                  <industry.icon size={24} aria-hidden="true" />
                  <span>{industry.name}</span>
                </MotionBlock>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="container contact__grid">
            <MotionBlock className="contact__copy">
              <p className="eyebrow">{sections.contact?.eyebrow ?? "Contact"}</p>
              <h2>{sections.contact?.title ?? "Have a project, recurring fault, or equipment request? Talk to the NAS team."}</h2>
              <p>
                {sections.contact?.description ??
                  "Send your technical requirements and we will help define the service scope, priorities, and the right next step for execution."}
              </p>
            </MotionBlock>

            <MotionBlock className="contact-form" delay={0.1}>
              <form action={`mailto:${contactData.email}`} method="post" encType="text/plain">
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" autoComplete="name" required />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" name="email" type="email" autoComplete="email" required />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" required />
                </div>
                <div className="form-field">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} required />
                </div>
                <button className="button button--primary" type="submit">
                  Send Request
                  <Send size={18} aria-hidden="true" />
                </button>
              </form>
            </MotionBlock>
          </div>
        </section>

        <Footer contact={contactData} footerLinks={footerLinks} services={serviceItems} site={site} />
      </main>
    </MotionConfig>
  );
}

function Header({ site }: { site?: PublicSiteData["settings"]["site"] }) {
  const logoText = site?.logoText ?? "NAS";
  const brandName = site?.brandName ?? "Novatech";
  const brandSubtitle = site?.brandSubtitle ?? "Advanced Solutions";

  return (
    <header className="site-header">
      <div className="header-primary">
        <a className="brand" href="#top" aria-label="Novatech Advanced Solutions">
          <span className="brand__mark">{logoText}</span>
          <span>
            <strong>{brandName}</strong>
            <small>{brandSubtitle}</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#partners">Partners</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#catalog">Catalog</a>
          <a href="#gallery">Gallery</a>
          <a href="#blog">Blog</a>
          <a href="#industries">Industries</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
      <div className="header-tools">
        <ThemeToggle initialTheme="dark" />
        <a className="header-cta" href="#contact">
          <span className="header-cta__full">Request Consultation</span>
          <span className="header-cta__short">Consult</span>
        </a>
      </div>
    </header>
  );
}

function MotionBlock({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px 120px 0px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

function Footer({
  contact,
  footerLinks,
  services,
  site,
}: {
  contact: { phones: string[]; email: string; address: string };
  footerLinks: Array<{ label: string; href: string }>;
  services: Array<{ title: string }>;
  site?: PublicSiteData["settings"]["site"];
}) {
  const logoText = site?.logoText ?? "NAS";
  const brandName = site?.brandName ?? "Novatech";

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a className="footer__logo" href="#top" aria-label="Novatech Advanced Solutions">
            <span>{logoText}</span>
            <strong>{brandName}</strong>
          </a>
          <p>
            We engineer, maintain, and supply advanced industrial and marine solutions for
            companies that need reliable execution from Dubai.
          </p>
          <a className="footer__cta" href="#services">
            Explore Services
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>

        <nav className="footer__column" aria-label="Footer navigation">
          <h2>Quick Links</h2>
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="footer__column">
          <h2>Services</h2>
          {services.slice(0, 5).map((service) => (
            <a key={service.title} href="#services">
              {service.title}
            </a>
          ))}
        </div>

        <div className="footer__column footer__contact">
          <h2>Contact Us</h2>
          {contact.phones.map((phone) => (
            <a href={`tel:${phone}`} key={phone}>
              <Phone size={18} aria-hidden="true" />
              <span>{phone}</span>
            </a>
          ))}
          <a href={`mailto:${contact.email}`}>
            <Mail size={18} aria-hidden="true" />
            <span>{contact.email}</span>
          </a>
          <p>
            <MapPin size={18} aria-hidden="true" />
            <span>{contact.address}</span>
          </p>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>© 2026 Novatech Advanced Solutions L.L.C. All rights reserved.</p>
      </div>
    </footer>
  );
}
