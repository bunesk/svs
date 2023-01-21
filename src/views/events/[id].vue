<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';

const route = useRoute();
const isMember: Ref<boolean | null> = ref(null);
const event: Ref<any> = ref(null);
const team: Ref<any> = ref(null);
const tests: Ref<any> = ref(null);
const sheets: Ref<any> = ref(null);
const points = ref(0);
const pointsMax = ref(0);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const password = ref('');

const checkIfMember = async () => {
  if (!route.params.id || isNaN(Number(route.params.id))) {
    (error.value as HTMLParagraphElement).textContent = 'Veranstaltungs-ID fehlt oder ist fehlerhaft.';
  }
  const response = await sendRequest('event', 'is-member', {id: route.params.id});
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

const readTeam = async () => {
  const response = await sendRequest('event', 'get-own-team', {id: route.params.id});
  const resData = await response.json();
  if (response.status === 200) {
    team.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const readTests = async () => {
  const response = await sendRequest('event', 'get-own-tests', {id: route.params.id});
  const resData = await response.json();
  if (response.status === 200) {
    tests.value = resData.result.tests;
    sheets.value = resData.result.sheets;
    points.value = resData.result.points;
    pointsMax.value = resData.result.pointsMax;
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
    await readTeam();
    await readTests();
  }
});
</script>

<template>
  <div class="event-view">
    <RouterLink :to="`/events`">
      <Button
        class="navigation-button"
        icon="pi pi-angle-left"
        label="Zurück zur Veranstaltungsübersicht"
      ></Button>
    </RouterLink>
    <div v-if="isMember && event">
      <EventTableBasic :event="event" />&nbsp;
      <div v-if="team && team.id">
        Du bist Mitglied in <span class="bold">{{team.name}}</span> bestehend aus:
        <ul>
          <li
            v-for="user of team.users"
            :key="user.id"
          >
            {{user.fullName}}
          </li>
        </ul>
      </div>
      <h2>Tests und Blätter ({{ points }}/{{pointsMax}})</h2>
      <EventTests :tests="tests" />
      <EventTests :tests="sheets" />
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
ul {
  margin: 0.25rem 0;
  li {
    margin-left: -1rem;
  }
}
</style>
