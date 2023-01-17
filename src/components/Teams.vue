<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../client/request';

const route = useRoute();
const teams: Ref<any> = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const tableColumns = {
  number: 'Nummer',
  block: 'Block',
};

const readTeams = async () => {
  const response = await sendRequest('team', 'get-by-event', {eventId: route.params.id});
  const resData = await response.json();
  if (response.status === 200) {
    teams.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readTeams();
});

const removeFunction = async (userId: string) => {
  return await sendRequest('event', 'remove-member', {eventId: route.params.id, userId: userId});
};
</script>

<template>
  <div>
    <h2>Teams</h2>
    <RouterLink :to="`/events/${route.params.id}/teams/create`">
      <Button
        label="Neues Team erstellen"
        icon="pi pi-plus"
        class="p-button-success"
      ></Button>
    </RouterLink>
    <RouterLink
      v-for="team of teams"
      :key="team.id"
      :to="`/events/${route.params.id}/teams/${team.id}`"
    >
      <Button :label="team.name" />
    </RouterLink>
    <p
      ref="error"
      class="invalid"
    ></p>
  </div>
</template>

<style lang="scss" scoped>
</style>
