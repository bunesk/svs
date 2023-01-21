<script setup lang="ts">
defineProps({
  tests: {type: Array, default: null},
});
</script>

<template>
  <div class="event-test-list">
    <div v-if="tests && tests.length">
      <div
        v-for="test of tests"
        :key="test.id"
      >
        <h3>{{ test.name }} ({{ test.points }}/{{ test.pointsMax }})</h3>
        <div
          v-for="task of test.Tasks"
          :key="task.id"
        >
          <p>{{ task.name }}: {{ task.points }} von {{ task.pointsMax }} Punkten</p>
        </div>
        <div v-if="!test.Tasks ||!test.Tasks.length">
          Keine Aufgaben gefunden.
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
