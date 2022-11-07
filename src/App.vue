<script setup lang="ts">
import './assets/css/base.scss';
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
