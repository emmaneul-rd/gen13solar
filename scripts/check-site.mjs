import { readdir, readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = await readdir(root);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
let failures = 0;

for (const file of htmlFiles) {
  const html = await readFile(join(root, file), 'utf8');
  const refs = [...html.matchAll(/(?:href|src)="(?!https?:|mailto:|tel:|#)([^"?#]+)(?:[?#][^"]*)?"/g)].map((m) => m[1]);
  for (const ref of refs) {
    try {
      await access(join(root, ref));
    } catch {
      console.error(`[BROKEN] ${file} -> ${ref}`);
      failures++;
    }
  }
  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) {
    console.error(`[H1] ${file} has ${h1Count} h1 elements`);
    failures++;
  }
  if (!html.includes('<meta name="description"')) {
    console.error(`[SEO] ${file} has no meta description`);
    failures++;
  }
}

/* ---- validate locale JSON (i18n must parse or ES switch silently breaks) ---- */
const localeFiles = ['locales/en.json', 'locales/es.json'];
for (const rel of localeFiles) {
  try {
    const raw = await readFile(join(root, rel), 'utf8');
    JSON.parse(raw);
  } catch (err) {
    console.error(`[I18N] ${rel} is not valid JSON: ${err.message}`);
    failures++;
  }
}

if (failures) {
  console.error(`Site check failed with ${failures} issue(s).`);
  process.exit(1);
}
console.log(`PASS: checked ${htmlFiles.length} HTML files, local asset references, and ${localeFiles.length} locale files.`);
