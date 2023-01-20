
<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../../../../client/request';

const route = useRoute();
const test: Ref<any> = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const read = async () => {
  if (!route.params.testId || isNaN(Number(route.params.testId))) {
    (error.value as HTMLParagraphElement).textContent = 'Test-ID fehlt oder ist fehlerhaft.';
  }
  const response = await sendRequest('test', 'get-data', {id: route.params.testId});
  const resData = await response.json();
  if (response.status === 200) {
    test.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await read();
});
</script>

<template>
  <div class="test-overview">
    <div v-if="test">
      <h1>{{ test.name }}</h1>
      <RouterLink :to="`/rate/events/${route.params.id}/${test.isSheet ? 'sheets' : 'tests'}/${route.params.testId}`">
        <Button label="Bewerten" />
      </RouterLink>
      <Tasks />
    </div>
    <p
      ref="error"
      class="invalid"
    ></p>
  </div>
</template>

<style lang="scss" scoped>
.p-button {
  margin-top: 0.5rem;
}
</style>
