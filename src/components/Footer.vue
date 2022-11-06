<script setup lang="ts">
</script>

<template>
  <footer>
    <p>
      © Copyright
      {{ new Date().getFullYear() }}
      <RouterLink to="/imprint">Impressum</RouterLink>
      <RouterLink to="/privacy">Datenschutz</RouterLink>
    </p>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  :deep(a) {
    margin: 0 0.1rem;
  }
}
</style>
