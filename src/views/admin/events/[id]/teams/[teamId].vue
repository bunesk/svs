
<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../../../../client/request';

const route = useRoute();
const team: Ref<any> = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const read = async () => {
  if (!route.params.teamId || isNaN(Number(route.params.teamId))) {
    (error.value as HTMLParagraphElement).textContent = 'Team-ID fehlt oder ist fehlerhaft.';
  }
  const response = await sendRequest('team', 'get-data', {id: route.params.teamId});
  const resData = await response.json();
  if (response.status === 200) {
    team.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await read();
});
</script>

<template>
  <div class="team-overview">
    <div v-if="team">
      <h1>{{ team.name }}</h1>
      <TeamMembers />
      <TeamEditForm :team="team" />
    </div>
    <p
      ref="error"
      class="invalid"
    ></p>
  </div>
</template>

<style lang="scss" scoped>
</style>
