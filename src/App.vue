<script setup lang="ts">
import './assets/css/base.scss';
import {onMounted} from 'vue';
import {useRouter} from 'vue-router';
import user from './client/user';

const router = useRouter();

const getRoute = (to: any) => {
  // if logged in go to home if login or register is called
  if (user.value && (to.path === '/login' || to.path === '/register')) {
    return {path: '/'};
  }
  // if not logged in redirect all except register to login
  if (
    !user.value &&
    to.path !== '/login' &&
    to.path !== '/register' &&
    to.path !== '/imprint' &&
    to.path !== '/privacy'
  ) {
    return {path: '/login'};
  }
  // if not admin redirect all admin pages to home
  if (!(user.value && user.value.isAdmin) && to.path.startsWith('/admin')) {
    return {path: '/'};
  }
};

onMounted(() => {
  router.beforeEach((to: any) => {
    return getRoute(to);
  });
});

const route = getRoute(router.currentRoute.value);
if (route) {
  router.replace(route.path);
}
</script>

<template>
  <div id="root">
    <Header />
    <main>
      <RouterView />
    </main>
  </div>
  <Footer />
</template>

<style lang="scss" scoped>
@import './assets/css/primevue-corrections.scss';

#root {
  margin: 0 auto;
  width: 85%;
  max-width: 1600px;
  min-height: 60vh;
  background-color: #fff;
  border-radius: 0 0 0.25em 0.25em;

  main {
    padding: 1em 2em;

    :deep(h1) {
      margin: 0;
    }
  }
}
</style>
