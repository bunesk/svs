// Pre-render the app into static HTML.
// run `npm run build:static` and then `dist/static` can be served as a static site.

import * as url from 'url';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const toAbsolute = (p: string) => path.resolve(__dirname, p);
const baseUrl = toAbsolute('../..');

const manifest = (
  await import(`${baseUrl}/dist/static/ssr-manifest.json`, {
    assert: {type: 'json'},
  })
).default;
const template = fs.readFileSync(`${baseUrl}/dist/static/index.html`, 'utf-8');
const {render} = await import(`${baseUrl}/dist/server/entry-server.js`);

// determine routes to pre-render from src/views
const routesToPrerender = fs.readdirSync(`${baseUrl}/src/views`).map((file) => {
  const name = file.replace(/\.vue$/, '').toLowerCase();
  return name === 'home' ? `/` : `/${name}`;
});

// pre-render each route
const prerenderRoutes = async () => {
  for (const url of routesToPrerender) {
    const [appHtml, preloadLinks] = await render(url, manifest);

    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml);

    const filePath = `${baseUrl}/dist/static${
      url === '/' ? '/index' : url
    }.html`;
    fs.writeFileSync(filePath, html);
    console.log('pre-rendered:', filePath);
  }
};

// define rules for redirects
const createHtaccess = () => {
  fs.copyFile(
    toAbsolute('./.htaccess.template'),
    `${baseUrl}/dist/static/.htaccess`,
    (error) => {
      if (error) {
        throw error;
      }
      console.log('Successfully created .htaccess');
    }
  );
};

(async () => {
  await prerenderRoutes();
  createHtaccess();

  // done, delete ssr manifest
  fs.unlinkSync(`${baseUrl}/dist/static/ssr-manifest.json`);
})();
