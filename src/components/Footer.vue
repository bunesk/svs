<script setup lang="ts">
</script>

<template>
  <footer>
    © Copyright
    {{ new Date().getFullYear() }}
    Alle Rechte vorbehalten.
    <RouterLink to="/imprint">Impressum</RouterLink>
    <RouterLink to="/privacy">Datenschutz</RouterLink>
  </footer>
</template>

<style lang="scss" scoped>
footer {
  font-size: 0.9em;
  text-align: center;
  color: #fff;
  padding: 0.5em 0;

  :deep(a) {
    color: #fff;
    margin: 0 0.1rem;
  }
}
</style>
