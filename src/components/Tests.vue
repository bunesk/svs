<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../client/request';

const props = defineProps({
  isSheet: {type: Boolean, default: false},
});

const route = useRoute();
const tests: Ref<any> = ref(null);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);
const label = ref(props.isSheet ? 'Blatt' : 'Test');

const read = async () => {
  const params = {
    eventId: route.params.id,
    isSheet: props.isSheet,
  };
  const response = await sendRequest('test', 'get-by-event', params);
  const resData = await response.json();
  status.value = response.status === 200;
  if (status.value) {
    tests.value = resData.result;
    (message.value as HTMLParagraphElement).textContent = '';
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const create = async () => {
  const params = {
    EventId: route.params.id,
    isSheet: props.isSheet,
  };
  const response = await sendRequest('test', 'create', params);
  const resData = await response.json();
  const paragraph = message.value as HTMLParagraphElement;
  status.value = response.status === 200;
  paragraph.textContent = resData.message;
};

const refresh = async () => {
  await read();
};

const remove = async (id: string) => {
  if (confirm(`${label.value} wirklich löschen?`)) {
    const response = await sendRequest('test', 'remove', {id: id});
    const resData = await response.json();
    status.value = response.status === 200;
    if (status.value) {
      tests.value = tests.value.filter((team: any) => team.id !== id);
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
    <h2>{{ isSheet ? 'Blätter' : 'Tests' }}</h2>
    <Button
      @click="create"
      icon="pi pi-plus"
      :label="`${label} erstellen`"
      class="p-button-success"
    />
    <div class="test-list-title">
      <h3>Liste</h3>
      <Button
        icon="pi pi-refresh"
        title="Liste aktualisieren"
        @click="refresh"
      />
    </div>
    <div
      class="test"
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
        title="Löschen"
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
