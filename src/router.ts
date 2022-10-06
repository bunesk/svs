import {createRouter, createMemoryHistory, createWebHistory} from 'vue-router';
import Error404 from './views/Error404.vue';
import Home from './views/Home.vue';

export default (app: any) => {
  const pages = ['imprint'];
  const capitalize = ([first, ...rest] : string) => first.toUpperCase() + rest.join('');

  // define some routes
  const routes = [
    {name: 'home', path: '/', component: Home},
    ...pages.map((page) => ({
      name: page,
      path: `/${page}`,
      component: () =>
        import(`./views/${capitalize(page as any)}.vue`).catch(() => Error404),
    })),
    {name: 'error404', path: '/:pathMatch(.*)*', component: Error404},
  ];

  // create router instance and pass the `routes` option
  const router = createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR
      ? createMemoryHistory()
      : createWebHistory(),
    routes,
  });

  app.use(router);
  return router;
};
