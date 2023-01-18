<script setup lang="ts">
import {useRoute} from 'vue-router';
import sendRequest from '../../../client/request';

const route = useRoute();

const readFunction = async () => {
  return await sendRequest('event', 'get-members', {id: route.params.id});
};

const addMemberFunction = async (userId: string) => {
  const params = {
    teamId: route.params.teamId,
    userId: userId,
  };
  return await sendRequest('team', 'add-member', params);
};
</script>

<template>
  <AddMemberForm
    :readFunction="readFunction"
    :addMemberFunction="addMemberFunction"
  />
</template>

<style lang="scss" scoped>
</style>
