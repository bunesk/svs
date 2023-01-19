<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import sendRequest from '../../client/request';

defineProps({
  urlPrefix: {type: String, default: ''},
});

const events: Ref<any> = ref([]);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const readEvents = async () => {
  const response = await sendRequest('event', 'get-all-names');
  const resData = await response.json();
  if (response.status === 200) {
    events.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readEvents();
});
</script>

<template>
  <div class="event-list">
    <RouterLink
      v-for="event of events"
      :key="event.id"
      :to="`${urlPrefix}/events/${event.id}`"
    >
      <Button :label="event.name" />
    </RouterLink>
    <p
      ref="error"
      class="invalid"
    >
    </p>
  </div>
  <div v-if="!events.length">
    Keine Veranstaltungen gefunden.
  </div>
</template>

<style lang="scss" scoped>
.event-list {
  text-align: center;
  a {
    display: block;
    margin-bottom: 0.25rem;
    .p-button {
      width: 80%;
    }
  }
}
</style>
