<script setup lang="ts">
import {ref} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const id = ref(route.params.id as string);
</script>

<template>
  <div id="event-edit">
    <h1>Veranstaltung bearbeiten</h1>
    <EventEditForm
      v-if="route && id"
      :id="id"
    />
  </div>
</template>

<style lang="scss" scoped>
#event-edit {
  text-align: center;
}
</style>
