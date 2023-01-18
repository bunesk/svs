<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../client/request';

const route = useRoute();
const teams: Ref<any> = ref(null);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const read = async () => {
  const response = await sendRequest('team', 'get-by-event', {eventId: route.params.id});
  const resData = await response.json();
  status.value = response.status === 200;
  if (status.value) {
    teams.value = resData.result;
    (message.value as HTMLParagraphElement).textContent = '';
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const refresh = async () => {
  await read();
};

const remove = async (id: string) => {
  if (confirm('Möchten Sie das Team löschen?')) {
    const response = await sendRequest('team', 'remove', {id: id});
    const resData = await response.json();
    status.value = response.status === 200;
    if (status.value) {
      teams.value = teams.value.filter((team: any) => team.id !== id);
    }
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await read();
});
</script>

<template>
  <div>
    <h2>Teams</h2>
    <TeamCreateForm />
    <div class="team-list-title">
      <h3>Liste</h3>
      <Button
        icon="pi pi-refresh"
        title="Teamliste aktualisieren"
        @click="refresh"
      />
    </div>
    <div
      class="team"
      v-for="team of teams"
      :key="team.id"
    >
      <RouterLink
        :to="`/admin/events/${route.params.id}/teams/${team.id}`"
        class="team-link"
      >
        <Button :label="team.name" />
      </RouterLink>
      <Button
        icon="pi pi-trash"
        class="p-button-danger"
        title="Team löschen"
        @click="remove(team.id)"
      />
    </div>
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </div>
</template>

<style lang="scss" scoped>
.team-list-title {
  display: flex;
  align-items: center;
  .p-button {
    margin-left: 0.75rem;
    vertical-align: center;
  }
}
.team {
  display: block;
  margin-top: 0.5rem;
  .team-link {
    margin-right: 0.5rem;
    .p-button {
      min-width: 10rem;
    }
  }
}
</style>
