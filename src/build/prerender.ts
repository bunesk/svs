// Pre-render the app into static HTML.
// run `npm run build:static` and then `dist/static` can be served as a static site.

import * as url from 'url';
import fs from 'node:fs';
import path from 'node:path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const toAbsolute = (p: string) => path.resolve(__dirname, p);

const manifest = (
  await import(
    // @ts-ignore
    '../../dist/static/ssr-manifest.json',
    {
      assert: {type: 'json'},
    }
  )
).default;
const template = fs.readFileSync(
  toAbsolute('../../dist/static/index.html'),
  'utf-8'
);
// @ts-ignore
const {render} = await import('../../dist/server/entry-server.js');

// determine routes to pre-render from src/views
const routesToPrerender = fs
  .readdirSync(toAbsolute('../../src/views'))
  .map((file) => {
    const name = file.replace(/\.vue$/, '').toLowerCase();
    return name === 'home' ? `/` : `/${name}`;
  });

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const [appHtml, preloadLinks] = await render(url, manifest);

    const html = template
      .replace(`<!--preload-links-->`, preloadLinks)
      .replace(`<!--app-html-->`, appHtml);

    const filePath = `../../dist/static${url === '/' ? '/index' : url}.html`;
    fs.writeFileSync(toAbsolute(filePath), html);
    console.log('pre-rendered:', filePath);
  }

  // create .htaccess
  fs.copyFile(
    toAbsolute('./.htaccess.template'),
    toAbsolute('../../dist/static/.htaccess'),
    (error) => {
      if (error) {
        throw error;
      }
      console.log('Successfully created .htaccess');
    }
  );

  // done, delete ssr manifest
  fs.unlinkSync(toAbsolute('../../dist/static/ssr-manifest.json'));
})();
