<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Benutzer</h1>
    <RouterLink
      to="/admin/users/create"
      class="create-button"
    >
      <Button>Benutzer erstellen</Button>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  padding-bottom: 0.5rem;
}
.create-button {
  text-decoration: none;
}
</style>
