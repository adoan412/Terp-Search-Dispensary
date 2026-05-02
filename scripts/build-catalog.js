#!/usr/bin/env node
// scripts/build-catalog.js
// Offline catalog builder for PaBuddy.org
// Run: node scripts/build-catalog.js  OR  npm run build:catalog
// Requires Node >= 18 (native fetch).
// Output: data/catalog-pa.json, data/catalog-meta.json

'use strict';

const fs   = require('fs');
const path = require('path');

// ==============================================================
// CONSTANTS
// ==============================================================

const ORACLE_BASE    = 'https://api.pabuddy.org';
// Algolia hosts to try in order. search.iheartjane.com is Cloudflare-protected
// and 403s server-side calls from Node. The *-dsn.algolia.net and *.algolianet.com
// hosts are Algolia's bare infrastructure — no Cloudflare in front, accept the
// same API key, and are documented as the official direct endpoints. We try
// them in order and stop at the first one that responds OK.
const ALGOLIA_HOSTS  = [
  'vfm4x0n23a-dsn.algolia.net',
  'vfm4x0n23a-1.algolianet.com',
  'vfm4x0n23a-2.algolianet.com',
  'vfm4x0n23a-3.algolianet.com',
  'search.iheartjane.com', // last resort, usually 403 from Node
];
const ALGOLIA_APP_ID = 'VFM4X0N23A';
const ALGOLIA_API_KEY = '22bbba8e1edf280b34f42c1475387343';
const ALGOLIA_INDEX  = 'menu-products-production';
const HYTIVA_API     = 'https://api.hytiva.com/v1/menu';
// Sweed's "/proxy/" routes accept cross-origin browser requests; the bare
// "/_api/..." path is internal-only. Captured 2026-05-02 from a live Curaleaf
// PA browser session.
const CURALEAF_API   = 'https://web-ui-curaleaf.sweedpos.com/_api/proxy/Products/GetProductList';
const CURALEAF_LABS  = 'https://web-ui-curaleaf.sweedpos.com/_api/proxy/Products/GetExtendedLabdata';
const DUTCHIE_GQL    = 'https://dutchie.com/api-4/graphql';
const DUTCHIE_HASH   = '98b4aaef79a84ae804b64d550f98dd64d7ba0aa6d836eb6b5d4b2ae815c95e32';
const DUTCHIE_DETAIL_HASH = '88b78e23cc1bf3985e10ff257600aac2824deabc6831dba71dc62a3a69dd2fec';

const KINDS = ['flower','vape','extract','edible','tincture','topical','gear'];
const SIZE_KEYS = ['each','half_gram','gram','eighth_ounce','two_gram','four_point_five_gram','quarter_ounce','half_ounce','ounce'];

// How many stores to fetch at once (across all providers).
const STORE_CONCURRENCY  = 4;
// Max concurrent Dutchie detail-hydration requests per store.
const DUTCHIE_DETAIL_CONCURRENCY = 5;
// Stagger between Dutchie top-level fetches (ms) to reduce rate-limit risk.
const DUTCHIE_STAGGER_MS = 500;
// Retry delays in ms (3 attempts).
const RETRY_DELAYS  = [4000, 12000, 30000];
// Request timeout per attempt (ms).
const FETCH_TIMEOUT = 90_000;
// Catalog freshness window (hours).
const EXPIRES_HOURS = 24;

// Dutchie fetch mode:
//   proxy_only        — Oracle only. Fail fast if Oracle is down.
//   direct_only       — Direct dutchie.com GraphQL only. Will likely 403 from Node.
//   proxy_then_direct — Try Oracle, fall back to direct on Oracle errors.
// Override with env var: DUTCHIE_MODE=proxy_only npm run build:catalog
// Default is proxy_only because direct returns Cloudflare 403 from server-side Node.
const DUTCHIE_MODE = (process.env.DUTCHIE_MODE || 'proxy_only').toLowerCase();

// Jane (iHeartJane) fetch mode:
//   direct          — Call search.iheartjane.com directly with browser-like headers.
//   oracle          — Call api.pabuddy.org/menu/jane/<storeId> (requires Oracle Jane route).
//   direct_then_oracle — Try direct, fall back to Oracle on Cloudflare 403.
// Default direct. Override with: JANE_MODE=oracle npm run build:catalog
const JANE_MODE = (process.env.JANE_MODE || 'direct').toLowerCase();

// Standard browser-like headers used to get past Cloudflare bot detection.
// Captured from Chrome 121 on Windows. Cloudflare also uses TLS fingerprinting
// (JA3) — if these still 403, the only fix is using a real headless browser
// or routing through the Oracle.
const BROWSER_HEADERS = {
  'User-Agent':                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept':                    '*/*',
  'Accept-Language':           'en-US,en;q=0.9',
  'Sec-Ch-Ua':                 '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
  'Sec-Ch-Ua-Mobile':          '?0',
  'Sec-Ch-Ua-Platform':        '"Windows"',
  'Sec-Fetch-Dest':            'empty',
  'Sec-Fetch-Mode':            'cors',
  'Sec-Fetch-Site':            'cross-site',
};

const ROOT_DIR     = path.join(__dirname, '..');
const DATA_DIR     = path.join(ROOT_DIR, 'data');
const STORES_FILE  = path.join(__dirname, 'stores.pa.json');
const CATALOG_OUT  = path.join(DATA_DIR, 'catalog-pa.json');
const CATALOG_MIN  = path.join(DATA_DIR, 'catalog-pa.min.json');
const META_OUT     = path.join(DATA_DIR, 'catalog-meta.json');
const LAST_GOOD    = path.join(DATA_DIR, 'catalog-pa.last-good.json');

// ==============================================================
// SHARED NORMALIZER DATA  (kept in sync with pa-buddy-finder.html)
// ==============================================================

const TERP_MAP = {
  Myrcene:       ['myrcene','b-myrcene','beta-myrcene'],
  Limonene:      ['limonene','d-limonene'],
  Caryophyllene: ['caryophyllene','beta-caryophyllene','b-caryophyllene'],
  Pinene:        ['pinene','a-pinene','alpha-pinene','b-pinene','beta-pinene'],
  Linalool:      ['linalool'],
  Humulene:      ['humulene','alpha-humulene','a-humulene'],
  Terpinolene:   ['terpinolene'],
  Bisabolol:     ['bisabolol','alpha-bisabolol','a-bisabolol'],
  Camphene:      ['camphene'],
  Ocimene:       ['ocimene','beta-ocimene','b-ocimene'],
};

const CANNABINOID_UNITS = new Set([
  'THC','THCA','CBD','CBDA','CBG','CBGA','CBN','CBC','THCV','THCVA',
  'Delta-9-THC','Delta-8-THC','Total Cannabinoids','TAC',
]);

const SUBTYPE_CONFIG = {
  vape: { options: [
    { id: 'live_resin', match: ['live resin','live_resin','liveresin'] },
    { id: 'rosin',      match: ['rosin'] },
    { id: 'distillate', match: ['distillate'] },
    { id: 'disposable', match: ['disposable','all-in-one','all in one','aio'] },
    { id: 'cartridge',  match: ['cartridge','510'] },
  ]},
  extract: { options: [
    { id: 'live_resin', match: ['live resin','live_resin','liveresin'] },
    { id: 'rosin',      match: ['rosin'] },
    { id: 'distillate', match: ['distillate'] },
    { id: 'budder',     match: ['budder','badder'] },
    { id: 'wax',        match: ['wax'] },
    { id: 'shatter',    match: ['shatter'] },
    { id: 'sugar',      match: ['sugar'] },
    { id: 'diamonds',   match: ['diamond','sauce'] },
    { id: 'hash',       match: ['hash','kief','bubble'] },
  ]},
  edible: { options: [
    { id: 'troche',    match: ['troche'] },
    { id: 'capsule',   match: ['capsule','softgel','soft gel','cap '] },
    { id: 'rso',       match: ['rso'] },
    { id: 'tincture',  match: ['tincture','sublingual'] },
    { id: 'gummy',     match: ['gummy','gummies','chew'] },
    { id: 'chocolate', match: ['chocolate'] },
    { id: 'beverage',  match: ['drink','beverage','syrup'] },
  ]},
  topical: { options: [
    { id: 'lotion', match: ['lotion','cream'] },
    { id: 'balm',   match: ['balm','salve'] },
    { id: 'patch',  match: ['patch'] },
    { id: 'rso',    match: ['rso'] },
  ]},
  gear: { options: [
    { id: 'battery', match: ['battery','510 thread','510-thread','charger'] },
    { id: 'gear',    match: ['pipe','bong','rig','grinder','paper','wrap','cone','tip','rolling','lighter','tray'] },
    { id: 'other',   match: ['__other__'] },
  ]},
};

// ==============================================================
// SHARED NORMALIZER FUNCTIONS (ported from pa-buddy-finder.html)
// ==============================================================

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
          if (!byName[canon] || (Number.isFinite(v) && v > byName[canon].value))
            byName[canon] = { name: canon, value: Number.isFinite(v) ? v : null };
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
      if (!byName[id] || (Number.isFinite(v) && v > byName[id].value))
        byName[id] = { name: id, value: Number.isFinite(v) ? v : null };
    }
  }
  if (!byName.THC && Number.isFinite(p.percent_thc) && p.percent_thc > 0)
    byName.THC = { name: 'THC', value: p.percent_thc };
  return Object.values(byName);
}

function extractSizes(p) {
  const out = [];
  for (const k of SIZE_KEYS) {
    const full = p[`price_${k}`];
    const disc = p[`discounted_price_${k}`];
    if (full == null && disc == null) continue;
    const price = disc != null ? disc : full;
    const onSale = disc != null && full != null && disc < full;
    out.push({ key: k, price, full, onSale });
  }
  return out;
}

function detectSubtypes(p) {
  const cfg = SUBTYPE_CONFIG[p.kind];
  if (!cfg) return [];
  const hay = `${p.name||''} ${p.product_subtype||''} ${p.root_subtype||''} ${p.category||''}`.toLowerCase();
  const hits = [];
  for (const opt of cfg.options) {
    if (opt.match.some(k => k !== '__other__' && hay.includes(k))) hits.push(opt.id);
  }
  if (p.kind === 'gear' && hits.length === 0) hits.push('other');
  return hits;
}

function extractTotalTerps(p) {
  const byName = {};
  for (const entry of (p.lab_results || [])) {
    for (const r of (entry.lab_results || [])) {
      const raw = (r.unit_id || r.compound_name || '').trim();
      if (!raw || CANNABINOID_UNITS.has(raw)) continue;
      if (/^total\s*(terp|terpenes?)/i.test(raw)) continue;
      const v = Number(r.value);
      if (!Number.isFinite(v) || v <= 0) continue;
      if (byName[raw] == null || v > byName[raw]) byName[raw] = v;
    }
  }
  const names = Object.keys(byName);
  if (!names.length) return null;
  return names.reduce((s, n) => s + byName[n], 0);
}

// ==============================================================
// DUTCHIE HELPERS
// ==============================================================

const DUTCHIE_TYPE_TO_KIND = {
  'Flower':'flower','Vape':'vape','Vaporizers':'vape',
  'Concentrate':'extract','Concentrates':'extract','Extract':'extract',
  'Edible':'edible','Edibles':'edible','Tincture':'edible','Tinctures':'edible',
  'Topical':'topical','Topicals':'topical',
  'Accessories':'gear','Apparel':'gear',
};
function dutchieKind(type) {
  if (!type) return null;
  if (/pre[\s-]?roll/i.test(type)) return null;
  return DUTCHIE_TYPE_TO_KIND[type] || null;
}

function dutchieSizeKey(option) {
  if (option == null) return 'each';
  const o = String(option).toLowerCase().replace(/\s+/g,'');
  if (o==='0.5g'||o==='0.5gram'||o==='halfgram'||o==='.5g') return 'half_gram';
  if (o==='1g'||o==='1gram'||o==='gram')                    return 'gram';
  if (o==='2g'||o==='2gram')                                return 'two_gram';
  if (o==='3.5g'||o==='eighth'||o==='1/8oz'||o==='1/8')     return 'eighth_ounce';
  if (o==='4.5g'||o==='4.5gram')                            return 'four_point_five_gram';
  if (o==='7g'||o==='quarter'||o==='1/4oz'||o==='1/4')      return 'quarter_ounce';
  if (o==='14g'||o==='half'||o==='1/2oz'||o==='1/2')        return 'half_ounce';
  if (o==='28g'||o==='ounce'||o==='1oz')                    return 'ounce';
  return 'each';
}

function dutchieTerpName(row) {
  const raw = String(
    (row && (row.name || row.systemName || row.title)) ||
    (row && row.terpene && (row.terpene.name || row.terpene.systemName || row.terpene.title)) ||
    (row && row.libraryTerpene && (row.libraryTerpene.name || row.libraryTerpene.systemName || row.libraryTerpene.title)) ||
    (typeof row === 'string' ? row : '')
  ).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]+/g,' ').trim().toLowerCase();
  if (!raw) return null;
  for (const [canon, aliases] of Object.entries(TERP_MAP)) {
    if (aliases.some(a => raw === a.replace(/[_-]+/g,' ') || raw.includes(a.replace(/[_-]+/g,' '))))
      return canon;
  }
  return null;
}

function dutchieTerpValue(row) {
  if (!row || typeof row !== 'object') return null;
  const candidates = [
    row.value, row.percentage, row.percent, row.amount,
    row.terpene && row.terpene.value,
  ];
  if (Array.isArray(row.range) && row.range.length) candidates.push(row.range[0]);
  if (row.unitSize && row.unitSize.value) candidates.push(row.unitSize.value);
  for (const c of candidates) {
    if (c == null) continue;
    const n = Number(c);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

function dutchieRealTerps(p) {
  const sources = [];
  if (Array.isArray(p?.terpenes)) sources.push(p.terpenes);
  if (Array.isArray(p?.terpenesV2)) sources.push(p.terpenesV2);
  if (Array.isArray(p?.labResults?.terpenes)) sources.push(p.labResults.terpenes);
  if (Array.isArray(p?.labs?.terpenes)) sources.push(p.labs.terpenes);
  if (Array.isArray(p?.potency?.terpenes)) sources.push(p.potency.terpenes);
  if (Array.isArray(p?.POSMetaData?.terpenes)) sources.push(p.POSMetaData.terpenes);
  if (Array.isArray(p?.POSMetaData?.labResults?.terpenes)) sources.push(p.POSMetaData.labResults.terpenes);
  if (!sources.length) return [];
  const byTerp = {};
  for (const list of sources) {
    for (const row of list) {
      const name = dutchieTerpName(row);
      const value = dutchieTerpValue(row);
      if (!name || !Number.isFinite(value) || value <= 0) continue;
      if (!byTerp[name] || value > byTerp[name].value) byTerp[name] = { name, value };
    }
  }
  return Object.values(byTerp);
}

function dutchiePotencyValue(potency) {
  if (!potency || typeof potency !== 'object') return null;
  const raw = Array.isArray(potency.range) ? potency.range[0] : potency.range;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function dutchieCanonicalSku(raw) {
  return raw && raw.POSMetaData && (
    raw.POSMetaData.canonicalSKU ||
    (Array.isArray(raw.POSMetaData.children) && raw.POSMetaData.children.map(c => c && c.canonicalSKU).find(Boolean))
  );
}

function dutchieToJaneShape(p) {
  const kind = dutchieKind(p.type);
  if (!kind) return null;
  const norm = {
    objectID: p._id || p.id,
    product_id: p._id || p.id,
    name: p.Name || '',
    brand: p.brandName || (p.brand && p.brand.name) || '',
    kind,
    category: (p.strainType || '').toLowerCase(),
    percent_thc: dutchiePotencyValue(p.THCContent),
    image_urls: (Array.isArray(p.images) && p.images.length)
      ? p.images.map(im => im && (im.url || im)).filter(Boolean)
      : (p.Image ? [p.Image] : []),
    root_subtype: p.subcategory || '',
    product_subtype: p.subcategory || '',
    description: '',
    _dutchieCName: p.cName || '',
    _dutchieSku: dutchieCanonicalSku(p) || '',
  };
  const opts = p.Options || p.rawOptions || (p.POSMetaData && Array.isArray(p.POSMetaData.children)
    ? p.POSMetaData.children.map(c => c && c.option).filter(Boolean) : []);
  const med  = p.medicalPrices || [];
  const medS = p.medicalSpecialPrices || [];
  const rec  = p.recPrices || [];
  const recS = p.recSpecialPrices || [];
  const base = p.Prices || [];
  for (let i = 0; i < opts.length; i++) {
    const key  = dutchieSizeKey(opts[i]);
    const full = med[i] != null ? med[i] : (rec[i] != null ? rec[i] : (base[i] != null ? base[i] : null));
    const disc = medS[i] != null ? medS[i] : (recS[i] != null ? recS[i] : null);
    if (full == null && disc == null) continue;
    const existing = norm['price_' + key];
    if (existing == null || (full != null && full < existing)) norm['price_' + key] = full;
    if (disc != null) {
      const ed = norm['discounted_price_' + key];
      if (ed == null || disc < ed) norm['discounted_price_' + key] = disc;
    }
  }
  const realTerps = dutchieRealTerps(p);
  norm._terps = realTerps;
  norm._cannabs = [];
  if (Number.isFinite(norm.percent_thc) && norm.percent_thc > 0)
    norm._cannabs.push({ name: 'THC', value: norm.percent_thc });
  const cbd = dutchiePotencyValue(p.CBDContent);
  if (Number.isFinite(cbd) && cbd > 0) norm._cannabs.push({ name: 'CBD', value: cbd });
  norm._sizes  = extractSizes(norm);
  norm._subs   = detectSubtypes(norm);
  norm._totalTerps = dutchiePotencyValue(p.totalTerpenes);
  if (!Number.isFinite(norm._totalTerps) && realTerps.length)
    norm._totalTerps = realTerps.reduce((s, t) => s + (Number(t.value) || 0), 0);
  if (realTerps.length) {
    norm.lab_results = [{ lab_results: [
      ...realTerps.map(t => ({ unit_id: t.name, value: t.value })),
      ...norm._cannabs.map(c => ({ unit_id: c.name, value: c.value })),
    ]}];
  }
  norm._effects   = p.effects || null;
  norm._isDutchie = true;
  return norm;
}

// ==============================================================
// HYTIVA HELPERS
// ==============================================================

function hytivaKind(p) {
  const cat = String(p?.category || '').toLowerCase();
  if (cat.includes('pre') && cat.includes('roll')) return null;
  if (cat.includes('flower')) return 'flower';
  if (cat.includes('vape') || cat.includes('vapor')) return 'vape';
  if (cat.includes('extract') || cat.includes('concentrate')) return 'extract';
  if (cat.includes('edible') || cat.includes('drink') || cat.includes('tincture')) return 'edible';
  if (cat.includes('topical')) return 'topical';
  if (cat.includes('accessor')) return 'gear';
  return null;
}

function hytivaSizeKey(variant, kind) {
  if (kind === 'edible' || kind === 'topical' || kind === 'gear') return 'each';
  const raw = `${variant?.value||''} ${variant?.title||''} ${variant?.displayTitle||''}`.toLowerCase();
  const grams = Number((raw.match(/(\d+(?:\.\d+)?)\s*g\b/)||[])[1]);
  const mg    = Number((raw.match(/(\d+(?:\.\d+)?)\s*mg\b/)||[])[1]);
  const value = Number.isFinite(grams) ? grams : (Number.isFinite(mg) ? mg / 1000 : null);
  if (!Number.isFinite(value)) return 'each';
  if (value <= 0.35) return 'each';
  if (value <= 0.6)  return 'half_gram';
  if (value <= 1.25) return 'gram';
  if (value <= 2.5)  return 'two_gram';
  if (value <= 3.8)  return 'eighth_ounce';
  if (value <= 5)    return 'four_point_five_gram';
  if (value <= 8)    return 'quarter_ounce';
  if (value <= 15)   return 'half_ounce';
  return 'ounce';
}

function hytivaNumber(value) {
  if (value == null || value === '') return null;
  const n = Number(String(value).replace(/[^\d.-]/g,''));
  return Number.isFinite(n) ? n : null;
}

function hytivaCompoundValue(row) {
  const max = hytivaNumber(row?.max);
  if (Number.isFinite(max)) return max;
  return hytivaNumber(row?.min);
}

function hytivaCanonTerp(row) {
  const raw = `${row?.systemName||''} ${row?.title||''}`
    .replace(/([a-z])([A-Z])/g,'$1 $2')
    .replace(/alpha/gi,'alpha-').replace(/beta/gi,'beta-')
    .replace(/\s+/g,' ').toLowerCase();
  for (const [canon, aliases] of Object.entries(TERP_MAP)) {
    if (aliases.some(a => raw.includes(a))) return canon;
  }
  return null;
}

function hytivaCanonCannabinoid(row) {
  const raw = String(row?.systemName || row?.title || '').trim();
  if (!raw) return null;
  const clean = raw.replace(/([a-z])([A-Z])/g,'$1-$2').replace(/delta\s*[- ]?\s*/i,'Delta-').replace(/\s+/g,'-').toUpperCase();
  if (clean === 'D9THC' || clean === 'DELTA-9-THC') return 'THC';
  return clean;
}

function hytivaToJaneShape(p) {
  const kind = hytivaKind(p);
  if (!kind) return null;
  const variants = (p.variants || []).filter(v => hytivaNumber(v?.quantity) > 0 || v?.quantity == null);
  if (!variants.length) return null;
  const norm = {
    objectID: `hytiva-${p.id}`,
    product_id: p.id,
    name: p.title || '',
    brand: p.brand || '',
    kind,
    category: p.type || p.category || '',
    percent_thc: null,
    image_urls: [],
    root_subtype: p.category || '',
    product_subtype: p.category || '',
    description: '',
  };
  for (const v of variants) {
    const key  = hytivaSizeKey(v, kind);
    const full = hytivaNumber(v.originalPrice) || hytivaNumber(v.price);
    const disc = hytivaNumber(v.price);
    const hasDisc = disc != null && full != null && disc < full;
    if (full == null && disc == null) continue;
    const cur = norm['price_' + key];
    const nextFull = full != null ? full : disc;
    if (cur == null || nextFull < cur) norm['price_' + key] = nextFull;
    if (hasDisc) {
      const cd = norm['discounted_price_' + key];
      if (cd == null || disc < cd) norm['discounted_price_' + key] = disc;
    }
  }
  const byTerp = {};
  for (const row of (p.terpenes || [])) {
    const name = hytivaCanonTerp(row);
    const value = hytivaCompoundValue(row);
    if (!name || !Number.isFinite(value) || value <= 0) continue;
    if (!byTerp[name] || value > byTerp[name].value) byTerp[name] = { name, value };
  }
  norm._terps = Object.values(byTerp);
  const byCannab = {};
  for (const row of (p.cannabinoids || [])) {
    const name = hytivaCanonCannabinoid(row);
    const value = hytivaCompoundValue(row);
    if (!name || !Number.isFinite(value) || value <= 0) continue;
    if (!byCannab[name] || value > byCannab[name].value) byCannab[name] = { name, value };
  }
  norm._cannabs = Object.values(byCannab);
  const potency = norm._cannabs.filter(c => ['THC','THCA','D9THC','DELTA-9-THC'].includes(c.name))
    .reduce((best, c) => best == null || c.value > best.value ? c : best, null);
  if (potency) norm.percent_thc = potency.value;
  norm.lab_results = [{ lab_results: [
    ...norm._terps.map(t => ({ unit_id: t.name, value: t.value })),
    ...norm._cannabs.map(c => ({ unit_id: c.name, value: c.value })),
  ]}];
  norm._sizes = extractSizes(norm);
  if (!norm._sizes.length) return null;
  norm._subs = detectSubtypes(norm);
  norm._totalTerps = norm._terps.reduce((s, t) => s + (Number(t.value) || 0), 0);
  norm._isHytiva = true;
  return norm;
}

// ==============================================================
// CURALEAF HELPERS
// ==============================================================

function curaleafKind(p) {
  const cat = `${p?.category?.name||''} ${p?.subcategory?.name||''} ${p?.productType?.name||''}`.toLowerCase();
  if (cat.includes('flower')) return 'flower';
  if (cat.includes('vape')||cat.includes('cartridge')||cat.includes('briq')) return 'vape';
  if (cat.includes('concentrate')||cat.includes('extract')||cat.includes('wax')||cat.includes('rosin')||cat.includes('resin')) return 'extract';
  if (cat.includes('oral')||cat.includes('troche')||cat.includes('capsule')||cat.includes('edible')) return 'edible';
  if (cat.includes('topical')||cat.includes('balm')||cat.includes('lotion')||cat.includes('patch')) return 'topical';
  if (cat.includes('accessor')) return 'gear';
  return null;
}

function curaleafSizeKey(variant, kind) {
  const unit = String(variant?.unitSize?.unitAbbr || '').toUpperCase();
  const value = Number(variant?.unitSize?.value);
  const name  = String(variant?.name || '').toLowerCase();
  if (kind === 'edible' || unit === 'MG') return 'each';
  const grams = Number.isFinite(value) && unit === 'G' ? value : null;
  const raw   = grams ?? Number((name.match(/(\d+(?:\.\d+)?)\s*g\b/) || [])[1]);
  if (!Number.isFinite(raw)) return 'each';
  if (raw <= 0.35) return 'each';
  if (raw <= 0.6)  return 'half_gram';
  if (raw <= 1.25) return 'gram';
  if (raw <= 2.5)  return 'two_gram';
  if (raw <= 3.8)  return 'eighth_ounce';
  if (raw <= 5)    return 'four_point_five_gram';
  if (raw <= 8)    return 'quarter_ounce';
  if (raw <= 15)   return 'half_ounce';
  return 'ounce';
}

function curaleafLabNumber(test) {
  const values = Array.isArray(test?.value) ? test.value : [test?.value];
  for (const raw of values) {
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function curaleafBestLab(p, key) {
  let best = null;
  for (const v of (p?.variants || [])) {
    const n = curaleafLabNumber(v?.labTests && v.labTests[key]);
    if (Number.isFinite(n) && (best == null || n > best)) best = n;
  }
  return best;
}

function curaleafPositivePrice(value) {
  if (Array.isArray(value)) {
    let best = null;
    for (const item of value) {
      const n = curaleafPositivePrice(item);
      if (n != null && (best == null || n < best)) best = n;
    }
    return best;
  }
  if (value && typeof value === 'object') {
    const keys = ['price','Price','amount','Amount','value','Value','regularPrice','basePrice','unitPrice','medicalPrice'];
    let best = null;
    for (const k of keys) {
      const n = curaleafPositivePrice(value[k]);
      if (n != null && (best == null || n < best)) best = n;
    }
    return best;
  }
  if (value == null || value === '') return null;
  const n = Number(String(value).replace(/[^\d.-]/g,''));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function curaleafSyntheticTerps(p) {
  const out = [];
  const seen = new Set();
  for (const t of (p?.strain?.terpenes || [])) {
    const raw = String(t?.name || '').toLowerCase();
    for (const [canon, aliases] of Object.entries(TERP_MAP)) {
      if (!seen.has(canon) && aliases.some(a => raw === a || raw.includes(a))) {
        seen.add(canon);
        out.push({ name: canon, value: null, _synthetic: true });
      }
    }
  }
  return out;
}

function curaleafLabValue(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const n = curaleafLabValue(item);
      if (Number.isFinite(n)) return n;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const key of ['value','Value','max','Max','min','Min','percent','percentage','result','amount']) {
      const n = curaleafLabValue(value[key]);
      if (Number.isFinite(n)) return n;
    }
    return null;
  }
  if (value == null || value === '') return null;
  const n = Number(String(value).replace(/[^\d.-]/g,''));
  return Number.isFinite(n) ? n : null;
}

function curaleafLabName(row) {
  for (const key of ['name','Name','label','title','compoundName','compound_name','analyte','testName','displayName']) {
    const v = row[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

function curaleafCollectLabRows(value, out = [], seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  if (Array.isArray(value)) { for (const item of value) curaleafCollectLabRows(item, out, seen); return out; }
  const name = curaleafLabName(value);
  const labValue = curaleafLabValue(value);
  if (name && Number.isFinite(labValue)) out.push({ name, value: labValue });
  for (const item of Object.values(value)) curaleafCollectLabRows(item, out, seen);
  return out;
}

function curaleafCleanCompound(name) {
  return String(name||'').replace(/[%()]/g,' ').replace(/\b(total|per\s+package|package|result|percent|percentage)\b/gi,' ').replace(/\s+/g,' ').trim();
}

function curaleafCanonTerp(name) {
  const clean = curaleafCleanCompound(name).toLowerCase().replace(/[β]/g,'b').replace(/[α]/g,'a').replace(/\s+/g,'-');
  for (const [canon, aliases] of Object.entries(TERP_MAP)) {
    if (aliases.some(a => clean === a || clean.includes(a))) return canon;
  }
  return null;
}

function curaleafCanonCannabinoid(name) {
  const clean = String(name||'').toLowerCase().replace(/delta\s*/g,'delta').replace(/[^a-z0-9]/g,'');
  if (clean.includes('totalthc')||clean==='thc'||clean==='delta9thc'||clean==='thca') return 'THC';
  if (clean.includes('totalcbd')||clean==='cbd'||clean==='cbda') return 'CBD';
  if (clean==='cbg'||clean==='cbga') return 'CBG';
  if (clean==='cbn') return 'CBN';
  if (clean==='cbc') return 'CBC';
  if (clean==='thcv'||clean==='thcva') return 'THCV';
  return null;
}

function curaleafLabsFromPayload(payload) {
  const rows = curaleafCollectLabRows(payload);
  const terpsByName = {};
  const cannabsByName = {};
  let totalTerps = null;
  for (const row of rows) {
    if (!Number.isFinite(row.value) || row.value < 0) continue;
    if (/^total\s*terp/i.test(row.name)) { if (totalTerps == null || row.value > totalTerps) totalTerps = row.value; continue; }
    const terp = curaleafCanonTerp(row.name);
    if (terp) { if (!terpsByName[terp] || row.value > terpsByName[terp].value) terpsByName[terp] = { name: terp, value: row.value }; continue; }
    const cannab = curaleafCanonCannabinoid(row.name);
    if (cannab && row.value > 0 && (!cannabsByName[cannab] || row.value > cannabsByName[cannab].value))
      cannabsByName[cannab] = { name: cannab, value: row.value };
  }
  const terps   = Object.values(terpsByName);
  if (totalTerps == null && terps.length) totalTerps = terps.reduce((s, t) => s + (Number(t.value)||0), 0);
  const cannabs = Object.values(cannabsByName);
  if (!terps.length && !cannabs.length && totalTerps == null) return null;
  return { terps, cannabs, totalTerps };
}

function curaleafToJaneShape(p, detailLabs) {
  const kind = curaleafKind(p);
  if (!kind) return null;
  const variants = (p.variants || []).filter(v => Number(v?.availableQty) > 0 || v?.availableQty == null);
  if (!variants.length) return null;
  const norm = {
    objectID: `curaleaf-${p.id}`,
    product_id: p.id,
    name: p.customName || p.name || '',
    brand: p.brand?.name || '',
    kind,
    category: p.strain?.prevalence?.name || p.category?.name || '',
    percent_thc: curaleafBestLab(p, 'thc'),
    image_urls: [...(p.images||[]), ...variants.flatMap(v => v.images||[])].filter(Boolean),
    root_subtype: p.subcategory?.name || p.productType?.name || '',
    product_subtype: p.productType?.name || p.subcategory?.name || '',
    description: p.description || '',
  };
  for (const v of variants) {
    const key  = curaleafSizeKey(v, kind);
    const full = curaleafPositivePrice(v.price) || curaleafPositivePrice(v.tierPricing);
    const disc = curaleafPositivePrice(v.promoPrice) || curaleafPositivePrice(v.salePrice) || curaleafPositivePrice(v.specialPrice);
    const hasFull = full != null;
    const hasDisc = disc != null && (!hasFull || disc < full);
    if (!hasFull && !hasDisc) continue;
    const cur = norm['price_' + key];
    const nextFull = hasFull ? full : disc;
    if (cur == null || nextFull < cur) norm['price_' + key] = nextFull;
    if (hasDisc) { const cd = norm['discounted_price_' + key]; if (cd == null || disc < cd) norm['discounted_price_' + key] = disc; }
  }
  norm._terps   = detailLabs?.terps?.length ? detailLabs.terps : curaleafSyntheticTerps(p);
  norm._cannabs = [];
  const thc = curaleafBestLab(p, 'thc');
  const cbd = curaleafBestLab(p, 'cbd');
  if (Number.isFinite(thc) && thc > 0) norm._cannabs.push({ name: 'THC', value: thc });
  if (Number.isFinite(cbd) && cbd > 0) norm._cannabs.push({ name: 'CBD', value: cbd });
  if (detailLabs?.cannabs?.length) {
    const byName = Object.fromEntries(norm._cannabs.map(c => [c.name, c]));
    for (const c of detailLabs.cannabs) {
      if (!byName[c.name] || c.value > byName[c.name].value) byName[c.name] = c;
    }
    norm._cannabs = Object.values(byName);
  }
  if (!Number.isFinite(norm.percent_thc)) {
    const dt = norm._cannabs.find(c => c.name === 'THC');
    if (dt) norm.percent_thc = dt.value;
  }
  if (detailLabs) {
    norm.lab_results = [{ lab_results: [
      ...(detailLabs.terps||[]).map(t => ({ unit_id: t.name, value: t.value })),
      ...(detailLabs.cannabs||[]).map(c => ({ unit_id: c.name, value: c.value })),
    ]}];
  }
  norm._sizes = extractSizes(norm);
  if (!norm._sizes.length) return null;
  norm._subs = detectSubtypes(norm);
  norm._totalTerps = Number.isFinite(detailLabs?.totalTerps) ? detailLabs.totalTerps : null;
  norm._isCuraleaf = true;
  return norm;
}

// ==============================================================
// FETCH UTILITIES
// ==============================================================

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(fn, label) {
  let lastErr;
  for (let i = 0; i <= RETRY_DELAYS.length; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      // Don't retry terminal errors (403, 404, 401, missing adapter, "fatal" tagged).
      if (err && (err._fatal || err._adapterMissing)) {
        console.warn(`  [no-retry] ${label}: ${err.message}`);
        throw err;
      }
      if (i < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[i];
        console.warn(`  [retry ${i+1}] ${label}: ${err.message} — waiting ${delay/1000}s`);
        await sleep(delay);
      }
    }
  }
  throw lastErr;
}

// Mark an error as fatal (no retries should happen).
function fatalErr(message) {
  return Object.assign(new Error(message), { _fatal: true });
}

// Read up to N chars of a Response body for logging without consuming it.
async function readBodySnippet(res, max = 200) {
  try {
    const text = await res.text();
    return text.replace(/\s+/g, ' ').slice(0, max);
  } catch {
    return '<unreadable>';
  }
}

// Run up to `limit` async tasks concurrently from an array.
async function pooled(items, limit, fn) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// ==============================================================
// PROVIDER ADAPTERS
// ==============================================================

function janeShape(hits) {
  const seen = new Set();
  const out  = [];
  for (const h of hits) {
    if (!h.objectID || seen.has(h.objectID)) continue;
    seen.add(h.objectID);
    h._terps       = extractTerps(h);
    h._cannabs     = extractCannabinoids(h);
    h._sizes       = extractSizes(h);
    h._subs        = detectSubtypes(h);
    h._totalTerps  = extractTotalTerps(h);
    if (h.kind === 'tincture') {
      h.kind = 'edible';
      if (!h._subs.includes('tincture')) h._subs.push('tincture');
    }
    out.push(h);
  }
  return out;
}

// Cache the host that worked first so subsequent stores don't retry dead hosts.
let _janeWorkingHost = null;
// Once we confirm the API key itself is dead, stop attempting Jane fetches entirely.
let _janeKeyDead = false;
let _janeKeyDeadMessage = '';

async function janeDirectFetch(storeId) {
  if (_janeKeyDead) {
    throw fatalErr(`Algolia key is rejected app-wide: ${_janeKeyDeadMessage}`);
  }
  const requests = KINDS.map(k => ({
    indexName: ALGOLIA_INDEX,
    params: new URLSearchParams({
      query: '',
      hitsPerPage: '1000',
      filters: `store_id = ${storeId} AND kind:${k}`,
    }).toString(),
  }));

  const hostsToTry = _janeWorkingHost
    ? [_janeWorkingHost, ...ALGOLIA_HOSTS.filter(h => h !== _janeWorkingHost)]
    : ALGOLIA_HOSTS;

  const attempts = [];
  for (const host of hostsToTry) {
    let status = null, snippet = '', netErr = null;
    try {
      const res = await fetchWithTimeout(`https://${host}/1/indexes/*/queries`, {
        method: 'POST',
        headers: {
          ...BROWSER_HEADERS,
          'Content-Type':             'application/json',
          'Origin':                   'https://www.iheartjane.com',
          'Referer':                  'https://www.iheartjane.com/',
          'X-Algolia-Application-Id': ALGOLIA_APP_ID,
          'X-Algolia-API-Key':        ALGOLIA_API_KEY,
          'X-Algolia-Agent':          'Algolia for JavaScript (4.22.1); Browser (lite)',
        },
        body: JSON.stringify({ requests }),
      });
      if (res.ok) {
        if (_janeWorkingHost !== host) {
          _janeWorkingHost = host;
          console.log(`  [jane] using algolia host: ${host}`);
        }
        const data = await res.json();
        const hits = (data.results || []).flatMap(r => r.hits || []);
        return janeShape(hits);
      }
      status = res.status;
      snippet = (await readBodySnippet(res, 240)).slice(0, 240);
      // Algolia auth failure: same key on every host, no point trying others.
      if ((status === 401 || status === 403) && /Invalid Application-ID|Invalid API key|Invalid API-Key/i.test(snippet)) {
        _janeKeyDead = true;
        _janeKeyDeadMessage = snippet.slice(0, 200);
        console.warn(`  [jane try] ${host}: HTTP ${status} | ${snippet.slice(0, 90).replace(/\s+/g, ' ')}`);
        attempts.push({ host, status, snippet, netErr: null });
        break; // skip remaining hosts entirely
      }
    } catch (e) {
      netErr = e.message;
    }
    attempts.push({ host, status, snippet, netErr });
    console.warn(`  [jane try] ${host}: ${status ? `HTTP ${status}` : 'NET ' + netErr} | ${snippet.slice(0, 90).replace(/\s+/g, ' ')}`);
  }

  // Diagnose collective failure mode.
  const has401   = attempts.some(a => a.status === 401);
  const hasCloud = attempts.some(a => /<!DOCTYPE html|cloudflare|attention required|cf-/i.test(a.snippet));
  const algoliaJsonErr = attempts.find(a => /^\s*\{/.test(a.snippet));

  let msg = `All ${attempts.length} Algolia hosts failed`;
  if (has401) msg += `\n      → 401 Unauthorized: API key rotated. Open a live Jane menu page, View Source, search "algoliaApiKey", paste new value into ALGOLIA_API_KEY at top of scripts/build-catalog.js.`;
  else if (algoliaJsonErr) msg += `\n      → Algolia error response: ${algoliaJsonErr.snippet}`;
  else if (hasCloud) msg += `\n      → Cloudflare HTML challenges from all hosts. Even bare algolianet.com hosts blocked? Possible: ISP/corporate proxy, VPN intercept, or Algolia changed key restrictions.`;
  else msg += `\n      → No clear cause. Per-host attempts:\n${attempts.map(a => `        - ${a.host}: ${a.status || 'NET ' + a.netErr}`).join('\n')}`;

  const err = new Error(msg);
  if (has401 || hasCloud || algoliaJsonErr) err._fatal = true;
  throw err;
}

async function janeOracleFetch(storeId) {
  const url = `${ORACLE_BASE}/menu/jane/${encodeURIComponent(storeId)}`;
  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (netErr) {
    throw new Error(`Oracle network error → ${url} → ${netErr.message}`);
  }
  if (!res.ok) {
    const snippet = await readBodySnippet(res);
    const err = new Error(`Oracle Jane HTTP ${res.status} ${res.statusText} → ${url} | body: ${snippet}`);
    if ([401, 403, 404, 410].includes(res.status)) err._fatal = true;
    throw err;
  }
  const json = await res.json();
  const hits = json?.results?.flatMap(r => r.hits || []) || json?.hits || json?.products || [];
  return janeShape(hits);
}

async function janeAdapter(storeId) {
  if (JANE_MODE === 'oracle') return janeOracleFetch(storeId);
  if (JANE_MODE === 'direct_then_oracle') {
    try {
      return await janeDirectFetch(storeId);
    } catch (err) {
      console.warn(`  Jane direct failed for ${storeId}: ${err.message.split('\n')[0]}. Falling back to Oracle.`);
      return await janeOracleFetch(storeId);
    }
  }
  return janeDirectFetch(storeId);
}

// Dutchie: oracle preferred, direct usually 403s from Node (Cloudflare).
async function dutchieOracleFetch(storeId) {
  const url = `${ORACLE_BASE}/menu/dutchie/${encodeURIComponent(storeId)}`;
  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (netErr) {
    throw new Error(`Oracle network error → ${url} → ${netErr.message}`);
  }
  if (!res.ok) {
    const snippet = await readBodySnippet(res);
    const err = new Error(`Oracle HTTP ${res.status} ${res.statusText} → ${url} | body: ${snippet}`);
    // 401/403/404/410 from the Oracle aren't going to fix themselves on retry.
    if ([401, 403, 404, 410].includes(res.status)) err._fatal = true;
    throw err;
  }
  const json = await res.json();
  return json?.data?.products || json?.products || [];
}

async function dutchieDirectFetch(storeId) {
  const PAGE = 100;
  const all  = [];
  let offset = 0;
  for (let page = 0; page < 30; page++) { // cap at 3000 products/store
    const body = {
      operationName: 'FilteredProducts',
      variables: {
        includeEnterpriseSpecials: false,
        productsFilter: {
          dispensaryId: storeId,
          removeProductsBelowOptionThresholds: false,
          isKioskMenu: false,
          bypassKioskThresholds: false,
          bypassOnlineThresholds: true,
          Status: 'All',
          platformType: 'ONLINE_MENU',
          paginationInput: { offset, limit: PAGE },
        },
      },
      extensions: { persistedQuery: { version: 1, sha256Hash: DUTCHIE_HASH } },
    };
    const res = await fetchWithTimeout(DUTCHIE_GQL, {
      method: 'POST',
      headers: {
        'content-type':            'application/json',
        'x-apollo-operation-name': 'FilteredProducts',
        'Origin':                  'https://dutchie.com',
        'Referer':                 'https://dutchie.com/',
        'User-Agent':              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept':                  '*/*',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // 403 = Cloudflare bot block. Will not change on retry.
      const err = new Error(`Dutchie direct HTTP ${res.status}`);
      if ([401, 403, 404].includes(res.status)) err._fatal = true;
      throw err;
    }
    const json = await res.json();
    if (json?.errors?.length) throw new Error('Dutchie GraphQL: ' + json.errors[0].message);
    const fp   = json?.data?.filteredProducts || json?.filteredProducts;
    const hits = fp?.products || [];
    all.push(...hits);
    if (hits.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

async function dutchieHydrateOnePage(storeId, rawPairs) {
  // Enrich products that have totalTerpenes but no per-terp data via IndividualFilteredProduct.
  const needHydration = rawPairs.filter(({ raw }) => {
    const hasTotalTerps = Number.isFinite(Number(raw?.totalTerpenes?.range?.[0])) && raw.totalTerpenes.range[0] > 0;
    const hasRealTerps  = dutchieRealTerps(raw).length > 0;
    return hasTotalTerps && !hasRealTerps && raw.cName;
  });
  if (!needHydration.length) return;
  console.log(`  Hydrating ${needHydration.length} Dutchie products with real terps...`);
  // Counters so we can see in CI whether IndividualFilteredProduct is reaching us
  // or being silently blocked by Cloudflare. Previously this loop swallowed every
  // error and we shipped synthetic terps without anyone noticing.
  let okWithTerps = 0;
  let okNoTerps   = 0;
  let httpErr     = 0;
  let netErr      = 0;
  let lastErrMsg  = '';
  await pooled(needHydration, DUTCHIE_DETAIL_CONCURRENCY, async ({ raw, norm }) => {
    const body = {
      operationName: 'IndividualFilteredProduct',
      variables: {
        includeEnterpriseSpecials: false,
        productsFilter: {
          cName: raw.cName,
          dispensaryId: storeId,
          removeProductsBelowOptionThresholds: false,
          isKioskMenu: false,
          bypassKioskThresholds: false,
          bypassOnlineThresholds: true,
          Status: 'All',
          platformType: 'ONLINE_MENU',
        },
      },
      extensions: { persistedQuery: { version: 1, sha256Hash: DUTCHIE_DETAIL_HASH } },
    };
    let detail = null;
    try {
      const dr = await fetchWithTimeout(DUTCHIE_GQL, {
        method: 'POST',
        headers: {
          ...BROWSER_HEADERS,
          'Content-Type':            'application/json',
          'x-apollo-operation-name': 'IndividualFilteredProduct',
          'Origin':                  'https://dutchie.com',
          'Referer':                 'https://dutchie.com/',
        },
        body: JSON.stringify(body),
      }, 30_000);
      if (!dr.ok) {
        httpErr++;
        lastErrMsg = `HTTP ${dr.status}`;
      } else {
        const dj = await dr.json();
        const fp = dj?.data?.filteredProducts || dj?.filteredProducts;
        detail = (fp?.products || [])[0] || null;
      }
    } catch (err) {
      netErr++;
      lastErrMsg = err.message || String(err);
    }
    if (detail) {
      const realTerps = dutchieRealTerps(detail);
      if (realTerps.length) {
        okWithTerps++;
        norm._terps = realTerps;
        norm._totalTerps = realTerps.reduce((s, t) => s + (Number(t.value)||0), 0);
        norm.lab_results = [{ lab_results: [
          ...realTerps.map(t => ({ unit_id: t.name, value: t.value })),
          ...(norm._cannabs||[]).map(c => ({ unit_id: c.name, value: c.value })),
        ]}];
      } else {
        okNoTerps++;
      }
    }
  });
  const total = needHydration.length;
  console.log(
    `  Hydrate result for ${storeId}: ${okWithTerps}/${total} got real terps` +
    (okNoTerps ? `, ${okNoTerps} responded without terps` : '') +
    (httpErr   ? `, ${httpErr} HTTP errors`               : '') +
    (netErr    ? `, ${netErr} network errors`             : '') +
    (lastErrMsg ? ` (last: ${lastErrMsg})`                : '')
  );
}

async function dutchieAdapter(storeId) {
  let rawList;
  let oracleErr = null;
  let directErr = null;

  if (DUTCHIE_MODE === 'direct_only') {
    try {
      rawList = await dutchieDirectFetch(storeId);
    } catch (err) {
      throw fatalErr(`Dutchie direct_only failed: ${err.message}`);
    }
  } else {
    // proxy_only or proxy_then_direct: try Oracle first.
    try {
      rawList = await dutchieOracleFetch(storeId);
    } catch (err) {
      oracleErr = err;
      console.warn(`  Dutchie Oracle failed for ${storeId}: ${err.message}`);
      if (DUTCHIE_MODE === 'proxy_only') {
        throw fatalErr(`Dutchie requires proxy; Oracle unavailable: ${err.message}`);
      }
      // proxy_then_direct: try direct as fallback.
      console.warn(`  Falling back to direct Dutchie GraphQL for ${storeId}...`);
      try {
        rawList = await dutchieDirectFetch(storeId);
      } catch (derr) {
        directErr = derr;
        if (derr._fatal) {
          throw fatalErr(
            `Dutchie requires proxy; Oracle unavailable (${oracleErr.message}); ` +
            `direct returned ${derr.message}.`
          );
        }
        throw derr;
      }
    }
  }

  const all   = [];
  const pairs = [];
  for (const p of rawList) {
    const norm = dutchieToJaneShape(p);
    if (norm) { all.push(norm); pairs.push({ raw: p, norm }); }
  }
  await dutchieHydrateOnePage(storeId, pairs);
  return all;
}

async function hytivaAdapter(storeId) {
  const res = await fetchWithTimeout(`${HYTIVA_API}/${storeId}`, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });
  if (!res.ok) throw new Error(`Hytiva HTTP ${res.status}`);
  const data = await res.json();
  const list  = Array.isArray(data?.data) ? data.data : [];
  const seen  = new Set();
  const out   = [];
  for (const p of list) {
    const norm = hytivaToJaneShape(p);
    if (!norm || seen.has(norm.objectID)) continue;
    seen.add(norm.objectID);
    out.push(norm);
  }
  return out;
}

let _curaleafLabStyle = null;

async function curaleafFetchLabs(storeId, product) {
  const variants  = (product?.variants || []).filter(v => Number(v?.availableQty) > 0 || v?.availableQty == null);
  const variant   = variants[0] || (product?.variants || [])[0];
  if (!product?.id || !variant?.id) return null;
  const candidates = [
    { productId: product.id, variantId: variant.id, stockType: variant.stockType || 'Default', saleType: 'Medical' },
    { id: variant.id, productId: product.id, stockType: variant.stockType || 'Default', saleType: 'Medical' },
    { variantId: variant.id, stockType: variant.stockType || 'Default', saleType: 'Medical' },
    { productId: product.id, stockType: variant.stockType || 'Default', saleType: 'Medical' },
  ];
  const order = _curaleafLabStyle == null
    ? candidates.map((_, i) => i)
    : [_curaleafLabStyle, ...candidates.map((_, i) => i).filter(i => i !== _curaleafLabStyle)];
  const traceId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID().replace(/-/g, '')
    : String(Date.now());
  for (const style of order) {
    try {
      const res = await fetchWithTimeout(CURALEAF_LABS, {
        method: 'POST',
        headers: {
          StoreId: String(storeId),
          TraceId: traceId,
          SSR: 'false',
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidates[style]),
      }, 20_000);
      if (res.status === 429) { await sleep(8000); return null; }
      if (!res.ok) continue;
      const labs = curaleafLabsFromPayload(await res.json());
      if (labs) { _curaleafLabStyle = style; return labs; }
    } catch {}
  }
  return null;
}

async function curaleafOracleFetch(storeId) {
  const url = `${ORACLE_BASE}/menu/curaleaf/${encodeURIComponent(storeId)}`;
  let res;
  try {
    res = await fetchWithTimeout(url);
  } catch (netErr) {
    throw new Error(`Oracle network error → ${url} → ${netErr.message}`);
  }
  if (!res.ok) {
    const snippet = await readBodySnippet(res);
    const err = new Error(`Oracle HTTP ${res.status} ${res.statusText} → ${url} | body: ${snippet}`);
    if ([401, 403, 404, 410].includes(res.status)) err._fatal = true;
    throw err;
  }
  const json = await res.json();
  return json?.data?.list || json?.list || [];
}

// Sweed needs the age-check cookie or it 403s. Captured 2026-05-02 from
// curaleaf.com browser session. The other cookies in the live request
// (UniqueId, _ga, OptanonConsent, etc.) are analytics-only and not required.
function curaleafCookieFor(storeId) {
  return [
    'swa_Common/isAgeChecked=true',
    'WG_CHOOSE_ORIGINAL=1',
    `last_store=${encodeURIComponent(JSON.stringify({ id: Number(storeId) || storeId }))}`,
  ].join('; ');
}

function curaleafSweedHeaders(storeId) {
  const traceId = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return {
    ...BROWSER_HEADERS,
    'Content-Type': 'application/json',
    'Origin':       'https://curaleaf.com',
    'Referer':      'https://curaleaf.com/',
    // Sweed requires lowercase custom headers (CORS preflight whitelist).
    'storeid':      String(storeId),
    'traceid':      traceId,
    'ssr':          'false',
    'x-cookie':     curaleafCookieFor(storeId),
  };
}

async function curaleafDirectFetch(storeId) {
  const headers = curaleafSweedHeaders(storeId);
  const PAGE_SIZE = 100;
  const all = [];
  let page = 1;

  for (let i = 0; i < 50; i++) { // safety cap: 5000 products/store
    const body = {
      filters: {},
      page,
      pageSize: PAGE_SIZE,
      platformOs: 'web',
    };
    const res = await fetchWithTimeout(CURALEAF_API, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const snippet = await readBodySnippet(res, 200);
      const err = new Error(`Sweed HTTP ${res.status} | body: ${snippet}`);
      if ([401, 403, 404].includes(res.status)) err._fatal = true;
      throw err;
    }
    const json = await res.json();
    const list = json?.data?.list || json?.data?.items || json?.list
                 || json?.items || json?.products || [];
    all.push(...list);

    // Stop conditions: short page, or we've hit the totalCount.
    const total = json?.data?.totalCount ?? json?.totalCount
                 ?? json?.data?.total ?? json?.total;
    if (list.length < PAGE_SIZE) break;
    if (Number.isFinite(Number(total)) && all.length >= Number(total)) break;
    page++;
  }
  return all;
}

async function curaleafAdapter(storeId) {
  let rawList;
  try {
    rawList = await curaleafOracleFetch(storeId);
  } catch (oracleErr) {
    console.warn(`  Oracle unavailable for Curaleaf ${storeId}: ${oracleErr.message}. Trying direct Sweed API.`);
    rawList = await curaleafDirectFetch(storeId);
  }

  // Hydrate labs for flower/vape/extract (3 at a time to avoid 429).
  const needLabs = rawList.filter(p => {
    const k = curaleafKind(p);
    return k === 'flower' || k === 'vape' || k === 'extract';
  });
  const labCache = new Map();
  console.log(`  Hydrating labs for ${needLabs.length} Curaleaf products...`);
  let labDone = 0;
  await pooled(needLabs, 3, async (p) => {
    const labs = await curaleafFetchLabs(storeId, p);
    if (labs) labCache.set(p.id, labs);
    labDone++;
    if (labDone % 30 === 0) process.stdout.write(`  ...${labDone}/${needLabs.length} labs done\r`);
  });
  if (labDone > 0) process.stdout.write('\n');

  const seen = new Set();
  const out  = [];
  for (const p of rawList) {
    const norm = curaleafToJaneShape(p, labCache.get(p.id) || null);
    if (norm && !seen.has(norm.objectID)) { seen.add(norm.objectID); out.push(norm); }
  }
  return out;
}

// ==============================================================
// CATALOG DIAGNOSTICS + SANITIZER
// ==============================================================
//
// The frontend only reads a known set of fields from each product.
// Provider payloads (especially Algolia) ship dozens of extra fields:
// _highlightResult, _rankingInfo, batch_data, search_attributes,
// long marketing-copy descriptions, full image-variant arrays, etc.
//
// We strip everything except the explicit allowlist below before writing
// the catalog. Typical reduction: 100+ MB catalogs drop to 20–30 MB.

const KEEP_FIELDS = new Set([
  // Identity / display
  'objectID', 'product_id', 'name', 'brand', 'kind', 'category',
  // Detail
  'percent_thc', 'image_urls', 'root_subtype', 'product_subtype', 'description',
  // Frontend-computed (these ARE what the renderer reads)
  '_terps', '_cannabs', '_sizes', '_subs', '_totalTerps',
  // Provider badge flags (1-byte booleans, cheap)
  '_isDutchie', '_isHytiva', '_isCuraleaf',
  // Source metadata (added by builder; small + needed for filtering)
  'sourceProvider', 'sourceStoreId', 'sourceStoreName', 'sourceCity',
  'sourceBrandId', 'sourceBrandName', 'storeKey', 'fetchedAt',
]);

const PRICE_FIELD_RE = /^(price|discounted_price)_/;

function sanitizeProduct(p) {
  const out = {};
  for (const k of Object.keys(p)) {
    if (KEEP_FIELDS.has(k) || PRICE_FIELD_RE.test(k)) {
      out[k] = p[k];
    }
  }
  // Image arrays sometimes carry 5–10 size variants; the UI uses 1.
  if (Array.isArray(out.image_urls) && out.image_urls.length > 3) {
    out.image_urls = out.image_urls.slice(0, 3);
  }
  // Marketing copy can be 2–5 KB per product; truncate to a reasonable preview.
  if (typeof out.description === 'string' && out.description.length > 500) {
    out.description = out.description.slice(0, 500);
  }
  return out;
}

function diagnoseCatalog(products, label) {
  if (!products.length) {
    console.log(`\n[diagnose ${label}] 0 products`);
    return 0;
  }
  // Compute total size by stringifying chunks (avoids hitting V8's max string length).
  let totalBytes = 0;
  const chunkSize = 1000;
  for (let i = 0; i < products.length; i += chunkSize) {
    totalBytes += JSON.stringify(products.slice(i, i + chunkSize)).length;
  }
  console.log(`\n[diagnose ${label}] ${products.length.toLocaleString()} products, ~${(totalBytes/1024/1024).toFixed(2)} MB`);

  // Top-level keys present across the catalog (sample first 500).
  const allKeys = new Set();
  for (const p of products.slice(0, 500)) for (const k of Object.keys(p)) allKeys.add(k);
  console.log(`  Top-level keys (sample): ${[...allKeys].sort().join(', ')}`);

  // Top 10 largest products.
  const sized = products
    .map(p => ({
      name: (p.name || '?').slice(0, 50),
      provider: p.sourceProvider || '?',
      store: p.sourceStoreName || '?',
      size: JSON.stringify(p).length,
      nKeys: Object.keys(p).length,
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  console.log(`  Top 10 largest products:`);
  for (const s of sized) {
    console.log(`    ${(s.size/1024).toFixed(1).padStart(6)} KB · ${s.nKeys} keys · [${s.provider}] ${s.store} :: ${s.name}`);
  }

  // Field weight (sum string-size of each field across a sample of 1000 products).
  const fieldSizes = {};
  const sample = products.slice(0, Math.min(1000, products.length));
  for (const p of sample) {
    for (const [k, v] of Object.entries(p)) {
      const sz = v == null ? 0 : (typeof v === 'string' ? v.length : JSON.stringify(v).length);
      fieldSizes[k] = (fieldSizes[k] || 0) + sz;
    }
  }
  const topFields = Object.entries(fieldSizes).sort((a, b) => b[1] - a[1]).slice(0, 15);
  console.log(`  Top 15 fields by total bytes (sample of ${sample.length} products):`);
  for (const [field, sz] of topFields) {
    const kept = KEEP_FIELDS.has(field) || PRICE_FIELD_RE.test(field);
    console.log(`    ${(sz/1024).toFixed(1).padStart(7)} KB ${kept ? '✓' : '✗'} ${field}`);
  }

  return totalBytes;
}

// ==============================================================
// PER-STORE FETCH ORCHESTRATION
// ==============================================================

function loadStoreConfig() {
  return JSON.parse(fs.readFileSync(STORES_FILE, 'utf8'));
}

function buildStoreJobs(brands) {
  const jobs = [];
  for (const brand of brands) {
    if (!brand.active) continue;
    for (const store of brand.stores || []) {
      jobs.push({
        brandId:   brand.id,
        brandName: brand.name,
        provider:  brand.provider,
        storeId:   String(store.id),
        storeName: store.name,
        city:      store.city,
        storeKey:  `${brand.provider}:${store.id}`,
      });
    }
  }
  return jobs;
}

async function fetchStore(job) {
  const label = `${job.brandName} / ${job.storeName}`;
  console.log(`Fetching [${job.provider}] ${label}...`);
  let products;
  switch (job.provider) {
    case 'jane':     products = await janeAdapter(job.storeId); break;
    case 'dutchie':  products = await dutchieAdapter(job.storeId); break;
    case 'hytiva':   products = await hytivaAdapter(job.storeId); break;
    case 'curaleaf': products = await curaleafAdapter(job.storeId); break;
    default:
      throw Object.assign(new Error(`No adapter for provider "${job.provider}"`), { _adapterMissing: true });
  }
  console.log(`  -> ${products.length} products from ${label}`);
  return products;
}

// ==============================================================
// OUTPUT HELPERS
// ==============================================================

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadLastGood() {
  try {
    if (fs.existsSync(LAST_GOOD)) return JSON.parse(fs.readFileSync(LAST_GOOD, 'utf8'));
  } catch {}
  return null;
}

function saveLastGood(catalog) {
  try { fs.writeFileSync(LAST_GOOD, JSON.stringify(catalog)); } catch {}
}

// ==============================================================
// MAIN BUILD
// ==============================================================

async function buildCatalog() {
  console.log('\n=== PaBuddy Catalog Builder ===');
  console.log(`Started:      ${new Date().toISOString()}`);
  console.log(`Node:         ${process.version}`);
  console.log(`Oracle base:  ${ORACLE_BASE}`);
  console.log(`Dutchie mode: ${DUTCHIE_MODE}`);
  console.log(`Jane mode:    ${JANE_MODE}` +
    (JANE_MODE === 'direct' ? '  (set JANE_MODE=oracle if Cloudflare blocks direct)' : '') +
    '\n');

  if (typeof fetch === 'undefined') {
    console.error('ERROR: Native fetch not found. Requires Node >= 18. Current: ' + process.version);
    process.exit(1);
  }

  ensureDataDir();

  const brands = loadStoreConfig();
  const jobs   = buildStoreJobs(brands);
  console.log(`Stores to fetch: ${jobs.length} across ${brands.filter(b => b.active).length} brands\n`);

  // Stagger Dutchie jobs slightly to reduce rate-limit pressure.
  let dutchieDelay = 0;
  for (const j of jobs) {
    if (j.provider === 'dutchie') {
      j._delay = dutchieDelay;
      dutchieDelay += DUTCHIE_STAGGER_MS;
    } else {
      j._delay = 0;
    }
  }

  const successStores = [];
  const failedStores  = [];
  const allProducts   = [];

  await pooled(jobs, STORE_CONCURRENCY, async (job) => {
    if (job._delay) await sleep(job._delay);
    try {
      const products = await withRetry(() => fetchStore(job), `${job.brandName}/${job.storeName}`);
      const meta = {
        sourceProvider:  job.provider,
        sourceStoreId:   job.storeId,
        sourceStoreName: job.storeName,
        sourceCity:      job.city,
        sourceBrandId:   job.brandId,
        sourceBrandName: job.brandName,
        storeKey:        job.storeKey,
        fetchedAt:       new Date().toISOString(),
      };
      for (const p of products) Object.assign(p, meta);
      allProducts.push(...products);
      successStores.push({ ...job, productCount: products.length });
    } catch (err) {
      console.error(`  FAILED: ${job.brandName}/${job.storeName} — ${err.message}`);
      failedStores.push({ ...job, error: err.message });
    }
  });

  console.log(`\n========== Build Summary ==========`);
  console.log(`Total stores attempted: ${jobs.length}`);
  console.log(`Successful stores:      ${successStores.length}`);
  console.log(`Failed stores:          ${failedStores.length}`);
  console.log(`Total products:         ${allProducts.length}`);

  // Per-provider breakdown.
  const allProviders = new Set([...successStores.map(s => s.provider), ...failedStores.map(s => s.provider)]);
  console.log(`\nPer-provider results:`);
  for (const prov of allProviders) {
    const okCount   = successStores.filter(s => s.provider === prov).length;
    const failCount = failedStores.filter(s => s.provider === prov).length;
    const total     = okCount + failCount;
    const products  = successStores.filter(s => s.provider === prov).reduce((a, s) => a + s.productCount, 0);
    console.log(`  ${prov.padEnd(10)} ${okCount}/${total} stores OK, ${products.toLocaleString()} products` +
      (failCount > 0 ? ` (${failCount} failed)` : ''));
  }

  if (failedStores.length) {
    console.log(`\nFailure reasons (top 5 by frequency):`);
    const reasonCounts = {};
    for (const s of failedStores) {
      const key = (s.error || 'unknown').slice(0, 120);
      reasonCounts[key] = (reasonCounts[key] || 0) + 1;
    }
    const top = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (const [reason, n] of top) console.log(`  [${n}x] ${reason}`);
  }

  // ── Diagnose, then sanitize, then re-diagnose ─────────────────
  const beforeBytes = diagnoseCatalog(allProducts, 'BEFORE sanitize');
  const sanitized = allProducts.map(sanitizeProduct);
  const afterBytes = diagnoseCatalog(sanitized, 'AFTER sanitize');
  if (beforeBytes > 0) {
    const pct = Math.round((1 - afterBytes / beforeBytes) * 100);
    console.log(`\nSanitizer dropped ${pct}% of bytes (${(beforeBytes/1024/1024).toFixed(1)} MB → ${(afterBytes/1024/1024).toFixed(1)} MB).`);
  }
  // Replace the products array with the sanitized version for catalog build.
  allProducts.length = 0;
  allProducts.push(...sanitized);

  const now      = new Date();
  const expiresAt = new Date(now.getTime() + EXPIRES_HOURS * 3600_000).toISOString();

  // Gather provider and store summaries.
  const providerSet = new Set(successStores.map(s => s.provider));
  const storeList   = successStores.map(s => ({
    brandId:   s.brandId,
    brandName: s.brandName,
    provider:  s.provider,
    storeId:   s.storeId,
    storeName: s.storeName,
    city:      s.city,
    storeKey:  s.storeKey,
    productCount: s.productCount,
  }));

  const catalog = {
    version:     '1',
    state:       'PA',
    generatedAt: now.toISOString(),
    expiresAt,
    providers:   [...providerSet],
    stores:      storeList,
    products:    allProducts,
    failedStores: failedStores.map(s => ({
      brandId: s.brandId, brandName: s.brandName, provider: s.provider,
      storeId: s.storeId, storeName: s.storeName, city: s.city, error: s.error,
    })),
  };

  const meta = {
    generatedAt:       now.toISOString(),
    expiresAt,
    productCount:      allProducts.length,
    storeCount:        successStores.length,
    providerCount:     providerSet.size,
    failedStoreCount:  failedStores.length,
    failedStores:      catalog.failedStores,
    catalogPath:       'data/catalog-pa.json',
  };

  // Catalog is split into one file per provider so no single file exceeds
  // GitHub's 100 MB hard limit. The canonical catalog-pa.json is now an
  // INDEX file (small) listing the per-provider chunks. Frontend fetches
  // the index, then fetches all chunks in parallel.
  function writeCatalogFiles(payload) {
    const byProvider = {};
    for (const p of (payload.products || [])) {
      const k = p.sourceProvider || 'unknown';
      (byProvider[k] = byProvider[k] || []).push(p);
    }

    const providerFiles = {};
    let totalBytes = 0;
    const oversizedFiles = [];
    const GITHUB_LIMIT = 100 * 1024 * 1024;
    for (const [prov, products] of Object.entries(byProvider)) {
      const filename = `catalog-pa-${prov}.json`;
      const json = JSON.stringify(products);
      fs.writeFileSync(path.join(DATA_DIR, filename), json);
      providerFiles[prov] = { file: filename, productCount: products.length, bytes: json.length };
      totalBytes += json.length;
      const sizeNote = json.length > GITHUB_LIMIT ? '  *** OVER GITHUB 100MB LIMIT — git push will reject this file ***' : '';
      if (json.length > GITHUB_LIMIT) oversizedFiles.push({ filename, mb: json.length / 1024 / 1024 });
      console.log(`  wrote ${filename}  (${products.length.toLocaleString()} products, ${(json.length/1024/1024).toFixed(2)} MB)${sizeNote}`);
    }
    if (oversizedFiles.length) {
      console.warn(`\n!!! ${oversizedFiles.length} chunk(s) exceed GitHub's 100 MB limit:`);
      for (const f of oversizedFiles) console.warn(`    - ${f.filename} (${f.mb.toFixed(1)} MB)`);
      console.warn(`    Tighten KEEP_FIELDS or split these chunks further before pushing.`);
    }

    // The index has everything EXCEPT the products array. Frontend joins on load.
    const index = {
      version:       payload.version,
      state:         payload.state,
      generatedAt:   payload.generatedAt,
      expiresAt:     payload.expiresAt,
      providers:     payload.providers,
      providerFiles,
      productCount:  (payload.products || []).length,
      stores:        payload.stores,
      failedStores:  payload.failedStores,
    };
    const indexJson = JSON.stringify(index, null, 2);
    fs.writeFileSync(CATALOG_OUT, indexJson);
    fs.writeFileSync(CATALOG_MIN, JSON.stringify(index));
    totalBytes += indexJson.length;
    console.log(`  wrote ${path.basename(CATALOG_OUT)} (index, ${(indexJson.length/1024).toFixed(1)} KB)`);
    return totalBytes;
  }

  // Always write the small meta file first — it's ~5KB and never fails.
  fs.writeFileSync(META_OUT, JSON.stringify(meta, null, 2));

  let bytesWritten = 0;
  let usingLastGood = false;

  if (allProducts.length === 0) {
    console.warn('\nWARNING: Zero products fetched. Preserving last good catalog if available.');
    const lastGood = loadLastGood();
    if (lastGood) {
      console.warn('Using last good catalog from:', lastGood.generatedAt);
      bytesWritten = writeCatalogFiles(lastGood);
      usingLastGood = true;
    } else {
      console.warn('No last good catalog found. Writing empty catalog so meta file reflects failure.');
      bytesWritten = writeCatalogFiles(catalog);
    }
  } else {
    // Check for catastrophic regression (< 10% of previous product count).
    const lastGood = loadLastGood();
    if (lastGood && lastGood.products?.length > 0) {
      const ratio = allProducts.length / lastGood.products.length;
      if (ratio < 0.10) {
        console.warn(`\nWARNING: Product count dropped to ${Math.round(ratio*100)}% of last good (${allProducts.length} vs ${lastGood.products.length}).`);
        console.warn('Preserving last good catalog. Fix fetch errors and re-run.');
        bytesWritten = writeCatalogFiles(lastGood);
        usingLastGood = true;
      }
    }
    if (!usingLastGood) {
      bytesWritten = writeCatalogFiles(catalog);
      saveLastGood(catalog);
    }
  }

  console.log(`\nOutput files:`);
  console.log(`  ${CATALOG_OUT}  (${(bytesWritten/1024/1024).toFixed(2)} MB)`);
  console.log(`  ${CATALOG_MIN}  (${(bytesWritten/1024/1024).toFixed(2)} MB)`);
  console.log(`  ${META_OUT}`);
  if (usingLastGood) console.log(`  (preserved from last good build)`);
  console.log(`\nFinished: ${new Date().toISOString()}`);
  console.log(`\nNext step: copy data/ folder to your GitHub Pages repo and commit.`);
  if (failedStores.length) {
    console.log(`\nFull failed-store list (also saved to catalog-meta.json failedStores):`);
    for (const s of failedStores) console.log(`  - [${s.provider}] ${s.brandName}/${s.storeName}: ${s.error}`);
  }
}

buildCatalog().catch(err => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
