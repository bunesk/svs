import { createSSRApp } from 'vue';
import App from './App.vue';
import createRouter from './router';

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance.
export default function () {
  const app = createSSRApp(App);
  const modules = Object.values(import.meta.glob('./modules/*.ts', {eager: true}));

  for (const mod of modules) {
    (mod as any).install?.(app);
  }
  const router = createRouter(app);

  return {app, router};
};
