import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Boxes,
  Cpu,
  Factory,
  Globe,
  ShieldCheck,
  ShipWheel,
  Wrench,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
};

export type Service = {
  title: string;
  lead: string;
  icon: LucideIcon;
  bullets: string[];
};

export type Partner = {
  name: string;
  sector: string;
  logo: string;
  logoAlt: string;
};

export type Certification = {
  code: string;
  title: string;
  note: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  author: string;
  cover: string;
  coverAlt: string;
  featured: boolean;
  status: "Published" | "Scheduled" | "Draft";
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  seoKeywords: string[];
};

export const siteName = "Novatech Advanced Solutions";
export const siteUrl = "https://novatech.example.com";

export const navLinks: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Partners", href: "#partners" },
  { label: "Certifications", href: "#certifications" },
  { label: "Gallery", href: "#gallery" },
  { label: "Blog", href: "/blog" },
];

export const services: Service[] = [
  {
    title: "Automation & Controls",
    lead: "Reliable PLC, SCADA, and industrial monitoring systems for facilities that cannot afford blind spots.",
    icon: Cpu,
    bullets: ["PLC programming", "SCADA design", "Industrial IoT", "Control panel retrofits"],
  },
  {
    title: "Field Service Operations",
    lead: "Structured maintenance and on-site interventions that protect uptime and reduce repeat failures.",
    icon: Wrench,
    bullets: ["Preventive maintenance", "Corrective interventions", "Asset diagnostics", "Shutdown support"],
  },
  {
    title: "Marine Engineering",
    lead: "Technical services for vessel systems, marine electrical works, and equipment support.",
    icon: ShipWheel,
    bullets: ["Generator service", "Marine electrical systems", "Cooling systems", "Technical sourcing"],
  },
  {
    title: "Industrial Supply",
    lead: "Procurement support and supply coordination for critical equipment, spare parts, and plant consumables.",
    icon: Boxes,
    bullets: ["Spare parts", "Equipment sourcing", "Vendor matching", "Urgent supply requests"],
  },
];

export const partners: Partner[] = [
  {
    name: "Delta Marine Works",
    sector: "Marine Operations",
    logo: "/partners/delta-marine.svg",
    logoAlt: "Delta Marine Works logo",
  },
  {
    name: "CoreGrid Systems",
    sector: "Automation Integrator",
    logo: "/partners/coregrid.svg",
    logoAlt: "CoreGrid Systems logo",
  },
  {
    name: "Arkan Process",
    sector: "Industrial Manufacturing",
    logo: "/partners/arkan-process.svg",
    logoAlt: "Arkan Process logo",
  },
  {
    name: "Bluebay Logistics",
    sector: "Port Services",
    logo: "/partners/bluebay.svg",
    logoAlt: "Bluebay Logistics logo",
  },
  {
    name: "Nexa Cooling",
    sector: "Cooling Infrastructure",
    logo: "/partners/nexa-cooling.svg",
    logoAlt: "Nexa Cooling logo",
  },
  {
    name: "Falcon Energy Tech",
    sector: "Energy & Utilities",
    logo: "/partners/falcon-energy.svg",
    logoAlt: "Falcon Energy Tech logo",
  },
  {
    name: "Axis Controls",
    sector: "Controls Partner",
    logo: "/partners/axis-controls.svg",
    logoAlt: "Axis Controls logo",
  },
  {
    name: "Vertex Industrial",
    sector: "Industrial Supply",
    logo: "/partners/vertex-industrial.svg",
    logoAlt: "Vertex Industrial logo",
  },
];

export const certifications: Certification[] = [
  { code: "ISO 9001", title: "Quality Management", note: "Process discipline for delivery consistency." },
  { code: "ISO 14001", title: "Environmental Management", note: "Operational compliance and environmental controls." },
  { code: "ISO 45001", title: "Occupational Health & Safety", note: "Safety-first execution for field operations." },
  { code: "IEC Ready", title: "Electrical Standards Alignment", note: "Design approach aligned with industrial codes." },
  { code: "QA/QC", title: "Inspection Documentation", note: "Structured checks for installation and handover." },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "future-ready-industrial-service-planning",
    title: "Future-Ready Industrial Service Planning for Growing Facilities",
    excerpt: "A practical starter model for aligning maintenance, automation, and supply needs before growth creates bottlenecks.",
    content: [
      "Growing facilities often add production capacity faster than they update their maintenance and technical support structure. That mismatch creates avoidable pressure on teams, vendors, and spare-parts availability.",
      "A future-ready service plan starts with visibility. Site teams need a clear register of critical systems, recurring faults, expected lead times, and technical ownership before expansion work begins.",
      "The strongest plans combine preventive routines, automation readiness, and supply coordination into one operating rhythm. That keeps technical decisions close to business priorities instead of treating every issue as an isolated request.",
      "Facilities that plan this way are better prepared to scale without turning every upgrade, shutdown, or urgent spare part into a disruptive event.",
    ],
    category: "Planning",
    tags: ["Service Planning", "Facility Growth", "Operations"],
    publishedAt: "2026-05-07",
    readingMinutes: 4,
    author: "NAS Strategy Desk",
    cover: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&fm=jpg&q=75&w=1600",
    coverAlt: "Industrial planning meeting with engineering drawings",
    featured: true,
    status: "Published",
    seoTitle: "Industrial Service Planning for Growing Facilities | Novatech",
    seoDescription: "A practical guide to planning maintenance, automation, and supply workflows for growing industrial facilities.",
    canonical: `${siteUrl}/blog/future-ready-industrial-service-planning`,
    seoKeywords: ["industrial service planning", "facility growth", "maintenance strategy"],
  },
  {
    slug: "how-predictive-maintenance-reduces-industrial-downtime",
    title: "How Predictive Maintenance Reduces Downtime in Industrial Facilities",
    excerpt: "A practical framework for moving from reactive maintenance to scheduled, data-backed interventions.",
    content: [
      "Predictive maintenance works when facilities stop treating maintenance as an isolated function and start managing it as an operational risk program. The strongest gains usually come from identifying repeat failure patterns, defining measurable inspection points, and assigning escalation rules before a fault becomes a shutdown event.",
      "For mixed industrial environments, the first step is to classify assets by operational impact. Motors, compressors, panels, cooling systems, and instrumentation loops should not all receive the same service cadence. Criticality-based planning cuts unnecessary interventions while protecting the assets that would cause production losses if they fail.",
      "The second step is instrumentation discipline. Vibration data, thermal readings, current draw, and alarm history are useful only when teams review them against a maintenance baseline. Random data collection without thresholds creates noise, not decisions.",
      "Facilities that implement predictive maintenance successfully usually tie findings to work orders, spare-parts readiness, and management reporting. That linkage is what turns technical observations into actual uptime improvement.",
    ],
    category: "Maintenance",
    tags: ["Predictive Maintenance", "Downtime", "Operations"],
    publishedAt: "2026-04-18",
    readingMinutes: 6,
    author: "NAS Engineering Team",
    cover: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&fm=jpg&q=75&w=1600",
    coverAlt: "Industrial engineer working near plant equipment",
    featured: true,
    status: "Published",
    seoTitle: "Predictive Maintenance for Industrial Downtime Reduction | Novatech",
    seoDescription: "Learn how predictive maintenance programs reduce breakdown risk, improve asset visibility, and protect production uptime.",
    canonical: `${siteUrl}/blog/how-predictive-maintenance-reduces-industrial-downtime`,
    seoKeywords: ["predictive maintenance", "industrial downtime", "asset reliability"],
  },
  {
    slug: "scada-visibility-for-multi-site-operations",
    title: "SCADA Visibility for Multi-Site Operations Without Interface Clutter",
    excerpt: "Designing control-room visibility that supports decisions instead of overwhelming operators.",
    content: [
      "SCADA systems become difficult to use when design teams prioritize volume over hierarchy. Operators do not need every data point on the first screen. They need fast access to abnormal conditions, equipment states, and the next action required.",
      "A clean multi-site monitoring strategy starts with a common alarm philosophy. Status colors, escalation levels, naming rules, and response ownership should remain consistent across facilities. Consistency reduces operator fatigue and speeds up handovers.",
      "The reporting layer matters as much as the graphics. Trend views, event summaries, and downtime causes should be visible to both engineering and management without forcing each team to rebuild the same report manually.",
      "Strong SCADA design is not about adding more widgets. It is about choosing the minimum interface needed to support operational control.",
    ],
    category: "Automation",
    tags: ["SCADA", "Monitoring", "Automation"],
    publishedAt: "2026-03-29",
    readingMinutes: 5,
    author: "Automation Division",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&fm=jpg&q=75&w=1600",
    coverAlt: "Electronic industrial control board",
    featured: true,
    status: "Published",
    seoTitle: "SCADA Interface Design for Multi-Site Industrial Operations",
    seoDescription: "A practical guide to SCADA visibility, alarm design, and reporting structure for multi-site industrial environments.",
    canonical: `${siteUrl}/blog/scada-visibility-for-multi-site-operations`,
    seoKeywords: ["SCADA interface", "industrial monitoring", "automation design"],
  },
  {
    slug: "sourcing-critical-spare-parts-without-project-delays",
    title: "Sourcing Critical Spare Parts Without Delaying Technical Projects",
    excerpt: "How procurement, engineering, and vendor qualification should align on urgent industrial supply requests.",
    content: [
      "Supply problems usually start before the purchase order. When technical specifications are incomplete or vendor equivalence is not defined early, the sourcing process slows down and site teams are left waiting with no reliable delivery path.",
      "A better model is to create an approved substitution matrix for critical items. That means engineering teams define acceptable alternatives in advance, and procurement teams can move quickly when the preferred brand is unavailable.",
      "Documentation is equally important. Datasheets, origin details, compliance notes, and lead times should move together. Missing one of those elements often creates delays during approval or installation.",
      "The highest-performing supply workflows are the ones that connect commercial speed with technical control instead of sacrificing one for the other.",
    ],
    category: "Supply Chain",
    tags: ["Spare Parts", "Procurement", "Supply Chain"],
    publishedAt: "2026-05-02",
    readingMinutes: 4,
    author: "Supply Operations Desk",
    cover: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&fm=jpg&q=75&w=1600",
    coverAlt: "Industrial metalwork and fabrication area",
    featured: false,
    status: "Scheduled",
    seoTitle: "Critical Spare Parts Sourcing Strategy for Industrial Projects",
    seoDescription: "Reduce procurement delays for critical spares with stronger specifications, vendor alternatives, and approval workflows.",
    canonical: `${siteUrl}/blog/sourcing-critical-spare-parts-without-project-delays`,
    seoKeywords: ["spare parts sourcing", "industrial procurement", "project delays"],
  },
];

export const capabilityCards = [
  {
    title: "Process-first delivery",
    description: "Operational clarity, documented scopes, and accountable execution.",
    icon: ShieldCheck,
  },
  {
    title: "Cross-sector engineering",
    description: "Automation, marine, maintenance, and sourcing within one service model.",
    icon: Globe,
  },
  {
    title: "Facility modernization",
    description: "Retrofit paths for aging controls, equipment, and field operations.",
    icon: Bot,
  },
  {
    title: "Industrial footprint",
    description: "Structured support for plants, ports, workshops, and utilities.",
    icon: Factory,
  },
];
