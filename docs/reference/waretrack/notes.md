# WareTrack reference notes

Source: Dilum Sanjaya's WareTrack demo (x.com/DilumSanjaya/status/2106426962738880879), a 72 s screen recording at 624×360. I reviewed 36 frames, one every 2 s. The video and frames are third-party content and are **not** committed. These notes describe what they show, so the Supply Chain Command lab (`/lab/supply-chain-twin`) can match the look and behaviour.

## Overall feel
- It reads as industrial software that plays like a strategy game. The world is bright, airy and low-poly, with soft shadows and an ambient-occlusion look.
- The camera is a perspective, slightly isometric 3/4 view. It glides between targets: a selected entity, or another site entirely, which you reach by flying over the city.
- The UI floats over the canvas as white cards with soft drop shadows, rounded corners of about 12–16 px, and small 11–13 px type.

## World
- **Ground and roads:** the ground is a very light lavender-white. Roads are pale blue-grey with white lane dashes and kerbs.
- **Scenery:** green lollipop trees line the roads, and metal mesh fences enclose the yards. Each yard is surrounded by city blocks of low offices and apartment boxes.
- **Yard surface:** yellow dashed parking and staging bays are marked on the ground. Tan cardboard boxes sit on wooden pallets, next to blue crate stacks and steel racks.
- **Pins:** blue map pins (sphere-and-cone) hover over staged pallets.
- **Warehouses:** the walls are light-grey corrugated panels with a royal-blue roof and trim. Roll-up dock doors have blue frames, with boxes visible inside, and the facade carries a logo sign. Each site type has its own shape:
  - **Depot** (Riverside Hub): blue sheds, outdoor racks and a teal shipping container.
  - **DC** (Northgate): a long hall with 4 docks and a logo sign.
  - **Cold store** (Eastport): a white roof with grids of rooftop AC/condenser units, plus tanks and silos.
  - **Cross-dock** (Southfield): a long hall with in and out doors along one side, and a forklift charging corner.
  - **Robotics hub** (Westgate): a white hall with blue edge trim.
- **Vehicles:**
  - **Forklifts:** yellow bodies, black masts and an orange-vested operator.
  - **House trucks:** a blue cab and a white box trailer with the house logo.
  - **Carrier trucks:** a white cab and a white trailer with coloured stripes and a wordmark: Nordline teal, Cargovia orange, Bluepeak navy.
  - **Motion:** trucks drive the road, turn into the yard, and reverse onto a dock.

## Selection
- **Brackets:** a selected entity gets blue corner brackets, like a 3D bounding box.
- **Chip:** a blue chip floats above it, for example "FL-10 · Unloading truck", "TRK-2603 · Reversing" or "TRK-2481 · En route".
- **Planned path:** a selected inbound truck shows a blue dotted path along the road to its dock.

## UI layout (desktop)
- **Top bar (white, full width):**
  - Left: a logo cube and the wordmark.
  - Centre-left: a search pill reading "Search sites, trucks, forklifts, pallets, shipments…" with a `/` key hint.
  - Centre-right: a site chip, for example "[WH-01] Riverside Hub · 78% full · 1/2 docked", with a next-site arrow and a dropdown.
  - Right: a green "● Live 09:40" pill, a bell with a red dot, and an avatar with name and role ("Alex Chen · Operations Manager").
- **KPI cards (three, top left):** each has a blue icon tile, a label, a big number, a green delta and a sub-line:
  - Stock on hand: "1,412", "+15", "pallets · WH-01".
  - Trucks on site: "1", "+1", "1 inbound · WH-01".
  - On-time delivery: "96.6%", "+0.4%", "last 30 days · WH-01".
- **Map controls:** a narrow vertical card left of the inspector, with zoom +, zoom −, rotate left, rotate right and home.
- **Inspector card (top right, about 290 px wide):** the header has a type eyebrow in small caps blue (for example "DEPOT · WH-01"), the name in bold, a subtitle line, and pin, pop-out and close actions. It has five variants:
  - **Site:**
    - A status chip ("Operational") followed by "1 docked · 1 arriving · 3 staged".
    - A 2×2 grid of tiles: Stock on hand "1,412 / 1,800" with a blue bar, Truck bays "2 / 2 busy" with a green bar, "Outbound today 23 trucks" and "Put-aways today 15 pallets".
    - An Inventory list: SKU icon, name, units right-aligned, and an "In Stock" (green) or "Low Stock" (amber) badge.
    - A Forklift fleet row: "FL-01 Loading TRK-2051 at Bay 1" with a progress bar and %, plus an "n/m working" count.
  - **Forklift:** "FL-10", the operator and model ("Zoe Reyes · Jungheinrich EFG 216"), and a status chip ("Unloading truck", "Loading truck" or "Charging at bay") with a detail line. A battery bar shows %, followed by rows for Carrying, Moves today, Speed (km/h), Charger and Site.
  - **Truck:** a carrier eyebrow ("WARETRACK FREIGHT", "NORDLINE LOGISTICS", "CARGOVIA", "BLUEPEAK FOODS"), the ID "TRK-2205", the driver and plate, and a status chip with detail ("Unloading · WH-04 · In 1 · 3/6 pallets", "En route · To WH-04 · ETA 1 min", "Docking · Reversing into Bay 3") with a progress bar. Rows follow for Shipment (blue link), Customer, Destination, ETA, Speed, Bay and Cargo ("3/7 pallets · 1.4 t").
  - **Pallet:** "PALLET · PPE", "Safety Helmet", the ID, a "Staged" chip and its location, then rows for Quantity, Gross weight, Location, Lot, Received and Site.
  - **Charger:** "CHARGER · WH-04", "C1", status "Free" or "In use", rows for Forklift (with battery), Sessions today, Energy today (kWh), Charge rate (%/minute) and Site.
- **Shipment Tracking (bottom left, wide):**
  - Title row: "Shipment Tracking", with the truck ID and carrier on the right.
  - Stepper: Order Confirmed → Picked → Loading 2/6 or Loaded → In Transit → Delivered, or Unloading 3/6 for inbound. Done steps are filled blue, the current step has a ring, and future steps are grey. Each step shows a time below it, and future steps show an ETA.
  - Mini-card on the right: "#SHP-78442", "To: Philadelphia, PA", a status chip, "WH-01 · Bay 1 · 13 min left", a truck thumbnail and a chevron.
- **Ops card (bottom right):**
  - Tabs: "Docks 2/2 · Forklifts 1/2 · Trucks 2", with the site name on the right.
  - Rows show the bay or vehicle ID with a small subtitle, then "● TRK-2051 · WareTrack", a status pill, a mini progress bar with "2/6" or a time ("3 min"), and a chevron.
  - Status pills: Loading/Unloading in green, Docking in blue, En route in outlined blue, At gate and Charging in amber, Available in grey.
  - Clicking any row selects the entity and flies to it.

## Behaviour
- **Selection:** selecting from a list, a pin or the map syncs every panel. The inspector content changes, and the tracking card follows the selected truck's shipment.
- **Site switching:** switching site with the chip or the arrow flies the camera across the city to the next yard, and all panels change to that site.
- **Live data:** the clock ticks, KPIs carry deltas, forklift battery drains, and truck progress counts up per pallet.
- **Truck lifecycle:** en route → at gate → docking/reversing → loading or unloading n/N → departing.
- **Forklift lifecycle:** loading or unloading truck → charging at bay (when the battery is low) → idle.
