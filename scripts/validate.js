#!/usr/bin/env node
/* Validazione leggera del sito (nessuna dipendenza): usata da CI e in locale. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const errors = [];

if (pages.length === 0) errors.push('nessuna pagina HTML trovata');

for (const p of pages) {
  const file = path.join(root, p);
  const html = fs.readFileSync(file, 'utf8');
  const err = (m) => errors.push(p + ': ' + m);

  // CSS/JS esterni, niente più blocchi inline
  if (!/<link rel="stylesheet" href="\.\/styles\.css\?v=\d+">/.test(html)) err('manca il link a ./styles.css?v=N');
  if (!/<script src="\.\/mmos\.js\?v=\d+" defer><\/script>/.test(html)) err('manca lo script ./mmos.js?v=N');
  if (/<style[\s>]/.test(html)) err('blocco <style> inline residuo');
  if (/mmos\.js\?v=(?!12\b)/.test(html)) err('versione script diversa da ?v=12');

  // meta base
  if (!/<html lang="it"/.test(html)) err('manca <html lang="it">');
  if (!/<meta name="viewport"/.test(html)) err('manca viewport');
  if (!/<title>[^<]+<\/title>/.test(html)) err('manca <title>');
  if (!/<meta property="og:title"/.test(html)) err('manca og:title');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) err('h1 presenti: ' + h1 + ' (atteso 1)');

  // link/risorse locali devono esistere
  for (const m of html.matchAll(/(?:href|src)="(\.\/[^"#]+)"/g)) {
    let target = m[1].replace(/^\.\//, '').split('?')[0].split('#')[0];
    if (!target) continue;
    if (!fs.existsSync(path.join(root, target))) err('risorsa mancante: ' + m[1]);
  }
}

// og:title unico per pagina (anteprime condivisione distinte)
const titles = new Map();
for (const p of pages) {
  const html = fs.readFileSync(path.join(root, p), 'utf8');
  const m = html.match(/<meta property="og:title" content="([^"]+)"/);
  if (m) {
    if (titles.has(m[1])) errors.push('og:title duplicato tra ' + titles.get(m[1]) + ' e ' + p);
    else titles.set(m[1], p);
  }
}

if (errors.length) {
  console.error('Validazione fallita:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('OK: ' + pages.length + ' pagine validate (CSS/JS esterni, meta, risorse locali).');
