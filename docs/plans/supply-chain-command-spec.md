# Supply Chain Command (`/lab/supply-chain-twin`)

This page replaces the V1 twin lab. It follows Dilum Sanjaya's WareTrack demo: industrial software that plays like a strategy game, built with React, Next.js and React Three Fiber. The WareTrack notes are in `docs/reference/waretrack/notes.md`. The video itself and its frames are third-party material and are not in the repo.

## Scope
- **Network view:** a stylised North Europe board showing five sites, the lanes between them, trucks on the road and a ship on the Asia sea lane. Clicking a site flies the camera into its yard.
- **Yard view:** one low-poly yard per site type:
  - SE-01 Lund Plant (manufacturing)
  - DE-01 Hamburg DC
  - NL-01 Rotterdam Cold Chain
  - PL-01 Gdańsk Cross-Dock
  - IT-01 Milan Robotics DC

  Each yard has a road, fence, trees, city blocks, docks with status lights, staged pallets with pins, chargers and racks.
- **Full game:** one shift runs from 06:00 to 14:00, which takes about 8 minutes of real time.
  - **Orders:** order cards (Accept, Rush or Decline) on a 16 s timer.
  - **Incidents:** each one offers two options and picks the second automatically after 20 s. The incidents are dock fault, forklift breakdown, spill, late truck, order surge, low stock and port delay.
  - **Scoring:** points, an on-time combo, and stars at the end of the shift.
  - **Upgrades:** credits buy an extra bay, a forklift, fast charging or a larger cold room.
  - **Save:** progress is stored in `localStorage` under `shettysdesk.command.v1`.
- **Hands-on control:** turn autopilot off and you dispatch trucks and forklifts yourself, for ×1.25 points. You can also send a forklift to charge or take a dock out of service.

## Architecture
- **`lib/command/`**
  - **Model and layout:** `types.ts` holds the world model. `data.ts` holds the seeded network. `layout.ts` holds yard geometry and CatmullRom truck paths: drive past the bay, reverse in, depart.
  - **Logic:** `sim.ts` is the seeded tick (truck lifecycle, forklift legs and charging, orders, events, scoring). `kpis.ts` holds pure read models. `poses.ts` maps state to world positions.
  - **Store:** `store.ts` is a Zustand plus immer store that ticks at 10 Hz.
  - **Tests:** `sim.test.ts` runs under `npm test`.
- **`components/command/scene/`**
  - The scene is client-only, loaded through `next/dynamic`.
  - Vehicles read their poses from the store inside `useFrame`, so the scene is display-only.
  - Repeated props are instanced.
  - Selection shows corner brackets, a projected DOM chip and a dotted planned path.
  - The fly-to camera pulls back while it travels.
  - Lite mode applies on small screens and for reduced motion: no shadows, lower DPR and fewer city blocks.
- **`components/command/ui/`:** the top bar (search with `/`, site switcher, network toggle, score, clock and speed, notifications), KPI cards, map controls, the inspector (site, truck, forklift, pallet, charger, dock), shipment tracking, the ops tabs, order and incident cards, and the shift summary. On mobile the panels move into a bottom sheet.

## Limits
- It is a game, not a planning tool, and all data is synthetic.
- Times are compressed: one real second equals one simulated minute, and vehicles move at real-time speeds.
- Each SKU has one pallet type.
- Only one truck manoeuvres in a yard at a time, which keeps paths from crossing.
