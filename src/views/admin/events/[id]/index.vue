<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../../../client/request';

const route = useRoute();
const event: Ref<any> = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const readEvent = async () => {
  if (!route.params.id || isNaN(Number(route.params.id))) {
    (error.value as HTMLParagraphElement).textContent = 'Veranstaltungs-ID fehlt oder ist fehlerhaft.';
  }
  const response = await sendRequest('event', 'get-data', {id: route.params.id});
  const resData = await response.json();
  if (response.status === 200) {
    event.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readEvent();
});
</script>

<template>
  <div v-if="event">
    <h1>{{event.name}}</h1>
    <EventTable :event="event" />
    <RouterLink
      :to="`/admin/events/${event.id}/update`"
      class="edit-button"
    >
      <Button
        label="Bearbeiten"
        icon="pi pi-pencil"
      ></Button>
    </RouterLink>
    <EventMembers />
    <Teams />
    <ResetPasswordForm
      :id="event.id"
      item="event"
    />
  </div>
  <p
    ref="error"
    class="invalid"
  ></p>
</template>

<style lang="scss" scoped>
.edit-button .p-button {
  margin-top: 0.5rem;
}
</style>
