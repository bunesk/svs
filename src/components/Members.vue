<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../client/request';
import {tableColumns} from '../client/user';

const route = useRoute();
const members = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

const readFunction = async () => {
  return await sendRequest('event', 'get-members', {id: route.params.id});
};

const removeFunction = async (userId: string) => {
  console.log('remove function');
  return await sendRequest('event', 'remove-member', {eventId: route.params.id, userId: userId});
};
</script>

<template>
  <div>
    <h2>Mitglieder</h2>
    <AddMember />
    <h3>Liste</h3>
    <AbstractList
      name="event"
      plural="Mitglieder"
      removeMessage="Möchten Sie dieses Mitglied wirklich entfernen?"
      hideCreate
      :readFunction="readFunction"
      :removeFunction="removeFunction"
      viewItemName="user"
      :globalFilterFields="['username','firstName','lastName', 'genderLabel', 'matriculationNumber', 'email', 'role']"
    >
      <Column
        v-for="column of Object.keys(tableColumns)"
        :key="column"
        :field="column"
        :header="tableColumns[column]"
        :sortable="true"
      ></Column>
    </AbstractList>
  </div>
  <p
    ref="error"
    class="invalid"
  ></p>
</template>

<style lang="scss" scoped>
</style>
