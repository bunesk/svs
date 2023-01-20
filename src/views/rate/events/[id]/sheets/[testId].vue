<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import sendRequest from '../../../../../client/request';
import {validate, formIsValid} from '../../../../../components/forms/services/validation';

const route = useRoute();
const router = useRouter();
const users: Ref<any> = ref(null);
const teams: Ref<any> = ref(null);
const tasks: Ref<any> = ref(null);
const status = ref(false);
const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const getTeams = async () => {
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

const getUsers = async () => {
  const response = await sendRequest('team', 'get-members', {id: route.params.id});
  const resData = await response.json();
  status.value = response.status === 200;
  if (status.value) {
    users.value = resData.result;
    (message.value as HTMLParagraphElement).textContent = '';
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const getTasks = async () => {
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

const submit = async () => {
  let params: any = {};
  for (const user of users.value) {
    params[user.id] = {};
    for (const task of tasks.value) {
      const input = document.getElementById(`rate_${user.id}_${task.id}`) as HTMLInputElement;
      params[user.id][task.id] = input.value || '0';
    }
  }
  const response = await sendRequest('test', 'rate-test', params);
  const resData = await response.json();
  status.value = response.status === 200;
  (message.value as HTMLParagraphElement).textContent = resData.message;
  if (status.value) {
    router.back();
  }
};

onBeforeMount(async () => {
  await getUsers();
  await getTasks();
});
</script>

<template>
  <div>
    <h1>Blatt bewerten</h1>
    <form
      ref="form"
      class="event-form"
      @input="isValid = formIsValid(form)"
    >
      <div class="p-fluid">
        <Accordion v-if="users && tasks">
          <AccordionTab
            :header="user.fullName"
            v-for="user of users"
            :key="user.id"
          >
            <div
              class="field"
              v-for="task of tasks"
              :key="task.id"
            >
              <label :for="`rate_${user.id}_${task.id}`">{{ task.name }}</label>
              <InputText
                :id="`rate_${user.id}_${task.id}`"
                type="number"
                min="0"
                :max="task.pointsMax"
                step="0.5"
                required
                @blur="validate"
                @keyup="validate"
              />
              <span>von {{ task.pointsMax }}P</span>
            </div>
            <div v-if="!tasks || !tasks.length">
              Keine Aufgaben gefunden.
            </div>
          </AccordionTab>
        </Accordion>
        <Button
          class="p-button-success submit-button"
          label="Bewertung speichern"
          :disabled="!tasks || !users || !isValid"
          @click="submit"
        />
        <Button
          class="p-button-danger submit-button"
          label="Abbrechen"
          @click="router.back()"
        />
        <div v-if="!users || !users.length">
          Keine Teilnehmer gefunden.
        </div>
      </div>
    </form>
    <p
      ref="message"
      :class="{'valid': status, 'invalid': !status}"
    ></p>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  padding-bottom: 0.5rem;
}
.field {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;

  label {
    width: 6rem;
  }
  input {
    max-width: 20rem;
  }
  span {
    margin-left: 0.5rem;
  }
}
.p-button-success {
  margin-top: 1rem;
}
.p-button-danger {
  margin-top: 0.5rem;
}
</style>
