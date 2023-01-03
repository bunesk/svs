<script setup lang="ts">
import {onBeforeMount, Ref, ref} from 'vue';
import sendRequest from '../client/request';
import {FilterMatchMode} from 'primevue/api';

const status = ref(false);
const message: Ref<HTMLParagraphElement | null> = ref(null);
const users: Ref<any> = ref([]);
const selectedUser: Ref<any> = ref(null);
const filters = ref({global: {value: null, matchMode: FilterMatchMode.CONTAINS}});
const loading = ref(true);

const readUsers = async () => {
  const response = await sendRequest('user', 'get-all');
  const resData = await response.json();
  if (response.status === 200) {
    users.value = resData.result;
    loading.value = false;
  } else {
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

const deleteUser = async () => {
  if (!selectedUser.value) {
    return;
  }
  if (confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
    const response = await sendRequest('user', 'remove', {id: selectedUser.value.id});
    const resData = await response.json();
    if (response.status === 200) {
      users.value = users.value.filter((user: any) => user.id !== selectedUser.value.id);
      selectedUser.value = null;
      status.value = true;
    } else {
      status.value = false;
    }
    (message.value as HTMLParagraphElement).textContent = resData.message;
  }
};

onBeforeMount(async () => {
  await readUsers();
});
</script>

<template>
  <p
    ref="message"
    :class="{'valid': status, 'invalid': !status}"
  ></p>
  <DataTable
    :value="users"
    :paginator="true"
    :rows="10"
    dataKey="id"
    :rowHover="true"
    v-model:selection="selectedUser"
    v-model:filters="filters"
    filterDisplay="menu"
    selectionMode="single"
    :loading="loading"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    :rowsPerPageOptions="[10,25,50]"
    currentPageReportTemplate="Zeige {first} bis {last} von {totalRecords} Einträgen"
    :globalFilterFields="['username','firstName','lastName', 'genderLabel', 'matriculationNumber', 'email', 'role']"
    responsiveLayout="scroll"
  >
    <template #header>
      <div class="flex-container">
        <div class="flex-resize">
          <RouterLink
            to="/admin/users/create"
            class="create-button"
          >
            <Button
              label="Neu"
              icon="pi pi-plus"
              class="p-button-success"
            ></Button>
          </RouterLink>
          <Button
            label="Löschen"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="deleteUser"
            :disabled="!selectedUser"
          />
        </div>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText
            v-model="filters['global'].value"
            placeholder="Suchen..."
          />
        </span>
      </div>
    </template>
    <template #empty>
      Keine Benutzer gefunden.
    </template>
    <template #loading>
      Benutzer werden geladen...
    </template>
    <Column
      field="username"
      header="Benutzername"
      :sortable="true"
    ></Column>
    <Column
      field="firstName"
      header="Vorname"
      :sortable="true"
    ></Column>
    <Column
      field="lastName"
      header="Nachname"
      :sortable="true"
    ></Column>
    <Column
      field="genderLabel"
      header="Geschlecht"
      :sortable="true"
    ></Column>
    <Column
      field="matriculationNumber"
      header="Matrikelnummer"
      :sortable="true"
    ></Column>
    <Column
      field="email"
      header="E-Mail"
      :sortable="true"
    ></Column>
    <Column
      field="role"
      header="Rolle"
      :sortable="true"
    ></Column>
  </DataTable>
</template>

<style lang="scss" scoped>
.create-button {
  margin-right: 0.5rem;
}
</style>
