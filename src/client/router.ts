import {createRouter, createMemoryHistory, createWebHistory} from 'vue-router';
import Error404 from '../templates/Error404.vue';

export default (app: any) => {
  // Auto generates routes from vue files under ./views
  const views = import.meta.glob('../views/*.vue');

  const generatedRoutes = Object.keys(views).map((path: any) => {
    const name = path.match(/\.\/views(.*)\.vue$/)[1].toLowerCase();
    return {
      name: name.substring(1),
      path: name === '/home' ? '/' : name,
      component: views[path], // () => import('./views/*.vue')
    };
  });

  const routes = [
    ...generatedRoutes,
    {name: 'error404', path: '/:pathMatch(.*)*', component: Error404},
  ];

  // create router instance and pass the `routes` option
  const router = createRouter({
    // use appropriate history implementation for server/client
    // import.meta.env.SSR is injected by Vite.
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });

  app.use(router);
  return router;
};
