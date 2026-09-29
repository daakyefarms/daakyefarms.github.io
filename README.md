# 🐖 Daakye Legacy Farms Website (@dl__farms)

Official multi-page website and digital storefront for **Daakye Legacy Farms**, a family-run, 100% organically fed pig farm based in **Nsawam, Ghana**.

---

## 🌟 About Daakye Legacy Farms

* **Brand Tagline:** *"Family-run pig farm 🐷 | Organically fed 🌱 | Hygienically Processed 🧼✨ | From our farm to your table 🍽️"*
* **Instagram:** [@dl__farms](https://www.instagram.com/dl__farms)
* **Farm Location:** Nsawam, Eastern Region, Ghana 🇬🇭
* **Direct Contacts:** 
  * `+233 24 321 2359` (Primary & WhatsApp)
  * `+233 20 644 4261`
  * `+233 55 004 9966`
* **Delivery Zones:** Nsawam, Pokuase, Amasaman, Greater Accra Metropolis, East Legon, Tema, and Koforidua.

---

## 📁 Multi-Page Website Architecture

The website is architected into 5 dedicated, responsive pages sharing consistent branding, header navigation, persistent shopping cart, and WhatsApp integrations:

| File | Page Name | Description & Key Features |
| :--- | :--- | :--- |
| **[`index.html`](index.html)** | **Home** | Hero section with gradient farm overlay, Quick Order Cost Calculator, trust badges, top seller cut highlights, customer reviews, and live Instagram feed preview. |
| **[`about.html`](about.html)** | **Our Story** | Narrative of Daakye Legacy Farms, farm history in Nsawam, animal welfare standards, bio-security measures, and community mission. |
| **[`products.html`](products.html)** | **Pork Cuts & Stock** | Complete catalog with category filters (*All*, *Fresh Pork Cuts*, *Specialty Cuts*, *Live Piglets*), weight & unit price selectors, and direct order buttons. |
| **[`quality.html`](quality.html)** | **Quality Standards** | In-depth breakdown of the 4 Pillars of Excellence: 100% Organic Diet, Veterinary Supervision, Sanitary Slaughter & Sealing, and Insulated Cold-Chain Delivery. |
| **[`contact.html`](contact.html)** | **Contact Us** | Direct phone lines, Nsawam farm location details, delivery schedules, and pre-formatted WhatsApp order inquiry form. |

---

## 🖼️ Media & Asset Directory (`assets/images/`)

All images are authentic, high-resolution photography dedicated to Daakye Legacy Farms:

* **`assets/images/logo.jpg`** — Official brand logo featuring the gold pig emblem framed by organic harvest wheat and laurel leaves.
* **`assets/images/farm.jpg`** — Modern organic pig farm pens in Nsawam with natural ventilation and clean straw bedding.
* **`assets/images/pork_chops.jpg`** — Fresh prime bone-in pork chops with natural marbling on butcher paper with sea salt and thyme.
* **`assets/images/pork_ribs.jpg`** — Fresh, meaty spare ribs cutlet ready for grilling and slow-cooked Ghanaian pepper soups.
* **`assets/images/pork_belly.jpg`** — Succulent layered pork belly slab for crackling roasts and bacon slicing.
* **`assets/images/trotters.jpg`** — Cleaned, singed, and prepped fresh pork trotters (feet) rich in natural collagen.
* **`assets/images/piglets.jpg`** — Healthy 8-week vaccinated weaner piglets playing in straw bedding for commercial breeding stock.

---

## ⚡ 21st-Century UI & Interactivity Features

1. **Persistent Cart Across All Pages:**
   * Utilizes browser `localStorage` (`dl_cart`), so items added on `products.html` remain saved in the cart when navigating to `about.html`, `quality.html`, or `index.html`.
2. **Interactive Quick-Order Calculator:**
   * Real-time calculation in Ghanaian Cedi (GH₵) with instant 1-click WhatsApp order dispatch.
3. **Off-Canvas Shopping Cart Drawer:**
   * Shows itemized lists, quantity adjusters (`+` / `-`), auto-calculated subtotal, and formatted WhatsApp message generation.
4. **Pre-filled 1-Click WhatsApp Ordering:**
   * All order buttons format items, quantities, and customer details directly into a WhatsApp chat message directed to `+233 24 321 2359`.
5. **Floating Quick-Contact Button:**
   * Persistent floating WhatsApp button on mobile and desktop for ordering at any scroll depth.
6. **Smooth Motion & 60 FPS Performance:**
   * CSS keyframe animations and Intersection Observer reveals (`fade-in-up`, `scale-in`) with zero external JavaScript bloat.

---

## 🚀 Local Development & Preview

Open any `.html` file directly in your browser, or start a local HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node / npx
npx serve
```
Then visit `http://localhost:8000` in your browser.

---

## 🌐 1-Click Deployment Options

### Netlify (Recommended)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop this project folder.
3. Your site is live instantly with an SSL certificate!

### Vercel
```bash
npx vercel
```

### GitHub Pages
1. Push this repository to GitHub.
2. Under **Settings > Pages**, set the branch to `main` (or `master`) and directory to `/ (root)`.

---

## 📄 License & Credits
© 2026 **Daakye Legacy Farms** (@dl__farms). All rights reserved.
Built for the Daakye Legacy Farms community in Nsawam, Ghana.
