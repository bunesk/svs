<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import sendRequest from '../client/request';

const events: Ref<Array<any>> = ref([]);

const getEvents = async () => {
  const response = await sendRequest('event', 'get-all');
  const resData = await response.json();
  if (response.status === 200) {
    events.value = resData.result;
  }
};

onBeforeMount(() => {
  getEvents();
});
</script>

<template>
  <div class="list">
    <RouterLink
      v-for="event of events"
      :key="event.id"
      :to="`/event/${event.id}`"
      class="list-element"
    >
      {{event.name}}
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.list {
  padding: 0.5rem 0;

  .list-element {
    display: block;
    margin: 0.25rem 0;
  }
}
</style>
