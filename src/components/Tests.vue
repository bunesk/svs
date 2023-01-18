<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../client/request';

const route = useRoute();
const teams: Ref<any> = ref(null);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const read = async () => {
  const response = await sendRequest('test', 'get-by-event', {eventId: route.params.id});
  const resData = await response.json();
  status.value = response.status === 200;
  if (status.value) {
    teams.value = resData.result;
    (message.value as HTMLParagraphElement).textContent = '';
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const create = async () => {
  const response = await sendRequest('test', 'create', {EventId: route.params.id});
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  paragraph.textContent = resData.message;
};

const refresh = async () => {
  await read();
};

const remove = async (id: string) => {
  if (confirm('Möchten Sie den Test wirklich löschen?')) {
    const response = await sendRequest('test', 'remove', {id: id});
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
    <h2>Tests</h2>
    <Button
      @click="create"
      icon="pi pi-plus"
      label="Test erstellen"
      class="p-button-success"
    />
    <div class="team-list-title">
      <h3>Liste</h3>
      <Button
        icon="pi pi-refresh"
        title="Testliste aktualisieren"
        @click="refresh"
      />
    </div>
    <div
      class="tests"
      v-for="test of tests"
      :key="test.id"
    >
      <RouterLink
        :to="`/admin/events/${route.params.id}/tests/${test.id}`"
        class="test-link"
      >
        <Button :label="test.name" />
      </RouterLink>
      <Button
        icon="pi pi-trash"
        class="p-button-danger"
        title="Test löschen"
        @click="remove(test.id)"
      />
    </div>
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </div>
</template>

<style lang="scss" scoped>
.test-list-title {
  display: flex;
  align-items: center;
  .p-button {
    margin-left: 0.75rem;
    vertical-align: center;
  }
}
.test {
  display: block;
  margin-top: 0.5rem;
  .test-link {
    margin-right: 0.5rem;
    .p-button {
      min-width: 10rem;
    }
  }
}
</style>
