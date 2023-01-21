<script setup lang="ts">
</script>

<template>
  <div>
    <RouterLink :to="`/admin`">
      <Button
        class="navigation-button"
        icon="pi pi-angle-left"
        label="Zurück zu Admin"
      ></Button>
    </RouterLink>
    <h1>Veranstaltungen</h1>
    <EventList />
  </div>
</template>

<style lang="scss" scoped>
h1 {
  padding-bottom: 0.5rem;
}
</style>
