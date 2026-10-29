import { readFile, writeFile } from 'node:fs/promises';

const sites = ['lab-4', 'lab-4-tailwind', 'lab-5', 'lab-6', 'lab-7'];
const scriptTag = '    <script src="/Webproject/lab-switcher.js" defer></script>\n';

for (const site of sites) {
  const file = new URL(`../site/${site}/index.html`, import.meta.url);
  const html = await readFile(file, 'utf8');

  if (html.includes('/Webproject/lab-switcher.js')) continue;

  const updated = html.replace(/<\/body>/i, `${scriptTag}</body>`);
  if (updated === html) {
    throw new Error(`Closing body tag was not found in ${site}/index.html`);
  }

  await writeFile(file, updated);
}
