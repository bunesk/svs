<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';
import {validate} from '../../components/forms/services/validation';

const route = useRoute();
const isMember: Ref<boolean | null> = ref(null);
const event: Ref<any> = ref(null);
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

const readEvent = async () => {
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
    <div v-if="isMember && event">
      <h1>{{event.name}}</h1>
      <div class="table">
        <span class="row-title">Anzahl Tests:</span>
        <span class="row-value">{{event.amountTests}}</span>
        <span class="row-title">Anzahl Blätter:</span>
        <span class="row-value">{{event.amountSheets}}</span>
        <span class="row-title">Maximale Punkte:</span>
        <span class="row-value">{{event.pointsMax}}</span>
        <span class="row-title">Punkte zum Bestehen:</span>
        <span class="row-value">{{event.pointsPassed}}</span>
      </div>
    </div>
    <div v-if="isMember === false">
      <h1>Veranstaltung beitreten</h1><br>
      <Password
        v-model="password"
        placeholder="Passwort"
        :feedback="false"
        toggleMask
        required
        @blur="validate"
        @keyup="validate"
      />&nbsp;
      <Button
        @click="join"
        label="Beitreten"
        :disabled="!password"
      />
    </div>
    <p
      ref="error"
      status="invalid"
    />
  </div>
</template>

<style lang="scss" scoped>
.table {
  display: grid;
  grid-template-columns: 10rem auto;
}
</style>
