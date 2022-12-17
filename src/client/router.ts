import {createRouter, createMemoryHistory, createWebHistory} from 'vue-router';
// @ts-ignore
import routes from '~pages';

export default (app: any) => {
  // create router instance and pass the `routes` option
  const router = createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    // insert auto-generated routes
    routes,
  });

  app.use(router);
  return router;
};
