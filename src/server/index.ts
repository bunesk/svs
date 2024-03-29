import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import express, {Request, Response} from 'express';
import defineRules from './rules.js';
import * as dotenv from 'dotenv';
import db from '../database/DatabaseConnection.js';

dotenv.config();
const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD;
const SERVER_PORT = process.env.SERVER_PORT || 5173;

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort?: number
) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const resolve = (p: string) => path.resolve(__dirname, p);
  const resolveDist = (path: string) => resolve(`../../dist/${path}`);

  const indexProd = isProd ? fs.readFileSync(resolveDist('client/index.html'), 'utf-8') : '';

  const manifest = isProd
    ? (
        await import(resolveDist('client/ssr-manifest.json'), {
          assert: {type: 'json'},
        })
      ).default
    : {};

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite: any;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      base: '/',
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import('compression')).default());
    app.use(
      '/',
      (await import('serve-static')).default(resolveDist('client'), {
        index: false,
      })
    );
  }

  // support json and url-encoded bodies
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  // define custom routing rules
  defineRules(app);

  app.get('*', async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl;

      let template: string;
      let render: Function;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('../../index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('src/server/entry-server.ts')).render;
      } else {
        template = indexProd;
        // @ts-ignore
        render = (await import(resolveDist('server/entry-server.js'))).render;
      }

      const [appHtml, preloadLinks] = await render(url, manifest);

      const html = template.replace(`<!--preload-links-->`, preloadLinks).replace(`<!--app-html-->`, appHtml);

      res.status(200).set({'Content-Type': 'text/html'}).end(html);
    } catch (e: any) {
      vite && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // connect database and sync models
  await db.connectionEstablished;

  return {app, vite};
}

if (!isTest) {
  createServer().then(({app}) =>
    app.listen(SERVER_PORT, () => {
      console.log(`Listening on http://localhost:${SERVER_PORT}`);
    })
  );
}
