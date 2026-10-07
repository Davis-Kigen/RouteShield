# RouteShield Nairobi

A high-contrast civic tech transit platform designed for Nairobi commuters. RouteShield addresses peak-hour matatu fare surges and late-night boarding safety by providing real-time fare transparency, verified streetlit safe boarding stages, and zero-data USSD fallback access.

---

## The Problem

- **Unpredictable Surge Pricing:** Commuters navigating major CBD terminals (Railways, Kencom, Ambassador, OTC, Koja) often face arbitrary 200–300% fare spikes during peak rain or evening rush hours without advance notice.
- **Off-Peak & Nighttime Safety:** Navigating to unlit or isolated stages after dark exposes commuters to personal safety risks.
- **Connectivity Gaps:** When mobile data bundles run out or 4G signals degrade in congested terminals, standard transit web apps become inaccessible.

---

## Core Capabilities

- **Editorial Civic Interface:** Built with a high-contrast ceramic white, ink-black, and signal-yellow palette tailored for outdoor daylight and low-light night readability.
- **Corridor Price Caps & Live Crowdsourcing:** Real-time visibility into regulated off-peak vs. peak fare ceilings across major corridors (Rongai, Thika Road, Ngong Road, Jogoo Road, Waiyaki Way) with crowdsourced reporting.
- **Streetlit Safe Stages & Connected Walkways:** Leaflet-powered maps featuring verified high-mast floodlit stages, police post proximities, active CCTV points, and high-visibility dashed transit walkway corridors.
- **Discreet Safety Actions:** 1-tap WhatsApp emergency stage broadcast with pre-filled Google Maps pins, direct police dispatch dialing (999/112), and simulated web escort signaling.
- **Zero-Data USSD Access (`*384*123#`):** Interactive offline USSD dialer simulation allowing access to corridor fares, stage locations, and distress signaling without an active internet bundle.
- **Offline PWA Engine:** Service worker precaching (`Workbox`) and `localStorage` report buffering to persist live fare submissions even when offline.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide React
- **Mapping:** Leaflet, React-Leaflet, OpenStreetMap Carto tiles
- **PWA / Offline:** Vite PWA Plugin, Workbox, LocalStorage Fallback Buffering
- **Backend Protocol:** Express.js, SQLite, Africa's Talking USSD protocol simulation

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/your-username/RouteShield.git](https://github.com/your-username/RouteShield.git)
   cd RouteShield
install dependencies : npm install
Start development server: npm run dev
Build for production: npm run build
Preview production build: npm run preview
USSD Dial Codes (*384*123#)
RouteShield incorporates an Africa's Talking-compatible USSD navigation tree for non-smartphone or zero-data accessibility:

1 — Check Peak & Off-Peak Fare Caps by Corridor

2 — Locate Nearest Lit Safe Stage & Police Post

3 — Report Current Live Matatu Fare

4 — Trigger Emergency Escort SMS Beacon

License
MIT License. Built for Nairobi commuter safety and transit transparency.
