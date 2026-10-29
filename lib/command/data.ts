import type { Carrier, SiteDef, SiteId } from "./types";

// Synthetic network shaped like Poornajith's world: a Lund plant feeding
// European DCs, an Asia inbound lane through Rotterdam, and a Gdańsk
// cross-dock. Every figure is illustrative mock data.

export const SITE_SPACING = 170;

export const sites: SiteDef[] = [
  {
    id: "SE-01",
    name: "Lund Plant",
    type: "plant",
    typeLabel: "Plant",
    address: "Ruben Rausings gata, Lund SE",
    origin: [0, 0],
    mapPos: [-6, -14],
    docks: 2,
    spareDocks: 1,
    forklifts: 2,
    chargers: 1,
    capacity: 1800,
    inboundFrom: "Components · Asia",
    history: { delivered: 412, onTime: 398 },
    skus: [
      { id: "fm-module", name: "Filling module", icon: "crate", unitsPerPallet: 2, lowAt: 60 },
      { id: "film-roll", name: "Packaging film roll", icon: "roll", unitsPerPallet: 12, lowAt: 120 },
      { id: "spares-kit", name: "Spare-parts kit", icon: "box", unitsPerPallet: 40, lowAt: 200 },
      { id: "valve-asm", name: "Valve assembly", icon: "drum", unitsPerPallet: 24, lowAt: 80 },
    ],
  },
  {
    id: "DE-01",
    name: "Hamburg DC",
    type: "dc",
    typeLabel: "Distribution center",
    address: "Am Ballinkai, Hamburg DE",
    origin: [SITE_SPACING, 0],
    mapPos: [-2, -4],
    docks: 4,
    spareDocks: 0,
    forklifts: 4,
    chargers: 2,
    capacity: 4200,
    inboundFrom: "Lund Plant",
    history: { delivered: 1290, onTime: 1268 },
    skus: [
      { id: "spares-kit", name: "Spare-parts kit", icon: "box", unitsPerPallet: 40, lowAt: 500 },
      { id: "seal-ring", name: "Sealing rings", icon: "crate", unitsPerPallet: 600, lowAt: 120 },
      { id: "servo", name: "Servo motor", icon: "box", unitsPerPallet: 16, lowAt: 400 },
      { id: "carton", name: "Cardboard cartons", icon: "box", unitsPerPallet: 300, lowAt: 300 },
    ],
  },
  {
    id: "NL-01",
    name: "Rotterdam Cold Chain",
    type: "cold",
    typeLabel: "Cold store",
    address: "Maasvlakte, Rotterdam NL",
    origin: [SITE_SPACING * 2, 0],
    mapPos: [-11, 0],
    docks: 3,
    spareDocks: 1,
    forklifts: 3,
    chargers: 2,
    capacity: 2400,
    inboundFrom: "Port of Rotterdam · Asia",
    history: { delivered: 806, onTime: 774 },
    skus: [
      { id: "dairy-culture", name: "Dairy cultures", icon: "cold", unitsPerPallet: 80, lowAt: 120 },
      { id: "juice-conc", name: "Juice concentrate", icon: "drum", unitsPerPallet: 4, lowAt: 200 },
      { id: "yoghurt", name: "Chilled yoghurt", icon: "cold", unitsPerPallet: 480, lowAt: 160 },
      { id: "frozen-peas", name: "Frozen peas 10 kg", icon: "cold", unitsPerPallet: 60, lowAt: 100 },
    ],
  },
  {
    id: "PL-01",
    name: "Gdańsk Cross-Dock",
    type: "crossdock",
    typeLabel: "Cross-dock",
    address: "Port Północny, Gdańsk PL",
    origin: [SITE_SPACING * 3, 0],
    mapPos: [8, -6],
    docks: 4,
    spareDocks: 0,
    forklifts: 5,
    chargers: 3,
    capacity: 1500,
    inboundFrom: "Hamburg DC",
    history: { delivered: 954, onTime: 917 },
    skus: [
      { id: "carton", name: "Cardboard cartons", icon: "box", unitsPerPallet: 300, lowAt: 150 },
      { id: "spares-kit", name: "Spare-parts kit", icon: "box", unitsPerPallet: 40, lowAt: 120 },
      { id: "film-roll", name: "Packaging film roll", icon: "roll", unitsPerPallet: 12, lowAt: 80 },
      { id: "servo", name: "Servo motor", icon: "box", unitsPerPallet: 16, lowAt: 60 },
    ],
  },
  {
    id: "IT-01",
    name: "Milan Robotics DC",
    type: "robotics",
    typeLabel: "Automated DC",
    address: "Via dell'Innovazione, Milano IT",
    origin: [SITE_SPACING * 4, 0],
    mapPos: [2, 10],
    docks: 4,
    spareDocks: 0,
    forklifts: 3,
    chargers: 2,
    capacity: 3000,
    inboundFrom: "Lund Plant",
    history: { delivered: 1102, onTime: 1057 },
    skus: [
      { id: "servo", name: "Servo motor", icon: "box", unitsPerPallet: 16, lowAt: 200 },
      { id: "spares-kit", name: "Spare-parts kit", icon: "box", unitsPerPallet: 40, lowAt: 300 },
      { id: "valve-asm", name: "Valve assembly", icon: "drum", unitsPerPallet: 24, lowAt: 150 },
      { id: "seal-ring", name: "Sealing rings", icon: "crate", unitsPerPallet: 600, lowAt: 100 },
    ],
  },
];

export const siteById = Object.fromEntries(sites.map((s) => [s.id, s])) as Record<SiteId, SiteDef>;
export const siteIds = sites.map((s) => s.id);

export const carriers: Record<Carrier, { name: string; eyebrow: string; stripe: string; cab: string }> = {
  house: { name: "SD Freight", eyebrow: "SHETTY'S DESK FREIGHT", stripe: "#4f46e5", cab: "#4f46e5" },
  nordline: { name: "Nordline", eyebrow: "NORDLINE LOGISTICS", stripe: "#0d9488", cab: "#f8fafc" },
  cargovia: { name: "Cargovia", eyebrow: "CARGOVIA", stripe: "#f97316", cab: "#f8fafc" },
  bluepeak: { name: "Bluepeak", eyebrow: "BLUEPEAK FOODS", stripe: "#1e3a8a", cab: "#f8fafc" },
};

export const drivers = [
  "Alex Haddad", "Nora Lind", "Sam Okafor", "Lena Vogel", "Marco Bianchi", "Aisha Khan",
  "Jonas Berg", "Ines Duarte", "Piotr Nowak", "Eva Novak", "Tom de Vries", "Maya Iyer",
];

export const operators = [
  ["Zoe Reyes", "Jungheinrich EFG 216"],
  ["Sami Haddad", "Toyota 8FBE18"],
  ["Erik Olsen", "Linde E20"],
  ["Ana Silva", "Still RX20"],
  ["Ravi Menon", "Jungheinrich EFG 216"],
  ["Kasia Wójcik", "Toyota 8FBE18"],
  ["Luca Romano", "Linde E20"],
] as const;

export const customers: { name: string; destination: string }[] = [
  { name: "Oakridge Dairy", destination: "Aarhus, DK" },
  { name: "Halcyon Foods", destination: "Göteborg, SE" },
  { name: "Harbor & Co.", destination: "Antwerp, BE" },
  { name: "Sunvale Grocers", destination: "Utrecht, NL" },
  { name: "Brightwater Bev.", destination: "Bremen, DE" },
  { name: "Alpine Fresh", destination: "Zürich, CH" },
  { name: "Baltic Juice Co.", destination: "Riga, LV" },
  { name: "Lombardia Latte", destination: "Bergamo, IT" },
  { name: "Vistula Market", destination: "Warsaw, PL" },
  { name: "Nordic Pantry", destination: "Oslo, NO" },
];

/** Hard-coded staged pallets that can be inspected in each yard. */
export const stagedPallets: Record<SiteId, { sku: string; quantity: number; weightKg: number; lot: string }[]> = {
  "SE-01": [
    { sku: "valve-asm", quantity: 24, weightKg: 410, lot: "L2601-118" },
    { sku: "spares-kit", quantity: 40, weightKg: 220, lot: "L2601-204" },
    { sku: "film-roll", quantity: 12, weightKg: 380, lot: "L2601-087" },
  ],
  "DE-01": [
    { sku: "servo", quantity: 16, weightKg: 290, lot: "L2601-311" },
    { sku: "seal-ring", quantity: 600, weightKg: 84, lot: "L2601-276" },
    { sku: "carton", quantity: 300, weightKg: 150, lot: "L2601-190" },
  ],
  "NL-01": [
    { sku: "yoghurt", quantity: 480, weightKg: 520, lot: "C2601-044" },
    { sku: "frozen-peas", quantity: 60, weightKg: 600, lot: "C2601-071" },
  ],
  "PL-01": [
    { sku: "carton", quantity: 300, weightKg: 150, lot: "L2601-402" },
    { sku: "spares-kit", quantity: 40, weightKg: 220, lot: "L2601-388" },
    { sku: "servo", quantity: 16, weightKg: 290, lot: "L2601-359" },
  ],
  "IT-01": [
    { sku: "valve-asm", quantity: 24, weightKg: 410, lot: "L2601-505" },
    { sku: "seal-ring", quantity: 600, weightKg: 84, lot: "L2601-517" },
  ],
};
