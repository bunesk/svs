<script setup lang="ts">
</script>

<template>
  <div class="event-list">
    <RouterLink :to="`/`">
      <Button
        class="navigation-button"
        icon="pi pi-home"
        label="Zurück zur Startseite"
      ></Button>
    </RouterLink>
    <h1>Veranstaltungen</h1>
    <p>Bitte wählen Sie zunächst die Veranstaltung aus, dessen Test Sie bewerten wollen.</p>
    <EventNameList urlPrefix="/rate" />
  </div>
</template>

<style lang="scss" scoped>
h1 {
  padding-bottom: 0.5rem;
}
.event-list {
  text-align: center;
}
</style>
