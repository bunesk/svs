<script setup lang="ts">
import {useRoute} from 'vue-router';

const route = useRoute();
</script>

<template>
  <div id="event-edit">
    <h1>Veranstaltung bearbeiten</h1>
    <EventEditForm
      v-if="route && route.params.id"
      :id="route.params.id"
    />
  </div>
</template>

<style lang="scss" scoped>
#event-edit {
  text-align: center;
}
</style>
