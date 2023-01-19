<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../client/request';

const props = defineProps({
  isSheet: {type: Boolean, default: false},
});

const route = useRoute();
const tasks: Ref<any> = ref(null);
const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const read = async () => {
  const response = await sendRequest('test', 'get-tasks', {id: route.params.testId});
  const resData = await response.json();
  status.value = response.status === 200;
  if (status.value) {
    tasks.value = resData.result;
    (message.value as HTMLParagraphElement).textContent = '';
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const refresh = async () => {
  await read();
};

const remove = async (id: string) => {
  if (confirm('Aufgabe wirklich löschen?')) {
    const response = await sendRequest('test', 'remove-task', {taskId: id});
    const resData = await response.json();
    status.value = response.status === 200;
    if (status.value) {
      tasks.value = tasks.value.filter((task: any) => task.id !== id);
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
    <h2>Aufgaben</h2>
    <TaskCreateForm />
    <div class="task-list-title">
      <h3>Liste</h3>
      <Button
        icon="pi pi-refresh"
        title="Liste aktualisieren"
        @click="refresh"
      />
    </div>
    <div
      class="task"
      v-for="task of tasks"
      :key="task.id"
    >
      <span>{{ task.name }} - {{ task.pointsMax }}P</span>
      <Button
        icon="pi pi-trash"
        class="p-button-danger"
        title="Löschen"
        @click="remove(task.id)"
      />
    </div>
    <div v-if="!tasks || !tasks.length">
      Keine Aufgaben gefunden.
    </div>
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </div>
</template>

<style lang="scss" scoped>
.task-list-title {
  display: flex;
  align-items: center;

  .p-button {
    margin-left: 0.75rem;
    vertical-align: center;
  }
}
.task {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  .p-button {
    margin-left: 0.5rem;
  }
}
</style>
