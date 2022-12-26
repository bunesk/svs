<script setup lang="ts">
</script>

<template>
  <div>
    <h1>Veranstaltungen</h1>
    <RouterLink
      to="/users/create"
      class="create-button"
    >
      <Button>Benutzer anlegen</Button>
    </RouterLink>
    <EventList />
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
