import type { Network } from "./model";

// Synthetic, illustrative network loosely shaped like a European equipment
// supply chain. Positions are schematic board coordinates, not geography.
export const defaultNetwork: Network = {
  unitValue: 420,
  holdingRatePerDay: 0.25 / 365,
  sites: [
    { id: "S1", kind: "supplier", name: "Electronics supplier", country: "China", pos: [9, -5] },
    { id: "S2", kind: "supplier", name: "Materials supplier", country: "Portugal", pos: [-7.5, 5] },
    { id: "P1", kind: "plant", name: "Lund plant", country: "Sweden", pos: [-2, -5], capacity: 265, source: "S1" },
    { id: "P2", kind: "plant", name: "Modena plant", country: "Italy", pos: [1, 4], capacity: 225, source: "S2" },
    { id: "D1", kind: "dc", name: "Hamburg DC", country: "Germany", pos: [-4, 0], source: "P1" },
    { id: "D2", kind: "dc", name: "Milan DC", country: "Italy", pos: [4, 1], source: "P2" },
    { id: "M1", kind: "market", name: "Nordics", country: "SE · DK · NO", pos: [-8, -3], demandMean: 90, demandSd: 22, source: "D1" },
    { id: "M2", kind: "market", name: "DACH", country: "DE · AT · CH", pos: [-7, 1.5], demandMean: 120, demandSd: 30, source: "D1" },
    { id: "M3", kind: "market", name: "Iberia", country: "ES · PT", pos: [6, 6], demandMean: 70, demandSd: 20, source: "D2" },
    { id: "M4", kind: "market", name: "Italy", country: "IT", pos: [8, 1.5], demandMean: 110, demandSd: 28, source: "D2" },
  ],
  lanes: [
    { from: "S1", to: "P1", mode: "sea", leadTime: 28, km: 19000, costPerUnit: 6 },
    { from: "S2", to: "P2", mode: "road", leadTime: 6, km: 2300, costPerUnit: 9 },
    { from: "P1", to: "D1", mode: "road", leadTime: 3, km: 300, costPerUnit: 4 },
    { from: "P2", to: "D2", mode: "road", leadTime: 2, km: 200, costPerUnit: 3 },
    { from: "D1", to: "M1", mode: "road", leadTime: 1, km: 400, costPerUnit: 2 },
    { from: "D1", to: "M2", mode: "road", leadTime: 1, km: 300, costPerUnit: 2 },
    { from: "D2", to: "M3", mode: "road", leadTime: 1, km: 900, costPerUnit: 3 },
    { from: "D2", to: "M4", mode: "road", leadTime: 1, km: 250, costPerUnit: 2 },
  ],
};
