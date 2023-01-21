<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../../../../client/request';

const route = useRoute();
const tests: Ref<any> = ref(null);
const sheets: Ref<any> = ref(null);
const points = ref(0);
const pointsMax = ref(0);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const readTests = async () => {
  const response = await sendRequest('event', 'get-tests-by-user', {id: route.params.id, userId: route.params.userId});
  const resData = await response.json();
  if (response.status === 200) {
    tests.value = resData.result.tests;
    sheets.value = resData.result.sheets;
    points.value = resData.result.points;
    pointsMax.value = resData.result.pointsMax;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readTests();
});
</script>

<template>
  <div class="event-view">
    <RouterLink :to="`/admin/events/${route.params.id}`">
      <Button
        class="navigation-button"
        icon="pi pi-angle-left"
        label="Zurück zur Veranstaltungsübersicht"
      ></Button>
    </RouterLink>
    <div>
      <h2>Tests und Blätter ({{ points }}/{{pointsMax}})</h2>
      <EventTests :tests="tests" />
      <EventTests :tests="sheets" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
ul {
  margin: 0.25rem 0;
  li {
    margin-left: -1rem;
  }
}
</style>
