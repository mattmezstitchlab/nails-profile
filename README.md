# NÁLA — Custom Press-On Nails

> Website of custom nails profile and send to girls all over the world ✦

Luxury handmade press-on nails, made to your exact size and shipped worldwide.

**Live:** `index.html` (static site, no build required)

### Features
- Editorial luxury design (cream / blush / ink + gold)
- Filterable gallery (Chrome, French, Jewel, Coquette, Aura)
- Shop tiers: Essential $45 / Atelier $69 / Haute $98
- 3-step process: Measure → Design → Ship
- Worldwide DHL Express (40+ countries, free over $89)
- Custom order form (Instagram / WhatsApp flow)
- Sizing guide, reviews, about

### Run locally
```bash
python3 -m http.server 8000
# or
npx serve .
```

### Structure
```
index.html      # Full site (Tailwind CDN, vanilla JS)
assets/         # Hero + 6 nail designs + artist portrait
```

### Customize
- Update links: search `wa.me`, `instagram.com` in `index.html`
- Replace `hello@nala-nails.com` and phone number
- Edit pricing in Shop section
- Add more gallery items in the `items` array in `<script>`

Handmade with ♡ for girls all over the world.
