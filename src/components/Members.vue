<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import {useRoute} from 'vue-router';
import sendRequest from '../client/request';
import {tableColumns} from '../client/user';

const route = useRoute();
const members = ref(null);
const error: Ref<HTMLParagraphElement | null> = ref(null);

defineProps({
  name: {type: String, required: true},
  readFunction: {type: Function, required: true},
  removeFunction: {type: Function, required: true},
});
</script>

<template>
  <div>
    <h2>Mitglieder</h2>
    <EventAddMemberForm v-if="name === 'event'" />
    <TeamAddMemberForm v-if="name === 'team'" />
    <h3>Liste</h3>
    <AbstractList
      name="event"
      plural="Mitglieder"
      removeMessage="Möchten Sie dieses Mitglied wirklich entfernen?"
      :readFunction="readFunction"
      :removeFunction="removeFunction"
      viewItemName="user"
      :globalFilterFields="['username','firstName','lastName', 'genderLabel', 'matriculationNumber', 'email', 'role']"
      showRefresh
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
