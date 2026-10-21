// Three re-skins of the same quarter. The model is shared; prices, costs,
// sensitivities and copy change, so the same choice can be right in one
// industry and wrong in another.

export type IndustryId = "food" | "electronics" | "pharma";

export type Industry = {
  id: IndustryId;
  label: string;
  company: string;
  product: string;
  /** One line on what is at stake, shown on the picker. */
  stakes: string;
  /** Units sold in a normal week. */
  volume: number;
  unitPrice: number;
  unitCost: number;
  /** Stock older than this many weeks of cover starts to spoil or lose value. */
  freshWeeks: number;
  /** Euros per unit per week to hold stock. */
  holding: number;
  /** Share of stock above 3 weeks of cover lost each week (expiry, price erosion). */
  obsolescence: number;
  /** Extra euros per unit flown in. */
  airPremium: number;
  /** How hard a lost sale hits customer trust. */
  trustSensitivity: number;
  copy: {
    supplier: string;
    spike: string;
    outage: string;
    shortage: string;
    keyAccount: string;
    tail: string;
  };
};

export const industries: Record<IndustryId, Industry> = {
  food: {
    id: "food",
    label: "Food & Beverage",
    company: "Nordic Oat",
    product: "oat drink",
    stakes: "Short shelf life, thin margins, retailers who delist you for empty shelves.",
    volume: 40000,
    unitPrice: 14,
    unitCost: 9,
    freshWeeks: 2,
    holding: 0.35,
    obsolescence: 0.1,
    airPremium: 6,
    trustSensitivity: 0.9,
    copy: {
      supplier: "the carton supplier in Shenzhen",
      spike: "A TikTok recipe goes viral and a retailer runs a two-for-one promotion.",
      outage: "A typhoon closes Yantian port. Cartons stop shipping.",
      shortage: "Oat harvest failure across the Nordics. Supply is capped at 75% of demand.",
      keyAccount: "the national supermarket chain",
      tail: "independent cafés",
    },
  },
  electronics: {
    id: "electronics",
    label: "Electronics",
    company: "Voltline",
    product: "smart energy meter",
    stakes: "High value, fast price erosion, and chips that every competitor wants too.",
    volume: 4000,
    unitPrice: 120,
    unitCost: 78,
    freshWeeks: 3,
    holding: 2.2,
    obsolescence: 0.05,
    airPremium: 14,
    trustSensitivity: 0.6,
    copy: {
      supplier: "the board assembler in Taiwan",
      spike: "A government subsidy for smart meters is announced overnight.",
      outage: "An earthquake halts the assembler's line for three weeks.",
      shortage: "A global chip allocation caps your supply at 75% of demand.",
      keyAccount: "the national utility",
      tail: "online installers",
    },
  },
  pharma: {
    id: "pharma",
    label: "Pharma",
    company: "Medivale",
    product: "insulin pen",
    stakes: "Cold chain, regulated suppliers, and patients who cannot wait for stock.",
    volume: 8000,
    unitPrice: 60,
    unitCost: 30,
    freshWeeks: 4,
    holding: 0.9,
    obsolescence: 0.02,
    airPremium: 9,
    trustSensitivity: 1.6,
    copy: {
      supplier: "the API manufacturer in Hyderabad",
      spike: "A competitor recalls its pen. Pharmacies switch to you overnight.",
      outage: "An inspection finding halts the API plant's releases.",
      shortage: "Cold-chain capacity is short across Europe. Supply is capped at 75%.",
      keyAccount: "the national health tender",
      tail: "private pharmacies",
    },
  },
};

export const industryList = Object.values(industries);
