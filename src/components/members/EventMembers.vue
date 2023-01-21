<script setup lang="ts">
import {Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../../client/request';

const route = useRoute();
const members = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const readFunction = async () => {
  return await sendRequest('event', 'get-members', {id: route.params.id});
};

const removeFunction = async (userId: string) => {
  return await sendRequest('event', 'remove-member', {eventId: route.params.id, userId: userId});
};
</script>

<template>
  <Members
    name="event"
    :readFunction="readFunction"
    :removeFunction="removeFunction"
  />
</template>

<style lang="scss" scoped>
</style>
