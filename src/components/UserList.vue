<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import sendRequest from '../client/request';

const error: Ref<HTMLParagraphElement | null> = ref(null);
const users: Ref<any> = ref([]);

const readUsers = async () => {
  const response = await sendRequest('user', 'get-all');
  const resData = await response.json();
  if (response.status === 200) {
    users.value = resData.result;
  } else {
    (error.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readUsers();
});
</script>

<template>
  <DataTable :value="users">
    <Column
      field="username"
      header="Benutzername"
    ></Column>
    <Column
      field="firstName"
      header="Vorname"
    ></Column>
    <Column
      field="lastName"
      header="Nachname"
    ></Column>
    <Column
      field="genderLabel"
      header="Geschlecht"
    ></Column>
    <Column
      field="matriculationNumber"
      header="Matrikelnummer"
    ></Column>
    <Column
      field="email"
      header="Matrikelnummer"
    ></Column>
    <Column
      field="role"
      header="Rolle"
    ></Column>
  </DataTable>
  <p
    ref="error"
    class="invalid"
  >
  </p>
</template>

<style lang="scss" scoped>
</style>
