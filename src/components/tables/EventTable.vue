<script setup lang="ts">
defineProps({
  event: {type: Object, required: true},
});
</script>

<template>
  <div
    v-if="event"
    class="table"
  >
    <span class="row-title">Name:</span>
    <span class="row-value">{{event.name}}</span>
    <span class="row-title">Anzahl Tests:</span>
    <span class="row-value">{{event.amountTests}}</span>
    <span class="row-title">Anzahl Blätter:</span>
    <span class="row-value">{{event.amountSheets}}</span>
    <span class="row-title">Maximale Punkte:</span>
    <span class="row-value">{{event.pointsMax}}</span>
    <span class="row-title">Punkte zum Bestehen:</span>
    <span class="row-value">{{event.pointsPassed}}</span>
    <span class="row-title">Sichtbar:</span>
    <span class="row-value">{{event.visibleLabel}}</span>
  </div>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: 10rem auto;
}
</style>
