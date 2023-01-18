<script setup lang="ts">
import {useRoute} from 'vue-router';
import sendRequest from '../../../client/request';

const route = useRoute();

const readFunction = async () => {
  return await sendRequest('user', 'get-all');
};

const addMemberFunction = async (userId: string) => {
  const params = {
    eventId: route.params.id,
    userId: userId,
  };
  return await sendRequest('event', 'add-member', params);
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
