<script setup lang="ts">
</script>

<template>
  <header>
    <RouterLink
      title="Zur Startseite"
      to="/"
    >
      <img src="/logo.jpg">
      <span class="title">SVS</span>
    </RouterLink>
    <Logout />
  </header>
</template>

<style lang="scss" scoped>
header {
  text-align: center;
  padding: 0.75em 0;
  border-bottom: 0.1em solid var(--color-primary);
  position: relative;

  :deep(a) {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: #000;

    .title {
      font-size: 3em;
      padding-left: 0.25em;
    }

    img {
      max-width: 4em;
    }
  }
}
</style>
