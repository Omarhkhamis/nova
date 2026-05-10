export type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  alt: string;
  specs: string[];
};

export const catalogProducts: CatalogProduct[] = [
  {
    id: "plc-control-panel",
    name: "PLC Control Panel",
    category: "Automation",
    description: "Custom-built control panels for production lines, utility systems, and facility automation.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&fm=jpg&q=72&w=1200",
    alt: "Electronic control board with industrial components",
    specs: ["PLC", "Panel wiring", "Factory automation"],
  },
  {
    id: "industrial-pump-assembly",
    name: "Industrial Pump Assembly",
    category: "Equipment",
    description: "Pump packages and replacement assemblies selected for industrial flow and pressure requirements.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&fm=jpg&q=72&w=1200",
    alt: "Industrial technician working with machinery",
    specs: ["Pumps", "Motors", "Installation support"],
  },
  {
    id: "marine-generator-parts",
    name: "Marine Generator Parts",
    category: "Marine",
    description: "Electrical and mechanical spare parts for onboard generator maintenance and repair work.",
    image:
      "https://images.unsplash.com/photo-1761426112156-21305e806344?auto=format&fit=crop&fm=jpg&q=70&w=1200",
    alt: "Cargo vessel at sea",
    specs: ["Generators", "Marine supply", "Electrical parts"],
  },
  {
    id: "cooling-chiller-components",
    name: "Cooling Chiller Components",
    category: "Cooling",
    description: "Critical chiller and cooling system parts for industrial facilities and high-load environments.",
    image:
      "https://images.unsplash.com/photo-1761115435501-bebf019aba54?auto=format&fit=crop&fm=jpg&q=72&w=1200",
    alt: "Industrial facility with technical cooling infrastructure",
    specs: ["Chillers", "Cooling systems", "Maintenance"],
  },
  {
    id: "cnc-servo-drive",
    name: "CNC Servo Drive",
    category: "CNC",
    description: "Servo drives and control components used in CNC repair, refurbishment, and system upgrades.",
    image:
      "https://images.unsplash.com/photo-1764115424737-25aca6f47835?auto=format&fit=crop&fm=jpg&q=70&w=1200",
    alt: "CNC workshop and metal fabrication equipment",
    specs: ["Servo drives", "CNC repair", "Upgrades"],
  },
  {
    id: "scada-monitoring-kit",
    name: "SCADA Monitoring Kit",
    category: "Automation",
    description: "Monitoring hardware and integration support for clearer visibility across industrial assets.",
    image:
      "https://images.unsplash.com/photo-1738918937796-743064feefa1?auto=format&fit=crop&fm=jpg&q=70&w=1200",
    alt: "Industrial control room with monitoring panels",
    specs: ["SCADA", "IoT", "Monitoring"],
  },
  {
    id: "valves-and-fittings",
    name: "Valves & Fittings Set",
    category: "Spare Parts",
    description: "Industrial valves, fittings, and related spare parts sourced to match site specifications.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&fm=jpg&q=72&w=1200",
    alt: "Industrial welding and metalwork environment",
    specs: ["Valves", "Fittings", "Site supply"],
  },
  {
    id: "air-compressor-service-kit",
    name: "Air Compressor Service Kit",
    category: "Equipment",
    description: "Service parts and maintenance support for compressor reliability and reduced downtime.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&fm=jpg&q=72&w=1200",
    alt: "Industrial worker handling equipment in a workshop",
    specs: ["Compressors", "Service kits", "Maintenance"],
  },
];

export const catalogCategories = ["All", ...Array.from(new Set(catalogProducts.map((product) => product.category)))];
