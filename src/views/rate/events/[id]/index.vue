<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../../../client/request';

const route = useRoute();
const isMember: Ref<boolean | null> = ref(null);
const event: Ref<any> = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const password = ref('');

const checkIfMember = async () => {
  if (!route.params.id || isNaN(Number(route.params.id))) {
    (error.value as HTMLParagraphElement).textContent = 'Veranstaltungs-ID fehlt oder ist fehlerhaft.';
  }
  const response = await sendRequest('event', 'is-member', {id: route.params.id, includeAdmin: true});
  const resData = await response.json();
  if (response.status === 200) {
    isMember.value = resData.result.isMember;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const readEvent = async (setIsMember = false) => {
  if (setIsMember) {
    isMember.value = true;
  }
  const response = await sendRequest('event', 'get-data', {id: route.params.id});
  const resData = await response.json();
  if (response.status === 200) {
    event.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const join = async () => {
  const response = await sendRequest('event', 'join', {id: route.params.id, password: password.value});
  const resData = await response.json();
  if (response.status === 200) {
    (error.value as HTMLParagraphElement).textContent = '';
    isMember.value = true;
    await readEvent();
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await checkIfMember();
  if (isMember.value) {
    await readEvent();
  }
});
</script>

<template>
  <div class="event-view">
    <RouterLink :to="`/rate`">
      <Button
        class="navigation-button"
        icon="pi pi-angle-left"
        label="Zurück zur Veranstaltungsübersicht"
      ></Button>
    </RouterLink>
    <div v-if="isMember && event">
      <EventTableBasic :event="event" />
      <Tests />
      <Tests isSheet />
    </div>
    <div v-if="isMember === false">
      <JoinEventForm :readFunction="readEvent" />
    </div>
    <p
      ref="error"
      status="invalid"
    />
  </div>
</template>

<style lang="scss" scoped>
</style>
