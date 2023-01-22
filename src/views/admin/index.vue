<script setup lang="ts">
</script>

<template>
  <div>
    <RouterLink :to="`/`">
      <Button
        class="navigation-button"
        icon="pi pi-home"
        label="Zurück zur Startseite"
      ></Button>
    </RouterLink>
    <h1>Admin</h1>
    <p>Willkommen auf der Admin-Seite zum Verwalten der Benutzer, Veranstaltungen, Tests etc. Bitte wählen Sie aus, wie Sie hinmöchten.</p>
    <RouterLink to="/admin/users">
      <Button label="Benutzer verwalten" />
    </RouterLink>&nbsp;
    <RouterLink to="/admin/events">
      <Button label="Veranstaltungen verwalten" />
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
</style>
