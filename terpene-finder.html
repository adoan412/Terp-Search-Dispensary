<!DOCTYPE html>
<html lang="en" data-theme="noir">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>The Terp Search (Themed) — Organic Remedies</title>

<!--
================================================================================
  THE TERP SEARCH — MAINTENANCE GUIDE
  Organic Remedies · PA · Multi-store (default Bethel Park #4365)
  v3 built 2026-04-16
================================================================================

  WHAT THIS IS
  ------------
  Single-file touch-friendly counter webapp. Patient-Care Consultant (PCC) walks
  a patient through: Category → (subtype/consistency) → Size/Packs → Effects
  (terpenes OR cannabinoids for edibles) → Results, builds a cart, scans QR to
  phone to get a pick list.

  STORES (store_id → slug)
  ------------------------
  Use the store-picker button in the header. All locations share the same
  Algolia keys; only store_id changes. Every category/subtype config below
  applies to every store.
    Paoli         4139
    Enola         1877
    York          1876
    McKnight Rd   3906
    Chambersburg  1878
    Bethel Park   4365

  HOW TO RUN IT
  -------------
  Double-click the html file, or `npx serve .` from its folder.

  ALGOLIA CONFIG
  --------------
  App ID:  VFM4X0N23A  (stable across years)
  Host:    search.iheartjane.com
  Index:   menu-products-production
  API Key: rotates. If broken, fetch a live store menu page, view source, grep
           for `algoliaApiKey`. Replace API_KEY below.
  We use /1/indexes/*/queries (multi-query) with one request per `kind` to
  bypass Algolia's 1000-hit cap (store has ~1,350 products).

  DATA SHAPES
  -----------
  Product fields we use:
    name, brand, kind, category (sativa/indica/hybrid/cbd),
    percent_thc, image_urls[], root_subtype, product_subtype, description
    price_<size> / discounted_price_<size> for sizes:
      each, half_gram, gram, two_gram, eighth_ounce,
      quarter_ounce, half_ounce, ounce
    lab_results[].lab_results[] with {unit_id, value} — terpenes AND
      cannabinoids live here. We extract both now (edibles use cannabinoids).

  FLOW BY CATEGORY
  ----------------
  flower   → size → effects(terp)     → results  (side filter: ground/buds/all)
  vape     → size → effects(terp)     → results  (side filter: disposable/pod/cart)
  extract  → consistency(multi) → effects(terp) → results
  edible   → edibletype(multi) → cannabinoids → extracttype(single) → results
             (side filter: pack-size 2pk/15pk/20pk/40pk)
  topical  → topicaltype(multi) → results
  gear     → geartype(single) → results

  SIZE LABELS (flower slang)
  --------------------------
  a g / cut (eighth) / quarter / halfie / zip. Note `two_gram` key is actually
  a 4.2g pre-pack at this retailer — displayed as 4.2g, not 2g.

  SUBTYPE DETECTION
  -----------------
  extractSubtype(p) checks root_subtype, product_subtype, category, then
  falls back to keyword match on name. Add patterns in SUBTYPE_PATTERNS.

  STONER MODE (Konami ↑↓↑↓←→←→ B A Enter)
  ---------------------------------------
  Toggles NAUGHTY_STRINGS + random "add to cart" label variants + speech-bubble
  stickers on cards with high THC% or sale price. Persists in
  localStorage.terpfinder_naughty.

  QR FORMAT
  ---------
  Plain text, grouped and ordered per user spec:
    Flower / Capsules / Tinctures / Patches / RSO / Concentrates / Troches / Vapes
  Each line: `Nx TYPE GROWER STRAIN SIZE`.
  See buildCartText().

  THEMES
  ------
  CSS blocks keyed `[data-theme="id"]`. Default is 'noir' (black + #8bc541).
  Add a swatch to THEMES array. Persists in localStorage.terpfinder_theme.

================================================================================
-->

<style>
  /* ─── Theme vars ───────────────────────────────────────── */
  :root {
    --bg-deep: #050505;
    --bg: #0a0a0a;
    --surface: #141414;
    --surface-alt: #1c1c1c;
    --text: #ffffff;
    --text-muted: #9a9a9a;
    --border: #262626;
    --accent: #8bc541;
    --accent-dark: #6ba32d;
    --accent-soft: #1b2d0e;
    --hot: #ff6b6b;
    --hot-soft: #3a1414;
    --indica: #a58cff;
    --indica-soft: #1e1835;
    --sativa: #ffb347;
    --sativa-soft: #2a1f0e;
    --hybrid: #6ad79d;
    --hybrid-soft: #0e2a1c;
    --cbd: #6ab7ff;
    --cbd-soft: #0e1e2e;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4);
    --shadow: 0 4px 16px rgba(0,0,0,0.55);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.7);
    --radius: 16px;
    --radius-lg: 24px;
    --radius-sm: 10px;
  }

  /* Noir = default, already set above via :root */
  [data-theme="earth"] {
    --bg-deep: #E8E2D0; --bg: #F5F2EA; --surface: #FFFFFF; --surface-alt: #FAF7EE;
    --text: #1B1B17; --text-muted: #6B685E; --border: #E3DDCB;
    --accent: #1D9E75; --accent-dark: #0F6E56; --accent-soft: #E1F5EE;
    --hot: #D94F3B; --hot-soft: #FCE5E0;
    --indica: #7B6BC4; --indica-soft: #EEECFE;
    --sativa: #D89233; --sativa-soft: #FBEFD6;
    --hybrid: #3FA580; --hybrid-soft: #DCF2E8;
    --cbd: #4A8FC7;    --cbd-soft: #DFEEFA;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.14);
  }
  [data-theme="midnight"] {
    --bg-deep: #070A14; --bg: #0E1220; --surface: #181E33; --surface-alt: #1F2640;
    --text: #F3F4F8; --text-muted: #9BA2B8; --border: #2A3150;
    --accent: #7D9BFF; --accent-dark: #5E7BE8; --accent-soft: #212A45;
  }
  [data-theme="sunset"] {
    --bg-deep: #F7E4D0; --bg: #FFF3EA; --surface: #FFFFFF; --surface-alt: #FFE9D9;
    --text: #2A1C12; --text-muted: #7A5A43; --border: #F2DAC5;
    --accent: #E56F3C; --accent-dark: #B84B1B; --accent-soft: #FEE6D4;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.14);
  }
  [data-theme="lavender"] {
    --bg-deep: #E7DCF5; --bg: #F4EFFB; --surface: #FFFFFF; --surface-alt: #EAE1F6;
    --text: #231531; --text-muted: #6E5A84; --border: #DACCEE;
    --accent: #8664C6; --accent-dark: #60429E; --accent-soft: #E8DDF8;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.14);
  }
  [data-theme="ocean"] {
    --bg-deep: #D5EAEC; --bg: #E8F4F5; --surface: #FFFFFF; --surface-alt: #D7EDEF;
    --text: #0F2A2C; --text-muted: #4C7376; --border: #C2DDE0;
    --accent: #0E8A90; --accent-dark: #06636A; --accent-soft: #D5ECEE;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.14);
  }
  [data-theme="mono"] {
    --bg-deep: #E6E6E2; --bg: #F3F3F0; --surface: #FFFFFF; --surface-alt: #EAEAE6;
    --text: #111; --text-muted: #666; --border: #D9D9D3;
    --accent: #222; --accent-dark: #000; --accent-soft: #E5E5E1;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow: 0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.14);
  }

  /* ═════════════════════════════════════════════════════════════════
     DESIGNER-INSPIRED THEMES (normal mode, available to all users)
     Each theme supplies color vars PLUS a few decorative overrides
     keyed off [data-theme="X"] so the visual feel is distinct, not
     just a palette swap.
     ═══════════════════════════════════════════════════════════════ */

  /* ─── BAUHAUS ─── Herbert Bayer / Moholy-Nagy
     Primary red + mustard + cobalt on ivory; bold sans; geometric. */
  [data-theme="bauhaus"] {
    --bg-deep: #EFEAD6; --bg: #F6F1DE; --surface: #FFFFFF; --surface-alt: #F0EBD6;
    --text: #0B0A08; --text-muted: #5A5540; --border: #2a2a2a;
    --accent: #E63946; --accent-dark: #B32633; --accent-soft: #FFD9DC;
    --hot: #0052A5; --hot-soft: #D8E5F4;
    --sativa: #E8B93E; --sativa-soft: #FBEEC7;
    --indica: #0052A5; --indica-soft: #CDDEF0;
    --hybrid: #2D7A3F; --hybrid-soft: #D4EED9;
    --cbd:    #7B4BFF; --cbd-soft:    #E8DDFF;
    --radius: 0px; --radius-lg: 0px; --radius-sm: 0px;
    font-family: 'Futura','Avenir Next','Avenir','Helvetica Neue',sans-serif;
  }
  [data-theme="bauhaus"] body { font-family: 'Futura','Avenir Next','Avenir','Helvetica Neue',sans-serif; }
  [data-theme="bauhaus"] .tile, [data-theme="bauhaus"] .pcard,
  [data-theme="bauhaus"] .side-card, [data-theme="bauhaus"] .cart-ticket,
  [data-theme="bauhaus"] .btn-primary, [data-theme="bauhaus"] .btn-secondary,
  [data-theme="bauhaus"] .qty-btn, [data-theme="bauhaus"] .chip, [data-theme="bauhaus"] .side-chip,
  [data-theme="bauhaus"] .side-filter, [data-theme="bauhaus"] .store-btn {
    border-radius: 0 !important;
  }
  [data-theme="bauhaus"] .banner {
    letter-spacing: 0.08em; font-weight: 900;
  }
  [data-theme="bauhaus"] .brand-mark {
    border-radius: 50% !important; background: #E63946;
  }
  /* Bauhaus signature: primary-color geometric shapes scattered */
  [data-theme="bauhaus"] .main-frame::after {
    content: ''; position: absolute;
    top: 30px; left: 30px; width: 50px; height: 50px;
    background: #E8B93E; border-radius: 50%;
    pointer-events: none; opacity: .25; z-index: 0;
  }
  [data-theme="bauhaus"] .screen-step {
    background: #E63946; color: #fff; padding: 2px 8px; display: inline-block;
  }

  /* ─── MEMPHIS ─── Ettore Sottsass, 80s postmodern
     Pastel pink/teal/lime; squiggles, dots, wobbly. */
  [data-theme="memphis"] {
    --bg-deep: #FFE5EC; --bg: #FFF0F5; --surface: #FFFFFF; --surface-alt: #FFDEE9;
    --text: #1C0D16; --text-muted: #8A5A74; --border: #FFB3C7;
    --accent: #00CFC1; --accent-dark: #0A9E92; --accent-soft: #CFF8F4;
    --hot: #FF3D94; --hot-soft: #FFD0E5;
    --sativa: #FFD23F; --sativa-soft: #FFF1B5;
    --indica: #8B5CF6; --indica-soft: #E4D8FF;
    --hybrid: #00CFC1; --hybrid-soft: #CFF8F4;
    --cbd: #FF7B00; --cbd-soft: #FFE0BE;
    --radius: 14px; --radius-lg: 22px; --radius-sm: 8px;
  }
  [data-theme="memphis"] .tile { border-width: 3px; border-style: dashed; }
  [data-theme="memphis"] .pcard { border-width: 2px; }
  [data-theme="memphis"] .main-frame {
    background-image:
      radial-gradient(circle, #FF3D94 2px, transparent 2.5px),
      radial-gradient(circle, #00CFC1 1.5px, transparent 2px);
    background-size: 60px 60px, 90px 90px;
    background-position: 0 0, 30px 45px;
  }
  [data-theme="memphis"] .banner {
    font-style: italic; transform: rotate(-2deg); display: inline-block;
  }
  [data-theme="memphis"] .brand-mark { transform: rotate(-8deg); }

  /* ─── SWISS ─── Müller-Brockmann / International Typographic
     Red on white, grid-locked, Helvetica, minimal decoration. */
  [data-theme="swiss"] {
    --bg-deep: #EDEDED; --bg: #FFFFFF; --surface: #FFFFFF; --surface-alt: #F4F4F4;
    --text: #000000; --text-muted: #666666; --border: #CFCFCF;
    --accent: #D62828; --accent-dark: #9C1414; --accent-soft: #FBE3E3;
    --hot: #000; --hot-soft: #EEE;
    --radius: 0; --radius-lg: 2px; --radius-sm: 0;
    font-family: Helvetica, 'Helvetica Neue', Arial, sans-serif;
  }
  [data-theme="swiss"] * { font-family: inherit; }
  [data-theme="swiss"] .banner { letter-spacing: 0; font-weight: 700; color: #000; }
  [data-theme="swiss"] .banner::before { content: '┃ '; color: #D62828; }
  [data-theme="swiss"] .tile, [data-theme="swiss"] .pcard {
    border-radius: 0; border-width: 1px;
  }
  [data-theme="swiss"] .screen-step {
    border-left: 4px solid #D62828; padding-left: 10px; letter-spacing: 0;
  }
  [data-theme="swiss"] .brand-mark { border-radius: 0 !important; background: #D62828; }

  /* ─── SAUL BASS ─── mid-century poster; orange/red, silhouette. */
  [data-theme="saulbass"] {
    --bg-deep: #1E0F0A; --bg: #2B140A; --surface: #3A1C0E; --surface-alt: #4A2515;
    --text: #F4EDD7; --text-muted: #D4A37A; --border: #5E2E1B;
    --accent: #F26419; --accent-dark: #C04912; --accent-soft: #6E2B10;
    --hot: #FFE066; --hot-soft: #4A3A12;
    --sativa: #FFE066; --sativa-soft: #4A3A12;
    --indica: #F26419; --indica-soft: #6E2B10;
    --hybrid: #E63946; --hybrid-soft: #4A1218;
  }
  [data-theme="saulbass"] .main-frame::before {
    /* oversized silhouette behind */
    opacity: .08;
    filter: hue-rotate(200deg) saturate(1.5);
  }
  [data-theme="saulbass"] .tile { border-width: 0; background: linear-gradient(155deg, var(--surface) 40%, var(--accent-soft) 100%); }
  [data-theme="saulbass"] .banner { font-style: italic; text-transform: uppercase; }

  /* ─── VIGNELLI ─── Massimo Vignelli (Unimark / NYC subway).
     Red, ivory, deep navy; Helvetica; grid-strict. */
  [data-theme="vignelli"] {
    --bg-deep: #F2EEE4; --bg: #FAF6EC; --surface: #FFFFFF; --surface-alt: #F0ECE0;
    --text: #0F0F0F; --text-muted: #555; --border: #1A1A1A;
    --accent: #C8102E; --accent-dark: #8A0A1F; --accent-soft: #F6DCE0;
    --hot: #0051A2; --hot-soft: #D5E3F2;
    --radius: 2px; --radius-lg: 4px; --radius-sm: 0;
    font-family: Helvetica, Arial, sans-serif;
  }
  [data-theme="vignelli"] .tile { border-width: 2px; border-color: #0F0F0F; }
  [data-theme="vignelli"] .banner::before { content: '● '; color: #C8102E; }
  [data-theme="vignelli"] .brand-mark { border-radius: 50% !important; background: #C8102E; }

  /* ─── DIETER RAMS ─── "less but better". Gray/olive, minimal. */
  [data-theme="rams"] {
    --bg-deep: #D8D4CE; --bg: #E4E0D8; --surface: #F0EDE6; --surface-alt: #DAD6CE;
    --text: #1F1E1C; --text-muted: #6F6B63; --border: #C5C0B5;
    --accent: #6B8E23; --accent-dark: #4C661A; --accent-soft: #E1EBC9;
    --hot: #9E3A1F; --hot-soft: #EED6CD;
    --radius: 4px; --radius-lg: 6px; --radius-sm: 3px;
  }
  [data-theme="rams"] .tile, [data-theme="rams"] .pcard, [data-theme="rams"] .side-card {
    box-shadow: none;
    border-color: var(--border);
  }
  [data-theme="rams"] .banner { letter-spacing: 0.02em; font-weight: 500; text-transform: none; }

  /* ─── CASSANDRE ─── Art Deco / A.M. Cassandre (Dubonnet, Normandie).
     Navy + gold + ivory; geometric streamlining. */
  [data-theme="deco"] {
    --bg-deep: #0E1525; --bg: #15203A; --surface: #1B2A4A; --surface-alt: #22345A;
    --text: #F5EADD; --text-muted: #C4B590; --border: #D4AF37;
    --accent: #D4AF37; --accent-dark: #A38628; --accent-soft: #3A2E12;
    --hot: #F59B3A; --hot-soft: #4B2E0E;
    --sativa: #F59B3A; --sativa-soft: #4B2E0E;
    --indica: #8F7FD9; --indica-soft: #1E1A3A;
    --hybrid: #B4E079; --hybrid-soft: #1F2F12;
    --radius: 0; --radius-lg: 2px; --radius-sm: 0;
  }
  [data-theme="deco"] .banner {
    background: linear-gradient(180deg, #F5EADD 0%, #D4AF37 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  [data-theme="deco"] .tile { border-color: #D4AF37; border-width: 1px; }
  [data-theme="deco"] .tile.selected { background: linear-gradient(180deg, var(--accent-soft) 0%, var(--surface) 100%); }

  /* ═══ STONER MODE ACCENT OVERRIDE (on by default for naughty) ═══ */
  [data-naughty="true"] {
    --accent: #ff3e87; --accent-dark: #c92062; --accent-soft: #3a101f;
  }

  /* ═════════════════════════════════════════════════════════════════
     CARTOON THEMES — only available in stoner mode.
     Each theme owns a [data-theme="name"][data-naughty="true"] block
     plus a set of moving/animated overlay elements.
     ═══════════════════════════════════════════════════════════════ */

  /* ─── SPONGEBOB ─── bikini bottom yellow/cyan; bubbles */
  [data-theme="spongebob"][data-naughty="true"] {
    --bg-deep: #35B5D6; --bg: #6BCDE8; --surface: #FFF176; --surface-alt: #FFE54A;
    --text: #2A1A06; --text-muted: #5A3A12; --border: #CF8B1F;
    --accent: #F57C00; --accent-dark: #C75A00; --accent-soft: #FFE0B2;
    --hot: #E53935; --hot-soft: #FFCDD2;
    --sativa: #FFD600; --sativa-soft: #FFF59D;
    --indica: #7B1FA2; --indica-soft: #E1BEE7;
    --hybrid: #43A047; --hybrid-soft: #C8E6C9;
    --radius: 20px; --radius-lg: 28px; --radius-sm: 14px;
  }
  [data-theme="spongebob"][data-naughty="true"] .banner::after {
    content: ' 🧽'; font-size: .85em;
  }
  [data-theme="spongebob"][data-naughty="true"] .app::before {
    /* rising bubbles */
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 40;
    background-image:
      radial-gradient(circle at 12% 110%, rgba(255,255,255,.55) 0 6px, transparent 6px),
      radial-gradient(circle at 27% 110%, rgba(255,255,255,.4) 0 10px, transparent 10px),
      radial-gradient(circle at 48% 110%, rgba(255,255,255,.55) 0 5px, transparent 5px),
      radial-gradient(circle at 68% 110%, rgba(255,255,255,.4) 0 8px, transparent 8px),
      radial-gradient(circle at 85% 110%, rgba(255,255,255,.55) 0 7px, transparent 7px);
    animation: sbBubbles 14s linear infinite;
  }
  @keyframes sbBubbles {
    0%   { background-position: 0 0, 0 0, 0 0, 0 0, 0 0; }
    100% { background-position: 0 -110vh, 0 -110vh, 0 -110vh, 0 -110vh, 0 -110vh; }
  }
  [data-theme="spongebob"][data-naughty="true"] .tile { border-width: 3px; }

  /* ─── SCOOBY DOO ─── mystery machine teal/orange/lime */
  [data-theme="scooby"][data-naughty="true"] {
    --bg-deep: #072E32; --bg: #0D4148; --surface: #17595F; --surface-alt: #1F7078;
    --text: #EAF2D1; --text-muted: #B8C99A; --border: #D25E1E;
    --accent: #9BC53D; --accent-dark: #6F9A23; --accent-soft: #1F2D11;
    --hot: #E65100; --hot-soft: #3A1800;
    --sativa: #FFB300; --sativa-soft: #3A2A00;
    --indica: #7B1FA2; --indica-soft: #2A0F35;
    --hybrid: #9BC53D; --hybrid-soft: #1F2D11;
  }
  [data-theme="scooby"][data-naughty="true"] .banner::before { content: '👻 '; }
  [data-theme="scooby"][data-naughty="true"] .banner::after  { content: ' 🕵️'; }
  [data-theme="scooby"][data-naughty="true"] .app::after {
    content: 'ruh-roh';
    position: fixed; bottom: 12px; right: 12px;
    background: #9BC53D; color: #072E32; font-weight: 900;
    padding: 6px 14px; border-radius: 12px; border: 2px solid #072E32;
    transform: rotate(-6deg); font-size: 12px; z-index: 45;
    animation: scoobyShake 2.5s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes scoobyShake {
    0%,90%,100% { transform: rotate(-6deg) translateY(0); }
    92% { transform: rotate(-10deg) translateY(-4px); }
    95% { transform: rotate(-3deg)  translateY(-2px); }
  }

  /* ─── DEXTER'S LAB ─── green CRT glow, circuit-board grid */
  [data-theme="dexter"][data-naughty="true"] {
    --bg-deep: #001A0A; --bg: #00280F; --surface: #003E18; --surface-alt: #005823;
    --text: #B7FFC0; --text-muted: #5FB272; --border: #1FD65A;
    --accent: #37FF8B; --accent-dark: #0ECC5C; --accent-soft: #073D1B;
    --hot: #FFDF00; --hot-soft: #3D3300;
    --sativa: #FFDF00; --sativa-soft: #3D3300;
    --indica: #4ADEDE; --indica-soft: #003435;
    --hybrid: #37FF8B; --hybrid-soft: #073D1B;
    font-family: 'Consolas','Courier New',monospace;
  }
  [data-theme="dexter"][data-naughty="true"] .main-frame {
    background-image:
      linear-gradient(rgba(55,255,139,.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(55,255,139,.05) 1px, transparent 1px);
    background-size: 30px 30px, 30px 30px;
  }
  [data-theme="dexter"][data-naughty="true"] .banner {
    text-shadow: 0 0 12px #37FF8B, 0 0 4px #37FF8B;
    animation: dexterFlicker 4s infinite;
  }
  @keyframes dexterFlicker {
    0%,97%,100% { opacity: 1; }
    97.5% { opacity: .4; }
    98% { opacity: 1; }
  }
  [data-theme="dexter"][data-naughty="true"] .app::before {
    content: ''; position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(55,255,139,.04) 3px 4px);
    pointer-events: none; z-index: 42;
  }

  /* ─── INITIAL D ─── eurobeat racing, red/white, tofu delivery */
  [data-theme="initiald"][data-naughty="true"] {
    --bg-deep: #0A0A0A; --bg: #141414; --surface: #1C1C1C; --surface-alt: #252525;
    --text: #F5F5F5; --text-muted: #B0B0B0; --border: #E63946;
    --accent: #E63946; --accent-dark: #B01D2C; --accent-soft: #3A1016;
    --hot: #FFD700; --hot-soft: #3D3100;
    --sativa: #FFD700; --sativa-soft: #3D3100;
    --indica: #FFFFFF; --indica-soft: #2A2A2A;
    --hybrid: #E63946; --hybrid-soft: #3A1016;
  }
  [data-theme="initiald"][data-naughty="true"] .banner {
    background: linear-gradient(90deg, #E63946 0%, #FFFFFF 50%, #E63946 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: idBanner 4s linear infinite;
  }
  @keyframes idBanner { 0%{background-position:0 0;} 100%{background-position:200% 0;} }
  [data-theme="initiald"][data-naughty="true"] .app::before {
    /* speed lines across the screen */
    content: ''; position: fixed; top: 50%; left: 0; right: 0; height: 60%;
    transform: translateY(-50%);
    background: repeating-linear-gradient(90deg, transparent 0 40px, rgba(230,57,70,0.04) 40px 42px);
    animation: idSpeedlines .6s linear infinite;
    pointer-events: none; z-index: 40;
  }
  @keyframes idSpeedlines {
    0%   { background-position: 0 0; }
    100% { background-position: -42px 0; }
  }
  [data-theme="initiald"][data-naughty="true"] .brand-mark::after {
    content: '豆腐'; position: absolute; font-size: 7px; color: #E63946; font-weight: 900;
    bottom: -6px; right: -6px; background: #FFF; padding: 1px 3px; border-radius: 2px;
  }

  /* ─── ONE PIECE ─── pirate red/gold on ocean blue */
  [data-theme="onepiece"][data-naughty="true"] {
    --bg-deep: #0B2545; --bg: #13395E; --surface: #1B4B7A; --surface-alt: #265F96;
    --text: #FFF3D6; --text-muted: #C9B375; --border: #D4AF37;
    --accent: #D4AF37; --accent-dark: #A38628; --accent-soft: #3E2F10;
    --hot: #E63946; --hot-soft: #3A1218;
    --sativa: #FFDF00; --sativa-soft: #3D3300;
    --indica: #8B5CF6; --indica-soft: #251A3F;
    --hybrid: #7CD64A; --hybrid-soft: #1A3410;
  }
  [data-theme="onepiece"][data-naughty="true"] .banner::before { content: '🏴\u200d☠️ '; }
  [data-theme="onepiece"][data-naughty="true"] .banner::after  { content: ' 👒'; }
  [data-theme="onepiece"][data-naughty="true"] .tile.selected::after {
    /* jolly roger stamp */
    content: '☠'; background: #D4AF37; color: #0B2545;
  }
  [data-theme="onepiece"][data-naughty="true"] .app::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 39;
    background-image:
      radial-gradient(ellipse at 20% 0, rgba(255,255,255,.08) 0 60px, transparent 60px),
      radial-gradient(ellipse at 70% 0, rgba(255,255,255,.06) 0 80px, transparent 80px);
    background-size: 600px 200px, 800px 260px;
    background-repeat: repeat-x;
    animation: opClouds 40s linear infinite;
  }
  @keyframes opClouds { 0%{background-position:0 20px, 0 40px;} 100%{background-position:-600px 20px, -800px 40px;} }

  /* ─── CHEECH & CHONG ─── tie-dye + smoke haze */
  [data-theme="cheech"][data-naughty="true"] {
    --bg-deep: #1C0B2E; --bg: #2B1042; --surface: #401A5A; --surface-alt: #552574;
    --text: #FFE8F0; --text-muted: #D4A0C4; --border: #FF6EC7;
    --accent: #8FE86D; --accent-dark: #5FBE3D; --accent-soft: #1F3912;
    --hot: #FFD93D; --hot-soft: #3A3010;
    --sativa: #FFD93D; --sativa-soft: #3A3010;
    --indica: #C77DFF; --indica-soft: #311546;
    --hybrid: #8FE86D; --hybrid-soft: #1F3912;
  }
  [data-theme="cheech"][data-naughty="true"] .main-frame {
    background-image:
      conic-gradient(from 0deg at 30% 20%, #2B1042, #FF6EC7, #8FE86D, #FFD93D, #2B1042);
    background-size: 140% 140%;
    background-position: 0 0;
    animation: cheechHue 22s linear infinite;
  }
  @keyframes cheechHue { 0%{filter:hue-rotate(0deg);} 100%{filter:hue-rotate(360deg);} }
  [data-theme="cheech"][data-naughty="true"] .screens { background: rgba(27,10,42,0.92); min-height: calc(100vh - 120px); backdrop-filter: blur(2px); }
  [data-theme="cheech"][data-naughty="true"] .app::before {
    /* drifting smoke wisps */
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 40;
    background-image:
      radial-gradient(ellipse 200px 40px at 10% 80%, rgba(255,255,255,0.08), transparent),
      radial-gradient(ellipse 260px 50px at 60% 40%, rgba(255,255,255,0.06), transparent),
      radial-gradient(ellipse 180px 30px at 85% 70%, rgba(255,255,255,0.08), transparent);
    animation: cheechSmoke 25s ease-in-out infinite;
  }
  @keyframes cheechSmoke {
    0%,100% { transform: translate(0, 0); opacity: .6; }
    50%     { transform: translate(30px, -20px); opacity: .9; }
  }

  /* ─── JUMP SCARE overlay (cartoon themes only) ─────────────────
     Triggered via .jump-scare class on body; fades in, holds, out.
     Handler (JS) also plays a short "boo!" tone + removes class. */
  .jump-scare-overlay {
    position: fixed; inset: 0; z-index: 200;
    display: flex; align-items: center; justify-content: center;
    background: rgba(0,0,0,.85);
    animation: jsFlash .9s cubic-bezier(.5,0,.5,1);
    pointer-events: none;
  }
  .jump-scare-overlay .big-emoji {
    font-size: 55vmin; line-height: 1;
    filter: drop-shadow(0 0 40px rgba(255,255,255,.4));
    animation: jsPop .9s cubic-bezier(.3,2,.4,1);
  }
  @keyframes jsFlash {
    0% { opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; }
  }
  @keyframes jsPop {
    0% { transform: scale(.1) rotate(-25deg); } 40% { transform: scale(1.25) rotate(8deg); }
    100% { transform: scale(1) rotate(0); }
  }

  [data-naughty="true"] {
    --accent: #ff3e87; --accent-dark: #c92062; --accent-soft: #3a101f;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

  html, body {
    min-height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: var(--bg-deep);
    color: var(--text);
    font-size: 16px;
    line-height: 1.4;
    overscroll-behavior-y: contain;
  }

  /* full-bleed dark bg; main frame centered lighter */
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-deep);
  }

  /* ─── Header (full-width banner) ──────────────────────── */
  .header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    padding: 14px 22px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0; z-index: 30;
    box-shadow: var(--shadow-sm);
  }
  .h-left, .h-right { display: flex; align-items: center; gap: 8px; }
  .h-right { justify-content: flex-end; }
  .brand { display: flex; align-items: center; gap: 10px; }
  /* ORPA leaf mark — real company logo. Soft green glow around it
   * so it feels like it's "emitting" like on the real branding. */
  .brand-mark {
    width: 44px; height: 44px; border-radius: 14px;
    background: radial-gradient(circle at center, var(--accent-soft) 0%, transparent 70%);
    display: flex; align-items: center; justify-content: center;
    padding: 4px;
    filter: drop-shadow(0 0 6px rgba(139,197,65,.35));
    flex-shrink: 0;
  }
  .brand-mark img {
    width: 100%; height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,.4));
    animation: leafGlow 6s ease-in-out infinite;
  }
  @keyframes leafGlow {
    0%,100% { filter: drop-shadow(0 1px 2px rgba(0,0,0,.4)) drop-shadow(0 0 4px rgba(139,197,65,.25)); }
    50%     { filter: drop-shadow(0 1px 2px rgba(0,0,0,.4)) drop-shadow(0 0 12px rgba(139,197,65,.55)); }
  }
  .brand-title { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }
  .brand-sub { font-size: 11px; color: var(--text-muted); }

  /* Background watermark (subtle; corner of the main frame) */
  .main-frame { position: relative; }
  .main-frame::before {
    content: '';
    position: absolute; right: -40px; bottom: -40px;
    width: 380px; height: 380px;
    background: url('https://organicremediespa.com/wp-content/uploads/ORPA-Leaf-Logo-Green_1024-500x500.png') center/contain no-repeat;
    opacity: .025;
    pointer-events: none;
    z-index: 0;
  }
  .main-frame > * { position: relative; z-index: 1; }

  .banner {
    font-size: clamp(18px, 2.6vw, 30px);
    font-weight: 900;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-align: center;
    color: var(--accent);
    text-shadow: 0 1px 0 rgba(0,0,0,.25);
    white-space: nowrap;
  }
  .banner .and { color: var(--text); opacity: .55; margin: 0 .25em; font-weight: 700; }

  .icon-btn {
    border: 0; background: transparent;
    width: 42px; height: 42px; border-radius: 12px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: var(--text);
    transition: background .15s;
  }
  .icon-btn:hover, .icon-btn:active { background: var(--surface-alt); }

  .store-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 12px;
    background: var(--surface-alt); color: var(--text);
    border: 1px solid var(--border);
    font-size: 12px; font-weight: 700; cursor: pointer;
    transition: background .15s, border-color .15s, transform .1s;
  }
  .store-btn:hover { background: var(--accent-soft); border-color: var(--accent); }
  .store-btn:active { transform: scale(.97); }
  .store-btn .store-ico { color: var(--accent); opacity: .95; }
  .store-btn .chev { font-size: 9px; opacity: .6; margin-left: 2px; }

  .back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 700; color: var(--accent);
    border: 0; background: transparent;
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: background .15s;
  }
  .back-btn:hover { background: var(--accent-soft); }

  /* ─── Toast ───────────────────────────────────────────── */
  #toast {
    padding: 10px 22px;
    font-size: 13px;
    display: flex; align-items: center; gap: 8px;
    background: var(--surface-alt);
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    transition: opacity .3s;
  }
  #toast.ok   { background: var(--accent-soft); color: var(--accent); }
  #toast.fail { background: var(--hot-soft);    color: var(--hot); }
  #toast.hidden { display: none; }
  .toast-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

  /* ─── 3-column layout: side-left / main frame / side-right ─── */
  .layout {
    flex: 1;
    display: grid;
    grid-template-columns: minmax(180px, 16%) 1fr minmax(200px, 16%);
    max-width: 1800px;
    width: 100%;
    margin: 0 auto;
    background: var(--bg-deep);
  }
  .side-left, .side-right {
    background: var(--bg-deep);
    padding: 22px 14px;
    display: flex; flex-direction: column;
    gap: 14px;
    min-height: 100%;
  }
  .side-left  { border-right: 1px solid var(--border); }
  .side-right { border-left:  1px solid var(--border); align-items: stretch; }
  .main-frame {
    background: var(--bg);
    min-height: calc(100vh - 120px);
    box-shadow: 0 0 40px rgba(0,0,0,0.35);
  }
  @media (max-width: 900px) {
    .layout { grid-template-columns: 1fr; }
    .side-left, .side-right {
      border: 0; padding: 10px 12px;
      border-top: 1px solid var(--border);
    }
    .main-frame { box-shadow: none; }
  }

  /* side panel cards */
  .side-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px 14px;
  }
  .side-card h4 {
    font-size: 10px; font-weight: 800; letter-spacing: .12em;
    text-transform: uppercase; color: var(--text-muted);
    margin-bottom: 8px;
  }
  .side-chip-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .side-chip {
    font-size: 11px; font-weight: 700;
    padding: 4px 10px; border-radius: 16px;
    background: var(--surface-alt); color: var(--text);
    border: 1px solid var(--border);
  }
  .side-chip.hot { background: var(--accent-soft); color: var(--accent); border-color: var(--accent); }

  .side-filter-list { display: flex; flex-direction: column; gap: 8px; }
  /* Larger, visual side-filter "bars" — icon + label + count bar.
   * Hover lifts slightly; active state is a filled accent rail on the left.
   * The count is shown both numerically and as a proportional bar so you
   * can glance at the whole list and see relative size at once. */
  .side-filter {
    position: relative;
    padding: 14px 14px 14px 18px;
    background: var(--surface-alt);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    font-size: 14px; font-weight: 800;
    cursor: pointer; color: var(--text);
    text-align: left;
    transition: transform .12s, border-color .15s, background .15s, box-shadow .15s;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 10px;
    overflow: hidden;
  }
  .side-filter::before {
    /* left rail */
    content: '';
    position: absolute; left: 0; top: 10%; bottom: 10%;
    width: 4px; border-radius: 0 3px 3px 0;
    background: var(--border);
    transition: background .15s, width .15s;
  }
  .side-filter:hover { border-color: var(--accent); transform: translateX(2px); box-shadow: var(--shadow-sm); }
  .side-filter:hover::before { background: var(--accent); width: 6px; }
  .side-filter.active { background: var(--accent-soft); color: var(--accent); border-color: var(--accent); }
  .side-filter.active::before { background: var(--accent); width: 6px; top: 6%; bottom: 6%; }
  .side-filter .sf-ico { font-size: 18px; line-height: 1; }
  .side-filter .sf-label { letter-spacing: -0.01em; }
  .side-filter .count {
    font-size: 11px; opacity: .85; font-weight: 700;
    background: rgba(0,0,0,0.18);
    padding: 2px 8px;
    border-radius: 10px;
    min-width: 30px; text-align: center;
  }
  .side-filter.active .count { background: var(--accent); color: #0a0a0a; opacity: 1; }
  /* proportional bar at bottom of each filter */
  .side-filter .sf-bar {
    position: absolute;
    left: 0; bottom: 0; height: 2px;
    background: var(--accent);
    opacity: .4;
    transition: width .3s ease, opacity .15s;
  }
  .side-filter.active .sf-bar { opacity: 1; }

  /* Big chips for "Current pick" (visual hierarchy boost) */
  .side-chip-list.big .side-chip {
    font-size: 13px; padding: 8px 12px;
    border-radius: 10px;
    font-weight: 800;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .side-chip.dismissable { position: relative; padding-right: 26px; cursor: pointer; }
  .side-chip.dismissable::after {
    content: '×'; position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
    font-weight: 900; opacity: .45;
  }
  .side-chip.dismissable:hover::after { opacity: 1; color: var(--hot); }

  /* Quick jump-back shortcuts on left panel */
  .side-jump-list { display: flex; flex-direction: column; gap: 6px; }
  .side-jump {
    background: var(--surface-alt);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 9px 12px;
    cursor: pointer;
    font-size: 12px; font-weight: 700; color: var(--text);
    display: flex; align-items: center; justify-content: space-between;
    transition: border-color .15s, background .15s;
  }
  .side-jump:hover { border-color: var(--accent); background: var(--accent-soft); color: var(--accent); }
  .side-jump .arrow { font-size: 11px; opacity: .6; }

  /* ── RIGHT COLUMN: live cart items list + summary ─────── */
  /* Layout:
   *   .cart-column             full right-column vertical stack
   *   .cart-live-list          ← growing list of added items (distinctive
   *                              "ticket" design; not to be confused with
   *                              the for-sale product cards)
   *   .cart-summary            ← total, actions; starts near top and slowly
   *                              gets pushed down as items accumulate; once
   *                              the list is taller than its cap it pins to
   *                              the bottom and the list itself scrolls.
   */
  .cart-column {
    display: flex; flex-direction: column; gap: 12px;
    position: sticky; top: 90px;
    max-height: calc(100vh - 110px);
  }
  .cart-live-list {
    display: flex; flex-direction: column-reverse; /* newest item on TOP */
    gap: 8px;
    overflow-y: auto;
    flex: 0 1 auto;
    min-height: 0;
    padding-right: 2px;
    scrollbar-width: thin;
  }
  .cart-live-list::-webkit-scrollbar { width: 6px; }
  .cart-live-list::-webkit-scrollbar-track { background: transparent; }
  .cart-live-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .cart-live-list:empty { display: none; }
  /* Tickets — intentionally different from .pcard so PCCs don't confuse
   * what's-in-cart with what's-on-sale. Dashed accent border, inset shadow,
   * no hover lift, no price toggling. */
  .cart-ticket {
    position: relative;
    display: grid;
    grid-template-columns: 44px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px 11px;
    background: linear-gradient(180deg, var(--accent-soft) 0%, var(--surface-alt) 100%);
    border: 1.5px dashed var(--accent);
    border-radius: 10px;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.08);
    font-size: 12px;
    animation: ticketSlideIn .34s cubic-bezier(.2,.9,.3,1.2);
    transform-origin: top center;
  }
  @keyframes ticketSlideIn {
    0%   { transform: translateY(-18px) scale(.92); opacity: 0; }
    60%  { transform: translateY(2px)   scale(1.02); opacity: 1; }
    100% { transform: translateY(0)     scale(1); }
  }
  .cart-ticket.fresh::after {
    /* green pulse ring on just-added */
    content: ''; position: absolute; inset: -2px;
    border-radius: 12px;
    box-shadow: 0 0 0 0 var(--accent);
    animation: ticketPulse 1.1s ease-out 1;
    pointer-events: none;
  }
  @keyframes ticketPulse {
    0%   { box-shadow: 0 0 0 0 var(--accent); opacity: .85; }
    100% { box-shadow: 0 0 0 16px rgba(139,197,65,0); opacity: 0; }
  }
  .cart-ticket-img, .cart-ticket-img-ph {
    width: 44px; height: 44px; border-radius: 8px;
    background: var(--surface);
    border: 1px solid var(--border);
    object-fit: cover;
    flex-shrink: 0;
  }
  .cart-ticket-img-ph { display: flex; align-items: center; justify-content: center; font-size: 20px; color: var(--text-muted); }
  .cart-ticket-info { min-width: 0; }
  .cart-ticket-name { font-size: 12px; font-weight: 800; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cart-ticket-meta { font-size: 10px; color: var(--text-muted); margin-top: 1px; }
  .cart-ticket-right { text-align: right; font-size: 11px; font-weight: 800; color: var(--accent); display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .cart-ticket-qty { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; color: var(--text-muted); font-weight: 700; }
  .cart-ticket-qty button {
    width: 18px; height: 18px; border-radius: 50%;
    border: 1px solid var(--border); background: var(--surface);
    color: var(--text); cursor: pointer;
    font-size: 11px; font-weight: 900;
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0; line-height: 1;
  }
  .cart-ticket-qty button:hover { border-color: var(--accent); color: var(--accent); }
  /* tear-off corner strip — visual cue it's a "receipt row", not a product */
  .cart-ticket::before {
    content: ''; position: absolute; left: -1.5px; top: 50%; transform: translateY(-50%);
    width: 3px; height: 60%;
    background: repeating-linear-gradient(to bottom, var(--accent) 0 4px, transparent 4px 7px);
    border-radius: 2px;
  }

  /* Cart summary card (the part that slides down as items grow) */
  .cart-summary {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 15px;
    flex-shrink: 0;
    transition: margin-top .25s ease;
  }
  .cart-summary h4 { font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
  .cs-count {
    display: inline-block;
    min-width: 22px; padding: 2px 8px;
    border-radius: 11px;
    background: var(--accent); color: #0a0a0a;
    font-weight: 800; font-size: 11px;
    text-align: center;
  }
  .cs-total-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .1em; font-weight: 700; margin-top: 4px; }
  .cs-total { font-size: 22px; font-weight: 900; color: var(--accent); letter-spacing: -0.02em; line-height: 1.1; }
  .cs-total .was { display: block; font-size: 10px; color: var(--text-muted); text-decoration: line-through; font-weight: 500; }
  .cs-saved { font-size: 10px; color: var(--hot); font-weight: 800; margin-top: 3px; }
  .cs-actions { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
  .cs-empty { font-size: 12px; color: var(--text-muted); text-align: center; padding: 14px 4px; }

  /* When list is long enough to need scrolling, summary sticks at the
   * bottom of the column and the list above it becomes the scrollable
   * region. CSS handles this automatically via flex + min-height: 0 on
   * the list. JS just toggles a `locked` class when the list exceeds a
   * threshold so we can apply a subtle pinned-shadow. */
  .cart-column.locked .cart-summary {
    box-shadow: 0 -8px 20px -8px rgba(0,0,0,0.35), var(--shadow-sm);
    border-top: 2px solid var(--accent-soft);
  }

  /* price corners (bottom of side panels) */
  .price-corner {
    margin-top: auto;
    padding: 14px 12px;
    border: 1px dashed var(--border);
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    font-size: 11px; color: var(--text-muted);
    text-align: center;
  }
  .price-corner .big { display: block; font-size: 18px; font-weight: 900; color: var(--text); margin-top: 4px; letter-spacing: -0.01em; }
  .price-corner .accent { color: var(--accent); }

  /* ─── Screens ─────────────────────────────────────────── */
  .screens { position: relative; padding-bottom: 40px; }
  .screen {
    display: none;
    padding: 26px 22px 40px;
    animation: slideIn .28s ease;
  }
  .screen.active { display: block; }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .screen-head { text-align: center; margin-bottom: 22px; }
  .screen-step {
    font-size: 11px; font-weight: 800;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 6px;
  }
  .screen-title {
    font-size: clamp(22px, 2.8vw, 30px);
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--text);
  }
  .screen-sub { margin-top: 6px; font-size: 13px; color: var(--text-muted); }

  /* ─── Tile grid (category / subtype / size / effects) ──── */
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 780px;
    margin: 0 auto;
  }
  @media (min-width: 560px)  { .tile-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
  @media (min-width: 1100px) { .tile-grid { grid-template-columns: repeat(4, 1fr); } }

  .tile {
    position: relative;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius);
    padding: 20px 14px 16px;
    cursor: pointer;
    transition: transform .12s, box-shadow .15s, border-color .15s, background .15s;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    min-height: 146px;
    text-align: center;
    box-shadow: var(--shadow-sm);
    user-select: none;
  }
  .tile:hover { border-color: var(--accent); }
  .tile:active { transform: scale(.97); }
  .tile.selected {
    border-color: var(--accent);
    background: var(--accent-soft);
    box-shadow: var(--shadow);
  }
  .tile.selected::after {
    content: "✓";
    position: absolute;
    top: 8px; right: 10px;
    width: 24px; height: 24px;
    background: var(--accent);
    color: #0a0a0a;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 900;
  }
  .tile.disabled { opacity: .32; pointer-events: none; }
  .tile-icon { font-size: 46px; line-height: 1; margin-top: 4px; }
  .tile-title { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; }
  .tile-sub { font-size: 12px; color: var(--text-muted); }
  .tile-badge {
    position: absolute; top: 8px; left: 10px;
    font-size: 10px; font-weight: 800;
    padding: 3px 8px;
    background: var(--surface-alt);
    color: var(--text-muted);
    border-radius: 10px;
  }
  .tile[data-fx="sleepy"]  { --tilebg: #2a1c3c; }
  .tile[data-fx="uplift"]  { --tilebg: #3a2c0e; }
  .tile[data-fx="relief"]  { --tilebg: #3a1c0e; }
  .tile[data-fx="focus"]   { --tilebg: #0e3a1c; }
  .tile[data-fx="calm"]    { --tilebg: #0e1c3a; }
  .tile[data-fx="earthy"]  { --tilebg: #2a2414; }
  .tile[data-fx="creative"]{ --tilebg: #3a0e2c; }
  .tile[data-fx="soothe"]  { --tilebg: #3a0e1c; }
  .tile[data-fx] { background: linear-gradient(160deg, var(--surface) 0%, var(--tilebg,var(--surface-alt)) 100%); }
  .tile[data-fx] .tile-sub { font-weight: 600; color: var(--text); opacity: .72; }

  .step-actions {
    text-align: center; margin-top: 22px;
    display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;
  }

  /* ─── Results grid ────────────────────────────────────── */
  .results-wrap { max-width: 1180px; margin: 0 auto; }
  .results-summary {
    display: flex; flex-wrap: wrap; gap: 6px;
    justify-content: center; margin-bottom: 18px;
  }
  .chip {
    font-size: 12px; font-weight: 700;
    padding: 5px 12px; border-radius: 20px;
    background: var(--surface-alt);
    color: var(--text-muted);
    border: 1px solid var(--border);
  }
  .chip.hot { background: var(--accent-soft); color: var(--accent); border-color: var(--accent); }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  @media (min-width: 560px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
  @media (min-width: 1100px){ .product-grid { grid-template-columns: repeat(4, 1fr); } }

  .pcard {
    position: relative;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 10px;
    box-shadow: var(--shadow-sm);
    display: flex; flex-direction: column; gap: 6px;
    transition: box-shadow .15s, transform .12s, border-color .15s;
  }
  .pcard:hover { box-shadow: var(--shadow); border-color: var(--accent); }
  .pcard.in-cart { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-soft), var(--shadow-sm); }
  .pcard-img, .pcard-img-ph {
    width: 100%; aspect-ratio: 1;
    border-radius: var(--radius-sm);
    background: var(--surface-alt);
  }
  .pcard-img { object-fit: cover; }
  .pcard-img-ph {
    display: flex; align-items: center; justify-content: center;
    font-size: 38px; color: var(--border);
  }
  .pcard-badges { display: flex; flex-wrap: wrap; gap: 4px; }
  .bdg {
    font-size: 10px; font-weight: 800;
    padding: 2px 7px; border-radius: 8px;
    letter-spacing: .02em;
  }
  .bdg-sativa{background:var(--sativa-soft);color:var(--sativa);}
  .bdg-indica{background:var(--indica-soft);color:var(--indica);}
  .bdg-hybrid{background:var(--hybrid-soft);color:var(--hybrid);}
  .bdg-cbd   {background:var(--cbd-soft);   color:var(--cbd);   }
  .bdg-sale  {background:var(--hot-soft);   color:var(--hot); font-weight:900; position:relative; }
  .bdg-thc   {background:var(--surface-alt);color:var(--text-muted);}
  .bdg-thc.hi{background:var(--accent-soft);color:var(--accent); font-weight:900;}
  .bdg-match {background:var(--accent-soft);color:var(--accent);}
  .bdg-sub   {background:var(--surface-alt);color:var(--text-muted); text-transform:capitalize;}

  .pcard-name { font-size: 13px; font-weight: 800; line-height: 1.25; }
  .pcard-brand { font-size: 11px; color: var(--text-muted); }
  .pcard-price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 6px; }
  .price-now { font-size: 18px; font-weight: 900; color: var(--accent); }
  .price-was { font-size: 12px; color: var(--text-muted); text-decoration: line-through; }
  .price-unit { font-size: 11px; color: var(--text-muted); }

  .pcard-terps { display: flex; flex-wrap: wrap; gap: 3px; }
  .tchip {
    font-size: 10px; padding: 2px 6px;
    background: var(--surface-alt); color: var(--text-muted);
    border-radius: 6px;
  }
  .tchip.match { background: var(--accent-soft); color: var(--accent); font-weight: 800; }

  .pcard-qty {
    margin-top: auto;
    display: flex; align-items: center; justify-content: space-between;
    gap: 8px; padding-top: 8px;
    border-top: 1px solid var(--border);
  }
  .qty-btn {
    width: 36px; height: 36px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    background: var(--surface-alt);
    color: var(--text);
    font-size: 18px; font-weight: 800;
    cursor: pointer;
    transition: all .12s;
    display: flex; align-items: center; justify-content: center;
  }
  .qty-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .qty-btn:disabled { opacity: .3; cursor: not-allowed; }
  .qty-btn.add { background: var(--accent); color: #0a0a0a; border-color: var(--accent); flex: 1; font-size: 12px; font-weight: 800; letter-spacing: .02em; text-transform: uppercase; }
  .qty-btn.add:hover { background: var(--accent-dark); }
  .qty-num { font-size: 16px; font-weight: 900; min-width: 24px; text-align: center; }

  /* speech-bubble sticker (naughty) — larger, bolder, less frequent */
  .sticker {
    position: absolute;
    top: 10px; right: 10px;
    background: #ffeb3b;
    color: #1a1a1a;
    font-weight: 900;
    font-size: 13px;
    padding: 8px 12px;
    border-radius: 14px;
    border: 2.5px solid #0a0a0a;
    transform: rotate(-6deg);
    box-shadow: 4px 4px 0 rgba(0,0,0,.55);
    pointer-events: none;
    z-index: 3;
    animation: stickerBounce .55s cubic-bezier(.4,1.7,.5,1);
    max-width: 150px;
    line-height: 1.1;
    text-transform: lowercase;
    letter-spacing: .01em;
  }
  .sticker.steal { background: #ff6bce; }
  .sticker.fire  { background: #ff8c42; }
  .sticker.deal  { background: #8bc541; color: #0a1a00; }
  .sticker::after {
    content: "";
    position: absolute;
    left: -14px; top: 50%;
    transform: translateY(-50%);
    border: 8px solid transparent;
    border-right-color: #0a0a0a;
  }
  .sticker.right-pointing { left: auto; right: 8px; }
  .sticker.right-pointing::after { left: auto; right: -14px; border-right-color: transparent; border-left-color: #0a0a0a; }
  @keyframes stickerBounce {
    0%   { transform: rotate(-6deg) scale(.5); opacity: 0; }
    60%  { transform: rotate(-6deg) scale(1.15); opacity: 1; }
    100% { transform: rotate(-6deg) scale(1); }
  }

  /* ─── Cart / QR Screen ────────────────────────────────── */
  .cart-screen { max-width: 780px; margin: 0 auto; }
  .cart-list {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    margin-bottom: 18px;
  }
  .cart-row {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
  }
  .cart-row:last-child { border-bottom: 0; }
  .cart-row-img, .cart-row-img-ph {
    width: 56px; height: 56px; border-radius: 10px;
    background: var(--surface-alt); flex-shrink: 0;
  }
  .cart-row-img { object-fit: cover; }
  .cart-row-img-ph { display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--border); }
  .cart-row-info { flex: 1; min-width: 0; }
  .cart-row-name { font-size: 14px; font-weight: 800; line-height: 1.2; }
  .cart-row-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
  .cart-row-price { text-align: right; white-space: nowrap; }
  .cart-row-price .p-now { font-size: 15px; font-weight: 900; color: var(--accent); }
  .cart-row-price .p-was { font-size: 10px; color: var(--text-muted); text-decoration: line-through; }
  .cart-row-qty { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .cart-row-qty .qty-btn { width: 30px; height: 30px; font-size: 15px; }
  .cart-row-qty .qty-num { min-width: 18px; font-size: 14px; }

  .cart-totals {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 18px 20px;
    margin-bottom: 18px;
  }
  .tot-line { display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0; font-size: 14px; color: var(--text-muted); }
  .tot-line .v { font-weight: 700; color: var(--text); }
  .tot-grand { display: flex; justify-content: space-between; align-items: baseline; padding: 12px 0 4px; margin-top: 6px; border-top: 2px solid var(--border); }
  .tot-grand .l { font-size: 16px; font-weight: 800; }
  .tot-grand .v { font-size: 28px; font-weight: 900; color: var(--accent); }
  .tot-saved { font-size: 12px; color: var(--hot); text-align: right; font-weight: 800; margin-top: 2px; }

  .qr-section {
    text-align: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    margin-bottom: 18px;
  }
  .qr-label { font-size: 11px; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: .12em; margin-bottom: 12px; }
  .qr-canvas {
    display: inline-block; padding: 14px;
    background: #fff; border-radius: 12px;
    border: 1px solid var(--border);
  }
  .qr-canvas img, .qr-canvas canvas { display: block; image-rendering: pixelated; max-width: 100%; height: auto; }
  .qr-hint { font-size: 12px; color: var(--text-muted); margin-top: 10px; }
  .qr-actions { margin-top: 16px; display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }

  /* ─── Buttons ─────────────────────────────────────────── */
  .btn-primary, .btn-secondary {
    padding: 12px 18px;
    border-radius: 12px;
    border: 0;
    font-size: 14px; font-weight: 800;
    cursor: pointer;
    transition: background .15s, transform .1s;
    white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #0a0a0a; }
  .btn-primary:hover { background: var(--accent-dark); }
  .btn-primary:active { transform: scale(.97); }
  .btn-secondary { background: var(--surface-alt); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--border); }
  .btn-block { width: 100%; }

  /* ─── Sheet overlay (themes/store) ─────────────────────── */
  .sheet-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(3px);
    opacity: 0; pointer-events: none;
    transition: opacity .2s;
    z-index: 50;
  }
  .sheet-overlay.open { opacity: 1; pointer-events: auto; }
  .sheet {
    position: fixed;
    left: 50%; bottom: 0;
    transform: translate(-50%, 100%);
    max-width: 520px; width: calc(100% - 24px);
    background: var(--surface);
    border-radius: 20px 20px 0 0;
    padding: 18px 18px 30px;
    box-shadow: var(--shadow-lg);
    transition: transform .25s ease;
    z-index: 51;
  }
  .sheet-overlay.open .sheet { transform: translate(-50%, 0); }
  .sheet-handle { width: 44px; height: 5px; background: var(--border); border-radius: 3px; margin: 0 auto 14px; }
  .sheet h3 { font-size: 14px; font-weight: 800; margin-bottom: 12px; text-align: center; }
  .theme-grid, .store-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .theme-opt, .store-opt {
    cursor: pointer; text-align: center; padding: 12px 6px;
    border-radius: 12px; border: 2px solid var(--border);
    background: var(--surface-alt);
    transition: transform .12s, border-color .15s;
  }
  .theme-opt:hover, .store-opt:hover { border-color: var(--accent); }
  .theme-opt:active, .store-opt:active { transform: scale(.96); }
  .theme-opt.selected, .store-opt.selected { border-color: var(--accent); background: var(--accent-soft); }
  .theme-swatch { width: 36px; height: 36px; border-radius: 50%; margin: 0 auto 6px; box-shadow: var(--shadow-sm); border: 2px solid rgba(255,255,255,.15); }
  .theme-opt-name, .store-opt-name { font-size: 11px; font-weight: 700; }
  .store-opt-sub { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  /* ─── Empty / Loading ─────────────────────────────────── */
  .state-box { text-align: center; padding: 60px 20px; color: var(--text-muted); }
  .state-box .icon { font-size: 48px; margin-bottom: 12px; }
  .state-box p { font-size: 15px; max-width: 380px; margin: 0 auto; }
  .state-box .sub { font-size: 13px; margin-top: 8px; }
  .spin {
    width: 36px; height: 36px;
    border: 4px solid var(--surface-alt);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .7s linear infinite;
    margin: 0 auto 14px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ─── Naughty flash ───────────────────────────────────── */
  .flash {
    position: fixed; inset: 0;
    background: #fff; z-index: 100;
    opacity: 0; pointer-events: none;
    animation: flash .8s ease;
  }
  @keyframes flash { 0% {opacity:0;} 15% {opacity:1;} 100% {opacity:0;} }

  /* ─── Mobile tweaks ───────────────────────────────────── */
  @media (max-width: 460px) {
    .header { padding: 10px 12px; grid-template-columns: auto 1fr auto; gap: 6px; }
    .banner { font-size: 13px; letter-spacing: 0.1em; }
    .brand-title { font-size: 13px; } .brand-sub { display: none; }
    .screen { padding: 18px 14px 30px; }
    .screen-title { font-size: 22px; }
    .tile { min-height: 128px; padding: 16px 10px 12px; }
    .tile-icon { font-size: 40px; }
    .tile-title { font-size: 14px; }
    .btn-primary, .btn-secondary { padding: 10px 14px; font-size: 13px; }
    .store-btn .name { display: none; }
  }
</style>
</head>
<body>

<div class="app">

  <!-- ─── Header (full-width, center banner) ──────────────── -->
  <header class="header">
    <div class="h-left">
      <button class="back-btn" id="back-btn" style="display:none" aria-label="Back">← Back</button>
      <div class="brand" id="brand">
        <div class="brand-mark">
          <img src="https://organicremediespa.com/wp-content/uploads/ORPA-Leaf-Logo-Green_1024-500x500.png"
               alt="Organic Remedies"
               onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'🌿',style:'font-size:22px'}))">
        </div>
        <div>
          <div class="brand-title" id="brand-title">Organic Remedies</div>
          <div class="brand-sub" id="brand-sub">PCC patient tool</div>
        </div>
      </div>
    </div>
    <div class="banner" id="banner">The Terp Search</div>
    <div class="h-right">
      <button class="store-btn" id="store-btn" aria-label="Switch store">
        <svg class="store-ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M9 22v-6h6v6"/></svg><span class="name" id="store-name">Bethel Park</span><span class="chev" aria-hidden="true">▾</span>
      </button>
      <button class="icon-btn" id="cart-btn" title="Cart" aria-label="Cart">🛒</button>
      <button class="icon-btn" id="theme-btn" title="Theme" aria-label="Theme">🎨</button>
      <button class="icon-btn" id="home-btn" title="Start over" aria-label="Home">🏠</button>
    </div>
  </header>

  <!-- Toast -->
  <div id="toast"><div class="toast-dot"></div><span id="toast-text">Connecting to live menu…</span></div>

  <!-- 3-column layout -->
  <div class="layout">

    <!-- LEFT side: nav / filter / current pick -->
    <aside class="side-left" id="side-left">
      <div class="side-card">
        <h4 id="side-l-h">Current pick</h4>
        <div class="side-chip-list big" id="side-l-chips"><span class="side-chip">—</span></div>
      </div>
      <div class="side-card" id="side-filter-card" style="display:none">
        <h4 id="side-filter-title">Filter</h4>
        <div class="side-filter-list" id="side-filter-list"></div>
      </div>
      <div class="side-card" id="side-jump-card" style="display:none">
        <h4>Jump back</h4>
        <div class="side-jump-list" id="side-jump-list"></div>
      </div>
    </aside>

    <!-- MAIN content frame -->
    <main class="main-frame">
      <div class="screens">

        <!-- Loading -->
        <section class="screen active" id="screen-loading">
          <div class="state-box">
            <div class="spin"></div>
            <p>Loading your menu…</p>
            <p class="sub" id="loading-sub">Pulling live inventory</p>
          </div>
        </section>

        <!-- 1. Category -->
        <section class="screen" id="screen-category">
          <div class="screen-head">
            <div class="screen-step">Step 1</div>
            <h1 class="screen-title" id="cat-title">Pick a category</h1>
            <p class="screen-sub" id="cat-sub">Start with what kind of product you want.</p>
          </div>
          <div class="tile-grid" id="cat-grid"></div>
        </section>

        <!-- 2. Subtype (consistency / edibletype / topicaltype / geartype) -->
        <section class="screen" id="screen-subtype">
          <div class="screen-head">
            <div class="screen-step" id="sub-step">Step 2</div>
            <h1 class="screen-title" id="sub-title">Pick a type</h1>
            <p class="screen-sub" id="sub-sub">You can pick more than one.</p>
          </div>
          <div class="tile-grid" id="sub-grid"></div>
          <div class="step-actions">
            <button class="btn-secondary" id="sub-skip">Skip</button>
            <button class="btn-primary" id="sub-go">Next →</button>
          </div>
        </section>

        <!-- 3. Size (flower/vape) -->
        <section class="screen" id="screen-size">
          <div class="screen-head">
            <div class="screen-step">Step 2</div>
            <h1 class="screen-title" id="size-title">How much?</h1>
            <p class="screen-sub" id="size-sub">Pick a size to narrow things down, or skip.</p>
          </div>
          <div class="tile-grid" id="size-grid"></div>
        </section>

        <!-- 4. Effects (terpenes) -->
        <section class="screen" id="screen-effects">
          <div class="screen-head">
            <div class="screen-step">Step 3</div>
            <h1 class="screen-title" id="fx-title">How do you want to feel?</h1>
            <p class="screen-sub" id="fx-sub">Pick up to 3.</p>
          </div>
          <div class="tile-grid" id="fx-grid"></div>
          <div class="step-actions">
            <button class="btn-secondary" id="fx-skip">Skip this step</button>
            <button class="btn-primary" id="fx-go">Find my products →</button>
          </div>
        </section>

        <!-- 4b. Cannabinoids (edible path) -->
        <section class="screen" id="screen-cannab">
          <div class="screen-head">
            <div class="screen-step">Step 3</div>
            <h1 class="screen-title" id="cn-title">What are you looking for?</h1>
            <p class="screen-sub" id="cn-sub">Pick a cannabinoid profile. (Edibles use cannabinoids, not terps.)</p>
          </div>
          <div class="tile-grid" id="cn-grid"></div>
          <div class="step-actions">
            <button class="btn-secondary" id="cn-skip">Skip</button>
            <button class="btn-primary" id="cn-go">Next →</button>
          </div>
        </section>

        <!-- 4c. Extract type (edible path) -->
        <section class="screen" id="screen-extract">
          <div class="screen-head">
            <div class="screen-step">Step 4</div>
            <h1 class="screen-title" id="ex-title">Extract style?</h1>
            <p class="screen-sub" id="ex-sub">Distillate is most common; rosin/live resin are full-spectrum.</p>
          </div>
          <div class="tile-grid" id="ex-grid"></div>
          <div class="step-actions">
            <button class="btn-secondary" id="ex-skip">Skip</button>
            <button class="btn-primary" id="ex-go">Find my products →</button>
          </div>
        </section>

        <!-- 5. Results -->
        <section class="screen" id="screen-results">
          <div class="screen-head">
            <div class="screen-step">Results</div>
            <h1 class="screen-title" id="res-title">Your matches</h1>
            <p class="screen-sub" id="res-sub">Tap + to add to cart. Side filters narrow further.</p>
          </div>
          <div class="results-wrap">
            <div class="results-summary" id="res-summary"></div>
            <div id="res-list"></div>
          </div>
        </section>

        <!-- 6. Cart + QR -->
        <section class="screen" id="screen-cart">
          <div class="cart-screen">
            <div class="screen-head">
              <h1 class="screen-title" id="cart-title">Your cart</h1>
              <p class="screen-sub" id="cart-sub">Scan the QR with your phone to get a pick list.</p>
            </div>
            <div class="cart-list" id="cart-list"></div>
            <div class="cart-totals" id="cart-totals"></div>
            <div class="qr-section">
              <div class="qr-label" id="qr-label">Scan to pick</div>
              <div class="qr-canvas" id="qr-canvas"></div>
              <div class="qr-hint">Open your phone camera, point at the code. A text doc with every item opens up.</div>
              <div class="qr-actions">
                <button class="btn-secondary" id="copy-btn">Copy as text</button>
                <button class="btn-primary" id="add-more-btn">+ Add more</button>
              </div>
            </div>
            <div style="text-align:center; margin-bottom:20px;">
              <button class="btn-secondary" id="clear-cart-btn">🗑 Clear cart &amp; start over</button>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- RIGHT side: live cart items (top) + summary (pushes down as you add) -->
    <aside class="side-right" id="side-right">
      <div class="cart-column" id="cart-column">
        <!-- Live item tickets; newest on top, slides in, scrolls once full -->
        <div class="cart-live-list" id="cart-live-list" aria-label="Items added to cart"></div>

        <div class="cart-summary" id="cart-side">
          <h4><span id="cs-label-head">Cart</span> <span class="cs-count" id="cs-count" style="display:none">0</span></h4>
          <div class="cs-empty" id="cs-empty">Nothing yet. Start picking.</div>
          <div id="cs-body" style="display:none">
            <div class="cs-total-label" id="cs-label">Running total</div>
            <div class="cs-total" id="cs-total">$0.00</div>
            <div class="cs-saved" id="cs-saved" style="display:none"></div>
            <div class="cs-actions">
              <button class="btn-primary btn-block" id="cs-view">View cart →</button>
              <button class="btn-secondary btn-block" id="cs-more">+ Add more</button>
            </div>
          </div>
        </div>
      </div>
    </aside>

  </div>
</div>

<!-- Theme sheet -->
<div class="sheet-overlay" id="theme-sheet">
  <div class="sheet" onclick="event.stopPropagation()">
    <div class="sheet-handle"></div>
    <h3>Pick a color theme</h3>
    <div class="theme-grid" id="theme-grid"></div>
  </div>
</div>

<!-- Store sheet -->
<div class="sheet-overlay" id="store-sheet">
  <div class="sheet" onclick="event.stopPropagation()">
    <div class="sheet-handle"></div>
    <h3>Switch store</h3>
    <div class="store-grid" id="store-grid"></div>
  </div>
</div>

<!-- QR library -->
<script>
/* qrcode-generator v1.4.4 by Kazuhiko Arase - MIT License - inlined for standalone use */
//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin, alt, title) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
        alt = opts.alt;
        title = opts.title;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      // Compose alt property surrogate
      alt = (typeof alt === 'string') ? {text: alt} : alt || {};
      alt.text = alt.text || null;
      alt.id = (alt.text) ? alt.id || 'qrcode-description' : null;

      // Compose title property surrogate
      title = (typeof title === 'string') ? {text: title} : title || {};
      title.text = title.text || null;
      title.id = (title.text) ? title.id || 'qrcode-title' : null;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet"';
      qrSvg += (title.text || alt.text) ? ' role="img" aria-labelledby="' +
          escapeXml([title.id, alt.id].join(' ').trim() ) + '"' : '';
      qrSvg += '>';
      qrSvg += (title.text) ? '<title id="' + escapeXml(title.id) + '">' +
          escapeXml(title.text) + '</title>' : '';
      qrSvg += (alt.text) ? '<description id="' + escapeXml(alt.id) + '">' +
          escapeXml(alt.text) + '</description>' : '';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += escapeXml(alt);
        img += '"';
      }
      img += '/>';

      return img;
    };

    var escapeXml = function(s) {
      var escaped = '';
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charAt(i);
        switch(c) {
        case '<': escaped += '&lt;'; break;
        case '>': escaped += '&gt;'; break;
        case '&': escaped += '&amp;'; break;
        case '"': escaped += '&quot;'; break;
        default : escaped += c; break;
        }
      }
      return escaped;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (typeof define === 'function' && define.amd) {
      define([], factory);
  } else if (typeof exports === 'object') {
      module.exports = factory();
  }
}(function () {
    return qrcode;
}));

</script>

<script>
/* ============================================================
   CONFIG — verified live 2026-04-16
   If keys rotate, refresh from any store's /menu page source
   and search for `algoliaApiKey`.
   ============================================================ */
const APP_ID  = 'VFM4X0N23A';
const API_KEY = 'edc5435c65d771cecbd98bbd488aa8d3';
const INDEX   = 'menu-products-production';
const HOST    = 'search.iheartjane.com';
const KINDS   = ['flower','vape','extract','edible','tincture','topical','gear'];

const STORES = [
  { id: '4139', name: 'Paoli',         slug: 'organic-remedies-paoli-pa' },
  { id: '1877', name: 'Enola',         slug: 'organic-remedies-enola-pa' },
  { id: '1876', name: 'York',          slug: 'organic-remedies-york-pa' },
  { id: '3906', name: 'McKnight Rd',   slug: 'organic-remedies-mcknight-road-pa' },
  { id: '1878', name: 'Chambersburg',  slug: 'organic-remedies-chambersburg-pa' },
  { id: '4365', name: 'Bethel Park',   slug: 'organic-remedies-bethel-park-pa' },
];

/* ─── Size config ─────────────────────────────────────── */
const SIZE_KEYS = ['each','half_gram','gram','two_gram','eighth_ounce','quarter_ounce','half_ounce','ounce'];
/* STONER/slang labels — only surface these when state.naughty=true. */
const SIZE_LABELS_STONER = {
  each: 'Each',
  half_gram: '½ gram',
  gram: 'A g',
  two_gram: '4.2g',      /* correct for flower; getSizeLabel() overrides for vape/extract */
  eighth_ounce: 'Cut',
  quarter_ounce: 'Quarter',
  half_ounce: 'Halfie',
  ounce: 'Zip',
};
/* FORMAL labels — shown to patients in regular mode. Strictly business. */
const SIZE_LABELS_FORMAL = {
  each: 'Each',
  half_gram: '0.5g',
  gram: '1g',
  two_gram: '4.2g',      /* flower default; overridden below for vape/extract */
  eighth_ounce: '⅛ oz',
  quarter_ounce: '¼ oz',
  half_ounce: '½ oz',
  ounce: '1 oz',
};
const SIZE_SUBLABEL = {  /* small gram-count sub-line under formal label */
  each: '',
  half_gram: '',
  gram: '',
  two_gram: '',
  eighth_ounce: '(3.5g)',
  quarter_ounce: '(7g)',
  half_ounce: '(14g)',
  ounce: '(28g)',
};
/* two_gram is category-specific:
 *   flower  → actually a 4.2g pre-pack (retailer quirk at OR)
 *   vape    → actually 2g (cart/disposable)
 *   extract → actually 2g
 *   anything else → default to 2g
 */
function twoGramLabel(kind) { return kind === 'flower' ? '4.2g' : '2g'; }
/* Context-aware label getter.
 *   kind: 'flower'|'vape'|'extract'|'edible'|'topical'|'gear'|null
 *   naughty: slang when true, formal otherwise.
 */
function getSizeLabel(key, kind, naughty) {
  if (key === 'two_gram') return twoGramLabel(kind);
  return (naughty ? SIZE_LABELS_STONER : SIZE_LABELS_FORMAL)[key] || key;
}
function getSizeSub(key, kind) {
  if (key === 'two_gram') return ''; /* label already shows exact grams */
  return SIZE_SUBLABEL[key] || '';
}
/* Back-compat alias — prefer getSizeLabel() in new code. */
const SIZE_LABELS = SIZE_LABELS_FORMAL;
const SIZE_ICONS = {
  each: '🧩', half_gram: '🟢', gram: '🌿', two_gram: '🌿🌿',
  eighth_ounce: '✂️', quarter_ounce: '🧺', half_ounce: '🛍️', ounce: '👑',
};

/* ─── Terpene aliases + effect tiles ──────────────────── */
const TERP_MAP = {
  Myrcene:       ['myrcene','b-myrcene','beta-myrcene'],
  Limonene:      ['limonene','d-limonene'],
  Caryophyllene: ['caryophyllene','beta-caryophyllene','b-caryophyllene'],
  Pinene:        ['pinene','a-pinene','alpha-pinene','b-pinene','beta-pinene'],
  Linalool:      ['linalool'],
  Humulene:      ['humulene','alpha-humulene','a-humulene'],
  Terpinolene:   ['terpinolene'],
  Bisabolol:     ['bisabolol','alpha-bisabolol','a-bisabolol'],
};
const CANNABINOID_UNITS = new Set(['THC','THCA','CBD','CBDA','CBG','CBGA','CBN','CBC','THCV','THCVA','Delta-9-THC','Delta-8-THC','Total Cannabinoids','TAC']);

const EFFECT_TILES = [
  { terp: 'Myrcene',       icon: '😴', label: 'Sleepy',   sub: 'Myrcene · couch-lock',    fx: 'sleepy' },
  { terp: 'Limonene',      icon: '🌞', label: 'Uplifted', sub: 'Limonene · mood boost',   fx: 'uplift' },
  { terp: 'Caryophyllene', icon: '🛡️', label: 'Relief',   sub: 'Caryophyllene · pain',    fx: 'relief' },
  { terp: 'Pinene',        icon: '🎯', label: 'Focus',    sub: 'Pinene · clarity',        fx: 'focus'  },
  { terp: 'Linalool',      icon: '🧘', label: 'Calm',     sub: 'Linalool · anxiety',      fx: 'calm'   },
  { terp: 'Humulene',      icon: '🌾', label: 'Earthy',   sub: 'Humulene · grounding',    fx: 'earthy' },
  { terp: 'Terpinolene',   icon: '✨', label: 'Creative', sub: 'Terpinolene · energy',    fx: 'creative'},
  { terp: 'Bisabolol',     icon: '🌸', label: 'Soothe',   sub: 'Bisabolol · anti-inflam', fx: 'soothe' },
];

/* ─── Cannabinoid tiles (edible path) ─────────────────── */
const CANNABINOID_TILES = [
  { id: 'THC',  icon: '🌟', label: 'Euphoria',  sub: 'THC · classic high',     fx: 'uplift'  },
  { id: 'THCV', icon: '⚡', label: 'Energy',    sub: 'THCV · appetite-lean',   fx: 'creative' },
  { id: 'CBN',  icon: '🌙', label: 'Sleep',     sub: 'CBN · nighttime',        fx: 'sleepy'  },
  { id: 'CBD',  icon: '🛡️', label: 'Pain',      sub: 'CBD · full-body relief', fx: 'relief'  },
  { id: 'CBG',  icon: '🌱', label: 'Focus',     sub: 'CBG · daytime clarity',  fx: 'focus'   },
  { id: 'CBC',  icon: '🌸', label: 'Soothe',    sub: 'CBC · mood & mellow',    fx: 'calm'    },
];

/* ─── Category tiles (tincture removed from top-level) ── */
const CATEGORY_TILES = [
  { kind: 'flower',  icon: '🌿', label: 'Flower',      sub: 'Bud, pre-packs, smalls' },
  { kind: 'vape',    icon: '💨', label: 'Vape',        sub: 'Cartridges, disposables' },
  { kind: 'extract', icon: '💎', label: 'Concentrate', sub: 'Live resin, rosin, wax' },
  { kind: 'edible',  icon: '🍬', label: 'Edible',      sub: 'Troches, capsules, RSO' },
  { kind: 'topical', icon: '🧴', label: 'Topical',     sub: 'Lotions, balms, patches' },
  { kind: 'gear',    icon: '🛠️', label: 'Gear',        sub: 'Batteries & accessories' },
];

/* ─── Subtype config per category ───────────────────────
   For each subtype: label, icon, and `match` is a list of
   substrings that when found in root_subtype/product_subtype/
   category/name (case-insensitive) tag the product. RSO is
   intentionally double-linked: appears in edibles AND topicals.
   ─────────────────────────────────────────────────────── */
const SUBTYPE_CONFIG = {
  extract: {
    title: 'Pick consistency',
    sub: 'Multi-select. Skip to see all concentrates.',
    multi: true,
    options: [
      { id: 'live_resin', icon: '💧', label: 'Live Resin', match: ['live resin','live_resin','liveresin'] },
      { id: 'rosin',      icon: '✨', label: 'Rosin',      match: ['rosin'] },
      { id: 'budder',     icon: '🧈', label: 'Budder',     match: ['budder','badder'] },
      { id: 'wax',        icon: '🍯', label: 'Wax',        match: ['wax'] },
      { id: 'shatter',    icon: '🔷', label: 'Shatter',    match: ['shatter'] },
      { id: 'sugar',      icon: '🍬', label: 'Sugar',      match: ['sugar'] },
      { id: 'diamonds',   icon: '💎', label: 'Diamonds',   match: ['diamond','sauce'] },
      { id: 'hash',       icon: '🟫', label: 'Hash/Kief',  match: ['hash','kief','bubble'] },
    ],
  },
  edible: {
    title: 'Pick edible type',
    sub: 'Multi-select. Tincture lives here now. RSO is also under topicals.',
    multi: true,
    options: [
      { id: 'troche',   icon: '💊', label: 'Troche',   match: ['troche'] },
      { id: 'capsule',  icon: '💊', label: 'Capsule',  match: ['capsule','softgel','soft gel','cap '] },
      { id: 'rso',      icon: '🧪', label: 'RSO',      match: ['rso'] },
      { id: 'tincture', icon: '💧', label: 'Tincture', match: ['tincture','sublingual'] },
      { id: 'gummy',    icon: '🍬', label: 'Gummy',    match: ['gummy','gummies','chew'] },
      { id: 'chocolate',icon: '🍫', label: 'Chocolate',match: ['chocolate'] },
      { id: 'beverage', icon: '🥤', label: 'Beverage', match: ['drink','beverage','syrup'] },
    ],
  },
  topical: {
    title: 'Pick topical type',
    sub: 'Multi-select. RSO is double-linked: edibles AND topicals.',
    multi: true,
    options: [
      { id: 'lotion', icon: '🧴', label: 'Lotion', match: ['lotion','cream'] },
      { id: 'balm',   icon: '🌿', label: 'Balm',   match: ['balm','salve'] },
      { id: 'patch',  icon: '🩹', label: 'Patch',  match: ['patch'] },
      { id: 'rso',    icon: '🧪', label: 'RSO',    match: ['rso'] },
    ],
  },
  gear: {
    title: 'Pick gear type',
    sub: '"Other" catches anything we can\'t tag automatically.',
    multi: false,
    options: [
      { id: 'battery', icon: '🔋', label: 'Battery',    match: ['battery','510 thread','510-thread','charger'] },
      { id: 'gear',    icon: '🛠️', label: 'Gear',       match: ['pipe','bong','rig','grinder','paper','wrap','cone','tip','rolling','lighter','tray'] },
      { id: 'other',   icon: '📦', label: 'Other',      match: ['__other__'] },
    ],
  },
};

/* ─── Extract-type submenu (edible path) ─────────────── */
const EXTRACT_TYPES = [
  { id: 'distillate', icon: '💧', label: 'Distillate', sub: 'pure THC/cannabinoid',     match: ['distillate','isolate'] },
  { id: 'rosin',      icon: '✨', label: 'Rosin',      sub: 'solventless, full-plant',   match: ['rosin'] },
  { id: 'live_resin', icon: '🌿', label: 'Live Resin', sub: 'frozen flower, full-spec',  match: ['live resin','live_resin'] },
];

/* ─── Side filters on results ────────────────────────── */
/* Flower "ground" detection tightened — word-boundary / key-only match,
 * so that a bud-shaped half-oz doesn't get misclassified because the name
 * happens to contain a substring like "ground-breaking" or a grinder is
 * mentioned in the description. Large sizes (½ oz, 1 oz) default to BUDS
 * unless explicitly marked as ground/shake/milled in the subtype. */
function isGroundFlower(p) {
  const sub = `${p.product_subtype||''} ${p.root_subtype||''}`.toLowerCase();
  const name = (p.name||'').toLowerCase();
  /* explicit subtype tag is authoritative */
  if (/\b(ground|shake|milled|trim)\b/.test(sub)) return true;
  /* only trust the name if it's a *distinct* word */
  if (/\b(ground flower|shake|milled|pre-ground|preground)\b/.test(name)) return true;
  return false;
}
function isPreRoll(p) {
  const hay = `${p.name||''} ${p.product_subtype||''} ${p.root_subtype||''}`.toLowerCase();
  return /\b(pre-?roll|joint|blunt|infused roll)\b/.test(hay);
}
const SIDE_FILTERS = {
  flower: {
    title: 'Flower form',
    options: [
      { id: 'all',     label: 'All',      match: null },
      { id: 'buds',    label: 'Buds',     match: (p) => !isGroundFlower(p) && !isPreRoll(p) },
      { id: 'ground',  label: 'Ground',   match: (p) => isGroundFlower(p) },
      { id: 'preroll', label: 'Pre-roll', match: (p) => isPreRoll(p) },
    ],
  },
  vape: {
    title: 'Vape form',
    options: [
      { id: 'all',         label: 'All',         match: null },
      { id: 'cartridge',   label: 'Cartridge',   match: (p) => matchesAny(p, ['cartridge','cart','510']) && !matchesAny(p,['disposable','pod']) },
      { id: 'disposable',  label: 'Disposable',  match: (p) => matchesAny(p, ['disposable','all-in-one','all in one','aio']) },
      { id: 'pod',         label: 'Pod',         match: (p) => matchesAny(p, ['pod','pax']) },
    ],
  },
  edible: {
    title: 'Pack size',
    options: [
      { id: 'all',  label: 'All',  match: null },
      { id: '2',    label: '2pk',  match: (p) => matchesAny(p, ['2 pack','2-pack','2pk','x2']) },
      { id: '15',   label: '15pk', match: (p) => matchesAny(p, ['15 pack','15-pack','15pk','x15']) },
      { id: '20',   label: '20pk', match: (p) => matchesAny(p, ['20 pack','20-pack','20pk','x20']) },
      { id: '40',   label: '40pk', match: (p) => matchesAny(p, ['40 pack','40-pack','40pk','x40']) },
    ],
  },
};
function matchesAny(p, needles) {
  const hay = `${p.name||''} ${p.product_subtype||''} ${p.root_subtype||''} ${p.category||''}`.toLowerCase();
  return needles.some(n => hay.includes(n));
}

/* ─── Themes ─────────────────────────────────────────── */
const THEMES = [
  { id: 'noir',     name: 'Noir',     color: '#8bc541' },
  { id: 'earth',    name: 'Earth',    color: '#1D9E75' },
  { id: 'midnight', name: 'Midnight', color: '#7D9BFF' },
  { id: 'sunset',   name: 'Sunset',   color: '#E56F3C' },
  { id: 'lavender', name: 'Lavender', color: '#8664C6' },
  { id: 'ocean',    name: 'Ocean',    color: '#0E8A90' },
  { id: 'mono',     name: 'Mono',     color: '#222222' },
];

/* ─── Naughty strings ────────────────────────────────── */
const NAUGHTY_STRINGS = {
  banner:     'The Terp Search',
  brandSub:   "what the fuck do you want to smoke",
  catTitle:   'Pick your poison',
  catSub:     "what category we fuckin' with today",
  subTitle:   'Narrow that shit down',
  subSub:     'pick what kind',
  sizeTitle:  'How much you tryna cop',
  sizeSub:    "don't be shy now",
  fxTitle:    'How you wanna feel',
  fxSub:      'pick up to 3 vibes',
  fxGo:       "let's fuckin' go →",
  fxSkip:     'skip that shit',
  cnTitle:    "What's the move",
  cnSub:      'edibles hit different, cannabinoids over terps',
  cnGo:       "hell yeah →",
  exTitle:    'Extract style?',
  exSub:      'distillate is cheap and hits. rosin/live resin flex.',
  resTitle:   "here's your shit",
  resSub:     'tap + to toss it in the bag. side menu to narrow.',
  cartLabel:  'shit in the bag',
  cartTitle:  'Your cart',
  cartSub:    'scan the QR to grab everything',
  qrLabel:    'SCAN AND GO GET IT',
  copyBtn:    'Copy',
  addMoreBtn: '+ Grab more',
  clearBtn:   '🗑 Fuck it, start over',
  csView:     'Checkout →',
  csMore:     '+ More shit',
  addVariants: ['gimmie dat', 'i want this', 'one of these please', 'in the bag', 'lock it in', 'yes please', 'load me up', 'yoink', 'send it', 'add the vibe', 'yup yup', 'in the cart', 'cop it'],
  stickerHot:  ['holy shit', 'damn', 'whoa 🔥', 'that one', 'no way', 'hell yeah', 'fire', 'sendit', 'stacked', 'top shelf', 'nuclear', 'loaded', 'boom', 'big T', 'facts'],
  stickerSale: ['damn, steal', 'holy shit price', 'steal deal', 'get it', 'free money', 'marked down', 'flash sale', 'whaaat', 'bargain bin', 'clearance', 'broke-day friendly', 'dub of the week'],
  stickerFresh:['new drop', 'fresh', 'just in', 'hot batch'],
  stickerPref: ['staff pick', 'budtender fav', 'personal pick'],
  effects: {
    Myrcene:       { icon:'😴', label:'Couchlocked',     sub:'myrcene · glued to the couch' },
    Limonene:      { icon:'🌞', label:'Zooted',          sub:'limonene · mood boost af' },
    Caryophyllene: { icon:'🛡️', label:"Pain? What pain", sub:'caryophyllene · relief' },
    Pinene:        { icon:'🎯', label:"Locked in",       sub:'pinene · laser focus' },
    Linalool:      { icon:'🧘', label:"Fuck anxiety",    sub:'linalool · calm as shit' },
    Humulene:      { icon:'🌾', label:'No munchies',     sub:'humulene · appetite killer' },
    Terpinolene:   { icon:'✨', label:'Creative AF',     sub:'terpinolene · brain fire' },
    Bisabolol:     { icon:'🌸', label:'Smooth',          sub:'bisabolol · soothe' },
  },
  cannab: {
    THC:  { icon:'🌟', label:'Get blasted',      sub:'thc · straight euphoria' },
    THCV: { icon:'⚡', label:'Wired but skinny', sub:'thcv · energy no munchies' },
    CBN:  { icon:'🌙', label:'Pass tf out',      sub:'cbn · lights out' },
    CBD:  { icon:'🛡️', label:'Kill the pain',    sub:'cbd · body relief' },
    CBG:  { icon:'🌱', label:'Day-one focus',    sub:'cbg · morning clarity' },
    CBC:  { icon:'🌸', label:'Chill mood',       sub:'cbc · smooth vibes' },
  },
};

/* ─── State ───────────────────────────────────────────── */
const state = {
  screen: 'loading',
  products: [],
  selCat: null,
  selSubs: [],       // subtype (multi for extract/edible/topical, single for gear)
  selSize: null,
  selTerps: [],
  selCannabs: [],
  selExtract: null,  // for edible path
  sideFilter: 'all', // for results page
  cart: new Map(),
  theme:   localStorage.getItem('terpfinder_theme')   || 'noir',
  naughty: localStorage.getItem('terpfinder_naughty') === '1',
  storeId: localStorage.getItem('terpfinder_store')   || '4365',
};

/* ─── API ─────────────────────────────────────────────── */
async function loadMenu() {
  setToast('loading', `Connecting to ${currentStore().name}…`);
  document.getElementById('loading-sub').textContent =
    `Pulling live inventory from store #${state.storeId} (${currentStore().name})`;
  const requests = KINDS.map(k => ({
    indexName: INDEX,
    params: new URLSearchParams({
      query: '',
      hitsPerPage: '1000',
      filters: `store_id = ${state.storeId} AND kind:${k}`,
    }).toString(),
  }));
  try {
    const res = await fetch(`https://${HOST}/1/indexes/*/queries`, {
      method: 'POST',
      headers: {
        'X-Algolia-Application-Id': APP_ID,
        'X-Algolia-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const seen = new Set();
    state.products = [];
    for (const r of (data.results || [])) {
      for (const h of (r.hits || [])) {
        if (h.objectID && !seen.has(h.objectID)) {
          seen.add(h.objectID);
          h._terps = extractTerps(h);
          h._cannabs = extractCannabinoids(h);
          h._sizes = extractSizes(h);
          h._subs  = detectSubtypes(h);
          /* Tincture products get folded into the edible category */
          if (h.kind === 'tincture') {
            h.kind = 'edible';
            if (!h._subs.includes('tincture')) h._subs.push('tincture');
          }
          state.products.push(h);
        }
      }
    }
    setToast('ok', `✓ ${currentStore().name} loaded — ${state.products.length.toLocaleString()} products`);
    setTimeout(() => document.getElementById('toast').classList.add('hidden'), 2800);
    renderCategoryGrid();
    setScreen('category');
  } catch (e) {
    console.error(e);
    setToast('fail', `Could not reach menu. ${e?.message || ''}`);
    document.getElementById('screen-loading').innerHTML = `
      <div class="state-box">
        <div class="icon">⚠️</div>
        <p><strong>Could not load menu.</strong></p>
        <p class="sub">${e?.message || 'Unknown error'}</p>
        <p class="sub" style="margin-top:12px;">If CORS is blocking, serve via <code>npx serve .</code></p>
      </div>`;
  }
}

function extractTerps(p) {
  const byName = {};
  for (const entry of (p.lab_results || [])) {
    for (const r of (entry.lab_results || [])) {
      const raw = (r.unit_id || r.compound_name || '').trim();
      if (!raw || CANNABINOID_UNITS.has(raw)) continue;
      for (const [canon, aliases] of Object.entries(TERP_MAP)) {
        const rl = raw.toLowerCase();
        if (aliases.some(a => rl === a || rl.includes(a))) {
          const v = Number(r.value);
          if (!byName[canon] || (Number.isFinite(v) && v > byName[canon].value)) {
            byName[canon] = { name: canon, value: Number.isFinite(v) ? v : null };
          }
          break;
        }
      }
    }
  }
  return Object.values(byName);
}

function extractCannabinoids(p) {
  const byName = {};
  for (const entry of (p.lab_results || [])) {
    for (const r of (entry.lab_results || [])) {
      const raw = (r.unit_id || r.compound_name || '').trim();
      if (!raw) continue;
      const u = raw.toUpperCase().replace(/-|\s/g, '');
      let id = null;
      if (u === 'THC' || u === 'DELTA9THC' || u === 'THCA') id = 'THC';
      else if (u === 'THCV' || u === 'THCVA') id = 'THCV';
      else if (u === 'CBD' || u === 'CBDA') id = 'CBD';
      else if (u === 'CBN') id = 'CBN';
      else if (u === 'CBG' || u === 'CBGA') id = 'CBG';
      else if (u === 'CBC') id = 'CBC';
      if (!id) continue;
      const v = Number(r.value);
      if (!byName[id] || (Number.isFinite(v) && v > byName[id].value)) {
        byName[id] = { name: id, value: Number.isFinite(v) ? v : null };
      }
    }
  }
  /* if THC rail not in lab results, fall back to percent_thc */
  if (!byName.THC && Number.isFinite(p.percent_thc) && p.percent_thc > 0) {
    byName.THC = { name: 'THC', value: p.percent_thc };
  }
  return Object.values(byName);
}

function extractSizes(p) {
  const out = [];
  for (const k of SIZE_KEYS) {
    const full = p[`price_${k}`];
    const disc = p[`discounted_price_${k}`];
    if (full == null && disc == null) continue;
    const price = (disc != null ? disc : full);
    const onSale = (disc != null && full != null && disc < full);
    /* Labels are computed at render-time (getSizeLabel) because they depend
     * on state.naughty AND the product's kind. We still stash the raw key. */
    out.push({
      key: k,
      price, full,
      onSale,
    });
  }
  return out;
}

/* Detect which subtypes a product matches (for the category it lives in).
   Uses root_subtype / product_subtype / category / name fields. */
function detectSubtypes(p) {
  const cfg = SUBTYPE_CONFIG[p.kind];
  if (!cfg) return [];
  const hay = `${p.name||''} ${p.product_subtype||''} ${p.root_subtype||''} ${p.category||''}`.toLowerCase();
  const hits = [];
  for (const opt of cfg.options) {
    if (opt.match.some(k => k !== '__other__' && hay.includes(k))) hits.push(opt.id);
  }
  /* "other" in gear: anything that matched nothing else */
  if (p.kind === 'gear' && hits.length === 0) hits.push('other');
  return hits;
}

/* ─── Stores ─────────────────────────────────────────── */
function currentStore() { return STORES.find(s => s.id === state.storeId) || STORES[STORES.length - 1]; }
function applyStore(id) {
  state.storeId = id;
  localStorage.setItem('terpfinder_store', id);
  document.getElementById('store-name').textContent = currentStore().name;
  /* wipe state + reload menu */
  state.products = []; state.cart.clear();
  state.selCat = null; state.selSubs = []; state.selSize = null;
  state.selTerps = []; state.selCannabs = []; state.selExtract = null; state.sideFilter = 'all';
  setScreen('loading');
  loadMenu();
  renderStoreSheet();
  updateSidePanels();
}

/* ─── Screen router ──────────────────────────────────── */
/* Subtypes that don't have an "extract style" distinction in practice.
 * Capsules/tinctures/troches are pharma-style dosing forms that don't come
 * in rosin/distillate variants at OR — showing the extract screen for them
 * was a dead-end step that just filtered everything to zero. */
const EDIBLE_SKIP_EXTRACT = new Set(['capsule','tincture','troche','patch']);
/* Subtypes where the cannabinoid choice is the primary axis and the user
 * usually doesn't care about terps (tinctures/capsules are dosed for a
 * specific cannabinoid, so we want cannab step but skip extract). */
function flowFor(cat) {
  switch (cat) {
    case 'flower':
    case 'vape':
      return ['category', 'size', 'effects', 'results'];
    case 'extract':
      return ['category', 'subtype', 'effects', 'results'];
    case 'edible': {
      /* Dynamic: trim the `extract` step when the user's subtype pick
       * means an extract-style question doesn't apply. */
      const picks = state.selSubs || [];
      const skipEx = picks.length > 0 && picks.every(s => EDIBLE_SKIP_EXTRACT.has(s));
      return skipEx
        ? ['category', 'subtype', 'cannab', 'results']
        : ['category', 'subtype', 'cannab', 'extract', 'results'];
    }
    case 'topical':
      return ['category', 'subtype', 'results'];
    case 'gear':
      return ['category', 'subtype', 'results'];
    default:
      return ['category', 'results'];
  }
}
function fullOrder() {
  if (!state.selCat) return ['category'];
  return [...flowFor(state.selCat), 'cart'];
}
function setScreen(name) {
  state.screen = name;
  for (const s of document.querySelectorAll('.screen')) s.classList.remove('active');
  const el = document.getElementById(`screen-${name}`);
  if (el) el.classList.add('active');
  const order = fullOrder();
  const idx = order.indexOf(name);
  document.getElementById('back-btn').style.display = (idx > 0 && name !== 'loading') ? '' : 'none';
  updateSidePanels();
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function goBack() {
  const order = fullOrder();
  const i = order.indexOf(state.screen);
  if (i <= 0) return;
  setScreen(order[i - 1]);
}
function goNext() {
  const order = fullOrder();
  const i = order.indexOf(state.screen);
  const next = order[i + 1];
  if (!next) return;
  if (next === 'results') renderResults();
  else if (next === 'size') renderSizeGrid();
  else if (next === 'effects') renderEffectsGrid();
  else if (next === 'cannab') renderCannabGrid();
  else if (next === 'extract') renderExtractGrid();
  else if (next === 'subtype') renderSubtypeGrid();
  setScreen(next);
}

/* ─── Renderers ──────────────────────────────────────── */
function renderCategoryGrid() {
  const grid = document.getElementById('cat-grid');
  const counts = {};
  for (const p of state.products) counts[p.kind] = (counts[p.kind] || 0) + 1;
  grid.innerHTML = '';
  for (const c of CATEGORY_TILES) {
    const n = counts[c.kind] || 0;
    const tile = document.createElement('div');
    tile.className = 'tile' + (n === 0 ? ' disabled' : '') + (state.selCat === c.kind ? ' selected' : '');
    tile.innerHTML = `
      <span class="tile-badge">${n}</span>
      <div class="tile-icon">${c.icon}</div>
      <div class="tile-title">${c.label}</div>
      <div class="tile-sub">${c.sub}</div>
    `;
    tile.addEventListener('click', () => {
      if (n === 0) return;
      state.selCat = c.kind;
      state.selSubs = []; state.selSize = null; state.selTerps = [];
      state.selCannabs = []; state.selExtract = null; state.sideFilter = 'all';
      goNext();
    });
    grid.appendChild(tile);
  }
}

function renderSubtypeGrid() {
  const cfg = SUBTYPE_CONFIG[state.selCat];
  if (!cfg) { goNext(); return; }
  document.getElementById('sub-title').textContent = state.naughty ? NAUGHTY_STRINGS.subTitle : cfg.title;
  document.getElementById('sub-sub').textContent   = state.naughty ? NAUGHTY_STRINGS.subSub   : cfg.sub;
  const pool = state.products.filter(p => p.kind === state.selCat);
  const counts = {};
  for (const p of pool) for (const s of p._subs) counts[s] = (counts[s] || 0) + 1;
  const grid = document.getElementById('sub-grid');
  grid.innerHTML = '';
  for (const opt of cfg.options) {
    const n = counts[opt.id] || 0;
    if (n === 0 && opt.id !== 'other') continue;
    const selected = state.selSubs.includes(opt.id);
    const tile = document.createElement('div');
    tile.className = 'tile' + (selected ? ' selected' : '');
    tile.innerHTML = `
      <span class="tile-badge">${n}</span>
      <div class="tile-icon">${opt.icon}</div>
      <div class="tile-title">${opt.label}</div>
    `;
    tile.addEventListener('click', () => {
      if (cfg.multi) {
        if (selected) state.selSubs = state.selSubs.filter(x => x !== opt.id);
        else          state.selSubs.push(opt.id);
      } else {
        state.selSubs = selected ? [] : [opt.id];
      }
      renderSubtypeGrid();
      updateSidePanels();
    });
    grid.appendChild(tile);
  }
}

function renderSizeGrid() {
  const pool = state.products.filter(p => p.kind === state.selCat);
  const counts = {};
  for (const p of pool) for (const s of p._sizes) counts[s.key] = (counts[s.key] || 0) + 1;
  const ordered = SIZE_KEYS.filter(k => counts[k] > 0);
  const grid = document.getElementById('size-grid');
  grid.innerHTML = '';

  const anyTile = document.createElement('div');
  anyTile.className = 'tile' + (state.selSize === null ? ' selected' : '');
  anyTile.innerHTML = `
    <span class="tile-badge">${pool.length}</span>
    <div class="tile-icon">🎲</div>
    <div class="tile-title">Any size</div>
    <div class="tile-sub">Show all</div>
  `;
  anyTile.addEventListener('click', () => { state.selSize = null; goNext(); });
  grid.appendChild(anyTile);

  for (const k of ordered) {
    const tile = document.createElement('div');
    tile.className = 'tile' + (state.selSize === k ? ' selected' : '');
    const label = getSizeLabel(k, state.selCat, state.naughty);
    const sub   = getSizeSub(k, state.selCat);
    tile.innerHTML = `
      <span class="tile-badge">${counts[k]}</span>
      <div class="tile-icon">${SIZE_ICONS[k] || '📦'}</div>
      <div class="tile-title">${label}</div>
      <div class="tile-sub">${sub}</div>
    `;
    tile.addEventListener('click', () => { state.selSize = k; goNext(); });
    grid.appendChild(tile);
  }
}

function renderEffectsGrid() {
  const grid = document.getElementById('fx-grid');
  grid.innerHTML = '';
  const mode = state.naughty ? NAUGHTY_STRINGS.effects : null;
  for (const e of EFFECT_TILES) {
    const over = mode ? mode[e.terp] : null;
    const tile = document.createElement('div');
    const atMax = state.selTerps.length >= 3 && !state.selTerps.includes(e.terp);
    tile.className = 'tile' + (state.selTerps.includes(e.terp) ? ' selected' : '') + (atMax ? ' disabled' : '');
    tile.dataset.fx = e.fx;
    tile.innerHTML = `
      <div class="tile-icon">${over?.icon || e.icon}</div>
      <div class="tile-title">${over?.label || e.label}</div>
      <div class="tile-sub">${over?.sub || e.sub}</div>
    `;
    tile.addEventListener('click', () => {
      if (state.selTerps.includes(e.terp)) state.selTerps = state.selTerps.filter(t => t !== e.terp);
      else if (state.selTerps.length < 3)  state.selTerps.push(e.terp);
      renderEffectsGrid();
      updateSidePanels();
    });
    grid.appendChild(tile);
  }
}

function renderCannabGrid() {
  const grid = document.getElementById('cn-grid');
  grid.innerHTML = '';
  const mode = state.naughty ? NAUGHTY_STRINGS.cannab : null;
  for (const c of CANNABINOID_TILES) {
    const over = mode ? mode[c.id] : null;
    const tile = document.createElement('div');
    const atMax = state.selCannabs.length >= 3 && !state.selCannabs.includes(c.id);
    tile.className = 'tile' + (state.selCannabs.includes(c.id) ? ' selected' : '') + (atMax ? ' disabled' : '');
    tile.dataset.fx = c.fx;
    tile.innerHTML = `
      <div class="tile-icon">${over?.icon || c.icon}</div>
      <div class="tile-title">${over?.label || c.label}</div>
      <div class="tile-sub">${over?.sub || c.sub}</div>
    `;
    tile.addEventListener('click', () => {
      if (state.selCannabs.includes(c.id)) state.selCannabs = state.selCannabs.filter(x => x !== c.id);
      else if (state.selCannabs.length < 3) state.selCannabs.push(c.id);
      renderCannabGrid();
      updateSidePanels();
    });
    grid.appendChild(tile);
  }
}

function renderExtractGrid() {
  const grid = document.getElementById('ex-grid');
  grid.innerHTML = '';
  const anyTile = document.createElement('div');
  anyTile.className = 'tile' + (state.selExtract === null ? ' selected' : '');
  anyTile.innerHTML = `<div class="tile-icon">🎲</div><div class="tile-title">Any</div><div class="tile-sub">Show all</div>`;
  anyTile.addEventListener('click', () => { state.selExtract = null; goNext(); });
  grid.appendChild(anyTile);
  for (const e of EXTRACT_TYPES) {
    const tile = document.createElement('div');
    tile.className = 'tile' + (state.selExtract === e.id ? ' selected' : '');
    tile.innerHTML = `<div class="tile-icon">${e.icon}</div><div class="tile-title">${e.label}</div><div class="tile-sub">${e.sub}</div>`;
    tile.addEventListener('click', () => { state.selExtract = e.id; goNext(); });
    grid.appendChild(tile);
  }
}

function getFilteredProducts() {
  let list = state.products.filter(p => p.kind === state.selCat);

  /* subtype filter */
  if (state.selSubs.length) {
    list = list.filter(p => p._subs.some(s => state.selSubs.includes(s)));
  }
  /* size filter */
  if (state.selSize) list = list.filter(p => p._sizes.some(s => s.key === state.selSize));
  /* extract-style filter (edible path) */
  if (state.selExtract) {
    const mk = EXTRACT_TYPES.find(e => e.id === state.selExtract)?.match || [];
    list = list.filter(p => matchesAny(p, mk));
  }
  /* effect filter: terps OR cannabinoids depending on category */
  const useCannab = state.selCat === 'edible';
  /* A "hit" requires an actual measurable value (>= 0.05%). Products where the
   * terp/cannabinoid is listed with null or 0 don't count — that was the cause
   * of the "1g flower shows items with no selected terp" bug: products with
   * stub lab entries were passing the filter with zero-value hits. */
  const MIN_TERP_VALUE = 0.05;
  const scoreBy = (items, picks) => {
    const byName = {};
    for (const x of items) byName[x.name] = Number.isFinite(x.value) ? x.value : 0;
    let sum = 0, hits = 0;
    for (const t of picks) {
      const v = byName[t];
      if (v != null && v >= MIN_TERP_VALUE) { hits++; sum += v; }
    }
    return { sum, hits };
  };
  /* Edibles also get a fallback: if cannabinoid isn't found in lab_results, try
   * the product name (this is why CBN capsules were vanishing — lab panel
   * doesn't list CBN but "CBN Capsule" in the name makes it obvious). */
  const nameContains = (p, token) => {
    const hay = `${p.name||''} ${p.product_subtype||''} ${p.root_subtype||''} ${p.brand||''}`.toLowerCase();
    return hay.includes(token.toLowerCase());
  };
  const scoreByWithNameFallback = (items, picks, p) => {
    const s = scoreBy(items, picks);
    if (s.hits > 0) return s;
    /* name-based fallback for edibles/capsules that don't lab-report cannabinoids */
    let hits = 0, sum = 0;
    for (const t of picks) {
      if (nameContains(p, t)) { hits++; sum += 1; } /* synthetic score of 1 for name-matches */
    }
    return { sum, hits, nameMatched: hits > 0 };
  };
  if (useCannab && state.selCannabs.length) {
    list = list.map(p => {
                 const s = scoreByWithNameFallback(p._cannabs, state.selCannabs, p);
                 return { ...p, _mc: s.hits, _mScore: s.sum, _nameMatched: !!s.nameMatched };
               })
               .filter(p => p._mc > 0);
    list.sort((a,b) => (b._mScore - a._mScore) || (b._mc - a._mc) || ((chosenSize(a)?.price ?? 1e9) - (chosenSize(b)?.price ?? 1e9)));
  } else if (!useCannab && state.selTerps.length) {
    list = list.map(p => { const s = scoreBy(p._terps, state.selTerps); return { ...p, _mc: s.hits, _mScore: s.sum }; })
               .filter(p => p._mc > 0);
    list.sort((a,b) => (b._mScore - a._mScore) || (b._mc - a._mc) || ((chosenSize(a)?.price ?? 1e9) - (chosenSize(b)?.price ?? 1e9)));
  } else {
    list = list.map(p => ({ ...p, _mc: 0 }));
    list.sort((a,b) => (chosenSize(a)?.price ?? 1e9) - (chosenSize(b)?.price ?? 1e9));
  }
  /* side filter */
  const sf = SIDE_FILTERS[state.selCat];
  if (sf && state.sideFilter !== 'all') {
    const opt = sf.options.find(o => o.id === state.sideFilter);
    if (opt?.match) list = list.filter(p => opt.match(p));
  }
  return list;
}
function chosenSize(p) {
  if (state.selSize) return p._sizes.find(s => s.key === state.selSize) || null;
  return p._sizes.slice().sort((a,b) => (a.price ?? 1e9) - (b.price ?? 1e9))[0] || null;
}

function renderResults() {
  const list = getFilteredProducts();
  const summaryEl = document.getElementById('res-summary');
  const chips = [];
  const cat = CATEGORY_TILES.find(c => c.kind === state.selCat);
  if (cat) chips.push(`<span class="chip hot">${cat.icon} ${cat.label}</span>`);
  for (const s of state.selSubs) {
    const cfg = SUBTYPE_CONFIG[state.selCat];
    const opt = cfg?.options.find(o => o.id === s);
    if (opt) chips.push(`<span class="chip">${opt.icon} ${opt.label}</span>`);
  }
  if (state.selSize) chips.push(`<span class="chip">${getSizeLabel(state.selSize, state.selCat, state.naughty)}</span>`);
  if (state.selCat === 'edible') {
    for (const c of state.selCannabs) {
      const ct = CANNABINOID_TILES.find(x => x.id === c);
      if (ct) chips.push(`<span class="chip">${ct.icon} ${ct.label}</span>`);
    }
    if (state.selExtract) {
      const ex = EXTRACT_TYPES.find(e => e.id === state.selExtract);
      if (ex) chips.push(`<span class="chip">${ex.icon} ${ex.label}</span>`);
    }
  } else {
    for (const t of state.selTerps) {
      const fx = EFFECT_TILES.find(x => x.terp === t);
      if (fx) chips.push(`<span class="chip">${fx.icon} ${fx.label}</span>`);
    }
  }
  chips.push(`<span class="chip">${list.length} result${list.length === 1 ? '' : 's'}</span>`);
  summaryEl.innerHTML = chips.join('');

  const listEl = document.getElementById('res-list');
  if (!list.length) {
    listEl.innerHTML = `<div class="state-box"><div class="icon">🔍</div>
      <p>No products match all of these filters.</p>
      <p class="sub">Try loosening terpenes, size, or subtype.</p></div>`;
    return;
  }
  const grid = document.createElement('div');
  grid.className = 'product-grid';
  for (const p of list) grid.appendChild(renderProductCard(p));
  listEl.innerHTML = '';
  listEl.appendChild(grid);
}

function renderProductCard(p) {
  const sz = chosenSize(p);
  const key = `${p.objectID}_${sz?.key || 'x'}`;
  const inCart = state.cart.get(key);
  const strain = (p.category || '').toLowerCase();
  const onSale = !!(sz && sz.onSale);
  const thc = Number.isFinite(p.percent_thc) ? p.percent_thc : null;

  const strainBdg = {sativa:['Sativa','sativa'],indica:['Indica','indica'],hybrid:['Hybrid','hybrid'],cbd:['CBD','cbd']}[strain];
  const badges = [];
  if (strainBdg) badges.push(`<span class="bdg bdg-${strainBdg[1]}">${strainBdg[0]}</span>`);
  if (onSale) badges.push(`<span class="bdg bdg-sale">SALE</span>`);
  if (p._mc) badges.push(`<span class="bdg bdg-match">${p._mc}/${state.selCat === 'edible' ? state.selCannabs.length : state.selTerps.length}</span>`);
  if (thc != null && thc > 0) badges.push(`<span class="bdg bdg-thc${thc >= 28 ? ' hi' : ''}">${thc.toFixed(1)}% THC</span>`);
  /* subtype pill */
  if (p._subs?.length) {
    const cfg = SUBTYPE_CONFIG[p.kind];
    const first = cfg?.options.find(o => o.id === p._subs[0]);
    if (first) badges.push(`<span class="bdg bdg-sub">${first.label}</span>`);
  }

  const img = (p.image_urls && p.image_urls[0]) || (p.photos && p.photos[0]?.urls?.original) || null;
  const imgHTML = img
    ? `<img class="pcard-img" src="${img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'pcard-img-ph',textContent:'🌿'}))">`
    : `<div class="pcard-img-ph">🌿</div>`;

  const szLbl = sz ? getSizeLabel(sz.key, p.kind, state.naughty) : '';
  const priceHTML = sz
    ? `<div class="pcard-price">
         <span class="price-now">$${sz.price.toFixed(2)}</span>
         ${onSale ? `<span class="price-was">$${sz.full.toFixed(2)}</span>` : ''}
         <span class="price-unit">· ${szLbl}</span>
       </div>`
    : '';

  /* show terps for non-edibles, cannabinoids for edibles */
  const chips = state.selCat === 'edible' ? p._cannabs : p._terps;
  const selSet = state.selCat === 'edible' ? state.selCannabs : state.selTerps;
  const chipHTML = (chips && chips.length)
    ? `<div class="pcard-terps">${chips.slice(0, 6).map(t => {
        const isMatch = selSet.includes(t.name);
        return `<span class="tchip${isMatch ? ' match' : ''}">${t.name}${t.value != null ? ' '+t.value.toFixed(2)+'%' : ''}</span>`;
      }).join('')}</div>`
    : '';

  const card = document.createElement('div');
  card.className = 'pcard' + (inCart ? ' in-cart' : '');
  card.innerHTML = `
    ${imgHTML}
    <div class="pcard-badges">${badges.join('')}</div>
    <div class="pcard-name">${esc(p.name || '—')}</div>
    <div class="pcard-brand">${esc(p.brand || '')}</div>
    ${priceHTML}
    ${chipHTML}
    <div class="pcard-qty"></div>
  `;

  /* Stickers in stoner mode — ONLY on truly standout cards, and only some
   * of the time, so the ones that DO appear actually pop. Deterministic by
   * product id so a given product always gets (or doesn't get) the same
   * sticker on every render. */
  if (state.naughty) {
    const veryHot  = thc != null && thc >= 30;                  /* top 10% */
    const steal    = onSale && sz && (sz.full - sz.price) / sz.full >= 0.30; /* 30%+ off */
    const decent   = onSale && sz && (sz.full - sz.price) / sz.full >= 0.20;
    const warm     = thc != null && thc >= 27 && thc < 30;
    /* hash product id → stable 0..1 */
    const seed = (String(p.objectID||p.name||'').split('').reduce((a,c)=>((a*31)+c.charCodeAt(0))|0,7) >>> 0) / 0xffffffff;
    let pool = null, stickerClass = '';
    /* Tuned probabilities so stickers are rare enough to mean something.
     * Overall target: ~15-20% of cards get a sticker, concentrated on the
     * truly standout items so they pop instead of blending into noise. */
    if (veryHot && seed < 0.30)       { pool = NAUGHTY_STRINGS.stickerHot;  stickerClass = 'fire'; }
    else if (steal && seed < 0.30)    { pool = NAUGHTY_STRINGS.stickerSale; stickerClass = 'steal'; }
    else if (warm && seed < 0.10)     { pool = NAUGHTY_STRINGS.stickerHot;  stickerClass = 'fire'; }
    else if (decent && seed < 0.10)   { pool = NAUGHTY_STRINGS.stickerSale; stickerClass = 'deal'; }
    if (pool) {
      const s = document.createElement('div');
      s.className = 'sticker ' + stickerClass;
      /* pick within pool deterministically too */
      s.textContent = pool[Math.floor(seed * pool.length) % pool.length];
      card.appendChild(s);
    }
  }

  const qtyEl = card.querySelector('.pcard-qty');
  if (!sz) {
    qtyEl.innerHTML = `<div style="font-size:11px;color:var(--text-muted);">Not available in this size</div>`;
  } else if (inCart) {
    const minus = Object.assign(document.createElement('button'), { className: 'qty-btn', textContent: '−' });
    const num   = Object.assign(document.createElement('span'),   { className: 'qty-num', textContent: inCart.qty });
    const plus  = Object.assign(document.createElement('button'), { className: 'qty-btn', textContent: '+' });
    minus.addEventListener('click', () => { updateQty(key, inCart.qty - 1); renderResults(); });
    plus.addEventListener('click',  () => { updateQty(key, inCart.qty + 1); renderResults(); });
    qtyEl.append(minus, num, plus);
  } else {
    const label = state.naughty
      ? NAUGHTY_STRINGS.addVariants[Math.floor(Math.random() * NAUGHTY_STRINGS.addVariants.length)]
      : '+ Add to Cart';
    const add = Object.assign(document.createElement('button'), { className: 'qty-btn add', textContent: label });
    add.addEventListener('click', () => { addToCart(p, sz); renderResults(); });
    qtyEl.append(add);
  }
  return card;
}

/* ─── Cart ────────────────────────────────────────────── */
function addToCart(p, sz) {
  const key = `${p.objectID}_${sz.key}`;
  const cur = state.cart.get(key);
  if (cur) { cur.qty += 1; }
  else {
    state.cart.set(key, {
      productId: p.objectID,
      name:  p.name,
      brand: p.brand || '',
      kind:  p.kind,
      subs:  p._subs || [],
      img:   (p.image_urls && p.image_urls[0]) || null,
      /* sizeKey is the only stable thing — labels derive from it at render time */
      sizeKey:   sz.key,
      /* snapshot the formal+gram label for QR use (QR always formal regardless of mode) */
      sizeFormal: getSizeLabel(sz.key, p.kind, false) + (getSizeSub(sz.key, p.kind) ? ' ' + getSizeSub(sz.key, p.kind) : ''),
      qty: 1,
      price: sz.price,
      full:  sz.full != null ? sz.full : sz.price,
    });
  }
  /* animate a flying pill into the cart list and refresh panels */
  updateSidePanels({ flashKey: key });
}
function updateQty(key, q) {
  if (q <= 0) state.cart.delete(key);
  else state.cart.get(key).qty = q;
  updateSidePanels({ flashKey: q > 0 ? key : null });
}
function cartTotals() {
  let salePrice = 0, fullPrice = 0, count = 0;
  for (const v of state.cart.values()) {
    salePrice += v.price * v.qty;
    fullPrice += v.full  * v.qty;
    count += v.qty;
  }
  return { salePrice, fullPrice, saved: fullPrice - salePrice, count };
}

/* ─── Side panels: left (current pick + filter + jump) + right (live cart) ── */
/* Icons for side-filters (visual cue, not mandatory) */
const SIDE_FILTER_ICONS = {
  all: '◎', buds: '🌿', ground: '🧂', preroll: '🚬',
  cartridge: '🛢️', disposable: '🖊️', pod: '🔌',
  '2': '②', '15': '⑮', '20': '⑳', '40': '㊵',
};
function updateSidePanels(opts) {
  opts = opts || {};
  /* ─ LEFT: current pick as dismissable chips (clickable → goes back to that step) ── */
  const chips = [];
  const cat = CATEGORY_TILES.find(c => c.kind === state.selCat);
  if (cat) chips.push({ cls: 'hot', label: `${cat.icon} ${cat.label}`, jumpTo: 'category' });
  for (const s of state.selSubs) {
    const cfg = SUBTYPE_CONFIG[state.selCat];
    const opt = cfg?.options.find(o => o.id === s);
    if (opt) chips.push({ cls: 'dismissable', label: `${opt.icon} ${opt.label}`, onDismiss: () => {
      state.selSubs = state.selSubs.filter(x => x !== s);
      if (state.screen === 'results') renderResults();
      else if (state.screen === 'subtype') renderSubtypeGrid();
      updateSidePanels();
    }});
  }
  if (state.selSize) chips.push({ cls: 'dismissable', label: getSizeLabel(state.selSize, state.selCat, state.naughty), onDismiss: () => {
    state.selSize = null;
    if (state.screen === 'results') renderResults();
    updateSidePanels();
  }});
  if (state.selCat === 'edible') {
    for (const c of state.selCannabs) {
      const ct = CANNABINOID_TILES.find(x => x.id === c);
      chips.push({ cls: 'dismissable', label: ct ? `${ct.icon} ${ct.label}` : c, onDismiss: () => {
        state.selCannabs = state.selCannabs.filter(x => x !== c);
        if (state.screen === 'results') renderResults();
        else if (state.screen === 'cannab') renderCannabGrid();
        updateSidePanels();
      }});
    }
    if (state.selExtract) {
      const ex = EXTRACT_TYPES.find(e => e.id === state.selExtract);
      if (ex) chips.push({ cls: 'dismissable', label: `${ex.icon} ${ex.label}`, onDismiss: () => {
        state.selExtract = null;
        if (state.screen === 'results') renderResults();
        updateSidePanels();
      }});
    }
  } else {
    for (const t of state.selTerps) {
      const fx = EFFECT_TILES.find(x => x.terp === t);
      chips.push({ cls: 'dismissable', label: fx ? `${fx.icon} ${fx.label}` : t, onDismiss: () => {
        state.selTerps = state.selTerps.filter(x => x !== t);
        if (state.screen === 'results') renderResults();
        else if (state.screen === 'effects') renderEffectsGrid();
        updateSidePanels();
      }});
    }
  }
  const chipsEl = document.getElementById('side-l-chips');
  chipsEl.innerHTML = '';
  if (!chips.length) {
    chipsEl.innerHTML = `<span class="side-chip">—</span>`;
  } else {
    for (const c of chips) {
      const span = document.createElement('span');
      span.className = 'side-chip ' + (c.cls || '');
      span.innerHTML = c.label;
      if (c.onDismiss) span.addEventListener('click', c.onDismiss);
      else if (c.jumpTo) span.addEventListener('click', () => setScreen(c.jumpTo));
      chipsEl.appendChild(span);
    }
  }

  /* ─ LEFT: side filter on results screen (bigger + iconic + bar) ── */
  const filterCard = document.getElementById('side-filter-card');
  const sf = SIDE_FILTERS[state.selCat];
  if (state.screen === 'results' && sf) {
    filterCard.style.display = '';
    document.getElementById('side-filter-title').textContent = sf.title;
    const list = document.getElementById('side-filter-list');
    list.innerHTML = '';
    /* counts reflect current filters EXCEPT the side-filter itself */
    const base = state.products.filter(p => p.kind === state.selCat);
    const max = Math.max(...sf.options.map(o => o.match ? base.filter(o.match).length : base.length), 1);
    for (const opt of sf.options) {
      const n = opt.match ? base.filter(opt.match).length : base.length;
      const b = document.createElement('button');
      b.className = 'side-filter' + (state.sideFilter === opt.id ? ' active' : '');
      const ico = SIDE_FILTER_ICONS[opt.id] || '•';
      const pct = Math.round((n / max) * 100);
      b.innerHTML = `
        <span class="sf-ico">${ico}</span>
        <span class="sf-label">${opt.label}</span>
        <span class="count">${n}</span>
        <span class="sf-bar" style="width:${pct}%"></span>
      `;
      b.addEventListener('click', () => {
        state.sideFilter = opt.id;
        renderResults();
        updateSidePanels();
      });
      list.appendChild(b);
    }
  } else {
    filterCard.style.display = 'none';
  }

  /* ─ LEFT: jump-back shortcuts (skip directly to prior step) ── */
  const jumpCard = document.getElementById('side-jump-card');
  const jumpList = document.getElementById('side-jump-list');
  if (state.selCat && (state.screen === 'results' || state.screen === 'effects' || state.screen === 'cannab' || state.screen === 'extract')) {
    const order = fullOrder();
    const idx = order.indexOf(state.screen);
    /* show all earlier steps except loading/category as quick-jumps */
    const STEP_LABELS = {
      category: 'Category', subtype: 'Type', size: 'Size',
      effects: 'Effects', cannab: 'Cannabinoids', extract: 'Extract style',
    };
    const jumps = [];
    for (let i = 1; i < idx; i++) {
      const step = order[i];
      if (STEP_LABELS[step]) jumps.push({ step, label: STEP_LABELS[step] });
    }
    if (jumps.length) {
      jumpCard.style.display = '';
      jumpList.innerHTML = '';
      for (const j of jumps) {
        const b = document.createElement('button');
        b.className = 'side-jump';
        b.innerHTML = `<span>${j.label}</span><span class="arrow">↩</span>`;
        b.addEventListener('click', () => setScreen(j.step));
        jumpList.appendChild(b);
      }
    } else { jumpCard.style.display = 'none'; }
  } else {
    jumpCard.style.display = 'none';
  }

  /* ─ RIGHT: live cart tickets + summary ── */
  renderLiveCartList(opts.flashKey);
  const { salePrice, fullPrice, saved, count } = cartTotals();
  const hasCart = count > 0;
  document.getElementById('cs-empty').style.display = hasCart ? 'none' : '';
  document.getElementById('cs-body').style.display  = hasCart ? '' : 'none';
  const csCount = document.getElementById('cs-count');
  if (hasCart) {
    csCount.style.display = '';
    csCount.textContent = count;
    document.getElementById('cs-total').innerHTML =
      `$${salePrice.toFixed(2)}${saved > 0 ? `<span class="was">reg $${fullPrice.toFixed(2)}</span>` : ''}`;
    const savedEl = document.getElementById('cs-saved');
    if (saved > 0) { savedEl.style.display = ''; savedEl.textContent = `You saved $${saved.toFixed(2)}`; }
    else savedEl.style.display = 'none';
  } else {
    csCount.style.display = 'none';
  }

  /* Lock the summary to the bottom once the list is taller than threshold */
  const col = document.getElementById('cart-column');
  if (count >= 4) col.classList.add('locked');
  else col.classList.remove('locked');
}

/* Render the live cart ticket list (newest-first visually via column-reverse).
 * A "flashKey" marks the just-added ticket with a pulse ring. */
function renderLiveCartList(flashKey) {
  const list = document.getElementById('cart-live-list');
  if (!list) return;
  list.innerHTML = '';
  for (const [key, item] of state.cart.entries()) {
    const szLabel = getSizeLabel(item.sizeKey, item.kind, state.naughty);
    const img = item.img
      ? `<img class="cart-ticket-img" src="${item.img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'cart-ticket-img-ph',textContent:'🌿'}))">`
      : `<div class="cart-ticket-img-ph">🌿</div>`;
    const ticket = document.createElement('div');
    ticket.className = 'cart-ticket' + (key === flashKey ? ' fresh' : '');
    ticket.innerHTML = `
      ${img}
      <div class="cart-ticket-info">
        <div class="cart-ticket-name">${esc(item.name)}</div>
        <div class="cart-ticket-meta">${esc(item.brand || '')}${item.brand ? ' · ' : ''}${szLabel}</div>
      </div>
      <div class="cart-ticket-right">
        <div>$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-ticket-qty">
          <button data-act="dec" aria-label="Remove one">−</button>
          <span>×${item.qty}</span>
          <button data-act="inc" aria-label="Add one">+</button>
        </div>
      </div>
    `;
    ticket.querySelector('[data-act="dec"]').addEventListener('click', () => {
      updateQty(key, item.qty - 1);
      if (state.screen === 'results') renderResults();
      if (state.screen === 'cart')    renderCart();
    });
    ticket.querySelector('[data-act="inc"]').addEventListener('click', () => {
      updateQty(key, item.qty + 1);
      if (state.screen === 'results') renderResults();
      if (state.screen === 'cart')    renderCart();
    });
    list.appendChild(ticket);
  }
}

function renderCart() {
  const list = document.getElementById('cart-list');
  const tot = document.getElementById('cart-totals');
  if (state.cart.size === 0) {
    list.innerHTML = `<div class="state-box"><div class="icon">🛒</div><p>Your cart is empty.</p><p class="sub">Pick a category to start.</p></div>`;
    tot.style.display = 'none';
    document.getElementById('qr-canvas').innerHTML = '';
    return;
  }
  tot.style.display = '';
  list.innerHTML = '';
  for (const [key, item] of state.cart.entries()) {
    const row = document.createElement('div');
    row.className = 'cart-row';
    const img = item.img
      ? `<img class="cart-row-img" src="${item.img}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'cart-row-img-ph',textContent:'🌿'}))">`
      : `<div class="cart-row-img-ph">🌿</div>`;
    const onSale = item.full > item.price;
    const szLabel = getSizeLabel(item.sizeKey, item.kind, state.naughty);
    row.innerHTML = `
      ${img}
      <div class="cart-row-info">
        <div class="cart-row-name">${esc(item.name)}</div>
        <div class="cart-row-meta">${esc(item.brand)} · ${szLabel}</div>
      </div>
      <div class="cart-row-qty">
        <button class="qty-btn" data-act="dec">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" data-act="inc">+</button>
      </div>
      <div class="cart-row-price">
        <div class="p-now">$${(item.price * item.qty).toFixed(2)}</div>
        ${onSale ? `<div class="p-was">$${(item.full * item.qty).toFixed(2)}</div>` : ''}
      </div>
    `;
    row.querySelector('[data-act="dec"]').addEventListener('click', () => { updateQty(key, item.qty - 1); renderCart(); });
    row.querySelector('[data-act="inc"]').addEventListener('click', () => { updateQty(key, item.qty + 1); renderCart(); });
    list.appendChild(row);
  }

  const { salePrice, fullPrice, saved, count } = cartTotals();
  tot.innerHTML = `
    <div class="tot-line"><span>Items</span><span class="v">${count}</span></div>
    ${saved > 0 ? `<div class="tot-line"><span>Regular price</span><span class="v" style="text-decoration:line-through;color:var(--text-muted);">$${fullPrice.toFixed(2)}</span></div>` : ''}
    <div class="tot-grand"><span class="l">${state.naughty ? 'Damage' : 'Total'}</span><span class="v">$${salePrice.toFixed(2)}</span></div>
    ${saved > 0 ? `<div class="tot-saved">You saved $${saved.toFixed(2)} 🎉</div>` : ''}
  `;

  /* QR */
  const text = buildCartText();
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  document.getElementById('qr-canvas').innerHTML = qr.createImgTag(5, 12);
}

/* ─── QR text: grouped in PCC-pick order ──────────────
   Order: Flower → Capsules → Tinctures → Patches → RSO →
          Concentrates → Troches → Vapes → (anything else)
   Line:  `Nx Type Grower Strain Size/weight`
   (Type and size are proper-cased, not all-caps, for readability.)
   ──────────────────────────────────────────────────── */
const QR_ORDER = [
  /* NOTE: order of this array is the order items are matched AND claimed
   * into groups, so place the subtype-based groups BEFORE the kind-based
   * ones that would otherwise swallow them (e.g. an RSO tagged with kind
   * 'edible' should be claimed by the RSO group, not a generic edible
   * bucket; hence RSO is placed before CONCENTRATES). */
  { label: 'Flower',       match: (it) => it.kind === 'flower' },
  { label: 'Capsules',     match: (it) => (it.subs||[]).includes('capsule') },
  { label: 'Tinctures',    match: (it) => (it.subs||[]).includes('tincture') },
  { label: 'Patches',      match: (it) => (it.subs||[]).includes('patch') },
  { label: 'RSO',          match: (it) => (it.subs||[]).includes('rso') },
  { label: 'Concentrates', match: (it) => it.kind === 'extract' },
  { label: 'Troches',      match: (it) => (it.subs||[]).includes('troche') },
  { label: 'Vapes',        match: (it) => it.kind === 'vape' },
];
/* Human-readable type label (singular, Title Case) — for QR lines */
const TYPE_LABEL_OVERRIDES = {
  flower: 'Flower', vape: 'Vape', extract: 'Concentrate',
  edible: 'Edible', topical: 'Topical', gear: 'Gear',
};
function qrTypeLabel(item) {
  /* Prefer the specific subtype when it's a recognized pick-list category */
  const subs = item.subs || [];
  const preferred = ['capsule','tincture','patch','rso','troche','gummy','chocolate','beverage','balm','lotion','live_resin','rosin','budder','wax','shatter','sugar','diamonds','hash'];
  for (const pref of preferred) {
    if (subs.includes(pref)) {
      const cfg = SUBTYPE_CONFIG[item.kind];
      const opt = cfg?.options.find(o => o.id === pref);
      if (opt) return opt.label; /* already properly cased */
    }
  }
  return TYPE_LABEL_OVERRIDES[item.kind] || (item.kind || 'Item');
}
/* Strip the brand out of the strain name so the line isn't repetitive.
 * e.g.  brand="Grassroots"  name="Grassroots Blue Dream"  →  strain="Blue Dream" */
function stripBrandFromName(name, brand) {
  if (!name) return '';
  if (!brand) return name;
  const n = name.trim();
  const b = brand.trim();
  if (!b) return n;
  /* Match brand at start, optionally followed by ' - ' or ' | ' or space */
  const re = new RegExp('^' + b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*[-|:·]?\\s*', 'i');
  return n.replace(re, '').trim() || n;
}
function buildCartText() {
  const date = new Date();
  const stamp = date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  const store = currentStore();
  const lines = [];
  lines.push(`ORGANIC REMEDIES — ${store.name.toUpperCase()}`);
  lines.push(`Store #${store.id} · ${stamp}`);
  lines.push('');

  const claimed = new Set();
  for (const group of QR_ORDER) {
    const items = [];
    for (const [key, it] of state.cart.entries()) {
      if (claimed.has(key)) continue;
      if (group.match(it)) { items.push(it); claimed.add(key); }
    }
    if (!items.length) continue;
    lines.push(`— ${group.label} —`);
    for (const it of items) {
      const type = qrTypeLabel(it);
      const grower = (it.brand || '').trim();
      const strain = stripBrandFromName(it.name, it.brand);
      /* Use formal size for the QR, regardless of naughty mode. */
      const size = it.sizeFormal || getSizeLabel(it.sizeKey, it.kind, false);
      lines.push(`${it.qty}x ${type} ${grower} ${strain} ${size}`.replace(/\s+/g,' ').trim());
    }
    lines.push('');
  }
  /* anything unmatched lumped at bottom (gear, misc edibles, etc.) */
  const leftovers = [];
  for (const [key, it] of state.cart.entries()) if (!claimed.has(key)) leftovers.push(it);
  if (leftovers.length) {
    lines.push(`— Other —`);
    for (const it of leftovers) {
      const type = qrTypeLabel(it);
      const grower = (it.brand || '').trim();
      const strain = stripBrandFromName(it.name, it.brand);
      const size = it.sizeFormal || getSizeLabel(it.sizeKey, it.kind, false);
      lines.push(`${it.qty}x ${type} ${grower} ${strain} ${size}`.replace(/\s+/g,' ').trim());
    }
    lines.push('');
  }

  const { salePrice, fullPrice, saved, count } = cartTotals();
  lines.push(`Items: ${count}`);
  if (saved > 0) {
    lines.push(`Regular: $${fullPrice.toFixed(2)}`);
    lines.push(`Saved:   $${saved.toFixed(2)}`);
  }
  lines.push(`TOTAL:   $${salePrice.toFixed(2)}`);
  return lines.join('\n');
}

/* ─── Theme ─────────────────────────────────────────── */
function applyTheme(id) {
  state.theme = id;
  document.documentElement.setAttribute('data-theme', id);
  localStorage.setItem('terpfinder_theme', id);
  renderThemeSheet();
}
function renderThemeSheet() {
  const g = document.getElementById('theme-grid');
  g.innerHTML = '';
  for (const t of THEMES) {
    const el = document.createElement('div');
    el.className = 'theme-opt' + (state.theme === t.id ? ' selected' : '');
    el.innerHTML = `<div class="theme-swatch" style="background:${t.color}"></div><div class="theme-opt-name">${t.name}</div>`;
    el.addEventListener('click', () => applyTheme(t.id));
    g.appendChild(el);
  }
}

function renderStoreSheet() {
  const g = document.getElementById('store-grid');
  g.innerHTML = '';
  for (const s of STORES) {
    const el = document.createElement('div');
    el.className = 'store-opt' + (state.storeId === s.id ? ' selected' : '');
    el.innerHTML = `<div class="store-opt-name">${s.name}</div><div class="store-opt-sub">#${s.id}</div>`;
    el.addEventListener('click', () => {
      document.getElementById('store-sheet').classList.remove('open');
      applyStore(s.id);
    });
    g.appendChild(el);
  }
}

/* ─── Naughty mode ────────────────────────────────── */
function applyNaughtyLabels() {
  const n = state.naughty;
  document.documentElement.setAttribute('data-naughty', n ? 'true' : 'false');
  const S = NAUGHTY_STRINGS;
  const setText = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  if (n) {
    setText('banner',    S.banner);
    setText('brand-sub', S.brandSub);
    setText('cat-title', S.catTitle);
    setText('cat-sub',   S.catSub);
    setText('sub-title', S.subTitle);
    setText('sub-sub',   S.subSub);
    setText('size-title',S.sizeTitle);
    setText('size-sub',  S.sizeSub);
    setText('fx-title',  S.fxTitle);
    setText('fx-sub',    S.fxSub);
    setText('fx-go',     S.fxGo);
    setText('fx-skip',   S.fxSkip);
    setText('cn-title',  S.cnTitle);
    setText('cn-sub',    S.cnSub);
    setText('cn-go',     S.cnGo);
    setText('ex-title',  S.exTitle);
    setText('ex-sub',    S.exSub);
    setText('res-title', NAUGHTY_STRINGS.resTitle);
    setText('res-sub',   NAUGHTY_STRINGS.resSub);
    setText('cart-title',S.cartTitle);
    setText('cart-sub',  S.cartSub);
    setText('qr-label',  S.qrLabel);
    setText('copy-btn',  S.copyBtn);
    setText('add-more-btn', S.addMoreBtn);
    setText('clear-cart-btn', S.clearBtn);
    setText('cs-label', S.cartLabel);
    setText('cs-view',  S.csView);
    setText('cs-more',  S.csMore);
  } else {
    setText('banner',    'The Terp Search');
    setText('brand-sub', 'PCC patient tool');
    setText('cat-title', 'Pick a category');
    setText('cat-sub',   'Start with what kind of product you want.');
    setText('sub-title', 'Pick a type');
    setText('sub-sub',   'You can pick more than one.');
    setText('size-title','How much?');
    setText('size-sub',  "Pick a size to narrow things down, or skip.");
    setText('fx-title',  'How do you want to feel?');
    setText('fx-sub',    'Pick up to 3.');
    setText('fx-go',     'Find my products →');
    setText('fx-skip',   'Skip this step');
    setText('cn-title',  'What are you looking for?');
    setText('cn-sub',    'Pick a cannabinoid profile. (Edibles use cannabinoids, not terps.)');
    setText('cn-go',     'Next →');
    setText('ex-title',  'Extract style?');
    setText('ex-sub',    'Distillate is most common; rosin/live resin are full-spectrum.');
    setText('res-title', 'Your matches');
    setText('res-sub',   'Tap + to add to cart. Side filters narrow further.');
    setText('cart-title','Your cart');
    setText('cart-sub',  'Scan the QR with your phone to get a pick list.');
    setText('qr-label',  'Scan to pick');
    setText('copy-btn',  'Copy as text');
    setText('add-more-btn', '+ Add more');
    setText('clear-cart-btn', '🗑 Clear cart & start over');
    setText('cs-label', 'Running total');
    setText('cs-view',  'View cart →');
    setText('cs-more',  '+ Add more');
  }
  if (state.screen === 'effects') renderEffectsGrid();
  if (state.screen === 'cannab')  renderCannabGrid();
  if (state.screen === 'results') renderResults();
}
function toggleNaughty() {
  state.naughty = !state.naughty;
  localStorage.setItem('terpfinder_naughty', state.naughty ? '1' : '0');
  const flash = document.createElement('div');
  flash.className = 'flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 800);
  applyNaughtyLabels();
}

/* ─── Konami ─────────────────────────────────────── */
const KONAMI = ['ArrowUp','ArrowDown','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a','Enter'];
let kBuf = [];
document.addEventListener('keydown', e => {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  kBuf.push(k);
  if (kBuf.length > KONAMI.length) kBuf.shift();
  if (kBuf.length === KONAMI.length && kBuf.every((v, i) => v === KONAMI[i])) {
    kBuf = [];
    toggleNaughty();
  }
});

/* ─── Utilities ──────────────────────────────────── */
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function setToast(kind, msg) {
  const el = document.getElementById('toast');
  el.className = kind;
  el.classList.remove('hidden');
  document.getElementById('toast-text').textContent = msg;
}
async function copyCartText() {
  try {
    await navigator.clipboard.writeText(buildCartText());
    const b = document.getElementById('copy-btn');
    const orig = b.textContent;
    b.textContent = '✓ Copied';
    setTimeout(() => b.textContent = orig, 1500);
  } catch (e) { alert('Copy failed. Long-press the QR image to share it instead.'); }
}

/* ─── Boot & event wiring ────────────────────────── */
function wireEvents() {
  document.getElementById('back-btn').addEventListener('click', goBack);
  document.getElementById('home-btn').addEventListener('click', () => {
    if (state.cart.size && !confirm('Clear cart and start over?')) return;
    state.cart.clear();
    state.selCat = null; state.selSubs = []; state.selSize = null;
    state.selTerps = []; state.selCannabs = []; state.selExtract = null; state.sideFilter = 'all';
    renderCategoryGrid();
    setScreen('category');
  });
  document.getElementById('cart-btn').addEventListener('click', () => { renderCart(); setScreen('cart'); });
  document.getElementById('theme-btn').addEventListener('click', () => {
    renderThemeSheet();
    document.getElementById('theme-sheet').classList.add('open');
  });
  document.getElementById('theme-sheet').addEventListener('click', e => {
    if (e.target.id === 'theme-sheet') e.currentTarget.classList.remove('open');
  });
  document.getElementById('store-btn').addEventListener('click', () => {
    renderStoreSheet();
    document.getElementById('store-sheet').classList.add('open');
  });
  document.getElementById('store-sheet').addEventListener('click', e => {
    if (e.target.id === 'store-sheet') e.currentTarget.classList.remove('open');
  });

  document.getElementById('sub-skip').addEventListener('click', () => { state.selSubs = []; goNext(); });
  document.getElementById('sub-go').addEventListener('click',   () => goNext());

  document.getElementById('fx-go').addEventListener('click',   () => goNext());
  document.getElementById('fx-skip').addEventListener('click', () => { state.selTerps = []; renderEffectsGrid(); goNext(); });

  document.getElementById('cn-go').addEventListener('click',   () => goNext());
  document.getElementById('cn-skip').addEventListener('click', () => { state.selCannabs = []; renderCannabGrid(); goNext(); });

  document.getElementById('ex-go').addEventListener('click',   () => goNext());
  document.getElementById('ex-skip').addEventListener('click', () => { state.selExtract = null; goNext(); });

  document.getElementById('cs-view').addEventListener('click', () => { renderCart(); setScreen('cart'); });
  document.getElementById('cs-more').addEventListener('click', () => { renderCategoryGrid(); setScreen('category'); });
  document.getElementById('add-more-btn').addEventListener('click', () => { renderCategoryGrid(); setScreen('category'); });
  document.getElementById('copy-btn').addEventListener('click', copyCartText);
  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (!confirm('Clear the whole cart?')) return;
    state.cart.clear(); renderCart(); setScreen('category'); renderCategoryGrid();
  });
}

applyTheme(state.theme);
document.getElementById('store-name').textContent = currentStore().name;
applyNaughtyLabels();
wireEvents();
loadMenu();
</script>

</body>
</html>
