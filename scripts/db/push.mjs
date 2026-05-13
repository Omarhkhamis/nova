import pg from "pg";
import { randomBytes, scrypt as nodeScrypt } from "node:crypto";
import { promisify } from "node:util";

const { Pool } = pg;
const scrypt = promisify(nodeScrypt);

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

const json = (value) => JSON.stringify(value);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);

  return `scrypt$${salt}$${hash.toString("hex")}`;
}

const schema = `
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS section_content (
  section_key TEXT PRIMARY KEY,
  eyebrow TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS hero (
  id INTEGER PRIMARY KEY DEFAULT 1,
  eyebrow TEXT NOT NULL,
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  primary_cta_label TEXT NOT NULL,
  primary_cta_href TEXT NOT NULL,
  secondary_cta_label TEXT NOT NULL,
  secondary_cta_href TEXT NOT NULL,
  CONSTRAINT hero_singleton CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS partners (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  logo TEXT NOT NULL,
  logo_alt TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS certifications (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  image TEXT NOT NULL,
  alt TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]',
  published_at DATE NOT NULL,
  reading_minutes INTEGER NOT NULL,
  author TEXT NOT NULL,
  cover TEXT NOT NULL,
  cover_alt TEXT NOT NULL,
  status TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  canonical TEXT NOT NULL,
  seo_keywords JSONB NOT NULL DEFAULT '[]',
  content JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS about_cards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  lead TEXT NOT NULL,
  icon TEXT NOT NULL,
  points JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS catalog_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  alt TEXT NOT NULL,
  specs JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS industries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS footer_links (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);
`;

const sectionContent = [
  ["partners", "Our Partners", "Partner network and delivery ecosystem.", ""],
  ["certifications", "Certifications", "Certified standards that strengthen every project we deliver.", ""],
  ["gallery", "Gallery", "Field visuals from control rooms, workshops, and marine operations.", ""],
  ["blogs", "Our blogs", "", ""],
  ["about", "About & Why Choose Us", "A practical engineering partner for facilities that need precision, speed, and uptime.", "Novatech Advanced Solutions combines technical expertise, engineering discipline, and a clear understanding of B2B requirements across manufacturing, energy, marine, and industrial cooling sectors."],
  ["services", "Our Services", "Wide engineering coverage from controls to critical spare parts.", "A service network designed for companies that need one partner who understands operations, maintenance, automation, and supply without unnecessary complexity."],
  ["catalog", "Catalog", "Featured products and supply options ready for industrial requirements.", "Browse selected automation, marine, cooling, CNC, and spare parts products, then open the full catalog for filtering and search."],
  ["industries", "Industries We Serve", "Applicable expertise across demanding operating environments.", ""],
  ["contact", "Contact", "Have a project, recurring fault, or equipment request? Talk to the NAS team.", "Send your technical requirements and we will help define the service scope, priorities, and the right next step for execution."],
];

const partners = [
  ["Delta Marine Works", "Marine Operations", "/partners/delta-marine.svg", "Delta Marine Works logo"],
  ["CoreGrid Systems", "Automation Integrator", "/partners/coregrid.svg", "CoreGrid Systems logo"],
  ["Arkan Process", "Industrial Manufacturing", "/partners/arkan-process.svg", "Arkan Process logo"],
  ["Bluebay Logistics", "Port Services", "/partners/bluebay.svg", "Bluebay Logistics logo"],
  ["Nexa Cooling", "Cooling Infrastructure", "/partners/nexa-cooling.svg", "Nexa Cooling logo"],
  ["Falcon Energy Tech", "Energy & Utilities", "/partners/falcon-energy.svg", "Falcon Energy Tech logo"],
  ["Axis Controls", "Controls Partner", "/partners/axis-controls.svg", "Axis Controls logo"],
  ["Vertex Industrial", "Industrial Supply", "/partners/vertex-industrial.svg", "Vertex Industrial logo"],
];

const certifications = [
  ["/certificates/certificate-badge.svg", "ISO 9001", "Quality Management", "Process discipline for delivery consistency."],
  ["/certificates/certificate-badge.svg", "ISO 14001", "Environmental Management", "Operational compliance and environmental controls."],
  ["/certificates/certificate-badge.svg", "ISO 45001", "Occupational Health & Safety", "Safety-first execution for field operations."],
  ["/certificates/certificate-badge.svg", "IEC Ready", "Electrical Standards Alignment", "Design approach aligned with industrial codes."],
  ["/certificates/certificate-badge.svg", "QA/QC", "Inspection Documentation", "Structured checks for installation and handover."],
];

const gallery = [
  ["https://images.unsplash.com/photo-1738918937796-743064feefa1?auto=format&fit=crop&fm=jpg&q=70&w=1200", "Industrial control room with monitoring panels"],
  ["https://images.unsplash.com/photo-1764115424737-25aca6f47835?auto=format&fit=crop&fm=jpg&q=70&w=1200", "CNC workshop and metal fabrication equipment"],
  ["https://images.unsplash.com/photo-1761426112156-21305e806344?auto=format&fit=crop&fm=jpg&q=70&w=1200", "Cargo vessel at sea"],
  ["https://images.unsplash.com/photo-1738918937796-743064feefa1?auto=format&fit=crop&fm=jpg&q=70&w=1200", "Industrial control room with monitoring panels"],
  ["https://images.unsplash.com/photo-1764115424737-25aca6f47835?auto=format&fit=crop&fm=jpg&q=70&w=1200", "CNC workshop and metal fabrication equipment"],
  ["https://images.unsplash.com/photo-1761426112156-21305e806344?auto=format&fit=crop&fm=jpg&q=70&w=1200", "Cargo vessel at sea"],
];

const services = [
  ["Automation & Control", "Scalable control systems for production lines and mission-critical facilities.", "Cpu", ["PLC programming", "SCADA design", "IoT integration", "Industrial cybersecurity"]],
  ["Industrial Services", "Field execution and maintenance that reduce downtime and protect asset availability.", "Settings2", ["Equipment installation", "Predictive maintenance", "Preventive maintenance", "Air compressor service"]],
  ["Marine Services", "Technical support for electrical and mechanical systems onboard marine vessels.", "Ship", ["Generator maintenance", "Electrical panels", "Propulsion systems", "Navigation and communication"]],
  ["Industrial Cooling", "Cooling solutions for factories, vessels, and high-load data center environments.", "Snowflake", ["Industrial cooling", "Marine cooling", "Data center cooling", "Chillers"]],
  ["CNC Repair & Refurbishment", "Restoring machine performance and extending operating life through precise upgrades.", "Gauge", ["Mechanical repair", "Electrical repair", "Legacy system upgrades"]],
  ["Equipment & Spare Parts Supply", "Reliable sourcing aligned with operational requirements and project timelines.", "PlugZap", ["Pumps", "Valves", "Motors", "Generators", "Control panels"]],
];

const aboutCards = [
  ["Reliability", "Clear processes, responsive field support, and dependable outcomes for sensitive operating environments."],
  ["Engineering Expertise", "Qualified technicians and engineers capable of handling complex industrial and marine systems."],
  ["Customer Commitment", "Practical delivery focused on reducing downtime, controlling cost, and meeting each facility's requirements."],
  ["Operational Discipline", "Documented execution, safety awareness, and field coordination for demanding facilities."],
];

const industries = [
  ["Manufacturing", "Factory"],
  ["Energy, Oil & Gas", "Zap"],
  ["Water Pumping Stations", "Droplets"],
  ["Food & Beverage", "Utensils"],
  ["Pharmaceuticals", "FlaskConical"],
  ["Automotive", "Car"],
  ["Building Automation", "Building2"],
];

const footerLinks = [
  ["Home", "#top"],
  ["Partners", "#partners"],
  ["Certifications", "#certifications"],
  ["Gallery", "#gallery"],
  ["About", "#about"],
  ["Services", "#services"],
  ["Catalog", "/catalog"],
  ["Industries", "#industries"],
  ["Contact", "#contact"],
  ["Blog", "/blog"],
];

const catalogProducts = [
  ["plc-control-panel", "PLC Control Panel", "Automation", "Custom-built control panels for production lines, utility systems, and facility automation.", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&fm=jpg&q=72&w=1200", "Electronic control board with industrial components", ["PLC", "Panel wiring", "Factory automation"]],
  ["industrial-pump-assembly", "Industrial Pump Assembly", "Equipment", "Pump packages and replacement assemblies selected for industrial flow and pressure requirements.", "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&fm=jpg&q=72&w=1200", "Industrial technician working with machinery", ["Pumps", "Motors", "Installation support"]],
  ["marine-generator-parts", "Marine Generator Parts", "Marine", "Electrical and mechanical spare parts for onboard generator maintenance and repair work.", "https://images.unsplash.com/photo-1761426112156-21305e806344?auto=format&fit=crop&fm=jpg&q=70&w=1200", "Cargo vessel at sea", ["Generators", "Marine supply", "Electrical parts"]],
  ["cooling-chiller-components", "Cooling Chiller Components", "Cooling", "Critical chiller and cooling system parts for industrial facilities and high-load environments.", "https://images.unsplash.com/photo-1761115435501-bebf019aba54?auto=format&fit=crop&fm=jpg&q=72&w=1200", "Industrial facility with technical cooling infrastructure", ["Chillers", "Cooling systems", "Maintenance"]],
  ["cnc-servo-drive", "CNC Servo Drive", "CNC", "Servo drives and control components used in CNC repair, refurbishment, and system upgrades.", "https://images.unsplash.com/photo-1764115424737-25aca6f47835?auto=format&fit=crop&fm=jpg&q=70&w=1200", "CNC workshop and metal fabrication equipment", ["Servo drives", "CNC repair", "Upgrades"]],
  ["scada-monitoring-kit", "SCADA Monitoring Kit", "Automation", "Monitoring hardware and integration support for clearer visibility across industrial assets.", "https://images.unsplash.com/photo-1738918937796-743064feefa1?auto=format&fit=crop&fm=jpg&q=70&w=1200", "Industrial control room with monitoring panels", ["SCADA", "IoT", "Monitoring"]],
  ["valves-and-fittings", "Valves & Fittings Set", "Spare Parts", "Industrial valves, fittings, and related spare parts sourced to match site specifications.", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&fm=jpg&q=72&w=1200", "Industrial welding and metalwork environment", ["Valves", "Fittings", "Site supply"]],
  ["air-compressor-service-kit", "Air Compressor Service Kit", "Equipment", "Service parts and maintenance support for compressor reliability and reduced downtime.", "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&fm=jpg&q=72&w=1200", "Industrial worker handling equipment in a workshop", ["Compressors", "Service kits", "Maintenance"]],
];

const blogs = [
  ["future-ready-industrial-service-planning", "Future-Ready Industrial Service Planning for Growing Facilities", "A practical starter model for aligning maintenance, automation, and supply needs before growth creates bottlenecks.", "Planning", ["Service Planning", "Facility Growth", "Operations"], "2026-05-07", 4, "NAS Strategy Desk", "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&fm=jpg&q=75&w=1600", "Industrial planning meeting with engineering drawings", "Published", "Industrial Service Planning for Growing Facilities | Novatech", "A practical guide to planning maintenance, automation, and supply workflows for growing industrial facilities.", "https://novatech-nas.ae/blog/future-ready-industrial-service-planning", ["industrial service planning", "facility growth", "maintenance strategy"], ["Growing facilities often add production capacity faster than they update their maintenance and technical support structure.", "A future-ready service plan starts with visibility.", "Facilities that plan this way are better prepared to scale."]],
  ["how-predictive-maintenance-reduces-industrial-downtime", "How Predictive Maintenance Reduces Downtime in Industrial Facilities", "A practical framework for moving from reactive maintenance to scheduled, data-backed interventions.", "Maintenance", ["Predictive Maintenance", "Downtime", "Operations"], "2026-04-18", 6, "NAS Engineering Team", "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&fm=jpg&q=75&w=1600", "Industrial engineer working near plant equipment", "Published", "Predictive Maintenance for Industrial Downtime Reduction | Novatech", "Learn how predictive maintenance programs reduce breakdown risk, improve asset visibility, and protect production uptime.", "https://novatech-nas.ae/blog/how-predictive-maintenance-reduces-industrial-downtime", ["predictive maintenance", "industrial downtime", "asset reliability"], ["Predictive maintenance works when facilities stop treating maintenance as an isolated function.", "Criticality-based planning protects the assets that cause production losses.", "That linkage turns observations into uptime improvement."]],
  ["scada-visibility-for-multi-site-operations", "SCADA Visibility for Multi-Site Operations Without Interface Clutter", "Designing control-room visibility that supports decisions instead of overwhelming operators.", "Automation", ["SCADA", "Monitoring", "Automation"], "2026-03-29", 5, "Automation Division", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&fm=jpg&q=75&w=1600", "Electronic industrial control board", "Published", "SCADA Interface Design for Multi-Site Industrial Operations", "A practical guide to SCADA visibility, alarm design, and reporting structure for multi-site industrial environments.", "https://novatech-nas.ae/blog/scada-visibility-for-multi-site-operations", ["SCADA interface", "industrial monitoring", "automation design"], ["SCADA systems become difficult when design teams prioritize volume over hierarchy.", "A clean strategy starts with a common alarm philosophy.", "Strong SCADA design is about operational control."]],
  ["sourcing-critical-spare-parts-without-project-delays", "Sourcing Critical Spare Parts Without Delaying Technical Projects", "How procurement, engineering, and vendor qualification should align on urgent industrial supply requests.", "Supply Chain", ["Spare Parts", "Procurement", "Supply Chain"], "2026-05-02", 4, "Supply Operations Desk", "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&fm=jpg&q=75&w=1600", "Industrial metalwork and fabrication area", "Scheduled", "Critical Spare Parts Sourcing Strategy for Industrial Projects", "Reduce procurement delays for critical spares with stronger specifications, vendor alternatives, and approval workflows.", "https://novatech-nas.ae/blog/sourcing-critical-spare-parts-without-project-delays", ["spare parts sourcing", "industrial procurement", "project delays"], ["Supply problems usually start before the purchase order.", "A better model is an approved substitution matrix.", "Strong workflows connect commercial speed with technical control."]],
];

await pool.query(schema);

await pool.query(
  `INSERT INTO admins (name, email, password_hash)
   VALUES ($1, $2, $3)
   ON CONFLICT (email) DO NOTHING`,
  ["Main Admin", "admin@admin.com", await hashPassword("123456")],
);

await pool.query(`
INSERT INTO hero (id, eyebrow, title, headline, description, image, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href)
VALUES (1, 'NAS · Novatech Advanced Solutions L.L.C', 'Advanced Industrial Engineering Solutions', 'Marine repair, automation, industrial services, and equipment supply for B2B operations.', 'A qualified team of technicians and engineers supporting industrial and marine facilities with precise service, competitive pricing, and flexible execution from Dubai.', 'https://images.unsplash.com/photo-1748002757537-00ab5114135b?auto=format&fit=crop&fm=jpg&q=75&w=2400', 'Request Consultation', '#contact', 'Explore Services', '#services')
ON CONFLICT (id) DO NOTHING;
`);

await pool.query(`
INSERT INTO settings (key, value) VALUES
('site', $1),
('socials', $2),
('seo', $3)
ON CONFLICT (key) DO NOTHING;
`, [
  json({ logoText: "NAS", logoImage: "", logoAlt: "Novatech Advanced Solutions logo", brandName: "Novatech", brandSubtitle: "Advanced Solutions", favicon: "/favicon.svg", phone: "+971556271982", whatsapp: "+971556290934", email: "novatech.ae@gmail.com", address: "Al Raffa, Dubai, United Arab Emirates" }),
  json([{ platform: "LinkedIn", url: "#" }, { platform: "Instagram", url: "#" }, { platform: "Facebook", url: "#" }]),
  json({
    siteName: "Novatech Advanced Solutions",
    siteUrl: "https://novatech-nas.ae",
    defaultTitle: "Novatech Advanced Solutions | Industrial & Engineering Services",
    titleTemplate: "%s | Novatech Advanced Solutions",
    description: "Industrial engineering, automation, marine service, sourcing, and operational support for modern facilities.",
    keywords: ["industrial engineering", "automation", "marine service", "industrial supply", "Dubai"],
    canonicalPath: "/",
    openGraphTitle: "",
    openGraphDescription: "",
    openGraphImage: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    googleSiteVerification: "",
    robotsIndex: true,
    robotsFollow: true,
    locale: "en_AE",
  }),
]);

for (const [index, item] of sectionContent.entries()) {
  await pool.query(
    `INSERT INTO section_content (section_key, eyebrow, title, description)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (section_key) DO NOTHING`,
    item,
  );
}

for (const [index, item] of partners.entries()) {
  await pool.query(`INSERT INTO partners (name, sector, logo, logo_alt, sort_order) SELECT $1,$2,$3,$4,$5 WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name=$1)`, [...item, index]);
}

for (const [index, item] of certifications.entries()) {
  await pool.query(`INSERT INTO certifications (image, code, title, description, sort_order) SELECT $1,$2,$3,$4,$5 WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE code=$2)`, [...item, index]);
}

for (const [index, item] of gallery.entries()) {
  await pool.query(`INSERT INTO gallery_images (image, alt, sort_order) SELECT $1,$2,$3 WHERE (SELECT COUNT(*) FROM gallery_images) < 6`, [...item, index]);
}

for (const [index, item] of services.entries()) {
  await pool.query(`INSERT INTO services (title, lead, icon, points, sort_order) SELECT $1,$2,$3,$4,$5 WHERE NOT EXISTS (SELECT 1 FROM services WHERE title=$1)`, [item[0], item[1], item[2], json(item[3]), index]);
}

for (const [index, item] of aboutCards.entries()) {
  await pool.query(`INSERT INTO about_cards (title, description, sort_order) SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT 1 FROM about_cards WHERE title=$1)`, [...item, index]);
}

for (const [index, item] of industries.entries()) {
  await pool.query(`INSERT INTO industries (name, icon, sort_order) SELECT $1,$2,$3 WHERE NOT EXISTS (SELECT 1 FROM industries WHERE name=$1)`, [...item, index]);
}

for (const [index, item] of footerLinks.entries()) {
  await pool.query(`INSERT INTO footer_links (label, href, is_visible, sort_order) SELECT $1,$2,TRUE,$3 WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE label=$1)`, [...item, index]);
}

for (const [index, item] of catalogProducts.entries()) {
  await pool.query(
    `INSERT INTO catalog_products (id, name, category, description, image, alt, specs, sort_order)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (id) DO NOTHING`,
    [item[0], item[1], item[2], item[3], item[4], item[5], json(item[6]), index],
  );
}

for (const item of blogs) {
  await pool.query(
    `INSERT INTO blogs (slug, title, excerpt, category, tags, published_at, reading_minutes, author, cover, cover_alt, status, seo_title, seo_description, canonical, seo_keywords, content)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
     ON CONFLICT (slug) DO NOTHING`,
    [item[0], item[1], item[2], item[3], json(item[4]), item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[12], item[13], json(item[14]), json(item[15])],
  );
}

await pool.end();
console.log("PostgreSQL schema and seed completed.");
