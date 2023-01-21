<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import sendRequest from '../../../../../client/request';
import {validate, formIsValid} from '../../../../../components/forms/services/validation';
import authUser from '../../../../../client/user';

const route = useRoute();
const router = useRouter();
const teams: Ref<any> = ref(null);
const tasks: Ref<any> = ref(null);
const status = ref(false);
const form: Ref<HTMLFormElement | null> = ref(null);
const isValid = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);

const getTests = async () => {
  const response = await sendRequest('test', 'get-sheet-ratings', {id: route.params.testId});
  const resData = await response.json();
  status.value = response.status === 200;
  if (status.value) {
    teams.value = resData.result.teams;
    tasks.value = resData.result.tasks;
    console.log(resData.result);
    (message.value as HTMLParagraphElement).textContent = '';
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const submit = async () => {
  let params: any = {};
  for (const team of teams.value) {
    params[team.id] = {};
    for (const user of team.users) {
      params[team.id][user.id] = {};
      for (const task of tasks.value) {
        const input = document.getElementById(`rate_${team.id}_${user.id}_${task.id}`) as HTMLInputElement;
        params[team.id][user.id][task.id] = input.value || '0';
      }
    }
    const commentTeam = document.getElementById(`rate_${team.id}_commentTeam`) as HTMLInputElement;
    const commentAdmin = document.getElementById(`rate_${team.id}_commentAdmin`) as HTMLInputElement;
    params[team.id].commentTeam = commentTeam.value;
    params[team.id].commentAdmin = commentAdmin.value;
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
  await getTests();
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
        <Accordion>
          <AccordionTab
            :header="team.name"
            v-for="team of teams"
            :key="team.id"
          >
            <Accordion>
              <AccordionTab
                :header="user.fullName"
                v-for="user of team.users"
                :key="user.id"
              >
                <div
                  class="field"
                  v-for="task of tasks"
                  :key="task.id"
                >
                  <label :for="`rate_${team.id}_${user.id}_${task.id}`">{{ task.name }}</label>
                  <InputText
                    :id="`rate_${team.id}_${user.id}_${task.id}`"
                    type="number"
                    min="0"
                    :value="user.tasks[task.id]"
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
            <div v-if="!team.users || !team.users">
              Keine Aufgaben gefunden.
            </div>
            <div class="field">
              <label
                class="comment"
                :for="`rate_${team.id}_commentTeam`"
              >Teamkommentar</label>
              <InputText
                :id="`rate_${team.id}_commentTeam`"
                :value="team.commentTeam"
              />
            </div>
            <div
              v-if="authUser.isAdmin"
              class="field"
            >
              <label
                class="comment"
                :for="`rate_${team.id}_commentAdmin`"
              >Adminkommentar</label>
              <InputText
                :id="`rate_${team.id}_commentAdmin`"
                :value="team.commentAdmin"
              />
            </div>
          </AccordionTab>
        </Accordion>
        <Button
          class="p-button-success submit-button"
          label="Bewertung speichern"
          :disabled="!tasks || !teams || !isValid"
          @click="submit"
        />
        <Button
          class="p-button-danger submit-button"
          label="Abbrechen"
          @click="router.back()"
        />
        <div v-if="!teams || !teams.length">
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
    &.comment {
      width: 8.5rem;
    }
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
